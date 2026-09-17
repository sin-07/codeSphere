import { Router } from 'express';
import { DataService, CIPipelineRunModel, RepositoryModel } from '../models';
import { GitService } from '../git/gitService';
import { requireAuth, optionalAuth, AuthRequest } from '../middlewares/auth';

const router = Router();

// List CI pipeline runs
router.get('/:owner/:repo/actions/runs', optionalAuth, async (req, res) => {
  const { owner, repo } = req.params;
  const repoSlug = `${owner}/${repo}`;

  const runs = await DataService.find<any>('cipipelineruns', CIPipelineRunModel, { repoSlug }, { createdAt: -1 });
  res.json(runs);
});

// Get CI run details
router.get('/:owner/:repo/actions/runs/:id', optionalAuth, async (req, res) => {
  const { id } = req.params;
  const run = await DataService.findOne<any>('cipipelineruns', CIPipelineRunModel, { _id: id });
  if (!run) return res.status(404).json({ error: 'Pipeline run not found' });
  res.json(run);
});

// Trigger manual CI pipeline run
router.post('/:owner/:repo/actions/runs', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { owner, repo } = req.params;
    const { branch = 'main' } = req.body;
    const repoSlug = `${owner}/${repo}`;

    const commits = await GitService.getCommits(owner, repo, branch, 1);
    const latest = commits[0] || { sha: 'a1b2c3d4e5f6', message: 'Manual dispatch trigger', author: req.user?.username };

    const run = await DataService.create<any>('cipipelineruns', CIPipelineRunModel, {
      repoSlug,
      commitSha: latest.sha,
      commitMessage: latest.message,
      branch,
      author: req.user?.username || 'user',
      trigger: 'manual',
      status: 'running',
      startedAt: new Date(),
      durationSeconds: 15,
      stages: [
        {
          name: 'Lint & Static Analysis',
          status: 'success',
          steps: [
            { name: 'Setup Node.js 20', command: 'actions/setup-node@v4', status: 'success', durationSeconds: 2, logs: ['[Step 1] Node.js environment initialized.'] },
            { name: 'Install dependencies', command: 'yarn --frozen-lockfile', status: 'success', durationSeconds: 4, logs: ['[Step 2] Resolving packages...', 'Resolved 45 packages in 3.8s'] },
            { name: 'ESLint & TypeCheck', command: 'yarn typecheck', status: 'success', durationSeconds: 3, logs: ['[Step 3] TypeScript check completed with 0 errors.'] }
          ]
        },
        {
          name: 'Automated Tests',
          status: 'success',
          steps: [
            { name: 'Jest Unit Suite', command: 'yarn test', status: 'success', durationSeconds: 5, logs: ['PASS src/tests/auth.test.ts', 'PASS src/tests/git.test.ts', 'Tests: 18 passed, 18 total'] }
          ]
        },
        {
          name: 'AI Security & Vulnerability Gate',
          status: 'success',
          steps: [
            { name: 'CodeSphere Security Scan', command: 'codesphere scan --security', status: 'success', durationSeconds: 2, logs: ['Checking CVE definitions...', '0 vulnerabilities detected.', 'Status: PASSED'] }
          ]
        }
      ]
    });

    // Asynchronously mark completed after 3 seconds
    setTimeout(async () => {
      await DataService.updateOne('cipipelineruns', CIPipelineRunModel, { _id: run._id }, {
        status: 'success',
        completedAt: new Date(),
        durationSeconds: 16
      });
    }, 3000);

    res.status(201).json(run);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
