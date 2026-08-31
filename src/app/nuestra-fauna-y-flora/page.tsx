'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpeciesExplorer from '@/components/SpeciesExplorer';
import SectionSideNav from '@/components/SectionSideNav';

export default function NuestraFaunaYFlora() {
  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col relative selection:bg-emerald-500 selection:text-white">
      <Header />
      <SectionSideNav />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12 relative z-10">
        
        {/* Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-gradient-to-b from-emerald-950/20 via-blue-950/10 to-transparent pointer-events-none blur-3xl z-0" />

        {/* Section 1: Hero Narrative */}
        <div className="space-y-4 text-center max-w-3xl mx-auto relative z-10 pt-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold rounded-full uppercase tracking-wider backdrop-blur-md shadow-lg shadow-emerald-950/40">
            Mosaico de Biodiversidad &amp; Conservación Altoandina
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent font-heading">
            Más que árboles, un ecosistema vivo
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
            La restauración ecológica de la cuenca Quebrada Chupaderos es un esfuerzo integral para reconstruir la red de vida del bosque de niebla y páramo en Villamaría, Caldas.
          </p>
        </div>

        {/* Section 2: Species Explorer Component with Adult Specimen Photos */}
        <section id="biodiversidad" className="relative z-10 space-y-6 pt-4">
          <div className="border-l-4 border-emerald-500 pl-4">
            <h2 className="text-2xl font-bold text-white font-heading">Catálogo Botánico &amp; Fichas de Impacto Ecológico</h2>
            <p className="text-slate-400 text-sm mt-1">
              Explora las especies clave seleccionadas, sus fotografías en hábitat nativo de montaña y su función biológica en la seguridad hídrica.
            </p>
          </div>

          <SpeciesExplorer />
        </section>

        {/* Section 3: Technical Principles */}
        <div className="bg-[#0c1222]/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl space-y-4 relative z-10 shadow-2xl">
          <h3 className="text-xl font-bold text-white font-heading">Principios del Protocolo Forestal SGR-SC-001-2025</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Cada individuo registrado en nuestro inventario inmutable está clasificado y georreferenciado para asegurar el éxito del programa de mantenimiento a largo plazo:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-slate-300 pt-2">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Altura &amp; Diámetro del Tallo (DAP) monitoreados periódicamente.
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Ubicación submétrca del 100% de individuos en WGS84 (MAGNA-SIRGAS).
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Verificación fitosanitaria clasificada (Bueno, Regular, Malo).
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Trazabilidad criptográfica SHA-256 e inmutabilidad en Avalanche.
            </li>
          </ul>
        </div>

      </main>

      <Footer />
    </div>
  );
}
