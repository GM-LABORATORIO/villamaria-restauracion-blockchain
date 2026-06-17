/**
 * compile.js — Compila VillamariaTrazabilidad.sol con solc
 * Genera ABI + bytecode en blockchain/artifacts/
 */
const fs   = require('fs');
const path = require('path');
const solc  = require('solc');

const CONTRACT_NAME = 'VillamariaTrazabilidad';
const contractPath  = path.join(__dirname, '..', 'contracts', `${CONTRACT_NAME}.sol`);
const source        = fs.readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: { [`${CONTRACT_NAME}.sol`]: { content: source } },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    outputSelection: { '*': { '*': ['*'] } }
  }
};

console.log(`\n⚙️  Compilando ${CONTRACT_NAME}.sol...`);
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  output.errors.forEach(err => {
    if (err.severity === 'error') {
      console.error('❌', err.formattedMessage);
    } else {
      console.warn('⚠️ ', err.formattedMessage);
    }
  });
  if (output.errors.some(e => e.severity === 'error')) process.exit(1);
}

const contract   = output.contracts[`${CONTRACT_NAME}.sol`][CONTRACT_NAME];
const artifactsDir = path.join(__dirname, '..', 'blockchain', 'artifacts');
fs.mkdirSync(artifactsDir, { recursive: true });

const artifactPath = path.join(artifactsDir, `${CONTRACT_NAME}.json`);
fs.writeFileSync(artifactPath, JSON.stringify({
  contractName: CONTRACT_NAME,
  abi:          contract.abi,
  bytecode:     contract.evm.bytecode.object
}, null, 2));

// Also save ABI separately for verification
fs.writeFileSync(
  path.join(artifactsDir, `${CONTRACT_NAME}.abi.json`),
  JSON.stringify(contract.abi, null, 2)
);

console.log(`✅ Compilación exitosa → blockchain/artifacts/${CONTRACT_NAME}.json`);
console.log(`✅ ABI exportada → blockchain/artifacts/${CONTRACT_NAME}.abi.json`);
