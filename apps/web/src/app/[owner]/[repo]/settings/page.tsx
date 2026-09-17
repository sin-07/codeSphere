'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { RepoHeader } from '@/components/RepoHeader';
import { 
  Settings, 
  ShieldCheck, 
  Users, 
  Trash2, 
  AlertTriangle, 
  Check, 
  Lock, 
  GitBranch 
} from 'lucide-react';

export default function RepoSettingsPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;

  const [repoName, setRepoName] = useState(repo);
  const [description, setDescription] = useState('Distributed Git engine and developer intelligence platform with real HTTP protocol.');
  const [defaultBranch, setDefaultBranch] = useState('main');
  const [isPrivate, setIsPrivate] = useState(false);
  const [requirePR, setRequirePR] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050806] flex flex-col">
      <Navbar />
      <RepoHeader owner={owner} repo={repo} activeTab="settings" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(16,185,129,0.15)]">
          <div>
            <h1 className="text-xl font-bold text-white">Repository Settings</h1>
            <p className="text-xs text-[#91a897]">Configure access control, branch protection, and general parameters.</p>
          </div>
          {savedSuccess && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold animate-fadeIn">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Saved
            </span>
          )}
        </div>

        {/* General Settings */}
        <form onSubmit={handleSave} className="p-6 bg-[#080d0a] border border-[rgba(16,185,129,0.15)] rounded-2xl space-y-4">
          <h2 className="font-bold text-base text-white">General Information</h2>

          <div>
            <label className="block text-xs text-[#91a897] mb-1 font-medium">Repository Name</label>
            <input
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="w-full p-2.5 bg-[#050806] border border-[rgba(16,185,129,0.15)] rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500/50 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs text-[#91a897] mb-1 font-medium">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-[#050806] border border-[rgba(16,185,129,0.15)] rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs text-[#91a897] mb-1 font-medium">Default Branch</label>
            <input
              value={defaultBranch}
              onChange={(e) => setDefaultBranch(e.target.value)}
              className="w-full p-2.5 bg-[#050806] border border-[rgba(16,185,129,0.15)] rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500/50 font-mono"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded-lg transition-colors"
          >
            Save general changes
          </button>
        </form>

        {/* Branch Protection Rules */}
        <div className="p-6 bg-[#080d0a] border border-[rgba(16,185,129,0.15)] rounded-2xl space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-base text-white">Branch Protection Rules (main)</h2>
          </div>

          <div className="space-y-3 text-xs text-[#d1e0d5]">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={requirePR}
                onChange={(e) => setRequirePR(e.target.checked)}
                className="w-4 h-4 rounded border-[rgba(16,185,129,0.15)] bg-[#050806] text-indigo-600 focus:ring-0"
              />
              <span>Require a pull request before merging</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-[rgba(16,185,129,0.15)] bg-[#050806] text-indigo-600 focus:ring-0"
              />
              <span>Require status checks to pass before merging (CI Build & AI Security Gate)</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-[rgba(16,185,129,0.15)] bg-[#050806] text-indigo-600 focus:ring-0"
              />
              <span>Require autonomous AI PR Risk evaluation score &lt; 70</span>
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 bg-[#080d0a] border border-rose-500/40 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
            <AlertTriangle className="w-5 h-5" />
            <span>Danger Zone</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-t border-[rgba(16,185,129,0.15)]">
            <div>
              <p className="font-semibold text-white text-xs">Change repository visibility</p>
              <span className="text-[11px] text-[#91a897]">This repository is currently public.</span>
            </div>
            <button className="px-3 py-1.5 bg-[#0c120e] hover:bg-[rgba(16,185,129,0.15)] border border-rose-500/40 text-rose-300 rounded-lg text-xs font-semibold">
              Make private
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-t border-[rgba(16,185,129,0.15)]">
            <div>
              <p className="font-semibold text-white text-xs">Delete this repository</p>
              <span className="text-[11px] text-[#91a897]">Once deleted, bare git files cannot be recovered.</span>
            </div>
            <button className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-500 text-rose-300 rounded-lg text-xs font-semibold">
              Delete repository
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
