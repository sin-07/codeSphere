import { Router } from 'express';
import { DataService, RepositoryModel, UserModel, AuditLogModel } from '../models';
import { GitService } from '../git/gitService';
import { requireAuth, optionalAuth, AuthRequest } from '../middlewares/auth';

const router = Router();

// List user/org or public repositories
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  const { owner, search, language } = req.query;
  const filter: any = {};
  if (owner) filter.owner = owner;
  if (language) filter.language = language;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const repos = await DataService.find<any>('repositories', RepositoryModel, filter);
  res.json(repos);
});

// Create repository
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, description, isPrivate, defaultBranch = 'main', language = 'TypeScript', topics = [] } = req.body;
    if (!name) return res.status(400).json({ error: 'Repository name is required' });

    const owner = req.user?.username || 'user';
    const slug = `${owner}/${name}`;

    const existing = await DataService.findOne<any>('repositories', RepositoryModel, { slug });
    if (existing) {
      return res.status(409).json({ error: 'Repository with this name already exists' });
    }

    const storagePath = await GitService.initBareRepo(owner, name, defaultBranch);

    // Create initial README and commit
    const readmeContent = `# ${name}\n\n${description || 'Welcome to CodeSphere project.'}\n\n## Getting Started\n\`\`\`bash\ngit clone http://localhost:4000/git/${slug}.git\n\`\`\`\n`;
    await GitService.commitFiles(
      owner,
      name,
      defaultBranch,
      [{ path: 'README.md', content: readmeContent }],
      'Initial commit: Add README.md',
      req.user?.username,
      req.user?.email
    );

    const repo = await DataService.create<any>('repositories', RepositoryModel, {
      owner,
      name,
      slug,
      description: description || '',
      isPrivate: !!isPrivate,
      defaultBranch,
      storagePath,
      starsCount: 0,
      forksCount: 0,
      topics,
      language,
      archived: false,
      protectedBranches: [defaultBranch]
    });

    await DataService.create('auditlogs', AuditLogModel, {
      actor: owner,
      action: 'REPO_CREATE',
      targetType: 'Repository',
      targetId: repo._id,
      details: { slug }
    });

    res.status(201).json(repo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get repository details
router.get('/:owner/:repo', optionalAuth, async (req: AuthRequest, res) => {
  const { owner, repo } = req.params;
  const slug = `${owner}/${repo.replace(/\.git$/, '')}`;
  const repoDoc = await DataService.findOne<any>('repositories', RepositoryModel, { slug });

  if (!repoDoc) return res.status(404).json({ error: 'Repository not found' });
  res.json(repoDoc);
});

// Star/Unstar repository
router.post('/:owner/:repo/star', requireAuth, async (req: AuthRequest, res) => {
  const { owner, repo } = req.params;
  const slug = `${owner}/${repo}`;
  const username = req.user?.username!;

  const user = await DataService.findOne<any>('users', UserModel, { username });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const isStarred = user.starredRepos?.includes(slug);
  const updatedStars = isStarred
    ? user.starredRepos.filter((s: string) => s !== slug)
    : [...(user.starredRepos || []), slug];

  await DataService.updateOne('users', UserModel, { username }, { starredRepos: updatedStars });
  const repoDoc = await DataService.findOne<any>('repositories', RepositoryModel, { slug });
  const newCount = Math.max(0, (repoDoc?.starsCount || 0) + (isStarred ? -1 : 1));
  await DataService.updateOne('repositories', RepositoryModel, { slug }, { starsCount: newCount });

  res.json({ starred: !isStarred, starsCount: newCount });
});

// Branches
router.get('/:owner/:repo/branches', async (req, res) => {
  const { owner, repo } = req.params;
  const branches = await GitService.getBranches(owner, repo);
  res.json(branches);
});

router.post('/:owner/:repo/branches', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { owner, repo } = req.params;
    const { branchName, fromBranch = 'main' } = req.body;
    await GitService.createBranch(owner, repo, branchName, fromBranch);
    res.status(201).json({ branch: branchName, from: fromBranch });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:owner/:repo/branches/:branch', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { owner, repo, branch } = req.params;
    await GitService.deleteBranch(owner, repo, branch);
    res.json({ success: true, deleted: branch });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Commits
router.get('/:owner/:repo/commits', async (req, res) => {
  const { owner, repo } = req.params;
  const { ref = 'HEAD', limit = 30, skip = 0 } = req.query;
  const commits = await GitService.getCommits(owner, repo, ref as string, Number(limit), Number(skip));
  res.json(commits);
});

router.get('/:owner/:repo/commits/:sha', async (req, res) => {
  try {
    const { owner, repo, sha } = req.params;
    const commit = await GitService.getCommit(owner, repo, sha);
    res.json(commit);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// Tree (File Browser)
router.get('/:owner/:repo/tree', async (req, res) => {
  const { owner, repo } = req.params;
  const { ref = 'HEAD', path: subPath = '' } = req.query;
  const tree = await GitService.getTree(owner, repo, ref as string, subPath as string);
  res.json(tree);
});

// Blob (File content)
router.get('/:owner/:repo/blob', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { ref = 'HEAD', path: filePath } = req.query;
    if (!filePath) return res.status(400).json({ error: 'File path required' });
    const blob = await GitService.getBlob(owner, repo, ref as string, filePath as string);
    res.json(blob);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// Commit Files directly from Web IDE
router.post('/:owner/:repo/commit', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { owner, repo } = req.params;
    const { branch = 'main', files, message } = req.body;
    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'Files array required' });
    }
    if (!message) return res.status(400).json({ error: 'Commit message required' });

    const sha = await GitService.commitFiles(
      owner,
      repo,
      branch,
      files,
      message,
      req.user?.username,
      req.user?.email
    );

    res.status(201).json({ sha, branch, message });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Compare & Diff
router.get('/:owner/:repo/compare/:base...:head', async (req, res) => {
  try {
    const { owner, repo, base, head } = req.params;
    const diffData = await GitService.getDiff(owner, repo, base, head);
    res.json(diffData);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
