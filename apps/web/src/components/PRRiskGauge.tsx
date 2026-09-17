'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, FileCode, Zap, Layers } from 'lucide-react';

interface PRRiskGaugeProps {
  riskData: {
    riskScore: number;
    riskTier: 'LOW' | 'MEDIUM' | 'CRITICAL';
    blastRadius: {
      totalFiles: number;
      churn: number;
      additions: number;
      deletions: number;
      criticalFiles: string[];
    };
    riskFactors: string[];
    breakingChanges: Array<{ symbol: string; type: string; impact: string }>;
    hasTests: boolean;
    recommendedAction: string;
  };
}

export function PRRiskGauge({ riskData }: PRRiskGaugeProps) {
  const { riskScore, riskTier, blastRadius, riskFactors, breakingChanges, hasTests, recommendedAction } = riskData;

  const tierColors = {
    LOW: { border: 'border-emerald-500/40', text: 'text-emerald-400', bg: 'bg-emerald-950/20' },
    MEDIUM: { border: 'border-amber-500/40', text: 'text-amber-400', bg: 'bg-amber-950/20' },
    CRITICAL: { border: 'border-rose-500/40', text: 'text-rose-400', bg: 'bg-rose-950/20' }
  }[riskTier] || { border: 'border-slate-500', text: 'text-slate-400', bg: 'bg-slate-900' };

  return (
    <div className={`border ${tierColors.border} ${tierColors.bg} rounded-xl p-5 space-y-4`}>
      {/* Header with Risk Tier & Gauge */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0d1117] border border-[#30363d] flex items-center justify-center">
            {riskTier === 'LOW' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">AI PR Risk & Blast Radius</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tierColors.text} bg-[#0d1117] border border-current`}>
                {riskTier} RISK ({riskScore}/100)
              </span>
            </div>
            <p className="text-xs text-[#8b949e]">{recommendedAction}</p>
          </div>
        </div>

        {/* Churn Stats Badge */}
        <div className="flex items-center gap-4 text-xs font-mono bg-[#0d1117] px-3.5 py-2 rounded-lg border border-[#30363d]">
          <div>
            <span className="text-[#8b949e] block text-[10px]">Files</span>
            <span className="text-white font-bold">{blastRadius.totalFiles}</span>
          </div>
          <div>
            <span className="text-[#8b949e] block text-[10px]">Churn</span>
            <span className="text-cyan-400 font-bold">{blastRadius.churn} lines</span>
          </div>
          <div>
            <span className="text-[#8b949e] block text-[10px]">Tests Added</span>
            <span className={hasTests ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {hasTests ? 'YES' : 'NO'}
            </span>
          </div>
        </div>
      </div>

      {/* Breaking Changes Warning if present */}
      {breakingChanges.length > 0 && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-lg text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-rose-300">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Potential Breaking Changes Detected</span>
          </div>
          {breakingChanges.map((bc, idx) => (
            <p key={idx} className="text-[#f0f6fc] pl-5">
              • Symbol <code className="text-rose-300 font-mono">{bc.symbol}</code> ({bc.type}): {bc.impact}
            </p>
          ))}
        </div>
      )}

      {/* Critical Infrastructure Touched */}
      {blastRadius.criticalFiles.length > 0 && (
        <div className="text-xs">
          <p className="font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Critical Security / Data Files Modified:</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {blastRadius.criticalFiles.map((file, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-[#0d1117] border border-amber-500/30 text-amber-300 rounded font-mono text-[11px]">
                {file}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Risk Factors Checklist */}
      <div className="text-xs text-[#8b949e] space-y-1 pt-1 border-t border-[#30363d]/50">
        {riskFactors.map((factor, idx) => (
          <p key={idx} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>{factor}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
