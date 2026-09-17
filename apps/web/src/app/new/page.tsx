'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { BookOpen, Globe, Lock, Check } from 'lucide-react';
import { createRepository } from '@/lib/api';

export default function NewRepositoryPage() {
  const router = useRouter();
  const [repoName, setRepoName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [initReadme, setInitReadme] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoName.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const created = await createRepository({
        name: repoName.trim(),
        description: description.trim(),
        isPrivate,
        defaultBranch: 'main'
      });
      router.push(`/${created.slug}`);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 md:px-8 py-10 space-y-6">
        <div className="pb-4 border-b border-[#30363d] space-y-1">
          <h1 className="text-2xl font-bold text-white">Create a new repository</h1>
          <p className="text-xs text-[#8b949e]">
            A repository contains all project files, revision history, and collaborative tools.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-lg text-rose-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 bg-[#161b22] border border-[#30363d] rounded-2xl space-y-6">
          {/* Owner / Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-white mb-1">Owner</label>
              <div className="p-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs font-mono text-cyan-400">
                demo-dev
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-white mb-1">Repository name</label>
              <input
                value={repoName}
                onChange={(e) => setRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="my-awesome-engine"
                className="w-full p-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1">
              Description <span className="text-[#8b949e] font-normal">(optional)</span>
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of this project..."
              className="w-full p-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Visibility */}
          <div className="space-y-3 pt-2 border-t border-[#21262d]">
            <label className="block text-xs font-semibold text-white">Visibility</label>

            <label
              onClick={() => setIsPrivate(false)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                !isPrivate ? 'bg-[#21262d] border-cyan-400/50' : 'bg-[#0d1117] border-[#30363d]'
              }`}
            >
              <Globe className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-white">Public</p>
                <span className="text-[#8b949e]">Anyone on the internet can clone and see this repository.</span>
              </div>
            </label>

            <label
              onClick={() => setIsPrivate(true)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                isPrivate ? 'bg-[#21262d] border-indigo-400/50' : 'bg-[#0d1117] border-[#30363d]'
              }`}
            >
              <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-white">Private</p>
                <span className="text-[#8b949e]">You choose who can see and commit to this repository.</span>
              </div>
            </label>
          </div>

          <div className="pt-2 border-t border-[#21262d] flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !repoName.trim()}
              className="px-6 py-2.5 bg-[#238636] hover:bg-[#2ea043] font-semibold text-xs text-white rounded-lg transition-colors shadow-lg shadow-emerald-900/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Initializing bare Git repository...' : 'Create repository'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
