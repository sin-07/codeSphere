import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('codesphere_token') || 'mock_dev_token';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Repositories
export const fetchRepos = async (params?: { owner?: string; search?: string }) => {
  const { data } = await api.get('/repos', { params });
  return data;
};

export const fetchRepoDetails = async (owner: string, repo: string) => {
  const { data } = await api.get(`/repos/${owner}/${repo}`);
  return data;
};

export const createRepository = async (repoData: any) => {
  const { data } = await api.post('/repos', repoData);
  return data;
};

export const toggleStarRepo = async (owner: string, repo: string) => {
  const { data } = await api.post(`/repos/${owner}/${repo}/star`);
  return data;
};

export const fetchBranches = async (owner: string, repo: string) => {
  const { data } = await api.get(`/repos/${owner}/${repo}/branches`);
  return data;
};

export const createBranch = async (owner: string, repo: string, branchName: string, fromBranch = 'main') => {
  const { data } = await api.post(`/repos/${owner}/${repo}/branches`, { branchName, fromBranch });
  return data;
};

export const fetchCommits = async (owner: string, repo: string, ref = 'HEAD') => {
  const { data } = await api.get(`/repos/${owner}/${repo}/commits`, { params: { ref } });
  return data;
};

export const fetchCommitDetail = async (owner: string, repo: string, sha: string) => {
  const { data } = await api.get(`/repos/${owner}/${repo}/commits/${sha}`);
  return data;
};

export const fetchTree = async (owner: string, repo: string, ref = 'HEAD', path = '') => {
  const { data } = await api.get(`/repos/${owner}/${repo}/tree`, { params: { ref, path } });
  return data;
};

export const fetchBlob = async (owner: string, repo: string, ref = 'HEAD', path: string) => {
  const { data } = await api.get(`/repos/${owner}/${repo}/blob`, { params: { ref, path } });
  return data;
};

export const commitFilesWebIDE = async (owner: string, repo: string, payload: { branch: string; files: Array<{ path: string; content: string }>; message: string }) => {
  const { data } = await api.post(`/repos/${owner}/${repo}/commit`, payload);
  return data;
};

export const fetchCompareDiff = async (owner: string, repo: string, base: string, head: string) => {
  const { data } = await api.get(`/repos/${owner}/${repo}/compare/${base}...${head}`);
  return data;
};

// Pull Requests
export const fetchPullRequests = async (owner: string, repo: string, status = 'open') => {
  const { data } = await api.get(`/pulls/${owner}/${repo}/pulls`, { params: { status } });
  return data;
};

export const fetchPullRequest = async (owner: string, repo: string, number: number) => {
  const { data } = await api.get(`/pulls/${owner}/${repo}/pulls/${number}`);
  return data;
};

export const createPullRequest = async (owner: string, repo: string, payload: any) => {
  const { data } = await api.post(`/pulls/${owner}/${repo}/pulls`, payload);
  return data;
};

export const mergePullRequest = async (owner: string, repo: string, number: number, strategy = 'merge') => {
  const { data } = await api.post(`/pulls/${owner}/${repo}/pulls/${number}/merge`, { strategy });
  return data;
};

export const reviewPullRequest = async (owner: string, repo: string, number: number, status: string, body?: string) => {
  const { data } = await api.post(`/pulls/${owner}/${repo}/pulls/${number}/reviews`, { status, body });
  return data;
};

export const fetchPRComments = async (owner: string, repo: string, number: number) => {
  const { data } = await api.get(`/pulls/${owner}/${repo}/pulls/${number}/comments`);
  return data;
};

export const addPRComment = async (owner: string, repo: string, number: number, payload: any) => {
  const { data } = await api.post(`/pulls/${owner}/${repo}/pulls/${number}/comments`, payload);
  return data;
};

// Issues
export const fetchIssues = async (owner: string, repo: string, status = 'open') => {
  const { data } = await api.get(`/issues/${owner}/${repo}/issues`, { params: { status } });
  return data;
};

export const fetchIssue = async (owner: string, repo: string, number: number) => {
  const { data } = await api.get(`/issues/${owner}/${repo}/issues/${number}`);
  return data;
};

export const createIssue = async (owner: string, repo: string, payload: any) => {
  const { data } = await api.post(`/issues/${owner}/${repo}/issues`, payload);
  return data;
};

export const updateIssue = async (owner: string, repo: string, number: number, payload: any) => {
  const { data } = await api.patch(`/issues/${owner}/${repo}/issues/${number}`, payload);
  return data;
};

export const fetchIssueComments = async (owner: string, repo: string, number: number) => {
  const { data } = await api.get(`/issues/${owner}/${repo}/issues/${number}/comments`);
  return data;
};

export const addIssueComment = async (owner: string, repo: string, number: number, body: string) => {
  const { data } = await api.post(`/issues/${owner}/${repo}/issues/${number}/comments`, { body });
  return data;
};

// Releases
export const fetchReleases = async (owner: string, repo: string) => {
  const { data } = await api.get(`/releases/${owner}/${repo}/releases`);
  return data;
};

export const createRelease = async (owner: string, repo: string, payload: any) => {
  const { data } = await api.post(`/releases/${owner}/${repo}/releases`, payload);
  return data;
};

// CI/CD Actions
export const fetchCIPipelineRuns = async (owner: string, repo: string) => {
  const { data } = await api.get(`/ci/${owner}/${repo}/actions/runs`);
  return data;
};

export const fetchCIPipelineRun = async (owner: string, repo: string, id: string) => {
  const { data } = await api.get(`/ci/${owner}/${repo}/actions/runs/${id}`);
  return data;
};

export const triggerCIPipelineRun = async (owner: string, repo: string, branch = 'main') => {
  const { data } = await api.post(`/ci/${owner}/${repo}/actions/runs`, { branch });
  return data;
};

// AI Engine
export const aiSemanticSearch = async (owner: string, repo: string, query: string, branch = 'HEAD') => {
  const { data } = await api.post(`/ai/brain/${owner}/${repo}/search`, { query, branch });
  return data;
};

export const aiExplainCode = async (code: string, path?: string, query?: string) => {
  const { data } = await api.post('/ai/brain/explain', { code, path, query });
  return data;
};

export const aiDebugError = async (errorLog: string, codeContext?: string, filePath?: string) => {
  const { data } = await api.post('/ai/debug/analyze', { errorLog, codeContext, filePath });
  return data;
};

export const aiPRRisk = async (owner: string, repo: string, number: number) => {
  const { data } = await api.get(`/ai/risk/${owner}/${repo}/pulls/${number}`);
  return data;
};

export const aiArchGraph = async (owner: string, repo: string, branch = 'HEAD') => {
  const { data } = await api.get(`/ai/arch/${owner}/${repo}`, { params: { branch } });
  return data;
};

export const aiSecurityScan = async (owner: string, repo: string, branch = 'HEAD') => {
  const { data } = await api.get(`/ai/security/${owner}/${repo}/scan`, { params: { branch } });
  return data;
};

export const aiHealthMetrics = async (owner: string, repo: string) => {
  const { data } = await api.get(`/ai/health/${owner}/${repo}/metrics`);
  return data;
};

export const aiAwaySummary = async (owner: string, repo: string, window = '7d') => {
  const { data } = await api.get(`/ai/health/${owner}/${repo}/away-summary`, { params: { window } });
  return data;
};

export const aiCostEstimate = async (owner: string, repo: string) => {
  const { data } = await api.get(`/ai/cost/${owner}/${repo}/estimate`);
  return data;
};

// User & Portfolio
export const fetchUserProfile = async (username: string) => {
  const { data } = await api.get(`/users/${username}`);
  return data;
};

export const fetchUserPortfolio = async (username: string) => {
  const { data } = await api.get(`/users/${username}/portfolio`);
  return data;
};

// Notifications
export const fetchNotifications = async () => {
  const { data } = await api.get('/notifications');
  return data;
};

export const markNotificationRead = async (id: string) => {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data;
};

export const markAllNotificationsRead = async () => {
  const { data } = await api.post('/notifications/read-all');
  return data;
};
