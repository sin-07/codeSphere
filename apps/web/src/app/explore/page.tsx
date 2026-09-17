'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { 
  Sparkles, 
  Search, 
  Star, 
  GitFork, 
  BookOpen, 
  TrendingUp,
} from 'lucide-react';
import { fetchRepos } from '@/lib/api';
import { Repository } from '@/types';
import { GsapGlowCard, GsapStagger } from '@/components/animations';

export default function ExploreMarketplacePage() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  useEffect(() => {
    fetchRepos()
      .then(data => setRepos(data || []))
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
      });
  }, []);

  const topics = ['all', 'ai', 'git', 'typescript', 'python', 'devtools'];

  const filtered = repos.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    const matchesTopic = !selectedTopic || selectedTopic === 'all' || r.topics?.includes(selectedTopic);
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="min-h-screen bg-[#050806] text-[#f0f7f2] flex flex-col selection:bg-emerald-500/25 selection:text-emerald-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 space-y-8 relative z-10">
        {/* Marketplace Hero Header */}
        <div className="p-8 rounded-2xl bg-[#080d0a]/85 backdrop-blur-xl border border-emerald-500/20 space-y-4 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-xs font-mono font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>CodeSphere Project Marketplace</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
            Explore Open Source Repositories & AI Templates
          </h1>

          <p className="text-sm text-[#91a897] max-w-2xl leading-relaxed">
            Discover community projects, high-performance engines, and autonomous developer tools built on CodeSphere infrastructure.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by repository name, topic, or description..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#050806] border border-emerald-500/20 rounded-xl text-xs text-white placeholder-[#91a897]/60 focus:outline-none focus:border-emerald-500/50 shadow-inner"
            />
          </div>
        </div>

        {/* Topics Filter */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
          {topics.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t === 'all' ? null : t)}
              className={`px-3.5 py-1.5 rounded-lg font-medium capitalize transition-all ${
                (selectedTopic === t || (t === 'all' && !selectedTopic))
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[#0c120e] text-[#91a897] hover:text-white border border-emerald-500/15'
              }`}
            >
              #{t}
            </button>
          ))}
        </div>

        {/* Repositories Cards Grid */}
        <GsapStagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(repo => (
            <GsapGlowCard
              key={repo.slug}
              className="p-6 bg-[#080d0a]/80 border border-emerald-500/15 hover:border-emerald-500/40 rounded-2xl space-y-4 transition-all group"
            >
              <div className="flex items-center justify-between">
                <a
                  href={`/${repo.slug}`}
                  className="font-semibold text-base text-white group-hover:text-emerald-300 transition-colors flex items-center gap-2 font-mono"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>{repo.slug}</span>
                </a>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Public
                </span>
              </div>

              <p className="text-xs text-[#91a897] leading-relaxed line-clamp-2">
                {repo.description}
              </p>

              {/* Topics */}
              <div className="flex flex-wrap gap-1.5">
                {repo.topics?.map(topic => (
                  <span
                    key={topic}
                    className="px-2 py-0.5 rounded-md bg-[#050806] text-emerald-300 border border-emerald-500/20 text-[10px] font-mono"
                  >
                    #{topic}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-emerald-500/10 text-xs text-[#91a897]">
                <div className="flex items-center gap-4 font-mono">
                  <span className="text-emerald-400 font-medium">{repo.language}</span>
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-emerald-400" /> {repo.starsCount}</span>
                  <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5 text-[#91a897]" /> {repo.forksCount}</span>
                </div>

                <a
                  href={`/${repo.slug}`}
                  className="text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
                >
                  View Repo →
                </a>
              </div>
            </GsapGlowCard>
          ))}
        </GsapStagger>
      </main>
    </div>
  );
}
