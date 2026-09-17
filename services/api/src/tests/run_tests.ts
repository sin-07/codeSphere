import assert from 'assert';
import { connectDB } from '../db/db';
import { DataService, UserModel, RepositoryModel, PullRequestModel, IssueModel } from '../models';
import { GitService } from '../git/gitService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config';

async function runApiTests() {
  console.log('Testing CodeSphere Core API & Git Engine...');
  await connectDB();

  // Test 1: User Registration and Password Hashing
  const testUsername = `testuser_${Date.now()}`;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('secretpass', salt);
  const user = await DataService.create<any>('users', UserModel, {
    username: testUsername,
    email: `${testUsername}@codesphere.local`,
    passwordHash,
    role: 'user',
    personalAccessTokens: [{ name: 'Test PAT', token: 'pat_test_123', createdAt: new Date() }]
  });
  assert(user.username === testUsername, 'User should be created');
  const token = jwt.sign({ id: user._id, username: user.username }, CONFIG.JWT_SECRET);
  assert(token.length > 20, 'JWT should be signed properly');
  console.log(' [x] Auth & User Data: PASSED');

  // Test 2: Git Bare Repo Init & File Commits
  const testRepoName = `test-repo-${Date.now()}`;
  const repoPath = await GitService.initBareRepo(testUsername, testRepoName, 'main');
  assert(repoPath.endsWith('.git'), 'Repo path should end with .git');

  const commitSha = await GitService.commitFiles(
    testUsername,
    testRepoName,
    'main',
    [
      { path: 'index.ts', content: 'export const version = "1.0.0";' },
      { path: 'docs/readme.md', content: '# Documentation' }
    ],
    'Initial test commit',
    testUsername,
    `${testUsername}@test.com`
  );
  assert(commitSha.length === 40, 'Commit SHA should be 40 chars');
  console.log(' [x] Git Bare Repo Init & Direct Commit: PASSED');

  // Test 3: Git Tree & Blob Browsing
  const tree = await GitService.getTree(testUsername, testRepoName, 'main');
  assert(tree.length === 2, 'Tree should have 2 entries (index.ts and docs)');
  const blob = await GitService.getBlob(testUsername, testRepoName, 'main', 'index.ts');
  assert(blob.content.includes('version = "1.0.0"'), 'Blob content should match committed file');
  console.log(' [x] Git Tree & Blob Operations: PASSED');

  // Test 4: Git Branch Creation & Diff
  await GitService.createBranch(testUsername, testRepoName, 'feature/update', 'main');
  const branches = await GitService.getBranches(testUsername, testRepoName);
  assert(branches.includes('feature/update'), 'Branches should contain feature/update');

  // Commit change on feature branch
  await GitService.commitFiles(
    testUsername,
    testRepoName,
    'feature/update',
    [{ path: 'index.ts', content: 'export const version = "2.0.0";\nexport const newFeature = true;' }],
    'Bump version and add new feature',
    testUsername,
    `${testUsername}@test.com`
  );

  const diffData = await GitService.getDiff(testUsername, testRepoName, 'main', 'feature/update');
  assert(diffData.additions >= 1, 'Diff should reflect additions');
  assert(diffData.filesChanged.length >= 1, 'Diff should list files changed');
  console.log(' [x] Git Branches, Commits & Diff Comparison: PASSED');

  // Test 5: Real Git 3-Way Merge
  const mergeSha = await GitService.mergeBranches(
    testUsername,
    testRepoName,
    'main',
    'feature/update',
    'merge',
    'Merge feature/update into main',
    testUsername,
    `${testUsername}@test.com`
  );
  assert(mergeSha.length === 40, 'Merge SHA should be 40 chars');
  const updatedBlob = await GitService.getBlob(testUsername, testRepoName, 'main', 'index.ts');
  assert(updatedBlob.content.includes('version = "2.0.0"'), 'Main branch should contain merged code');
  console.log(' [x] Real Git 3-Way Merge Execution: PASSED');

  // Test 6: Pull Request & Issue Workflow
  const pr = await DataService.create<any>('pullrequests', PullRequestModel, {
    repoSlug: `${testUsername}/${testRepoName}`,
    number: 1,
    title: 'Test PR',
    author: testUsername,
    baseBranch: 'main',
    headBranch: 'feature/update',
    status: 'merged',
    diffStats: { additions: 2, deletions: 1, filesChanged: 1 }
  });
  assert(pr.number === 1, 'PR number should be 1');

  const issue = await DataService.create<any>('issues', IssueModel, {
    repoSlug: `${testUsername}/${testRepoName}`,
    number: 1,
    title: 'Bug: Test issue',
    author: testUsername,
    status: 'open',
    labels: ['bug'],
    commentsCount: 0
  });
  assert(issue.status === 'open', 'Issue should be open');
  console.log(' [x] Pull Request & Issue Schemas: PASSED');

  console.log('\nALL CODE SPHERE API & GIT ENGINE TESTS PASSED SUCCESSFULLY!');
}

runApiTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
