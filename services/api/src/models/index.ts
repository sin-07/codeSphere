import mongoose, { Schema, Document } from 'mongoose';
import { isFallback, getLocalCollection, saveLocalCollection } from '../db/db';
import { v4 as uuidv4 } from 'uuid';

// User Schema
export interface IUser {
  _id: string;
  username: string;
  email: string;
  passwordHash: string;
  name: string;
  avatarUrl: string;
  bio: string;
  company?: string;
  location?: string;
  website?: string;
  role: 'admin' | 'user';
  personalAccessTokens: Array<{ name: string; token: string; createdAt: Date }>;
  sshKeys: Array<{ title: string; key: string; createdAt: Date }>;
  starredRepos: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: '' },
  avatarUrl: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  bio: { type: String, default: 'Software Engineer & CodeSphere Creator' },
  company: { type: String, default: '' },
  location: { type: String, default: 'San Francisco, CA' },
  website: { type: String, default: 'https://codesphere.dev' },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  personalAccessTokens: [{ name: String, token: String, createdAt: { type: Date, default: Date.now } }],
  sshKeys: [{ title: String, key: String, createdAt: { type: Date, default: Date.now } }],
  starredRepos: [{ type: String }],
}, { timestamps: true });

// Repository Schema
export interface IRepository {
  _id: string;
  owner: string; // username or org slug
  name: string;
  slug: string; // owner/name
  description: string;
  isPrivate: boolean;
  defaultBranch: string;
  storagePath: string;
  starsCount: number;
  forksCount: number;
  forkOf?: string; // parent repo slug if forked
  topics: string[];
  language: string;
  archived: boolean;
  protectedBranches: string[];
  createdAt: Date;
  updatedAt: Date;
}

const RepositorySchema = new Schema<IRepository>({
  owner: { type: String, required: true, index: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, default: '' },
  isPrivate: { type: Boolean, default: false },
  defaultBranch: { type: String, default: 'main' },
  storagePath: { type: String, required: true },
  starsCount: { type: Number, default: 0 },
  forksCount: { type: Number, default: 0 },
  forkOf: { type: String },
  topics: [{ type: String }],
  language: { type: String, default: 'TypeScript' },
  archived: { type: Boolean, default: false },
  protectedBranches: [{ type: String, default: ['main'] }],
}, { timestamps: true });

// Pull Request Schema
export interface IPullRequest {
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
  mergedAt?: Date;
  diffStats: { additions: number; deletions: number; filesChanged: number };
  reviewers: Array<{ username: string; status: 'approved' | 'changes_requested' | 'commented'; updatedAt: Date }>;
  createdAt: Date;
  updatedAt: Date;
}

const PullRequestSchema = new Schema<IPullRequest>({
  repoSlug: { type: String, required: true, index: true },
  number: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  author: { type: String, required: true },
  baseBranch: { type: String, default: 'main' },
  headBranch: { type: String, required: true },
  status: { type: String, enum: ['open', 'closed', 'merged'], default: 'open' },
  mergeStrategy: { type: String, enum: ['merge', 'squash', 'rebase'] },
  mergedBy: { type: String },
  mergedAt: { type: Date },
  diffStats: {
    additions: { type: Number, default: 0 },
    deletions: { type: Number, default: 0 },
    filesChanged: { type: Number, default: 0 },
  },
  reviewers: [{
    username: String,
    status: { type: String, enum: ['approved', 'changes_requested', 'commented'] },
    updatedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

// Issue Schema
export interface IIssue {
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
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const IssueSchema = new Schema<IIssue>({
  repoSlug: { type: String, required: true, index: true },
  number: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  author: { type: String, required: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  labels: [{ type: String }],
  milestone: { type: String },
  assignees: [{ type: String }],
  commentsCount: { type: Number, default: 0 },
  closedAt: { type: Date },
}, { timestamps: true });

// Comment Schema
export interface IComment {
  _id: string;
  repoSlug: string;
  entityType: 'issue' | 'pr' | 'commit';
  entityNumberOrSha: string;
  author: string;
  body: string;
  diffPath?: string;
  diffLine?: number;
  diffSide?: 'LEFT' | 'RIGHT';
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  repoSlug: { type: String, required: true, index: true },
  entityType: { type: String, enum: ['issue', 'pr', 'commit'], required: true },
  entityNumberOrSha: { type: String, required: true },
  author: { type: String, required: true },
  body: { type: String, required: true },
  diffPath: { type: String },
  diffLine: { type: Number },
  diffSide: { type: String, enum: ['LEFT', 'RIGHT'] },
}, { timestamps: true });

// Release Schema
export interface IRelease {
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
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReleaseSchema = new Schema<IRelease>({
  repoSlug: { type: String, required: true, index: true },
  tagName: { type: String, required: true },
  name: { type: String, required: true },
  body: { type: String, default: '' },
  targetBranch: { type: String, default: 'main' },
  isDraft: { type: Boolean, default: false },
  isPrerelease: { type: Boolean, default: false },
  author: { type: String, required: true },
  assets: [{ name: String, size: Number, downloadUrl: String }],
  publishedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Organization Schema
export interface IOrganization {
  _id: string;
  name: string;
  slug: string;
  description: string;
  avatarUrl: string;
  billingPlan: string;
  members: Array<{
    userId: string;
    username: string;
    role: 'owner' | 'admin' | 'maintainer' | 'contributor' | 'reader';
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, default: '' },
  avatarUrl: { type: String, default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150' },
  billingPlan: { type: String, default: 'Enterprise Open Source' },
  members: [{
    userId: String,
    username: String,
    role: { type: String, enum: ['owner', 'admin', 'maintainer', 'contributor', 'reader'], default: 'contributor' },
  }],
}, { timestamps: true });

// CI Pipeline Run Schema
export interface ICIPipelineRun {
  _id: string;
  repoSlug: string;
  commitSha: string;
  commitMessage: string;
  branch: string;
  author: string;
  trigger: 'push' | 'pull_request' | 'manual';
  status: 'queued' | 'running' | 'success' | 'failed';
  startedAt: Date;
  completedAt?: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

const CIPipelineRunSchema = new Schema<ICIPipelineRun>({
  repoSlug: { type: String, required: true, index: true },
  commitSha: { type: String, required: true },
  commitMessage: { type: String, default: '' },
  branch: { type: String, default: 'main' },
  author: { type: String, required: true },
  trigger: { type: String, enum: ['push', 'pull_request', 'manual'], default: 'push' },
  status: { type: String, enum: ['queued', 'running', 'success', 'failed'], default: 'queued' },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  durationSeconds: { type: Number, default: 0 },
  stages: [{
    name: String,
    status: { type: String, enum: ['queued', 'running', 'success', 'failed'] },
    steps: [{
      name: String,
      command: String,
      status: { type: String, enum: ['queued', 'running', 'success', 'failed'] },
      durationSeconds: Number,
      logs: [String],
    }],
  }],
}, { timestamps: true });

// Audit Log Schema
export interface IAuditLog {
  _id: string;
  actor: string;
  ipAddress: string;
  action: string;
  targetType: string;
  targetId: string;
  details: any;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  actor: { type: String, required: true, index: true },
  ipAddress: { type: String, default: '127.0.0.1' },
  action: { type: String, required: true },
  targetType: { type: String, required: true },
  targetId: { type: String, required: true },
  details: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now, index: true },
});

// Notification Schema
export interface INotification {
  _id: string;
  recipient: string;
  actor: string;
  type: 'pr_review' | 'mention' | 'issue_assigned' | 'ci_completed';
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  recipient: { type: String, required: true, index: true },
  actor: { type: String, required: true },
  type: { type: String, enum: ['pr_review', 'mention', 'issue_assigned', 'ci_completed'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

// Mongoose Models
export const UserModel = mongoose.model<IUser>('User', UserSchema);
export const RepositoryModel = mongoose.model<IRepository>('Repository', RepositorySchema);
export const PullRequestModel = mongoose.model<IPullRequest>('PullRequest', PullRequestSchema);
export const IssueModel = mongoose.model<IIssue>('Issue', IssueSchema);
export const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);
export const ReleaseModel = mongoose.model<IRelease>('Release', ReleaseSchema);
export const OrganizationModel = mongoose.model<IOrganization>('Organization', OrganizationSchema);
export const CIPipelineRunModel = mongoose.model<ICIPipelineRun>('CIPipelineRun', CIPipelineRunSchema);
export const AuditLogModel = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
export const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema);

// Helper Wrapper that seamlessly handles Mongoose when connected or in-memory fallback store
export class DataService {
  private static matchFilter(doc: any, filter: any): boolean {
    for (const key of Object.keys(filter)) {
      if (filter[key] === undefined) continue;
      if (typeof filter[key] === 'object' && filter[key] !== null) {
        if ('$in' in filter[key]) {
          if (!filter[key].$in.includes(doc[key])) return false;
        } else if ('$regex' in filter[key]) {
          const reg = new RegExp(filter[key].$regex, filter[key].$options || '');
          if (!reg.test(doc[key] || '')) return false;
        }
      } else if (doc[key] !== filter[key]) {
        return false;
      }
    }
    return true;
  }

  static async find<T>(collection: string, model: any, filter: any = {}, sort: any = { createdAt: -1 }): Promise<T[]> {
    if (!isFallback()) {
      try {
        return await model.find(filter).sort(sort).lean();
      } catch (err) {
        // Fallback on transient error
      }
    }
    const docs = getLocalCollection(collection);
    const matched = docs.filter(d => this.matchFilter(d, filter));
    return matched as T[];
  }

  static async findOne<T>(collection: string, model: any, filter: any): Promise<T | null> {
    if (!isFallback()) {
      try {
        return await model.findOne(filter).lean();
      } catch (err) {
        // Fallback
      }
    }
    const docs = getLocalCollection(collection);
    const found = docs.find(d => this.matchFilter(d, filter));
    return found ? (found as T) : null;
  }

  static async create<T>(collection: string, model: any, data: any): Promise<T> {
    const docData = {
      ...data,
      _id: data._id || uuidv4(),
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date()
    };
    if (!isFallback()) {
      try {
        const created = await model.create(docData);
        return created.toObject();
      } catch (err) {
        // Fallback
      }
    }
    const docs = getLocalCollection(collection);
    docs.push(docData);
    saveLocalCollection(collection);
    return docData as T;
  }

  static async updateOne(collection: string, model: any, filter: any, update: any): Promise<boolean> {
    if (!isFallback()) {
      try {
        await model.updateOne(filter, update);
        return true;
      } catch (err) {
        // Fallback
      }
    }
    const docs = getLocalCollection(collection);
    const index = docs.findIndex(d => this.matchFilter(d, filter));
    if (index !== -1) {
      const target = docs[index];
      const updates = update.$set || update;
      Object.assign(target, updates, { updatedAt: new Date() });
      saveLocalCollection(collection);
      return true;
    }
    return false;
  }

  static async count(collection: string, model: any, filter: any = {}): Promise<number> {
    if (!isFallback()) {
      try {
        return await model.countDocuments(filter);
      } catch (err) {
        // Fallback
      }
    }
    const docs = getLocalCollection(collection);
    return docs.filter(d => this.matchFilter(d, filter)).length;
  }
}
