import { Router } from 'express';
import { DataService, OrganizationModel, AuditLogModel } from '../models';
import { requireAuth, optionalAuth, AuthRequest } from '../middlewares/auth';

const router = Router();

// List organizations
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  const orgs = await DataService.find<any>('organizations', OrganizationModel, {});
  res.json(orgs);
});

// Create organization
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, slug, description, billingPlan = 'Enterprise Open Source' } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'Name and slug required' });

    const existing = await DataService.findOne<any>('organizations', OrganizationModel, { slug });
    if (existing) return res.status(409).json({ error: 'Organization slug already taken' });

    const org = await DataService.create<any>('organizations', OrganizationModel, {
      name,
      slug,
      description: description || '',
      billingPlan,
      members: [
        {
          userId: req.user?.id || '1',
          username: req.user?.username || 'user',
          role: 'owner'
        }
      ]
    });

    await DataService.create('auditlogs', AuditLogModel, {
      actor: req.user?.username || 'user',
      action: 'ORG_CREATE',
      targetType: 'Organization',
      targetId: org._id,
      details: { slug }
    });

    res.status(201).json(org);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get organization details
router.get('/:slug', optionalAuth, async (req, res) => {
  const { slug } = req.params;
  const org = await DataService.findOne<any>('organizations', OrganizationModel, { slug });
  if (!org) return res.status(404).json({ error: 'Organization not found' });
  res.json(org);
});

// Add or update member role in organization
router.post('/:slug/members', requireAuth, async (req: AuthRequest, res) => {
  const { slug } = req.params;
  const { username, role = 'contributor' } = req.body;

  const org = await DataService.findOne<any>('organizations', OrganizationModel, { slug });
  if (!org) return res.status(404).json({ error: 'Organization not found' });

  const members = org.members || [];
  const existingIdx = members.findIndex((m: any) => m.username === username);
  if (existingIdx !== -1) {
    members[existingIdx].role = role;
  } else {
    members.push({ userId: 'u_' + Date.now(), username, role });
  }

  await DataService.updateOne('organizations', OrganizationModel, { slug }, { members });
  res.json({ success: true, members });
});

export default router;
