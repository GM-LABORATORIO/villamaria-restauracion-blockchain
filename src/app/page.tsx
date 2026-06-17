import BlockchainVerifier from '@/components/BlockchainVerifier';
import LoteMapWrapper from '@/components/LoteMapWrapper';
import ImpactCounter from '@/components/ImpactCounter';
import SpeciesExplorer from '@/components/SpeciesExplorer';
import ForestStats from '@/components/ForestStats';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Trazabilidad Ecológica - SGR-SC-001-2025',
  description: 'Notarización digital e integridad ambiental del proyecto de restauración de la cuenca Quebrada Chupaderos, Villamaría, Caldas.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#00050d] text-white selection:bg-emerald-500 selection:text-white flex flex-col">
      <Header />

      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] bg-gradient-to-b from-emerald-950/15 via-blue-950/10 to-transparent pointer-events-none blur-3xl z-0" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 flex-1">
        
        {/* Hero Section */}
        <section id="inicio" className="text-center max-w-4xl mx-auto space-y-6 pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-mono font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            Fase 1: Notarización &amp; Trazabilidad Activa
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
            Seguridad Hídrica &amp; Restauración Ecológica
          </h1>
          
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Protección de la Cuenca Quebrada Chupaderos a través de la reforestación activa en los predios 
            <strong className="text-slate-200"> La Albania</strong>, 
            <strong className="text-slate-200"> La Carpeta</strong> y 
            <strong className="text-slate-200"> La Carpetica</strong> (Villamaría, Caldas).
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <a 
              href="#mapa" 
              className="bg-brand-green hover:bg-brand-green-light text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-950/40"
            >
              Explorar Polígonos Geográficos
            </a>
            <a 
              href="#blockchain" 
              className="bg-[#070f21] hover:bg-white/5 border border-white/10 hover:border-blue-500/30 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all font-mono"
            >
              Auditar Red Avalanche
            </a>
          </div>
        </section>

        {/* Dashboard de Métricas */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <ImpactCounter
            target={10900}
            label="Árboles Forestados"
            subLabel="Individuos nativos plantados"
            icon={
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V10M18 10a6 6 0 00-12 0M12 4v6M12 14l-4-4m4 4l4-4" />
              </svg>
            }
          />

          <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center justify-between hover:border-emerald-500/20 transition-all duration-300">
            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 font-semibold tracking-widest uppercase block">Área Total Intervenida</span>
              <p className="text-4xl font-extrabold text-white">34.4 Ha</p>
              <p className="text-xs text-slate-400 font-sans">8 Lotes debidamente delimitados</p>
            </div>
            <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L16 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center justify-between hover:border-blue-500/20 transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="space-y-1">
              <span className="text-xs font-mono text-blue-400 font-semibold tracking-widest uppercase block">Estado Ejecución</span>
              <p className="text-4xl font-extrabold text-white">100%</p>
              <p className="text-xs text-slate-400 font-sans">Fase 1 Notarizada y Certificada</p>
            </div>
            <div className="bg-blue-950/30 p-3 rounded-xl border border-blue-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>

        </section>

        {/* Map Section */}
        <section id="mapa" className="space-y-6 scroll-mt-24">
          <div className="border-l-4 border-emerald-500 pl-4">
            <h2 className="text-2xl font-bold text-white font-sans">Georreferenciación de Predios</h2>
            <p className="text-slate-400 text-sm mt-1">
              Mapa interactivo que delimita y resume el estado fitosanitario e individuos por lote.
            </p>
          </div>
          <LoteMapWrapper />
        </section>

        {/* El Bosque en Números Section */}
        <section id="estadisticas" className="space-y-6 scroll-mt-24">
          <div className="border-l-4 border-blue-500 pl-4">
            <h2 className="text-2xl font-bold text-white font-sans">El Bosque en Números</h2>
            <p className="text-slate-400 text-sm mt-1">
              Estadísticas del inventario forestal y de especies identificadas.
            </p>
          </div>
          <ForestStats />
        </section>

        {/* Mosaico de Biodiversidad Section */}
        <section id="biodiversidad" className="space-y-6 scroll-mt-24">
          <div className="border-l-4 border-emerald-500 pl-4">
            <h2 className="text-2xl font-bold text-white font-sans">Mosaico de Biodiversidad</h2>
            <p className="text-slate-400 text-sm mt-1">
              Descubre las especies clave seleccionadas para la restauración ecológica y su función en la cuenca.
            </p>
          </div>
          <SpeciesExplorer />
        </section>

        {/* Blockchain Section */}
        <section id="blockchain" className="space-y-6 scroll-mt-24">
          <div className="border-l-4 border-blue-500 pl-4">
            <h2 className="text-2xl font-bold text-white font-sans">Verificación de Integridad Criptográfica</h2>
            <p className="text-slate-400 text-sm mt-1">
              Validación y auditoría pública de documentos oficiales del proyecto mediante la red de Avalanche.
            </p>
          </div>

          <BlockchainVerifier />
        </section>

      </main>

      <Footer />
    </div>
  );
}
