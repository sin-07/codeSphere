'use client';

import React from 'react';

export function CyberMatrixGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Linear Precision Dot Grid */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 10%, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 10%, black 40%, transparent 80%)',
        }}
      />

      {/* Top Ambient Emerald Glow Beam */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[450px] pointer-events-none rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(5, 150, 105, 0.15) 50%, transparent 75%)',
        }}
      />

      {/* Secondary Soft Depth Flare */}
      <div 
        className="absolute top-1/3 -left-48 w-[600px] h-[600px] pointer-events-none rounded-full blur-[120px] opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
