import { Router } from 'express';
import { DataService, PullRequestModel, CommentModel, AuditLogModel, NotificationModel } from '../models';
import { GitService } from '../git/gitService';
import { requireAuth, optionalAuth, AuthRequest } from '../middlewares/auth';

const router = Router();

// List PRs
router.get('/:owner/:repo/pulls', optionalAuth, async (req, res) => {
  const { owner, repo } = req.params;
  const { status = 'open' } = req.query;
  const repoSlug = `${owner}/${repo}`;

  const filter: any = { repoSlug };
  if (status !== 'all') filter.status = status;

  const prs = await DataService.find<any>('pullrequests', PullRequestModel, filter);
  res.json(prs);
});

// Create PR
router.post('/:owner/:repo/pulls', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { owner, repo } = req.params;
    const { title, description, baseBranch = 'main', headBranch } = req.body;
    const repoSlug = `${owner}/${repo}`;

    if (!title || !headBranch) {
      return res.status(400).json({ error: 'Title and head branch are required' });
    }

    const count = await DataService.count('pullrequests', PullRequestModel, { repoSlug });
    const number = count + 1;

    // Calculate diff stats
    const diffData = await GitService.getDiff(owner, repo, baseBranch, headBranch);

    const pr = await DataService.create<any>('pullrequests', PullRequestModel, {
      repoSlug,
      number,
      title,
      description: description || '',
      author: req.user?.username || 'user',
      baseBranch,
      headBranch,
      status: 'open',
      diffStats: {
        additions: diffData.additions,
        deletions: diffData.deletions,
        filesChanged: diffData.filesChanged.length
      },
      reviewers: []
    });

    res.status(201).json(pr);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get PR detail
router.get('/:owner/:repo/pulls/:number', optionalAuth, async (req, res) => {
  const { owner, repo, number } = req.params;
  const repoSlug = `${owner}/${repo}`;

  const pr = await DataService.findOne<any>('pullrequests', PullRequestModel, {
    repoSlug,
    number: parseInt(number, 10)
  });

  if (!pr) return res.status(404).json({ error: 'Pull Request not found' });
  res.json(pr);
});

// Get PR Diff / Files Changed
router.get('/:owner/:repo/pulls/:number/files', async (req, res) => {
  const { owner, repo, number } = req.params;
  const repoSlug = `${owner}/${repo}`;

  const pr = await DataService.findOne<any>('pullrequests', PullRequestModel, {
    repoSlug,
    number: parseInt(number, 10)
  });

  if (!pr) return res.status(404).json({ error: 'Pull Request not found' });

  const diffData = await GitService.getDiff(owner, repo, pr.baseBranch, pr.headBranch);
  res.json(diffData);
});

// Add Review (Approve / Request Changes)
router.post('/:owner/:repo/pulls/:number/reviews', requireAuth, async (req: AuthRequest, res) => {
  const { owner, repo, number } = req.params;
  const { status = 'approved', body } = req.body;
  const repoSlug = `${owner}/${repo}`;
  const username = req.user?.username!;

  const pr = await DataService.findOne<any>('pullrequests', PullRequestModel, {
    repoSlug,
    number: parseInt(number, 10)
  });
  if (!pr) return res.status(404).json({ error: 'Pull Request not found' });

  const reviewers = pr.reviewers || [];
  const existingIdx = reviewers.findIndex((r: any) => r.username === username);
  if (existingIdx !== -1) {
    reviewers[existingIdx].status = status;
    reviewers[existingIdx].updatedAt = new Date();
  } else {
    reviewers.push({ username, status, updatedAt: new Date() });
  }

  await DataService.updateOne('pullrequests', PullRequestModel, { repoSlug, number: parseInt(number, 10) }, { reviewers });

  // Create notification for PR author
  if (pr.author !== username) {
    await DataService.create('notifications', NotificationModel, {
      recipient: pr.author,
      actor: username,
      type: 'pr_review',
      title: `PR Review: #${number} ${pr.title}`,
      message: `${username} submitted a review (${status}) on PR #${number}`,
      link: `/${repoSlug}/pull/${number}`,
      read: false
    });
  }

  res.json({ reviewers });
});

// Merge PR
router.post('/:owner/:repo/pulls/:number/merge', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { owner, repo, number } = req.params;
    const { strategy = 'merge', commitMessage } = req.body;
    const repoSlug = `${owner}/${repo}`;

    const pr = await DataService.findOne<any>('pullrequests', PullRequestModel, {
      repoSlug,
      number: parseInt(number, 10)
    });
    if (!pr) return res.status(404).json({ error: 'Pull Request not found' });
    if (pr.status !== 'open') return res.status(400).json({ error: `PR is already ${pr.status}` });

    const msg = commitMessage || `Merge pull request #${number} from ${pr.headBranch}`;
    const mergeSha = await GitService.mergeBranches(
      owner,
      repo,
      pr.baseBranch,
      pr.headBranch,
      strategy,
      msg,
      req.user?.username,
      req.user?.email
    );

    await DataService.updateOne('pullrequests', PullRequestModel, { repoSlug, number: parseInt(number, 10) }, {
      status: 'merged',
      mergeStrategy: strategy,
      mergedBy: req.user?.username,
      mergedAt: new Date()
    });

    res.json({ success: true, mergeSha, status: 'merged' });
  } catch (err: any) {
    res.status(500).json({ error: `Merge failed: ${err.message}` });
  }
});

// Comments & Line Review Comments
router.get('/:owner/:repo/pulls/:number/comments', async (req, res) => {
  const { owner, repo, number } = req.params;
  const repoSlug = `${owner}/${repo}`;

  const comments = await DataService.find<any>('comments', CommentModel, {
    repoSlug,
    entityType: 'pr',
    entityNumberOrSha: number
  });
  res.json(comments);
});

router.post('/:owner/:repo/pulls/:number/comments', requireAuth, async (req: AuthRequest, res) => {
  const { owner, repo, number } = req.params;
  const { body, diffPath, diffLine, diffSide = 'RIGHT' } = req.body;
  const repoSlug = `${owner}/${repo}`;

  if (!body) return res.status(400).json({ error: 'Comment body required' });

  const comment = await DataService.create<any>('comments', CommentModel, {
    repoSlug,
    entityType: 'pr',
    entityNumberOrSha: number,
    author: req.user?.username || 'user',
    body,
    diffPath,
    diffLine,
    diffSide
  });

  res.status(201).json(comment);
});

export default router;
