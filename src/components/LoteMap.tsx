'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';

interface Tree {
  id: string;
  idNum: number;
  lote: number;
  lat: number;
  lng: number;
  sp: string;
  sci: string;
  tipo: 'noble' | 'arbusto';
  uicn: string;
  hue: number;
  dap: number;
  alt: number;
  altc: number;
  copa: number;
  fito: 'Bueno' | 'Regular' | 'Malo';
  reg: string;
  fecha: string;
  marker?: L.CircleMarker;
}

interface Lote {
  n: number;
  predio: string;
  area: number;
  ind: number;
  poly: [number, number][];
}

type CompactRow = [number, number, number, number, string, string, string, number, number];

const UICN_COL: Record<string, string> = {
  CR: '#ef4444',
  EN: '#f97316',
  VU: '#eab308',
  NT: '#a3e635',
  LC: '#34d399',
  NE: '#94a3b8',
  DD: '#64748b',
};

const UICN_NOM: Record<string, string> = {
  CR: 'Peligro Crítico',
  EN: 'En Peligro',
  VU: 'Vulnerable',
  NT: 'Casi Amenazada',
  LC: 'Preocupación Menor',
  NE: 'No Evaluada',
  DD: 'Datos Insuficientes',
};

const SPECIES_INFO: Record<string, { s: string; tipo: 'noble' | 'arbusto'; uicn: string; hue: number }> = {
  ROBLE: { s: 'Quercus humboldtii', tipo: 'noble', uicn: 'VU', hue: 150 },
  CEDRO: { s: 'Cedrela montana', tipo: 'noble', uicn: 'VU', hue: 28 },
  'PINO COLOMBIANO': { s: 'Retrophyllum rospigliosii', tipo: 'noble', uicn: 'EN', hue: 160 },
  ENCENILLO: { s: 'Weinmannia tomentosa', tipo: 'noble', uicn: 'LC', hue: 90 },
  OLIVO: { s: 'Olea europaea', tipo: 'noble', uicn: 'NE', hue: 80 },
  CUCHARO: { s: 'Myrsine guianensis', tipo: 'arbusto', uicn: 'LC', hue: 200 },
  NIGUITO: { s: 'Miconia theaezans', tipo: 'arbusto', uicn: 'LC', hue: 265 },
  NIGÜITO: { s: 'Miconia theaezans', tipo: 'arbusto', uicn: 'LC', hue: 265 },
  AMARGOSO: { s: 'Aegiphila grandis', tipo: 'arbusto', uicn: 'LC', hue: 55 },
  'MANO DE OSO': { s: 'Oreopanax floribundus', tipo: 'arbusto', uicn: 'LC', hue: 140 },
  ARBOLOCO: { s: 'Montanoa quadrangularis', tipo: 'arbusto', uicn: 'LC', hue: 190 },
  'SIETE CUEROS': { s: 'Tibouchina lepidota', tipo: 'arbusto', uicn: 'LC', hue: 290 },
  YAGRUMO: { s: 'Cecropia telealba', tipo: 'arbusto', uicn: 'LC', hue: 100 },
  FRESNO: { s: 'Fraxinus chinensis', tipo: 'noble', uicn: 'LC', hue: 120 },
  NISPERO: { s: 'Eriobotrya japonica', tipo: 'arbusto', uicn: 'LC', hue: 40 },
};

const LOTES: Lote[] = [
  { n: 1, predio: 'La Albania', area: 3.2, ind: 1600, poly: [[4.9689861,-75.4755607],[4.9688729,-75.4751023],[4.9686449,-75.4746625],[4.968502,-75.4745689],[4.9679443,-75.4752228],[4.9678287,-75.4754323],[4.9677331,-75.4755488],[4.9675262,-75.4757091],[4.967554,-75.4757529],[4.9676735,-75.4757963],[4.9678935,-75.4758019],[4.9683102,-75.4756937],[4.9684731,-75.4756466],[4.9686886,-75.4755854],[4.9689861,-75.4755607]] },
  { n: 2, predio: 'La Albania', area: 2.9, ind: 1450, poly: [[4.9681073,-75.4765374],[4.9685066,-75.4761829],[4.9686566,-75.4760403],[4.9687618,-75.4759035],[4.9688494,-75.4756207],[4.9688264,-75.4755739],[4.9687619,-75.4755793],[4.9686886,-75.4755854],[4.9684731,-75.4756466],[4.9683102,-75.4756937],[4.9678935,-75.4758019],[4.9676735,-75.4757963],[4.967554,-75.4757529],[4.9674112,-75.475811],[4.9669899,-75.4758906],[4.9667976,-75.4766511],[4.9673233,-75.4768201],[4.9679476,-75.4766241],[4.9681073,-75.4765374]] },
  { n: 3, predio: 'La Albania', area: 2.4, ind: 1200, poly: [[4.968502,-75.4745689],[4.9680844,-75.4742702],[4.967537,-75.4747977],[4.9673428,-75.4749115],[4.967169,-75.4753331],[4.9671678,-75.4756336],[4.9671836,-75.475854],[4.9674112,-75.475811],[4.967554,-75.4757529],[4.9675262,-75.4757091],[4.9677331,-75.4755488],[4.9678287,-75.4754323],[4.9679443,-75.4752228],[4.968371,-75.4747225],[4.968502,-75.4745689]] },
  { n: 4, predio: 'La Carpeta', area: 3.1, ind: 1550, poly: [[4.9671927,-75.4745048],[4.9671876,-75.4743887],[4.9672082,-75.4743602],[4.9670947,-75.4743315],[4.9670459,-75.4745818],[4.96686,-75.4747093],[4.9667554,-75.4747119],[4.966653,-75.4748934],[4.9665628,-75.4750153],[4.966473,-75.4750388],[4.9664137,-75.4749194],[4.9663786,-75.4747016],[4.96654,-75.474723],[4.9666214,-75.4745534],[4.9666223,-75.4743029],[4.9665906,-75.4742761],[4.9661059,-75.4736404],[4.965972,-75.4737628],[4.9659655,-75.4740321],[4.9657144,-75.4739835],[4.9655204,-75.4738903],[4.9654129,-75.4738511],[4.9653713,-75.4737735],[4.9652794,-75.4735793],[4.9652141,-75.4734449],[4.9650799,-75.4733519],[4.9650324,-75.4732593],[4.9648893,-75.4731306],[4.9643712,-75.4733433],[4.964213,-75.4732819],[4.9640942,-75.4733662],[4.9640283,-75.4733981],[4.9640032,-75.4734028],[4.9639649,-75.4734134],[4.9639446,-75.4734014],[4.9638776,-75.4734011],[4.9637798,-75.4735415],[4.9649558,-75.4746969],[4.9654708,-75.4751806],[4.9658103,-75.4752272],[4.9663858,-75.4752592],[4.966147,-75.4754509],[4.9665628,-75.475632],[4.9669899,-75.4758906],[4.9671836,-75.475854],[4.9671752,-75.4757361],[4.9671678,-75.4756336],[4.967169,-75.4753331],[4.9673407,-75.4749167],[4.9672543,-75.4746998],[4.9672104,-75.4745822],[4.9671927,-75.4745048]] },
  { n: 5, predio: 'La Carpeta', area: 2.7, ind: 1350, poly: [[4.9669865,-75.4742073],[4.9668037,-75.4740732],[4.9666309,-75.4738907],[4.9665507,-75.4737622],[4.9664688,-75.4735786],[4.9663384,-75.4734279],[4.9661059,-75.4736404],[4.9665906,-75.4742761],[4.9666223,-75.4743029],[4.9666214,-75.4745534],[4.96654,-75.474723],[4.9663786,-75.4747016],[4.9664137,-75.4749194],[4.966473,-75.4750388],[4.9665628,-75.4750153],[4.966653,-75.4748934],[4.9667554,-75.4747119],[4.96686,-75.4747093],[4.9670459,-75.4745818],[4.9670947,-75.4743315],[4.9672142,-75.4743618],[4.9672487,-75.4742668],[4.9671712,-75.4742021],[4.9670017,-75.4742265],[4.9669865,-75.4742073]] },
  { n: 6, predio: 'La Carpeta', area: 2.5, ind: 1250, poly: [[4.964223,-75.4731624],[4.9638776,-75.4734011],[4.9639446,-75.4734014],[4.9639649,-75.4734134],[4.9640032,-75.4734028],[4.9640283,-75.4733981],[4.9640337,-75.4733955],[4.9640486,-75.4733883],[4.9640942,-75.4733662],[4.964213,-75.4732819],[4.9642192,-75.4732843],[4.9642375,-75.4732915],[4.9643712,-75.4733433],[4.9644331,-75.4733179],[4.9644811,-75.4732982],[4.9648893,-75.4731306],[4.9649973,-75.4732278],[4.9650131,-75.473242],[4.9650324,-75.4732593],[4.9650799,-75.4733519],[4.9652141,-75.4734449],[4.9652794,-75.4735793],[4.9653373,-75.4737016],[4.9653715,-75.4737738],[4.9654129,-75.4738511],[4.9655204,-75.4738903],[4.9657144,-75.4739835],[4.9658053,-75.4740011],[4.9658453,-75.4740088],[4.9659655,-75.4740321],[4.9659719,-75.4737636],[4.965972,-75.4737628],[4.9661059,-75.4736404],[4.9659299,-75.4734834],[4.9658171,-75.4733395],[4.965527,-75.4730393],[4.9653636,-75.4727233],[4.96502,-75.4721508],[4.9647298,-75.4729496],[4.964223,-75.4731624]] },
  { n: 7, predio: 'La Carpetica', area: 2.6, ind: 1300, poly: [[4.9679545,-75.4729468],[4.9664339,-75.4733406],[4.9663384,-75.4734279],[4.9664688,-75.4735786],[4.9665507,-75.4737622],[4.9666309,-75.4738907],[4.9668037,-75.4740732],[4.9669865,-75.4742073],[4.9670017,-75.4742265],[4.9671712,-75.4742021],[4.9672487,-75.4742668],[4.9672142,-75.4743618],[4.9672082,-75.4743602],[4.9671876,-75.4743887],[4.9671927,-75.4745048],[4.9672104,-75.4745822],[4.9672543,-75.4746998],[4.9673407,-75.4749167],[4.9673428,-75.4749115],[4.967537,-75.4747977],[4.9680844,-75.4742702],[4.9684224,-75.47377],[4.9687704,-75.4734741],[4.9688608,-75.4733015],[4.9688226,-75.4731105],[4.9687931,-75.473009],[4.9686772,-75.4728267],[4.9684595,-75.472644],[4.9681373,-75.4725673],[4.9680787,-75.4726928],[4.9679545,-75.4729468]] },
  { n: 8, predio: 'La Carpetica', area: 2.4, ind: 1200, poly: [[4.9653348,-75.4721822],[4.9660483,-75.4721755],[4.9663065,-75.4722408],[4.9665289,-75.472256],[4.9667656,-75.4722926],[4.9668947,-75.4723217],[4.9670739,-75.4723725],[4.9675106,-75.4726532],[4.9679545,-75.4729468],[4.9684384,-75.471957],[4.9689873,-75.4707824],[4.9686871,-75.4704378],[4.9675396,-75.4708453],[4.966517,-75.4697341],[4.9664924,-75.4704475],[4.9663595,-75.4707988],[4.9661613,-75.4710128],[4.9658256,-75.4712143],[4.9655263,-75.4712728],[4.9647695,-75.4712917],[4.9647047,-75.4713494],[4.9653348,-75.4721822]] },
];

const FOTOS: Record<string, string[]> = {
  Roble: ['/fotos/roble-1.jpg'],
  Cedro: ['/fotos/cedro-1.jpg'],
  'Pino Colombiano': ['/fotos/pino-colombiano-1.jpg', '/fotos/pino-colombiano-2.jpg', '/fotos/pino-colombiano-3.jpg', '/fotos/pino-colombiano-4.jpg'],
  Encenillo: ['/fotos/encenillo-1.jpg'],
  Olivo: ['/fotos/olivo-1.jpg'],
  Nigüito: ['/fotos/niguito-1.jpg'],
  'Siete Cueros': ['/fotos/siete-cueros-1.jpg'],
  Cucharo: ['/fotos/cucharo-1.jpg'],
  Amargoso: ['/fotos/amargoso-1.jpg'],
  'Mano de Oso': ['/fotos/mano-de-oso-1.jpg'],
  Arboloco: ['/fotos/arboloco-1.jpg'],
  Yagrumo: ['/fotos/yagrumo-1.jpg'],
};

const FOTO_REFERENCIAL: Record<string, number> = {
  Encenillo: 1,
  Olivo: 1,
  Amargoso: 1,
  Arboloco: 1,
};

function getFotoArbol(sp: string, id: string) {
  const arr = FOTOS[sp];
  if (arr && arr.length) {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    return arr[h % arr.length];
  }
  return '/fotos/roble-1.jpg';
}

function fotoEtiqueta(sp: string) {
  return FOTO_REFERENCIAL[sp] ? 'FOTO REFERENCIAL · ESPECIE SIMILAR' : 'FOTO REAL DE CAMPO';
}

/* ============ Carbono IPCC ============ */
const CARBONO = { gAereo: 4.4, R: 0.27, CF: 0.47, maxAGB: 90, co2factor: 44 / 12 };
const k_carbon = -Math.log(1 - CARBONO.gAereo / CARBONO.maxAGB);
function co2Acum(years: number) {
  const agb = CARBONO.maxAGB * (1 - Math.exp(-k_carbon * years));
  return agb * (1 + CARBONO.R) * CARBONO.CF * CARBONO.co2factor;
}
function co2Lote(ha: number, years: number) {
  return co2Acum(years) * ha;
}

export default function LoteMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerClusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const lotPolygonsRef = useRef<Record<number, L.Polygon>>({});
  const deforLayerRef = useRef<L.TileLayer | null>(null);
  const fullBoundsRef = useRef<L.LatLngBounds | null>(null);

  const [trees, setTrees] = useState<Tree[]>([]);
  const [loadingTrees, setLoadingTrees] = useState(true);
  const [activeTab, setActiveTab] = useState<'lote' | 'trees'>('lote');
  const [selectedLoteId, setSelectedLoteId] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState<'esri' | 'osm'>('esri');
  const [showDefor, setShowDefor] = useState(false);
  const [modalTree, setModalTree] = useState<Tree | null>(null);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLote, setFilterLote] = useState('');
  const [filterUicn, setFilterUicn] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterFito, setFilterFito] = useState('');

  // Fly to Lote or reset highlight
  const selectLote = (id: number, fly = true) => {
    setSelectedLoteId(id);

    // Update polygon styles: highlight active lote
    LOTES.forEach((l) => {
      const p = lotPolygonsRef.current[l.n];
      if (p) {
        if (l.n === id) {
          p.setStyle({ color: '#34d399', weight: 3.5, fillOpacity: 0.18 });
        } else {
          p.setStyle({ color: '#34d399', weight: 2, fillOpacity: 0.07 });
        }
      }
    });

    if (fly) {
      const pg = lotPolygonsRef.current[id];
      if (pg && mapRef.current) {
        mapRef.current.flyToBounds(pg.getBounds().pad(0.08), { maxZoom: 18, duration: 1.1 });
      }
    }
  };

  // Reset to Vista General (Exact zoom level 15.0 showing all 8 lot spheres and surrounding landscape)
  const fitOverview = () => {
    if (mapRef.current) {
      // Reset polygon styles
      LOTES.forEach((l) => {
        const p = lotPolygonsRef.current[l.n];
        if (p) p.setStyle({ color: '#34d399', weight: 2, fillOpacity: 0.07 });
      });
      mapRef.current.flyTo([4.9665, -75.4740], 15.0, { duration: 1 });
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
      maxZoom: 19,
    });

    const map = L.map(mapContainerRef.current, {
      layers: [esri],
      zoomControl: true,
      attributionControl: true,
    });
    mapRef.current = map;

    deforLayerRef.current = L.tileLayer(
      'https://tiles.globalforestwatch.org/umd_tree_cover_loss/latest/dynamic/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        opacity: 0.85,
        pane: 'overlayPane',
        attribution: 'Pérdida de bosque 2001–2024 · Hansen/UMD · Global Forest Watch',
      }
    );

    const cluster = L.markerClusterGroup({
      chunkedLoading: true,
      chunkDelay: 30,
      disableClusteringAtZoom: 16,
      maxClusterRadius: 46,
      iconCreateFunction: (c) => {
        const n = c.getChildCount();
        const s = n < 50 ? 38 : n < 500 ? 44 : n < 2000 ? 52 : 58;
        const text = n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n;
        return L.divIcon({ html: `<div>${text}</div>`, className: 'mk-cluster', iconSize: [s, s] });
      },
    });
    map.addLayer(cluster);
    markerClusterRef.current = cluster;

    const allBounds: L.LatLngBounds[] = [];
    LOTES.forEach((lt) => {
      const pg = L.polygon(lt.poly, {
        color: '#34d399',
        weight: 2,
        opacity: 0.85,
        fillColor: '#10b981',
        fillOpacity: 0.07,
      }).addTo(map);

      pg.bindTooltip(`Lote ${lt.n}`, { permanent: true, direction: 'center', className: 'lot-label', interactive: false });
      
      // V2 Exact behavior: Clicking a polygon on the map opens and flies into that lote
      pg.on('click', () => {
        selectLote(lt.n, true);
      });
      pg.on('mouseover', () => {
        if (selectedLoteId !== lt.n) pg.setStyle({ fillOpacity: 0.2, weight: 3 });
      });
      pg.on('mouseout', () => {
        if (selectedLoteId !== lt.n) pg.setStyle({ fillOpacity: 0.07, weight: 2 });
      });

      lotPolygonsRef.current[lt.n] = pg;
      allBounds.push(pg.getBounds());
    });

    const fullBounds = allBounds.reduce((a, b) => a.extend(b), allBounds[0]);
    fullBoundsRef.current = fullBounds;
    map.setView([4.9665, -75.4740], 15.0);

    // Fetch tree inventory JSON
    fetch('/inventario_compacto.json')
      .then((res) => res.json())
      .then((rows: CompactRow[]) => {
        const parsedTrees: Tree[] = rows.map((row) => {
          const idNum = row[0];
          const lote = row[1];
          let alt = row[2];
          if (alt > 100) alt = parseFloat((alt / 100).toFixed(1));
          const dap = row[3];
          const reg = row[4] || 'Mantenimiento';
          const rawSp = (row[5] || '').toUpperCase();
          const rawFito = (row[6] || '').toUpperCase();
          const lat = row[7];
          const lng = row[8];

          const info = SPECIES_INFO[rawSp] || {
            s: rawSp ? `${rawSp.charAt(0) + rawSp.slice(1).toLowerCase()} sp.` : 'Especie nativa',
            tipo: 'arbusto',
            uicn: 'LC',
            hue: 140,
          };

          const titleSp = rawSp ? rawSp.charAt(0) + rawSp.slice(1).toLowerCase() : 'Especie nativa';
          const fito: 'Bueno' | 'Regular' | 'Malo' = rawFito.includes('BUEN') || rawFito.includes('EXCEL') ? 'Bueno' : rawFito.includes('REG') ? 'Regular' : 'Malo';

          return {
            id: `VM-L${lote}-${String(idNum).padStart(4, '0')}`,
            idNum,
            lote,
            lat,
            lng,
            sp: titleSp,
            sci: info.s,
            tipo: info.tipo,
            uicn: info.uicn,
            hue: info.hue,
            dap,
            alt,
            altc: parseFloat((alt * 0.55).toFixed(1)),
            copa: parseFloat((dap / 6 + 1.8).toFixed(1)),
            fito,
            reg,
            fecha: 'Marzo 2026',
          };
        });

        setTrees(parsedTrees);
        setLoadingTrees(false);

        // Add circle markers for all real trees
        parsedTrees.forEach((t) => {
          if (!t.lat || !t.lng) return;
          const m = L.circleMarker([t.lat, t.lng], {
            radius: 5.5,
            weight: 1.2,
            color: '#04120c',
            fillColor: UICN_COL[t.uicn] || '#34d399',
            fillOpacity: 0.92,
          });

          const popupContent = `
            <div style="background:#0c1222; color:#e2e8f0; border-radius:12px; overflow:hidden; font-family:sans-serif;">
              <div style="height:110px; background-image:url('${getFotoArbol(t.sp, t.id)}'); background-size:cover; background-position:center; position:relative;">
                <span style="position:absolute; top:6px; left:8px; font-size:9px; font-weight:700; color:#a7f3d0; background:rgba(6,10,21,0.85); padding:2px 8px; border-radius:10px; border:1px solid rgba(52,211,153,0.3);">
                  ${fotoEtiqueta(t.sp)}
                </span>
              </div>
              <div style="padding:12px;">
                <div style="font-size:10px; color:#34d399; font-family:monospace; font-weight:700;">${t.id} · LOTE ${t.lote}</div>
                <div style="font-size:15px; font-weight:800; color:#ffffff; margin-top:2px;">${t.sp}</div>
                <div style="font-size:11px; color:#94a3b8; italic;">${t.sci}</div>
                
                <div style="display:flex; gap:6px; margin-top:8px;">
                  <span style="font-size:10px; padding:2px 6px; border-radius:4px; font-weight:700; color:${UICN_COL[t.uicn]}; border:1px solid ${UICN_COL[t.uicn]}44; background:${UICN_COL[t.uicn]}15;">UICN ${t.uicn}</span>
                  <span style="font-size:10px; padding:2px 6px; border-radius:4px; font-weight:700; color:#60a5fa; border:1px solid #3b82f644; background:#3b82f615;">${t.tipo.toUpperCase()}</span>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:10px; font-size:11px; background:#020617; padding:8px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
                  <div><span style="color:#64748b;">DAP:</span> <b>${t.dap} cm</b></div>
                  <div><span style="color:#64748b;">Alt Total:</span> <b>${t.alt} m</b></div>
                  <div><span style="color:#64748b;">Coordenadas:</span> <b>${t.lat.toFixed(4)}, ${t.lng.toFixed(4)}</b></div>
                  <div><span style="color:#64748b;">Intervención:</span> <b>${t.reg}</b></div>
                </div>

                <div style="margin-top:8px; font-size:11px; display:flex; justify-content:space-between;">
                  <span style="color:#94a3b8;">Estado fitosanitario:</span>
                  <b style="color:${t.fito === 'Bueno' ? '#34d399' : t.fito === 'Regular' ? '#fbbf24' : '#f87171'}">${t.fito}</b>
                </div>

                <button id="btn-detail-${t.id}" style="width:100%; margin-top:10px; background:#10b981; color:#ffffff; font-weight:700; font-size:11px; padding:7px; border:none; border-radius:8px; cursor:pointer;">
                  Ver ficha técnica completa →
                </button>
              </div>
            </div>
          `;

          m.bindPopup(popupContent);
          m.on('popupopen', () => {
            setTimeout(() => {
              const btn = document.getElementById(`btn-detail-${t.id}`);
              if (btn) btn.onclick = () => setModalTree(t);
            }, 100);
          });

          t.marker = m;
          cluster.addLayer(m);
        });
      })
      .catch((err) => {
        console.error('Error loading tree inventory:', err);
        setLoadingTrees(false);
      });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Layer toggle
  const toggleMapLayer = (type: 'esri' | 'osm') => {
    setActiveLayer(type);
    if (!mapRef.current) return;
    if (type === 'esri') {
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 }).addTo(mapRef.current);
    } else {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapRef.current);
    }
  };

  // Deforestation layer toggle
  const toggleDeforestation = () => {
    const nextState = !showDefor;
    setShowDefor(nextState);
    const map = mapRef.current;
    const defor = deforLayerRef.current;
    if (!map || !defor) return;

    if (nextState) {
      map.addLayer(defor);
      defor.bringToBack();
    } else {
      map.removeLayer(defor);
    }
  };

  // Fly to tree from search list
  const goTree = (t: Tree) => {
    const map = mapRef.current;
    if (!map || !t.lat || !t.lng) return;
    map.closePopup();
    map.flyTo([t.lat, t.lng], 18, { duration: 1.1 });
    setTimeout(() => {
      if (t.marker) {
        t.marker.openPopup();
      }
    }, 1250);
  };

  // Filter logic
  const filteredTrees = trees.filter((t) => {
    const matchQ = !searchQuery || t.id.toLowerCase().includes(searchQuery.toLowerCase()) || t.sp.toLowerCase().includes(searchQuery.toLowerCase()) || t.sci.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLote = !filterLote || t.lote === parseInt(filterLote);
    const matchUicn = !filterUicn || t.uicn === filterUicn;
    const matchTipo = !filterTipo || t.tipo === filterTipo;
    const matchFito = !filterFito || t.fito === filterFito;
    return matchQ && matchLote && matchUicn && matchTipo && matchFito;
  });

  const selectedLoteData = LOTES.find((l) => l.n === selectedLoteId) || LOTES[0];
  const treesInSelectedLote = trees.filter((t) => t.lote === selectedLoteId);
  const fitoBueno = treesInSelectedLote.filter((t) => t.fito === 'Bueno').length;
  const fitoReg = treesInSelectedLote.filter((t) => t.fito === 'Regular').length;
  const fitoMalo = treesInSelectedLote.filter((t) => t.fito === 'Malo').length;
  const totalInLote = treesInSelectedLote.length || 1;

  const speciesCount: Record<string, number> = {};
  const uicnCounts: Record<string, number> = {};
  treesInSelectedLote.forEach((t) => {
    speciesCount[t.sp] = (speciesCount[t.sp] || 0) + 1;
    uicnCounts[t.uicn] = (uicnCounts[t.uicn] || 0) + 1;
  });
  const topSpecies = Object.entries(speciesCount).sort((a, b) => b[1] - a[1]).slice(0, 4);

  // Carbon metrics & SVG path calculation
  const t10 = co2Lote(selectedLoteData.area, 10);
  const t20 = co2Lote(selectedLoteData.area, 20);
  const t30 = co2Lote(selectedLoteData.area, 30);
  const tasaAnual = co2Lote(selectedLoteData.area, 1);
  const autos = Math.round(t30 / 4.6);

  const W = 300, H = 92, PAD = 4;
  const maxV = co2Lote(selectedLoteData.area, 30) * 1.05;
  let dSvgPath = '';
  for (let y = 0; y <= 30; y++) {
    const x = PAD + (y / 30) * (W - 2 * PAD);
    const yy = H - PAD - (co2Lote(selectedLoteData.area, y) / maxV) * (H - 2 * PAD - 14);
    dSvgPath += (y === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + yy.toFixed(1);
  }
  const fillSvgPath = dSvgPath + `L${W - PAD} ${H - PAD}L${PAD} ${H - PAD}Z`;

  return (
    <div className="flex flex-col space-y-6">
      {/* Top Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0b1329]/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Mapa Operativo del Proyecto · Qda. Chupaderos ({trees.length.toLocaleString('es-CO')} Árboles)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Datum Badge */}
          <div className="bg-[#020617] border border-emerald-500/30 text-emerald-400 font-mono font-bold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
            <span className="text-slate-400 font-normal">Datum</span> MAGNA-SIRGAS
          </div>

          {/* Layer switcher */}
          <div className="flex items-center bg-[#020617] p-1 rounded-xl border border-white/10 text-xs font-mono">
            <button
              onClick={() => toggleMapLayer('esri')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeLayer === 'esri' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Satélite ESRI
            </button>
            <button
              onClick={() => toggleMapLayer('osm')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeLayer === 'osm' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Mapa OSM
            </button>
          </div>

          {/* Deforestation toggle */}
          <button
            onClick={toggleDeforestation}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
              showDefor
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-lg shadow-rose-950/40'
                : 'bg-[#020617] text-slate-400 border-white/10 hover:border-rose-500/30 hover:text-rose-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${showDefor ? 'bg-rose-400 animate-ping' : 'bg-rose-500/50'}`} />
            Deforestación
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[660px]">
        {/* Map Box */}
        <div className="lg:col-span-2 relative w-full h-[660px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#020617]">
          {loadingTrees && (
            <div className="absolute inset-0 z-[1000] bg-[#020617]/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-4 border-t-emerald-400 border-white/10 rounded-full animate-spin" />
              <p className="text-xs font-mono text-emerald-300">Cargando coordenadas reales MAGNA-SIRGAS (EPSG:9377)...</p>
            </div>
          )}

          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Map Top-Left Badge */}
          <div className="absolute top-4 left-4 z-[500] bg-[#020617]/85 backdrop-blur-md border border-white/10 text-[11px] text-slate-300 font-mono px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>{trees.length.toLocaleString('es-CO')} árboles reales georreferenciados</span>
          </div>

          {/* Map Bottom-Right Floating Vista General Button */}
          <button
            onClick={fitOverview}
            className="absolute bottom-4 right-4 z-[500] bg-[#020617]/90 backdrop-blur-md border border-emerald-500/60 hover:border-emerald-400 text-emerald-300 font-mono font-bold text-xs px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl hover:bg-emerald-950/80 transition-all cursor-pointer group"
            title="Restablecer vista aérea general con todas las esferas de lotes"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="group-hover:scale-110 transition-transform">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
            <span>Vista General</span>
          </button>

          {/* Deforestation Alert Banner */}
          {showDefor && (
            <div className="absolute bottom-4 left-4 z-[500] max-w-sm bg-rose-950/90 backdrop-blur-md border border-rose-500/30 text-xs text-rose-200 p-3 rounded-xl shadow-2xl">
              <p className="font-bold text-rose-300 mb-1">Pérdida de cobertura arbórea 2001–2024</p>
              <p className="text-[11px] leading-relaxed text-rose-200/80">
                Manchas rojas = bosque perdido detectado por satélites Landsat (30 m). Fuente: Hansen/UMD vía Global Forest Watch — la misma base satelital que usa el SMByC del IDEAM.{' '}
                <a
                  href="https://www.ideam.gov.co/nuestra-entidad/ecosistemas-e-informacion-ambiental/sistema-monitoreo-bosques-carbono"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-white font-bold block mt-1"
                >
                  Abrir Geovisor oficial IDEAM (serie por año) ↗
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Right Information & Search Sidebar (Exact V2 Design) */}
        <div className="bg-[#0c1222] p-5 rounded-2xl border border-white/10 flex flex-col justify-between h-[660px] text-slate-200 overflow-hidden shadow-2xl">
          <div>
            {/* Tabs Header */}
            <div className="flex border-b border-white/10 mb-4 pb-2">
              <button
                onClick={() => setActiveTab('lote')}
                className={`flex-1 py-2 text-xs font-mono font-bold transition-all cursor-pointer border-b-2 flex items-center justify-center gap-2 ${
                  activeTab === 'lote'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 20l-5.5-2.5v-13L9 7l6-2.5L20.5 7v13L15 17.5 9 20z" />
                </svg>
                Detalle de Lote
              </button>

              <button
                onClick={() => setActiveTab('trees')}
                className={`flex-1 py-2 text-xs font-mono font-bold transition-all cursor-pointer border-b-2 flex items-center justify-center gap-2 ${
                  activeTab === 'trees'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
                Buscador de Individuos
              </button>
            </div>

            {/* TAB 1: DETALLE DE LOTE & CARBONO (Exact V2 Layout) */}
            {activeTab === 'lote' && (
              <div className="space-y-4 overflow-y-auto max-h-[570px] pr-1">
                {/* Lote buttons selector */}
                <div>
                  <p className="text-[11px] text-slate-400 font-mono mb-2">Haz clic en un polígono del mapa o selecciona directamente un lote:</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {LOTES.map((l) => (
                      <button
                        key={l.n}
                        onClick={() => selectLote(l.n, true)}
                        className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer ${
                          selectedLoteId === l.n
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                            : 'bg-[#020617] text-slate-300 border-white/10 hover:border-emerald-500/50'
                        }`}
                      >
                        Lote {l.n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Lote Summary */}
                <div className="bg-[#060a15] p-4 rounded-xl border border-white/10 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-extrabold text-white">Lote {selectedLoteData.n}</h4>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                        PREDIO {selectedLoteData.predio.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-emerald-400 font-mono">{selectedLoteData.area} <span className="text-xs text-slate-400 font-normal">Ha</span></p>
                      <p className="text-[10px] text-slate-400 font-mono">{treesInSelectedLote.length.toLocaleString('es-CO')} individuos</p>
                    </div>
                  </div>

                  {/* Fitosanitario Status Bar */}
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">Estado fitosanitario</p>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex">
                      <div style={{ width: `${(fitoBueno / totalInLote) * 100}%` }} className="bg-emerald-400" />
                      <div style={{ width: `${(fitoReg / totalInLote) * 100}%` }} className="bg-amber-400" />
                      <div style={{ width: `${(fitoMalo / totalInLote) * 100}%` }} className="bg-rose-400" />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                      <span className="text-emerald-400">■ Bueno {((fitoBueno / totalInLote) * 100).toFixed(1)}%</span>
                      <span className="text-amber-400">■ Regular {((fitoReg / totalInLote) * 100).toFixed(1)}%</span>
                      <span className="text-rose-400">■ Malo {((fitoMalo / totalInLote) * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Especies dominantes */}
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">Especies dominantes</p>
                    <div className="space-y-1">
                      {topSpecies.map(([sp, cnt]) => (
                        <div key={sp} className="flex justify-between text-xs font-mono text-slate-300 border-b border-white/5 pb-0.5">
                          <span>{sp}</span>
                          <b className="text-white font-bold">{cnt.toLocaleString('es-CO')} ind.</b>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Categorías UICN presentes */}
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1.5">Categorías UICN presentes</p>
                    <div className="space-y-1 font-mono text-xs">
                      {Object.entries(uicnCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([cat, cnt]) => (
                          <div key={cat} className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-slate-300">
                              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: UICN_COL[cat] }} />
                              {UICN_NOM[cat] || cat} ({cat})
                            </span>
                            <b className="text-emerald-400 font-bold">{cnt.toLocaleString('es-CO')}</b>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* TARJETA DE CARBONO (Exact V2 Style from Screenshot) */}
                <div className="border border-emerald-500/30 rounded-2xl p-4 bg-gradient-to-br from-emerald-950/20 via-[#060a15] to-[#080d1a] space-y-3">
                  <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.9">
                      <path d="M11 20A7 7 0 0 1 4 13c0-4 3-8 8-11 5 3 8 7 8 11a7 7 0 0 1-7 7" />
                      <path d="M12 22v-8" />
                    </svg>
                    <span>CAPTURA DE CARBONO PROYECTADA</span>
                  </div>

                  <div>
                    <div className="text-3xl font-black text-white tracking-tight">
                      ≈ {Math.round(t30).toLocaleString('es-CO')} <span className="text-sm font-bold text-emerald-400">t CO₂</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      secuestradas por este lote a <strong className="text-slate-200 font-semibold">30 años</strong> · ≈ {tasaAnual.toFixed(1)} t CO₂/año
                    </div>
                  </div>

                  {/* SVG Curve Graph */}
                  <div className="w-full">
                    <svg className="w-full h-20 block overflow-visible" viewBox="0 0 300 92" preserveAspectRatio="none">
                      <path d={fillSvgPath} fill="rgba(52,211,153,0.13)" />
                      <path d={dSvgPath} fill="none" stroke="#34d399" strokeWidth="2" />
                      {[10, 20, 30].map((y) => {
                        const x = PAD + (y / 30) * (W - 2 * PAD);
                        const yy = H - PAD - (co2Lote(selectedLoteData.area, y) / maxV) * (H - 2 * PAD - 14);
                        return (
                          <circle key={y} cx={x.toFixed(1)} cy={yy.toFixed(1)} r="3" fill="#34d399" stroke="#04120c" strokeWidth="1.2" />
                        );
                      })}
                    </svg>
                    <div className="flex justify-between font-mono text-[9px] text-slate-500 mt-1 px-1">
                      <span>0</span>
                      <span>10 años</span>
                      <span>20 años</span>
                      <span>30 años</span>
                    </div>
                  </div>

                  {/* 10, 20, 30 Year Projections Rows */}
                  <div className="pt-2 border-t border-white/10 space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Año 10</span>
                      <b className="text-emerald-400 font-bold">{Math.round(t10).toLocaleString('es-CO')} t CO₂</b>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Año 20</span>
                      <b className="text-emerald-400 font-bold">{Math.round(t20).toLocaleString('es-CO')} t CO₂</b>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-200 font-semibold">Año 30</span>
                      <b className="text-emerald-300 font-bold">{Math.round(t30).toLocaleString('es-CO')} t CO₂</b>
                    </div>
                  </div>

                  {/* Automobile Equivalent Badge */}
                  <div className="mt-3 text-xs text-center text-slate-300 bg-blue-500/10 border border-blue-500/30 rounded-xl py-2 px-3">
                    ≈ las emisiones anuales de <b className="text-blue-300 font-bold">{autos.toLocaleString('es-CO')}</b> automóviles
                  </div>

                  {/* IPCC Methodology Source Note */}
                  <div className="mt-3 text-[9.8px] text-slate-500 leading-relaxed">
                    Metodología IPCC Tier 1–2 (Guías 2006 / Refinamiento 2019, T4.9): 4,4 t d.m./ha/año aéreo, bosque secundario montano tropical de América · raíz:piso 0,27 · CF 0,47 · CO₂=C×44/12. Tasas contrastadas con Cook-Patton et al. (2020, <em>Nature</em>) para regeneración natural en Colombia. Estimación de potencial, no crédito certificado.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: BUSCADOR DE INDIVIDUOS */}
            {activeTab === 'trees' && (
              <div className="space-y-3 overflow-y-auto max-h-[570px] pr-1">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por ID, especie o nombre científico…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#020617] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <select
                    value={filterLote}
                    onChange={(e) => setFilterLote(e.target.value)}
                    className="bg-[#020617] border border-white/10 rounded-lg p-1.5 text-slate-300 focus:outline-none"
                  >
                    <option value="">Todos los lotes</option>
                    {LOTES.map((l) => (
                      <option key={l.n} value={l.n}>Lote {l.n}</option>
                    ))}
                  </select>

                  <select
                    value={filterUicn}
                    onChange={(e) => setFilterUicn(e.target.value)}
                    className="bg-[#020617] border border-white/10 rounded-lg p-1.5 text-slate-300 focus:outline-none"
                  >
                    <option value="">Toda categoría UICN</option>
                    <option value="EN">En peligro (EN)</option>
                    <option value="VU">Vulnerable (VU)</option>
                    <option value="LC">Preocupación menor (LC)</option>
                    <option value="NE">No evaluada (NE)</option>
                  </select>
                </div>

                <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 pt-1 border-t border-white/5">
                  <span>Resultados: <b className="text-emerald-400">{filteredTrees.length.toLocaleString('es-CO')}</b> individuos</span>
                  {(searchQuery || filterLote || filterUicn) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilterLote('');
                        setFilterUicn('');
                      }}
                      className="text-xs text-rose-400 hover:underline cursor-pointer"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>

                {/* Tree List */}
                <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                  {filteredTrees.slice(0, 60).map((t) => (
                    <div
                      key={t.id}
                      onClick={() => goTree(t)}
                      className="p-2 bg-[#020617]/80 hover:bg-emerald-950/20 border border-white/5 hover:border-emerald-500/40 rounded-xl transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: UICN_COL[t.uicn] }} />
                          <span className="text-xs font-mono font-bold text-white">{t.id}</span>
                          <span className="text-[10px] text-slate-400 font-mono">Lote {t.lote}</span>
                        </div>
                        <p className="text-xs text-slate-300 font-semibold mt-0.5">{t.sp} <span className="text-[10px] text-slate-400 italic">({t.sci})</span></p>
                      </div>
                      <div className="text-right text-[10px] font-mono text-slate-400">
                        <p>DAP <b className="text-white">{t.dap}</b> cm</p>
                        <p>Alt <b className="text-white">{t.alt}</b> m</p>
                      </div>
                    </div>
                  ))}

                  {filteredTrees.length > 60 && (
                    <p className="text-[10px] text-center text-slate-500 font-mono py-2">
                      Mostrando 60 de {filteredTrees.length.toLocaleString('es-CO')} resultados — refina la búsqueda.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Dasometric Technical Sheet Modal */}
      {modalTree && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setModalTree(null)}
        >
          <div
            className="bg-[#0b1329] border border-white/10 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl animate-fadeIn text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Photo Header */}
            <div
              className="h-48 bg-cover bg-center relative"
              style={{ backgroundImage: `url('${getFotoArbol(modalTree.sp, modalTree.id)}')` }}
            >
              <button
                onClick={() => setModalTree(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center font-bold hover:bg-rose-600 transition-all cursor-pointer"
              >
                ✕
              </button>
              <span className="absolute top-3 left-3 text-[10px] font-mono font-bold text-emerald-300 bg-[#060a15]/90 border border-emerald-500/40 px-3 py-1 rounded-full">
                {fotoEtiqueta(modalTree.sp)} · VILLAMARÍA 2026
              </span>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  INDIVIDUO {modalTree.id} · PREDIO {LOTES[modalTree.lote - 1]?.predio.toUpperCase()}
                </span>
                <h3 className="text-2xl font-black text-white mt-0.5">{modalTree.sp}</h3>
                <p className="text-xs text-slate-400 italic">{modalTree.sci} — {modalTree.tipo === 'noble' ? 'Árbol noble de dosel' : 'Arbusto / especie pionera'}</p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-md font-bold" style={{ backgroundColor: `${UICN_COL[modalTree.uicn]}20`, color: UICN_COL[modalTree.uicn], border: `1px solid ${UICN_COL[modalTree.uicn]}50` }}>
                  UICN · {UICN_NOM[modalTree.uicn]} ({modalTree.uicn})
                </span>
                <span className="px-2.5 py-1 rounded-md font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  ORIGEN NATIVO
                </span>
                <span className="px-2.5 py-1 rounded-md font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {modalTree.reg.toUpperCase()}
                </span>
              </div>

              {/* Dasometric Grid */}
              <div className="border-t border-b border-white/10 py-3">
                <p className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider mb-2">Variables Dasométricas</p>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-[#020617] p-3 rounded-xl border border-white/5">
                  <div>
                    <span className="text-slate-400 text-[10px]">DAP</span>
                    <p className="font-bold text-white text-sm">{modalTree.dap} cm</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Altura total</span>
                    <p className="font-bold text-white text-sm">{modalTree.alt} m</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Altura com.</span>
                    <p className="font-bold text-white text-sm">{modalTree.altc} m</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Diámetro copa</span>
                    <p className="font-bold text-white text-sm">{modalTree.copa} m</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Vol. estimado</span>
                    <p className="font-bold text-emerald-400 text-sm">{(Math.PI * Math.pow(modalTree.dap / 200, 2) * modalTree.altc * 0.5).toFixed(3)} m³</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Fitosanitario</span>
                    <p className="font-bold text-sm" style={{ color: modalTree.fito === 'Bueno' ? '#34d399' : modalTree.fito === 'Regular' ? '#fbbf24' : '#f87171' }}>
                      {modalTree.fito}
                    </p>
                  </div>
                </div>
              </div>

              {/* Field & Legal Info */}
              <div className="text-xs text-slate-400 leading-relaxed font-mono space-y-1">
                <p><b className="text-slate-200">Ubicación:</b> Lote {modalTree.lote} ({modalTree.lat.toFixed(5)}, {modalTree.lng.toFixed(5)})</p>
                <p><b className="text-slate-200">Fecha de registro:</b> {modalTree.fecha}</p>
                <p><b className="text-slate-200">Contrato:</b> SGR-SC-001-2025 · Cuenca Qda. Chupaderos (Villamaría, Caldas)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
