'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { RepoHeader } from '@/components/RepoHeader';
import { GitPullRequest, ArrowLeft, GitBranch } from 'lucide-react';
import { fetchBranches, createPullRequest } from '@/lib/api';

export default function NewPullRequestPage() {
  const params = useParams();
  const router = useRouter();
  const owner = params.owner as string;
  const repo = params.repo as string;

  const [branches, setBranches] = useState<string[]>(['main']);
  const [baseBranch, setBaseBranch] = useState('main');
  const [headBranch, setHeadBranch] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!owner || !repo) return;
    fetchBranches(owner, repo).then(b => {
      if (b && b.length) {
        setBranches(b);
        const nonMain = b.find(x => x !== 'main');
        if (nonMain) setHeadBranch(nonMain);
      }
    }).catch(() => {});
  }, [owner, repo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !headBranch) return;

    setIsSubmitting(true);
    try {
      const pr = await createPullRequest(owner, repo, {
        title: title.trim(),
        description: description.trim(),
        baseBranch,
        headBranch
      });
      router.push(`/${owner}/${repo}/pull/${pr.number}`);
    } catch (err: any) {
      alert('Failed to create PR: ' + (err.response?.data?.error || err.message));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      <Navbar />
      <RepoHeader owner={owner} repo={repo} activeTab="pulls" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-8 space-y-6">
        <div className="pb-4 border-b border-[#30363d] space-y-1">
          <h1 className="text-2xl font-bold text-white">Open a pull request</h1>
          <p className="text-xs text-[#8b949e]">
            Compare changes across branches and request code review from your team.
          </p>
        </div>

        {/* Branch Selector Bar */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-[#161b22] border border-[#30363d] rounded-xl text-xs">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            <span>Comparing:</span>
          </span>

          <div className="flex items-center gap-2">
            <span className="text-[#8b949e]">base:</span>
            <select
              value={baseBranch}
              onChange={(e) => setBaseBranch(e.target.value)}
              className="p-1.5 bg-[#0d1117] border border-[#30363d] rounded text-white font-mono text-xs focus:outline-none"
            >
              {branches.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <span className="text-[#8b949e]">←</span>

          <div className="flex items-center gap-2">
            <span className="text-[#8b949e]">compare:</span>
            <select
              value={headBranch}
              onChange={(e) => setHeadBranch(e.target.value)}
              className="p-1.5 bg-[#0d1117] border border-[#30363d] rounded text-cyan-300 font-mono text-xs focus:outline-none"
            >
              {branches.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 bg-[#161b22] border border-[#30363d] rounded-2xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title for this pull request..."
              className="w-full p-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1">Description (Markdown supported)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Describe your architectural changes and testing steps..."
              className="w-full p-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400 resize-none font-sans"
            />
          </div>

          <div className="flex justify-end pt-2 border-t border-[#21262d]">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-6 py-2 bg-[#238636] hover:bg-[#2ea043] font-semibold text-xs text-white rounded-lg transition-colors shadow-lg shadow-emerald-900/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Opening PR...' : 'Create pull request'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
