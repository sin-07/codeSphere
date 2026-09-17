import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config';
import { DataService, UserModel, OrganizationModel } from '../models';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'] as string;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as any;
      req.user = decoded;
      return next();
    } catch {
      return res.status(401).json({ error: 'Invalid or expired authentication token' });
    }
  }

  if (apiKey) {
    const user = await DataService.findOne<any>('users', UserModel, {
      'personalAccessTokens.token': apiKey
    });
    if (user) {
      req.user = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      };
      return next();
    }
  }

  return res.status(401).json({ error: 'Authentication required' });
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as any;
      req.user = decoded;
    } catch {}
  }
  next();
}

// RBAC Middleware
export function requireOrgRole(requiredRoles: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { orgSlug } = req.params;
    if (!orgSlug) return next();

    const org = await DataService.findOne<any>('organizations', OrganizationModel, { slug: orgSlug });
    if (!org) return res.status(404).json({ error: 'Organization not found' });

    const member = org.members.find((m: any) => m.username === req.user?.username);
    if (!member || !requiredRoles.includes(member.role)) {
      return res.status(403).json({ error: 'Insufficient organization privileges' });
    }

    next();
  };
}
