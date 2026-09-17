'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  BookOpen, 
  GitPullRequest, 
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-[#080d0a] border border-emerald-500/25 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-emerald-500/15 gap-3">
          <Search className="w-5 h-5 text-emerald-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search code, repos, PRs, or launch AI tools..."
            className="w-full bg-transparent border-0 text-white placeholder-[#91a897]/60 focus:outline-none text-sm font-sans"
          />
          <button onClick={onClose} className="text-[#91a897] hover:text-white p-1 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-emerald-500/10">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#91a897] text-xs font-mono">
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
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all group ${
                    idx === selectedIndex 
                      ? 'bg-emerald-500/15 text-white border-l-2 border-emerald-400' 
                      : 'text-[#d1e0d5] hover:bg-emerald-500/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#0c120e] border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/40">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-xs text-white group-hover:text-emerald-300 transition-colors">{item.title}</p>
                      <span className="text-[11px] text-[#91a897]">{item.category}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#050806] border-t border-emerald-500/15 flex items-center justify-between text-[11px] text-[#91a897]">
          <span>Navigation: <kbd className="px-1.5 py-0.5 bg-[#0c120e] border border-emerald-500/20 rounded text-emerald-300 font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 bg-[#0c120e] border border-emerald-500/20 rounded text-emerald-300 font-mono">↓</kbd></span>
          <span>Select: <kbd className="px-1.5 py-0.5 bg-[#0c120e] border border-emerald-500/20 rounded text-emerald-300 font-mono">↵</kbd></span>
          <span>Close: <kbd className="px-1.5 py-0.5 bg-[#0c120e] border border-emerald-500/20 rounded text-emerald-300 font-mono">Esc</kbd></span>
        </div>
      </div>
    </div>
  );
}
