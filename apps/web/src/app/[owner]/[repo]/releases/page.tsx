'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { RepoHeader } from '@/components/RepoHeader';
import { Tag, Download, Plus, Check, Clock, Package } from 'lucide-react';
import { fetchReleases, createRelease } from '@/lib/api';
import { Release } from '@/types';

export default function ReleasesPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;

  const [releases, setReleases] = useState<Release[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tagName, setTagName] = useState('');
  const [releaseTitle, setReleaseTitle] = useState('');
  const [releaseNotes, setReleaseNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!owner || !repo) return;

    fetchReleases(owner, repo)
      .then(data => setReleases(data || []))
      .catch(() => {
        setReleases([
          {
            _id: '1',
            repoSlug: `${owner}/${repo}`,
            tagName: 'v1.0.0',
            name: 'CodeSphere Core 1.0.0 General Availability',
            body: 'Official production release of CodeSphere Core Git infrastructure with smart HTTP protocol.\n\n### Highlights:\n- Real Git smart HTTP protocol support\n- Automated CI runner pipelines\n- AI repository brain with semantic AST search',
            targetBranch: 'main',
            isDraft: false,
            isPrerelease: false,
            author: 'demo-dev',
            assets: [
              { name: `${repo}-v1.0.0.tar.gz`, size: 1048576, downloadUrl: '#' },
              { name: `${repo}-v1.0.0.zip`, size: 1258291, downloadUrl: '#' }
            ],
            publishedAt: new Date().toISOString()
          }
        ]);
      });
  }, [owner, repo]);

  const handleCreateRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName || !releaseTitle) return;
    setIsSubmitting(true);
    try {
      const res = await createRelease(owner, repo, {
        tagName,
        name: releaseTitle,
        body: releaseNotes
      });
      setReleases(prev => [res, ...prev]);
      setShowCreateModal(false);
      setTagName('');
      setReleaseTitle('');
      setReleaseNotes('');
    } catch {
      alert('Failed to publish release');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      <Navbar />
      <RepoHeader owner={owner} repo={repo} activeTab="code" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Releases & Tags</h1>
            <p className="text-xs text-[#8b949e]">Packaged production distributions and version changelogs.</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#238636] hover:bg-[#2ea043] rounded-md text-xs font-semibold text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Draft a new release</span>
          </button>
        </div>

        {/* Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#30363d]">
                <h3 className="font-bold text-white text-base">Draft New Release</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-[#8b949e] hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateRelease} className="space-y-4">
                <div>
                  <label className="text-xs text-[#8b949e] block mb-1">Tag version (e.g. v1.1.0)</label>
                  <input
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    placeholder="v1.1.0"
                    className="w-full p-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8b949e] block mb-1">Release title</label>
                  <input
                    value={releaseTitle}
                    onChange={(e) => setReleaseTitle(e.target.value)}
                    placeholder="Release title..."
                    className="w-full p-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8b949e] block mb-1">Release notes (Markdown supported)</label>
                  <textarea
                    value={releaseNotes}
                    onChange={(e) => setReleaseNotes(e.target.value)}
                    rows={4}
                    placeholder="Describe changes in this release..."
                    className="w-full p-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-1.5 text-xs text-[#8b949e] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-xs font-semibold text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish release'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Releases Timeline */}
        <div className="space-y-6">
          {releases.map((rel) => (
            <div key={rel.tagName} className="p-6 bg-[#161b22] border border-[#30363d] rounded-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#21262d]">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded-full font-mono font-bold text-xs flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{rel.tagName}</span>
                  </span>
                  <h2 className="text-lg font-bold text-white">{rel.name}</h2>
                </div>

                <div className="text-xs text-[#8b949e] flex items-center gap-2">
                  <span>Released by <strong className="text-white">{rel.author}</strong></span>
                  <span>•</span>
                  <span>{new Date(rel.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                {rel.body}
              </div>

              {/* Assets Download Box */}
              <div className="pt-3 border-t border-[#21262d] space-y-2">
                <span className="font-semibold text-xs text-[#8b949e] flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" /> Assets
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {rel.assets?.map((asset, idx) => (
                    <a
                      key={idx}
                      href={asset.downloadUrl}
                      className="flex items-center justify-between p-2.5 bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] rounded-lg text-xs transition-colors group"
                    >
                      <span className="font-mono text-cyan-400 group-hover:underline flex items-center gap-2">
                        <Download className="w-3.5 h-3.5" />
                        <span>{asset.name}</span>
                      </span>
                      <span className="text-[#8b949e]">{(asset.size / (1024 * 1024)).toFixed(1)} MB</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
