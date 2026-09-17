'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  BookOpen, 
  GitPullRequest, 
  AlertCircle, 
  Sparkles, 
  Terminal, 
  Map, 
  ShieldCheck, 
  DollarSign, 
  User, 
  ArrowRight,
  X
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: 'Repositories' | 'Quick Actions' | 'AI Intelligence';
  icon: any;
  href: string;
}

const DEFAULT_COMMANDS: CommandItem[] = [
  { id: '1', title: 'demo-dev / codesphere-core', category: 'Repositories', icon: BookOpen, href: '/demo-dev/codesphere-core' },
  { id: '2', title: 'demo-dev / ai-agent-nexus', category: 'Repositories', icon: BookOpen, href: '/demo-dev/ai-agent-nexus' },
  { id: '3', title: 'AI Repository Brain: Semantic Code Search', category: 'AI Intelligence', icon: Sparkles, href: '/demo-dev/codesphere-core/brain' },
  { id: '4', title: 'Interactive Architecture Dependency Map', category: 'AI Intelligence', icon: Map, href: '/demo-dev/codesphere-core/arch' },
  { id: '5', title: 'AI Stacktrace Debugger & Patch Fixer', category: 'AI Intelligence', icon: Terminal, href: '/demo-dev/codesphere-core/brain?tab=debug' },
  { id: '6', title: 'PR Blast Radius & Risk Analyzer (#1)', category: 'AI Intelligence', icon: GitPullRequest, href: '/demo-dev/codesphere-core/pull/1' },
  { id: '7', title: 'Vulnerability & Secret Leak Scanner', category: 'AI Intelligence', icon: ShieldCheck, href: '/demo-dev/codesphere-core/security' },
  { id: '8', title: 'Cloud CI & Resource Cost Tracker', category: 'AI Intelligence', icon: DollarSign, href: '/demo-dev/codesphere-core/health?tab=cost' },
  { id: '9', title: 'Open Web IDE (Full Browser Monaco Editor)', category: 'Quick Actions', icon: Terminal, href: '/demo-dev/codesphere-core/edit/main/src/index.ts' },
  { id: '10', title: 'View Developer Portfolio & Achievements', category: 'Quick Actions', icon: User, href: '/demo-dev/portfolio' },
  { id: '11', title: 'Create New Repository', category: 'Quick Actions', icon: BookOpen, href: '/new' },
];

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = DEFAULT_COMMANDS.filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#30363d] gap-3">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search code, repos, PRs, or launch AI tools..."
            className="w-full bg-transparent border-0 text-white placeholder-[#8b949e] focus:outline-none text-base"
          />
          <button onClick={onClose} className="text-[#8b949e] hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#30363d]/30">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#8b949e]">
              <p>No results found for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all group ${
                    idx === selectedIndex ? 'bg-[#21262d] text-white border-l-2 border-indigo-400' : 'text-[#c9d1d9] hover:bg-[#21262d]/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-[#0d1117] flex items-center justify-center text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <span className="text-xs text-[#8b949e]">{item.category}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8b949e] opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-between text-xs text-[#8b949e]">
          <span>Navigation: <kbd className="px-1 py-0.5 bg-[#21262d] rounded">↑</kbd> <kbd className="px-1 py-0.5 bg-[#21262d] rounded">↓</kbd></span>
          <span>Select: <kbd className="px-1 py-0.5 bg-[#21262d] rounded">↵ Enter</kbd></span>
          <span>Close: <kbd className="px-1 py-0.5 bg-[#21262d] rounded">Esc</kbd></span>
        </div>
      </div>
    </div>
  );
}
