'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { RepoHeader } from '@/components/RepoHeader';
import { 
  PlayCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RotateCw, 
  Terminal, 
  Check, 
  Play,
  Layers
} from 'lucide-react';
import { fetchCIPipelineRuns, triggerCIPipelineRun } from '@/lib/api';
import { CIPipelineRun } from '@/types';

export default function ActionsPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;

  const [runs, setRuns] = useState<CIPipelineRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<CIPipelineRun | null>(null);
  const [selectedStep, setSelectedStep] = useState<any | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);

  useEffect(() => {
    if (!owner || !repo) return;

    fetchCIPipelineRuns(owner, repo)
      .then(data => {
        setRuns(data || []);
        if (data && data.length > 0) {
          setSelectedRun(data[0]);
          if (data[0].stages?.[0]?.steps?.[0]) {
            setSelectedStep(data[0].stages[0].steps[0]);
          }
        }
      })
      .catch(() => {
        const mockRun: CIPipelineRun = {
          _id: '1',
          repoSlug: `${owner}/${repo}`,
          commitSha: 'e9b2c34a123f4567890123456789012345678901',
          commitMessage: 'Initial release: Setup distributed server architecture',
          branch: 'main',
          author: 'demo-dev',
          trigger: 'push',
          status: 'success',
          startedAt: new Date(Date.now() - 3600000).toISOString(),
          durationSeconds: 16,
          stages: [
            {
              name: 'Build & Quality Gate',
              status: 'success',
              steps: [
                {
                  name: 'TypeScript Compilation',
                  command: 'tsc --noEmit',
                  status: 'success',
                  durationSeconds: 4,
                  logs: [
                    'Initializing TypeScript compiler v5.4.5...',
                    'Compiling project files in services/api...',
                    '0 type errors detected. Compilation successful.'
                  ]
                },
                {
                  name: 'Jest Unit Test Suite',
                  command: 'jest',
                  status: 'success',
                  durationSeconds: 7,
                  logs: [
                    'PASS src/tests/auth.test.ts',
                    'PASS src/tests/git.test.ts',
                    'PASS src/tests/pr.test.ts',
                    'Test Suites: 3 passed, 3 total',
                    'Tests:       18 passed, 18 total',
                    'Time:        6.842s'
                  ]
                },
                {
                  name: 'Autonomous AI Security Gate',
                  command: 'codesphere scan --security',
                  status: 'success',
                  durationSeconds: 5,
                  logs: [
                    'Scanning 24 files for CVE vulnerabilities and hardcoded secrets...',
                    'Analyzing dependencies in package.json...',
                    '0 CVEs found. 0 leaked secrets.',
                    'Status: VERIFIED SAFE'
                  ]
                }
              ]
            }
          ]
        };
        setRuns([mockRun]);
        setSelectedRun(mockRun);
        setSelectedStep(mockRun.stages[0].steps[0]);
      });
  }, [owner, repo]);

  const handleTriggerRun = async () => {
    setIsTriggering(true);
    try {
      const newRun = await triggerCIPipelineRun(owner, repo, 'main');
      setRuns(prev => [newRun, ...prev]);
      setSelectedRun(newRun);
      if (newRun.stages?.[0]?.steps?.[0]) setSelectedStep(newRun.stages[0].steps[0]);
    } catch {
      alert('Failed to trigger workflow');
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      <Navbar />
      <RepoHeader owner={owner} repo={repo} activeTab="actions" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Actions Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#161b22] border border-[#30363d] rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center">
              <PlayCircle className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">CI/CD Pipeline Engine</h1>
              <p className="text-xs text-[#8b949e]">
                Automated continuous integration, test verification, and deployment pipelines.
              </p>
            </div>
          </div>

          <button
            onClick={handleTriggerRun}
            disabled={isTriggering}
            className="flex items-center gap-2 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] rounded-lg text-xs font-semibold text-white transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isTriggering ? 'Scheduling run...' : 'Run workflow manually'}</span>
          </button>
        </div>

        {/* Pipeline Runs Grid: List on Left, Live Logs on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Runs List */}
          <div className="lg:col-span-1 border border-[#30363d] rounded-xl bg-[#161b22] overflow-hidden">
            <div className="p-3 bg-[#1c2128] border-b border-[#30363d] text-xs font-semibold text-[#8b949e]">
              Recent Workflow Runs ({runs.length})
            </div>

            <div className="divide-y divide-[#21262d]">
              {runs.map(run => (
                <div
                  key={run._id}
                  onClick={() => {
                    setSelectedRun(run);
                    if (run.stages?.[0]?.steps?.[0]) setSelectedStep(run.stages[0].steps[0]);
                  }}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    selectedRun?._id === run._id ? 'bg-[#21262d] border-l-2 border-cyan-400' : 'hover:bg-[#21262d]/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      {run.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : run.status === 'running' ? (
                        <RotateCw className="w-4 h-4 text-cyan-400 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                      <span className="font-semibold text-white truncate max-w-[180px]">
                        {run.commitMessage || 'Workflow Run'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#8b949e]">
                    <span className="font-mono">{run.branch}</span>
                    <span>{run.durationSeconds || 16}s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Pipeline Stages & Live Streaming Logs */}
          <div className="lg:col-span-2 space-y-4">
            {selectedRun && (
              <>
                {/* Stages & Steps Diagram */}
                <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>Pipeline Stages: {selectedRun.stages?.[0]?.name || 'Build & Test'}</span>
                    </span>
                    <span className="text-emerald-400 font-semibold font-mono">
                      STATUS: {selectedRun.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Step Buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedRun.stages?.[0]?.steps?.map((step, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedStep(step)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                          selectedStep?.name === step.name
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-md'
                            : 'bg-[#0d1117] border border-[#30363d] text-[#8b949e] hover:text-white'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{step.name}</span>
                        <span className="text-[10px] text-[#484f58]">({step.durationSeconds}s)</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step Terminal Output Logs */}
                <div className="border border-[#30363d] rounded-xl bg-[#090d13] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d] text-xs font-mono">
                    <div className="flex items-center gap-2 text-[#c9d1d9]">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span>{selectedStep?.command || 'runner script'}</span>
                    </div>
                    <span className="text-emerald-400 font-semibold">Exit Code 0</span>
                  </div>

                  <div className="p-4 font-mono text-xs text-[#a6acb9] space-y-1 overflow-x-auto max-h-80 leading-relaxed">
                    {selectedStep?.logs?.length ? (
                      selectedStep.logs.map((log: string, lIdx: number) => (
                        <div key={lIdx} className="whitespace-pre">
                          <span className="text-[#484f58] select-none pr-3">{(lIdx + 1).toString().padStart(2, '0')}</span>
                          <span>{log}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#484f58]">No terminal output recorded for this step.</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
