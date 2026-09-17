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
  ChevronDown,
  Activity
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
    <header className="sticky top-0 z-50 border-b border-[#1a2c1a] bg-[#000000]/95 backdrop-blur-md px-4 py-2.5 shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Main Nav */}
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 rounded-lg bg-[#040604] border border-[#00ff66]/50 p-[1px] shadow-[0_0_15px_rgba(0,255,102,0.3)] group-hover:shadow-[0_0_25px_rgba(0,255,102,0.6)] group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-[#000000] rounded-[6px] flex items-center justify-center">
                <GitBranch className="w-4 h-4 text-[#00ff66]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                CodeSphere
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded border border-[#00ff66]/40 bg-[#00ff66]/10 text-[#00ff66]">
                  CYBER
                </span>
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[#86a686]">
            <a 
              href="/" 
              className="px-3 py-1.5 rounded-md hover:text-[#00ff66] hover:bg-[#080c08] border border-transparent hover:border-[#1a2c1a] transition-all"
            >
              Dashboard
            </a>
            <a 
              href="/explore" 
              className="px-3 py-1.5 rounded-md hover:text-[#00ff66] hover:bg-[#080c08] border border-transparent hover:border-[#1a2c1a] transition-all"
            >
              Explore
            </a>
            <a 
              href="/demo-dev/codesphere-core/brain" 
              className="px-3 py-1.5 rounded-md text-[#4ade80] hover:text-[#00ff66] hover:bg-[#00ff66]/10 border border-[#00ff66]/20 transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,255,102,0.1)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00ff66]" />
              AI Brain
            </a>
            <a 
              href="/demo-dev/codesphere-core/arch" 
              className="px-3 py-1.5 rounded-md hover:text-[#00ff66] hover:bg-[#080c08] border border-transparent hover:border-[#1a2c1a] transition-all"
            >
              Arch Map
            </a>
          </nav>
        </div>

        {/* Search Bar / Command Palette Trigger */}
        <div className="flex-1 max-w-md hidden sm:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 bg-[#040604] border border-[#1a2c1a] rounded-lg text-sm text-[#86a686] hover:border-[#00ff66]/50 hover:text-[#c2d6c2] hover:shadow-[0_0_15px_rgba(0,255,102,0.15)] transition-all group"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#86a686] group-hover:text-[#00ff66] transition-colors" />
              <span className="text-xs">Search repositories, files, AI commits...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#080c08] border border-[#1a2c1a] rounded text-[#86a686] group-hover:text-[#00ff66] group-hover:border-[#00ff66]/30">
              Cmd+K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Live Node Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#040604] border border-[#1a2c1a]">
            <GsapPulseBeacon size={7} color="#00ff66" />
            <span className="text-[11px] font-mono text-[#86a686]">NODE US-EAST</span>
          </div>

          {/* Notifications */}
          <a
            href="/notifications"
            className="relative p-2 text-[#86a686] hover:text-[#00ff66] hover:bg-[#080c08] rounded-lg border border-transparent hover:border-[#1a2c1a] transition-all"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_8px_#00ff66]" />
            )}
          </a>

          {/* New Repo Action */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#00ff66] hover:bg-[#22c55e] text-black rounded-lg transition-all shadow-[0_0_15px_rgba(0,255,102,0.35)] hover:shadow-[0_0_25px_rgba(0,255,102,0.55)]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>New</span>
              <ChevronDown className="w-3 h-3 stroke-[2.5]" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#040604] border border-[#1a2c1a] rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.9)] py-1.5 z-50 text-sm">
                <a
                  href="/new"
                  className="flex items-center gap-2 px-3 py-2 text-xs text-[#c2d6c2] hover:bg-[#00ff66]/10 hover:text-[#00ff66] transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>New Repository</span>
                </a>
                <a
                  href="/demo-dev/codesphere-core/brain"
                  className="flex items-center gap-2 px-3 py-2 text-xs text-[#c2d6c2] hover:bg-[#00ff66]/10 hover:text-[#00ff66] transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#00ff66]" />
                  <span>AI Code Query</span>
                </a>
                <a
                  href="/settings/tokens"
                  className="flex items-center gap-2 px-3 py-2 text-xs text-[#c2d6c2] hover:bg-[#00ff66]/10 hover:text-[#00ff66] transition-colors"
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
              className="relative rounded-full border border-[#1a2c1a] hover:border-[#00ff66] p-0.5 transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                alt="demo-dev"
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#00ff66] ring-2 ring-black shadow-[0_0_6px_#00ff66]" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#040604] border border-[#1a2c1a] rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.9)] py-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-[#1a2c1a]">
                  <p className="font-semibold text-white">Alex Rivera</p>
                  <p className="text-[#86a686] font-mono">@demo-dev</p>
                </div>
                <a
                  href="/demo-dev"
                  className="flex items-center gap-2 px-3 py-2 text-[#c2d6c2] hover:bg-[#00ff66]/10 hover:text-[#00ff66] transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Your Profile</span>
                </a>
                <a
                  href="/demo-dev/portfolio"
                  className="flex items-center gap-2 px-3 py-2 text-[#c2d6c2] hover:bg-[#00ff66]/10 hover:text-[#00ff66] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#00ff66]" />
                  <span>Auto Portfolio</span>
                </a>
                <a
                  href="/settings/tokens"
                  className="flex items-center gap-2 px-3 py-2 text-[#c2d6c2] hover:bg-[#00ff66]/10 hover:text-[#00ff66] transition-colors"
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
