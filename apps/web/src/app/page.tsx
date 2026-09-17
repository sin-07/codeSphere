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
  Code2
} from 'lucide-react';
import { fetchRepos } from '@/lib/api';
import { Repository } from '@/types';
import { GsapStagger, GsapGlowCard, GsapCounter, GsapPulseBeacon } from '@/components/animations';

export default function HomePage() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#000000] text-[#f0faf0] flex flex-col selection:bg-[#00ff66]/20 selection:text-[#00ff66]">
      <Navbar onOpenSearch={() => setIsCommandOpen(true)} />
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 relative z-10">
        {/* Metric Quick Bar with GSAP Counters */}
        <GsapStagger className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <GsapGlowCard className="p-4 border-[#1a2c1a]">
            <div className="flex items-center justify-between text-[#86a686] mb-1">
              <span className="text-xs font-mono uppercase tracking-wider">Repositories</span>
              <BookOpen className="w-4 h-4 text-[#00ff66]" />
            </div>
            <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1">
              <GsapCounter value={repos.length || 2} duration={1.5} />
              <span className="text-xs font-normal text-[#00ff66]">ACTIVE</span>
            </div>
          </GsapGlowCard>

          <GsapGlowCard className="p-4 border-[#1a2c1a]">
            <div className="flex items-center justify-between text-[#86a686] mb-1">
              <span className="text-xs font-mono uppercase tracking-wider">AI Operations</span>
              <Cpu className="w-4 h-4 text-[#00ff66]" />
            </div>
            <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1">
              <GsapCounter value={1284} duration={2} />
              <span className="text-xs font-normal text-[#00ff66]">OPS/DAY</span>
            </div>
          </GsapGlowCard>

          <GsapGlowCard className="p-4 border-[#1a2c1a]">
            <div className="flex items-center justify-between text-[#86a686] mb-1">
              <span className="text-xs font-mono uppercase tracking-wider">Security Score</span>
              <ShieldCheck className="w-4 h-4 text-[#00ff66]" />
            </div>
            <div className="text-2xl font-black text-[#00ff66] font-mono flex items-baseline gap-1">
              <GsapCounter value={100} duration={1.8} suffix="%" />
              <span className="text-xs font-normal text-[#86a686]">0 CVE</span>
            </div>
          </GsapGlowCard>

          <GsapGlowCard className="p-4 border-[#1a2c1a]">
            <div className="flex items-center justify-between text-[#86a686] mb-1">
              <span className="text-xs font-mono uppercase tracking-wider">Pipeline Uptime</span>
              <Zap className="w-4 h-4 text-[#00ff66]" />
            </div>
            <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1">
              <GsapCounter value={99.98} duration={2} decimals={2} suffix="%" />
              <span className="text-xs font-normal text-[#00ff66]">PASS</span>
            </div>
          </GsapGlowCard>
        </GsapStagger>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Recent Repositories */}
          <div className="lg:col-span-1 space-y-6">
            <GsapGlowCard className="p-4 space-y-4 border-[#1a2c1a]">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_8px_#00ff66]" />
                  <span>Top Repositories</span>
                </h3>
                <a
                  href="/new"
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#00ff66] hover:bg-[#22c55e] text-black text-xs font-bold rounded-md transition-all shadow-[0_0_10px_rgba(0,255,102,0.3)]"
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
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#000000]/60 border border-[#1a2c1a] hover:border-[#00ff66]/50 hover:bg-[#00ff66]/5 transition-all group"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <BookOpen className="w-4 h-4 text-[#86a686] group-hover:text-[#00ff66] transition-colors shrink-0" />
                      <span className="font-medium text-xs text-white group-hover:text-[#00ff66] transition-colors truncate">
                        {repo.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#86a686] group-hover:text-[#00ff66] flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#00ff66]" />
                      {repo.starsCount}
                    </span>
                  </a>
                ))}
              </div>
            </GsapGlowCard>

            {/* Organizations */}
            <GsapGlowCard className="p-4 space-y-3 border-[#1a2c1a]">
              <h3 className="font-bold text-sm text-white flex items-center justify-between">
                <span>Organization</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30">
                  VERIFIED
                </span>
              </h3>
              <a
                href="/orgs/codesphere-labs"
                className="flex items-center gap-3 p-2.5 rounded-lg bg-[#000000]/60 border border-[#1a2c1a] hover:border-[#00ff66]/50 hover:bg-[#00ff66]/5 transition-all group"
              >
                <div className="w-7 h-7 rounded-md bg-[#040604] border border-[#00ff66]/50 flex items-center justify-center font-bold text-xs text-[#00ff66] shadow-[0_0_10px_rgba(0,255,102,0.3)]">
                  C
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-white group-hover:text-[#00ff66] transition-colors">CodeSphere Labs</p>
                  <span className="text-[#86a686] font-mono text-[11px]">Enterprise Pro</span>
                </div>
              </a>
            </GsapGlowCard>
          </div>

          {/* Center Column: Intelligence Hero & Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Repository Brain Hero Banner */}
            <GsapGlowCard className="p-6 border-[#00ff66]/30 shadow-[0_0_35px_rgba(0,255,102,0.1)]">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/40 text-[#00ff66] text-xs font-mono font-semibold shadow-[0_0_10px_rgba(0,255,102,0.2)]">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#00ff66]" />
                  <span>AI REPOSITORY BRAIN ACTIVE</span>
                </div>

                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl font-sans">
                  The AI-Autonomous <br />
                  <span className="text-[#00ff66] neon-text-glow">Developer Platform</span>
                </h1>

                <p className="text-sm text-[#86a686] leading-relaxed">
                  Real bare Git repository hosting with instant clone/push/pull, real-time collaboration presence, browser Web IDE, CI/CD pipeline engine, and deep AST semantic search.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  <a
                    href="/demo-dev/codesphere-core/brain"
                    className="flex flex-col items-center justify-center p-3.5 bg-[#000000]/80 hover:bg-[#00ff66]/10 border border-[#1a2c1a] hover:border-[#00ff66]/60 rounded-xl text-center transition-all group"
                  >
                    <Sparkles className="w-5 h-5 text-[#00ff66] mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-white group-hover:text-[#00ff66]">AI Search</span>
                  </a>

                  <a
                    href="/demo-dev/codesphere-core/arch"
                    className="flex flex-col items-center justify-center p-3.5 bg-[#000000]/80 hover:bg-[#00ff66]/10 border border-[#1a2c1a] hover:border-[#00ff66]/60 rounded-xl text-center transition-all group"
                  >
                    <Network className="w-5 h-5 text-[#00ff66] mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-white group-hover:text-[#00ff66]">Arch Map</span>
                  </a>

                  <a
                    href="/demo-dev/codesphere-core/edit/main/README.md"
                    className="flex flex-col items-center justify-center p-3.5 bg-[#000000]/80 hover:bg-[#00ff66]/10 border border-[#1a2c1a] hover:border-[#00ff66]/60 rounded-xl text-center transition-all group"
                  >
                    <Terminal className="w-5 h-5 text-[#00ff66] mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-white group-hover:text-[#00ff66]">Web IDE</span>
                  </a>

                  <a
                    href="/demo-dev/portfolio"
                    className="flex flex-col items-center justify-center p-3.5 bg-[#000000]/80 hover:bg-[#00ff66]/10 border border-[#1a2c1a] hover:border-[#00ff66]/60 rounded-xl text-center transition-all group"
                  >
                    <User className="w-5 h-5 text-[#00ff66] mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-white group-hover:text-[#00ff66]">Portfolio</span>
                  </a>
                </div>
              </div>
            </GsapGlowCard>

            {/* Activity Feed */}
            <div className="space-y-3">
              <h2 className="font-bold text-base text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#00ff66]" />
                  <span>Real-Time Platform Activity</span>
                </span>
                <GsapPulseBeacon size={8} color="#00ff66" label="STREAMING" />
              </h2>

              <GsapStagger className="space-y-3">
                {/* Activity 1 */}
                <div className="p-4 bg-[#040604] border border-[#1a2c1a] hover:border-[#00ff66]/40 rounded-xl space-y-2 transition-all">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" />
                      Alex Rivera (@demo-dev)
                    </span>
                    <span className="text-[#86a686] font-mono">Just now</span>
                  </div>
                  <p className="text-xs text-[#c2d6c2]">
                    Opened pull request <a href="/demo-dev/codesphere-core/pull/1" className="text-[#00ff66] hover:underline font-semibold">#1: Integrate AI Repository Brain AST Service</a> in <code className="text-[#4ade80] font-mono">demo-dev/codesphere-core</code>
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-[#86a686] font-mono">
                    <span className="px-2 py-0.5 rounded-full bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30">LOW RISK (15/100)</span>
                    <span>1 file changed (+7 lines)</span>
                  </div>
                </div>

                {/* Activity 2 */}
                <div className="p-4 bg-[#040604] border border-[#1a2c1a] hover:border-[#00ff66]/40 rounded-xl space-y-2 transition-all">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" />
                      Git Smart HTTP Daemon
                    </span>
                    <span className="text-[#86a686] font-mono">2m ago</span>
                  </div>
                  <p className="text-xs text-[#c2d6c2]">
                    Verified native Git push for commit <code className="text-[#00ff66] font-mono">4f74107</code> authenticated via Personal Access Token.
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-[#00ff66] font-semibold font-mono">
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
            <GsapGlowCard className="p-4 space-y-3 border-[#1a2c1a]">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Terminal className="w-4 h-4 text-[#00ff66]" />
                <span>Git Smart HTTP Terminal</span>
              </div>
              <p className="text-[11px] text-[#86a686]">
                Clone directly via native Git CLI using standard Smart HTTP protocol:
              </p>
              <div className="p-2.5 bg-[#000000] border border-[#1a2c1a] rounded-lg font-mono text-[11px] text-[#00ff66] overflow-x-auto select-all shadow-inner">
                git clone http://localhost:4000/git/demo-dev/codesphere-core.git
              </div>
            </GsapGlowCard>

            {/* Security Status */}
            <GsapGlowCard className="p-4 space-y-3 border-[#1a2c1a]">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-[#00ff66]" />
                <span>Autonomous Security Gate</span>
              </div>
              <div className="text-xs text-[#86a686] font-mono space-y-2">
                <div className="flex items-center justify-between">
                  <span>Secret Leaks:</span>
                  <span className="text-[#00ff66] font-bold">0 Detected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>CVE Vulnerabilities:</span>
                  <span className="text-[#00ff66] font-bold">0 Clean</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Security Audit:</span>
                  <span className="text-[#00ff66] font-bold">Passed (100%)</span>
                </div>
              </div>
            </GsapGlowCard>
          </div>
        </div>
      </main>
    </div>
  );
}
