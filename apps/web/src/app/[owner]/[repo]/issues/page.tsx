'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { RepoHeader } from '@/components/RepoHeader';
import { 
  AlertCircle, 
  CheckCircle, 
  Plus, 
  MessageSquare, 
  Tag, 
  Search 
} from 'lucide-react';
import { fetchIssues } from '@/lib/api';
import { Issue } from '@/types';

export default function IssuesListPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;

  const [issues, setIssues] = useState<Issue[]>([]);
  const [statusFilter, setStatusFilter] = useState<'open' | 'closed' | 'all'>('open');

  useEffect(() => {
    fetchIssues(owner, repo, statusFilter)
      .then(data => setIssues(data || []))
      .catch(() => {
        setIssues([
          {
            _id: '1',
            repoSlug: `${owner}/${repo}`,
            number: 1,
            title: 'Enhance git-receive-pack post-receive hook performance',
            description: 'Optimize post-receive trigger execution using asynchronous background worker queue.',
            author: 'demo-dev',
            status: 'open',
            labels: ['enhancement', 'performance', 'git-engine'],
            assignees: ['demo-dev'],
            milestone: 'v1.1.0',
            commentsCount: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]);
      });
  }, [owner, repo, statusFilter]);

  return (
    <div className="min-h-screen bg-[#050806] flex flex-col">
      <Navbar />
      <RepoHeader owner={owner} repo={repo} activeTab="issues" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-[#080d0a] p-1 border border-[rgba(16,185,129,0.15)] rounded-lg text-xs">
            <button
              onClick={() => setStatusFilter('open')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold ${
                statusFilter === 'open' ? 'bg-[#0c120e] text-white' : 'text-[#91a897] hover:text-white'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Open</span>
            </button>
            <button
              onClick={() => setStatusFilter('closed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold ${
                statusFilter === 'closed' ? 'bg-[#0c120e] text-white' : 'text-[#91a897] hover:text-white'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>Closed</span>
            </button>
          </div>

          <a
            href={`/${owner}/${repo}/issues/new`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-md text-xs font-semibold text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New issue</span>
          </a>
        </div>

        {/* Issue List */}
        <div className="border border-[rgba(16,185,129,0.15)] rounded-xl overflow-hidden bg-[#080d0a]">
          <div className="p-3 bg-[#1c2128] border-b border-[rgba(16,185,129,0.15)] text-xs text-[#91a897] font-semibold">
            {issues.length} Issues
          </div>

          <div className="divide-y divide-[#0c120e]">
            {issues.length === 0 ? (
              <div className="p-12 text-center text-[#91a897] text-sm">
                No issues match your criteria.
              </div>
            ) : (
              issues.map((issue) => (
                <div key={issue.number} className="p-4 hover:bg-[#0c120e]/40 transition-colors flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {issue.status === 'open' ? (
                      <AlertCircle className="w-4 h-4 text-emerald-400 mt-1" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-purple-400 mt-1" />
                    )}

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={`/${owner}/${repo}/issues/${issue.number}`}
                          className="font-semibold text-white hover:text-emerald-400 text-sm transition-colors"
                        >
                          {issue.title}
                        </a>
                        {issue.labels?.map((label, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0c120e] text-emerald-300 border border-[rgba(16,185,129,0.15)]"
                          >
                            {label}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-[#91a897]">
                        #{issue.number} opened by <span className="text-[#d1e0d5]">{issue.author}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-[#91a897]">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{issue.commentsCount || 0}</span>
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
