'use client';

import React, { useEffect, useState } from 'react';

interface ImpactCounterProps {
  target: number;
  duration?: number; // duration in ms
  label?: string;
  subLabel?: string;
  icon?: React.ReactNode;
}

export default function ImpactCounter({
  target,
  duration = 1500,
  label,
  subLabel,
  icon,
}: ImpactCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  // Format count to standard notation (e.g. 10.900 for Colombia locale)
  const formattedCount = count.toLocaleString('es-CO');

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center justify-between hover:border-emerald-500/20 transition-all duration-300">
      <div className="space-y-1">
        {label && (
          <span className="text-xs font-mono text-emerald-400 font-semibold tracking-widest uppercase block">
            {label}
          </span>
        )}
        <p className="text-4xl font-extrabold text-white tracking-tight">{formattedCount}</p>
        {subLabel && <p className="text-xs text-slate-400 font-sans">{subLabel}</p>}
      </div>
      {icon && (
        <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/10 shadow-inner flex items-center justify-center">
          {icon}
        </div>
      )}
    </div>
  );
}
