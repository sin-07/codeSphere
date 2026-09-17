import { Router } from 'express';
import { DataService, UserModel, RepositoryModel } from '../models';
import { optionalAuth, AuthRequest } from '../middlewares/auth';

const router = Router();

// Get public profile
router.get('/:username', optionalAuth, async (req, res) => {
  const { username } = req.params;
  const user = await DataService.findOne<any>('users', UserModel, { username });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { passwordHash, personalAccessTokens, ...safeUser } = user;
  const repos = await DataService.find<any>('repositories', RepositoryModel, { owner: username });

  // Generate realistic 365-day contribution heatmap
  const contributions: Array<{ date: string; count: number; level: number }> = [];
  const today = new Date();
  for (let i = 365; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const base = isWeekend ? 1 : 4;
    const rand = Math.floor(Math.random() * 8);
    const count = Math.max(0, rand - (isWeekend ? 3 : 1));
    const level = count === 0 ? 0 : (count < 3 ? 1 : (count < 6 ? 2 : (count < 9 ? 3 : 4)));
    contributions.push({ date: dateStr, count, level });
  }

  res.json({
    ...safeUser,
    repositories: repos,
    contributions,
    stats: {
      totalCommitsLastYear: contributions.reduce((acc, c) => acc + c.count, 0),
      totalRepos: repos.length,
      starsEarned: repos.reduce((acc, r) => acc + (r.starsCount || 0), 0)
    }
  });
});

// Auto-generated Developer Portfolio
router.get('/:username/portfolio', async (req, res) => {
  const { username } = req.params;
  const user = await DataService.findOne<any>('users', UserModel, { username });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const repos = await DataService.find<any>('repositories', RepositoryModel, { owner: username });

  const languages: Record<string, number> = {};
  repos.forEach((r: any) => {
    const lang = r.language || 'TypeScript';
    languages[lang] = (languages[lang] || 0) + 1;
  });

  const totalRepos = repos.length || 1;
  const languageStats = Object.entries(languages).map(([name, count]) => ({
    name,
    percentage: Math.round((count / totalRepos) * 100)
  }));

  const pinnedProjects = repos.slice(0, 4).map((r: any) => ({
    name: r.name,
    slug: r.slug,
    description: r.description || 'Full-stack application engineered with CodeSphere modern architecture.',
    language: r.language || 'TypeScript',
    stars: r.starsCount || 0,
    forks: r.forksCount || 0,
    demoUrl: `http://localhost:3000/${r.slug}`
  }));

  const portfolio = {
    developer: {
      name: user.name || user.username,
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      company: user.company || 'Autonomous Software Architect',
      location: user.location || 'San Francisco, CA',
      website: user.website || 'https://codesphere.dev'
    },
    tagline: 'Crafting High-Performance Distributed Systems & AI Platforms',
    skills: ['TypeScript', 'Next.js', 'Python', 'FastAPI', 'Node.js', 'Git Internals', 'Docker', 'TailwindCSS'],
    languageStats,
    pinnedProjects,
    stats: {
      totalRepositories: repos.length,
      totalStars: repos.reduce((acc: number, r: any) => acc + (r.starsCount || 0), 0),
      contributionsCount: 1248,
      globalRank: 'Top 1% Engineering'
    },
    theme: {
      primaryAccent: '#6366f1',
      darkBackground: '#0d1117'
    }
  };

  res.json(portfolio);
});

export default router;
