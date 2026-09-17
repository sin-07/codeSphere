'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Network, Layers, Sparkles } from 'lucide-react';
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
  'UI / Frontend': { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-300', dot: '#34d399' },
  'API & Gateway': { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: '#10b981' },
  'Service Layer': { bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-300', dot: '#2dd4bf' },
  'Database & Storage': { bg: 'bg-emerald-600/10', border: 'border-emerald-600/30', text: 'text-emerald-400', dot: '#059669' },
  'Shared Utilities': { bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', text: 'text-emerald-200', dot: '#6ee7b7' },
  'Core Module': { bg: 'bg-[#0c120e]', border: 'border-emerald-500/15', text: 'text-[#91a897]', dot: '#91a897' }
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
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#080d0a]/90 border border-emerald-500/15 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTierFilter(null)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTierFilter === null 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-[#0c120e] text-[#91a897] border border-emerald-500/15 hover:text-white'
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
                    ? `${styling.bg} ${styling.border} ${styling.text} shadow-sm`
                    : 'bg-[#0c120e] border-emerald-500/15 text-[#91a897] hover:text-white hover:border-emerald-500/30'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: styling.dot }} />
                <span>{tierName}</span>
                <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#91a897]">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{edges.length} Active Data Edges</span>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative border border-emerald-500/15 rounded-xl bg-[#080d0a]/90 overflow-hidden min-h-[480px] p-6 shadow-md backdrop-blur-xl">
        {/* Background Dot Grid */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{
            backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.2) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <svg ref={svgRef} className="w-full h-[460px] select-none relative z-10">
          <defs>
            <marker id="emerald-arrow" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" opacity="0.8" />
            </marker>
            <filter id="emerald-glow" x="-20%" y="-20%" width="140%" height="140%">
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
                stroke={isHighlighted ? '#10b981' : 'rgba(16, 185, 129, 0.15)'}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                strokeDasharray="6 6"
                markerEnd="url(#emerald-arrow)"
                className="flow-line transition-all duration-300"
                filter={isHighlighted ? 'url(#emerald-glow)' : undefined}
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
                  fill="#0c120e"
                  stroke={isSelected ? '#10b981' : 'rgba(16, 185, 129, 0.18)'}
                  strokeWidth={isSelected ? 2 : 1}
                  className="group-hover:stroke-emerald-400 transition-all duration-200"
                  style={{
                    filter: isSelected ? 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.35))' : undefined
                  }}
                />
                {/* Status Dot */}
                <circle cx="16" cy="26" r="4" fill={styling.dot} />
                
                <text x="28" y="24" fill="#ffffff" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                  {node.label.length > 15 ? `${node.label.substring(0, 14)}…` : node.label}
                </text>
                <text x="28" y="40" fill="#91a897" fontSize="9" fontFamily="monospace">
                  {node.tier} • {node.loc} LOC
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute bottom-5 right-5 w-80 bg-[#080d0a]/95 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-2.5 border-b border-emerald-500/15">
              <span className="text-xs font-semibold text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {selectedNode.label}
              </span>
              <button onClick={() => setSelectedNode(null)} className="text-[#91a897] hover:text-white text-xs font-mono">
                ✕
              </button>
            </div>
            <div className="mt-3 space-y-2 text-xs font-mono text-[#91a897]">
              <p><span className="text-white">Path:</span> <code className="text-emerald-300">{selectedNode.path}</code></p>
              <p><span className="text-white">Tier:</span> {selectedNode.tier}</p>
              <p><span className="text-white">Lines of Code:</span> {selectedNode.loc} LOC</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
