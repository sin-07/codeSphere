'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Star, 
  GitFork, 
  Eye, 
  Code2, 
  AlertCircle, 
  GitPullRequest, 
  PlayCircle, 
  Sparkles, 
  Network, 
  ShieldCheck, 
  Activity, 
  Settings,
  Lock,
  Globe
} from 'lucide-react';
import { toggleStarRepo } from '@/lib/api';

interface RepoHeaderProps {
  owner: string;
  repo: string;
  activeTab: 'code' | 'issues' | 'pulls' | 'actions' | 'brain' | 'arch' | 'security' | 'health' | 'settings';
  isPrivate?: boolean;
  starsCount?: number;
  forksCount?: number;
}

export function RepoHeader({
  owner,
  repo,
  activeTab,
  isPrivate = false,
  starsCount = 0,
  forksCount = 0
}: RepoHeaderProps) {
  const [starred, setStarred] = useState(false);
  const [stars, setStars] = useState(starsCount);

  const handleStar = async () => {
    try {
      const res = await toggleStarRepo(owner, repo);
      setStarred(res.starred);
      setStars(res.starsCount);
    } catch {
      setStarred(!starred);
      setStars(prev => (starred ? prev - 1 : prev + 1));
    }
  };

  const tabs = [
    { id: 'code', label: 'Code', icon: Code2, href: `/${owner}/${repo}` },
    { id: 'issues', label: 'Issues', icon: AlertCircle, href: `/${owner}/${repo}/issues`, badge: '1' },
    { id: 'pulls', label: 'Pull requests', icon: GitPullRequest, href: `/${owner}/${repo}/pulls`, badge: '1' },
    { id: 'actions', label: 'Actions (CI)', icon: PlayCircle, href: `/${owner}/${repo}/actions` },
    { id: 'brain', label: 'AI Brain', icon: Sparkles, href: `/${owner}/${repo}/brain`, highlight: true },
    { id: 'arch', label: 'Architecture', icon: Network, href: `/${owner}/${repo}/arch` },
    { id: 'security', label: 'Security', icon: ShieldCheck, href: `/${owner}/${repo}/security` },
    { id: 'health', label: 'Health & Cost', icon: Activity, href: `/${owner}/${repo}/health` },
    { id: 'settings', label: 'Settings', icon: Settings, href: `/${owner}/${repo}/settings` },
  ];

  return (
    <div className="bg-[#000000] border-b border-[#1a2c1a] pt-6 px-4 md:px-8 relative z-20">
      <div className="max-w-7xl mx-auto">
        {/* Top bar: Repo path & action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5 text-lg font-semibold">
            <BookOpen className="w-5 h-5 text-[#86a686]" />
            <a href={`/${owner}`} className="text-[#00ff66] hover:underline font-mono">
              {owner}
            </a>
            <span className="text-[#86a686]">/</span>
            <a href={`/${owner}/${repo}`} className="text-white hover:text-[#00ff66] transition-colors font-mono">
              {repo}
            </a>
            <span className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-mono font-semibold rounded-full bg-[#040604] text-[#00ff66] border border-[#00ff66]/30 shadow-[0_0_10px_rgba(0,255,102,0.15)]">
              {isPrivate ? <Lock className="w-3 h-3 text-[#00ff66]" /> : <Globe className="w-3 h-3 text-[#00ff66]" />}
              {isPrivate ? 'Private' : 'Public'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Watch */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#040604] hover:bg-[#080c08] border border-[#1a2c1a] hover:border-[#00ff66]/40 text-xs font-semibold text-[#c2d6c2] hover:text-white rounded-lg transition-all">
              <Eye className="w-3.5 h-3.5 text-[#86a686]" />
              <span>Watch</span>
            </button>

            {/* Fork */}
            <a
              href={`/${owner}/${repo}/fork`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#040604] hover:bg-[#080c08] border border-[#1a2c1a] hover:border-[#00ff66]/40 text-xs font-semibold text-[#c2d6c2] hover:text-white rounded-lg transition-all"
            >
              <GitFork className="w-3.5 h-3.5 text-[#86a686]" />
              <span>Fork</span>
              <span className="ml-1 px-1.5 py-0.2 bg-[#000000] border border-[#1a2c1a] rounded-full text-[#86a686] font-mono">{forksCount}</span>
            </a>

            {/* Star */}
            <button
              onClick={handleStar}
              className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-semibold rounded-lg transition-all ${
                starred
                  ? 'bg-[#00ff66]/20 text-[#00ff66] border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.4)]'
                  : 'bg-[#040604] hover:bg-[#080c08] border-[#1a2c1a] hover:border-[#00ff66]/40 text-white'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${starred ? 'fill-[#00ff66] text-[#00ff66]' : 'text-[#86a686]'}`} />
              <span>{starred ? 'Starred' : 'Star'}</span>
              <span className="ml-1 px-1.5 py-0.2 bg-[#000000] border border-[#1a2c1a] rounded-full text-[#86a686] font-mono">{stars}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <a
                key={tab.id}
                href={tab.href}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-[#00ff66] text-[#00ff66] font-semibold shadow-[0_2px_10px_rgba(0,255,102,0.4)]'
                    : 'border-transparent text-[#86a686] hover:text-[#c2d6c2] hover:border-[#00ff66]/30'
                } ${tab.highlight ? 'text-[#4ade80] hover:text-[#00ff66]' : ''}`}
              >
                <Icon className={`w-4 h-4 ${tab.highlight ? 'text-[#00ff66]' : ''}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 text-[11px] font-mono font-semibold rounded-full bg-[#131f13] text-[#00ff66] border border-[#1a2c1a]">
                    {tab.badge}
                  </span>
                )}
                {tab.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] shadow-[0_0_6px_#00ff66] animate-pulse" />
                )}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
