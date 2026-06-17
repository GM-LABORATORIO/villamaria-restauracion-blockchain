/**
 * verify.js — Verifica el contrato VillamariaTrazabilidad en Snowtrace (Avalanche Mainnet)
 * Usa la API pública de Routescan (compatible con Etherscan API v2)
 * Run: node scripts/verify.js
 */
const fs   = require('fs');
const path = require('path');
require('dotenv').config();

const CONTRACT_NAME   = 'VillamariaTrazabilidad';
const COMPILER_VERSION = 'v0.8.20+commit.a1b79de6'; // solc 0.8.20
const OPTIMIZER_RUNS   = 200;

// Routescan API para Avalanche Mainnet (chainId 43114)
const API_URL = 'https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan/api';

async function main() {
  // 1. Cargar dirección del contrato
  const deployedPath = path.join(__dirname, '..', 'blockchain', 'deployed_address.json');
  if (!fs.existsSync(deployedPath)) {
    console.error('❌  No se encontró blockchain/deployed_address.json. Despliega primero.');
    process.exit(1);
  }

  const { address: contractAddress } = JSON.parse(fs.readFileSync(deployedPath, 'utf8'));
  console.log(`\n🔍 Verificando contrato: ${contractAddress}`);

  // 2. Leer código fuente
  const sourcePath = path.join(__dirname, '..', 'contracts', `${CONTRACT_NAME}.sol`);
  const sourceCode = fs.readFileSync(sourcePath, 'utf8');

  // 3. Preparar payload de verificación (Etherscan-compatible API)
  const params = new URLSearchParams({
    module:                   'contract',
    action:                   'verifysourcecode',
    contractaddress:          contractAddress,
    sourceCode:               sourceCode,
    codeformat:               'solidity-single-file',
    contractname:             CONTRACT_NAME,
    compilerversion:          COMPILER_VERSION,
    optimizationUsed:         '1',
    runs:                     String(OPTIMIZER_RUNS),
    evmversion:               'shanghai',
    licenseType:              '3', // MIT
    constructorArguements:    ''   // Sin args en constructor
  });

  // 4. Enviar solicitud de verificación
  console.log('📡 Enviando código fuente a Snowtrace/Routescan para verificación...');

  const response = await fetch(`${API_URL}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    params.toString()
  });

  const data = await response.json();
  console.log('\n📋 Respuesta del servidor:');
  console.log(JSON.stringify(data, null, 2));

  if (data.status === '1') {
    const guid = data.result;
    console.log(`\n✅ Solicitud enviada! GUID: ${guid}`);
    console.log('⏳ Verificando estado en 15 segundos...\n');

    await new Promise(r => setTimeout(r, 15000));

    // 5. Consultar estado de la verificación
    const statusRes = await fetch(
      `${API_URL}?module=contract&action=checkverifystatus&guid=${guid}`
    );
    const statusData = await statusRes.json();
    console.log('📋 Estado:');
    console.log(JSON.stringify(statusData, null, 2));

    if (statusData.result === 'Pass - Verified') {
      console.log('\n🎉 ¡CONTRATO VERIFICADO EXITOSAMENTE EN SNOWTRACE!');
      console.log(`🌐 Ver código fuente: https://snowtrace.io/address/${contractAddress}#code`);
      console.log(`📖 Leer funciones:    https://snowtrace.io/address/${contractAddress}#readContract`);
    } else {
      console.log('\n⏳ Verificación en proceso. Revisa manualmente en:');
      console.log(`   https://snowtrace.io/address/${contractAddress}#code`);
    }
  } else {
    console.error(`\n❌ Error en la solicitud: ${data.result}`);
    console.log('\n💡 Alternativa manual:');
    console.log('   1. Ve a https://snowtrace.io/address/' + contractAddress);
    console.log('   2. Clic en la pestaña "Contract"');
    console.log('   3. Clic en "Verify and Publish"');
    console.log('   4. Compiler: v0.8.20, Optimizer: Yes (200 runs), License: MIT');
    console.log('   5. Pega el contenido de contracts/VillamariaTrazabilidad.sol');
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  console.log('\n💡 Instrucciones de verificación manual en Snowtrace:');
  console.log('   https://snowtrace.io → busca la dirección del contrato → Contract → Verify and Publish');
});
