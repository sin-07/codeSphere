export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatarUrl: string;
  bio: string;
  company?: string;
  location?: string;
  website?: string;
  role: 'admin' | 'user';
  starredRepos?: string[];
}

export interface Repository {
  _id: string;
  owner: string;
  name: string;
  slug: string;
  description: string;
  isPrivate: boolean;
  defaultBranch: string;
  starsCount: number;
  forksCount: number;
  forkOf?: string;
  topics: string[];
  language: string;
  archived: boolean;
  protectedBranches: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CommitInfo {
  sha: string;
  author: string;
  email: string;
  date: string;
  message: string;
}

export interface TreeEntry {
  mode: string;
  type: 'blob' | 'tree' | 'commit';
  sha: string;
  size?: number;
  name: string;
  path: string;
}

export interface PullRequest {
  _id: string;
  repoSlug: string;
  number: number;
  title: string;
  description: string;
  author: string;
  baseBranch: string;
  headBranch: string;
  status: 'open' | 'closed' | 'merged';
  mergeStrategy?: 'merge' | 'squash' | 'rebase';
  mergedBy?: string;
  mergedAt?: string;
  diffStats: { additions: number; deletions: number; filesChanged: number };
  reviewers: Array<{ username: string; status: 'approved' | 'changes_requested' | 'commented'; updatedAt: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface Issue {
  _id: string;
  repoSlug: string;
  number: number;
  title: string;
  description: string;
  author: string;
  status: 'open' | 'closed';
  labels: string[];
  milestone?: string;
  assignees: string[];
  commentsCount: number;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  repoSlug: string;
  entityType: 'issue' | 'pr' | 'commit';
  entityNumberOrSha: string;
  author: string;
  body: string;
  diffPath?: string;
  diffLine?: number;
  diffSide?: 'LEFT' | 'RIGHT';
  createdAt: string;
  updatedAt: string;
}

export interface Release {
  _id: string;
  repoSlug: string;
  tagName: string;
  name: string;
  body: string;
  targetBranch: string;
  isDraft: boolean;
  isPrerelease: boolean;
  author: string;
  assets: Array<{ name: string; size: number; downloadUrl: string }>;
  publishedAt: string;
}

export interface CIPipelineRun {
  _id: string;
  repoSlug: string;
  commitSha: string;
  commitMessage: string;
  branch: string;
  author: string;
  trigger: 'push' | 'pull_request' | 'manual';
  status: 'queued' | 'running' | 'success' | 'failed';
  startedAt: string;
  completedAt?: string;
  durationSeconds: number;
  stages: Array<{
    name: string;
    status: 'queued' | 'running' | 'success' | 'failed';
    steps: Array<{
      name: string;
      command: string;
      status: 'queued' | 'running' | 'success' | 'failed';
      durationSeconds: number;
      logs: string[];
    }>;
  }>;
}

export interface Organization {
  _id: string;
  name: string;
  slug: string;
  description: string;
  avatarUrl: string;
  billingPlan: string;
  members: Array<{ userId: string; username: string; role: string }>;
}
