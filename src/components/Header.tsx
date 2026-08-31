'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Lotes y Polígonos', href: '/#mapa', anchor: '#mapa' },
  { label: 'Auditoría Blockchain', href: '/#blockchain', anchor: '#blockchain' },
  { label: 'Inventario Técnico', href: '/inventario-tecnico' },
  { label: 'Biodiversidad', href: '/nuestra-fauna-y-flora' },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);

  const resolveHref = (link: typeof NAV_LINKS[0]) => {
    if (!link.anchor) return link.href;
    return isHome ? link.anchor : link.href;
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('#')[0]) && href.split('#')[0] !== '/';
  };

  return (
    <header className="relative z-50 border-b border-white/10 bg-transparent backdrop-blur-md sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 sm:h-28 flex items-center justify-between gap-6">

        {/* Left — Institutional Brand & 4X Allies Logos */}
        <div className="flex items-center gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-4">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/15 p-1.5 flex items-center justify-center shadow-lg">
              <Image
                src="/logos/masprogreso.png"
                alt="Más Progreso — Empresa de Desarrollo Territorial"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-black font-mono tracking-wider text-white">
                MASPROGRESO
              </span>
              <span className="text-[10px] sm:text-xs text-slate-300 font-mono tracking-tight leading-tight">
                Empresa de desarrollo Territorial
              </span>
            </div>
          </Link>

          {/* Allies Badge Group — 4X Scaled Logos */}
          <div className="hidden lg:flex items-center gap-4 pl-6 border-l border-white/15" title="Entidades aliadas del proyecto">
            <div className="bg-white/5 border border-white/15 rounded-2xl px-4 py-2 flex items-center gap-5 backdrop-blur-md shadow-lg">
              <Image
                src="/logos/corpocaldas.png"
                alt="Corpocaldas — Corporación Autónoma Regional de Caldas"
                width={56}
                height={56}
                className="object-contain h-12 sm:h-14 w-auto"
              />
              <div className="h-10 w-px bg-white/15" />
              <Image
                src="/logos/dnp-sgr.png"
                alt="Departamento Nacional de Planeación · SGR"
                width={200}
                height={56}
                className="object-contain h-12 sm:h-14 w-auto"
              />
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-slate-200 shrink-0 font-sans">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={resolveHref(link)}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap ${isActive(link.href) ? 'text-emerald-400 font-bold' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/data/INFORME%20FINAL%20GEOREFERENCIACION.pdf"
            download
            className="bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 px-4 py-2 rounded-xl text-xs font-mono font-bold text-emerald-300 transition-all flex items-center gap-2 whitespace-nowrap shadow-md"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Informe PDF</span>
          </a>
        </nav>

        {/* Mobile — Hamburger Button */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-11 h-11 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all shrink-0 gap-1.5 p-2.5"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
        >
          <span
            className={`block w-full h-0.5 bg-slate-300 rounded-full transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
          />
          <span
            className={`block w-full h-0.5 bg-slate-300 rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`}
          />
          <span
            className={`block w-full h-0.5 bg-slate-300 rounded-full transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
          />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-white/10 bg-[#0c1222]/98 backdrop-blur-md ${menuOpen ? 'max-h-screen pb-6' : 'max-h-0'}`}
      >
        <nav className="flex flex-col px-4 pt-4 gap-2">
          {/* Mobile 4X Allies Row */}
          <div className="flex flex-col gap-2 p-3 bg-white/5 border border-white/15 rounded-2xl">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Entidades Aliadas del Proyecto</span>
            <div className="flex items-center justify-around gap-4 pt-1">
              <Image
                src="/logos/corpocaldas.png"
                alt="Corpocaldas"
                width={48}
                height={48}
                className="object-contain h-10 w-auto"
              />
              <Image
                src="/logos/dnp-sgr.png"
                alt="DNP SGR"
                width={140}
                height={40}
                className="object-contain h-10 w-auto"
              />
            </div>
          </div>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={resolveHref(link)}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${isActive(link.href) ? 'text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/20' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
            >
              <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              {link.label}
            </Link>
          ))}

          <div className="mt-2 pt-3 border-t border-white/10">
            <a
              href="/data/INFORME%20FINAL%20GEOREFERENCIACION.pdf"
              download
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm text-emerald-300 bg-emerald-950/30 border border-emerald-500/30 hover:bg-emerald-950/50 transition-all font-mono font-bold"
            >
              <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Descargar Informe PDF
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
