import { execFile, exec, spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { promisify } from 'util';
import { CONFIG } from '../config';

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

export interface GitCommitInfo {
  sha: string;
  author: string;
  email: string;
  date: string;
  message: string;
  parents?: string[];
}

export interface GitTreeEntry {
  mode: string;
  type: 'blob' | 'tree' | 'commit';
  sha: string;
  size?: number;
  name: string;
  path: string;
}

export class GitService {
  static getRepoPath(owner: string, name: string): string {
    const cleanRepo = name.endsWith('.git') ? name : `${name}.git`;
    return path.join(CONFIG.STORAGE_REPOS_PATH, owner, cleanRepo);
  }

  static async initBareRepo(owner: string, name: string, defaultBranch: string = 'main'): Promise<string> {
    const repoPath = this.getRepoPath(owner, name);
    if (!fs.existsSync(repoPath)) {
      fs.mkdirSync(repoPath, { recursive: true });
      await execAsync(`git init --bare --initial-branch=${defaultBranch}`, { cwd: repoPath });
      // Set receive.denyNonFastForwards false if needed, and git daemon export ok
      await execAsync(`git config http.receivepack true`, { cwd: repoPath });
    }
    return repoPath;
  }

  static async getBranches(owner: string, name: string): Promise<string[]> {
    const repoPath = this.getRepoPath(owner, name);
    if (!fs.existsSync(repoPath)) return [];

    try {
      const { stdout } = await execAsync(`git for-each-ref --format="%(refname:short)" refs/heads/`, { cwd: repoPath });
      const branches = stdout.split('\n').map(b => b.trim()).filter(Boolean);
      return branches;
    } catch {
      return [];
    }
  }

  static async createBranch(owner: string, name: string, branchName: string, startPoint: string = 'main'): Promise<boolean> {
    const repoPath = this.getRepoPath(owner, name);
    try {
      await execAsync(`git branch ${branchName} ${startPoint}`, { cwd: repoPath });
      return true;
    } catch (err: any) {
      throw new Error(`Failed to create branch ${branchName}: ${err.message}`);
    }
  }

  static async deleteBranch(owner: string, name: string, branchName: string): Promise<boolean> {
    const repoPath = this.getRepoPath(owner, name);
    try {
      await execAsync(`git branch -D ${branchName}`, { cwd: repoPath });
      return true;
    } catch (err: any) {
      throw new Error(`Failed to delete branch ${branchName}: ${err.message}`);
    }
  }

  static async getCommits(owner: string, name: string, revision: string = 'HEAD', limit: number = 30, skip: number = 0): Promise<GitCommitInfo[]> {
    const repoPath = this.getRepoPath(owner, name);
    if (!fs.existsSync(repoPath)) return [];

    try {
      const format = '%H%x00%an%x00%ae%x00%at%x00%s';
      const { stdout } = await execAsync(
        `git log -n ${limit} --skip=${skip} --pretty=format:"${format}" ${revision}`,
        { cwd: repoPath }
      );

      if (!stdout.trim()) return [];

      return stdout.split('\n').filter(Boolean).map(line => {
        const [sha, author, email, at, message] = line.split('\x00');
        const dateIso = at ? new Date(parseInt(at, 10) * 1000).toISOString() : new Date().toISOString();
        return {
          sha: sha || '',
          author: author || 'Unknown',
          email: email || '',
          date: dateIso,
          message: message || ''
        };
      });
    } catch {
      return [];
    }
  }

  static async getCommit(owner: string, name: string, sha: string): Promise<any> {
    const repoPath = this.getRepoPath(owner, name);
    try {
      const format = '%H%x00%an%x00%ae%x00%at%x00%B%x00%P';
      const { stdout: infoOut } = await execAsync(`git show -s --pretty=format:"${format}" ${sha}`, { cwd: repoPath });
      const [commitSha, author, email, at, body, parents] = infoOut.split('\x00');

      const { stdout: diffOut } = await execAsync(`git show --stat --patch ${sha}`, { cwd: repoPath });

      return {
        sha: commitSha,
        author,
        email,
        date: at ? new Date(parseInt(at, 10) * 1000).toISOString() : new Date().toISOString(),
        message: body,
        parents: parents ? parents.trim().split(' ') : [],
        diff: diffOut
      };
    } catch (err: any) {
      throw new Error(`Commit not found: ${err.message}`);
    }
  }

  static async getTree(owner: string, name: string, revision: string = 'HEAD', subPath: string = ''): Promise<GitTreeEntry[]> {
    const repoPath = this.getRepoPath(owner, name);
    if (!fs.existsSync(repoPath)) return [];

    try {
      const target = subPath ? `${revision}:${subPath}` : revision;
      const { stdout } = await execAsync(`git ls-tree -l ${target}`, { cwd: repoPath });
      if (!stdout.trim()) return [];

      return stdout.split('\n').filter(Boolean).map(line => {
        // Output format: <mode> <type> <object> <size>    <file>
        const match = line.match(/^(\d+)\s+(blob|tree|commit)\s+([0-9a-fA-F]+)\s+(\d+|-)\s+(.*)$/);
        if (match) {
          const [, mode, type, sha, sizeStr, fname] = match;
          const fullPath = subPath ? `${subPath}/${fname}` : fname;
          return {
            mode,
            type: type as 'blob' | 'tree' | 'commit',
            sha,
            size: sizeStr === '-' ? undefined : parseInt(sizeStr, 10),
            name: fname,
            path: fullPath
          };
        }
        return null;
      }).filter(Boolean) as GitTreeEntry[];
    } catch {
      return [];
    }
  }

  static async getBlob(owner: string, name: string, revision: string, filePath: string): Promise<{ content: string; isBinary: boolean; size: number }> {
    const repoPath = this.getRepoPath(owner, name);
    try {
      const { stdout } = await execAsync(`git show "${revision}:${filePath}"`, {
        cwd: repoPath,
        maxBuffer: 10 * 1024 * 1024
      });
      return {
        content: stdout,
        isBinary: false,
        size: Buffer.byteLength(stdout, 'utf-8')
      };
    } catch (err: any) {
      throw new Error(`Failed to get file: ${err.message}`);
    }
  }

  static async getAllRepoFiles(owner: string, name: string, revision: string = 'HEAD'): Promise<Array<{ path: string; content: string }>> {
    const repoPath = this.getRepoPath(owner, name);
    if (!fs.existsSync(repoPath)) return [];

    try {
      const { stdout } = await execAsync(`git ls-tree -r --name-only ${revision}`, { cwd: repoPath });
      const files = stdout.split('\n').map(f => f.trim()).filter(Boolean);
      const results: Array<{ path: string; content: string }> = [];

      for (const file of files.slice(0, 50)) { // limit for speed & safety
        try {
          const blob = await this.getBlob(owner, name, revision, file);
          results.push({ path: file, content: blob.content });
        } catch {
          // ignore binary / unreadable
        }
      }
      return results;
    } catch {
      return [];
    }
  }

  static async getDiff(owner: string, name: string, base: string, head: string): Promise<{ diff: string; filesChanged: any[]; additions: number; deletions: number }> {
    const repoPath = this.getRepoPath(owner, name);
    try {
      const { stdout: diffOut } = await execAsync(`git diff ${base}...${head}`, {
        cwd: repoPath,
        maxBuffer: 10 * 1024 * 1024
      });

      const { stdout: numstatOut } = await execAsync(`git diff --numstat ${base}...${head}`, {
        cwd: repoPath
      });

      let additions = 0;
      let deletions = 0;
      const filesChanged = numstatOut.split('\n').filter(Boolean).map(line => {
        const [addStr, delStr, file] = line.split('\t');
        const add = addStr === '-' ? 0 : parseInt(addStr, 10) || 0;
        const del = delStr === '-' ? 0 : parseInt(delStr, 10) || 0;
        additions += add;
        deletions += del;
        return {
          filename: file,
          additions: add,
          deletions: del
        };
      });

      return {
        diff: diffOut,
        filesChanged,
        additions,
        deletions
      };
    } catch (err: any) {
      return { diff: '', filesChanged: [], additions: 0, deletions: 0 };
    }
  }

  static async commitFiles(
    owner: string,
    name: string,
    branch: string,
    files: Array<{ path: string; content: string; delete?: boolean }>,
    commitMessage: string,
    authorName: string = 'CodeSphere Dev',
    authorEmail: string = 'dev@codesphere.local'
  ): Promise<string> {
    const repoPath = this.getRepoPath(owner, name);
    await this.initBareRepo(owner, name, branch);

    const tempDir = path.join(os.tmpdir(), `codesphere-commit-${Date.now()}-${Math.random().toString(36).substring(7)}`);
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      const branches = await this.getBranches(owner, name);
      const branchExists = branches.includes(branch);

      if (branchExists) {
        // Clone existing branch with depth 1
        await execAsync(`git clone --depth 1 --branch "${branch}" "${repoPath}" "${tempDir}"`);
      } else {
        // Initialize fresh repository for new branch
        await execAsync(`git init`, { cwd: tempDir });
        await execAsync(`git branch -M "${branch}"`, { cwd: tempDir });
        await execAsync(`git remote add origin "${repoPath}"`, { cwd: tempDir });
      }

      // Write files
      for (const f of files) {
        const fullFilePath = path.join(tempDir, f.path);
        if (f.delete) {
          if (fs.existsSync(fullFilePath)) fs.unlinkSync(fullFilePath);
        } else {
          fs.mkdirSync(path.dirname(fullFilePath), { recursive: true });
          fs.writeFileSync(fullFilePath, f.content, 'utf-8');
        }
      }

      // Git add and commit
      await execAsync(`git add -A`, { cwd: tempDir });
      await execAsync(
        `git -c user.name="${authorName}" -c user.email="${authorEmail}" commit -m "${commitMessage.replace(/"/g, '\\"')}"`,
        { cwd: tempDir }
      );

      // Push back to bare repo
      await execAsync(`git push origin "${branch}"`, { cwd: tempDir });

      const { stdout: revOut } = await execAsync(`git rev-parse HEAD`, { cwd: tempDir });
      return revOut.trim();
    } finally {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }
  }

  static async mergeBranches(
    owner: string,
    name: string,
    base: string,
    head: string,
    strategy: 'merge' | 'squash' | 'rebase' = 'merge',
    commitMessage: string = 'Merge branch',
    authorName: string = 'CodeSphere Bot',
    authorEmail: string = 'bot@codesphere.local'
  ): Promise<string> {
    const repoPath = this.getRepoPath(owner, name);
    const tempDir = path.join(os.tmpdir(), `codesphere-merge-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      await execAsync(`git clone --branch "${base}" "${repoPath}" "${tempDir}"`);
      await execAsync(`git fetch origin "${head}:${head}"`, { cwd: tempDir });

      if (strategy === 'squash') {
        await execAsync(`git merge --squash "${head}"`, { cwd: tempDir });
        await execAsync(
          `git -c user.name="${authorName}" -c user.email="${authorEmail}" commit -m "${commitMessage.replace(/"/g, '\\"')}"`,
          { cwd: tempDir }
        );
      } else {
        await execAsync(
          `git -c user.name="${authorName}" -c user.email="${authorEmail}" merge "${head}" -m "${commitMessage.replace(/"/g, '\\"')}"`,
          { cwd: tempDir }
        );
      }

      await execAsync(`git push origin "${base}"`, { cwd: tempDir });
      const { stdout: revOut } = await execAsync(`git rev-parse HEAD`, { cwd: tempDir });
      return revOut.trim();
    } finally {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }
  }
}
