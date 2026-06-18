# Master_Context: Proyecto SGR-SC-001-2025
**Villamaría, Caldas — Restauración Ecológica Blockchain**

---

## 1. Roadmap Fase 1
- [x] **Setup:** Repositorio `villamaria-restauracion-blockchain`
- [x] **Data:** Procesamiento XLS → JSON (10,900 individuos)
- [x] **IPFS:** 9 documentos subidos a Pinata (CIDs reales)
- [x] **Blockchain:** Contrato `DocumentNotary.sol` desplegado en Avalanche C-Chain Mainnet
- [x] **Notarización:** 9/9 documentos notarizados on-chain con TXID reales
- [x] **Web:** Landing Page (Next.js + Tailwind) — build exitoso
- [ ] **Deploy:** Vercel (pendiente login del usuario)

---

## 2. Decisiones Técnicas
| Decisión | Elección | Motivo |
|----------|----------|--------|
| Blockchain | Avalanche C-Chain Mainnet | Baja latencia, bajo costo gas, EVM-compatible |
| Frontend | Next.js 16 + Tailwind CSS v4 | SSG para velocidad máxima |
| IPFS | Pinata | Persistencia confiable, gateway HTTP estable |
| Hashing | SHA-256 (derivado del CID IPFS) | Determinístico, vinculado al contenido real |
| Notarización | Batch secuencial en un contrato | Mínimo gas, máxima auditabilidad |

---

## 3. Contratos y Direcciones — MAINNET

### Smart Contract: VillamariaTrazabilidad.sol
```
Red       : Avalanche C-Chain Mainnet (chainId 43114)
Dirección : 0x7e34e2e66838D0DA8e88cBC4200020a6bD9925F4
TX Deploy : 0x1c4586011963c5706d6b3086f4f8e931ff94b705281cadf3a2e0c953a6acb607
Snowtrace : https://snowtrace.io/address/0x7e34e2e66838D0DA8e88cBC4200020a6bD9925F4
```

### Wallet Operacional
```
Dirección : 0x721c7D56E1842ca2e414617A25264B17Eb30f7A4
```

---

## 4. Documentos Notarizados — IPFS + Avalanche Mainnet

| # | Archivo | CID Pinata | TX Hash | Bloque |
|---|---------|-----------|---------|--------|
| 1 | Vértices_de_los_Polígonos_Albania.xlsx | `bafkreid3hjg6...e5hnq` | `0x2a56ae...9e0` | 88191403 |
| 2 | Localizacion_Individuos_Totales_y_Muestreo.xls | `bafybeiceqse3...uqxm` | `0x3b6d40...77b` | 88191407 |
| 3 | INFORME_FINAL_GEOREFERENCIACION.pdf | `bafybeidcfcsy...lg3y` | `0x0d38be...cd9` | 88191415 |
| 4 | Individuos_Totales.jpg | `bafybeibvr2j7...d2uu` | `0xfeb951...cdc` | 88191420 |
| 5 | Individuos_Totales_y_muestreo.jpg | `bafybeibj3qpv...n3i` | `0x0413c7...31e` | 88191425 |
| 6 | Individuos_Totales_y_muestreo_sin_IS.jpg | `bafybeihb42wf...ab5q` | `0x5701f9...9fe` | 88191429 |
| 7 | Individuos_muestreo.jpg | `bafybeicayovc...46jva` | `0x6a84d1...ce0` | 88191437 |
| 8 | Copia_de_base_669_Muestreo_arboles.xlsx | `bafkreicnf2ze...c6nq` | `0x3d405d...d9e` | 88191445 |
| 9 | Copia_de_Areas_lotes.pdf | `bafkreic3sdyr...bu67y` | `0x73fc66...e0d` | 88191452 |


---

## 5. Arquitectura Web

### Páginas
| Ruta | Descripción |
|------|-------------|
| `/` | Home: Hero, ImpactCounter, Mapa Leaflet, BlockchainVerifier, SpeciesExplorer |
| `/inventario-tecnico` | Tabla paginada de 10,900 individuos con filtros |
| `/nuestra-fauna-y-flora` | Narrativa educativa de especies |

### Componentes Clave
| Componente | Función |
|-----------|---------|
| `BlockchainVerifier.tsx` | Verifica docs drag&drop SHA-256 vs Avalanche Mainnet |
| `LoteMap.tsx` | Mapa Leaflet con 8 lotes en polígonos esmeralda |
| `ImpactCounter.tsx` | Animación de contadores (10,900 individuos, 8 lotes, etc.) |
| `SpeciesExplorer.tsx` | Grid de especies con popup de detalle |
| `ForestStats.tsx` | Donut SVG + barras de distribución de especies |

### Paleta de Colores
```
Primario  : Emerald #10b981 / #34d399 (ecológico)
Secundario: Steel Blue #3b82f6 (blockchain/tecnología)
Fondo     : Deep Slate #020617
Iconos    : SVG inline stroke (Lucide-style, NO emojis)
```

---

## 6. Variables de Entorno (.env) — NO commitear

```
PRIVATE_KEY=0x...             # Wallet Avalanche Mainnet
AVALANCHE_RPC=https://api.avax.network/ext/bc/C/rpc
PINATA_API_KEY=996a58fd...
PINATA_API_SECRET=f45990a0...
PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs
```

---

## 7. Scripts Disponibles

```bash
npm run dev                # Servidor de desarrollo
npm run build              # Build de producción
node scripts/compile.js    # Compilar DocumentNotary.sol
node scripts/deploy.js     # Desplegar contrato a Mainnet
node scripts/notarize.js   # Notarizar 9 docs on-chain (ya ejecutado)
node scripts/process_inventario.js  # Procesar XLS → JSON
npx vercel --prod          # Deploy a Vercel (requiere login)
```

---

## 8. Log de Sesiones

### [15/06/2026] Sesión Final — Mainnet + IPFS + Vercel Prep
| Hito | Acción | Estado |
|------|--------|--------|
| `.env` | Actualizado a Mainnet RPC + wallet con AVAX | ✅ |
| `hardhat.config.js` | chainId 43114, RPC mainnet corregido | ✅ |
| `scripts/compile.js` | Compiló `DocumentNotary.sol` exitosamente | ✅ |
| `scripts/deploy.js` | Contrato desplegado en Mainnet | ✅ |
| `scripts/notarize.js` | 9/9 docs notarizados con CIDs Pinata reales | ✅ |
| `BlockchainVerifier.tsx` | Links actualizados a `snowtrace.io` (mainnet) + IPFS col | ✅ |
| `vercel.json` | Config de deploy con headers de seguridad | ✅ |
| `npm run build` | 6/6 páginas compiladas sin errores (50s) | ✅ |
| Deploy Vercel | Pendiente — ejecutar `npx vercel --prod` | ⏳ |

### Siguiente Paso Único
```bash
# En terminal, dentro del directorio del proyecto:
npx vercel login     # Autenticar cuenta Vercel
npx vercel --prod    # Deploy a producción → URL pública
```

---

## 9. Verificación de Integridad
- Cualquier usuario puede arrastrar un documento al `BlockchainVerifier`
- El navegador computa SHA-256 localmente (sin subir a servidor)
- Se contrasta contra `public/notarized_docs.json` (9 registros reales)
- Si coincide → muestra TXID real + enlace a `snowtrace.io` + enlace IPFS
- Inmutable y verificable permanentemente en Avalanche Mainnet

---

## 10. Estado del Contrato en Snowtrace

```
Verificado  : ✅ Pass - Verified (Routescan/Snowtrace)
Código fuente: https://snowtrace.io/address/0x7e34e2e66838D0DA8e88cBC4200020a6bD9925F4#code
Leer contrato: https://snowtrace.io/address/0x7e34e2e66838D0DA8e88cBC4200020a6bD9925F4#readContract
Compilador  : v0.8.20+commit.a1b79de6
EVM Version : shanghai
Optimizer   : Enabled (200 runs)
```

---

## 11. Log de Sesiones

### [15/06/2026 — Sesión QA2] Responsive, Hamburger, Verificación Contrato
| Hito | Acción | Estado |
|------|--------|--------|
| Header hamburger | Menú móvil animado con 3 barras → X, dropdown con links | ✅ |
| Responsive inventario | Vista mobile: cards apiladas en lugar de tabla horizontal | ✅ |
| Responsive blockchain | Tabla docs con vista mobile de cards con hash completo | ✅ |
| Contrato Snowtrace | `Pass - Verified` — código fuente y ABI públicos | ✅ |
| Badge Footer | Ahora enlaza directamente a Snowtrace con check verde | ✅ |
| Badge BlockchainVerifier | Card de estado verificado con links a código y contrato | ✅ |
| CSS | Animación `fadeIn` + `scroll-behavior: smooth` agregados | ✅ |

### [16/06/2026 — Sesión Certificación Visual e IPFS]
| Hito | Acción | Estado |
|------|--------|--------|
| IPFS Gateways | Modificado para abrir PDF e imágenes inline vía `ipfs.io` | ✅ |
| Modal Certificado | Componente `NotaryCertificateModal` con diseño institucional | ✅ |
| Integración Verifier | Botón "Certificado" en tabla, cards móviles y resultado de drag&drop | ✅ |
| Impresión Nativa | Soporte CSS `@media print` para exportación a PDF tamaño A4 | ✅ |
| Build exitoso | `npm run build` completado con éxito sin errores en TypeScript | ✅ |

### [17/06/2026 — Sesión Reorganización de Jerarquía y Redespliegue]
| Hito | Acción | Estado |
|------|--------|--------|
| Reorganización Smart Contract | Se reordenó `infoProyecto` para colocar a GM Holding (desarrollador) al final del tuple | ✅ |
| Redespliegue Mainnet | Contrato compilado y redesplegado en la dirección `0x7e34e2e66838D0DA8e88cBC4200020a6bD9925F4` | ✅ |
| Verificación de Código | Contrato verificado con éxito en Snowtrace/Routescan | ✅ |
| Re-notarización Completa | 9/9 documentos registrados en la nueva dirección con TXIDs actualizados | ✅ |
| Actualización Frontend | Modificados `NotaryCertificateModal.tsx`, `BlockchainVerifier.tsx` y `Footer.tsx` | ✅ |
| Validación Build | Build completo sin errores de TypeScript y estáticos | ✅ |

### [18/06/2026 — Ajuste de Área]
| Hito | Acción | Estado |
|------|--------|--------|
| Corrección de áreas | Modificación de Área Total Intervenida a 21.8 Ha y desglose por lotes según PDF oficial | ✅ |
| Validación Build | Build completo sin errores de TypeScript y estáticos | ✅ |

### Siguiente Paso
```bash
# En la terminal para desplegar a Vercel producción:
npx vercel login     # Iniciar sesión en Vercel
npx vercel --prod    # Lanzar deploy a producción
```


