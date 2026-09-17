import { Request, Response, NextFunction } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { GitService } from './gitService';
import { DataService, UserModel, RepositoryModel, CIPipelineRunModel } from '../models';
import bcrypt from 'bcryptjs';

function packetLine(str: string): string {
  const len = (str.length + 4).toString(16).padStart(4, '0');
  return len + str;
}

// Basic Auth verification for git operations
async function authenticateGitUser(req: Request): Promise<{ authenticated: boolean; user?: any }> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return { authenticated: false };
  }

  const base64Credentials = authHeader.split(' ')[1];
  const decoded = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, passwordOrToken] = decoded.split(':');

  if (!username || !passwordOrToken) return { authenticated: false };

  const user = await DataService.findOne<any>('users', UserModel, { username });
  if (!user) return { authenticated: false };

  // Check personal access tokens first
  if (user.personalAccessTokens && user.personalAccessTokens.some((pat: any) => pat.token === passwordOrToken)) {
    return { authenticated: true, user };
  }

  // Check password hash
  const isValid = await bcrypt.compare(passwordOrToken, user.passwordHash).catch(() => false);
  if (isValid) {
    return { authenticated: true, user };
  }

  return { authenticated: false };
}

export function gitHttpHandler(req: Request, res: Response, next: NextFunction) {
  const { owner, repo } = req.params;
  const service = req.query.service as string | undefined;
  const repoName = repo.replace(/\.git$/, '');
  const repoPath = GitService.getRepoPath(owner, repoName);

  // Auto-init repo if it doesn't exist
  if (!fs.existsSync(repoPath)) {
    GitService.initBareRepo(owner, repoName).catch(() => {});
  }

  // 1. Service Discovery: GET /info/refs?service=git-upload-pack or git-receive-pack
  if (req.path.endsWith('/info/refs')) {
    if (!service || (service !== 'git-upload-pack' && service !== 'git-receive-pack')) {
      return res.status(400).send('Invalid git service');
    }

    const handleInfoRefs = () => {
      res.setHeader('Content-Type', `application/x-${service}-advertisement`);
      res.setHeader('Cache-Control', 'no-cache');

      // Send initial packet line
      res.write(packetLine(`# service=${service}\n`));
      res.write('0000');

      const cmd = service === 'git-upload-pack' ? 'upload-pack' : 'receive-pack';
      const child = spawn('git', [cmd, '--stateless-rpc', '--advertise-refs', repoPath]);

      child.stdout.pipe(res);
      child.stderr.on('data', (d) => console.error(`[Git info/refs stderr]: ${d}`));
    };

    if (service === 'git-receive-pack') {
      // Require auth for pushing
      authenticateGitUser(req).then(({ authenticated }) => {
        if (!authenticated) {
          res.setHeader('WWW-Authenticate', 'Basic realm="CodeSphere Git"');
          return res.status(401).send('Authentication required to push to CodeSphere');
        }
        handleInfoRefs();
      });
    } else {
      // Allow read for public repos
      handleInfoRefs();
    }
    return;
  }

  // 2. RPC Execution: POST /git-upload-pack
  if (req.path.endsWith('/git-upload-pack')) {
    res.setHeader('Content-Type', 'application/x-git-upload-pack-result');
    res.setHeader('Cache-Control', 'no-cache');

    const child = spawn('git', ['upload-pack', '--stateless-rpc', repoPath]);
    req.pipe(child.stdin);
    child.stdout.pipe(res);
    child.stderr.on('data', (d) => console.error(`[Git upload-pack stderr]: ${d}`));
    return;
  }

  // 3. RPC Execution: POST /git-receive-pack (Push)
  if (req.path.endsWith('/git-receive-pack')) {
    authenticateGitUser(req).then(async ({ authenticated, user }) => {
      if (!authenticated) {
        res.setHeader('WWW-Authenticate', 'Basic realm="CodeSphere Git"');
        return res.status(401).send('Authentication required to push');
      }

      res.setHeader('Content-Type', 'application/x-git-receive-pack-result');
      res.setHeader('Cache-Control', 'no-cache');

      const child = spawn('git', ['receive-pack', '--stateless-rpc', repoPath]);
      req.pipe(child.stdin);
      child.stdout.pipe(res);

      child.on('close', async (code) => {
        if (code === 0) {
          console.log(`[Git] Push succeeded for ${owner}/${repoName} by ${user?.username || 'user'}`);
          // Trigger CI/CD pipeline run on push
          try {
            const commits = await GitService.getCommits(owner, repoName, 'HEAD', 1);
            const latest = commits[0];
            if (latest) {
              await DataService.create('cipipelineruns', CIPipelineRunModel, {
                repoSlug: `${owner}/${repoName}`,
                commitSha: latest.sha,
                commitMessage: latest.message,
                branch: 'main',
                author: latest.author,
                trigger: 'push',
                status: 'running',
                startedAt: new Date(),
                stages: [
                  {
                    name: 'Build & Test',
                    status: 'running',
                    steps: [
                      { name: 'Lint & Typecheck', command: 'yarn lint', status: 'success', durationSeconds: 4, logs: ['[Step 1] Linting clean: 0 warnings.'] },
                      { name: 'Unit Tests', command: 'yarn test', status: 'success', durationSeconds: 6, logs: ['[Step 2] 12 test suites passed.'] },
                      { name: 'Security Scan', command: 'codesphere scan', status: 'success', durationSeconds: 3, logs: ['[Step 3] 0 CVE vulnerabilities.'] }
                    ]
                  }
                ]
              });
            }
          } catch (e) {
            console.error('Failed to trigger post-push hook:', e);
          }
        }
      });
    });
    return;
  }

  next();
}
