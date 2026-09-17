'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Sparkles, 
  ExternalLink, 
  Star, 
  GitFork, 
  Award, 
  Code2, 
  Terminal, 
  MapPin, 
  Building, 
  Share2, 
  Check, 
} from 'lucide-react';
import { fetchUserPortfolio } from '@/lib/api';
import { GsapGlowCard, GsapCounter, GsapStagger } from '@/components/animations';

export default function DeveloperPortfolioPage() {
  const params = useParams();
  const owner = params.owner as string;

  const [portfolio, setPortfolio] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!owner) return;

    fetchUserPortfolio(owner)
      .then(setPortfolio)
      .catch(() => {
        setPortfolio({
          developer: {
            name: 'Alex Rivera',
            username: owner,
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
            bio: 'Principal Systems Architect & Open Source Maintainer. Engineering high-throughput distributed systems and AI developer platforms.',
            company: 'CodeSphere Labs',
            location: 'San Francisco, CA',
            website: 'https://codesphere.dev'
          },
          tagline: 'Autonomous AI Coding Infrastructure & High-Performance Distributed Systems',
          skills: ['TypeScript', 'Next.js 14', 'Python', 'FastAPI', 'Node.js', 'Git Smart HTTP', 'Docker', 'Distributed Systems'],
          languageStats: [
            { name: 'TypeScript', percentage: 65 },
            { name: 'Python', percentage: 25 },
            { name: 'Go', percentage: 10 }
          ],
          pinnedProjects: [
            {
              name: 'codesphere-core',
              slug: `${owner}/codesphere-core`,
              description: 'Production-grade distributed Git platform and developer intelligence engine with real Smart HTTP hosting.',
              language: 'TypeScript',
              stars: 142,
              forks: 18,
              demoUrl: `http://localhost:3000/${owner}/codesphere-core`
            },
            {
              name: 'ai-agent-nexus',
              slug: `${owner}/ai-agent-nexus`,
              description: 'Autonomous multi-agent orchestration framework for automated repository refactoring and AST intelligence.',
              language: 'Python',
              stars: 89,
              forks: 12,
              demoUrl: `http://localhost:3000/${owner}/ai-agent-nexus`
            }
          ],
          stats: {
            totalRepositories: 8,
            totalStars: 231,
            contributionsCount: 1248,
            globalRank: 'Top 1% Engineering'
          }
        });
      });
  }, [owner]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050806] text-[#f0f7f2] selection:bg-emerald-500/25 selection:text-emerald-200 relative overflow-x-hidden">
      {/* Portfolio Floating Toolbar */}
      <header className="sticky top-0 z-40 px-6 py-3 bg-[#050806]/85 backdrop-blur-xl border-b border-emerald-500/15 flex items-center justify-between shadow-sm">
        <a href="/" className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-2 hover:text-emerald-300 transition-colors">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>CODESPHERE PORTFOLIO</span>
        </a>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-all shadow-[0_1px_15px_rgba(16,185,129,0.3)]"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share Portfolio'}</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-16 space-y-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="relative group">
            <img
              src={portfolio?.developer?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={owner}
              className="w-32 h-32 rounded-2xl border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)] object-cover"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#050806] flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </span>
          </div>

          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-mono font-medium">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>{portfolio?.stats?.globalRank || 'Top 1% Engineering'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
              {portfolio?.developer?.name || owner}
            </h1>

            <p className="text-base font-sans font-medium bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
              {portfolio?.tagline}
            </p>

            <p className="text-xs text-[#91a897] max-w-2xl leading-relaxed">
              {portfolio?.developer?.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-mono text-[#91a897]">
              <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-emerald-400" /> {portfolio?.developer?.company}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> {portfolio?.developer?.location}</span>
            </div>
          </div>
        </div>

        {/* Stats Metrics Bar with GSAP Counters */}
        <GsapStagger className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <GsapGlowCard className="p-5 border-emerald-500/15 bg-[#080d0a]/80 text-center space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#91a897]">Contributions</span>
            <p className="text-3xl font-bold text-emerald-400 font-mono">
              <GsapCounter value={portfolio?.stats?.contributionsCount || 1248} duration={1.6} />
            </p>
          </GsapGlowCard>

          <GsapGlowCard className="p-5 border-emerald-500/15 bg-[#080d0a]/80 text-center space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#91a897]">Repositories</span>
            <p className="text-3xl font-bold text-white font-mono">
              <GsapCounter value={portfolio?.stats?.totalRepositories || 8} duration={1.2} />
            </p>
          </GsapGlowCard>

          <GsapGlowCard className="p-5 border-emerald-500/15 bg-[#080d0a]/80 text-center space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#91a897]">Stars Earned</span>
            <p className="text-3xl font-bold text-emerald-400 font-mono">
              <GsapCounter value={portfolio?.stats?.totalStars || 231} duration={1.4} />
            </p>
          </GsapGlowCard>

          <GsapGlowCard className="p-5 border-emerald-500/15 bg-[#080d0a]/80 text-center space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#91a897]">Architecture</span>
            <p className="text-2xl font-bold text-emerald-300 font-mono mt-1">DIAMOND</p>
          </GsapGlowCard>
        </GsapStagger>

        {/* Skills & Technologies */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <span>Architecture & Technology Stack</span>
          </h2>

          <div className="flex flex-wrap gap-2.5">
            {portfolio?.skills?.map((skill: string, idx: number) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 bg-[#080d0a] border border-emerald-500/15 rounded-lg text-xs font-mono text-[#d1e0d5] hover:border-emerald-500/40 hover:text-emerald-300 transition-all cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Showcase Projects */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <span>Featured Open Source Repositories</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio?.pinnedProjects?.map((project: any, idx: number) => (
              <GsapGlowCard
                key={idx}
                className="p-6 border-emerald-500/15 bg-[#080d0a]/80 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base text-white hover:text-emerald-300 transition-colors font-mono">
                    {project.name}
                  </h3>
                  <a
                    href={`/${project.slug}`}
                    className="text-[#91a897] hover:text-emerald-300 p-1 transition-colors"
                    title="View repository"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <p className="text-xs text-[#91a897] leading-relaxed">
                  {project.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-emerald-500/10 text-xs font-mono">
                  <div className="flex items-center gap-4 text-[#91a897]">
                    <span className="text-emerald-400 font-medium">{project.language}</span>
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-emerald-400" /> {project.stars}</span>
                    <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5 text-[#91a897]" /> {project.forks}</span>
                  </div>

                  <a
                    href={`/${project.slug}`}
                    className="text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
                  >
                    Browse Code →
                  </a>
                </div>
              </GsapGlowCard>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
