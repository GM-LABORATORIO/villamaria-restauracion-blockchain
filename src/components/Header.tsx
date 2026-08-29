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
    <header className="relative z-50 border-b border-white/5 bg-[#00050d]/95 backdrop-blur-md sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">

        {/* Left — Institutional Logos */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/isotype.png"
            alt="Isotipo Ecosistema Blockchain"
            width={34}
            height={34}
            className="object-contain drop-shadow-md rounded-lg border border-emerald-500/20"
          />
          <Image
            src="/escudo-municipio.png"
            alt="Escudo Municipio de Villamaría"
            width={32}
            height={32}
            className="object-contain drop-shadow-md"
          />
          <div className="h-7 w-px bg-white/10 hidden sm:block" />
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-slate-300 uppercase hidden sm:block">
            Más Progreso E.S.P.
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5 text-sm text-slate-300 shrink-0">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={resolveHref(link)}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap ${isActive(link.href) ? 'text-emerald-400 font-semibold' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/data/INFORME%20FINAL%20GEOREFERENCIACION.pdf"
            download
            className="bg-[#070f21] hover:bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Informe PDF</span>
          </a>
        </nav>

        {/* Mobile — Hamburger Button */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all shrink-0 gap-1.5 p-2"
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
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-white/5 bg-[#00050d]/98 ${menuOpen ? 'max-h-screen pb-4' : 'max-h-0'}`}
      >
        <nav className="flex flex-col px-4 pt-3 gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={resolveHref(link)}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${isActive(link.href) ? 'text-emerald-400 font-semibold bg-emerald-950/30 border border-emerald-500/20' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
            >
              {/* Arrow indicator */}
              <svg className="w-3.5 h-3.5 text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              {link.label}
            </Link>
          ))}

          <div className="mt-2 pt-3 border-t border-white/5">
            <a
              href="/data/INFORME%20FINAL%20GEOREFERENCIACION.pdf"
              download
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Descargar Informe de Georreferenciación (PDF)
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
