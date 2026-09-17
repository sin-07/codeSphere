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
    <div className="bg-[#161b22] border-b border-[#30363d] pt-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top bar: Repo path & action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5 text-lg font-semibold">
            <BookOpen className="w-5 h-5 text-[#8b949e]" />
            <a href={`/${owner}`} className="text-indigo-400 hover:underline">
              {owner}
            </a>
            <span className="text-[#8b949e]">/</span>
            <a href={`/${owner}/${repo}`} className="text-white hover:underline">
              {repo}
            </a>
            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-[#21262d] text-[#8b949e] border border-[#30363d]">
              {isPrivate ? <Lock className="w-3 h-3 text-amber-400" /> : <Globe className="w-3 h-3 text-cyan-400" />}
              {isPrivate ? 'Private' : 'Public'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Watch */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-xs font-semibold text-white rounded-md transition-colors">
              <Eye className="w-3.5 h-3.5 text-[#8b949e]" />
              <span>Watch</span>
            </button>

            {/* Fork */}
            <a
              href={`/${owner}/${repo}/fork`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-xs font-semibold text-white rounded-md transition-colors"
            >
              <GitFork className="w-3.5 h-3.5 text-[#8b949e]" />
              <span>Fork</span>
              <span className="ml-1 px-1.5 py-0.2 bg-[#161b22] rounded-full text-[#8b949e]">{forksCount}</span>
            </a>

            {/* Star */}
            <button
              onClick={handleStar}
              className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-semibold rounded-md transition-all ${
                starred
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-[#21262d] hover:bg-[#30363d] border-[#30363d] text-white'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${starred ? 'fill-amber-400 text-amber-400' : 'text-[#8b949e]'}`} />
              <span>{starred ? 'Starred' : 'Star'}</span>
              <span className="ml-1 px-1.5 py-0.2 bg-[#161b22] rounded-full text-[#8b949e]">{stars}</span>
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
                    ? 'border-[#f78166] text-white font-semibold'
                    : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9] hover:border-[#8b949e]/40'
                } ${tab.highlight ? 'text-cyan-400 hover:text-cyan-300' : ''}`}
              >
                <Icon className={`w-4 h-4 ${tab.highlight ? 'text-cyan-400' : ''}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 text-xs font-semibold rounded-full bg-[#30363d] text-[#c9d1d9]">
                    {tab.badge}
                  </span>
                )}
                {tab.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
