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
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl p-4 z-50 animate-fadeIn">
      <div className="flex items-center justify-between pb-3 border-b border-[#30363d]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h4 className="font-semibold text-sm text-white">Clone repository</h4>
        </div>
        <div className="flex items-center gap-1 bg-[#0d1117] p-0.5 rounded border border-[#30363d] text-xs">
          <button
            onClick={() => setTab('https')}
            className={`px-2 py-0.5 rounded ${tab === 'https' ? 'bg-[#21262d] text-white' : 'text-[#8b949e]'}`}
          >
            HTTPS
          </button>
          <button
            onClick={() => setTab('cli')}
            className={`px-2 py-0.5 rounded ${tab === 'cli' ? 'bg-[#21262d] text-white' : 'text-[#8b949e]'}`}
          >
            CLI
          </button>
        </div>
      </div>

      {/* URL Input & Copy */}
      <div className="my-3 flex items-center bg-[#0d1117] border border-[#30363d] rounded-md overflow-hidden">
        <input
          readOnly
          value={tab === 'https' ? cloneUrl : cliCommand}
          className="flex-1 px-3 py-2 text-xs font-mono bg-transparent text-[#c9d1d9] focus:outline-none select-all"
        />
        <button
          onClick={handleCopy}
          className="px-3 py-2 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white border-l border-[#30363d] transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <p className="text-[11px] text-[#8b949e] mb-4">
        Use standard Git CLI. Authenticate using your username and password or Personal Access Token.
      </p>

      {/* Quick Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-[#30363d]">
        <a
          href={`/${owner}/${repo}/edit/main/README.md`}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-medium rounded-md transition-colors group"
        >
          <span className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>Open in CodeSphere Browser IDE</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-[#8b949e] group-hover:text-white" />
        </a>

        <a
          href={`/api/repos/${owner}/${repo}/releases/download/latest.zip`}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-medium rounded-md transition-colors group"
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
