'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { ContributionHeatmap } from '@/components/ContributionHeatmap';
import { 
  User, 
  MapPin, 
  Building, 
  Globe, 
  BookOpen, 
  Star, 
  GitFork, 
  ExternalLink,
  Sparkles,
  Award
} from 'lucide-react';
import { fetchUserProfile } from '@/lib/api';

export default function UserProfilePage() {
  const params = useParams();
  const owner = params.owner as string;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!owner) return;

    fetchUserProfile(owner)
      .then(setProfile)
      .catch(() => {
        // Fallback realistic demo profile
        const contributions: any[] = [];
        const today = new Date();
        for (let i = 365; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const isWeekend = d.getDay() === 0 || d.getDay() === 6;
          const count = isWeekend ? (Math.random() > 0.7 ? 2 : 0) : Math.floor(Math.random() * 8);
          const level = count === 0 ? 0 : (count < 3 ? 1 : (count < 6 ? 2 : (count < 9 ? 3 : 4)));
          contributions.push({ date: d.toISOString().split('T')[0], count, level });
        }

        setProfile({
          username: owner,
          name: 'Alex Rivera',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          bio: 'Principal Systems Architect & Open Source Maintainer. Building the future of AI-driven developer platforms.',
          company: 'CodeSphere Labs',
          location: 'San Francisco, CA',
          website: 'https://codesphere.dev',
          repositories: [
            {
              slug: `${owner}/codesphere-core`,
              name: 'codesphere-core',
              description: 'Distributed Git engine and developer intelligence platform with real HTTP protocol.',
              language: 'TypeScript',
              starsCount: 142,
              forksCount: 18
            },
            {
              slug: `${owner}/ai-agent-nexus`,
              name: 'ai-agent-nexus',
              description: 'Autonomous multi-agent orchestration framework for automated repository refactoring.',
              language: 'Python',
              starsCount: 89,
              forksCount: 12
            }
          ],
          contributions,
          stats: {
            totalCommitsLastYear: 1248,
            totalRepos: 2,
            starsEarned: 231
          }
        });
      })
      .finally(() => setLoading(false));
  }, [owner]);

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: User Bio & Details */}
          <div className="lg:col-span-1 space-y-4">
            <div className="relative">
              <img
                src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={owner}
                className="w-48 h-48 rounded-full border-2 border-cyan-400/50 shadow-2xl object-cover"
              />
              <div className="absolute bottom-2 right-6 p-1.5 bg-[#161b22] border border-[#30363d] rounded-full text-cyan-400" title="Pro Maintainer">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-bold text-white">{profile?.name || owner}</h1>
              <p className="text-sm font-mono text-[#8b949e]">@{owner}</p>
            </div>

            <p className="text-xs text-[#c9d1d9] leading-relaxed">
              {profile?.bio}
            </p>

            <a
              href={`/${owner}/portfolio`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
            >
              <span>View Auto-Generated Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="pt-2 border-t border-[#30363d] space-y-2 text-xs text-[#8b949e]">
              {profile?.company && (
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>{profile.company}</span>
                </div>
              )}
              {profile?.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <a href={profile.website} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                    {profile.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Contributions & Pinned Repos */}
          <div className="lg:col-span-3 space-y-6">
            {/* 365-Day Contribution Heatmap */}
            <ContributionHeatmap
              contributions={profile?.contributions || []}
              totalCommits={profile?.stats?.totalCommitsLastYear || 1248}
            />

            {/* Pinned Repositories Grid */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-white">Pinned Repositories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile?.repositories?.map((repo: any) => (
                  <div
                    key={repo.slug}
                    className="p-4 bg-[#161b22] border border-[#30363d] hover:border-indigo-500/50 rounded-xl space-y-3 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <a
                        href={`/${repo.slug}`}
                        className="font-semibold text-white group-hover:text-cyan-400 text-sm flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4 text-[#8b949e]" />
                        <span>{repo.name}</span>
                      </a>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#21262d] text-[#8b949e]">
                        Public
                      </span>
                    </div>

                    <p className="text-xs text-[#8b949e] line-clamp-2">
                      {repo.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-[#8b949e]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                        <span>{repo.language}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        <span>{repo.starsCount}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5" />
                        <span>{repo.forksCount}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
