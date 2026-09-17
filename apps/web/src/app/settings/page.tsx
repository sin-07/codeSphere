'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { 
  Key, 
  Copy, 
  Check, 
  Shield, 
  Plus, 
  User, 
  Terminal 
} from 'lucide-react';

export default function SettingsPage() {
  const [tokenName, setTokenName] = useState('CLI Git Token');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pats, setPats] = useState<Array<{ name: string; token: string; date: string }>>([
    { name: 'CLI Access Token', token: 'pat_codesphere_demo_token_2026', date: '2026-09-18' }
  ]);

  const handleCreateToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenName.trim()) return;
    const newToken = `cs_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setGeneratedToken(newToken);
    setPats(prev => [{ name: tokenName, token: newToken, date: new Date().toISOString().split('T')[0] }, ...prev]);
    setTokenName('');
  };

  const handleCopy = () => {
    if (!generatedToken) return;
    navigator.clipboard.writeText(generatedToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050806] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-8 space-y-8">
        <div className="pb-4 border-b border-[rgba(16,185,129,0.15)] space-y-1">
          <h1 className="text-2xl font-bold text-white">Developer Settings</h1>
          <p className="text-xs text-[#91a897]">
            Manage personal access tokens (PATs) for Git CLI authentication and API access.
          </p>
        </div>

        {/* Generated Token Alert */}
        {generatedToken && (
          <div className="p-5 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Personal Access Token Created</span>
            </div>
            <p className="text-xs text-[#91a897]">
              Make sure to copy your personal access token now. You won&apos;t be able to see it again!
            </p>

            <div className="flex items-center gap-2 bg-[#050806] p-2.5 rounded-lg border border-[rgba(16,185,129,0.15)] font-mono text-xs">
              <input
                readOnly
                value={generatedToken}
                className="flex-1 bg-transparent text-emerald-300 focus:outline-none select-all"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-[#0c120e] hover:bg-[rgba(16,185,129,0.15)] text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Generate Token Box */}
        <form onSubmit={handleCreateToken} className="p-6 bg-[#080d0a] border border-[rgba(16,185,129,0.15)] rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#0c120e]">
            <Key className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Generate New Personal Access Token</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1">Token Note / Description</label>
            <input
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              placeholder="e.g. Workstation Laptop Git CLI"
              className="w-full p-2.5 bg-[#050806] border border-[rgba(16,185,129,0.15)] rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500/50"
              required
            />
          </div>

          <p className="text-xs text-[#91a897]">
            Tokens can be used for standard git clone, push, and pull commands via HTTP:
            <code className="block mt-1 text-emerald-400 font-mono">git clone http://username:TOKEN@localhost:4000/git/:owner/:repo.git</code>
          </p>

          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs text-white rounded-lg transition-colors shadow-md shadow-emerald-900/20"
          >
            Generate token
          </button>
        </form>

        {/* Existing Tokens Table */}
        <div className="border border-[rgba(16,185,129,0.15)] rounded-2xl overflow-hidden bg-[#080d0a]">
          <div className="p-3.5 bg-[#1c2128] border-b border-[rgba(16,185,129,0.15)] text-xs font-semibold text-[#91a897]">
            Active Personal Access Tokens
          </div>

          <div className="divide-y divide-[#0c120e]">
            {pats.map((pat, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div>
                  <p className="font-semibold text-white">{pat.name}</p>
                  <span className="text-[#91a897] font-mono text-[11px]">
                    {pat.token.substring(0, 8)}••••••••••••••••
                  </span>
                </div>
                <span className="text-[#91a897]">Created {pat.date}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
