'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

interface LoteProperties {
  lote: number;
  nombre: string;
  hoja: string;
  siembra: number;
  mantenimiento: number;
  total: number;
}

const SPECIES_BY_LOTE: Record<number, string[]> = {
  1: ['Arrayán', 'Encino', 'Cedro Negro'],
  2: ['Aliso', 'Yarumo blanco', 'Sauce'],
  3: ['Laurel de cera', 'Arrayán', 'Roble'],
  4: ['Cedro', 'Siete Cueros', 'Aliso'],
  5: ['Aliso', 'Roble andino', 'Yarumo'],
  6: ['Encino', 'Arrayán', 'Siete Cueros'],
  7: ['Yarumo', 'Siete Cueros', 'Cedro'],
  8: ['Laurel', 'Roble', 'Aliso'],
};

const AREA_BY_LOTE: Record<number, string> = {
  1: '1.10 Ha', 2: '1.83 Ha', 3: '1.17 Ha', 4: '4.74 Ha',
  5: '0.70 Ha', 6: '1.43 Ha', 7: '3.48 Ha', 8: '7.35 Ha',
};

// Colour palette — emerald/green scale for a serious and cohesive brand theme
const LOTE_COLORS = [
  '#059669', '#10b981', '#34d399', '#047857',
  '#065f46', '#064e3b', '#0f766e', '#14532d',
];

export default function LoteMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const polygonsRef = useRef<Record<number, L.Polygon>>({});
  const activeLoteIdRef = useRef<number | null>(null);

  const [hoveredLote, setHoveredLote] = useState<LoteProperties | null>(null);
  const [activeLote, setActiveLote] = useState<LoteProperties | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const resetPolygonStyle = (polygon: L.Polygon, loteNum: number) => {
    polygon.setStyle({
      color: '#10b981',         // emerald border
      fillColor: LOTE_COLORS[loteNum - 1] || '#059669',
      fillOpacity: 0.15,
      weight: 1.5,
    });
  };

  const highlightPolygon = (polygon: L.Polygon, loteNum: number) => {
    polygon.setStyle({
      color: '#ffffff',
      fillColor: LOTE_COLORS[loteNum - 1] || '#059669',
      fillOpacity: 0.35,
      weight: 2.5,
    });
  };

  useEffect(() => {
    let isMounted = true;
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-75.475, 4.97],
      zoom: 14,
      zoomControl: true,
      attributionControl: true,
    });
    mapRef.current = map;

    // ── Satellite tile layer (ESRI World Imagery) ──────────────────────────
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
        maxZoom: 20,
      }
    ).addTo(map);

    // ── Load real GeoJSON from public/lotes.geojson ────────────────────────
    const loadGeoJSON = async () => {
      try {
        const res = await fetch('/lotes.geojson');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const geojson = await res.json();

        if (!isMounted) return;

        const bounds = L.latLngBounds([]);

        geojson.features.forEach((feature: {
          properties: LoteProperties;
          geometry: { type: string; coordinates: number[][][] };
        }) => {
          const props = feature.properties;
          const loteNum = props.lote;
          // GeoJSON coords are [lng, lat] → Leaflet wants [lat, lng]
          const latLngs: [number, number][] = feature.geometry.coordinates[0].map(
            ([lng, lat]) => [lat, lng]
          );

          const polygon = L.polygon(latLngs, {
            color: '#10b981',
            fillColor: LOTE_COLORS[loteNum - 1] || '#10b981',
            fillOpacity: 0.15,
            weight: 1.5,
          }).addTo(map);

          // Label in centre of each polygon
          const center = polygon.getBounds().getCenter();
          L.marker(center, {
            icon: L.divIcon({
              className: '',
              html: `<div style="
                background:rgba(2,6,23,0.8);
                color:#34d399;
                font-family:monospace;
                font-size:11px;
                font-weight:700;
                padding:2px 6px;
                border-radius:4px;
                border:1px solid rgba(52,211,153,0.3);
                white-space:nowrap;
              ">Lote ${loteNum}</div>`,
              iconAnchor: [22, 10],
            }),
          }).addTo(map);

          bounds.extend(polygon.getBounds());
          polygonsRef.current[loteNum] = polygon;

          polygon.on('mouseover', () => {
            if (activeLoteIdRef.current !== loteNum) {
              highlightPolygon(polygon, loteNum);
            }
            setHoveredLote(props);
          });

          polygon.on('mouseout', () => {
            if (activeLoteIdRef.current !== loteNum) {
              resetPolygonStyle(polygon, loteNum);
            }
            setHoveredLote(null);
          });

          polygon.on('click', () => {
            // Reset all
            Object.keys(polygonsRef.current).forEach(k => {
              const n = parseInt(k);
              resetPolygonStyle(polygonsRef.current[n], n);
            });
            highlightPolygon(polygon, loteNum);
            activeLoteIdRef.current = loteNum;
            setActiveLote(props);
            map.fitBounds(polygon.getBounds(), { padding: [50, 50], maxZoom: 17 });
          });
        });

        if (bounds.isValid() && isMounted) {
          map.fitBounds(bounds, { padding: [30, 30] });
        }
      } catch (err) {
        console.error('Error loading GeoJSON:', err);
        if (isMounted) setLoadError('No se pudo cargar el archivo de polígonos.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadGeoJSON();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const focusLote = (id: number) => {
    const polygon = polygonsRef.current[id];
    const map = mapRef.current;
    if (!polygon || !map) return;
    Object.keys(polygonsRef.current).forEach(k => {
      const n = parseInt(k);
      resetPolygonStyle(polygonsRef.current[n], n);
    });
    highlightPolygon(polygon, id);
    activeLoteIdRef.current = id;
    // Retrieve props from DOM (we store nothing else — fetch from geojson cache would be ideal)
    // For now re-build from known data
    setActiveLote({
      lote: id, nombre: `Lote ${id}`, hoja: `Vertices Lote ${id}`,
      siembra: [245,650,450,990,200,415,950,1500][id-1],
      mantenimiento: [200,370,280,1365,260,105,1370,1550][id-1],
      total: [445,1020,730,2355,460,520,2320,3050][id-1],
    });
    map.fitBounds(polygon.getBounds(), { padding: [50, 50], maxZoom: 17 });
  };

  const resetView = () => {
    const map = mapRef.current;
    if (!map) return;
    const bounds = L.latLngBounds([]);
    Object.keys(polygonsRef.current).forEach(k => {
      const n = parseInt(k);
      resetPolygonStyle(polygonsRef.current[n], n);
      bounds.extend(polygonsRef.current[n].getBounds());
    });
    activeLoteIdRef.current = null;
    setActiveLote(null);
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [30, 30] });
  };

  const displayed = activeLote ?? hoveredLote;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[560px]">
      {/* MAP */}
      <div className="lg:col-span-2 relative w-full h-[560px] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
        {isLoading && (
          <div className="absolute inset-0 bg-[#020617]/85 backdrop-blur-sm z-[1000] flex flex-col items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400" />
            <p className="text-xs text-emerald-300 font-mono">Cargando polígonos MAGNA-SIRGAS → WGS84...</p>
          </div>
        )}
        {loadError && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-[#020617]/90">
            <p className="text-red-400 text-sm font-mono">{loadError}</p>
          </div>
        )}
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Satellite badge */}
        <div className="absolute top-3 left-3 z-[999] bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] text-slate-300 font-mono px-2 py-1 rounded-md flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          ESRI World Imagery · MAGNA-SIRGAS CTM12
        </div>

        <button
          onClick={resetView}
          className="absolute bottom-4 left-4 z-[999] bg-black/70 border border-white/10 hover:border-emerald-500/50 text-white px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V8.065m-3 7.935v-1a2.5 2.5 0 012.5-2.5h1.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Vista General
        </button>
      </div>

      {/* INFO PANEL */}
      <div className="flex flex-col justify-between glass-card p-6 rounded-2xl border border-white/10 text-white min-h-[560px]">
        <div>
          <h3 className="text-lg font-bold text-emerald-400 mb-4 border-b border-white/5 pb-2">
            Detalle de Lote
          </h3>

          {/* Quick lote selector */}
          {!displayed && (
            <div className="text-center py-8">
              <p className="text-xs text-slate-400 mb-4">Haz clic en un polígono del mapa o selecciona directamente:</p>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 8 }, (_, i) => i + 1).map(id => (
                  <button key={id} onClick={() => focusLote(id)}
                    className="bg-[#0b1329] border border-white/5 hover:border-emerald-500 hover:bg-emerald-950/20 text-xs py-2 rounded-lg text-slate-300 font-mono transition-all cursor-pointer">
                    L{id}
                  </button>
                ))}
              </div>
            </div>
          )}

          {displayed && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  {activeLote ? 'SELECCIONADO' : 'HOVER'}
                </span>
                <h4 className="text-2xl font-extrabold text-white mt-1">{displayed.nombre}</h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{displayed.hoja}</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-white/5">
                <div className="bg-[#020617] rounded-xl p-3 border border-white/5">
                  <p className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">Siembra</p>
                  <p className="text-2xl font-extrabold text-slate-200 mt-0.5">{displayed.siembra.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500">individuos</p>
                </div>
                <div className="bg-[#020617] rounded-xl p-3 border border-white/5">
                  <p className="text-[10px] text-blue-400 font-mono font-bold uppercase tracking-wider">Mantenimiento</p>
                  <p className="text-2xl font-extrabold text-slate-200 mt-0.5">{displayed.mantenimiento.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500">individuos</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-emerald-950/15 border border-emerald-500/20 rounded-xl p-3">
                <span className="text-xs font-mono text-emerald-300">Total Lote</span>
                <span className="text-xl font-extrabold text-white">{displayed.total.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Área estimada</span>
                <span className="font-semibold text-emerald-400">{AREA_BY_LOTE[displayed.lote]}</span>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">Especies Predominantes</p>
                <div className="flex flex-wrap gap-1.5">
                  {(SPECIES_BY_LOTE[displayed.lote] || []).map((s, i) => (
                    <span key={i} className="text-[11px] bg-[#0b1329] border border-white/5 text-slate-300 px-2 py-1 rounded-lg flex items-center gap-1">
                      <svg className="w-3 h-3 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M12 3L7 9h10L12 3zM12 7l-7 8h14L12 7z" />
                      </svg>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Audit CTA */}
        {activeLote && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <button
              onClick={() => {
                document.getElementById('blockchain')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full bg-[#10b981] hover:bg-[#34d399] text-white font-semibold text-sm py-2.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 border border-emerald-400/20 cursor-pointer"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Auditar Certificado Blockchain
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
