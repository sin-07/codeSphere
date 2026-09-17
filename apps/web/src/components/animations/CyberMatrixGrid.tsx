'use client';

import React from 'react';

export function CyberMatrixGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Ambient Top Emerald Gradient Beam */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[420px] pointer-events-none rounded-full blur-3xl opacity-35"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(5, 150, 105, 0.12) 45%, transparent 75%)',
        }}
      />

      {/* Subtle Precision Dot Matrix Grid */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 10%, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 10%, black 40%, transparent 80%)',
        }}
      />
    </div>
  );
}
