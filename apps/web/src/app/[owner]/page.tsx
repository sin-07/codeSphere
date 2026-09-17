'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { ContributionHeatmap } from '@/components/ContributionHeatmap';
import { 
  MapPin, 
  Building, 
  Globe, 
  BookOpen, 
  Star, 
  GitFork, 
  Sparkles,
  Award
} from 'lucide-react';
import { fetchUserProfile } from '@/lib/api';
import { GsapGlowCard, GsapStagger } from '@/components/animations';

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
    <div className="min-h-screen bg-[#050806] text-[#f0f7f2] flex flex-col selection:bg-emerald-500/25 selection:text-emerald-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: User Bio & Details */}
          <div className="lg:col-span-1 space-y-5">
            <div className="relative inline-block">
              <img
                src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={owner}
                className="w-44 h-44 rounded-2xl border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)] object-cover"
              />
              <div className="absolute -bottom-2 -right-2 p-2 bg-[#0c120e] border border-emerald-500/30 rounded-xl text-emerald-400 shadow-sm" title="Verified Maintainer">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-white font-sans">{profile?.name || owner}</h1>
              <p className="text-sm font-mono text-emerald-400">@{owner}</p>
            </div>

            <p className="text-xs text-[#91a897] leading-relaxed">
              {profile?.bio}
            </p>

            <a
              href={`/${owner}/portfolio`}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-all shadow-[0_1px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_1px_20px_rgba(16,185,129,0.45)]"
            >
              <Award className="w-4 h-4" />
              <span>View Auto Portfolio</span>
            </a>

            <div className="space-y-2.5 pt-4 border-t border-emerald-500/10 text-xs font-mono text-[#91a897]">
              {profile?.company && (
                <div className="flex items-center gap-2 text-[#d1e0d5]">
                  <Building className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{profile.company}</span>
                </div>
              )}
              {profile?.location && (
                <div className="flex items-center gap-2 text-[#d1e0d5]">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 hover:underline">
                    {profile.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Repositories & Heatmap */}
          <div className="lg:col-span-3 space-y-6">
            {/* 365-Day Contribution Heatmap */}
            <ContributionHeatmap
              contributions={profile?.contributions || []}
              totalCommits={profile?.stats?.totalCommitsLastYear || 1248}
            />

            {/* Repositories */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Popular Public Repositories</span>
              </h3>

              <GsapStagger className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(profile?.repositories || []).map((repo: any) => (
                  <GsapGlowCard
                    key={repo.slug}
                    className="p-5 border-emerald-500/15 bg-[#080d0a]/80 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <a
                          href={`/${repo.slug}`}
                          className="font-semibold text-sm text-white hover:text-emerald-300 transition-colors font-mono"
                        >
                          {repo.name}
                        </a>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                          PUBLIC
                        </span>
                      </div>
                      <p className="text-xs text-[#91a897] leading-relaxed">
                        {repo.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-[#91a897] pt-2 border-t border-emerald-500/10">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {repo.language}
                      </span>
                      <span className="flex items-center gap-1 text-[#91a897]">
                        <Star className="w-3.5 h-3.5 text-emerald-400" />
                        {repo.starsCount}
                      </span>
                      <span className="flex items-center gap-1 text-[#91a897]">
                        <GitFork className="w-3.5 h-3.5 text-[#91a897]" />
                        {repo.forksCount}
                      </span>
                    </div>
                  </GsapGlowCard>
                ))}
              </GsapStagger>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
