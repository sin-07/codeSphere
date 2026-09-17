'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { CommandPalette } from '@/components/CommandPalette';
import { 
  BookOpen, 
  Plus, 
  Sparkles, 
  GitBranch, 
  GitPullRequest, 
  CheckCircle, 
  Star, 
  Terminal, 
  Network, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  User
} from 'lucide-react';
import { fetchRepos } from '@/lib/api';
import { Repository } from '@/types';

export default function HomePage() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepos()
      .then((data) => setRepos(data || []))
      .catch(() => {
        // Default demo repos if API not yet populated
        setRepos([
          {
            _id: '1',
            owner: 'demo-dev',
            name: 'codesphere-core',
            slug: 'demo-dev/codesphere-core',
            description: 'Distributed Git engine and developer intelligence platform with real HTTP protocol.',
            isPrivate: false,
            defaultBranch: 'main',
            starsCount: 142,
            forksCount: 18,
            topics: ['git', 'ai', 'typescript'],
            language: 'TypeScript',
            archived: false,
            protectedBranches: ['main'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            _id: '2',
            owner: 'demo-dev',
            name: 'ai-agent-nexus',
            slug: 'demo-dev/ai-agent-nexus',
            description: 'Autonomous multi-agent orchestration framework for automated repository refactoring.',
            isPrivate: false,
            defaultBranch: 'main',
            starsCount: 89,
            forksCount: 12,
            topics: ['ai', 'agent', 'python'],
            language: 'Python',
            archived: false,
            protectedBranches: ['main'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      <Navbar onOpenSearch={() => setIsCommandOpen(true)} />
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Recent Repositories */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">Top Repositories</h3>
                <a
                  href="/new"
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold rounded-md transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New</span>
                </a>
              </div>

              <div className="space-y-2">
                {repos.map((repo) => (
                  <a
                    key={repo.slug}
                    href={`/${repo.slug}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#21262d] transition-colors group"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <BookOpen className="w-4 h-4 text-[#8b949e] group-hover:text-cyan-400 shrink-0" />
                      <span className="font-medium text-xs text-white truncate">{repo.slug}</span>
                    </div>
                    <span className="text-[10px] text-[#8b949e] flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400" />
                      {repo.starsCount}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Organizations */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3">
              <h3 className="font-bold text-sm text-white">Your Organizations</h3>
              <a
                href="/orgs/codesphere-labs"
                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#21262d] transition-colors"
              >
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-xs text-white">
                  C
                </div>
                <div className="text-xs">
                  <p className="font-medium text-white">CodeSphere Labs</p>
                  <span className="text-[#8b949e]">Enterprise Pro</span>
                </div>
              </a>
            </div>
          </div>

          {/* Center Column: Intelligence Hero & Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Repository Brain Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#161b22] via-[#111928] to-[#0f172a] p-6 shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Next-Gen AI Repository Intelligence</span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  CodeSphere Developer Platform
                </h1>

                <p className="text-sm text-[#8b949e] leading-relaxed">
                  Real Git repository hosting with instant clone/push/pull, real-time collaboration, browser IDE, CI/CD pipeline engine, and the autonomous AI Repository Brain.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  <a
                    href="/demo-dev/codesphere-core/brain"
                    className="flex flex-col items-center justify-center p-3 bg-[#161b22]/80 hover:bg-[#21262d] border border-[#30363d] rounded-xl text-center transition-all group"
                  >
                    <Sparkles className="w-5 h-5 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-white">AI Search</span>
                  </a>

                  <a
                    href="/demo-dev/codesphere-core/arch"
                    className="flex flex-col items-center justify-center p-3 bg-[#161b22]/80 hover:bg-[#21262d] border border-[#30363d] rounded-xl text-center transition-all group"
                  >
                    <Network className="w-5 h-5 text-indigo-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-white">Arch Map</span>
                  </a>

                  <a
                    href="/demo-dev/codesphere-core/edit/main/README.md"
                    className="flex flex-col items-center justify-center p-3 bg-[#161b22]/80 hover:bg-[#21262d] border border-[#30363d] rounded-xl text-center transition-all group"
                  >
                    <Terminal className="w-5 h-5 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-white">Web IDE</span>
                  </a>

                  <a
                    href="/demo-dev/portfolio"
                    className="flex flex-col items-center justify-center p-3 bg-[#161b22]/80 hover:bg-[#21262d] border border-[#30363d] rounded-xl text-center transition-all group"
                  >
                    <User className="w-5 h-5 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-white">Portfolio</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="space-y-3">
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Recent Platform Activity</span>
              </h2>

              <div className="space-y-3">
                {/* Activity 1 */}
                <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Alex Rivera (demo-dev)</span>
                    <span className="text-[#8b949e]">2 hours ago</span>
                  </div>
                  <p className="text-xs text-[#c9d1d9]">
                    Opened pull request <a href="/demo-dev/codesphere-core/pull/1" className="text-indigo-400 hover:underline font-semibold">#1: Integrate AI Repository Brain AST Service</a> in <code className="text-cyan-400">demo-dev/codesphere-core</code>
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-[#8b949e]">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">LOW RISK (15/100)</span>
                    <span>1 file changed (+7 lines)</span>
                  </div>
                </div>

                {/* Activity 2 */}
                <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">CI/CD Automation Engine</span>
                    <span className="text-[#8b949e]">3 hours ago</span>
                  </div>
                  <p className="text-xs text-[#c9d1d9]">
                    Workflow run passed for commit <code className="text-indigo-300 font-mono">e9b2c34</code> on branch <code className="text-cyan-400 font-mono">main</code>
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Build & Quality Gate: 3/3 Steps Passed (16s)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Trending & Quick Commands */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Git Terminal Command */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Quick Git Clone</span>
              </div>
              <p className="text-[11px] text-[#8b949e]">
                Clone directly via standard Git CLI using HTTP Smart Protocol:
              </p>
              <div className="p-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg font-mono text-[11px] text-cyan-300 overflow-x-auto select-all">
                git clone http://localhost:4000/git/demo-dev/codesphere-core.git
              </div>
            </div>

            {/* Security Status */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>CodeSphere Security Gate</span>
              </div>
              <div className="text-xs text-[#8b949e] space-y-2">
                <div className="flex items-center justify-between">
                  <span>Secret Leaks:</span>
                  <span className="text-emerald-400 font-semibold">0 Detected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>CVE Vulnerabilities:</span>
                  <span className="text-emerald-400 font-semibold">Clean (0)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Security Score:</span>
                  <span className="text-cyan-400 font-bold">100 / 100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
