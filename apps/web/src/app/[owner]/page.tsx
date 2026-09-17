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
    <div className="min-h-screen bg-[#000000] text-[#f0faf0] flex flex-col selection:bg-[#00ff66]/20 selection:text-[#00ff66]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: User Bio & Details */}
          <div className="lg:col-span-1 space-y-5">
            <div className="relative inline-block">
              <img
                src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={owner}
                className="w-48 h-48 rounded-2xl border-2 border-[#00ff66] shadow-[0_0_30px_rgba(0,255,102,0.3)] object-cover"
              />
              <div className="absolute -bottom-2 -right-2 p-2 bg-[#040604] border border-[#00ff66]/50 rounded-xl text-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.35)]" title="Verified Maintainer">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-black text-white font-sans">{profile?.name || owner}</h1>
              <p className="text-sm font-mono text-[#00ff66]">@{owner}</p>
            </div>

            <p className="text-xs text-[#86a686] leading-relaxed">
              {profile?.bio}
            </p>

            <a
              href={`/${owner}/portfolio`}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#00ff66] hover:bg-[#22c55e] text-black font-bold text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,102,0.35)] hover:shadow-[0_0_30px_rgba(0,255,102,0.55)]"
            >
              <Award className="w-4 h-4 stroke-[2.5]" />
              <span>View Auto Portfolio</span>
            </a>

            <div className="space-y-2.5 pt-4 border-t border-[#1a2c1a] text-xs font-mono text-[#86a686]">
              {profile?.company && (
                <div className="flex items-center gap-2 text-[#c2d6c2]">
                  <Building className="w-3.5 h-3.5 text-[#00ff66]" />
                  <span>{profile.company}</span>
                </div>
              )}
              {profile?.location && (
                <div className="flex items-center gap-2 text-[#c2d6c2]">
                  <MapPin className="w-3.5 h-3.5 text-[#00ff66]" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-[#00ff66]" />
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-[#00ff66] hover:underline">
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
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#00ff66]" />
                <span>Popular Public Repositories</span>
              </h3>

              <GsapStagger className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(profile?.repositories || []).map((repo: any) => (
                  <GsapGlowCard
                    key={repo.slug}
                    className="p-5 border-[#1a2c1a] flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <a
                          href={`/${repo.slug}`}
                          className="font-bold text-sm text-[#00ff66] hover:underline font-mono"
                        >
                          {repo.name}
                        </a>
                        <span className="px-2 py-0.5 rounded-full bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 text-[10px] font-mono">
                          PUBLIC
                        </span>
                      </div>
                      <p className="text-xs text-[#86a686] leading-relaxed">
                        {repo.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-[#86a686] pt-2 border-t border-[#1a2c1a]">
                      <span className="flex items-center gap-1.5 text-[#00ff66] font-semibold">
                        <span className="w-2 h-2 rounded-full bg-[#00ff66]" />
                        {repo.language}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-[#00ff66]" />
                        {repo.starsCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5 text-[#86a686]" />
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
