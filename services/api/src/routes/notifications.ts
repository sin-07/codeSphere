import { Router } from 'express';
import { DataService, NotificationModel } from '../models';
import { requireAuth, AuthRequest } from '../middlewares/auth';

const router = Router();

// Get user notifications
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const recipient = req.user?.username!;
  const notifications = await DataService.find<any>('notifications', NotificationModel, { recipient }, { createdAt: -1 });
  const unreadCount = notifications.filter(n => !n.read).length;
  res.json({ notifications, unreadCount });
});

// Mark single as read
router.patch('/:id/read', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  await DataService.updateOne('notifications', NotificationModel, { _id: id }, { read: true });
  res.json({ success: true });
});

// Mark all as read
router.post('/read-all', requireAuth, async (req: AuthRequest, res) => {
  const recipient = req.user?.username!;
  const notes = await DataService.find<any>('notifications', NotificationModel, { recipient });
  for (const n of notes) {
    await DataService.updateOne('notifications', NotificationModel, { _id: n._id }, { read: true });
  }
  res.json({ success: true, count: notes.length });
});

export default router;
