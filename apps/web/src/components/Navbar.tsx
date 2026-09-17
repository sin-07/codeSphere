'use client';

import React, { useState, useEffect } from 'react';
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
import { GsapPulseBeacon } from '@/components/animations';

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
    <header className="sticky top-0 z-50 border-b border-emerald-500/15 bg-[#050806]/85 backdrop-blur-xl px-4 md:px-8 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Main Nav */}
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#0c120e] border border-emerald-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.15)] group-hover:border-emerald-500/60 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
              <GitBranch className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-semibold text-base tracking-tight text-white flex items-center gap-2">
              CodeSphere
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/25">
                v1.0
              </span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[#91a897]">
            <a 
              href="/" 
              className="px-3 py-1.5 rounded-md hover:text-white hover:bg-emerald-500/10 transition-colors"
            >
              Dashboard
            </a>
            <a 
              href="/explore" 
              className="px-3 py-1.5 rounded-md hover:text-white hover:bg-emerald-500/10 transition-colors"
            >
              Explore
            </a>
            <a 
              href="/demo-dev/codesphere-core/brain" 
              className="px-3 py-1.5 rounded-md text-emerald-300 hover:text-white hover:bg-emerald-500/15 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              AI Brain
            </a>
            <a 
              href="/demo-dev/codesphere-core/arch" 
              className="px-3 py-1.5 rounded-md hover:text-white hover:bg-emerald-500/10 transition-colors"
            >
              Architecture
            </a>
          </nav>
        </div>

        {/* Search Bar / Command Palette Trigger */}
        <div className="flex-1 max-w-md hidden sm:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 bg-[#080d0a]/90 border border-emerald-500/15 rounded-lg text-sm text-[#91a897] hover:border-emerald-500/35 hover:text-white transition-all shadow-inner group"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#91a897] group-hover:text-emerald-400 transition-colors" />
              <span className="text-xs">Search repositories, symbols, PRs...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#0c120e] border border-emerald-500/20 rounded text-[#91a897] group-hover:text-emerald-300">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Node Health Beacon */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#080d0a] border border-emerald-500/15">
            <GsapPulseBeacon size={7} color="#10b981" />
            <span className="text-[11px] font-mono text-[#91a897]">US-EAST</span>
          </div>

          {/* Notifications */}
          <a
            href="/notifications"
            className="relative p-2 text-[#91a897] hover:text-white hover:bg-emerald-500/10 rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            )}
          </a>

          {/* New Repo Action */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-[0_1px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_1px_20px_rgba(16,185,129,0.45)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#080d0a] border border-emerald-500/20 rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.8)] py-1.5 z-50 text-xs animate-fadeIn">
                <a
                  href="/new"
                  className="flex items-center gap-2 px-3 py-2 text-[#c7d8cb] hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>New Repository</span>
                </a>
                <a
                  href="/demo-dev/codesphere-core/brain"
                  className="flex items-center gap-2 px-3 py-2 text-[#c7d8cb] hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>AI Code Query</span>
                </a>
                <a
                  href="/settings/tokens"
                  className="flex items-center gap-2 px-3 py-2 text-[#c7d8cb] hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Personal Access Token</span>
                </a>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="relative rounded-full border border-emerald-500/20 hover:border-emerald-500/60 p-0.5 transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                alt="demo-dev"
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#050806]" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#080d0a] border border-emerald-500/20 rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.8)] py-2 z-50 text-xs animate-fadeIn">
                <div className="px-3 py-2 border-b border-emerald-500/15">
                  <p className="font-semibold text-white">Alex Rivera</p>
                  <p className="text-[#91a897] font-mono">@demo-dev</p>
                </div>
                <a
                  href="/demo-dev"
                  className="flex items-center gap-2 px-3 py-2 text-[#c7d8cb] hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Your Profile</span>
                </a>
                <a
                  href="/demo-dev/portfolio"
                  className="flex items-center gap-2 px-3 py-2 text-[#c7d8cb] hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Auto Portfolio</span>
                </a>
                <a
                  href="/settings/tokens"
                  className="flex items-center gap-2 px-3 py-2 text-[#c7d8cb] hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Developer Settings</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
