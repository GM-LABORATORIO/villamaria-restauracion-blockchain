'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Compact format: [Individuo, Lote, Altura, Dap, Intervencion, Especie, Estado]
type RowData = [number, number, number, number, string, string, string];

const ESTADO_CONFIG: Record<string, { label: string; className: string }> = {
  default: { label: 'BUENO', className: 'bg-emerald-950/20 text-emerald-400' },
  buen: { label: '', className: 'bg-emerald-950/20 text-emerald-400' },
  excelente: { label: '', className: 'bg-emerald-950/20 text-emerald-400' },
  regular: { label: '', className: 'bg-amber-950/20 text-amber-400' },
};

function getEstadoClass(estado: string): string {
  const lower = (estado || '').toLowerCase();
  if (lower.includes('buen') || lower.includes('excelente')) return 'bg-emerald-950/20 text-emerald-400';
  if (lower.includes('regular')) return 'bg-amber-950/20 text-amber-400';
  if (estado) return 'bg-red-950/20 text-red-400';
  return 'bg-slate-900 text-slate-500';
}

export default function InventarioTecnico() {
  const [data, setData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedLote, setSelectedLote] = useState<string>('All');
  const [selectedSpecie, setSelectedSpecie] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    fetch('/inventario_compacto.json')
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar los datos del inventario.');
        return res.json();
      })
      .then((jsonData: RowData[]) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const speciesList = useMemo(() => {
    const speciesSet = new Set<string>();
    data.forEach((row) => {
      const sp = row[5] ? String(row[5]).trim() : '';
      if (sp) speciesSet.add(sp.charAt(0).toUpperCase() + sp.slice(1).toLowerCase());
    });
    return Array.from(speciesSet).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const idStr = String(row[0]);
      const loteStr = String(row[1]);
      const specieStr = row[5] ? String(row[5]).trim().toLowerCase() : '';
      const query = search.toLowerCase();
      const matchesSearch = idStr.includes(query) || specieStr.includes(query);
      const matchesLote = selectedLote === 'All' || loteStr === selectedLote;
      const matchesSpecie = selectedSpecie === 'All' || specieStr === selectedSpecie.toLowerCase();
      return matchesSearch && matchesLote && matchesSpecie;
    });
  }, [data, search, selectedLote, selectedSpecie]);

  useEffect(() => { setCurrentPage(1); }, [search, selectedLote, selectedSpecie]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative z-10">
        
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[300px] bg-gradient-to-b from-blue-950/20 to-transparent pointer-events-none blur-3xl z-0" />

        {/* Title */}
        <div className="space-y-2 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Inventario Técnico Forestal
          </h1>
          <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
            Base de datos completa de los <strong className="text-slate-200">10,900 individuos</strong> georreferenciados y plantados bajo el Contrato SGR-SC-001-2025. Datos firmados criptográficamente e inmutables en Avalanche.
          </p>
        </div>

        {loading ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-t-emerald-500 border-white/10 rounded-full animate-spin" />
            <p className="text-xs font-mono text-slate-500">Cargando base de datos técnica (10.9k registros)...</p>
          </div>
        ) : error ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center text-center space-y-2 border border-red-500/20 bg-red-950/10 p-8 rounded-2xl">
            <span className="text-3xl">⚠️</span>
            <p className="text-sm font-semibold text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 text-white text-xs px-4 py-2 rounded-lg mt-2 hover:bg-red-400 transition-colors"
            >
              Reintentar Cargar
            </button>
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            {/* Filter controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#0b1329]/60 border border-white/5 p-4 rounded-xl">
              <div className="sm:col-span-5 flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase text-slate-500">Buscar</label>
                <input
                  type="text"
                  placeholder="Ej: ROBLE o ID: 1234"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[#020617] border border-white/10 hover:border-white/20 focus:border-emerald-500 focus:outline-none px-4 py-2.5 rounded-lg text-sm transition-colors w-full"
                />
              </div>
              <div className="sm:col-span-3 flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase text-slate-500">Filtrar por Lote</label>
                <select
                  value={selectedLote}
                  onChange={(e) => setSelectedLote(e.target.value)}
                  className="bg-[#020617] border border-white/10 focus:border-emerald-500 focus:outline-none px-3 py-2.5 rounded-lg text-sm transition-colors w-full"
                >
                  <option value="All">Todos los Lotes</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((lote) => (
                    <option key={lote} value={lote}>Lote {lote}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-4 flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase text-slate-500">Especie</label>
                <select
                  value={selectedSpecie}
                  onChange={(e) => setSelectedSpecie(e.target.value)}
                  className="bg-[#020617] border border-white/10 focus:border-emerald-500 focus:outline-none px-3 py-2.5 rounded-lg text-sm transition-colors w-full"
                >
                  <option value="All">Todas las Especies</option>
                  {speciesList.map((sp) => (
                    <option key={sp} value={sp}>{sp}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results count & download */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
              <p>
                Mostrando <strong className="text-white">{filteredData.length.toLocaleString('es-CO')}</strong> de{' '}
                <strong className="text-slate-300">{data.length.toLocaleString('es-CO')}</strong> individuos
              </p>
              <a
                href="/data/Localizacion_Individuos_Totales_y_Muestreo_08_06_26.xls"
                download
                className="text-emerald-400 hover:underline flex items-center gap-1.5"
              >
                📥 Descargar Excel Completo (3.4MB)
              </a>
            </div>

            {/* ── DESKTOP TABLE (hidden on mobile) ── */}
            <div className="hidden md:block overflow-x-auto bg-[#0b1329]/40 border border-white/5 rounded-xl">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#0b1329]/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-4 px-5">ID</th>
                    <th className="py-4 px-5">Lote</th>
                    <th className="py-4 px-5">Altura</th>
                    <th className="py-4 px-5">DAP</th>
                    <th className="py-4 px-5">Intervención</th>
                    <th className="py-4 px-5">Especie</th>
                    <th className="py-4 px-5">Estado Fitosanitario</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-5 font-mono font-bold text-slate-300">#{row[0]}</td>
                        <td className="py-3.5 px-5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-950/40 text-blue-400 border border-blue-500/10 text-xs">
                            Lote {row[1]}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 font-mono text-slate-300">{row[2] ? `${row[2]} cm` : '—'}</td>
                        <td className="py-3.5 px-5 font-mono text-slate-300">{row[3] ? `${row[3]} cm` : '—'}</td>
                        <td className="py-3.5 px-5">
                          <span className={`capitalize text-xs font-semibold ${row[4]?.toLowerCase().includes('siembra') ? 'text-emerald-400' : 'text-blue-400'}`}>
                            {row[4] || 'Mantenimiento'}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 font-semibold text-white text-xs">
                          {row[5] ? row[5].trim().toUpperCase() : 'N/A (CENSO GENERAL)'}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-mono font-semibold ${getEstadoClass(row[6])}`}>
                            {row[6] ? row[6].trim().toUpperCase() : 'BUENO'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 px-6 text-center text-slate-500 font-mono">
                        No se encontraron registros que coincidan con los filtros aplicados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ── MOBILE CARDS (hidden on desktop) ── */}
            <div className="md:hidden space-y-3">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0b1329]/60 border border-white/5 rounded-xl p-4 space-y-3"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-200 text-sm">#{row[0]}</span>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-950/40 text-blue-400 border border-blue-500/10 text-xs">
                          Lote {row[1]}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold ${getEstadoClass(row[6])}`}>
                          {row[6] ? row[6].trim().toUpperCase() : 'BUENO'}
                        </span>
                      </div>
                    </div>

                    {/* Species */}
                    <div className="font-semibold text-white text-sm">
                      {row[5] ? row[5].trim().toUpperCase() : 'N/A — CENSO GENERAL'}
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-3 gap-2 text-[11px]">
                      <div className="bg-white/5 rounded-lg p-2 text-center">
                        <div className="text-slate-500 font-mono uppercase mb-0.5">Altura</div>
                        <div className="text-slate-200 font-semibold">{row[2] ? `${row[2]} cm` : '—'}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 text-center">
                        <div className="text-slate-500 font-mono uppercase mb-0.5">DAP</div>
                        <div className="text-slate-200 font-semibold">{row[3] ? `${row[3]} cm` : '—'}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 text-center">
                        <div className="text-slate-500 font-mono uppercase mb-0.5">Tipo</div>
                        <div className={`font-semibold ${row[4]?.toLowerCase().includes('siembra') ? 'text-emerald-400' : 'text-blue-400'}`}>
                          {row[4] ? row[4].split(' ')[0] : 'Mant.'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-slate-500 font-mono text-sm">
                  No se encontraron registros con los filtros aplicados.
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs font-mono text-slate-400 border-t border-white/5">
                <span>
                  Página <strong className="text-white">{currentPage}</strong> de <strong className="text-slate-300">{totalPages}</strong>
                </span>

                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                    className="px-3 py-1.5 rounded bg-[#0b1329] border border-white/5 text-slate-200 hover:bg-white/5 disabled:opacity-30 transition-all cursor-pointer"
                  >
                    « Primera
                  </button>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="px-3 py-1.5 rounded bg-[#0b1329] border border-white/5 text-slate-200 hover:bg-white/5 disabled:opacity-30 transition-all cursor-pointer"
                  >
                    ‹ Ant.
                  </button>

                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum = currentPage - 2 + i;
                      if (currentPage <= 2) pageNum = i + 1;
                      if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                      if (pageNum < 1 || pageNum > totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1.5 rounded border transition-all cursor-pointer ${
                            currentPage === pageNum
                              ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                              : 'bg-[#0b1329] border-white/5 text-slate-400 hover:bg-white/5'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-3 py-1.5 rounded bg-[#0b1329] border border-white/5 text-slate-200 hover:bg-white/5 disabled:opacity-30 transition-all cursor-pointer"
                  >
                    Sig. ›
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-1.5 rounded bg-[#0b1329] border border-white/5 text-slate-200 hover:bg-white/5 disabled:opacity-30 transition-all cursor-pointer"
                  >
                    Última »
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
