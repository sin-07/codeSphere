'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/navigation';
import { 
  GitBranch, 
  Search, 
  Bell, 
  Plus, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  Terminal, 
  User, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { fetchNotifications } from '@/lib/api';

export function Navbar({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const [unreadCount, setUnreadCount] = useState(2);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    fetchNotifications().then(res => {
      if (res?.unreadCount !== undefined) setUnreadCount(res.unreadCount);
    }).catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[#30363d] bg-[#161b22]/95 backdrop-blur-md px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Main Nav */}
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-cyan-400 to-emerald-400 p-[1.5px] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d1117] rounded-[7px] flex items-center justify-center">
                <GitBranch className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              CodeSphere
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[#8b949e]">
            <a href="/" className="px-3 py-1.5 rounded-md hover:text-white hover:bg-[#21262d] transition-colors">
              Dashboard
            </a>
            <a href="/explore" className="px-3 py-1.5 rounded-md hover:text-white hover:bg-[#21262d] transition-colors">
              Explore
            </a>
            <a href="/demo-dev/codesphere-core/brain" className="px-3 py-1.5 rounded-md hover:text-cyan-400 hover:bg-[#21262d] transition-colors flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              AI Brain
            </a>
          </nav>
        </div>

        {/* Search Bar / Command Palette Trigger */}
        <div className="flex-1 max-w-md hidden sm:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-md text-sm text-[#8b949e] hover:border-[#818cf8] transition-all group"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#8b949e] group-hover:text-white" />
              <span className="group-hover:text-slate-300">Type <kbd className="px-1.5 py-0.5 text-xs bg-[#21262d] rounded text-[#8b949e]">Cmd+K</kbd> to search repos, PRs, code...</span>
            </span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Notifications */}
          <a
            href="/notifications"
            className="relative p-1.5 text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded-md transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#161b22]" />
            )}
          </a>

          {/* New Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-[#238636] hover:bg-[#2ea043] text-white rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#161b22] border border-[#30363d] rounded-md shadow-xl py-1 z-50 text-sm">
                <a href="/new" className="block px-4 py-2 text-slate-200 hover:bg-[#21262d] hover:text-white">
                  New Repository
                </a>
                <a href="/demo-dev/codesphere-core/edit/main/new-file.ts" className="block px-4 py-2 text-slate-200 hover:bg-[#21262d] hover:text-white">
                  New File in Web IDE
                </a>
                <a href="/orgs/new" className="block px-4 py-2 text-slate-200 hover:bg-[#21262d] hover:text-white">
                  New Organization
                </a>
              </div>
            )}
          </div>

          {/* User Profile Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center focus:outline-none"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                alt="demo-dev"
                className="w-7 h-7 rounded-full ring-1 ring-[#30363d] hover:ring-indigo-400 transition-all object-cover"
              />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#161b22] border border-[#30363d] rounded-md shadow-2xl py-1.5 z-50 text-sm">
                <div className="px-4 py-2 border-b border-[#30363d]">
                  <p className="text-xs text-[#8b949e]">Signed in as</p>
                  <p className="font-semibold text-white">demo-dev</p>
                </div>
                <a href="/demo-dev" className="block px-4 py-2 text-slate-200 hover:bg-[#21262d] hover:text-white">
                  Your Profile
                </a>
                <a href="/demo-dev/portfolio" className="flex items-center justify-between px-4 py-2 text-cyan-400 hover:bg-[#21262d]">
                  <span>Developer Portfolio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a href="/demo-dev/codesphere-core" className="block px-4 py-2 text-slate-200 hover:bg-[#21262d] hover:text-white">
                  Your Repositories
                </a>
                <div className="border-t border-[#30363d] my-1" />
                <a href="/settings" className="block px-4 py-2 text-slate-200 hover:bg-[#21262d] hover:text-white">
                  Settings & PATs
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
