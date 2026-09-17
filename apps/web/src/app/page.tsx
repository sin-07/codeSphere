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
  User,
  Cpu,
  Zap,
  Activity,
  Code2,
  Copy,
  Check
} from 'lucide-react';
import { fetchRepos } from '@/lib/api';
import { Repository } from '@/types';
import { GsapStagger, GsapGlowCard, GsapCounter, GsapPulseBeacon } from '@/components/animations';

export default function HomePage() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCmd, setCopiedCmd] = useState(false);

  useEffect(() => {
    fetchRepos()
      .then((data) => setRepos(data || []))
      .catch(() => {
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

  const handleCopyClone = () => {
    navigator.clipboard.writeText('git clone http://localhost:4000/git/demo-dev/codesphere-core.git');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050806] text-[#f0f7f2] flex flex-col selection:bg-emerald-500/25 selection:text-emerald-200">
      <Navbar onOpenSearch={() => setIsCommandOpen(true)} />
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 relative z-10">
        {/* Metric Quick Bar with GSAP Counters */}
        <GsapStagger className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <GsapGlowCard className="p-4.5 border-emerald-500/15 bg-[#080d0a]/80">
            <div className="flex items-center justify-between text-[#91a897] mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Repositories</span>
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono flex items-baseline gap-2">
              <GsapCounter value={repos.length || 2} duration={1.2} />
              <span className="text-[11px] font-sans font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
          </GsapGlowCard>

          <GsapGlowCard className="p-4.5 border-emerald-500/15 bg-[#080d0a]/80">
            <div className="flex items-center justify-between text-[#91a897] mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">AI Operations</span>
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono flex items-baseline gap-2">
              <GsapCounter value={1284} duration={1.5} />
              <span className="text-[11px] font-sans font-medium text-[#91a897]">
                OPS / DAY
              </span>
            </div>
          </GsapGlowCard>

          <GsapGlowCard className="p-4.5 border-emerald-500/15 bg-[#080d0a]/80">
            <div className="flex items-center justify-between text-[#91a897] mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Security Gate</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-mono flex items-baseline gap-2">
              <GsapCounter value={100} duration={1.4} suffix="%" />
              <span className="text-[11px] font-sans font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                0 CVE
              </span>
            </div>
          </GsapGlowCard>

          <GsapGlowCard className="p-4.5 border-emerald-500/15 bg-[#080d0a]/80">
            <div className="flex items-center justify-between text-[#91a897] mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Pipeline Uptime</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono flex items-baseline gap-2">
              <GsapCounter value={99.98} duration={1.6} decimals={2} suffix="%" />
              <span className="text-[11px] font-sans font-medium text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                PASS
              </span>
            </div>
          </GsapGlowCard>
        </GsapStagger>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Recent Repositories */}
          <div className="lg:col-span-1 space-y-6">
            <GsapGlowCard className="p-4 space-y-4 border-emerald-500/15 bg-[#080d0a]/80">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span>Top Repositories</span>
                </h3>
                <a
                  href="/new"
                  className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-md transition-all shadow-[0_1px_12px_rgba(16,185,129,0.25)]"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>New</span>
                </a>
              </div>

              <div className="space-y-1.5">
                {repos.map((repo) => (
                  <a
                    key={repo.slug}
                    href={`/${repo.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#0c120e]/60 border border-emerald-500/10 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all group"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <BookOpen className="w-4 h-4 text-[#91a897] group-hover:text-emerald-400 transition-colors shrink-0" />
                      <span className="font-medium text-xs text-white group-hover:text-emerald-300 transition-colors truncate">
                        {repo.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#91a897] group-hover:text-emerald-300 flex items-center gap-1">
                      <Star className="w-3 h-3 text-emerald-400" />
                      {repo.starsCount}
                    </span>
                  </a>
                ))}
              </div>
            </GsapGlowCard>

            {/* Organizations */}
            <GsapGlowCard className="p-4 space-y-3 border-emerald-500/15 bg-[#080d0a]/80">
              <h3 className="font-semibold text-sm text-white flex items-center justify-between">
                <span>Organization</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  VERIFIED
                </span>
              </h3>
              <a
                href="/orgs/codesphere-labs"
                className="flex items-center gap-3 p-2.5 rounded-lg bg-[#0c120e]/60 border border-emerald-500/10 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0c120e] border border-emerald-500/30 flex items-center justify-center font-bold text-xs text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                  CS
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-white group-hover:text-emerald-300 transition-colors">CodeSphere Labs</p>
                  <span className="text-[#91a897] font-mono text-[11px]">Enterprise Tier</span>
                </div>
              </a>
            </GsapGlowCard>
          </div>

          {/* Center Column: Intelligence Hero & Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Repository Brain Hero Banner */}
            <GsapGlowCard className="p-6 border-emerald-500/20 bg-gradient-to-b from-[#0c140f] to-[#080d0a] shadow-[0_12px_40px_-15px_rgba(16,185,129,0.12)]">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-mono font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>AI REPOSITORY BRAIN ACTIVE</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight font-sans">
                  The Autonomous <br />
                  <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    Developer Intelligence Platform
                  </span>
                </h1>

                <p className="text-sm text-[#91a897] leading-relaxed">
                  Real bare Git repository hosting with instant clone/push/pull, real-time collaboration presence, browser Web IDE, CI/CD pipeline engine, and deep AST semantic search.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  <a
                    href="/demo-dev/codesphere-core/brain"
                    className="flex flex-col items-center justify-center p-3.5 bg-[#0c120e]/80 hover:bg-emerald-500/15 border border-emerald-500/15 hover:border-emerald-500/45 rounded-xl text-center transition-all group shadow-sm"
                  >
                    <Sparkles className="w-5 h-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-[#d1e0d5] group-hover:text-emerald-300">AI Search</span>
                  </a>

                  <a
                    href="/demo-dev/codesphere-core/arch"
                    className="flex flex-col items-center justify-center p-3.5 bg-[#0c120e]/80 hover:bg-emerald-500/15 border border-emerald-500/15 hover:border-emerald-500/45 rounded-xl text-center transition-all group shadow-sm"
                  >
                    <Network className="w-5 h-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-[#d1e0d5] group-hover:text-emerald-300">Arch Map</span>
                  </a>

                  <a
                    href="/demo-dev/codesphere-core/edit/main/README.md"
                    className="flex flex-col items-center justify-center p-3.5 bg-[#0c120e]/80 hover:bg-emerald-500/15 border border-emerald-500/15 hover:border-emerald-500/45 rounded-xl text-center transition-all group shadow-sm"
                  >
                    <Terminal className="w-5 h-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-[#d1e0d5] group-hover:text-emerald-300">Web IDE</span>
                  </a>

                  <a
                    href="/demo-dev/portfolio"
                    className="flex flex-col items-center justify-center p-3.5 bg-[#0c120e]/80 hover:bg-emerald-500/15 border border-emerald-500/15 hover:border-emerald-500/45 rounded-xl text-center transition-all group shadow-sm"
                  >
                    <User className="w-5 h-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-[#d1e0d5] group-hover:text-emerald-300">Portfolio</span>
                  </a>
                </div>
              </div>
            </GsapGlowCard>

            {/* Activity Feed */}
            <div className="space-y-3">
              <h2 className="font-semibold text-sm text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Real-Time Platform Activity</span>
                </span>
                <GsapPulseBeacon size={7} color="#10b981" label="STREAMING" />
              </h2>

              <GsapStagger className="space-y-3">
                {/* Activity 1 */}
                <div className="p-4 bg-[#080d0a]/80 border border-emerald-500/15 hover:border-emerald-500/35 rounded-xl space-y-2 transition-all">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Alex Rivera (@demo-dev)
                    </span>
                    <span className="text-[#91a897] font-mono text-[11px]">Just now</span>
                  </div>
                  <p className="text-xs text-[#d1e0d5] leading-relaxed">
                    Opened pull request <a href="/demo-dev/codesphere-core/pull/1" className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2">#1: Integrate AI Repository Brain AST Service</a> in <code className="text-emerald-300 font-mono px-1 py-0.5 rounded bg-emerald-500/10">demo-dev/codesphere-core</code>
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-[#91a897] font-mono pt-1">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">LOW RISK (15/100)</span>
                    <span>1 file changed (+7 lines)</span>
                  </div>
                </div>

                {/* Activity 2 */}
                <div className="p-4 bg-[#080d0a]/80 border border-emerald-500/15 hover:border-emerald-500/35 rounded-xl space-y-2 transition-all">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Git Smart HTTP Daemon
                    </span>
                    <span className="text-[#91a897] font-mono text-[11px]">2m ago</span>
                  </div>
                  <p className="text-xs text-[#d1e0d5] leading-relaxed">
                    Verified native Git push for commit <code className="text-emerald-300 font-mono px-1 py-0.5 rounded bg-emerald-500/10">4f74107</code> authenticated via Personal Access Token.
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium font-mono pt-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Post-Push CI Pipeline Triggered</span>
                  </div>
                </div>
              </GsapStagger>
            </div>
          </div>

          {/* Right Column: Trending & Quick Commands */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Git Terminal Command */}
            <GsapGlowCard className="p-4 space-y-3 border-emerald-500/15 bg-[#080d0a]/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Git Smart HTTP CLI</span>
                </div>
                <button
                  onClick={handleCopyClone}
                  className="p-1 rounded text-[#91a897] hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                  title="Copy command"
                >
                  {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-[#91a897] leading-relaxed">
                Clone directly via native Git CLI using standard Smart HTTP protocol:
              </p>
              <div className="p-2.5 bg-[#050806] border border-emerald-500/20 rounded-lg font-mono text-[11px] text-emerald-300 break-all select-all shadow-inner">
                git clone http://localhost:4000/git/demo-dev/codesphere-core.git
              </div>
            </GsapGlowCard>

            {/* Security Status */}
            <GsapGlowCard className="p-4 space-y-3 border-emerald-500/15 bg-[#080d0a]/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Autonomous Security Gate</span>
              </div>
              <div className="text-xs text-[#91a897] font-mono space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span>Secret Leaks:</span>
                  <span className="text-emerald-400 font-semibold">0 Detected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>CVE Vulnerabilities:</span>
                  <span className="text-emerald-400 font-semibold">0 Clean</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Security Audit:</span>
                  <span className="text-emerald-400 font-semibold">Passed (100%)</span>
                </div>
              </div>
            </GsapGlowCard>
          </div>
        </div>
      </main>
    </div>
  );
}
