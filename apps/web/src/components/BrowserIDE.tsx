'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileCode, 
  Save, 
  GitBranch, 
  GitCommit, 
  Check, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Play, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { commitFilesWebIDE, aiExplainCode } from '@/lib/api';

interface BrowserIDEProps {
  owner: string;
  repo: string;
  initialBranch: string;
  initialPath?: string;
  initialContent?: string;
}

export function BrowserIDE({
  owner,
  repo,
  initialBranch,
  initialPath = 'src/index.ts',
  initialContent = '// Welcome to CodeSphere Browser IDE\nexport function main() {\n  console.log("Hello from CodeSphere!");\n}\n'
}: BrowserIDEProps) {
  const [currentFile, setCurrentFile] = useState(initialPath);
  const [code, setCode] = useState(initialContent);
  const [branch, setBranch] = useState(initialBranch || 'main');
  const [commitMessage, setCommitMessage] = useState(`Update ${initialPath}`);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitSuccess, setCommitSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const lines = code.split('\n');

  // Handle direct commit
  const handleCommit = async () => {
    setIsCommitting(true);
    setErrorMsg(null);
    setCommitSuccess(null);

    try {
      const res = await commitFilesWebIDE(owner, repo, {
        branch,
        files: [{ path: currentFile, content: code }],
        message: commitMessage
      });
      setCommitSuccess(`Committed ${res.sha.substring(0, 7)} to branch ${branch}`);
      setTimeout(() => setCommitSuccess(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || err.message);
    } finally {
      setIsCommitting(false);
    }
  };

  // Trigger AI code explanation
  const handleExplain = async () => {
    setIsAnalyzing(true);
    try {
      const res = await aiExplainCode(code, currentFile);
      setAiAnalysis(res);
    } catch {
      setAiAnalysis({ summary: 'Failed to contact AI service.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-[#0d1117] text-white">
      {/* IDE Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#21262d] rounded-md font-mono text-cyan-400">
            <GitBranch className="w-3.5 h-3.5" />
            <span>{branch}</span>
          </div>

          <div className="flex items-center gap-1 text-[#8b949e]">
            <span>{owner}</span>
            <span>/</span>
            <span>{repo}</span>
            <span>/</span>
            <span className="font-semibold text-white">{currentFile}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Explain Button */}
          <button
            onClick={handleExplain}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-300 font-medium rounded-md transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isAnalyzing ? 'Analyzing...' : 'AI Explain Code'}</span>
          </button>

          {/* Direct Commit Button */}
          <button
            onClick={handleCommit}
            disabled={isCommitting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#238636] hover:bg-[#2ea043] font-semibold text-white rounded-md transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isCommitting ? 'Committing...' : 'Commit changes'}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast Bar if commit succeeded or failed */}
      {commitSuccess && (
        <div className="px-4 py-2 bg-emerald-950/80 border-b border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{commitSuccess}</span>
        </div>
      )}
      {errorMsg && (
        <div className="px-4 py-2 bg-rose-950/80 border-b border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Editor & Sidebar Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Main Canvas */}
        <div className="flex-1 flex overflow-hidden font-mono text-xs">
          {/* Line Numbers */}
          <div className="w-12 bg-[#090d13] text-[#484f58] select-none text-right pr-3 py-3 overflow-hidden border-r border-[#21262d] leading-6">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Editable Text Area */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-3 bg-transparent text-[#f0f6fc] focus:outline-none resize-none leading-6 whitespace-pre font-mono selection:bg-indigo-900"
            spellCheck={false}
          />
        </div>

        {/* AI Insight Side Drawer (When AI Explain is clicked) */}
        {aiAnalysis && (
          <div className="w-80 border-l border-[#30363d] bg-[#161b22] p-4 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Code Insights</span>
                </div>
                <button onClick={() => setAiAnalysis(null)} className="text-[#8b949e] hover:text-white text-xs">✕</button>
              </div>

              <div className="text-xs text-[#c9d1d9] space-y-2">
                <p className="font-semibold text-white">Summary:</p>
                <p className="text-[#8b949e] leading-relaxed">{aiAnalysis.summary}</p>
                {aiAnalysis.architectureInsight && (
                  <>
                    <p className="font-semibold text-white pt-2">Architecture:</p>
                    <p className="text-[#8b949e] leading-relaxed">{aiAnalysis.architectureInsight}</p>
                  </>
                )}
              </div>
            </div>

            <div className="text-[11px] text-cyan-400 font-mono text-right pt-4 border-t border-[#30363d]">
              Confidence: {Math.round((aiAnalysis.confidenceScore || 0.92) * 100)}%
            </div>
          </div>
        )}
      </div>

      {/* Editor Status Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#161b22] border-t border-[#30363d] text-[11px] text-[#8b949e]">
        <div className="flex items-center gap-4">
          <span>Lines: {lines.length}</span>
          <span>Characters: {code.length}</span>
          <span>Encoding: UTF-8</span>
          <span>Mode: TypeScript</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Commit message..."
            className="px-2 py-0.5 bg-[#0d1117] border border-[#30363d] rounded text-white text-[11px] w-64 focus:outline-none focus:border-indigo-400"
          />
          <span className="text-emerald-400 flex items-center gap-1 font-mono">
            <Check className="w-3 h-3" /> Ready
          </span>
        </div>
      </div>
    </div>
  );
}
