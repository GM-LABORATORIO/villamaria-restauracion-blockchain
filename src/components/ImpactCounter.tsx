'use client';

import React, { useEffect, useState } from 'react';

interface BreakdownItem {
  label: string;
  target: number;
  subLabel?: string;
  colorClass?: string;
}

interface ImpactCounterProps {
  target: number;
  duration?: number; // duration in ms
  label?: string;
  subLabel?: string;
  icon?: React.ReactNode;
  breakdown?: BreakdownItem[];
}

export default function ImpactCounter({
  target,
  duration = 1500,
  label,
  subLabel,
  icon,
  breakdown,
}: ImpactCounterProps) {
  const [count, setCount] = useState(0);
  const [breakdownCounts, setBreakdownCounts] = useState<number[]>([]);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      setCount(Math.floor(progress * target));
      
      if (breakdown) {
        setBreakdownCounts(
          breakdown.map((item) => Math.floor(progress * item.target))
        );
      }
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration, breakdown]);

  // Format count to standard notation (e.g. 10.900 for Colombia locale)
  const formattedCount = count.toLocaleString('es-CO');

  const hasBreakdown = breakdown && breakdown.length > 0;

  return (
    <div className={`glass-card p-6 rounded-2xl border border-white/5 transition-all duration-300 hover:border-emerald-500/20 flex flex-col justify-between ${
      hasBreakdown ? 'h-full' : 'h-full sm:flex-row sm:items-center'
    }`}>
      <div className="space-y-4 w-full">
        {/* Header (Label and Icon) */}
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-xs font-mono text-emerald-400 font-semibold tracking-widest uppercase block">
              {label}
            </span>
          )}
          {icon && (
            <div className="bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/10 shadow-inner flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>

        {/* Main Number */}
        <div>
          <p className="text-4xl font-extrabold text-white tracking-tight">{formattedCount}</p>
          {subLabel && <p className="text-xs text-slate-400 font-sans mt-0.5">{subLabel}</p>}
        </div>

        {/* Breakdown Sub-counters */}
        {hasBreakdown && (
          <div className="grid grid-cols-2 gap-4 pt-3.5 border-t border-white/5">
            {breakdown.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <span className={`text-[10px] font-mono font-bold block uppercase tracking-wider ${item.colorClass || 'text-slate-400'}`}>
                  {item.label}
                </span>
                <p className="text-lg font-bold text-white">
                  {(breakdownCounts[idx] || 0).toLocaleString('es-CO')}
                </p>
                {item.subLabel && <p className="text-[10px] text-slate-500">{item.subLabel}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
