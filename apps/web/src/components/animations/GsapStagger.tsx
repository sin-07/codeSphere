'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface GsapStaggerProps {
  children: React.ReactNode;
  stagger?: number;
  duration?: number;
  delay?: number;
  className?: string;
  yOffset?: number;
}

export function GsapStagger({
  children,
  stagger = 0.08,
  duration = 0.6,
  delay = 0.1,
  className = '',
  yOffset = 25,
}: GsapStaggerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const targets = containerRef.current.children;
    if (!targets || targets.length === 0) return;

    gsap.fromTo(
      targets,
      {
        opacity: 0,
        y: yOffset,
        scale: 0.98,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration,
        stagger,
        delay,
        ease: 'power3.out',
      }
    );
  }, [stagger, duration, delay, yOffset]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
