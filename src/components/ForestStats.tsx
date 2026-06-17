'use client';

import React, { useState } from 'react';

const BAR_DATA = [
  { name: 'Roble (Quercus humboldtii)', count: 120, pct: 100, color: 'bg-blue-600' },
  { name: 'Cedro (Cedrela montana)', count: 61, pct: 51, color: 'bg-blue-500' },
  { name: 'Pino Colombiano (Retrophyllum r.)', count: 53, pct: 44, color: 'bg-sky-500' },
  { name: 'Cucharo (Myrsine guianensis)', count: 46, pct: 38, color: 'bg-emerald-600' },
  { name: 'Nigüito (Miconia theaezans)', count: 32, pct: 27, color: 'bg-emerald-500 font-semibold' },
  { name: 'Amargoso (Aegiphila grandis)', count: 32, pct: 27, color: 'bg-teal-500' },
  { name: 'Encenillo (Weinmannia tomentosa)', count: 31, pct: 26, color: 'bg-emerald-400' },
  { name: 'Olivo (Olea europaea / nativa)', count: 20, pct: 17, color: 'bg-sky-600' },
];

export default function ForestStats() {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  // Donut chart parameters
  // Total sample: 10,900 trees.
  // Nobles: 5,668 (52%), Arbustos/Polinizadores: 5,232 (48%)
  const slices = [
    { label: 'Árboles Nobles', count: 5668, percentage: 52, color: '#3b82f6', hoverColor: '#60a5fa', description: 'Especies maderables de gran altura, almacenamiento masivo de carbono y regulación del ciclo forestal superior (Roble, Cedro, Pinos).' },
    { label: 'Arbustos / Polinizadores', count: 5232, percentage: 48, color: '#10b981', hoverColor: '#34d399', description: 'Especies pioneras, arbustos de borde y productores de frutos que sustentan la fauna local y la polinización activa (Nigüito, Mano de Oso, Cucharo, Siete Cueros).' }
  ];

  // SVG calculations for 2 segments (52% and 48%)
  // Circumference = 2 * PI * R. If R = 50, Circumference = 314.16
  const radius = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  
  // Nobles segment: 52% of 314.16 = 163.36. Stroke-dashoffset = 0
  const noblesStroke = (slices[0].percentage / 100) * circumference;
  
  // Pollinators segment: 48% of 314.16 = 150.80. Stroke-dashoffset = -163.36
  const pollinatorsStroke = (slices[1].percentage / 100) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Donut Chart (SVG) */}
      <div className="lg:col-span-5 bg-[#0b1329]/70 border border-white/5 p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white">Estructura del Ecosistema</h3>
          <p className="text-xs text-slate-400 mt-1">
            Distribución ecológica estimada en base al inventario total (10,900 individuos)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
          {/* Donut SVG */}
          <div className="relative w-44 h-44 flex-shrink-0">
            <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth={strokeWidth}
              />
              {/* Nobles slice (Blue) */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke={slices[0].color}
                strokeWidth={hoveredSlice === 0 ? strokeWidth + 2 : strokeWidth}
                strokeDasharray={`${noblesStroke} ${circumference}`}
                strokeDashoffset="0"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredSlice(0)}
                onMouseLeave={() => setHoveredSlice(null)}
              />
              {/* Pollinators slice (Green) */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke={slices[1].color}
                strokeWidth={hoveredSlice === 1 ? strokeWidth + 2 : strokeWidth}
                strokeDasharray={`${pollinatorsStroke} ${circumference}`}
                strokeDashoffset={-noblesStroke}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredSlice(1)}
                onMouseLeave={() => setHoveredSlice(null)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-extrabold text-white">10.9k</span>
              <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">Árboles</span>
            </div>
          </div>

          {/* Legends */}
          <div className="space-y-4 flex-1 w-full">
            {slices.map((slice, idx) => (
              <div
                key={slice.label}
                onMouseEnter={() => setHoveredSlice(idx)}
                onMouseLeave={() => setHoveredSlice(null)}
                className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                  hoveredSlice === idx
                    ? 'bg-white/5 border-white/10 shadow-md'
                    : 'bg-transparent border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="text-xs font-semibold text-slate-200">{slice.label}</span>
                  <span className="text-xs font-bold text-white ml-auto">
                    {slice.percentage}%
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5 pl-5">
                  {slice.count.toLocaleString('es-CO')} individuos
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed description panel depending on hover */}
        <div className="h-20 bg-white/2 rounded-xl p-3 border border-white/5 flex items-center">
          <p className="text-xs text-slate-400 leading-relaxed">
            {hoveredSlice !== null
              ? slices[hoveredSlice].description
              : 'Pasa el cursor sobre los segmentos del gráfico para ver detalles sobre su función ecológica en la cuenca.'}
          </p>
        </div>
      </div>

      {/* Horizontal Bar Chart (Tailwind HTML) */}
      <div className="lg:col-span-7 bg-[#0b1329]/70 border border-white/5 p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white">Muestreo Técnico de Especies</h3>
          <p className="text-xs text-slate-400 mt-1">
            Distribución del censo de muestreo representativo (656 individuos identificados con precisión)
          </p>
        </div>

        <div className="space-y-3">
          {BAR_DATA.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{item.name}</span>
                <span className="font-mono text-slate-400 font-bold">
                  {item.count} <span className="text-[10px] text-slate-600 font-normal">muestras</span>
                </span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${item.color}`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-[11px] text-slate-500 leading-normal flex items-center justify-between border-t border-white/5 pt-3">
          <span>Fuente: Muestreo de Árboles SGR-SC-001-2025</span>
          <a href="/inventario-tecnico" className="text-emerald-400 hover:underline">
            Ver Inventario Completo →
          </a>
        </div>
      </div>
    </div>
  );
}
