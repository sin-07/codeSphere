'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Globe, Lock } from 'lucide-react';
import { createRepository } from '@/lib/api';

export default function NewRepositoryPage() {
  const router = useRouter();
  const [repoName, setRepoName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
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
    <div className="min-h-screen bg-[#050806] text-[#f0f7f2] flex flex-col selection:bg-emerald-500/25 selection:text-emerald-200">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 md:px-8 py-10 space-y-6 relative z-10">
        <div className="pb-4 border-b border-emerald-500/15 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">Create a new repository</h1>
          <p className="text-xs text-[#91a897]">
            A repository contains all project files, revision history, and collaborative tools.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-lg text-rose-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 bg-[#080d0a]/85 backdrop-blur-xl border border-emerald-500/15 rounded-2xl space-y-6 shadow-sm">
          {/* Owner / Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-white mb-1">Owner</label>
              <div className="p-2.5 bg-[#050806] border border-emerald-500/20 rounded-lg text-xs font-mono text-emerald-400">
                demo-dev
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-white mb-1">Repository name</label>
              <input
                value={repoName}
                onChange={(e) => setRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="my-awesome-engine"
                className="w-full p-2.5 bg-[#050806] border border-emerald-500/20 rounded-lg text-xs text-white placeholder-[#91a897]/60 focus:outline-none focus:border-emerald-500/50 font-mono shadow-inner"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1">
              Description <span className="text-[#91a897] font-normal">(optional)</span>
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of this project..."
              className="w-full p-2.5 bg-[#050806] border border-emerald-500/20 rounded-lg text-xs text-white placeholder-[#91a897]/60 focus:outline-none focus:border-emerald-500/50 shadow-inner"
            />
          </div>

          {/* Visibility */}
          <div className="space-y-3 pt-2 border-t border-emerald-500/10">
            <label className="block text-xs font-semibold text-white">Visibility</label>

            <label
              onClick={() => setIsPrivate(false)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                !isPrivate ? 'bg-emerald-500/15 border-emerald-500/40 shadow-sm' : 'bg-[#050806] border-emerald-500/15 hover:border-emerald-500/30'
              }`}
            >
              <Globe className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-white">Public</p>
                <span className="text-[#91a897]">Anyone on the internet can clone and see this repository.</span>
              </div>
            </label>

            <label
              onClick={() => setIsPrivate(true)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                isPrivate ? 'bg-emerald-500/15 border-emerald-500/40 shadow-sm' : 'bg-[#050806] border-emerald-500/15 hover:border-emerald-500/30'
              }`}
            >
              <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-white">Private</p>
                <span className="text-[#91a897]">You choose who can see and commit to this repository.</span>
              </div>
            </label>
          </div>

          <div className="pt-2 border-t border-emerald-500/10 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !repoName.trim()}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs text-white rounded-lg transition-all shadow-[0_1px_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
            >
              {isSubmitting ? 'Initializing bare Git repository...' : 'Create repository'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
