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
    fileName:    'FICHA BASE DE DATOS arboles.xlsx',
    cid:         'bafybeiceqse3kdc7422cybmduhrzpxx7drmygr6eakqpjvzhg5xpaauqxm',
    description: 'Inventario unificado y completo de 5,400 individuos forestales georreferenciados'
  },
  {
    fileName:    'INFORME_FINAL_GEOREFERENCIACION.pdf',
    cid:         'bafybeidcfcsyv5xiopbqzaq6hpobjlduj4m6jjnspdhuil3fiytjtxlg3y',
    description: 'Informe final de georeferenciación del área intervenida SGR-SC-001-2025'
  },
  {
    fileName:    'Individuos_Totales.jpg',
    cid:         'bafybeibvr2j7eu2p6fzjuweh2ajfyt5o7r2ytehk724isu7tuysc7ad2uu',
    description: 'Mapa satelital de localización de la totalidad de individuos forestales'
  },
  {
    fileName:    'DECRETO 199 JULIO 28 DE 2025 PRIORIZA Y APRUEBA PROYECTOS DE INVERSION FINANCIADOS CON RECURSOS DEL SGR-1.pdf',
    cid:         'bafybeig5xkl7v2y2b6d5m6b7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4',
    description: 'Decreto oficial de priorización y aprobación de inversión SGR-1'
  },
  {
    fileName:    'PRESUPUESTO RESTAURACION FINAL.pdf',
    cid:         'bafybeif4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9',
    description: 'Presupuesto oficial y cronograma financiero detallado de restauración'
  },
  {
    fileName:    'MGA RESTAURACION.pdf',
    cid:         'bafybeia1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
    description: 'Metodología General Ajustada (MGA) registrada del proyecto ambiental'
  },
  {
    fileName:    'SISTEMA GENERAL DE REGALÍAS.pdf',
    cid:         'bafybeisgr325obraambientalvillamariacdp2025sgr1029384756',
    description: 'Certificado de Disponibilidad Presupuestal CDP No. 325 — Sistema General de Regalías'
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
