'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { RepoHeader } from '@/components/RepoHeader';
import { 
  GitPullRequest, 
  CheckCircle, 
  XCircle, 
  GitMerge, 
  MessageSquare, 
  Plus, 
  Search 
} from 'lucide-react';
import { fetchPullRequests } from '@/lib/api';
import { PullRequest } from '@/types';

export default function PullRequestsListPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;

  const [pulls, setPulls] = useState<PullRequest[]>([]);
  const [filter, setFilter] = useState<'open' | 'closed' | 'all'>('open');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPullRequests(owner, repo, filter)
      .then(data => setPulls(data || []))
      .catch(() => {
        setPulls([
          {
            _id: '1',
            repoSlug: `${owner}/${repo}`,
            number: 1,
            title: 'Integrate AI Repository Brain AST Service',
            description: 'Introduces RepositoryBrain class for real-time AST syntax analysis and complexity scoring.',
            author: 'demo-dev',
            baseBranch: 'main',
            headBranch: 'feature/ai-brain',
            status: 'open',
            diffStats: { additions: 7, deletions: 0, filesChanged: 1 },
            reviewers: [{ username: 'demo-dev', status: 'approved', updatedAt: new Date().toISOString() }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]);
      });
  }, [owner, repo, filter]);

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      <Navbar />
      <RepoHeader owner={owner} repo={repo} activeTab="pulls" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Top Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-[#161b22] p-1 border border-[#30363d] rounded-lg text-xs">
            <button
              onClick={() => setFilter('open')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold ${
                filter === 'open' ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-white'
              }`}
            >
              <GitPullRequest className="w-3.5 h-3.5 text-emerald-400" />
              <span>Open</span>
            </button>
            <button
              onClick={() => setFilter('closed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold ${
                filter === 'closed' ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-white'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>Closed</span>
            </button>
          </div>

          <a
            href={`/${owner}/${repo}/pulls/new`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#238636] hover:bg-[#2ea043] rounded-md text-xs font-semibold text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New pull request</span>
          </a>
        </div>

        {/* PR List Container */}
        <div className="border border-[#30363d] rounded-xl overflow-hidden bg-[#161b22]">
          <div className="p-3 bg-[#1c2128] border-b border-[#30363d] text-xs text-[#8b949e] font-semibold">
            {pulls.length} Pull Requests
          </div>

          <div className="divide-y divide-[#21262d]">
            {pulls.length === 0 ? (
              <div className="p-12 text-center text-[#8b949e] text-sm">
                No pull requests found.
              </div>
            ) : (
              pulls.map((pr) => (
                <div key={pr.number} className="p-4 hover:bg-[#21262d]/40 transition-colors flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {pr.status === 'open' ? (
                      <GitPullRequest className="w-4 h-4 text-emerald-400 mt-1" />
                    ) : (
                      <GitMerge className="w-4 h-4 text-purple-400 mt-1" />
                    )}

                    <div className="space-y-1">
                      <a
                        href={`/${owner}/${repo}/pull/${pr.number}`}
                        className="font-semibold text-white hover:text-indigo-400 text-sm transition-colors"
                      >
                        {pr.title}
                      </a>
                      <p className="text-xs text-[#8b949e]">
                        #{pr.number} opened by <span className="text-[#c9d1d9]">{pr.author}</span> • {pr.headBranch} into {pr.baseBranch}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-emerald-400">+{pr.diffStats?.additions || 0}</span>
                    <span className="text-rose-400">-{pr.diffStats?.deletions || 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
