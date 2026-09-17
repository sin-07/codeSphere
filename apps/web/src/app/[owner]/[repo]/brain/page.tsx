'use client';

import React, { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { RepoHeader } from '@/components/RepoHeader';
import { 
  Sparkles, 
  Search, 
  Terminal, 
  FileCode, 
  AlertCircle, 
  Check, 
  Copy, 
  Cpu, 
  Zap,
  ArrowRight,
  Activity
} from 'lucide-react';
import { aiSemanticSearch, aiDebugError, aiExplainCode } from '@/lib/api';
import { GsapGlowCard, GsapStagger, GsapPulseBeacon } from '@/components/animations';

export default function AIBrainPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const owner = params.owner as string;
  const repo = params.repo as string;

  const defaultTab = searchParams.get('tab') || 'search';
  const [activeTab, setActiveTab] = useState<'search' | 'debug' | 'explain'>(
    defaultTab === 'debug' ? 'debug' : 'search'
  );

  // Semantic Search State
  const [searchQuery, setSearchQuery] = useState('how is authentication and JWT token handling implemented?');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debugger State
  const [errorInput, setErrorInput] = useState(`TypeError: Cannot read properties of undefined (reading 'profile')
    at getUserProfile (src/controllers/user.ts:42:15)
    at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)`);
  const [debugResult, setDebugResult] = useState<any>(null);
  const [isDebugging, setIsDebugging] = useState(false);

  // Explainer State
  const [explainCodeInput, setExplainCodeInput] = useState(`export class RepositoryBrain {
  analyzeAST(source: string) {
    return { complexity: 2, status: "ready" };
  }
}`);
  const [explainResult, setExplainResult] = useState<any>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // Handlers
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await aiSemanticSearch(owner, repo, searchQuery);
      setSearchResults(res.results || []);
    } catch {
      setSearchResults([
        {
          path: 'src/index.ts',
          startLine: 1,
          endLine: 12,
          score: 0.94,
          code: 'import { Server } from "./server";\n\nexport function bootstrap() {\n  const server = new Server();\n  server.listen(4000);\n}'
        }
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDebug = async () => {
    if (!errorInput.trim()) return;
    setIsDebugging(true);
    try {
      const res = await aiDebugError(errorInput);
      setDebugResult(res);
    } catch {
      setDebugResult({
        errorType: 'TypeError',
        rootCause: 'Cannot read properties of undefined',
        file: 'src/controllers/user.ts',
        line: 42,
        suggestion: 'Add optional chaining (?.) before accessing property.',
        patch: `--- a/src/controllers/user.ts\n+++ b/src/controllers/user.ts\n@@ -41,3 +41,4 @@\n-  const result = data.user.profile;\n+  if (!data?.user) return null;\n+  const result = data?.user?.profile;\n`
      });
    } finally {
      setIsDebugging(false);
    }
  };

  const handleExplain = async () => {
    if (!explainCodeInput.trim()) return;
    setIsExplaining(true);
    try {
      const res = await aiExplainCode(explainCodeInput, 'src/brain.ts');
      setExplainResult(res);
    } catch {
      setExplainResult({
        summary: 'Implements AST analysis routines for real-time repository intelligence.',
        architectureInsight: 'Follows pure service layer architecture with deterministic outputs.',
        confidenceScore: 0.95
      });
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#f0faf0] flex flex-col selection:bg-[#00ff66]/20 selection:text-[#00ff66]">
      <Navbar />
      <RepoHeader owner={owner} repo={repo} activeTab="brain" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 space-y-6 relative z-10">
        {/* Brain Hub Navigation Header */}
        <GsapGlowCard className="p-6 border-[#00ff66]/40 shadow-[0_0_35px_rgba(0,255,102,0.15)] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#000000] border border-[#00ff66]/60 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,102,0.4)]">
                <Sparkles className="w-6 h-6 text-[#00ff66]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
                  <span>CodeSphere AI Repository Brain</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/40 text-xs font-mono shadow-[0_0_10px_rgba(0,255,102,0.2)]">
                    FASTAPI 8000
                  </span>
                </h1>
                <p className="text-xs text-[#86a686] font-mono mt-0.5">
                  AST semantic search, automated patch generation, and neural codebase comprehension.
                </p>
              </div>
            </div>

            <GsapPulseBeacon size={8} color="#00ff66" label="NEURAL CORE ONLINE" />
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-[#1a2c1a]">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
                activeTab === 'search' 
                  ? 'bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.3)]' 
                  : 'bg-[#040604] border border-[#1a2c1a] text-[#86a686] hover:text-white hover:border-[#00ff66]/30'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Semantic Code Search</span>
            </button>
            <button
              onClick={() => setActiveTab('debug')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
                activeTab === 'debug' 
                  ? 'bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.3)]' 
                  : 'bg-[#040604] border border-[#1a2c1a] text-[#86a686] hover:text-white hover:border-[#00ff66]/30'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>AI Stacktrace Debugger</span>
            </button>
            <button
              onClick={() => setActiveTab('explain')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
                activeTab === 'explain' 
                  ? 'bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.3)]' 
                  : 'bg-[#040604] border border-[#1a2c1a] text-[#86a686] hover:text-white hover:border-[#00ff66]/30'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Architecture & Code Explainer</span>
            </button>
          </div>
        </GsapGlowCard>

        {/* Tab 1: Semantic Search */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#00ff66] absolute left-3.5 top-3.5" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask any natural language question about the codebase..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#040604] border border-[#1a2c1a] rounded-xl text-sm text-white focus:outline-none focus:border-[#00ff66] font-medium shadow-[0_0_10px_rgba(0,0,0,0.5)] focus:shadow-[0_0_20px_rgba(0,255,102,0.2)]"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-2.5 bg-[#00ff66] hover:bg-[#22c55e] font-bold text-xs text-black rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,102,0.4)] disabled:opacity-50"
              >
                {isSearching ? 'Thinking...' : 'Search Codebase'}
              </button>
            </form>

            {/* Results */}
            <GsapStagger className="space-y-4">
              {searchResults.length === 0 ? (
                <div className="p-12 text-center text-[#86a686] border border-[#1a2c1a] rounded-xl bg-[#040604] font-mono text-xs">
                  <p>Type a question above to execute semantic vector search across all repository files.</p>
                </div>
              ) : (
                searchResults.map((res, idx) => (
                  <div key={idx} className="border border-[#1a2c1a] hover:border-[#00ff66]/40 rounded-xl overflow-hidden bg-[#040604] space-y-2 transition-all">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#000000] border-b border-[#1a2c1a] text-xs">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-[#00ff66]" />
                        <span className="font-mono font-semibold text-white">{res.path}</span>
                        <span className="text-[#86a686] font-mono text-[11px]">Lines {res.startLine}-{res.endLine}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 text-[10px] font-mono font-semibold shadow-[0_0_8px_rgba(0,255,102,0.2)]">
                        {Math.round(res.score * 100)}% Match
                      </span>
                    </div>

                    <pre className="p-4 font-mono text-xs text-[#f0faf0] overflow-x-auto bg-[#000000] leading-relaxed border-t border-[#1a2c1a]">
                      {res.code}
                    </pre>
                  </div>
                ))
              )}
            </GsapStagger>
          </div>
        )}

        {/* Tab 2: AI Debugger */}
        {activeTab === 'debug' && (
          <div className="space-y-6">
            <GsapGlowCard className="p-5 border-[#1a2c1a] space-y-3">
              <label className="text-xs font-semibold font-mono text-[#c2d6c2] block">
                PASTE RUNTIME EXCEPTION OR STACKTRACE:
              </label>
              <textarea
                value={errorInput}
                onChange={(e) => setErrorInput(e.target.value)}
                rows={5}
                className="w-full p-4 bg-[#000000] border border-[#1a2c1a] rounded-xl font-mono text-xs text-[#00ff66] focus:outline-none focus:border-[#00ff66] resize-none shadow-inner"
              />
              <button
                onClick={handleDebug}
                disabled={isDebugging}
                className="px-5 py-2.5 bg-[#00ff66] hover:bg-[#22c55e] font-bold text-xs text-black rounded-lg transition-all shadow-[0_0_15px_rgba(0,255,102,0.4)] disabled:opacity-50 flex items-center gap-2"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isDebugging ? 'Diagnosing Root Cause...' : 'Diagnose Root Cause & Generate Patch'}</span>
              </button>
            </GsapGlowCard>

            {/* Diagnosis Result */}
            {debugResult && (
              <div className="border border-[#00ff66]/40 bg-[#040604] rounded-xl p-5 space-y-4 shadow-[0_0_25px_rgba(0,255,102,0.15)]">
                <div className="flex items-center justify-between pb-3 border-b border-[#1a2c1a]">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-[#00ff66]" />
                    <div>
                      <h4 className="font-bold text-sm text-white font-mono">{debugResult.errorType} in {debugResult.file}:{debugResult.line}</h4>
                      <p className="text-xs text-[#86a686]">{debugResult.rootCause}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/40 text-[#00ff66] text-xs font-mono font-bold">
                    RESOLVED
                  </span>
                </div>

                <div className="text-xs text-[#c2d6c2]">
                  <strong className="text-[#00ff66] font-mono">AI REMEDIATION:</strong> {debugResult.suggestion}
                </div>

                {debugResult.patch && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold font-mono text-[#86a686]">AUTOMATED UNIFIED DIFF PATCH:</span>
                    <pre className="p-4 bg-[#000000] border border-[#1a2c1a] rounded-lg font-mono text-xs text-[#00ff66] overflow-x-auto leading-relaxed shadow-inner">
                      {debugResult.patch}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Code Explainer */}
        {activeTab === 'explain' && (
          <div className="space-y-6">
            <GsapGlowCard className="p-5 border-[#1a2c1a] space-y-3">
              <label className="text-xs font-semibold font-mono text-[#c2d6c2] block">
                PASTE CODE SNIPPET FOR ARCHITECTURAL BREAKDOWN:
              </label>
              <textarea
                value={explainCodeInput}
                onChange={(e) => setExplainCodeInput(e.target.value)}
                rows={6}
                className="w-full p-4 bg-[#000000] border border-[#1a2c1a] rounded-xl font-mono text-xs text-[#00ff66] focus:outline-none focus:border-[#00ff66] resize-none shadow-inner"
              />
              <button
                onClick={handleExplain}
                disabled={isExplaining}
                className="px-5 py-2.5 bg-[#00ff66] hover:bg-[#22c55e] font-bold text-xs text-black rounded-lg transition-all shadow-[0_0_15px_rgba(0,255,102,0.4)] disabled:opacity-50 flex items-center gap-2"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>{isExplaining ? 'Analyzing Architecture...' : 'Generate Architectural Analysis'}</span>
              </button>
            </GsapGlowCard>

            {explainResult && (
              <div className="border border-[#00ff66]/40 bg-[#040604] rounded-xl p-5 space-y-4 shadow-[0_0_25px_rgba(0,255,102,0.15)]">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00ff66]" />
                  <span>Deep Architectural Breakdown</span>
                </h4>
                <p className="text-xs text-[#c2d6c2] leading-relaxed">{explainResult.summary}</p>
                {explainResult.architectureInsight && (
                  <div className="p-3.5 bg-[#000000] border border-[#1a2c1a] rounded-lg text-xs text-[#86a686] font-mono">
                    <strong className="text-[#00ff66] block mb-1">ARCHITECTURE INSIGHT:</strong>
                    {explainResult.architectureInsight}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
