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

interface FileTreeProps {
  owner: string;
  repo: string;
  branch: string;
  entries: TreeEntry[];
  currentPath?: string;
  latestCommit?: CommitInfo;
}

function getFileIcon(name: string, type: string) {
  if (type === 'tree') return <Folder className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />;
  if (name.endsWith('.ts') || name.endsWith('.tsx') || name.endsWith('.js') || name.endsWith('.jsx')) {
    return <FileCode className="w-4 h-4 text-indigo-400" />;
  }
  if (name.endsWith('.py')) {
    return <FileCode className="w-4 h-4 text-amber-400" />;
  }
  if (name.endsWith('.json')) {
    return <FileJson className="w-4 h-4 text-emerald-400" />;
  }
  if (name.endsWith('.md')) {
    return <FileText className="w-4 h-4 text-sky-400" />;
  }
  return <File className="w-4 h-4 text-[#8b949e]" />;
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
    <div className="border border-[#30363d] rounded-lg overflow-hidden bg-[#161b22]">
      {/* Latest Commit Bar */}
      {latestCommit && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#1c2128] border-b border-[#30363d] text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-indigo-500/30 border border-indigo-500 flex items-center justify-center font-bold text-[10px] text-indigo-300">
              {latestCommit.author.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-white">{latestCommit.author}</span>
            <span className="text-[#c9d1d9] truncate max-w-md">{latestCommit.message}</span>
          </div>

          <div className="flex items-center gap-4 text-[#8b949e]">
            <a
              href={`/${owner}/${repo}/commit/${latestCommit.sha}`}
              className="font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>{latestCommit.sha.substring(0, 7)}</span>
            </a>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{new Date(latestCommit.date).toLocaleDateString()}</span>
            </span>
          </div>
        </div>
      )}

      {/* Directory & Files Table */}
      <div className="divide-y divide-[#21262d] text-sm">
        {currentPath && (
          <div className="px-4 py-2.5 bg-[#161b22] hover:bg-[#21262d]/50 transition-colors">
            <a
              href={`/${owner}/${repo}/tree/${branch}/${currentPath.split('/').slice(0, -1).join('/')}`}
              className="text-indigo-400 hover:underline flex items-center gap-2 font-mono text-xs"
            >
              <span>..</span>
              <span className="text-[#8b949e]">(Go to parent directory)</span>
            </a>
          </div>
        )}

        {sorted.length === 0 ? (
          <div className="p-8 text-center text-[#8b949e]">
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
                className="flex items-center justify-between px-4 py-2.5 hover:bg-[#21262d]/50 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-[240px]">
                  {getFileIcon(item.name, item.type)}
                  <a
                    href={itemHref}
                    className={`font-medium hover:underline transition-colors ${
                      isDir ? 'text-white' : 'text-[#c9d1d9]'
                    }`}
                  >
                    {item.name}
                  </a>
                </div>

                <div className="hidden md:block flex-1 text-xs text-[#8b949e] truncate px-4">
                  <span>Update {item.name} with architecture improvements</span>
                </div>

                <div className="text-xs text-[#8b949e] select-none text-right">
                  {item.size ? `${(item.size / 1024).toFixed(1)} KB` : 'dir'}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
