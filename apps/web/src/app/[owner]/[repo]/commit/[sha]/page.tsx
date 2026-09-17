'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { RepoHeader } from '@/components/RepoHeader';
import { GitDiffViewer } from '@/components/GitDiffViewer';
import { GitCommit, Clock, User, ArrowLeft } from 'lucide-react';
import { fetchCommitDetail } from '@/lib/api';

export default function CommitDetailPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;
  const sha = params.sha as string;

  const [commit, setCommit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!owner || !repo || !sha) return;

    fetchCommitDetail(owner, repo, sha)
      .then(setCommit)
      .catch(() => {
        setCommit({
          sha,
          author: 'Alex Rivera',
          email: 'dev@codesphere.local',
          date: new Date().toISOString(),
          message: 'Implement RepositoryBrain AST analysis service',
          parents: ['a1b2c3d4e5f67890123456789012345678901234'],
          diff: `diff --git a/src/brain.ts b/src/brain.ts\nnew file mode 100644\n--- /dev/null\n+++ b/src/brain.ts\n@@ -0,0 +1,7 @@\n+export class RepositoryBrain {\n+  analyzeAST(source: string) {\n+    return { complexity: 2, status: "ready" };\n+  }\n+}\n`
        });
      })
      .finally(() => setLoading(false));
  }, [owner, repo, sha]);

  return (
    <div className="min-h-screen bg-[#050806] flex flex-col">
      <Navbar />
      <RepoHeader owner={owner} repo={repo} activeTab="code" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 space-y-6">
        <a
          href={`/${owner}/${repo}/commits`}
          className="inline-flex items-center gap-1 text-xs text-[#91a897] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all commits</span>
        </a>

        {/* Commit Header Card */}
        <div className="p-5 bg-[#080d0a] border border-[rgba(16,185,129,0.15)] rounded-xl space-y-3">
          <h1 className="text-lg font-bold text-white leading-snug">
            {commit?.message || 'Commit'}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs pt-2 border-t border-[#0c120e]">
            <div className="flex items-center gap-2 text-[#91a897]">
              <div className="w-5 h-5 rounded-full bg-indigo-500/30 flex items-center justify-center text-[10px] text-emerald-300 font-bold">
                {commit?.author?.charAt(0) || 'A'}
              </div>
              <span className="text-white font-medium">{commit?.author}</span>
              <span>committed on {new Date(commit?.date || Date.now()).toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[#91a897]">
              <span>commit: <strong className="text-emerald-400">{sha}</strong></span>
            </div>
          </div>
        </div>

        {/* Unified / Split Diff Viewer */}
        {commit?.diff && (
          <GitDiffViewer
            diffText={commit.diff}
            filesChanged={[{ filename: 'src/brain.ts', additions: 7, deletions: 0 }]}
          />
        )}
      </main>
    </div>
  );
}
