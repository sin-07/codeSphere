'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface GsapCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function GsapCounter({
  value,
  duration = 1.8,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}: GsapCounterProps) {
  const countRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!countRef.current) return;

    const counterObj = { val: 0 };
    gsap.to(counterObj, {
      val: value,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.textContent = `${prefix}${counterObj.val.toFixed(decimals)}${suffix}`;
        }
      },
    });
  }, [value, duration, prefix, suffix, decimals]);

  return (
    <span ref={countRef} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
