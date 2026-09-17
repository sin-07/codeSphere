'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Network, Layers, ZoomIn, ZoomOut, RotateCcw, Info, Sparkles } from 'lucide-react';
import gsap from 'gsap';

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
  'UI / Frontend': { bg: 'bg-[#00ff66]/10', border: 'border-[#00ff66]/60', text: 'text-[#00ff66]', dot: '#00ff66' },
  'API & Gateway': { bg: 'bg-[#10b981]/10', border: 'border-[#10b981]/60', text: 'text-[#10b981]', dot: '#10b981' },
  'Service Layer': { bg: 'bg-[#34d399]/10', border: 'border-[#34d399]/60', text: 'text-[#34d399]', dot: '#34d399' },
  'Database & Storage': { bg: 'bg-[#059669]/10', border: 'border-[#059669]/60', text: 'text-[#059669]', dot: '#059669' },
  'Shared Utilities': { bg: 'bg-[#6ee7b7]/10', border: 'border-[#6ee7b7]/60', text: 'text-[#6ee7b7]', dot: '#6ee7b7' },
  'Core Module': { bg: 'bg-[#040604]', border: 'border-[#1a2c1a]', text: 'text-[#86a686]', dot: '#86a686' }
};

export function InteractiveArchMap({ nodes, edges, tiers = {} }: InteractiveArchMapProps) {
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>(null);
  const [activeTierFilter, setActiveTierFilter] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const filteredNodes = activeTierFilter
    ? nodes.filter(n => n.tier === activeTierFilter)
    : nodes;

  const nodePositions = new Map<string, { x: number; y: number }>();
  // Arrange nodes in grid / layers
  const distinctTiers = Array.from(new Set(nodes.map(n => n.tier)));
  distinctTiers.forEach((tier, tierIdx) => {
    const tierNodes = nodes.filter(n => n.tier === tier);
    tierNodes.forEach((node, nodeIdx) => {
      const x = 100 + nodeIdx * 210;
      const y = 80 + tierIdx * 130;
      nodePositions.set(node.id, { x, y });
    });
  });

  // GSAP animated pulse for data flow along lines
  useEffect(() => {
    if (!svgRef.current) return;
    const lines = svgRef.current.querySelectorAll('.flow-line');

    lines.forEach((line) => {
      gsap.to(line, {
        strokeDashoffset: -40,
        duration: 2.2,
        repeat: -1,
        ease: 'none',
      });
    });
  }, [edges]);

  return (
    <div className="space-y-4">
      {/* Tier Filter Pills & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#040604] border border-[#1a2c1a] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTierFilter(null)}
            className={`px-3 py-1.5 rounded-lg font-mono font-medium transition-all ${
              activeTierFilter === null 
                ? 'bg-[#00ff66] text-black font-bold shadow-[0_0_12px_rgba(0,255,102,0.4)]' 
                : 'bg-[#000000] text-[#86a686] border border-[#1a2c1a] hover:text-white'
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs border transition-all ${
                  activeTierFilter === tierName
                    ? `${styling.bg} ${styling.border} ${styling.text} shadow-[0_0_10px_rgba(0,255,102,0.25)]`
                    : 'bg-[#000000] border-[#1a2c1a] text-[#86a686] hover:text-white hover:border-[#00ff66]/30'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: styling.dot, boxShadow: `0 0 6px ${styling.dot}` }} />
                <span>{tierName}</span>
                <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#86a686]">
          <Sparkles className="w-3.5 h-3.5 text-[#00ff66]" />
          <span>{edges.length} Active Data Edges</span>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative border border-[#1a2c1a] rounded-xl bg-[#000000] overflow-hidden min-h-[480px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.9)]">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,rgba(0,255,102,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,102,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />

        <svg ref={svgRef} className="w-full h-[460px] select-none relative z-10">
          <defs>
            <marker id="cyber-arrow" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#00ff66" opacity="0.8" />
            </marker>
            <filter id="green-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
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
                x1={sPos.x + 85}
                y1={sPos.y + 25}
                x2={tPos.x + 85}
                y2={tPos.y + 25}
                stroke={isHighlighted ? '#00ff66' : '#1a2c1a'}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                strokeDasharray="6 6"
                markerEnd="url(#cyber-arrow)"
                className="flow-line transition-all duration-300"
                filter={isHighlighted ? 'url(#green-glow)' : undefined}
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
                  width="170"
                  height="52"
                  rx="10"
                  fill="#040604"
                  stroke={isSelected ? '#00ff66' : '#1a2c1a'}
                  strokeWidth={isSelected ? 2 : 1}
                  className="group-hover:stroke-[#00ff66] transition-all duration-200"
                  style={{
                    filter: isSelected ? 'drop-shadow(0 0 12px rgba(0, 255, 102, 0.4))' : undefined
                  }}
                />
                {/* Status Dot */}
                <circle cx="16" cy="26" r="4" fill={styling.dot} style={{ filter: `drop-shadow(0 0 6px ${styling.dot})` }} />
                
                <text x="28" y="24" fill="#f0faf0" fontSize="11" fontWeight="700" fontFamily="monospace">
                  {node.label.length > 15 ? `${node.label.substring(0, 14)}…` : node.label}
                </text>
                <text x="28" y="40" fill="#86a686" fontSize="9" fontFamily="monospace">
                  {node.tier} • {node.loc} LOC
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute bottom-5 right-5 w-80 bg-[#040604]/95 backdrop-blur-md border border-[#00ff66]/50 rounded-xl p-4 shadow-[0_10px_35px_rgba(0,0,0,0.95)] animate-fadeIn">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#1a2c1a]">
              <span className="text-xs font-bold text-[#00ff66] font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_8px_#00ff66]" />
                {selectedNode.label}
              </span>
              <button onClick={() => setSelectedNode(null)} className="text-[#86a686] hover:text-[#00ff66] text-xs font-mono">
                ✕
              </button>
            </div>
            <div className="mt-3 space-y-2 text-xs font-mono text-[#86a686]">
              <p><span className="text-white">Path:</span> <code className="text-[#00ff66]">{selectedNode.path}</code></p>
              <p><span className="text-white">Tier:</span> {selectedNode.tier}</p>
              <p><span className="text-white">Lines of Code:</span> {selectedNode.loc} LOC</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
