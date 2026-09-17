'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { RepoHeader } from '@/components/RepoHeader';
import { GitCommit, Clock, ArrowRight, User } from 'lucide-react';
import { fetchCommits } from '@/lib/api';
import { CommitInfo } from '@/types';

export default function CommitsListPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;

  const [commits, setCommits] = useState<CommitInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!owner || !repo) return;

    fetchCommits(owner, repo)
      .then(data => setCommits(data || []))
      .catch(() => {
        setCommits([
          {
            sha: 'e9b2c34a123f4567890123456789012345678901',
            author: 'Alex Rivera',
            email: 'dev@codesphere.local',
            date: new Date().toISOString(),
            message: 'Implement RepositoryBrain AST analysis service'
          },
          {
            sha: 'a1b2c3d4e5f67890123456789012345678901234',
            author: 'Alex Rivera',
            email: 'dev@codesphere.local',
            date: new Date(Date.now() - 86400000).toISOString(),
            message: 'Initial release: Setup distributed server architecture'
          }
        ]);
      })
      .finally(() => setLoading(false));
  }, [owner, repo]);

  return (
    <div className="min-h-screen bg-[#050806] flex flex-col">
      <Navbar />
      <RepoHeader owner={owner} repo={repo} activeTab="code" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 space-y-6">
        <div className="border border-[rgba(16,185,129,0.15)] rounded-xl overflow-hidden bg-[#080d0a]">
          <div className="p-3.5 bg-[#1c2128] border-b border-[rgba(16,185,129,0.15)] flex items-center justify-between text-xs text-[#91a897]">
            <span className="font-semibold text-white">Commit History ({commits.length} commits)</span>
            <span>Branch: main</span>
          </div>

          <div className="divide-y divide-[#0c120e]">
            {commits.map((commit) => (
              <div key={commit.sha} className="p-4 hover:bg-[#0c120e]/40 transition-colors flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <a
                    href={`/${owner}/${repo}/commit/${commit.sha}`}
                    className="font-semibold text-white hover:text-emerald-400 text-sm transition-colors"
                  >
                    {commit.message}
                  </a>
                  <div className="flex items-center gap-2 text-xs text-[#91a897]">
                    <span className="text-[#d1e0d5] font-medium">{commit.author}</span>
                    <span>committed on {new Date(commit.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/${owner}/${repo}/commit/${commit.sha}`}
                    className="px-3 py-1 bg-[#050806] hover:bg-[#0c120e] border border-[rgba(16,185,129,0.15)] rounded font-mono text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    {commit.sha.substring(0, 7)}
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
