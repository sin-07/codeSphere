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
  if (type === 'tree') return <Folder className="w-4 h-4 text-[#00ff66] fill-[#00ff66]/20" />;
  if (name.endsWith('.ts') || name.endsWith('.tsx') || name.endsWith('.js') || name.endsWith('.jsx')) {
    return <FileCode className="w-4 h-4 text-[#4ade80]" />;
  }
  if (name.endsWith('.py')) {
    return <FileCode className="w-4 h-4 text-[#00e575]" />;
  }
  if (name.endsWith('.json')) {
    return <FileJson className="w-4 h-4 text-[#10b981]" />;
  }
  if (name.endsWith('.md')) {
    return <FileText className="w-4 h-4 text-[#00ff66]" />;
  }
  return <File className="w-4 h-4 text-[#86a686]" />;
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
    <div className="border border-[#1a2c1a] rounded-xl overflow-hidden bg-[#040604]/90 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
      {/* Latest Commit Bar */}
      {latestCommit && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#000000] border-b border-[#1a2c1a] text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#00ff66]/20 border border-[#00ff66]/50 flex items-center justify-center font-bold text-[10px] text-[#00ff66] shadow-[0_0_8px_rgba(0,255,102,0.3)]">
              {latestCommit.author.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-white font-mono">{latestCommit.author}</span>
            <span className="text-[#c2d6c2] truncate max-w-md">{latestCommit.message}</span>
          </div>

          <div className="flex items-center gap-4 text-[#86a686]">
            <a
              href={`/${owner}/${repo}/commit/${latestCommit.sha}`}
              className="font-mono text-[#00ff66] hover:underline flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#00ff66]/10 border border-[#00ff66]/30 shadow-[0_0_8px_rgba(0,255,102,0.2)]"
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>{latestCommit.sha.substring(0, 7)}</span>
            </a>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Clock className="w-3.5 h-3.5 text-[#00ff66]" />
              <span>{new Date(latestCommit.date).toLocaleDateString()}</span>
            </span>
          </div>
        </div>
      )}

      {/* Directory & Files Table */}
      <GsapStagger className="divide-y divide-[#131f13] text-sm">
        {currentPath && (
          <div className="px-4 py-2.5 bg-[#040604] hover:bg-[#00ff66]/5 transition-colors">
            <a
              href={`/${owner}/${repo}/tree/${branch}/${currentPath.split('/').slice(0, -1).join('/')}`}
              className="text-[#00ff66] hover:underline flex items-center gap-2 font-mono text-xs"
            >
              <span>..</span>
              <span className="text-[#86a686]">(Go to parent directory)</span>
            </a>
          </div>
        )}

        {sorted.length === 0 ? (
          <div className="p-8 text-center text-[#86a686] font-mono">
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
                className="flex items-center justify-between px-4 py-2.5 hover:bg-[#00ff66]/5 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-[240px]">
                  {getFileIcon(item.name, item.type)}
                  <a
                    href={itemHref}
                    className={`font-medium group-hover:text-[#00ff66] transition-colors font-mono text-xs ${
                      isDir ? 'text-white font-semibold' : 'text-[#c2d6c2]'
                    }`}
                  >
                    {item.name}
                  </a>
                </div>

                <div className="hidden md:block flex-1 text-xs text-[#86a686] truncate px-4 font-mono text-[11px]">
                  <span>Tracked in git object store</span>
                </div>

                <div className="text-xs text-[#86a686] font-mono select-none text-right text-[11px]">
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
