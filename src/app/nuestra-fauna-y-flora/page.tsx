'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NuestraFaunaYFlora() {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 space-y-12 relative z-10">
        
        {/* Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[250px] bg-gradient-to-b from-brand-accent-bg to-transparent pointer-events-none blur-3xl z-0" />

        {/* Section 1: Hero Narrative */}
        <div className="space-y-4 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold rounded-full uppercase tracking-wider">
            Valor Ecológico &amp; Conservación
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-green-light bg-clip-text text-transparent">
            Más que árboles, un ecosistema vivo
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            La restauración de la cuenca Quebrada Chupaderos es un esfuerzo integral que va más allá de la siembra forestal. Se trata de reconstruir la red de vida altoandina.
          </p>
        </div>

        {/* Section 2: Narrative Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          
          <div className="bg-[#0b1329]/70 border border-white/5 p-6 rounded-2xl space-y-3 hover:border-emerald-500/20 transition-all duration-300">
            <div className="bg-emerald-950/20 p-2 rounded-lg border border-emerald-500/10 w-fit">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V10M18 10a6 6 0 00-12 0M12 4v6M12 14l-4-4m4 4l4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">El Retorno del Pino Colombiano</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              El <strong>Pino Colombiano</strong> (<em>Retrophyllum rospigliosii</em>) es la única conífera nativa de nuestro país y se encuentra amenazado de extinción. En este proyecto se le ha dado prioridad de siembra para actuar como un ancla biológica: su copa capta la humedad de la neblina andina constante, escurriéndola al suelo para alimentar el acuífero de Villamaría.
            </p>
          </div>

          <div className="bg-[#0b1329]/70 border border-white/5 p-6 rounded-2xl space-y-3 hover:border-emerald-500/20 transition-all duration-300">
            <div className="bg-emerald-950/20 p-2 rounded-lg border border-emerald-500/10 w-fit">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V10m0 0a4 4 0 014-4h2m-6 4a4 4 0 00-4-4H6m6 14a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">El Banquete de la Fauna Silvestre</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Especies como el <strong>Nigüito</strong> (<em>Miconia theaezans</em>) y el <strong>Mano de Oso</strong> (<em>Oreopanax floribundus</em>) actúan como despensas naturales. Sus bayas y frutos pequeños y constantes atraen a decenas de especies de aves altoandinas (como tángaras, colibríes y mirlos), las cuales actúan a su vez como dispersores naturales de semillas, acelerando la regeneración espontánea del bosque.
            </p>
          </div>

          <div className="bg-[#0b1329]/70 border border-white/5 p-6 rounded-2xl space-y-3 hover:border-blue-500/20 transition-all duration-300">
            <div className="bg-blue-950/20 p-2 rounded-lg border border-blue-500/10 w-fit">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a6.6 6.6 0 11-10.8 0L14 3l5.4 12z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">La Esponja Hídrica de Chupaderos</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              La Quebrada Chupaderos es una de las principales arterias de agua para Villamaría. La combinación de <strong>Robles</strong> (para anclaje profundo de laderas y prevención de derrumbes) y especies de sotobosque con vellosidades foliares (como el <strong>Encenillo</strong>) crea un efecto de "esponja hídrica" que capta y almacena agua en temporadas de lluvia y la libera paulatinamente durante sequías.
            </p>
          </div>

          <div className="bg-[#0b1329]/70 border border-white/5 p-6 rounded-2xl space-y-3 hover:border-emerald-500/20 transition-all duration-300">
            <div className="bg-emerald-950/20 p-2 rounded-lg border border-emerald-500/10 w-fit">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m10.607 10.607l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Polinizadores Altoandinos</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              La introducción del <strong>Siete Cueros</strong> (<em>Tibouchina lepidota</em>) y el <strong>Arboloco</strong> (<em>Montanoa quadrangularis</em>) provee néctar abundante a abejas nativas, mariposas y escarabajos locales. Mantener una población sana de polinizadores garantiza la variabilidad genética del bosque y la salud de los cultivos de las zonas aledañas en Villamaría.
            </p>
          </div>

        </div>

        {/* Section 3: Key Ecological Principles */}
        <div className="bg-[#0b1329]/30 border border-white/5 p-8 rounded-2xl space-y-4 relative z-10">
          <h3 className="text-xl font-bold text-white">Principios Técnicos del Inventario</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cada individuo registrado en nuestro inventario inmutable está clasificado y georreferenciado para asegurar el éxito del programa de mantenimiento a largo plazo:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-slate-300">
            <li className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Altura &amp; Diámetro del Tallo (DAP) monitoreados.
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Ubicación exacta del 100% de individuos en WGS84.
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Clasificación por Lote y Tipo de Predio.
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Registro inmutable de salud fitosanitaria.
            </li>
          </ul>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4 relative z-10">
          <a
            href="/inventario-tecnico"
            className="inline-flex items-center bg-[#0b1329] hover:bg-white/5 border border-white/10 hover:border-emerald-500/30 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all"
          >
            Explorar base de datos técnica →
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
