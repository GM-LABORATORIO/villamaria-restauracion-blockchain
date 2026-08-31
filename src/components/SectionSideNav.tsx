'use client';

import { useEffect, useState } from 'react';

interface NavItem {
  id: string;
  number: string;
  label: string;
  subLabel: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'inicio', number: '01', label: 'Cumanday & Inicio', subLabel: 'Fábrica del agua y cuenca' },
  { id: 'impacto', number: '02', label: 'Bosque en Números', subLabel: '10.900 árboles y 21.8 Ha' },
  { id: 'mapa', number: '03', label: 'Geovisor Operativo', subLabel: 'Polígonos y lotes reales' },
  { id: 'estadisticas', number: '04', label: 'Métricas de Captura', subLabel: 'Modelo IPCC Tier 1-2' },
  { id: 'biodiversidad', number: '05', label: 'Especies Nativas', subLabel: 'UICN & valor ecológico' },
  { id: 'blockchain', number: '06', label: 'Auditoría Avalanche', subLabel: 'Trazabilidad e inmutabilidad' },
];

export default function SectionSideNav() {
  const [activeId, setActiveId] = useState<string>('inicio');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0px -40% 0px',
        threshold: 0.1,
      }
    );

    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="fixed left-5 top-1/2 -translate-y-1/2 z-[40] hidden md:flex flex-col items-start gap-3.5 group pointer-events-auto"
      aria-label="Navegación modular por secciones"
    >
      {/* Decorative vertical line */}
      <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-white/10 -z-10 rounded-full" />

      {NAV_ITEMS.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="group/item relative flex items-center justify-start gap-3 cursor-pointer py-1 focus:outline-none"
          >
            {/* Indicator Dot / Pill */}
            <div
              className={`relative flex items-center justify-center transition-all duration-300 rounded-full ${
                isActive
                  ? 'w-6 h-6 bg-emerald-500/20 border-2 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)]'
                  : 'w-5 h-5 bg-[#020617] border border-white/20 hover:border-emerald-400/60'
              }`}
            >
              <div
                className={`rounded-full transition-all duration-300 ${
                  isActive ? 'w-2.5 h-2.5 bg-emerald-400 animate-pulse' : 'w-1.5 h-1.5 bg-slate-400 group-hover/item:bg-emerald-300'
                }`}
              />
            </div>

            {/* Hover Tooltip Card (Expands to Right) */}
            <div className="absolute left-8 opacity-0 -translate-x-3 pointer-events-none group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200 bg-[#0c1222]/95 backdrop-blur-md border border-emerald-500/30 px-3 py-1.5 rounded-xl shadow-2xl flex flex-col text-left min-w-[170px]">
              <div className="flex items-center justify-start gap-1.5">
                <span className="text-[10px] font-mono font-bold text-emerald-400">{item.number}</span>
                <span className="text-xs font-bold text-white font-sans">{item.label}</span>
              </div>
              <span className="text-[9.5px] text-slate-400 font-mono">{item.subLabel}</span>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
