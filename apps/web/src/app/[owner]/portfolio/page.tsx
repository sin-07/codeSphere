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
  Palette 
} from 'lucide-react';
import { fetchUserPortfolio } from '@/lib/api';

export default function DeveloperPortfolioPage() {
  const params = useParams();
  const owner = params.owner as string;

  const [portfolio, setPortfolio] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<'midnight' | 'cyber' | 'emerald'>('midnight');

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
            bio: 'Principal Systems Architect & Open Source Maintainer. Engineering high-throughput distributed systems and AI developer tools.',
            company: 'CodeSphere Labs',
            location: 'San Francisco, CA',
            website: 'https://codesphere.dev'
          },
          tagline: 'Crafting High-Performance Distributed Systems & AI Platforms',
          skills: ['TypeScript', 'Next.js', 'Python', 'FastAPI', 'Node.js', 'Git Internals', 'Docker', 'Distributed Systems'],
          languageStats: [
            { name: 'TypeScript', percentage: 65 },
            { name: 'Python', percentage: 25 },
            { name: 'Go', percentage: 10 }
          ],
          pinnedProjects: [
            {
              name: 'codesphere-core',
              slug: `${owner}/codesphere-core`,
              description: 'Distributed Git engine and developer intelligence platform with real HTTP protocol.',
              language: 'TypeScript',
              stars: 142,
              forks: 18,
              demoUrl: `http://localhost:3000/${owner}/codesphere-core`
            },
            {
              name: 'ai-agent-nexus',
              slug: `${owner}/ai-agent-nexus`,
              description: 'Autonomous multi-agent orchestration framework for automated repository refactoring.',
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

  const themeClasses = {
    midnight: 'bg-[#090d13] text-[#f0f6fc]',
    cyber: 'bg-[#0f0c1b] text-[#f0f6fc]',
    emerald: 'bg-[#061412] text-[#f0f6fc]'
  }[theme];

  return (
    <div className={`min-h-screen ${themeClasses} transition-colors duration-500 selection:bg-indigo-600`}>
      {/* Portfolio Floating Toolbar */}
      <header className="sticky top-0 z-40 px-6 py-3 bg-[#161b22]/80 backdrop-blur-md border-b border-[#30363d]/60 flex items-center justify-between">
        <a href="/" className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>Powered by CodeSphere Portfolio</span>
        </a>

        <div className="flex items-center gap-3">
          {/* Theme Switcher */}
          <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-lg border border-[#30363d] text-xs">
            <button
              onClick={() => setTheme('midnight')}
              className={`px-2.5 py-1 rounded ${theme === 'midnight' ? 'bg-[#21262d] text-cyan-400 font-semibold' : 'text-[#8b949e]'}`}
            >
              Midnight
            </button>
            <button
              onClick={() => setTheme('cyber')}
              className={`px-2.5 py-1 rounded ${theme === 'cyber' ? 'bg-[#21262d] text-purple-400 font-semibold' : 'text-[#8b949e]'}`}
            >
              Cyber
            </button>
            <button
              onClick={() => setTheme('emerald')}
              className={`px-2.5 py-1 rounded ${theme === 'emerald' ? 'bg-[#21262d] text-emerald-400 font-semibold' : 'text-[#8b949e]'}`}
            >
              Emerald
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share Portfolio'}</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-16 space-y-16">
        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <img
            src={portfolio?.developer?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
            alt={owner}
            className="w-36 h-36 rounded-2xl border-2 border-cyan-400/60 shadow-2xl object-cover"
          />

          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>{portfolio?.stats?.globalRank || 'Top 1% Engineering'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {portfolio?.developer?.name || owner}
            </h1>

            <p className="text-base text-cyan-300 font-medium">
              {portfolio?.tagline}
            </p>

            <p className="text-xs text-[#8b949e] max-w-2xl leading-relaxed">
              {portfolio?.developer?.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-[#8b949e]">
              <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" /> {portfolio?.developer?.company}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {portfolio?.developer?.location}</span>
            </div>
          </div>
        </div>

        {/* Stats Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 bg-[#161b22]/70 border border-[#30363d] rounded-2xl text-center space-y-1">
            <span className="text-xs text-[#8b949e]">Contributions</span>
            <p className="text-2xl font-bold text-emerald-400 font-mono">{portfolio?.stats?.contributionsCount || 1248}</p>
          </div>
          <div className="p-5 bg-[#161b22]/70 border border-[#30363d] rounded-2xl text-center space-y-1">
            <span className="text-xs text-[#8b949e]">Total Repositories</span>
            <p className="text-2xl font-bold text-cyan-400 font-mono">{portfolio?.stats?.totalRepositories || 8}</p>
          </div>
          <div className="p-5 bg-[#161b22]/70 border border-[#30363d] rounded-2xl text-center space-y-1">
            <span className="text-xs text-[#8b949e]">Stars Earned</span>
            <p className="text-2xl font-bold text-amber-400 font-mono">{portfolio?.stats?.totalStars || 231}</p>
          </div>
          <div className="p-5 bg-[#161b22]/70 border border-[#30363d] rounded-2xl text-center space-y-1">
            <span className="text-xs text-[#8b949e]">Architecture Rank</span>
            <p className="text-2xl font-bold text-purple-400 font-mono">Diamond</p>
          </div>
        </div>

        {/* Skills & Technologies */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <span>Core Architecture & Engineering Skills</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {portfolio?.skills?.map((skill: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-[#161b22] border border-[#30363d] rounded-lg text-xs font-semibold text-slate-200 hover:border-cyan-400/50 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Showcase Projects */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <span>Featured Open Source Projects</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio?.pinnedProjects?.map((project: any, idx: number) => (
              <div
                key={idx}
                className="p-6 bg-[#161b22]/80 border border-[#30363d] hover:border-indigo-500/50 rounded-2xl space-y-4 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-white group-hover:text-cyan-400 transition-colors">
                    {project.name}
                  </h3>
                  <a
                    href={`/${project.slug}`}
                    className="text-[#8b949e] hover:text-white p-1"
                    title="View repository"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <p className="text-xs text-[#8b949e] leading-relaxed">
                  {project.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[#21262d] text-xs">
                  <div className="flex items-center gap-4 text-[#8b949e]">
                    <span className="text-indigo-400 font-semibold">{project.language}</span>
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> {project.stars}</span>
                    <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5" /> {project.forks}</span>
                  </div>

                  <a
                    href={`/${project.slug}`}
                    className="text-xs font-semibold text-cyan-400 hover:underline"
                  >
                    Browse Code →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
