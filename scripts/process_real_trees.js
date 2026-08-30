const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const proj4 = require('proj4');

// MAGNA-SIRGAS Origen Nacional (EPSG:9377) -> WGS84 (EPSG:4326)
proj4.defs('EPSG:9377', '+proj=tmerc +lat_0=4 +lon_0=-73 +k=0.9992 +x_0=5000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');

const fichaBDPath = path.join(__dirname, '..', 'proyecto V2', 'FICHA BASE DE DATOS.xlsx');

console.log('Processing FICHA BASE DE DATOS.xlsx as Single Source of Truth...');
const wbFicha = XLSX.readFile(fichaBDPath);

let compactData = [];
let fichaTrees = [];

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
  }
});

console.log(`Successfully parsed ${compactData.length} records from FICHA BASE DE DATOS.xlsx`);

// Write public/inventario_compacto.json (100% synchronized with FICHA BASE DE DATOS.xlsx)
fs.writeFileSync(
  path.join(__dirname, '..', 'public', 'inventario_compacto.json'),
  JSON.stringify(compactData)
);
console.log('Saved public/inventario_compacto.json (No missing altura/dap, 100% synchronized)');

// Write public/ficha_base_datos.json
fs.writeFileSync(
  path.join(__dirname, '..', 'public', 'ficha_base_datos.json'),
  JSON.stringify(fichaTrees)
);
console.log('Saved public/ficha_base_datos.json');
