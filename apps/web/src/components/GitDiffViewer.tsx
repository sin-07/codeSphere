'use client';

import React, { useState } from 'react';
import { FileCode, Plus, MessageSquare, ChevronDown, ChevronRight, Check } from 'lucide-react';

interface GitDiffViewerProps {
  diffText: string;
  filesChanged?: Array<{ filename: string; additions: number; deletions: number }>;
  onAddComment?: (path: string, line: number, text: string) => void;
}

export function GitDiffViewer({ diffText, filesChanged = [], onAddComment }: GitDiffViewerProps) {
  const [activeView, setActiveView] = useState<'unified' | 'split'>('unified');
  const [commentingLine, setCommentingLine] = useState<{ file: string; line: number } | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  // Parse unified diff into structured file chunks
  const parsedFiles: Array<{ filename: string; hunks: Array<{ header: string; lines: Array<{ type: 'add' | 'del' | 'context'; oldNum?: number; newNum?: number; text: string }> }> }> = [];

  const rawFileDiffs = diffText.split(/^diff --git /m).filter(Boolean);

  for (const raw of rawFileDiffs) {
    const lines = raw.split('\n');
    const firstLine = lines[0] || '';
    const match = firstLine.match(/a\/(.*?)\s+b\/(.*)/);
    const filename = match ? match[2] : (lines.find(l => l.startsWith('+++ b/'))?.replace('+++ b/', '') || 'unknown');

    const hunks: Array<{ header: string; lines: any[] }> = [];
    let currentHunk: { header: string; lines: any[] } | null = null;
    let oldNum = 1;
    let newNum = 1;

    for (const line of lines) {
      if (line.startsWith('@@')) {
        const hunkMatch = line.match(/@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@(.*)/);
        if (hunkMatch) {
          oldNum = parseInt(hunkMatch[1], 10);
          newNum = parseInt(hunkMatch[2], 10);
        }
        currentHunk = { header: line, lines: [] };
        hunks.push(currentHunk);
      } else if (currentHunk) {
        if (line.startsWith('+') && !line.startsWith('+++')) {
          currentHunk.lines.push({ type: 'add', newNum: newNum++, text: line.substring(1) });
        } else if (line.startsWith('-') && !line.startsWith('---')) {
          currentHunk.lines.push({ type: 'del', oldNum: oldNum++, text: line.substring(1) });
        } else if (line.startsWith(' ')) {
          currentHunk.lines.push({ type: 'context', oldNum: oldNum++, newNum: newNum++, text: line.substring(1) });
        }
      }
    }

    if (hunks.length > 0) {
      parsedFiles.push({ filename, hunks });
    }
  }

  const handleSaveComment = (filename: string, line: number) => {
    if (!commentInput.trim()) return;
    if (onAddComment) {
      onAddComment(filename, line, commentInput);
    }
    setCommentingLine(null);
    setCommentInput('');
  };

  return (
    <div className="space-y-6">
      {/* Diff Controls Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border border-[#30363d] rounded-lg text-sm">
        <div className="flex items-center gap-4 text-xs">
          <span className="font-semibold text-white">Showing {parsedFiles.length || filesChanged.length} changed files</span>
          <span className="text-emerald-400 font-medium">+{filesChanged.reduce((acc, f) => acc + f.additions, 0)} additions</span>
          <span className="text-rose-400 font-medium">-{filesChanged.reduce((acc, f) => acc + f.deletions, 0)} deletions</span>
        </div>

        <div className="flex items-center gap-1 bg-[#0d1117] p-0.5 rounded-md border border-[#30363d]">
          <button
            onClick={() => setActiveView('unified')}
            className={`px-3 py-1 text-xs font-medium rounded ${activeView === 'unified' ? 'bg-[#21262d] text-white' : 'text-[#8b949e]'}`}
          >
            Unified
          </button>
          <button
            onClick={() => setActiveView('split')}
            className={`px-3 py-1 text-xs font-medium rounded ${activeView === 'split' ? 'bg-[#21262d] text-white' : 'text-[#8b949e]'}`}
          >
            Split
          </button>
        </div>
      </div>

      {/* Files Diffs */}
      {parsedFiles.length === 0 ? (
        <div className="p-8 text-center text-[#8b949e] border border-[#30363d] rounded-lg bg-[#161b22]">
          <p>No textual differences to display.</p>
        </div>
      ) : (
        parsedFiles.map((file, fIdx) => (
          <div key={fIdx} className="border border-[#30363d] rounded-lg overflow-hidden bg-[#0d1117]">
            {/* File Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#30363d]">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                <span className="font-mono text-sm font-semibold text-white">{file.filename}</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(file.filename);
                  setCopiedFile(file.filename);
                  setTimeout(() => setCopiedFile(null), 2000);
                }}
                className="text-xs text-[#8b949e] hover:text-white transition-colors flex items-center gap-1"
              >
                {copiedFile === file.filename ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                <span>Copy path</span>
              </button>
            </div>

            {/* Hunks & Lines */}
            <div className="font-mono text-xs overflow-x-auto divide-y divide-[#21262d]">
              {file.hunks.map((hunk, hIdx) => (
                <div key={hIdx}>
                  <div className="px-4 py-1.5 bg-[#1f242c]/70 text-[#8b949e] text-[11px] font-semibold">
                    {hunk.header}
                  </div>
                  <div>
                    {hunk.lines.map((line, lIdx) => {
                      const isCommenting = commentingLine?.file === file.filename && commentingLine?.line === (line.newNum || line.oldNum);
                      return (
                        <div key={lIdx} className="group relative">
                          <div
                            className={`flex items-start px-2 py-0.5 leading-5 hover:bg-[#21262d]/50 transition-colors ${
                              line.type === 'add'
                                ? 'diff-line-added'
                                : line.type === 'del'
                                ? 'diff-line-removed'
                                : 'diff-line-context'
                            }`}
                          >
                            {/* Old line num */}
                            <span className="w-10 text-right select-none pr-3 text-[#484f58]">
                              {line.oldNum || ''}
                            </span>
                            {/* New line num */}
                            <span className="w-10 text-right select-none pr-3 text-[#484f58]">
                              {line.newNum || ''}
                            </span>
                            {/* Diff sign indicator */}
                            <span className="w-4 text-center select-none font-bold">
                              {line.type === 'add' ? '+' : line.type === 'del' ? '-' : ' '}
                            </span>
                            {/* Line content */}
                            <span className="flex-1 whitespace-pre pl-1 text-[#f0f6fc]">
                              {line.text}
                            </span>

                            {/* Add review comment button on hover */}
                            <button
                              onClick={() => setCommentingLine({ file: file.filename, line: line.newNum || line.oldNum || 1 })}
                              className="opacity-0 group-hover:opacity-100 px-1.5 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] ml-2 flex items-center gap-1 transition-opacity"
                              title="Add line review comment"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Inline comment form */}
                          {isCommenting && (
                            <div className="p-3 bg-[#161b22] border-y border-indigo-500/40 my-1 ml-24 mr-4 rounded-md">
                              <textarea
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                placeholder="Leave a review comment on this line..."
                                className="w-full p-2 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-white focus:outline-none focus:border-indigo-400 h-20"
                              />
                              <div className="flex items-center justify-end gap-2 mt-2">
                                <button
                                  onClick={() => setCommentingLine(null)}
                                  className="px-3 py-1 text-xs text-[#8b949e] hover:text-white"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveComment(file.filename, line.newNum || line.oldNum || 1)}
                                  className="px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded"
                                >
                                  Comment
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
