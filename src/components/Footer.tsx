'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#020617] py-12 text-slate-500 text-xs md:text-sm relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          
          {/* Column 1: Institutional Logos */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-600 block">
              Entidades del Proyecto
            </span>
            <div className="bg-[#0b1329]/80 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-3 shadow-lg">
              <Image
                src="/logos/masprogreso.png"
                alt="Más Progreso E.S.P. — Empresa de Desarrollo Territorial"
                width={56}
                height={56}
                className="object-contain h-12 w-auto opacity-95 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/logos/corpocaldas.png"
                alt="Corpocaldas — Corporación Autónoma Regional de Caldas"
                width={56}
                height={56}
                className="object-contain h-12 w-auto opacity-95 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/logos/dnp-sgr.png"
                alt="Sistema General de Regalías — DNP"
                width={64}
                height={48}
                className="object-contain h-12 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
            <p className="text-[10px] text-slate-600 leading-normal pt-0.5">
              Convenio interadministrativo para la restauración forestal de áreas de interés hídrico.
            </p>
          </div>

          {/* Column 2: Video del Proyecto (Shorts Fix Error 153) */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-600 block">
              Video del Proyecto · Campo
            </span>
            <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black border border-white/10 shadow-lg group">
              <iframe
                src="https://www.youtube-nocookie.com/embed/kFU8ZiVCVE4?rel=0&modestbranding=1"
                title="Video del Proyecto - Restauración Ecológica Quebrada Chupaderos"
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <div className="flex justify-between items-center text-[9.5px] font-mono text-slate-500 pt-0.5">
              <span>Registro audiovisual Qda. Chupaderos</span>
              <a
                href="https://youtube.com/shorts/kFU8ZiVCVE4?feature=share"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-bold underline transition-colors"
              >
                YouTube ↗
              </a>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-600 block">
              Enlaces y Documentación
            </span>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <span className="text-slate-500 font-semibold font-mono">Contrato:</span> SGR-SC-001-2025
              </li>
              <li>
                <a
                  href="/data/INFORME%20FINAL%20GEOREFERENCIACION.pdf"
                  download
                  className="hover:text-emerald-400 transition-colors inline-block"
                >
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Informe Georreferenciación (PDF)
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="/data/Copia%20de%20Areas_lotes.pdf"
                  download
                  className="hover:text-emerald-400 transition-colors inline-block"
                >
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Informe Áreas de Lotes (PDF)
                  </span>
                </a>
              </li>
              <li>
                <Link href="/inventario-tecnico" className="hover:text-emerald-400 transition-colors inline-block">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Inventario Técnico Completo
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Tech and Verification Badge */}
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-600 block">
              Trazabilidad &amp; Blockchain
            </span>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <span>Tecnología por:</span>
                <span className="text-white font-semibold font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10 inline-flex items-center gap-1">
                  GM Holding
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-950/40 border border-red-500/20 text-red-400 rounded-lg text-[10px] font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  AVALANCHE MAINNET
                </div>
                <a
                  href="https://snowtrace.io/address/0x7e34e2e66838D0DA8e88cBC4200020a6bD9925F4#code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/40 border border-emerald-500/25 hover:border-emerald-500/60 text-emerald-400 rounded-lg text-[10px] font-mono font-semibold transition-colors"
                  title="Ver contrato verificado en Snowtrace"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  SNOWTRACE ↗
                </a>
              </div>
              <p className="text-[10px] text-slate-600 font-mono">
                Última actualización: Junio 2026
              </p>
            </div>
          </div>

        </div>

        <div className="border-t border-white/5 mt-10 pt-6 text-center text-[10px] text-slate-700">
          <p>© 2026 Proyecto SGR-SC-001-2025. Todos los derechos reservados. Notarización descentralizada e inmutable.</p>
        </div>
      </div>
    </footer>
  );
}
