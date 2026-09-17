import { Router } from 'express';
import { DataService, ReleaseModel } from '../models';
import { requireAuth, optionalAuth, AuthRequest } from '../middlewares/auth';

const router = Router();

// List releases
router.get('/:owner/:repo/releases', optionalAuth, async (req, res) => {
  const { owner, repo } = req.params;
  const repoSlug = `${owner}/${repo}`;
  const releases = await DataService.find<any>('releases', ReleaseModel, { repoSlug }, { publishedAt: -1 });
  res.json(releases);
});

// Create release
router.post('/:owner/:repo/releases', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { owner, repo } = req.params;
    const { tagName, name, body, targetBranch = 'main', isDraft = false, isPrerelease = false } = req.body;
    const repoSlug = `${owner}/${repo}`;

    if (!tagName || !name) {
      return res.status(400).json({ error: 'Tag name and release title are required' });
    }

    const release = await DataService.create<any>('releases', ReleaseModel, {
      repoSlug,
      tagName,
      name,
      body: body || '',
      targetBranch,
      isDraft: !!isDraft,
      isPrerelease: !!isPrerelease,
      author: req.user?.username || 'user',
      assets: [
        { name: `${repo}-${tagName}.tar.gz`, size: 1048576, downloadUrl: `/api/repos/${repoSlug}/releases/download/${tagName}.tar.gz` },
        { name: `${repo}-${tagName}.zip`, size: 1258291, downloadUrl: `/api/repos/${repoSlug}/releases/download/${tagName}.zip` }
      ],
      publishedAt: new Date()
    });

    res.status(201).json(release);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
