# CodeSphere 🌐

> **Production-Grade GitHub Alternative & Autonomous AI Repository Intelligence Platform**  
> Engineered with **Next.js (App Router + TypeScript + Tailwind)**, **Node.js/Express (Git Smart HTTP + REST + WebSocket)**, **MongoDB + Redis**, and **Python/FastAPI (AI Repository Brain & Analytics Engine)**.

---

## 🏛️ System Architecture

```mermaid
graph TD
    Client["Next.js Web App & Browser IDE (Port 3000)"]
    GitClient["Git CLI (git clone / push / pull)"]
    API["Node.js/Express API & Git HTTP Gateway (Port 4000)"]
    AIEngine["Python / FastAPI AI Brain & Code Intelligence (Port 8000)"]
    Mongo[("MongoDB (Metadata, Users, Issues, PRs, CI)")]
    RedisCache[("Redis (Pub/Sub, Background Jobs, Presence)")]
    GitStorage[("Filesystem / Bare Git Repos (/storage/repos)")]

    Client -->|REST & Socket.io| API
    GitClient -->|Git Smart HTTP Protocol| API
    Client -->|AI Code Search / Explanations / Maps| API
    API -->|Proxies / Delegated AI Tasks| AIEngine
    API -->|Git CLI / Bare Repos| GitStorage
    API -->|Mongoose| Mongo
    API -->|Jobs / Cache / Events| RedisCache
    AIEngine -->|Inspects Repository Files & Diffs| GitStorage
```

---

## 🚀 Key Features

### 1. 📦 Real Git Smart HTTP Hosting
- Supports standard Git CLI workflows (`git clone`, `git push`, `git pull`, `git fetch`).
- Implements the Git Smart HTTP protocol (`info/refs`, `git-upload-pack`, `git-receive-pack`) via native Git stateless RPC.
- Repositories stored as real bare Git repositories on filesystem (`/storage/repos/:owner/:repo.git`).
- **No Git objects stored in MongoDB**; MongoDB exclusively manages metadata, issues, PRs, audit logs, and CI records.
- Basic Authentication via username + password or **Personal Access Tokens (PATs)**.
- Automated post-push hook triggering: updates commit caches, updates branch heads, and runs CI/CD pipelines.

### 2. 🧠 AI Repository Brain & Intelligence Hub
- **Semantic Code Search**: Natural language vector query engine locating exact source lines and functions across repository files.
- **AI Stacktrace Debugger**: Analyzes runtime exceptions, identifies offending file and line number, pinpoints root cause, and generates unified code diff patch fixes.
- **PR Risk & Blast Radius Analyzer**: Calculates 0-100 risk score based on churn, critical infrastructure touched (auth/db/config), test coverage delta, and breaking API symbol deletions.
- **Interactive Architecture Map**: Auto-synthesizes dependency graph grouping files into UI, API, Service, Database, and Utility tiers with zoom/pan and module inspector.
- **Security & Secrets Scanner**: Scans repository for leaked AWS keys, GitHub tokens, Slack secrets, and checks dependencies against national CVE databases.
- **Project Health Dashboard**: Measures Maintainability Index, Bus Factor, commit velocity, and issue resolution rate.
- **“What Changed While I Was Away”**: Time-window delta summaries (24h, 3d, 7d, 30d) providing executive architectural digests.
- **Cloud & AI Cost Telemetry**: Real-time estimates for CI compute minutes, Git object storage, and AI query token expenses.

### 3. 💻 Full Browser Web IDE
- In-browser code editor with syntax highlighting, multi-file explorer, and status bar.
- Direct commit modal: commit changes directly to branch or open a pull request without local cloning.
- Instant AI code explanation drawer.

### 4. ⚡ CI/CD Pipeline Engine
- Visual pipeline DAG stages (`Build & Quality Gate`, `Unit Tests`, `AI Security Gate`).
- Real streaming terminal execution logs line-by-line.
- Automated triggers on push and pull request, plus manual dispatch.

### 5. 🌟 Developer Profiles & Auto-Generated Portfolios
- GitHub-style 365-day contribution calendar heatmap with hover metrics.
- Auto-generated, theme-customizable shareable developer portfolio (`/:username/portfolio`) with showcase projects, skills, and diamond engineering ranking.

### 6. 🛒 Project Marketplace & Explore
- Repository discovery by topic (`#ai`, `#git`, `#typescript`, `#python`, `#devtools`).
- Star rankings, fork counts, and clone commands.

---

## 🛠️ Quick Start

### Option A: Running with Docker Compose (Recommended for Production)
```bash
docker-compose up --build
```
- **Web App**: `http://localhost:3000`
- **Core API & Git Gateway**: `http://localhost:4000`
- **AI Repository Brain**: `http://localhost:8000`
- **MongoDB**: `localhost:27017`
- **Redis**: `localhost:6379`

### Option B: Running Locally

#### 1. Start the Python AI Engine
```bash
cd services/ai-engine
pip install -r requirements.txt
python main.py
```
*(Runs on port 8000)*

#### 2. Start the Core API & Git Backend
```bash
cd services/api
yarn install
yarn seed   # Pre-populates demo-dev user, org, and sample git repos
yarn dev
```
*(Runs on port 4000)*

#### 3. Start the Next.js Web Frontend
```bash
cd apps/web
yarn install
yarn dev
```
*(Runs on port 3000)*

---

## 🔑 Git CLI Usage Guide

### 1. Clone a Repository
```bash
git clone http://localhost:4000/git/demo-dev/codesphere-core.git
```

### 2. Push with Authentication
When prompted, provide your CodeSphere credentials:
- **Username**: `demo-dev`
- **Password / PAT**: `password123` or your generated token from `/settings`.

Or directly in the remote URL:
```bash
git remote set-url origin http://demo-dev:pat_codesphere_demo_token_2026@localhost:4000/git/demo-dev/codesphere-core.git
git push origin main
```

---

## 🧪 Testing & Verification
```bash
# Run AI Engine Test Suite
cd services/ai-engine
python test_engine.py

# Run API & Native Git Engine Tests
cd services/api
yarn test
```

---

## 📄 License
MIT © 2026 CodeSphere Technologies.
