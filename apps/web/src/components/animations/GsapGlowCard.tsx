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
  glowColor = 'rgba(16, 185, 129, 0.12)',
  ...props
}: GsapGlowCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.to(glowRef.current, {
      x,
      y,
      opacity: 1,
      duration: 0.25,
      ease: 'power2.out',
    });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -2.5;
    const rotateY = ((x - centerX) / centerX) * 2.5;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.35,
      ease: 'power1.out',
      transformPerspective: 1200,
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !glowRef.current) return;

    gsap.to(glowRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    });

    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-xl border border-emerald-500/15 bg-[#080d0a]/80 backdrop-blur-xl transition-all duration-200 hover:border-emerald-500/35 hover:shadow-[0_8px_30px_-6px_rgba(16,185,129,0.12)] ${className}`}
      {...props}
    >
      {/* Subtle mouse spotlight */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full opacity-0 blur-3xl transition-opacity"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
