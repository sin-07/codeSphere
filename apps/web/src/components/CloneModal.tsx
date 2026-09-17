'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, Download, Code2, ExternalLink } from 'lucide-react';

interface CloneModalProps {
  owner: string;
  repo: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CloneModal({ owner, repo, isOpen, onClose }: CloneModalProps) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'https' | 'cli'>('https');

  if (!isOpen) return null;

  const cloneUrl = `http://localhost:4000/git/${owner}/${repo}.git`;
  const cliCommand = `git clone ${cloneUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(tab === 'https' ? cloneUrl : cliCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#080d0a] border border-emerald-500/20 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] p-4 z-50 animate-fadeIn backdrop-blur-xl">
      <div className="flex items-center justify-between pb-3 border-b border-emerald-500/15">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h4 className="font-semibold text-sm text-white">Clone repository</h4>
        </div>
        <div className="flex items-center gap-1 bg-[#050806] p-0.5 rounded-lg border border-emerald-500/20 text-xs">
          <button
            onClick={() => setTab('https')}
            className={`px-2.5 py-0.5 rounded-md font-medium transition-colors ${
              tab === 'https' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-[#91a897] hover:text-white'
            }`}
          >
            HTTPS
          </button>
          <button
            onClick={() => setTab('cli')}
            className={`px-2.5 py-0.5 rounded-md font-medium transition-colors ${
              tab === 'cli' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-[#91a897] hover:text-white'
            }`}
          >
            CLI
          </button>
        </div>
      </div>

      {/* URL Input & Copy */}
      <div className="my-3 flex items-center bg-[#050806] border border-emerald-500/20 rounded-lg overflow-hidden shadow-inner">
        <input
          readOnly
          value={tab === 'https' ? cloneUrl : cliCommand}
          className="flex-1 px-3 py-2 text-xs font-mono bg-transparent text-emerald-300 focus:outline-none select-all"
        />
        <button
          onClick={handleCopy}
          className="px-3 py-2 bg-[#0c120e] hover:bg-[#121c15] text-[#91a897] hover:text-white border-l border-emerald-500/20 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <p className="text-[11px] text-[#91a897] mb-4">
        Standard Git CLI compatible. Authenticate with your username and Personal Access Token.
      </p>

      {/* Quick Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-emerald-500/15">
        <a
          href={`/${owner}/${repo}/edit/main/README.md`}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#0c120e] hover:bg-[#121c15] border border-emerald-500/15 hover:border-emerald-500/35 text-white text-xs font-medium rounded-lg transition-colors group"
        >
          <span className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Open in CodeSphere Browser IDE</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-[#91a897] group-hover:text-white" />
        </a>

        <a
          href={`/api/repos/${owner}/${repo}/releases/download/latest.zip`}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#0c120e] hover:bg-[#121c15] border border-emerald-500/15 hover:border-emerald-500/35 text-white text-xs font-medium rounded-lg transition-colors group"
        >
          <span className="flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download ZIP archive</span>
          </span>
        </a>
      </div>
    </div>
  );
}
