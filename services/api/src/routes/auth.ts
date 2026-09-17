import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { CONFIG } from '../config';
import { DataService, UserModel, AuditLogModel } from '../models';
import { requireAuth, AuthRequest } from '../middlewares/auth';

const router = Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email and password are required' });
    }

    const existing = await DataService.findOne<any>('users', UserModel, {
      $or: [{ username }, { email }]
    });
    if (existing) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await DataService.create<any>('users', UserModel, {
      username,
      email,
      name: name || username,
      passwordHash,
      role: 'user',
      personalAccessTokens: [{ name: 'Default PAT', token: `pat_${uuidv4().replace(/-/g, '')}`, createdAt: new Date() }],
      starredRepos: []
    });

    const token = jwt.sign({ id: user._id, username: user.username, email: user.email, role: user.role }, CONFIG.JWT_SECRET, {
      expiresIn: CONFIG.JWT_EXPIRES_IN as any
    });

    await DataService.create('auditlogs', AuditLogModel, {
      actor: username,
      action: 'USER_REGISTER',
      targetType: 'User',
      targetId: user._id,
      details: { email }
    });

    res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, name: user.name, avatarUrl: user.avatarUrl, bio: user.bio } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await DataService.findOne<any>('users', UserModel, {
      $or: [{ username }, { email: username }]
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id, username: user.username, email: user.email, role: user.role }, CONFIG.JWT_SECRET, {
      expiresIn: CONFIG.JWT_EXPIRES_IN as any
    });

    res.json({ token, user: { id: user._id, username: user.username, email: user.email, name: user.name, avatarUrl: user.avatarUrl, bio: user.bio, role: user.role } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Current User profile
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await DataService.findOne<any>('users', UserModel, { username: req.user?.username });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { passwordHash, ...safeUser } = user;
  res.json(safeUser);
});

// Create Personal Access Token
router.post('/pats', requireAuth, async (req: AuthRequest, res) => {
  const { name } = req.body;
  const token = `cs_${uuidv4().replace(/-/g, '')}`;
  const user = await DataService.findOne<any>('users', UserModel, { username: req.user?.username });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const pats = user.personalAccessTokens || [];
  pats.push({ name: name || 'CodeSphere PAT', token, createdAt: new Date() });
  await DataService.updateOne('users', UserModel, { username: req.user?.username }, { personalAccessTokens: pats });

  res.status(201).json({ token, name, createdAt: new Date() });
});

export default router;
