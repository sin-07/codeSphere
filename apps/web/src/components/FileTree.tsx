'use client';

import React from 'react';
import { 
  Folder, 
  FileCode, 
  FileText, 
  FileJson, 
  GitCommit, 
  Clock, 
  ChevronRight,
  File
} from 'lucide-react';
import { TreeEntry, CommitInfo } from '@/types';
import { GsapStagger } from '@/components/animations';

interface FileTreeProps {
  owner: string;
  repo: string;
  branch: string;
  entries: TreeEntry[];
  currentPath?: string;
  latestCommit?: CommitInfo;
}

function getFileIcon(name: string, type: string) {
  if (type === 'tree') return <Folder className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />;
  if (name.endsWith('.ts') || name.endsWith('.tsx') || name.endsWith('.js') || name.endsWith('.jsx')) {
    return <FileCode className="w-4 h-4 text-emerald-400" />;
  }
  if (name.endsWith('.py')) {
    return <FileCode className="w-4 h-4 text-teal-400" />;
  }
  if (name.endsWith('.json')) {
    return <FileJson className="w-4 h-4 text-emerald-300" />;
  }
  if (name.endsWith('.md')) {
    return <FileText className="w-4 h-4 text-emerald-400" />;
  }
  return <File className="w-4 h-4 text-[#91a897]" />;
}

export function FileTree({
  owner,
  repo,
  branch,
  entries,
  currentPath = '',
  latestCommit
}: FileTreeProps) {
  // Sort folders first, then files alphabetically
  const sorted = [...entries].sort((a, b) => {
    if (a.type === 'tree' && b.type !== 'tree') return -1;
    if (a.type !== 'tree' && b.type === 'tree') return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="border border-emerald-500/15 rounded-xl overflow-hidden bg-[#080d0a]/85 backdrop-blur-xl shadow-[0_8px_30px_-6px_rgba(0,0,0,0.5)]">
      {/* Latest Commit Bar */}
      {latestCommit && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#0c120e] border-b border-emerald-500/15 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center font-bold text-[10px] text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
              {latestCommit.author.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-white font-mono">{latestCommit.author}</span>
            <span className="text-[#d1e0d5] truncate max-w-md">{latestCommit.message}</span>
          </div>

          <div className="flex items-center gap-4 text-[#91a897]">
            <a
              href={`/${owner}/${repo}/commit/${latestCommit.sha}`}
              className="font-mono text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 transition-colors"
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>{latestCommit.sha.substring(0, 7)}</span>
            </a>
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{new Date(latestCommit.date).toLocaleDateString()}</span>
            </span>
          </div>
        </div>
      )}

      {/* Directory & Files Table */}
      <GsapStagger className="divide-y divide-emerald-500/10 text-sm">
        {currentPath && (
          <div className="px-4 py-2.5 bg-[#080d0a] hover:bg-emerald-500/10 transition-colors">
            <a
              href={`/${owner}/${repo}/tree/${branch}/${currentPath.split('/').slice(0, -1).join('/')}`}
              className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-2 font-mono text-xs"
            >
              <span>..</span>
              <span className="text-[#91a897]">(Go to parent directory)</span>
            </a>
          </div>
        )}

        {sorted.length === 0 ? (
          <div className="p-8 text-center text-[#91a897] font-mono text-xs">
            <p>No files in this directory.</p>
          </div>
        ) : (
          sorted.map((item) => {
            const isDir = item.type === 'tree';
            const itemHref = isDir
              ? `/${owner}/${repo}/tree/${branch}/${item.path}`
              : `/${owner}/${repo}/blob/${branch}/${item.path}`;

            return (
              <div
                key={item.sha + item.path}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-emerald-500/10 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-[240px]">
                  {getFileIcon(item.name, item.type)}
                  <a
                    href={itemHref}
                    className={`font-medium group-hover:text-emerald-300 transition-colors font-mono text-xs ${
                      isDir ? 'text-white font-semibold' : 'text-[#d1e0d5]'
                    }`}
                  >
                    {item.name}
                  </a>
                </div>

                <div className="hidden md:block flex-1 text-xs text-[#91a897] truncate px-4 font-mono text-[11px]">
                  <span>Tracked in git object store</span>
                </div>

                <div className="text-xs text-[#91a897] font-mono select-none text-right text-[11px]">
                  {item.size ? `${(item.size / 1024).toFixed(1)} KB` : 'DIR'}
                </div>
              </div>
            );
          })
        )}
      </GsapStagger>
    </div>
  );
}
