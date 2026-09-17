'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface GsapPulseBeaconProps {
  size?: number;
  color?: string;
  className?: string;
  label?: string;
}

export function GsapPulseBeacon({
  size = 8,
  color = '#10b981',
  className = '',
  label,
}: GsapPulseBeaconProps) {
  const ringRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!ringRef.current) return;

    const tween = gsap.fromTo(
      ringRef.current,
      { scale: 1, opacity: 0.75 },
      { scale: 2.4, opacity: 0, duration: 2, repeat: -1, ease: 'power1.out' }
    );

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <span
          ref={ringRef}
          className="absolute rounded-full pointer-events-none"
          style={{ width: size, height: size, border: `1.5px solid ${color}` }}
        />
        <span
          className="relative rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
          }}
        />
      </span>
      {label && <span className="text-xs font-mono text-[#91a897] font-medium">{label}</span>}
    </span>
  );
}
