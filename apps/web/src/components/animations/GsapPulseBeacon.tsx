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
  size = 10,
  color = '#00ff66',
  className = '',
  label,
}: GsapPulseBeaconProps) {
  const ring1Ref = useRef<HTMLSpanElement | null>(null);
  const ring2Ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!ring1Ref.current || !ring2Ref.current) return;

    const tl = gsap.timeline({ repeat: -1 });

    tl.fromTo(
      ring1Ref.current,
      { scale: 1, opacity: 0.8 },
      { scale: 2.8, opacity: 0, duration: 1.8, ease: 'power1.out' },
      0
    );

    tl.fromTo(
      ring2Ref.current,
      { scale: 1, opacity: 0.6 },
      { scale: 2.2, opacity: 0, duration: 1.8, ease: 'power1.out' },
      0.4
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <span
          ref={ring1Ref}
          className="absolute rounded-full pointer-events-none"
          style={{ width: size, height: size, border: `1px solid ${color}` }}
        />
        <span
          ref={ring2Ref}
          className="absolute rounded-full pointer-events-none"
          style={{ width: size, height: size, border: `1px solid ${color}` }}
        />
        <span
          className="relative rounded-full"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      </span>
      {label && <span className="text-xs font-mono text-[#c2d6c2]">{label}</span>}
    </span>
  );
}
