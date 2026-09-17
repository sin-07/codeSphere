import { Router } from 'express';
import axios from 'axios';
import { CONFIG } from '../config';
import { GitService } from '../git/gitService';
import { DataService, PullRequestModel, IssueModel } from '../models';
import { optionalAuth, AuthRequest } from '../middlewares/auth';

const router = Router();

// Helper to safely call AI Engine
async function callAIEngine(endpoint: string, payload: any) {
  try {
    const res = await axios.post(`${CONFIG.AI_ENGINE_URL}${endpoint}`, payload, {
      timeout: 15000
    });
    return res.data;
  } catch (err: any) {
    console.error(`AI Engine call failed on ${endpoint}:`, err.message);
    throw new Error(`AI Engine service error: ${err.message}`);
  }
}

// 1. Semantic Code Search in Repo
router.post('/brain/:owner/:repo/search', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { query, branch = 'HEAD' } = req.body;
    if (!query) return res.status(400).json({ error: 'Search query is required' });

    // Fetch repository files from bare repo
    const files = await GitService.getAllRepoFiles(owner, repo, branch);
    const result = await callAIEngine('/api/brain/direct-search', { files, query });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Explain Code or File
router.post('/brain/explain', async (req, res) => {
  try {
    const { code, path: filePath, query } = req.body;
    if (!code) return res.status(400).json({ error: 'Code content required' });
    const result = await callAIEngine('/api/brain/explain', { code, path: filePath, query });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. AST Parsing & Symbol Extraction
router.post('/brain/ast', async (req, res) => {
  try {
    const { code, filename } = req.body;
    const result = await callAIEngine('/api/brain/ast', { code, filename });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. AI Debugger
router.post('/debug/analyze', async (req, res) => {
  try {
    const { errorLog, codeContext, filePath } = req.body;
    if (!errorLog) return res.status(400).json({ error: 'errorLog is required' });
    const result = await callAIEngine('/api/debug/analyze', { errorLog, codeContext, filePath });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. PR Risk & Blast Radius Analyzer
router.get('/risk/:owner/:repo/pulls/:number', async (req, res) => {
  try {
    const { owner, repo, number } = req.params;
    const repoSlug = `${owner}/${repo}`;
    const pr = await DataService.findOne<any>('pullrequests', PullRequestModel, { repoSlug, number: parseInt(number, 10) });
    if (!pr) return res.status(404).json({ error: 'Pull Request not found' });

    const diffData = await GitService.getDiff(owner, repo, pr.baseBranch, pr.headBranch);
    const result = await callAIEngine('/api/risk/analyze-pr', {
      filesChanged: diffData.filesChanged,
      diffText: diffData.diff
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Interactive Architecture Map
router.get('/arch/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { branch = 'HEAD' } = req.query;
    const files = await GitService.getAllRepoFiles(owner, repo, branch as string);
    const result = await callAIEngine('/api/arch/graph', { files });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Security & Secrets Scanner
router.get('/security/:owner/:repo/scan', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { branch = 'HEAD' } = req.query;
    const files = await GitService.getAllRepoFiles(owner, repo, branch as string);
    const result = await callAIEngine('/api/security/scan', { files });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Project Health & Maintainability Metrics
router.get('/health/:owner/:repo/metrics', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const repoSlug = `${owner}/${repo}`;
    const commits = await GitService.getCommits(owner, repo, 'HEAD', 50);
    const openIssues = await DataService.count('issues', IssueModel, { repoSlug, status: 'open' });
    const closedIssues = await DataService.count('issues', IssueModel, { repoSlug, status: 'closed' });

    const result = await callAIEngine('/api/health/metrics', {
      commits,
      openIssues,
      closedIssues
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 9. What Changed While I Was Away
router.get('/health/:owner/:repo/away-summary', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { window = '7d' } = req.query;
    const repoSlug = `${owner}/${repo}`;

    const recentCommits = await GitService.getCommits(owner, repo, 'HEAD', 20);
    const recentPrs = await DataService.find<any>('pullrequests', PullRequestModel, { repoSlug });
    const recentIssues = await DataService.find<any>('issues', IssueModel, { repoSlug });

    const result = await callAIEngine('/api/health/away-summary', {
      recentCommits,
      recentPrs,
      recentIssues,
      timeWindow: window as string
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Cost Tracker
router.get('/cost/:owner/:repo/estimate', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    // Estimate based on commits and files
    const commits = await GitService.getCommits(owner, repo, 'HEAD', 30);
    const ciMinutes = commits.length * 4;
    const storageBytes = 15 * 1024 * 1024; // ~15MB repo
    const aiQueries = 32;

    const result = await callAIEngine('/api/cost/estimate', {
      ciMinutes,
      storageBytes,
      aiQueries
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
