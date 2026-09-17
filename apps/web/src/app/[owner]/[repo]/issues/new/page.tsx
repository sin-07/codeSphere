'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { RepoHeader } from '@/components/RepoHeader';
import { AlertCircle, Tag } from 'lucide-react';
import { createIssue } from '@/lib/api';

export default function NewIssuePage() {
  const params = useParams();
  const router = useRouter();
  const owner = params.owner as string;
  const repo = params.repo as string;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [labels, setLabels] = useState<string[]>(['enhancement']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableLabels = ['bug', 'enhancement', 'documentation', 'security', 'performance'];

  const toggleLabel = (label: string) => {
    setLabels(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const issue = await createIssue(owner, repo, {
        title: title.trim(),
        description: description.trim(),
        labels
      });
      router.push(`/${owner}/${repo}/issues/${issue.number}`);
    } catch (err: any) {
      alert('Failed to create issue: ' + (err.response?.data?.error || err.message));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      <Navbar />
      <RepoHeader owner={owner} repo={repo} activeTab="issues" />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 md:px-8 py-8 space-y-6">
        <div className="pb-4 border-b border-[#30363d] space-y-1">
          <h1 className="text-2xl font-bold text-white">Create a new issue</h1>
          <p className="text-xs text-[#8b949e]">
            Track bugs, feature requests, and architectural improvements.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 bg-[#161b22] border border-[#30363d] rounded-2xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title for this issue..."
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
              placeholder="Describe the bug or feature request in detail..."
              className="w-full p-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400 resize-none font-sans"
            />
          </div>

          {/* Labels selector */}
          <div className="space-y-1.5 pt-2 border-t border-[#21262d]">
            <label className="block text-xs font-semibold text-[#8b949e]">Labels</label>
            <div className="flex flex-wrap gap-2">
              {availableLabels.map(l => (
                <button
                  type="button"
                  key={l}
                  onClick={() => toggleLabel(l)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    labels.includes(l)
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                      : 'bg-[#0d1117] text-[#8b949e] border-[#30363d]'
                  }`}
                >
                  #{l}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-[#21262d]">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-6 py-2 bg-[#238636] hover:bg-[#2ea043] font-semibold text-xs text-white rounded-lg transition-colors shadow-lg shadow-emerald-900/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit new issue'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
