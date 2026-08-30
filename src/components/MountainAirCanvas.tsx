'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  color: string;
  pulseSpeed: number;
}

export default function MountainAirCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let time = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - width / 2) * 0.08;
      mouseRef.current.targetY = (e.clientY - height / 2) * 0.08;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const colors = [
      'rgba(52, 211, 153, ',  // Mint emerald
      'rgba(16, 185, 129, ',  // Emerald green
      'rgba(96, 165, 250, ',  // Light blue
      'rgba(59, 130, 246, ',  // Steel blue
      'rgba(245, 158, 11, ',  // Amber gold
    ];

    // 120 airborne particles/spores
    const particles: Particle[] = Array.from({ length: 120 }, () => {
      const colorBase = colors[Math.floor(Math.random() * colors.length)];
      const maxAlpha = Math.random() * 0.6 + 0.25;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.random() * 0.6 + 0.15,
        vy: -Math.random() * 0.4 - 0.1,
        size: Math.random() * 3.5 + 1.2,
        alpha: Math.random() * maxAlpha,
        maxAlpha,
        color: colorBase,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      };
    });

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Draw rich ambient mountain mist clouds
      const mist1X = width * 0.3 + Math.sin(time * 0.5) * 80 + mouseRef.current.x;
      const mist1Y = height * 0.3 + Math.cos(time * 0.3) * 50 + mouseRef.current.y;
      const grad1 = ctx.createRadialGradient(mist1X, mist1Y, 40, mist1X, mist1Y, width * 0.5);
      grad1.addColorStop(0, 'rgba(16, 185, 129, 0.14)');
      grad1.addColorStop(0.5, 'rgba(2, 132, 199, 0.08)');
      grad1.addColorStop(1, 'rgba(6, 10, 21, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const mist2X = width * 0.75 - Math.cos(time * 0.4) * 60 - mouseRef.current.x;
      const mist2Y = height * 0.65 + Math.sin(time * 0.6) * 40 - mouseRef.current.y;
      const grad2 = ctx.createRadialGradient(mist2X, mist2Y, 50, mist2X, mist2Y, width * 0.55);
      grad2.addColorStop(0, 'rgba(59, 130, 246, 0.12)');
      grad2.addColorStop(0.6, 'rgba(52, 211, 153, 0.06)');
      grad2.addColorStop(1, 'rgba(6, 10, 21, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Draw glowing airborne spores & particles
      particles.forEach((p) => {
        p.x += p.vx + Math.sin(time + p.y * 0.01) * 0.3 + mouseRef.current.x * 0.01;
        p.y += p.vy + mouseRef.current.y * 0.01;

        p.alpha += p.pulseSpeed;
        if (p.alpha > p.maxAlpha || p.alpha < 0.1) {
          p.pulseSpeed = -p.pulseSpeed;
        }

        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0.05, p.alpha)})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `${p.color}0.9)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#060a15]">
      {/* Dynamic Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Topographic Contour Lines SVG Overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30 mix-blend-screen"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <path
          d="M-100,180 Q350,80 750,220 T1600,150"
          fill="none"
          stroke="#34d399"
          strokeWidth="1.5"
          strokeDasharray="6 8"
        />
        <path
          d="M-100,350 Q450,230 900,380 T1600,280"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="1.8"
          opacity="0.8"
        />
        <path
          d="M-100,520 Q300,430 800,580 T1600,460"
          fill="none"
          stroke="#34d399"
          strokeWidth="1.2"
          strokeDasharray="10 10"
        />
        <path
          d="M-100,700 Q550,580 1000,750 T1600,640"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.5"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
