import { Router } from 'express';
import { DataService, IssueModel, CommentModel, NotificationModel } from '../models';
import { requireAuth, optionalAuth, AuthRequest } from '../middlewares/auth';

const router = Router();

// List issues
router.get('/:owner/:repo/issues', optionalAuth, async (req, res) => {
  const { owner, repo } = req.params;
  const { status = 'open', label } = req.query;
  const repoSlug = `${owner}/${repo}`;

  const filter: any = { repoSlug };
  if (status !== 'all') filter.status = status;
  if (label) filter.labels = label;

  const issues = await DataService.find<any>('issues', IssueModel, filter);
  res.json(issues);
});

// Create issue
router.post('/:owner/:repo/issues', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { owner, repo } = req.params;
    const { title, description, labels = [], assignees = [], milestone } = req.body;
    const repoSlug = `${owner}/${repo}`;

    if (!title) return res.status(400).json({ error: 'Issue title is required' });

    const count = await DataService.count('issues', IssueModel, { repoSlug });
    const number = count + 1;

    const issue = await DataService.create<any>('issues', IssueModel, {
      repoSlug,
      number,
      title,
      description: description || '',
      author: req.user?.username || 'user',
      status: 'open',
      labels,
      assignees,
      milestone,
      commentsCount: 0
    });

    res.status(201).json(issue);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get issue
router.get('/:owner/:repo/issues/:number', optionalAuth, async (req, res) => {
  const { owner, repo, number } = req.params;
  const repoSlug = `${owner}/${repo}`;

  const issue = await DataService.findOne<any>('issues', IssueModel, {
    repoSlug,
    number: parseInt(number, 10)
  });

  if (!issue) return res.status(404).json({ error: 'Issue not found' });
  res.json(issue);
});

// Update issue status / labels
router.patch('/:owner/:repo/issues/:number', requireAuth, async (req: AuthRequest, res) => {
  const { owner, repo, number } = req.params;
  const { status, labels, assignees } = req.body;
  const repoSlug = `${owner}/${repo}`;

  const updateData: any = {};
  if (status) {
    updateData.status = status;
    if (status === 'closed') updateData.closedAt = new Date();
  }
  if (labels) updateData.labels = labels;
  if (assignees) updateData.assignees = assignees;

  await DataService.updateOne('issues', IssueModel, {
    repoSlug,
    number: parseInt(number, 10)
  }, updateData);

  res.json({ success: true, updated: updateData });
});

// Comments on issue
router.get('/:owner/:repo/issues/:number/comments', async (req, res) => {
  const { owner, repo, number } = req.params;
  const repoSlug = `${owner}/${repo}`;

  const comments = await DataService.find<any>('comments', CommentModel, {
    repoSlug,
    entityType: 'issue',
    entityNumberOrSha: number
  });
  res.json(comments);
});

router.post('/:owner/:repo/issues/:number/comments', requireAuth, async (req: AuthRequest, res) => {
  const { owner, repo, number } = req.params;
  const { body } = req.body;
  const repoSlug = `${owner}/${repo}`;

  if (!body) return res.status(400).json({ error: 'Comment body required' });

  const comment = await DataService.create<any>('comments', CommentModel, {
    repoSlug,
    entityType: 'issue',
    entityNumberOrSha: number,
    author: req.user?.username || 'user',
    body
  });

  // Increment comments count
  const issue = await DataService.findOne<any>('issues', IssueModel, { repoSlug, number: parseInt(number, 10) });
  if (issue) {
    await DataService.updateOne('issues', IssueModel, { repoSlug, number: parseInt(number, 10) }, {
      commentsCount: (issue.commentsCount || 0) + 1
    });
  }

  res.status(201).json(comment);
});

export default router;
