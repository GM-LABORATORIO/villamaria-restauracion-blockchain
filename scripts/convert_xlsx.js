/**
 * convert_xlsx.js
 * Reads Vertices_de_los_Poligonos_Albania.xlsx (one sheet per lote),
 * converts MAGNA-SIRGAS Origen Único Nacional → WGS84 lat/lng,
 * and writes public/lotes.geojson for Leaflet.
 */
const XLSX = require('xlsx');
const proj4 = require('proj4');
const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────
// MAGNA-SIRGAS CTM12 / Origen Único Nacional
// EPSG:9377  (also referred to as EPSG:3116-like with national origin)
// ─────────────────────────────────────────────
const MAGNA_CTM12 =
  '+proj=tmerc +lat_0=4 +lon_0=-73 +k=0.9992 +x_0=5000000 +y_0=2000000 ' +
  '+ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';

const WGS84 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';

function magnetaToWGS84(x, y) {
  const [lng, lat] = proj4(MAGNA_CTM12, WGS84, [x, y]);
  return { lat, lng };
}

// ─────────────────────────────────────────────
// Helper: find first row that has X and Y data
// ─────────────────────────────────────────────
function findDataStartRow(sheet) {
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:C100');
  for (let r = range.s.r; r <= range.e.r; r++) {
    const colB = sheet[XLSX.utils.encode_cell({ r, c: 1 })];
    const colC = sheet[XLSX.utils.encode_cell({ r, c: 2 })];
    if (
      colB && colC &&
      typeof colB.v === 'number' && typeof colC.v === 'number' &&
      colB.v > 1_000_000 // distinguishes real coordinates from row numbers
    ) {
      return r;
    }
  }
  return -1;
}

function parseSheet(sheet, sheetName) {
  const startRow = findDataStartRow(sheet);
  if (startRow === -1) {
    console.warn(`  ⚠ Could not find numeric coordinate data in sheet "${sheetName}"`);
    return [];
  }

  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:C100');
  const coords = [];

  for (let r = startRow; r <= range.e.r; r++) {
    const xCell = sheet[XLSX.utils.encode_cell({ r, c: 1 })]; // Column B = X
    const yCell = sheet[XLSX.utils.encode_cell({ r, c: 2 })]; // Column C = Y
    if (!xCell || !yCell) continue;

    const x = typeof xCell.v === 'number' ? xCell.v : parseFloat(String(xCell.v).replace(',', '.'));
    const y = typeof yCell.v === 'number' ? yCell.v : parseFloat(String(yCell.v).replace(',', '.'));

    if (isNaN(x) || isNaN(y) || x < 1_000_000) continue; // skip headers/junk rows

    const wgs = magnetaToWGS84(x, y);
    coords.push([wgs.lng, wgs.lat]); // GeoJSON order: [lng, lat]
  }

  return coords;
}

// ─────────────────────────────────────────────
// Lote metadata (from project documents)
// ─────────────────────────────────────────────
const LOTE_META = {
  '1': { siembra: 245,  mantenimiento: 200  },
  '2': { siembra: 650,  mantenimiento: 370  },
  '3': { siembra: 450,  mantenimiento: 280  },
  '4': { siembra: 990,  mantenimiento: 1365 },
  '5': { siembra: 200,  mantenimiento: 260  },
  '6': { siembra: 415,  mantenimiento: 105  },
  '7': { siembra: 950,  mantenimiento: 1370 },
  '8': { siembra: 1500, mantenimiento: 1550 },
};

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────
const xlsxPath = path.join(__dirname, '..', 'data', 'Vertices_de_los_Poligonos_Albania.xlsx');

if (!fs.existsSync(xlsxPath)) {
  console.error('❌ File not found:', xlsxPath);
  process.exit(1);
}

console.log('📂 Reading:', xlsxPath);
const workbook = XLSX.readFile(xlsxPath);
const { SheetNames } = workbook;

console.log(`   Found ${SheetNames.length} sheets: ${SheetNames.join(', ')}`);

const geojson = {
  type: 'FeatureCollection',
  features: []
};

SheetNames.forEach((name, idx) => {
  const sheet = workbook.Sheets[name];
  const coords = parseSheet(sheet, name);

  if (coords.length === 0) {
    console.warn(`  ⚠ Sheet "${name}" – no coordinates extracted, skipping.`);
    return;
  }

  // Close the polygon if not already closed
  const first = coords[0];
  const last  = coords[coords.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    coords.push([...first]);
  }

  // Extract lote number from sheet name (e.g. "Lote 1", "LOTE1", "1", etc.)
  const numMatch = name.match(/\d+/);
  const loteNum  = numMatch ? numMatch[0] : String(idx + 1);
  const meta     = LOTE_META[loteNum] || { siembra: 0, mantenimiento: 0 };

  geojson.features.push({
    type: 'Feature',
    properties: {
      lote: parseInt(loteNum, 10),
      nombre: `Lote ${loteNum}`,
      hoja: name,
      siembra: meta.siembra,
      mantenimiento: meta.mantenimiento,
      total: meta.siembra + meta.mantenimiento
    },
    geometry: {
      type: 'Polygon',
      coordinates: [coords]
    }
  });

  console.log(`  ✅ Lote ${loteNum} (sheet "${name}") – ${coords.length - 1} vértices convertidos`);
});

// Sort by lote number
geojson.features.sort((a, b) => a.properties.lote - b.properties.lote);

const outputPath = path.join(__dirname, '..', 'public', 'lotes.geojson');
fs.writeFileSync(outputPath, JSON.stringify(geojson, null, 2));
console.log(`\n🗺  GeoJSON guardado en: public/lotes.geojson`);
console.log(`   Total de lotes: ${geojson.features.length}`);
