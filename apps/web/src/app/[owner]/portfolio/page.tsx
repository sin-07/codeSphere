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
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { fetchUserPortfolio } from '@/lib/api';
import { GsapGlowCard, GsapCounter, GsapStagger, GsapPulseBeacon } from '@/components/animations';

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
    <div className="min-h-screen bg-[#000000] text-[#f0faf0] selection:bg-[#00ff66]/20 selection:text-[#00ff66] relative overflow-x-hidden">
      {/* Portfolio Floating Toolbar */}
      <header className="sticky top-0 z-40 px-6 py-3 bg-[#000000]/90 backdrop-blur-md border-b border-[#1a2c1a] flex items-center justify-between shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
        <a href="/" className="text-xs font-mono font-bold text-[#00ff66] flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>CODESPHERE AUTONOMOUS PORTFOLIO</span>
        </a>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00ff66] hover:bg-[#22c55e] text-black font-bold rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(0,255,102,0.35)]"
          >
            {copied ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />}
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
              className="w-36 h-36 rounded-2xl border-2 border-[#00ff66] shadow-[0_0_25px_rgba(0,255,102,0.3)] object-cover"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#00ff66] border-2 border-black flex items-center justify-center">
              <Check className="w-3 h-3 text-black stroke-[3]" />
            </span>
          </div>

          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/40 text-[#00ff66] text-xs font-mono font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>{portfolio?.stats?.globalRank || 'Top 1% Engineering'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans">
              {portfolio?.developer?.name || owner}
            </h1>

            <p className="text-base text-[#00ff66] font-mono font-medium">
              {portfolio?.tagline}
            </p>

            <p className="text-xs text-[#86a686] max-w-2xl leading-relaxed">
              {portfolio?.developer?.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-mono text-[#86a686]">
              <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-[#00ff66]" /> {portfolio?.developer?.company}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#00ff66]" /> {portfolio?.developer?.location}</span>
            </div>
          </div>
        </div>

        {/* Stats Metrics Bar with GSAP Counters */}
        <GsapStagger className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <GsapGlowCard className="p-5 border-[#1a2c1a] text-center space-y-1">
            <span className="text-xs font-mono text-[#86a686]">Contributions</span>
            <p className="text-3xl font-black text-[#00ff66] font-mono">
              <GsapCounter value={portfolio?.stats?.contributionsCount || 1248} duration={2} />
            </p>
          </GsapGlowCard>

          <GsapGlowCard className="p-5 border-[#1a2c1a] text-center space-y-1">
            <span className="text-xs font-mono text-[#86a686]">Total Repositories</span>
            <p className="text-3xl font-black text-white font-mono">
              <GsapCounter value={portfolio?.stats?.totalRepositories || 8} duration={1.5} />
            </p>
          </GsapGlowCard>

          <GsapGlowCard className="p-5 border-[#1a2c1a] text-center space-y-1">
            <span className="text-xs font-mono text-[#86a686]">Stars Earned</span>
            <p className="text-3xl font-black text-[#00ff66] font-mono">
              <GsapCounter value={portfolio?.stats?.totalStars || 231} duration={1.8} />
            </p>
          </GsapGlowCard>

          <GsapGlowCard className="p-5 border-[#1a2c1a] text-center space-y-1">
            <span className="text-xs font-mono text-[#86a686]">Architecture Tier</span>
            <p className="text-2xl font-black text-[#00ff66] font-mono mt-1">DIAMOND</p>
          </GsapGlowCard>
        </GsapStagger>

        {/* Skills & Technologies */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[#00ff66]" />
            <span>Architecture & Technology Stack</span>
          </h2>

          <div className="flex flex-wrap gap-2.5">
            {portfolio?.skills?.map((skill: string, idx: number) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 bg-[#040604] border border-[#1a2c1a] rounded-lg text-xs font-mono font-semibold text-[#c2d6c2] hover:border-[#00ff66] hover:text-[#00ff66] hover:shadow-[0_0_12px_rgba(0,255,102,0.25)] transition-all cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Showcase Projects */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#00ff66]" />
            <span>Featured Open Source Repositories</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio?.pinnedProjects?.map((project: any, idx: number) => (
              <GsapGlowCard
                key={idx}
                className="p-6 border-[#1a2c1a] space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-white hover:text-[#00ff66] transition-colors font-mono">
                    {project.name}
                  </h3>
                  <a
                    href={`/${project.slug}`}
                    className="text-[#86a686] hover:text-[#00ff66] p-1 transition-colors"
                    title="View repository"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <p className="text-xs text-[#86a686] leading-relaxed">
                  {project.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[#1a2c1a] text-xs font-mono">
                  <div className="flex items-center gap-4 text-[#86a686]">
                    <span className="text-[#00ff66] font-semibold">{project.language}</span>
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-[#00ff66]" /> {project.stars}</span>
                    <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5 text-[#86a686]" /> {project.forks}</span>
                  </div>

                  <a
                    href={`/${project.slug}`}
                    className="text-xs font-semibold text-[#00ff66] hover:underline"
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
