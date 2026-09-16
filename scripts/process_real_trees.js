const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const proj4 = require('proj4');

// MAGNA-SIRGAS Origen Nacional (EPSG:9377) -> WGS84 (EPSG:4326)
proj4.defs('EPSG:9377', '+proj=tmerc +lat_0=4 +lon_0=-73 +k=0.9992 +x_0=5000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');

let fichaBDPath = path.join(__dirname, '..', 'data', 'FICHA BASE DE DATOS arboles.xlsx');
if (!fs.existsSync(fichaBDPath)) {
  fichaBDPath = path.join(__dirname, '..', 'proyecto V2', 'FICHA BASE DE DATOS.xlsx');
}

console.log('Processing Excel from path:', fichaBDPath);
const wbFicha = XLSX.readFile(fichaBDPath);

let compactData = [];
let fichaTrees = [];
const speciesCounts = {};
const loteIntervencionCounts = {};

wbFicha.SheetNames.forEach((sheetName) => {
  const sheet = wbFicha.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
  // Sheet header is at row index 1 (0-indexed: line 2)
  for (let i = 2; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length < 7) continue;

    const idNum = parseInt(row[0]) || (i - 1);
    const lote = row[1] !== undefined ? parseInt(row[1]) : (parseInt(sheetName.replace(/\D/g, '')) || 1);
    const alt = parseFloat(row[2]) || 0;
    const dap = parseFloat(row[3]) || 0;
    const intervencion = row[4] ? String(row[4]).trim() : 'Siembra';
    const especie = row[5] ? String(row[5]).trim().toUpperCase() : 'ROBLE';
    const estado = row[6] ? String(row[6]).trim().toUpperCase() : 'BUENO';
    const pointX = parseFloat(row[7]);
    const pointY = parseFloat(row[8]);

    let lat = 0, lng = 0;
    if (pointX && pointY && pointX > 1000000 && pointY > 1000000) {
      const [gLng, gLat] = proj4('EPSG:9377', 'EPSG:4326', [pointX, pointY]);
      lat = parseFloat(gLat.toFixed(6));
      lng = parseFloat(gLng.toFixed(6));
    }

    compactData.push([
      idNum,
      lote,
      alt,
      dap,
      intervencion,
      especie,
      estado,
      lat,
      lng
    ]);

    fichaTrees.push({
      idNum,
      idStr: `VM-L${lote}-${String(idNum).padStart(4, '0')}`,
      lote,
      alt,
      dap,
      intervencion,
      especie,
      estado,
      pointX,
      pointY,
      lat,
      lng
    });

    if (especie) {
      speciesCounts[especie] = (speciesCounts[especie] || 0) + 1;
    }
    const loteKey = String(lote);
    if (!loteIntervencionCounts[loteKey]) {
      loteIntervencionCounts[loteKey] = { siembra: 0, mantenimiento: 0, total: 0 };
    }
    loteIntervencionCounts[loteKey].total++;
    const intervUpper = intervencion.toUpperCase();
    if (intervUpper.includes('SIEMBRA') || intervUpper === 'S') {
      loteIntervencionCounts[loteKey].siembra++;
    } else {
      loteIntervencionCounts[loteKey].mantenimiento++;
    }
  }
});

console.log(`Successfully parsed ${compactData.length} records from Excel`);

// Write public/inventario_compacto.json
fs.writeFileSync(
  path.join(__dirname, '..', 'public', 'inventario_compacto.json'),
  JSON.stringify(compactData)
);
console.log('Saved public/inventario_compacto.json');

// Write public/ficha_base_datos.json
fs.writeFileSync(
  path.join(__dirname, '..', 'public', 'ficha_base_datos.json'),
  JSON.stringify(fichaTrees)
);
console.log('Saved public/ficha_base_datos.json');

// Write public/inventario_summary.json
const nobleSpeciesList = ['ROBLE', 'CEDRO', 'PINO COLOMBIANO', 'CEDRO NEGRO', 'GUAYACAN', 'NOGAL', 'SAUCE', 'ALISO', 'ARRAYAN'];
const sortedSpecies = Object.entries(speciesCounts).sort((a, b) => b[1] - a[1]);
const summaryMeta = {
  totalIndividuos: compactData.length,
  speciesDistribution: sortedSpecies.map(([name, count]) => ({
    name: name.charAt(0) + name.slice(1).toLowerCase(),
    count,
    categoria: nobleSpeciesList.some(n => name.includes(n)) ? 'Árboles Nobles' : 'Arbustos / Polinizadores'
  })),
  lotes: loteIntervencionCounts
};

fs.writeFileSync(
  path.join(__dirname, '..', 'public', 'inventario_summary.json'),
  JSON.stringify(summaryMeta, null, 2)
);
console.log('Saved public/inventario_summary.json');
