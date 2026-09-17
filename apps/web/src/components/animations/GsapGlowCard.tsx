'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';

interface GsapGlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function GsapGlowCard({
  children,
  className = '',
  glowColor = 'rgba(0, 255, 102, 0.15)',
  ...props
}: GsapGlowCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Move spotlight smoothly
    gsap.to(glowRef.current, {
      x,
      y,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    });

    // Subtle 3D card tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: 'power1.out',
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !glowRef.current) return;

    gsap.to(glowRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
    });

    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-xl border border-[#1a2c1a] bg-[#040604]/90 backdrop-blur-md transition-all duration-300 hover:border-[#00ff66]/50 hover:shadow-[0_0_30px_rgba(0,255,102,0.2)] ${className}`}
      {...props}
    >
      {/* Mouse-following spotlight */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full opacity-0 blur-2xl transition-opacity"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        }}
      />
      {/* Card contents */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
