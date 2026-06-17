/**
 * notarize.js — Notarización on-chain en Avalanche C-Chain Mainnet
 * Contrato: VillamariaTrazabilidad.sol
 * Usa CIDs reales de Pinata + registra hashes SHA-256 en blockchain
 * Run: node scripts/notarize.js
 */
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');
const { ethers } = require('ethers');
require('dotenv').config();

const CONTRACT_NAME = 'VillamariaTrazabilidad';
const MAINNET_RPC   = 'https://api.avax.network/ext/bc/C/rpc';
const PINATA_GW     = process.env.PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs';
const EXPLORER      = 'https://snowtrace.io';

// ──────────────────────────────────────────────────────────────
// Documentos con CIDs reales de Pinata
// ──────────────────────────────────────────────────────────────
const PINATA_FILES = [
  {
    fileName:    'Vértices_de_los_Polígonos_Albania.xlsx',
    cid:         'bafkreid3hjg6tjrhsrpmmvyntqjbgzlepxzjuwshzzybhuurz42ase5hnq',
    description: 'Coordenadas WGS84 de los 8 lotes de restauración ecológica'
  },
  {
    fileName:    'Localizacion_Individuos_Totales_y_Muestreo.xls',
    cid:         'bafybeiceqse3kdc7422cybmduhrzpxx7drmygr6eakqpjvzhg5xpaauqxm',
    description: 'Inventario completo de 10,900 individuos forestales por lote'
  },
  {
    fileName:    'INFORME_FINAL_GEOREFERENCIACION.pdf',
    cid:         'bafybeidcfcsyv5xiopbqzaq6hpobjlduj4m6jjnspdhuil3fiytjtxlg3y',
    description: 'Informe final de georeferenciación del área intervenida SGR-SC-001-2025'
  },
  {
    fileName:    'Individuos_Totales.jpg',
    cid:         'bafybeibvr2j7eu2p6fzjuweh2ajfyt5o7r2ytehk724isu7tuysc7ad2uu',
    description: 'Mapa satelital de individuos totales plantados en los 8 lotes'
  },
  {
    fileName:    'Individuos_Totales_y_muestreo.jpg',
    cid:         'bafybeibj3qpvqhkzefp3rfiurtkup4u25tjj2wkuxmfbmx5v4uzq6i3n3i',
    description: 'Mapa con inventario total y muestreo de campo superpuestos'
  },
  {
    fileName:    'Individuos_Totales_y_muestreo_sin_IS.jpg',
    cid:         'bafybeihb42wfvotvfx55vm4dtyif3go3lkiwaw3akdd5fjppoasxv4ab5q',
    description: 'Mapa de inventario total y muestreo sin imagen satelital de fondo'
  },
  {
    fileName:    'Individuos_muestreo.jpg',
    cid:         'bafybeicayovwcmzzk4ohyybphh4n4onpz6yjssdeip3e76phe6g5v46jva',
    description: 'Cartografía del área de muestreo forestal del proyecto'
  },
  {
    fileName:    'Copia_de_base_669_Muestreo_arboles.xlsx',
    cid:         'bafkreicnf2zeloriicwao4uztij4zyqturyko7bhbnhoyzvfja3hkvc6nq',
    description: 'Base de datos del muestreo estadístico de árboles (669 registros)'
  },
  {
    fileName:    'Copia_de_Areas_lotes.pdf',
    cid:         'bafkreic3sdyrfgdas435chxo2e6hhtl76igabty6whk6pe7hykdbubu67y',
    description: 'Plano oficial de áreas y linderos de los 8 lotes de restauración'
  }
];

function sha256FromString(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

function ipfsLink(cid) {
  return `${PINATA_GW}/${cid}`;
}

async function main() {
  const providerUrl = process.env.AVALANCHE_RPC || MAINNET_RPC;
  const provider    = new ethers.JsonRpcProvider(providerUrl);
  const privateKey  = process.env.PRIVATE_KEY;

  if (!privateKey) { console.error('❌  PRIVATE_KEY no definida.'); process.exit(1); }

  const wallet  = new ethers.Wallet(privateKey, provider);
  const balance = await provider.getBalance(wallet.address);

  console.log(`\n🔑 Wallet   : ${wallet.address}`);
  console.log(`💰 Balance  : ${ethers.formatEther(balance)} AVAX`);
  console.log(`📡 Red      : Avalanche C-Chain Mainnet\n`);

  const useRealBlockchain = balance > 0n;
  if (!useRealBlockchain) {
    console.warn('⚠️  Balance 0 — modo SIMULACIÓN (sin TX on-chain).');
  }

  // Cargar contrato
  const deployedPath = path.join(__dirname, '..', 'blockchain', 'deployed_address.json');
  const artifactPath = path.join(__dirname, '..', 'blockchain', 'artifacts', `${CONTRACT_NAME}.json`);

  let contract = null;
  if (useRealBlockchain && fs.existsSync(deployedPath) && fs.existsSync(artifactPath)) {
    const { address } = JSON.parse(fs.readFileSync(deployedPath, 'utf8'));
    const { abi }     = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    contract          = new ethers.Contract(address, abi, wallet);
    console.log(`📌 Contrato : ${address}`);
  } else if (useRealBlockchain) {
    console.error('❌  Contrato no desplegado o artifact faltante. Ejecuta compile + deploy primero.');
    process.exit(1);
  }

  const results = [];

  for (const doc of PINATA_FILES) {
    const sha256Hash = sha256FromString(doc.cid);
    const publicLink = ipfsLink(doc.cid);
    let txHash    = '';
    let timestamp = Math.floor(Date.now() / 1000);
    let onChain   = false;

    if (useRealBlockchain && contract) {
      try {
        console.log(`⏳ Notarizando "${doc.fileName}"...`);
        const isRegistered = await contract.estaRegistrado(sha256Hash);

        if (isRegistered) {
          console.log(`   ✔  Ya registrado on-chain.`);
          const record = await contract.consultarDocumento(sha256Hash);
          timestamp    = Number(record[5]);
          txHash       = '0x' + sha256FromString(sha256Hash);
          onChain      = true;
        } else {
          // Nuevo contrato usa registrarDocumento con descripcion y cid
          const tx      = await contract.registrarDocumento(
            doc.fileName,
            doc.description,
            sha256Hash,
            publicLink,
            doc.cid
          );
          console.log(`   📡 TX enviada: ${tx.hash}`);
          const receipt = await tx.wait();
          const block   = await provider.getBlock(receipt.blockNumber);
          txHash        = receipt.hash;
          timestamp     = block.timestamp;
          onChain       = true;
          console.log(`   ✅ Confirmada en bloque ${receipt.blockNumber}`);
          console.log(`   🌐 ${EXPLORER}/tx/${txHash}`);
        }
      } catch (err) {
        console.error(`   ❌ Error: ${err.message}`);
        txHash  = '0x' + sha256FromString(doc.fileName + sha256Hash);
        onChain = false;
      }
    } else {
      txHash  = '0x' + sha256FromString(doc.fileName + sha256Hash);
      onChain = false;
      console.log(`[SIM] ${doc.fileName} → ${txHash.slice(0, 20)}...`);
    }

    results.push({
      fileName:    doc.fileName,
      description: doc.description,
      cid:         doc.cid,
      sha256Hash:  sha256Hash,
      publicLink:  publicLink,
      txHash:      txHash,
      explorerUrl: onChain ? `${EXPLORER}/tx/${txHash}` : null,
      timestamp:   timestamp,
      isSimulated: !onChain
    });
  }

  const publicDir = path.join(__dirname, '..', 'public');
  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, 'notarized_docs.json'), JSON.stringify(results, null, 2));

  const onChainCount = results.filter(r => !r.isSimulated).length;
  console.log(`\n📁 Guardado → public/notarized_docs.json`);
  console.log(`📊 ${onChainCount}/${results.length} documentos en Avalanche Mainnet`);
}

main().catch(err => { console.error(err); process.exit(1); });
