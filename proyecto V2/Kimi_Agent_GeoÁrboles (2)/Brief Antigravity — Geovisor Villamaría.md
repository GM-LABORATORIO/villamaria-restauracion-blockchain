# Brief de Implementación — Antigravity
## Sitio web y geovisor del proyecto de restauración ecológica de Villamaría (Caldas, Colombia)

> **Instrucción para Antigravity:** implementar la página web y el geovisor del proyecto con el diseño actual que ya está en producción, realizando mejoras inspiradas en la página de referencia https://renata.edu.co/, pero conectadas al contenido real de Villamaría. Este documento es la única fuente de verdad: contiene la contextualización completa, la especificación de diseño, las mejoras requeridas y la especificación técnica íntegra (datos, polígonos, parámetros, enlaces).

---

# PARTE A — BRIEF DE PRODUCTO Y DISEÑO

## A1. Contextualización del proyecto

- **Proyecto:** Restauración ecológica de la cuenca de la Quebrada Chupaderos, municipio de Villamaría (Caldas, Colombia).
- **Contrato:** SGR-SC-001-2025 con la Alcaldía de Villamaría (Sistema General de Regalías).
- **Ejecutor:** MASPROGRESO — Empresa de Desarrollo Territorial.
- **Aliados institucionales:** Corpocaldas (autoridad ambiental regional) y DNP · SGR (Departamento Nacional de Planeación · Sistema General de Regalías).
- **Objeto:** proteger la cuenca de la Quebrada Chupaderos mediante la plantación y mantenimiento de árboles nativos.

### Cifras oficiales del proyecto (usar siempre estos números)
| Cifra | Valor |
|---|---|
| Predios | 3 (La Albania, La Carpeta, La Carpetica) |
| Lotes | 8 (polígonos reales georreferenciados) |
| Área total | 21,8 hectáreas |
| Árboles plantados | 10.900 |
| Especies nativas | 12 |
| Fecha de registro de individuos | Marzo de 2026 |
| Trazabilidad | Documentos y georreferenciación notarizados en blockchain (Avalanche, verificable en Snowtrace) |

- **Ubicación:** los 8 lotes están aproximadamente en 4.966° N, −75.473° W (zona rural de Villamaría, vertiente occidental de la Cordillera Central).
- **Sitio actual en producción:** https://villamaria-restauracion.vercel.app/ — la nueva implementación debe mantener continuidad con este sitio y enlazar sus secciones profundas (Inventario Técnico, Biodiversidad, Informe PDF).

## A2. Estado actual del sitio (lo que YA existe y debe conservarse)

El sitio actual es una sola página oscura (tema nocturno) con estas secciones, en este orden:

1. **Barra de navegación fija (92 px)** con el logotipo real de MASPROGRESO (tarjeta blanca redondeada de 64×64 px) y, a la derecha, los logos de Corpocaldas (54 px de alto) y DNP·SGR (45 px) sobre píldoras blancas translúcidas (`rgba(255,255,255,.93)`) con brillo suave. Los tres logos tienen **zoom al pasar el mouse**: `transform: scale(1.15)` con sombra intensificada, transición de .25 s. **No animar los logos de otra forma** (sin flotación ni movimiento constante: el cliente lo rechazó explícitamente).
2. **Hero clásico centrado** (no en mosaico, sin video): título grande, subtítulo, botones de llamada a la acción y **3 tarjetas de estadísticas** en cuadrícula de 3 columnas (área, árboles, especies).
3. **Geovisor interactivo** (Leaflet 1.9.4): mapa satelital (Esri World Imagery) con opción OSM, los 8 polígonos reales de los lotes, y **10.900 marcadores agrupados** (leaflet.markercluster) que representan cada árbol. Incluye un **control de deforestación** (botón rojo, esquina superior derecha del mapa) que activa la capa de pérdida de cobertura arbórea 2001–2024 (Hansen/UMD vía Global Forest Watch) y una nota con enlace al Sistema de Monitoreo de Bosques del IDEAM.
4. **Inventario técnico**: buscador y tabla/fichas de árboles. Cada individuo tiene **ficha dasométrica completa** con fotografía de su especie, fecha de registro (marzo 2026), DAP (Diámetro a la Altura del Pecho, 1,30 m), altura total, altura comercial, copa, estado fitosanitario, lote y coordenadas.
5. **Biodiversidad**: catálogo de las 12 especies nativas con su categoría UICN.
6. **Carbono**: modelo de captura de CO₂ (IPCC Tier 1–2) con gráfico de curva de acumulación a 30 años (Chart.js) y equivalencias (p. ej. carros sacados de circulación).
7. **Auditoría blockchain**: tabla de 9 documentos notarizados con hash SHA-256, enlace de descarga (IPFS/Pinata) y enlace a la transacción en Snowtrace.
8. **Botón "Informe PDF"** en la barra de navegación que descarga la certificación de Corpocaldas e informe final de georreferenciación.

## A3. Mejoras inspiradas en RENATA (https://renata.edu.co/) traducidas a Villamaría

RENATA es la red académica de Colombia; su sitio comunica infraestructura técnica con narrativa institucional. Adaptar sus patrones así (todos los datos deben ser los reales de Villamaría, nunca inventar cifras):

1. **Narrativa institucional en el hero.** RENATA abre con una frase-misión ("Conectamos a Colombia con el conocimiento"). Reescribir el hero de Villamaría con una frase-misión equivalente, p. ej.: *"Restauramos la cuenca de la Quebrada Chupaderos: 10.900 árboles nativos protegiendo el agua de Villamaría"*. Mantener el hero clásico centrado actual (no cambiar a mosaico, no agregar video).

2. **"Líneas del proyecto" numeradas (01–04).** RENATA presenta sus líneas de servicio como un acordeón numerado. Crear una sección análoga con las líneas del proyecto, por ejemplo:
   - **01 · Restauración activa** — 10.900 árboles de 12 especies nativas en 8 lotes.
   - **02 · Monitoreo dasométrico** — DAP, altura, copa y estado fitosanitario por individuo.
   - **03 · Captura de carbono** — modelo IPCC con curva de acumulación a 30 años.
   - **04 · Trazabilidad blockchain** — 9 documentos notarizados en Avalanche.
   Cada línea despliega su detalle y enlaza a la sección correspondiente del sitio.

3. **Franja de cifras de capacidad.** RENATA exhibe "200 Gbps", "32 PoP", "99.98%". Crear una franja de cifras animadas (contadores) con las cifras del proyecto: **21,8 Ha** · **10.900 árboles** · **12 especies** · **8 lotes / 3 predios** · **~3.340 t CO₂ a 30 años** · **9 documentos notarizados**.

4. **"Mapa operativo".** RENATA muestra su mapa de puntos de presencia. El geovisor de Villamaría ya cumple este rol: presentarlo con ese encuadre ("Mapa operativo del proyecto"), manteniendo capas satelital/OSM, clústeres, polígonos y el filtro de deforestación.

5. **Cuadrícula de aliados estratégicos.** RENATA muestra una retícula de logos de aliados. Mover/replicar los logos de MASPROGRESO, Corpocaldas y DNP·SGR a una sección "Aliados estratégicos" con tarjetas sobre fondo oscuro, manteniendo el hover zoom ×1.15.

6. **Preguntas frecuentes (FAQ).** RENATA tiene FAQ. Crear 5–6 preguntas: ¿Qué es el proyecto SGR-SC-001-2025? ¿Qué es el DAP? ¿Cómo se verifica la información en blockchain? ¿Qué especies se plantaron y por qué? ¿Cómo se calcula la captura de CO₂? ¿Cómo consulto las áreas deforestadas cercanas?

7. **Noticias / hitos.** Opcional: línea de tiempo de hitos (firma del contrato, plantación marzo 2026, certificación Corpocaldas, notarización blockchain 17/06/2026).

### Lo que NO debe hacerse (historial de decisiones del cliente)
- **Sin video** en ninguna parte (se probó YouTube en hero y mosaico; el cliente pidió volver a la versión sin video).
- **Sin animación de flotación** en logos (rechazada); solo zoom ×1.15 en hover.
- **Hero clásico centrado**; no mosaico.
- **Tema oscuro** obligatorio; no clarear el diseño.
- **No inventar datos**: todas las cifras, hashes y enlaces deben ser los de este documento.

## A4. Diseño visual (tokens exactos)

```css
:root{
  --bg:#060a15;          /* fondo principal */
  --card:#0c1222;        /* tarjetas */
  --card2:#101a30;       /* tarjetas elevadas */
  --line:rgba(148,163,184,.14);   /* bordes sutiles */
  --line2:rgba(148,163,184,.28);
  --emerald:#34d399;     /* verde principal (naturaleza) */
  --blue:#3b82f6;        /* azul secundario (agua/datos) */
  --text:#e5edf8;
  --muted:#93a4bd;
  --mono:'JetBrains Mono',monospace;  /* números, hashes, datos */
}
```
- Tipografías: **Inter** para texto general, **JetBrains Mono** para cifras, hashes SHA-256 y coordenadas.
- Título del hero: `clamp(38px, 5.6vw, 62px)`.
- Bordes redondeados generosos (16–20 px), sombras profundas `0 8px 26px rgba(0,0,0,.5)`, acentos con brillos suaves del color emerald.
- La fotografía de árboles usa dos insignias: verde **"FOTO REAL DE CAMPO · VILLAMARÍA 2026"** y ámbar **"FOTO REFERENCIAL · ESPECIE SIMILAR"** (para especies sin foto propia).
- Responsive obligatorio: ancho móvil 390 px sin scroll horizontal; la barra se compacta y el geovisor mantiene controles usables.

## A5. Conexión con el sitio real de Villamaría

La nueva implementación es la evolución de https://villamaria-restauracion.vercel.app/:
- Mantener los mismos anclajes/secciones para no romper enlaces existentes: Inventario Técnico, Biodiversidad, Geovisor, Carbono, Auditoría.
- El botón **"Informe PDF"** descarga `CERTIFICACION CORPOCALDAS E INFORME FINAL GEOREFERENCIACION.pdf` (archivo real del proyecto; servirlo como recurso estático del sitio).
- El filtro de deforestación enlaza al geovisor oficial del IDEAM: https://www.ideam.gov.co/nuestra-entidad/ecosistemas-e-informacion-ambiental/sistema-monitoreo-bosques-carbono

---

# PARTE B — ESPECIFICACIÓN TÉCNICA COMPLETA

## B1. Arquitectura recomendada

- El sitio actual es **un solo archivo HTML/CSS/JS** (sin build) y funciona bien así; Antigravity puede mantenerlo como sitio estático (un `index.html` autocontenido) o migrarlo a React/Vite, pero **sin backend**: no hay login, formularios ni datos de usuarios; todo el contenido es de solo lectura y los documentos viven en IPFS.
- Librerías por CDN (mantener estas versiones):
  - **Leaflet 1.9.4** (mapa)
  - **leaflet.markercluster 1.5.3** (agrupación de 10.900 puntos)
  - **Chart.js 4.4.3** (curva de carbono)
- Recursos estáticos del proyecto:
  - `logos/masprogreso.png`, `logos/corpocaldas.png`, `logos/dnp-sgr.png`
  - `fotos/` (15 JPEG, una o más por especie; ver B6)
  - `CERTIFICACION CORPOCALDAS E INFORME FINAL GEOREFERENCIACION.pdf` (botón "Informe PDF" de la navbar, atributo `download`)

## B2. Generación determinista del inventario (10.900 árboles)

El inventario se sintetiza en el navegador con un RNG con semilla fija, de modo que **cada visita genera exactamente los mismos árboles** (mismas coordenadas, medidas y fotos). Implementación:

```js
// RNG determinista (NO cambiar la semilla)
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const rnd = mulberry32(20250617);
```

- **Formato de ID:** `VM-L{lote}-{####}` (p. ej. `VM-L4-0831`).
- **Campos por árbol:** `id`, `lote` (1–8), `lat`, `lng`, `sp` (nombre común), `sci` (nombre científico), `tipo` (noble/arbusto), `uicn`, `hue` (color del marcador), `dap` (cm), `alt` (m), `altc` (m, altura comercial), `copa` (m), `fito` (estado fitosanitario), `reg`, `fecha`.
- **Fecha de registro:** todas en **marzo de 2026**, distribuida uniformemente:
```js
fecha:new Date(2026,2,1+Math.floor(rnd()*28)).toLocaleDateString('es-CO',{day:'2-digit',month:'short',year:'numeric'})
```
- Cada árbol se ubica dentro del polígono de su lote (muestreo de punto en polígono con rechazo) y sus dimensiones se generan dentro de los rangos de su especie (ver B3). La distribución por especie es ponderada por `w` (rueda de ruleta sobre la suma total `W_TOT=428`).

## B3. Catálogo de especies (12 nativas) — `ESPECIES`

```js
const ESPECIES=[
 {c:'Roble',          s:'Quercus humboldtii',        tipo:'noble',  uicn:'VU', w:120, dap:[25,60], alt:[12,22], hue:150},
 {c:'Cedro',          s:'Cedrela montana',           tipo:'noble',  uicn:'VU', w:61,  dap:[20,55], alt:[10,20], hue:28},
 {c:'Pino Colombiano',s:'Retrophyllum rospigliosii', tipo:'noble',  uicn:'EN', w:53,  dap:[18,45], alt:[10,18], hue:160},
 {c:'Encenillo',      s:'Weinmannia tomentosa',      tipo:'noble',  uicn:'LC', w:31,  dap:[15,40], alt:[8,16],  hue:90},
 {c:'Olivo',          s:'Olea europaea',             tipo:'noble',  uicn:'NE', w:20,  dap:[15,35], alt:[6,12],  hue:80},
 {c:'Cucharo',        s:'Myrsine guianensis',        tipo:'arbusto',uicn:'LC', w:46,  dap:[8,20],  alt:[4,9],   hue:200},
 {c:'Nigüito',        s:'Miconia theaezans',         tipo:'arbusto',uicn:'LC', w:32,  dap:[6,16],  alt:[3,8],   hue:265},
 {c:'Amargoso',       s:'Aegiphila grandis',         tipo:'arbusto',uicn:'LC', w:32,  dap:[7,18],  alt:[4,9],   hue:55},
 {c:'Mano de Oso',    s:'Oreopanax floribundus',     tipo:'arbusto',uicn:'LC', w:24,  dap:[10,25], alt:[5,11],  hue:140},
 {c:'Arboloco',       s:'Montanoa quadrangularis',   tipo:'arbusto',uicn:'LC', w:22,  dap:[6,15],  alt:[3,7],   hue:190},
 {c:'Siete Cueros',   s:'Tibouchina lepidota',       tipo:'arbusto',uicn:'LC', w:20,  dap:[5,14],  alt:[3,6],   hue:290},
 {c:'Yagrumo',        s:'Cecropia telealba',         tipo:'arbusto',uicn:'LC', w:18,  dap:[12,30], alt:[6,13],  hue:100}
];
```
- `c` nombre común · `s` científico · `uicn` categoría UICN (VU Vulnerable, EN En Peligro, LC Preocupación Menor, NE No Evaluado) · `w` peso en la mezcla de plantación · `dap`/`alt` rangos dasométricos · `hue` tono HSL del marcador en el mapa.

## B4. Polígonos reales de los lotes — `LOTES`

Vértices reales del documento `Vértices_de_los_Polígonos_Albania.xlsx` (notarizado en IPFS), convertidos de MAGNA-SIRGAS CTM12 (ESRI:103599) a WGS84 (219 vértices totales). **Copiar exactamente:**

```js
const LOTES=[
 {n:1,predio:'La Albania',area:3.2,ind:1600,poly:[[4.9689861,-75.4755607],[4.9688729,-75.4751023],[4.9686449,-75.4746625],[4.968502,-75.4745689],[4.9679443,-75.4752228],[4.9678287,-75.4754323],[4.9677331,-75.4755488],[4.9675262,-75.4757091],[4.967554,-75.4757529],[4.9676735,-75.4757963],[4.9678935,-75.4758019],[4.9683102,-75.4756937],[4.9684731,-75.4756466],[4.9686886,-75.4755854],[4.9689861,-75.4755607]]},
 {n:2,predio:'La Albania',area:2.9,ind:1450,poly:[[4.9681073,-75.4765374],[4.9685066,-75.4761829],[4.9686566,-75.4760403],[4.9687618,-75.4759035],[4.9688494,-75.4756207],[4.9688264,-75.4755739],[4.9687619,-75.4755793],[4.9686886,-75.4755854],[4.9684731,-75.4756466],[4.9683102,-75.4756937],[4.9678935,-75.4758019],[4.9676735,-75.4757963],[4.967554,-75.4757529],[4.9674112,-75.475811],[4.9669899,-75.4758906],[4.9667976,-75.4766511],[4.9673233,-75.4768201],[4.9679476,-75.4766241],[4.9681073,-75.4765374]]},
 {n:3,predio:'La Albania',area:2.4,ind:1200,poly:[[4.968502,-75.4745689],[4.9680844,-75.4742702],[4.967537,-75.4747977],[4.9673428,-75.4749115],[4.967169,-75.4753331],[4.9671678,-75.4756336],[4.9671836,-75.475854],[4.9674112,-75.475811],[4.967554,-75.4757529],[4.9675262,-75.4757091],[4.9677331,-75.4755488],[4.9678287,-75.4754323],[4.9679443,-75.4752228],[4.968371,-75.4747225],[4.968502,-75.4745689]]},
 {n:4,predio:'La Carpeta',area:3.1,ind:1550,poly:[[4.9671927,-75.4745048],[4.9671876,-75.4743887],[4.9672082,-75.4743602],[4.9670947,-75.4743315],[4.9670459,-75.4745818],[4.96686,-75.4747093],[4.9667554,-75.4747119],[4.966653,-75.4748934],[4.9665628,-75.4750153],[4.966473,-75.4750388],[4.9664137,-75.4749194],[4.9663786,-75.4747016],[4.96654,-75.474723],[4.9666214,-75.4745534],[4.9666223,-75.4743029],[4.9665906,-75.4742761],[4.9661059,-75.4736404],[4.965972,-75.4737628],[4.9659655,-75.4740321],[4.9657144,-75.4739835],[4.9655204,-75.4738903],[4.9654129,-75.4738511],[4.9653713,-75.4737735],[4.9652794,-75.4735793],[4.9652141,-75.4734449],[4.9650799,-75.4733519],[4.9650324,-75.4732593],[4.9648893,-75.4731306],[4.9643712,-75.4733433],[4.964213,-75.4732819],[4.9640942,-75.4733662],[4.9640283,-75.4733981],[4.9640032,-75.4734028],[4.9639649,-75.4734134],[4.9639446,-75.4734014],[4.9638776,-75.4734011],[4.9637798,-75.4735415],[4.9649558,-75.4746969],[4.9654708,-75.4751806],[4.9658103,-75.4752272],[4.9663858,-75.4752592],[4.9666147,-75.4754509],[4.9665662,-75.475632],[4.9669899,-75.4758906],[4.9671836,-75.475854],[4.9671752,-75.4757361],[4.9671678,-75.4756336],[4.967169,-75.4753331],[4.9673407,-75.4749167],[4.9672543,-75.4746998],[4.9672104,-75.4745822],[4.9671927,-75.4745048]]},
 {n:5,predio:'La Carpeta',area:2.7,ind:1350,poly:[[4.9669865,-75.4742073],[4.9668037,-75.4740732],[4.9666309,-75.4738907],[4.9665507,-75.4737622],[4.9664688,-75.4735786],[4.9663384,-75.4734279],[4.9661059,-75.4736404],[4.9665906,-75.4742761],[4.9666223,-75.4743029],[4.9666214,-75.4745534],[4.96654,-75.474723],[4.9663786,-75.4747016],[4.9664137,-75.4749194],[4.966473,-75.4750388],[4.9665628,-75.4750153],[4.966653,-75.4748934],[4.9667554,-75.4747119],[4.96686,-75.4747093],[4.9670459,-75.4745818],[4.9670947,-75.4743315],[4.9672142,-75.4743618],[4.9672487,-75.4742668],[4.9671712,-75.4742021],[4.9670017,-75.4742265],[4.9669865,-75.4742073]]},
 {n:6,predio:'La Carpeta',area:2.5,ind:1250,poly:[[4.964223,-75.4731624],[4.9638776,-75.4734011],[4.9639446,-75.4734014],[4.9639649,-75.4734134],[4.9640032,-75.4734028],[4.9640283,-75.4733981],[4.9640337,-75.4733955],[4.9640486,-75.4733883],[4.9640942,-75.4733662],[4.964213,-75.4732819],[4.9642192,-75.4732843],[4.9642375,-75.4732915],[4.9643712,-75.4733433],[4.9644331,-75.4733179],[4.9644811,-75.4732982],[4.9648893,-75.4731306],[4.9649973,-75.4732278],[4.9650131,-75.473242],[4.9650324,-75.4732593],[4.9650799,-75.4733519],[4.9652141,-75.4734449],[4.9652794,-75.4735793],[4.9653373,-75.4737016],[4.9653715,-75.4737738],[4.9654129,-75.4738511],[4.9655204,-75.4738903],[4.9657144,-75.4739835],[4.9658053,-75.4740011],[4.9658453,-75.4740088],[4.9659655,-75.4740321],[4.9659719,-75.4737636],[4.965972,-75.4737628],[4.9661059,-75.4736404],[4.9659299,-75.4734834],[4.9658171,-75.4733395],[4.965527,-75.4730393],[4.9653636,-75.4727233],[4.96502,-75.4721508],[4.9647298,-75.4729496],[4.964223,-75.4731624]]},
 {n:7,predio:'La Carpetica',area:2.6,ind:1300,poly:[[4.9679545,-75.4729468],[4.9664339,-75.4733406],[4.9663384,-75.4734279],[4.9664688,-75.4735786],[4.9665507,-75.4737622],[4.9666309,-75.4738907],[4.9668037,-75.4740732],[4.9669865,-75.4742073],[4.9670017,-75.4742265],[4.9671712,-75.4742021],[4.9672487,-75.4742668],[4.9672142,-75.4743618],[4.9672082,-75.4743602],[4.9671876,-75.4743887],[4.9671927,-75.4745048],[4.9672104,-75.4745822],[4.9672543,-75.4746998],[4.9673407,-75.4749167],[4.9673428,-75.4749115],[4.967537,-75.4747977],[4.9680844,-75.4742702],[4.9684224,-75.47377],[4.9687704,-75.4734741],[4.9688608,-75.4733015],[4.9688226,-75.4731105],[4.9687931,-75.473009],[4.9686772,-75.4728267],[4.9684595,-75.472644],[4.9681373,-75.4725673],[4.9680787,-75.4726928],[4.9679545,-75.4729468]]},
 {n:8,predio:'La Carpetica',area:2.4,ind:1200,poly:[[4.9653348,-75.4721822],[4.9660483,-75.4721755],[4.9663065,-75.4722408],[4.9665289,-75.472256],[4.9667656,-75.4722926],[4.9668947,-75.4723217],[4.9670739,-75.4723725],[4.9675106,-75.4726532],[4.9679545,-75.4729468],[4.9684384,-75.471957],[4.9689873,-75.4707824],[4.9686871,-75.4704378],[4.9675396,-75.4708453],[4.966517,-75.4697341],[4.9664924,-75.4704475],[4.9663595,-75.4707988],[4.9661613,-75.4710128],[4.9658256,-75.4712143],[4.9655263,-75.4712728],[4.9647695,-75.4712917],[4.9647047,-75.4713494],[4.9653348,-75.4721822]]}
];
```

Resumen: Lotes 1–3 → predio **La Albania** (1600+1450+1200 = 4.250 ind.); Lotes 4–6 → **La Carpeta** (1550+1350+1250 = 4.150 ind.); Lotes 7–8 → **La Carpetica** (1300+1200 = 2.500 ind.). Total **10.900 individuos / 21,8 Ha**.

## B5. Geovisor — capas y controles

```js
// Mapa base: Esri World Imagery (satelital) por defecto + OpenStreetMap alternativo
const esri=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19});
const osm =L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19});

// Capa de deforestación (FUNCIONA, verificada): pérdida de cobertura arbórea
// Hansen/UMD vía Global Forest Watch, 2001–2024, 30 m Landsat
const deforLayer=L.tileLayer(
 'https://tiles.globalforestwatch.org/umd_tree_cover_loss/latest/dynamic/{z}/{x}/{y}.png',
 {maxZoom:19,opacity:.85,pane:'overlayPane',
  attribution:'Pérdida de bosque 2001–2024 · Hansen/UMD · Global Forest Watch'});
```

- **Control de deforestación**: botón en la esquina superior derecha del mapa (`top:56px; right:14px; z-index:600`), texto rojo (`#fca5a5`, borde `rgba(239,68,68,.35)`). Al activar: `map.addLayer(deforLayer)` con `bringToBack()` sobre las capas base (llamar también `esri.bringToBack()` y `osm.bringToBack()`); al desactivar: `map.removeLayer(deforLayer)`. Se acompaña de una nota (máx. 250 px de ancho) con el texto "Pérdida de cobertura arbórea 2001–2024" y enlace al geovisor oficial del IDEAM.
- **Nota importante sobre IDEAM:** los servidores WMS del IDEAM (geoapps, bacata, geoservicios, visualizador, smbyc) son inestables/no responden desde fuera de Colombia; por eso la capa en vivo usa Hansen/GFW y el IDEAM se enlaza como fuente oficial del histórico. **No intentar WMS del IDEAM en vivo.**
- Marcadores: círculos coloreados por `hue` de la especie, agrupados con markercluster; el popup/cluster abre la ficha del árbol. Polígonos de lotes con borde emerald y relleno tenue; clic en lote muestra resumen (predio, área, individuos, especies dominantes).
- Centro inicial del mapa: ajuste a los límites de `LOTES` (~4.966 N, −75.473 W).

## B6. Fotografías por especie — `FOTOS` y reglas de insignia

```js
const FOTOS={
 'Roble':['fotos/roble-1.jpg'],
 'Cedro':['fotos/cedro-1.jpg'],
 'Pino Colombiano':['fotos/pino-colombiano-1.jpg','fotos/pino-colombiano-2.jpg','fotos/pino-colombiano-3.jpg','fotos/pino-colombiano-4.jpg'],
 'Encenillo':['fotos/encenillo-1.jpg'],
 'Olivo':['fotos/olivo-1.jpg'],
 'Nigüito':['fotos/niguito-1.jpg'],
 'Siete Cueros':['fotos/siete-cueros-1.jpg'],
 'Cucharo':['fotos/cucharo-1.jpg'],
 'Amargoso':['fotos/amargoso-1.jpg'],
 'Mano de Oso':['fotos/mano-de-oso-1.jpg'],
 'Arboloco':['fotos/arboloco-1.jpg'],
 'Yagrumo':['fotos/yagrumo-1.jpg']
};
/* Especies cuya foto es de una especie botánicamente similar (no de la especie exacta) */
const FOTO_REFERENCIAL={'Encenillo':1,'Olivo':1,'Amargoso':1,'Arboloco':1};

function hashId(id){let h=0;for(let i=0;i<id.length;i++)h=(h*31+id.charCodeAt(i))>>>0;return h}
```

- Asignación determinista: `FOTOS[sp][hashId(id) % FOTOS[sp].length]` — el mismo árbol siempre muestra la misma foto.
- Insignias en la esquina superior izquierda de la foto:
  - Verde: `FOTO REAL DE CAMPO · VILLAMARÍA 2026` (color `#a7f3d0`, borde `rgba(52,211,153,.35)`, fondo `rgba(6,10,21,.72)`).
  - Ámbar (si `FOTO_REFERENCIAL[sp]`): `FOTO REFERENCIAL · ESPECIE SIMILAR` (color `#fde68a`, borde `rgba(251,191,36,.4)`).

## B7. Modelo de carbono (IPCC Tier 1–2) — `CARBONO`

```js
/* Crecimiento: IPCC 2019 Refinamiento, bosque montano tropical.
   AGB(t) = maxAGB · (1 − e^(−k·t)) con k = −ln(1 − gAereo/maxAGB)
   Biomasa total = AGB · (1 + R);  C = biomasa · CF;  CO2 = C · 44/12.
   Curva de saturación tipo Chapman-Richards. */
const CARBONO={
 gAereo:4.4,        // t d.m. ha-1 yr-1 (IPCC 2019 T4.9, montano tropical América, secundario ≤20 años)
 R:0.27,            // raíz:piso (IPCC 2006 T4.4, montano tropical)
 CF:0.47,           // fracción de carbono (IPCC 2006)
 maxAGB:90,         // t d.m./ha stock máximo aéreo (IPCC 2006, montano tropical)
 co2factor:44/12
};
```

- Resultados de referencia (validar contra ellos): **~9,6 t CO₂/ha/año** en la fase inicial, **~153 t CO₂/ha acumuladas a 30 años**, **~3.340 t CO₂ totales** del proyecto a 30 años.
- Equivalencia usada en el sitio: **4,6 t CO₂ por carro al año** (EPA) — "equivale a sacar de circulación N carros".
- Gráfico: Chart.js, línea emerald sobre fondo oscuro, eje X 0–30 años.

## B8. Auditoría blockchain — `DOCS` (9 documentos notarizados, datos REALES)

Formato de cada fila: `[nombre, descripción, hash SHA-256, etiqueta botón, url descarga (IPFS/Pinata), fecha notarización, url transacción Snowtrace, tipo icono]`:

```js
const DOCS=[
 ['Vértices_de_los_Polígonos_Albania.xlsx','Coordenadas WGS84 de los 8 lotes de restauración ecológica','ca600e8230e6bdba169609d40e393218bfec6cc69f10e67630de29b595837aff','Descargar','https://gateway.pinata.cloud/ipfs/bafkreid3hjg6tjrhsrpmmvyntqjbgzlepxzjuwshzzybhuurz42ase5hnq','17/6/26, 8:21','https://snowtrace.io/tx/0x2a56aed5d5fbf2f2d4c8aaee5ce2f4a5f46b05c577968a1c96b85bc9375519e0','xl'],
 ['Localizacion_Individuos_Totales_y_Muestreo.xls','Inventario completo de 10.900 individuos forestales por lote','447c41faece2312a69a131b750de57a5347fe26af56ee4f615c836a449e56795','Descargar','#','17/6/26, 8:21','#','xl'],
 ['INFORME_FINAL_GEOREFERENCIACION.pdf','Informe final de georeferenciación del área intervenida SGR-SC-001-2025','e4634963d83f3b30068f733259e735176bf3f3d34f237cd763be938f013bc8fc','Ver IPFS','#','17/6/26, 8:21','#','pdf'],
 ['Individuos_Totales.jpg','Mapa satelital de individuos totales plantados en los 8 lotes','2114f67df9775084dbbc70e1a6d5cb7f26dd577596aaa3344226e428dd462f58','Ver IPFS','#','17/6/26, 8:21','#','img'],
 ['Individuos_Totales_y_muestreo.jpg','Mapa con inventario total y muestreo de campo superpuestos','651c7106bee2278dd8ddc47fe3b4f56193e9b6fdb216248bad7b6382bb7fd09a','Ver IPFS','#','17/6/26, 8:21','#','img'],
 ['Individuos_Totales_y_muestreo_sin_IS.jpg','Mapa de inventario total y muestreo sin imagen satelital de fondo','ef0ee056911f2aa6b63bbe961bfa0edf8e405140ec4b0bdf54689e46b9438bfe','Ver IPFS','https://ipfs.io/ipfs/bafybeihb42wfvotvfx55vm4dtyif3go3lkiwaw3akdd5fjppoasxv4ab5q','17/6/26, 8:21','https://snowtrace.io/tx/0x5701f9b7bb4f3d3543d02fd7223ea49398f72a79d37d3a185424004a58beb9fe','img'],
 ['Individuos_muestreo.jpg','Cartografía del área de muestreo forestal del proyecto','ba40307bba80f4c13cbd21b486bff0f77c1d00bdc22e0ef1de9d08286b0da606','Ver IPFS','https://ipfs.io/ipfs/bafybeicayovwcmzzk4ohyybphh4n4onpz6yjssdeip3e76phe6g5v46jva','17/6/26, 8:22','https://snowtrace.io/tx/0x6a84d18c25b6cd3c7a0845788720ffdd3d5347725121a094fe570519e6bdfce0','img'],
 ['Copia_de_base_669_Muestreo_arboles.xlsx','Base de datos del muestreo estadístico de árboles (669 registros)','a86c61c70f8f02c8cf4cda7173ba870f5c80211e01feec6b9df52e5d509bc0ce','Descargar','https://gateway.pinata.cloud/ipfs/bafkreicnf2zeloriicwao4uztij4zyqturyko7bhbnhoyzvfja3hkvc6nq','17/6/26, 8:22','https://snowtrace.io/tx/0x3d405d5bb39c7ff3df9fa2e6619856703f71ab5c8a85cdd8a14e9a3b115bad9e','xl'],
 ['Copia_de_Areas_lotes.pdf','Plano oficial de áreas y linderos de los 8 lotes de restauración','c1a5682c9920c7ea3bfc9155581a65073d15cfa38938471d97eeb1ccc529fbf4','Ver IPFS','https://ipfs.io/ipfs/bafkreic3sdyrfgdas435chxo2e6hhtl76igabty6whk6pe7hykdbubu67y','17/6/26, 8:22','https://snowtrace.io/tx/0x73fc66291ab2769f0ee7839facb98b5e471d45e76ed1d05d1d5f92cecdea3e0d','pdf']
];
```

- Hashes en JetBrains Mono, truncados visualmente con tooltip del hash completo.
- Tipos de icono: `xl` (emerald), `pdf` (azul `#60a5fa`), `img` (ámbar `#fbbf24`).
- Cadena: **Avalanche C-Chain**; verificador: Snowtrace. Los enlaces `#` son documentos cuyo enlace público aún no se publica: mostrar el hash como prueba y deshabilitar el botón.

## B9. Criterios de aceptación (checklist para Antigravity)

1. El sitio se ve idéntico en espíritu al actual: tema oscuro `#060a15`, hero clásico centrado, navbar con 3 logos reales y hover zoom ×1.15, sin video.
2. Mejoras RENATA implementadas: frase-misión en hero, líneas del proyecto 01–04 tipo acordeón, franja de cifras animadas, geovisor como "Mapa operativo", cuadrícula de aliados estratégicos, FAQ.
3. Geovisor funcional: 8 polígonos reales, 10.900 marcadores en clústeres, Esri/OSM, control de deforestación GFW con nota IDEAM.
4. Buscador del inventario abre la ficha completa con foto correcta e insignia correcta (real vs referencial); todas las fechas en marzo de 2026.
5. Módulo de carbono reproduce ~9,6 t CO₂/ha/año y ~3.340 t a 30 años con gráfico Chart.js.
6. Los 9 documentos de auditoría muestran hash, IPFS y Snowtrace exactamente como en B8.
7. El botón "Informe PDF" descarga la certificación Corpocaldas.
8. Responsive: sin scroll horizontal a 390 px; cero errores de consola.
9. Ninguna cifra, hash, especie ni enlace inventado: todo proviene de este documento.

---

*Fuente de verdad: sitio en producción https://villamaria-restauracion.vercel.app/ (versión 06c6545) y documentos notarizados del contrato SGR-SC-001-2025. Referencia de diseño para mejoras: https://renata.edu.co/.*
