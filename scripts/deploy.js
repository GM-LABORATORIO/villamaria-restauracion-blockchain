/**
 * deploy.js — Despliega VillamariaTrazabilidad.sol en Avalanche C-Chain Mainnet
 * Run: node scripts/deploy.js
 */
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
require('dotenv').config();

const CONTRACT_NAME = 'VillamariaTrazabilidad';
const MAINNET_RPC   = 'https://api.avax.network/ext/bc/C/rpc';
const EXPLORER      = 'https://snowtrace.io';

async function main() {
  const providerUrl = process.env.AVALANCHE_RPC || MAINNET_RPC;
  const provider    = new ethers.JsonRpcProvider(providerUrl);
  const privateKey  = process.env.PRIVATE_KEY;

  if (!privateKey) { console.error('❌  PRIVATE_KEY no definida en .env'); process.exit(1); }

  const wallet  = new ethers.Wallet(privateKey, provider);
  const balance = await provider.getBalance(wallet.address);

  console.log(`\n🔑 Wallet     : ${wallet.address}`);
  console.log(`💰 Balance    : ${ethers.formatEther(balance)} AVAX`);

  if (balance === 0n) { console.error('❌  Sin AVAX. Recarga la wallet.'); process.exit(1); }

  const artifactPath = path.join(__dirname, '..', 'blockchain', 'artifacts', `${CONTRACT_NAME}.json`);
  if (!fs.existsSync(artifactPath)) {
    console.error(`❌  Artifact no encontrado. Ejecuta "node scripts/compile.js" primero.`);
    process.exit(1);
  }

  const { abi, bytecode } = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  console.log(`\n🚀 Desplegando ${CONTRACT_NAME} en Avalanche Mainnet...`);
  const factory  = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy();

  console.log('⏳ Esperando confirmación...');
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  const txHash          = contract.deploymentTransaction().hash;
  const network         = await provider.getNetwork();

  console.log(`\n✅ Contrato desplegado!`);
  console.log(`📌 Dirección    : ${contractAddress}`);
  console.log(`🔗 TX Hash      : ${txHash}`);
  console.log(`🌐 Snowtrace    : ${EXPLORER}/address/${contractAddress}`);
  console.log(`📡 Red          : chainId ${network.chainId}`);

  const deployedPath = path.join(__dirname, '..', 'blockchain', 'deployed_address.json');
  fs.writeFileSync(deployedPath, JSON.stringify({
    contractName: CONTRACT_NAME,
    address:      contractAddress,
    txHash:       txHash,
    network:      'Avalanche C-Chain Mainnet',
    chainId:      Number(network.chainId),
    deployedAt:   new Date().toISOString(),
    explorer:     `${EXPLORER}/address/${contractAddress}`,
    snowtrace:    `${EXPLORER}/address/${contractAddress}#code`
  }, null, 2));

  console.log(`\n📁 Guardado → blockchain/deployed_address.json`);
  console.log(`\n🔍 Siguiente paso: verificar en Snowtrace:`);
  console.log(`   node scripts/verify.js`);
}

main().catch(err => { console.error(err); process.exit(1); });
