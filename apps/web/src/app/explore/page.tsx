'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { 
  Sparkles, 
  Search, 
  Star, 
  GitFork, 
  BookOpen, 
  Terminal, 
  TrendingUp,
  Tag
} from 'lucide-react';
import { fetchRepos } from '@/lib/api';
import { Repository } from '@/types';

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
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Marketplace Hero Header */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#161b22] via-[#101b2b] to-[#0d1117] border border-cyan-500/30 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>CodeSphere Project Marketplace</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white">
            Explore Open Source Repositories & AI Templates
          </h1>

          <p className="text-sm text-[#8b949e] max-w-2xl">
            Discover community projects, high-performance engines, and autonomous developer tools built on CodeSphere infrastructure.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by repository name, topic, or description..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Topics Filter */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
          {topics.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t === 'all' ? null : t)}
              className={`px-3.5 py-1.5 rounded-lg font-semibold capitalize transition-all ${
                (selectedTopic === t || (t === 'all' && !selectedTopic))
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-[#161b22] text-[#8b949e] hover:text-white border border-[#30363d]'
              }`}
            >
              #{t}
            </button>
          ))}
        </div>

        {/* Repositories Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(repo => (
            <div
              key={repo.slug}
              className="p-6 bg-[#161b22] border border-[#30363d] hover:border-cyan-500/50 rounded-2xl space-y-4 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <a
                  href={`/${repo.slug}`}
                  className="font-bold text-base text-white group-hover:text-cyan-400 transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>{repo.slug}</span>
                </a>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#21262d] text-[#8b949e]">
                  Public
                </span>
              </div>

              <p className="text-xs text-[#8b949e] leading-relaxed line-clamp-2">
                {repo.description}
              </p>

              {/* Topics */}
              <div className="flex flex-wrap gap-1.5">
                {repo.topics?.map(topic => (
                  <span
                    key={topic}
                    className="px-2 py-0.5 rounded bg-[#0d1117] text-indigo-300 border border-indigo-500/20 text-[10px] font-mono"
                  >
                    #{topic}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#21262d] text-xs text-[#8b949e]">
                <div className="flex items-center gap-4">
                  <span className="text-white font-medium">{repo.language}</span>
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> {repo.starsCount}</span>
                  <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5" /> {repo.forksCount}</span>
                </div>

                <a
                  href={`/${repo.slug}`}
                  className="text-xs font-semibold text-cyan-400 hover:underline"
                >
                  View Repo →
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
