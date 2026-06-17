const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const xlsxPath = path.join(__dirname, '..', 'data', 'Localizacion_Individuos_Totales_y_Muestreo_08_06_26.xls');
console.log('Reading file:', xlsxPath);
const workbook = XLSX.readFile(xlsxPath);
const sheet = workbook.Sheets['Hoja1'];
const data = XLSX.utils.sheet_to_json(sheet);

console.log('Total rows parsed:', data.length);

// 1. Analyze species
const speciesCounts = {};
const statusCounts = {};
const loteCounts = {};
const loteIntervencionCounts = {};

const cleanVal = (val) => String(val || '').trim().toUpperCase();

data.forEach((row, index) => {
  const specie = cleanVal(row['ESPECIE']);
  const status = cleanVal(row['Estado']);
  const lote = row['Lote'] ? String(row['Lote']).trim() : 'Sin Lote';
  const intervencion = cleanVal(row['Intervenci']);

  if (specie) {
    speciesCounts[specie] = (speciesCounts[specie] || 0) + 1;
  }
  if (status) {
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  }
  if (lote) {
    loteCounts[lote] = (loteCounts[lote] || 0) + 1;
    if (!loteIntervencionCounts[lote]) {
      loteIntervencionCounts[lote] = { siembra: 0, mantenimiento: 0, total: 0 };
    }
    loteIntervencionCounts[lote].total++;
    if (intervencion.includes('SIEMBRA') || intervencion === 'S') {
      loteIntervencionCounts[lote].siembra++;
    } else if (intervencion.includes('MANTENIMIENTO') || intervencion === 'M') {
      loteIntervencionCounts[lote].mantenimiento++;
    } else {
      // Default to split or classification based on data
      loteIntervencionCounts[lote].mantenimiento++;
    }
  }
});

console.log('\nTop Species:');
const sortedSpecies = Object.entries(speciesCounts).sort((a, b) => b[1] - a[1]);
sortedSpecies.slice(0, 15).forEach(([name, count]) => {
  console.log(`- ${name}: ${count}`);
});

console.log('\nStates:');
console.log(statusCounts);

console.log('\nLote counts:');
console.log(loteCounts);

console.log('\nLote intervention breakdown:');
console.log(loteIntervencionCounts);

// Classification: Árboles nobles vs. Arbustos polinizadores (or other classification mentioned in qa 1.md)
// Especies clave: Nigüito, Pino Colombiano, Roble, Cedro, Mano de Oso
// Let's identify families or categorize them.
// "Árboles Nobles" usually include: ROBLE, CEDRO, PINO COLOMBIANO, etc.
// "Arbustos/Polinizadores/Pioneros" include: NIGUITO, MANO DE OSO, ARBOLOCO, ENCENILLO, etc.
const nobleSpeciesList = ['ROBLE', 'CEDRO', 'PINO COLOMBIANO', 'CEDRO NEGRO', 'GUAYACAN', 'NOGAL', 'SAUCE', 'ALISO', 'ARRAYAN'];
const pollinatorSpeciesList = ['NIGUITO', 'MANO DE OSO', 'ARBOLOCO', 'ENCENILLO', 'NISPERO', 'CHILCO', 'TIBAR', 'SIETE CUEROS', 'CORDONCILLO'];

let nobleCount = 0;
let pollinatorCount = 0;
let otherCount = 0;

sortedSpecies.forEach(([name, count]) => {
  if (nobleSpeciesList.some(n => name.includes(n))) {
    nobleCount += count;
  } else if (pollinatorSpeciesList.some(p => name.includes(p))) {
    pollinatorCount += count;
  } else {
    // We can distribute based on name or classify remainder as pollinator/native shrubs
    otherCount += count;
  }
});

console.log(`\nNoble trees: ${nobleCount}, Pollinators/Pioneers: ${pollinatorCount}, Others: ${otherCount}`);

// Let's save a compact JSON version of the full inventory for the subpage
// Columns: [Individuo, Lote, Altura, Dap, Intervencion, Especie, Estado]
// To save space, we can map columns to a lightweight format
const compactInventory = data.map(row => [
  row['Individuo'] || 0,
  row['Lote'] || 0,
  row['Altura'] || 0,
  row['Diamtro_de'] || 0,
  row['Intervenci'] ? String(row['Intervenci']).trim() : '',
  row['ESPECIE'] ? String(row['ESPECIE']).trim() : '',
  row['Estado'] ? String(row['Estado']).trim() : '',
]);

fs.writeFileSync(
  path.join(__dirname, '..', 'public', 'inventario_compacto.json'),
  JSON.stringify(compactInventory)
);
console.log('\nSaved public/inventario_compacto.json');

// Let's also save the summary metadata
const summaryMeta = {
  totalIndividuos: data.length,
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
