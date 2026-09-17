import bcrypt from 'bcryptjs';
import { connectDB } from './db/db';
import { DataService, UserModel, RepositoryModel, PullRequestModel, IssueModel, ReleaseModel, OrganizationModel, CIPipelineRunModel } from './models';
import { GitService } from './git/gitService';

export async function seedDatabase() {
  console.log('[Seed] Seeding CodeSphere database with demo data...');
  await connectDB();

  // 1. Create Demo User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const existingUser = await DataService.findOne<any>('users', UserModel, { username: 'demo-dev' });
  if (!existingUser) {
    await DataService.create('users', UserModel, {
      username: 'demo-dev',
      email: 'dev@codesphere.local',
      passwordHash,
      name: 'Alex Rivera',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bio: 'Principal Systems Architect & Open Source Maintainer. Building the future of AI-driven developer platforms.',
      company: 'CodeSphere Labs',
      location: 'San Francisco, CA',
      website: 'https://codesphere.dev',
      role: 'admin',
      personalAccessTokens: [
        { name: 'CLI Access Token', token: 'pat_codesphere_demo_token_2026', createdAt: new Date() }
      ],
      starredRepos: ['demo-dev/codesphere-core', 'demo-dev/ai-agent-nexus']
    });
    console.log('[Seed] Created demo user: demo-dev (password: password123)');
  }

  // 2. Create Demo Org
  const existingOrg = await DataService.findOne<any>('organizations', OrganizationModel, { slug: 'codesphere-labs' });
  if (!existingOrg) {
    await DataService.create('organizations', OrganizationModel, {
      name: 'CodeSphere Labs',
      slug: 'codesphere-labs',
      description: 'Research and development for AI-powered autonomous coding infrastructure.',
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      billingPlan: 'Enterprise Pro',
      members: [
        { userId: '1', username: 'demo-dev', role: 'owner' }
      ]
    });
    console.log('[Seed] Created demo organization: codesphere-labs');
  }

  // 3. Create Repo 1: codesphere-core
  const repo1Slug = 'demo-dev/codesphere-core';
  const existingRepo1 = await DataService.findOne<any>('repositories', RepositoryModel, { slug: repo1Slug });
  if (!existingRepo1) {
    await GitService.initBareRepo('demo-dev', 'codesphere-core', 'main');

    // Add multiple realistic files
    const coreFiles = [
      {
        path: 'README.md',
        content: `# CodeSphere Core Engine\n\nProduction-grade distributed Git platform and developer intelligence engine.\n\n## Features\n- Real Git Smart HTTP hosting\n- AI Repository Brain with AST semantic search\n- Real-time Web IDE & collaborative code review\n`
      },
      {
        path: 'package.json',
        content: `{\n  "name": "@codesphere/core",\n  "version": "1.0.0",\n  "main": "src/index.ts",\n  "scripts": {\n    "build": "tsc",\n    "test": "jest"\n  },\n  "dependencies": {\n    "express": "^4.19.2",\n    "jsonwebtoken": "^9.0.2"\n  }\n}\n`
      },
      {
        path: 'src/index.ts',
        content: `import { Server } from './server';\n\nexport function bootstrap() {\n  const server = new Server();\n  server.listen(4000);\n  console.log("CodeSphere Core running on port 4000");\n}\n\nbootstrap();\n`
      },
      {
        path: 'src/server.ts',
        content: `import { Router } from './router';\n\nexport class Server {\n  private router = new Router();\n  listen(port: number) {\n    console.log(\`Server listening on \${port}\`);\n  }\n}\n`
      },
      {
        path: 'src/router.ts',
        content: `export class Router {\n  handleRequest(req: any) {\n    return { status: 200, message: "OK" };\n  }\n}\n`
      },
      {
        path: 'tests/core.test.ts',
        content: `describe('Core Engine', () => {\n  it('should initialize router properly', () => {\n    expect(true).toBe(true);\n  });\n});\n`
      }
    ];

    await GitService.commitFiles(
      'demo-dev',
      'codesphere-core',
      'main',
      coreFiles,
      'Initial release: Setup distributed server architecture',
      'Alex Rivera',
      'dev@codesphere.local'
    );

    // Create a feature branch with modifications for PR #1
    await GitService.createBranch('demo-dev', 'codesphere-core', 'feature/ai-brain', 'main');
    await GitService.commitFiles(
      'demo-dev',
      'codesphere-core',
      'feature/ai-brain',
      [
        {
          path: 'src/brain.ts',
          content: `export class RepositoryBrain {\n  analyzeAST(source: string) {\n    return { complexity: 2, status: "ready" };\n  }\n}\n`
        }
      ],
      'Implement RepositoryBrain AST analysis service',
      'Alex Rivera',
      'dev@codesphere.local'
    );

    await DataService.create('repositories', RepositoryModel, {
      owner: 'demo-dev',
      name: 'codesphere-core',
      slug: repo1Slug,
      description: 'Distributed Git engine and developer intelligence platform with real HTTP protocol.',
      isPrivate: false,
      defaultBranch: 'main',
      storagePath: GitService.getRepoPath('demo-dev', 'codesphere-core'),
      starsCount: 142,
      forksCount: 18,
      topics: ['git', 'ai', 'typescript', 'devtools', 'cloud'],
      language: 'TypeScript',
      archived: false,
      protectedBranches: ['main']
    });

    // Create PR #1
    await DataService.create('pullrequests', PullRequestModel, {
      repoSlug: repo1Slug,
      number: 1,
      title: 'Integrate AI Repository Brain AST Service',
      description: 'Introduces `RepositoryBrain` class for real-time AST syntax analysis and complexity scoring.',
      author: 'demo-dev',
      baseBranch: 'main',
      headBranch: 'feature/ai-brain',
      status: 'open',
      diffStats: { additions: 7, deletions: 0, filesChanged: 1 },
      reviewers: [{ username: 'demo-dev', status: 'approved', updatedAt: new Date() }]
    });

    // Create Issue #1
    await DataService.create('issues', IssueModel, {
      repoSlug: repo1Slug,
      number: 1,
      title: 'Enhance git-receive-pack post-receive hook performance',
      description: 'Optimize post-receive trigger execution using asynchronous background worker queue.',
      author: 'demo-dev',
      status: 'open',
      labels: ['enhancement', 'performance', 'git-engine'],
      assignees: ['demo-dev'],
      milestone: 'v1.1.0',
      commentsCount: 2
    });

    // Create Release v1.0.0
    await DataService.create('releases', ReleaseModel, {
      repoSlug: repo1Slug,
      tagName: 'v1.0.0',
      name: 'CodeSphere Core 1.0.0 General Availability',
      body: 'Official production release of CodeSphere Core Git infrastructure with smart HTTP protocol.',
      targetBranch: 'main',
      author: 'demo-dev',
      assets: [
        { name: 'codesphere-core-v1.0.0.tar.gz', size: 1048576, downloadUrl: '#' },
        { name: 'codesphere-core-v1.0.0.zip', size: 1258291, downloadUrl: '#' }
      ],
      publishedAt: new Date()
    });

    // Create CI Run
    await DataService.create('cipipelineruns', CIPipelineRunModel, {
      repoSlug: repo1Slug,
      commitSha: 'e9b2c34a123f',
      commitMessage: 'Initial release: Setup distributed server architecture',
      branch: 'main',
      author: 'demo-dev',
      trigger: 'push',
      status: 'success',
      startedAt: new Date(Date.now() - 3600000),
      completedAt: new Date(Date.now() - 3584000),
      durationSeconds: 16,
      stages: [
        {
          name: 'Build & Quality',
          status: 'success',
          steps: [
            { name: 'TypeScript Compilation', command: 'tsc --noEmit', status: 'success', durationSeconds: 4, logs: ['TSC 0 errors'] },
            { name: 'Jest Unit Suite', command: 'jest', status: 'success', durationSeconds: 7, logs: ['All 12 tests passing'] },
            { name: 'AI Security Gate', command: 'codesphere scan', status: 'success', durationSeconds: 5, logs: ['0 vulnerabilities detected'] }
          ]
        }
      ]
    });

    console.log('[Seed] Created demo repository: demo-dev/codesphere-core');
  }

  // 4. Create Repo 2: ai-agent-nexus
  const repo2Slug = 'demo-dev/ai-agent-nexus';
  const existingRepo2 = await DataService.findOne<any>('repositories', RepositoryModel, { slug: repo2Slug });
  if (!existingRepo2) {
    await GitService.initBareRepo('demo-dev', 'ai-agent-nexus', 'main');

    const agentFiles = [
      {
        path: 'README.md',
        content: `# AI Agent Nexus\n\nAutonomous agent framework designed for continuous codebase maintenance and automated pull request generation.\n`
      },
      {
        path: 'requirements.txt',
        content: `fastapi>=0.110.0\nuvicorn>=0.29.0\npydantic>=2.7.0\n`
      },
      {
        path: 'main.py',
        content: `from fastapi import FastAPI\n\napp = FastAPI(title="AI Agent Nexus")\n\n@app.get("/")\ndef read_root():\n    return {"agent": "active", "status": "nominal"}\n`
      }
    ];

    await GitService.commitFiles(
      'demo-dev',
      'ai-agent-nexus',
      'main',
      agentFiles,
      'Initial release: Autonomous agent framework',
      'Alex Rivera',
      'dev@codesphere.local'
    );

    await DataService.create('repositories', RepositoryModel, {
      owner: 'demo-dev',
      name: 'ai-agent-nexus',
      slug: repo2Slug,
      description: 'Autonomous multi-agent orchestration framework for automated repository refactoring.',
      isPrivate: false,
      defaultBranch: 'main',
      storagePath: GitService.getRepoPath('demo-dev', 'ai-agent-nexus'),
      starsCount: 89,
      forksCount: 12,
      topics: ['ai', 'agent', 'python', 'fastapi', 'automation'],
      language: 'Python',
      archived: false,
      protectedBranches: ['main']
    });

    console.log('[Seed] Created demo repository: demo-dev/ai-agent-nexus');
  }

  console.log('[Seed] Database seeding completed successfully.');
}

if (require.main === module) {
  seedDatabase().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
  });
}
