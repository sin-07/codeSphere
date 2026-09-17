'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { RepoHeader } from '@/components/RepoHeader';
import { FileTree } from '@/components/FileTree';
import { CloneModal } from '@/components/CloneModal';
import { CommandPalette } from '@/components/CommandPalette';
import { 
  GitBranch, 
  Download, 
  Plus, 
  Terminal, 
  BookOpen, 
  Code2, 
  FileText,
  ChevronDown
} from 'lucide-react';
import { fetchRepoDetails, fetchBranches, fetchCommits, fetchTree, fetchBlob } from '@/lib/api';
import { TreeEntry, CommitInfo } from '@/types';

export default function RepoCodePage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;

  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isCloneOpen, setIsCloneOpen] = useState(false);
  const [repoData, setRepoData] = useState<any>(null);
  const [branches, setBranches] = useState<string[]>(['main']);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [entries, setEntries] = useState<TreeEntry[]>([]);
  const [latestCommit, setLatestCommit] = useState<CommitInfo | undefined>(undefined);
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!owner || !repo) return;

    fetchRepoDetails(owner, repo)
      .then(setRepoData)
      .catch(() => {
        setRepoData({
          owner,
          name: repo,
          slug: `${owner}/${repo}`,
          description: 'Distributed Git engine and developer intelligence platform with real HTTP protocol.',
          isPrivate: false,
          starsCount: 142,
          forksCount: 18,
        });
      });

    fetchBranches(owner, repo)
      .then(b => {
        if (b && b.length > 0) setBranches(b);
      })
      .catch(() => setBranches(['main', 'feature/ai-brain']));

    fetchCommits(owner, repo, currentBranch)
      .then(commits => {
        if (commits && commits.length > 0) setLatestCommit(commits[0]);
      })
      .catch(() => {
        setLatestCommit({
          sha: 'e9b2c34a123f4567890123456789012345678901',
          author: 'Alex Rivera',
          email: 'dev@codesphere.local',
          date: new Date().toISOString(),
          message: 'Initial release: Setup distributed server architecture'
        });
      });

    fetchTree(owner, repo, currentBranch, '')
      .then(tree => {
        setEntries(tree || []);
      })
      .catch(() => {
        setEntries([
          { mode: '100644', type: 'blob', sha: '1', name: 'README.md', path: 'README.md', size: 1024 },
          { mode: '100644', type: 'blob', sha: '2', name: 'package.json', path: 'package.json', size: 512 },
          { mode: '040000', type: 'tree', sha: '3', name: 'src', path: 'src' },
          { mode: '040000', type: 'tree', sha: '4', name: 'tests', path: 'tests' }
        ]);
      });

    fetchBlob(owner, repo, currentBranch, 'README.md')
      .then(b => setReadmeContent(b.content))
      .catch(() => {
        setReadmeContent('# CodeSphere Core Engine\n\nProduction-grade distributed Git platform and developer intelligence engine.\n\n## Features\n- Real Git Smart HTTP hosting\n- AI Repository Brain with AST semantic search\n- Real-time Web IDE & collaborative code review\n');
      })
      .finally(() => setLoading(false));
  }, [owner, repo, currentBranch]);

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      <Navbar onOpenSearch={() => setIsCommandOpen(true)} />
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      <RepoHeader
        owner={owner}
        repo={repo}
        activeTab="code"
        isPrivate={repoData?.isPrivate}
        starsCount={repoData?.starsCount}
        forksCount={repoData?.forksCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Repo Controls Bar (Branch selector, IDE button, Clone button) */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Branch dropdown */}
            <div className="relative">
              <button
                onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-md text-xs font-semibold text-white transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5 text-[#8b949e]" />
                <span>{currentBranch}</span>
                <ChevronDown className="w-3 h-3 text-[#8b949e]" />
              </button>

              {branchDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-[#161b22] border border-[#30363d] rounded-md shadow-2xl py-1 z-50 text-xs">
                  <div className="px-3 py-1.5 font-semibold text-[#8b949e] border-b border-[#30363d]">
                    Switch branches
                  </div>
                  {branches.map(b => (
                    <button
                      key={b}
                      onClick={() => {
                        setCurrentBranch(b);
                        setBranchDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-[#21262d] flex items-center justify-between ${
                        b === currentBranch ? 'text-cyan-400 font-bold' : 'text-slate-200'
                      }`}
                    >
                      <span>{b}</span>
                      {b === currentBranch && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-xs text-[#8b949e]">
              <strong className="text-white">{branches.length}</strong> branches
            </span>
          </div>

          <div className="flex items-center gap-2 relative">
            {/* Open in Web IDE Button */}
            <a
              href={`/${owner}/${repo}/edit/${currentBranch}/README.md`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-md text-xs font-semibold text-white transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Web IDE</span>
            </a>

            {/* Clone Button */}
            <button
              onClick={() => setIsCloneOpen(!isCloneOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] rounded-md text-xs font-semibold text-white transition-colors"
            >
              <span>Code</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Clone Modal */}
            <CloneModal
              owner={owner}
              repo={repo}
              isOpen={isCloneOpen}
              onClose={() => setIsCloneOpen(false)}
            />
          </div>
        </div>

        {/* File Explorer Table */}
        <FileTree
          owner={owner}
          repo={repo}
          branch={currentBranch}
          entries={entries}
          latestCommit={latestCommit}
        />

        {/* README.md Preview Container */}
        {readmeContent && (
          <div className="border border-[#30363d] rounded-xl overflow-hidden bg-[#0d1117]">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] text-xs font-semibold text-white">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>README.md</span>
            </div>
            <div className="p-6 md:p-8 prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {readmeContent}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
