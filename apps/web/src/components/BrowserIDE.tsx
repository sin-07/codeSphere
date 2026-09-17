'use client';

import React, { useState } from 'react';
import { 
  Save, 
  GitBranch, 
  Check, 
  AlertCircle, 
  Sparkles,
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
    <div className="flex flex-col h-[calc(100vh-65px)] bg-[#050806] text-[#f0f7f2]">
      {/* IDE Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#080d0a] border-b border-emerald-500/15 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0c120e] rounded-md font-mono text-emerald-300 border border-emerald-500/20">
            <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
            <span>{branch}</span>
          </div>

          <div className="flex items-center gap-1 text-[#91a897] font-mono text-xs">
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAnalyzing ? 'Analyzing...' : 'AI Explain Code'}</span>
          </button>

          {/* Direct Commit Button */}
          <button
            onClick={handleCommit}
            disabled={isCommitting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 font-semibold text-white rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isCommitting ? 'Committing...' : 'Commit changes'}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast Bar if commit succeeded or failed */}
      {commitSuccess && (
        <div className="px-4 py-2 bg-emerald-950/80 border-b border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{commitSuccess}</span>
        </div>
      )}
      {errorMsg && (
        <div className="px-4 py-2 bg-rose-950/80 border-b border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Editor & Sidebar Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Main Canvas */}
        <div className="flex-1 flex overflow-hidden font-mono text-xs">
          {/* Line Numbers */}
          <div className="w-12 bg-[#050806] text-[#526657] select-none text-right pr-3 py-3 overflow-hidden border-r border-emerald-500/10 leading-6">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Editable Text Area */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-3 bg-transparent text-[#f0f7f2] focus:outline-none resize-none leading-6 whitespace-pre font-mono selection:bg-emerald-500/25"
            spellCheck={false}
          />
        </div>

        {/* AI Insight Side Drawer (When AI Explain is clicked) */}
        {aiAnalysis && (
          <div className="w-80 border-l border-emerald-500/15 bg-[#080d0a] p-4 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/15">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Code Insights</span>
                </div>
                <button onClick={() => setAiAnalysis(null)} className="text-[#91a897] hover:text-white text-xs">✕</button>
              </div>

              <div className="text-xs text-[#d1e0d5] space-y-2">
                <p className="font-semibold text-white">Summary:</p>
                <p className="text-[#91a897] leading-relaxed">{aiAnalysis.summary}</p>
                {aiAnalysis.architectureInsight && (
                  <>
                    <p className="font-semibold text-white pt-2">Architecture:</p>
                    <p className="text-[#91a897] leading-relaxed">{aiAnalysis.architectureInsight}</p>
                  </>
                )}
              </div>
            </div>

            <div className="text-[11px] text-emerald-400 font-mono text-right pt-4 border-t border-emerald-500/15">
              Confidence: {Math.round((aiAnalysis.confidenceScore || 0.92) * 100)}%
            </div>
          </div>
        )}
      </div>

      {/* Editor Status Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#080d0a] border-t border-emerald-500/15 text-[11px] text-[#91a897]">
        <div className="flex items-center gap-4 font-mono">
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
            className="px-2 py-0.5 bg-[#050806] border border-emerald-500/20 rounded text-white text-[11px] w-64 focus:outline-none focus:border-emerald-500/50 shadow-inner"
          />
          <span className="text-emerald-400 flex items-center gap-1 font-mono">
            <Check className="w-3 h-3" /> Ready
          </span>
        </div>
      </div>
    </div>
  );
}
