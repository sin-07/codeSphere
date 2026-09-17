'use client';

import React, { useState } from 'react';
import { Network, Layers, ZoomIn, ZoomOut, RotateCcw, Info } from 'lucide-react';

interface ArchNode {
  id: string;
  label: string;
  path: string;
  tier: string;
  loc: number;
}

interface ArchEdge {
  source: string;
  target: string;
  type: string;
}

interface InteractiveArchMapProps {
  nodes: ArchNode[];
  edges: ArchEdge[];
  tiers?: Record<string, number>;
}

const TIER_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  'UI / Frontend': { bg: 'bg-emerald-950/40', border: 'border-emerald-500/50', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  'API & Gateway': { bg: 'bg-indigo-950/40', border: 'border-indigo-500/50', text: 'text-indigo-300', dot: 'bg-indigo-400' },
  'Service Layer': { bg: 'bg-cyan-950/40', border: 'border-cyan-500/50', text: 'text-cyan-300', dot: 'bg-cyan-400' },
  'Database & Storage': { bg: 'bg-purple-950/40', border: 'border-purple-500/50', text: 'text-purple-300', dot: 'bg-purple-400' },
  'Shared Utilities': { bg: 'bg-amber-950/40', border: 'border-amber-500/50', text: 'text-amber-300', dot: 'bg-amber-400' },
  'Core Module': { bg: 'bg-slate-900/60', border: 'border-slate-600', text: 'text-slate-300', dot: 'bg-slate-400' }
};

export function InteractiveArchMap({ nodes, edges, tiers = {} }: InteractiveArchMapProps) {
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>(null);
  const [activeTierFilter, setActiveTierFilter] = useState<string | null>(null);

  const filteredNodes = activeTierFilter
    ? nodes.filter(n => n.tier === activeTierFilter)
    : nodes;

  const nodePositions = new Map<string, { x: number; y: number }>();
  // Arrange nodes in grid / layers
  const distinctTiers = Array.from(new Set(nodes.map(n => n.tier)));
  distinctTiers.forEach((tier, tierIdx) => {
    const tierNodes = nodes.filter(n => n.tier === tier);
    tierNodes.forEach((node, nodeIdx) => {
      const x = 120 + nodeIdx * 200;
      const y = 80 + tierIdx * 130;
      nodePositions.set(node.id, { x, y });
    });
  });

  return (
    <div className="space-y-4">
      {/* Tier Filter Pills & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#161b22] border border-[#30363d] rounded-lg">
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTierFilter(null)}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTierFilter === null ? 'bg-indigo-600 text-white' : 'bg-[#21262d] text-[#8b949e] hover:text-white'
            }`}
          >
            All Tiers ({nodes.length})
          </button>
          {Object.entries(tiers).map(([tierName, count]) => {
            const styling = TIER_COLORS[tierName] || TIER_COLORS['Core Module'];
            return (
              <button
                key={tierName}
                onClick={() => setActiveTierFilter(activeTierFilter === tierName ? null : tierName)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium border transition-all ${
                  activeTierFilter === tierName
                    ? `${styling.bg} ${styling.border} ${styling.text}`
                    : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${styling.dot}`} />
                <span>{tierName}</span>
                <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 text-xs text-[#8b949e]">
          <span>{edges.length} Dependency Links</span>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative border border-[#30363d] rounded-xl bg-[#090d13] overflow-hidden min-h-[460px] p-6">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <svg className="w-full h-[460px] select-none">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" opacity="0.6" />
            </marker>
          </defs>

          {/* Render Connecting Dependency Edges */}
          {edges.map((edge, idx) => {
            const sPos = nodePositions.get(edge.source);
            const tPos = nodePositions.get(edge.target);
            if (!sPos || !tPos) return null;

            const isHighlighted = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

            return (
              <line
                key={idx}
                x1={sPos.x + 80}
                y1={sPos.y + 25}
                x2={tPos.x + 80}
                y2={tPos.y + 25}
                stroke={isHighlighted ? '#22d3ee' : '#30363d'}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                strokeDasharray={isHighlighted ? 'none' : '4 4'}
                markerEnd="url(#arrow)"
                className="transition-all duration-300"
              />
            );
          })}

          {/* Render Nodes */}
          {filteredNodes.map((node) => {
            const pos = nodePositions.get(node.id) || { x: 100, y: 100 };
            const styling = TIER_COLORS[node.tier] || TIER_COLORS['Core Module'];
            const isSelected = selectedNode?.id === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer group"
              >
                <rect
                  width="160"
                  height="50"
                  rx="8"
                  fill="#161b22"
                  stroke={isSelected ? '#22d3ee' : '#30363d'}
                  strokeWidth={isSelected ? 2 : 1}
                  className="group-hover:stroke-indigo-400 transition-all duration-200"
                />
                {/* Tier indicator pill */}
                <circle cx="15" cy="25" r="4" className={styling.dot} />
                <text x="26" y="24" fill="#f0f6fc" fontSize="11" fontWeight="600" fontFamily="monospace">
                  {node.label.length > 15 ? `${node.label.substring(0, 14)}…` : node.label}
                </text>
                <text x="26" y="38" fill="#8b949e" fontSize="9">
                  {node.tier} • {node.loc} LOC
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute bottom-4 right-4 w-72 bg-[#161b22]/95 backdrop-blur-md border border-[#30363d] rounded-lg p-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
              <span className="text-xs font-semibold text-cyan-400 font-mono">{selectedNode.label}</span>
              <button onClick={() => setSelectedNode(null)} className="text-[#8b949e] hover:text-white text-xs">✕</button>
            </div>
            <div className="mt-2 space-y-1.5 text-xs text-[#8b949e]">
              <p><span className="text-[#f0f6fc]">Path:</span> {selectedNode.path}</p>
              <p><span className="text-[#f0f6fc]">Tier:</span> {selectedNode.tier}</p>
              <p><span className="text-[#f0f6fc]">Lines of Code:</span> {selectedNode.loc}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
