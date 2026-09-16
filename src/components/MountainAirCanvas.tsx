'use client';

import { useEffect, useRef } from 'react';

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
      mouseRef.current.targetX = (e.clientX - width / 2) * 0.05;
      mouseRef.current.targetY = (e.clientY - height / 2) * 0.05;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      time += 0.005;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse movement
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.03;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.03;

      // Subtle ambient mountain mist flow inspired by Nevado del Ruiz
      const mist1X = width * 0.35 + Math.sin(time * 0.4) * 60 + mouseRef.current.x;
      const mist1Y = height * 0.3 + Math.cos(time * 0.2) * 40 + mouseRef.current.y;
      const grad1 = ctx.createRadialGradient(mist1X, mist1Y, 50, mist1X, mist1Y, width * 0.6);
      grad1.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
      grad1.addColorStop(0.5, 'rgba(2, 132, 199, 0.04)');
      grad1.addColorStop(1, 'rgba(6, 10, 21, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const mist2X = width * 0.7 - Math.cos(time * 0.3) * 50 - mouseRef.current.x;
      const mist2Y = height * 0.6 + Math.sin(time * 0.3) * 30 - mouseRef.current.y;
      const grad2 = ctx.createRadialGradient(mist2X, mist2Y, 60, mist2X, mist2Y, width * 0.65);
      grad2.addColorStop(0, 'rgba(59, 130, 246, 0.07)');
      grad2.addColorStop(0.6, 'rgba(52, 211, 153, 0.03)');
      grad2.addColorStop(1, 'rgba(6, 10, 21, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

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
      {/* Dynamic Canvas Ambient Glow */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Nevado del Ruiz Topographic Contour Lines Overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-25 mix-blend-screen transition-opacity duration-1000"
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
          opacity="0.7"
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
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
