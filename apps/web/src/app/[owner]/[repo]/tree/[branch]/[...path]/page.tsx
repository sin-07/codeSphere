'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { RepoHeader } from '@/components/RepoHeader';
import { FileTree } from '@/components/FileTree';
import { CloneModal } from '@/components/CloneModal';
import { GitBranch, ChevronRight, BookOpen, Code2 } from 'lucide-react';
import { fetchRepoDetails, fetchTree, fetchCommits } from '@/lib/api';
import { TreeEntry, CommitInfo } from '@/types';

export default function SubdirectoryTreePage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;
  const branch = params.branch as string;
  const pathParts = params.path as string[];
  const subPath = Array.isArray(pathParts) ? pathParts.join('/') : (pathParts || '');

  const [entries, setEntries] = useState<TreeEntry[]>([]);
  const [latestCommit, setLatestCommit] = useState<CommitInfo | undefined>(undefined);
  const [isCloneOpen, setIsCloneOpen] = useState(false);

  useEffect(() => {
    if (!owner || !repo || !branch) return;

    fetchTree(owner, repo, branch, subPath)
      .then(setEntries)
      .catch(() => {
        setEntries([
          { mode: '100644', type: 'blob', sha: '1', name: 'index.ts', path: `${subPath}/index.ts`, size: 512 }
        ]);
      });

    fetchCommits(owner, repo, branch)
      .then(commits => {
        if (commits && commits.length) setLatestCommit(commits[0]);
      })
      .catch(() => {});
  }, [owner, repo, branch, subPath]);

  const pathCrumbs = subPath.split('/').filter(Boolean);

  return (
    <div className="min-h-screen bg-[#050806] flex flex-col">
      <Navbar />
      <RepoHeader owner={owner} repo={repo} activeTab="code" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Breadcrumb Path Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-mono">
            <span className="px-2 py-0.5 bg-[#0c120e] rounded text-emerald-400 text-xs flex items-center gap-1">
              <GitBranch className="w-3.5 h-3.5" />
              <span>{branch}</span>
            </span>
            <span className="text-[#91a897]">/</span>
            <a href={`/${owner}/${repo}`} className="text-emerald-400 hover:underline">
              {repo}
            </a>
            {pathCrumbs.map((part, idx) => {
              const partPath = pathCrumbs.slice(0, idx + 1).join('/');
              return (
                <React.Fragment key={idx}>
                  <span className="text-[#91a897]">/</span>
                  <a
                    href={`/${owner}/${repo}/tree/${branch}/${partPath}`}
                    className="text-white hover:underline font-semibold"
                  >
                    {part}
                  </a>
                </React.Fragment>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/${owner}/${repo}/edit/${branch}/${subPath}/new-file.ts`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0c120e] hover:bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.15)] rounded-md text-xs font-semibold text-white transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Edit in Web IDE</span>
            </a>
          </div>
        </div>

        {/* Directory File Tree */}
        <FileTree
          owner={owner}
          repo={repo}
          branch={branch}
          entries={entries}
          currentPath={subPath}
          latestCommit={latestCommit}
        />
      </main>
    </div>
  );
}
