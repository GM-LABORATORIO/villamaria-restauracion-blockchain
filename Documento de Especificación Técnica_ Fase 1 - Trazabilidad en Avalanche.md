# **Documento de Especificación Técnica: Fase 1 \- Trazabilidad en Avalanche**

**Proyecto:** Restauración Ecológica \- Contrato SGR-SC-001-2025  
**Objetivo:** Registro de inmutabilidad (Notarización digital) y despliegue de Landing Page informativa.

### **1\. Stack Tecnológico Sugerido**

* **Blockchain:** Avalanche (C-Chain).  
* **Almacenamiento Descentralizado:** IPFS (vía Pinata o similar) para los archivos pesados (Actas/Mapas) o Google Drive estructurado (si el equipo prefiere control centralizado por ahora).  
* **Frontend:** Framework ligero (React, Next.js o Astro).  
* **Integración Web3:** ethers.js o viem para interactuar con el contrato de registro.

### **2\. Alcance de Desarrollo**

* **A. Motor de Registro (Backend/Script):**  
  * Crear un script (Node.js) que tome los CSVs de vértices y el PDF del acta, genere el **Hash SHA-256** de cada uno y lo registre en un Smart Contract sencillo en Avalanche.  
  * El Smart Contract debe almacenar: \[Nombre\_Archivo, Hash\_SHA256, Timestamp, Link\_Publico\].  
* **B. Frontend (Landing Page):**  
  * **Vista de Predios:** Mapa interactivo básico que consuma los CSVs de vértices para mostrar los polígonos (Lotes 1-8).  
  * **Panel de Verificación:** Una sección donde el usuario pueda ver el *Hash* de los documentos oficiales y un link directo al explorador de bloques de Avalanche (Snowtrace) que certifique la transacción.

### **3\. Definición de "Fin de Etapa 1" (Criterios de Aceptación)**

La Fase 1 se considera completada cuando:

1. **Registro On-Chain:** Todos los documentos entregables (Acta de entrega \+ Consolidado de vértices) cuentan con su respectivo TXID en la red de Avalanche.  
2. **Landing Page en Línea:** El sitio web está desplegado y es accesible para cualquier stakeholder del proyecto.  
3. **Auditoría de Verdad:** Existe un botón o sección de "Certificado de Integridad" en la web que, al hacer clic, permite a cualquier persona verificar que el documento descargado coincide con el *hash* registrado en la Blockchain.  
4. **Entrega Documental:** Se entrega al equipo principal el "Certificado de Inmutabilidad" con los TXIDs correspondientes.

### **4\. Flujo de Trabajo (Pipeline)**

1. **Limpieza:** Convertir todos los CSVs y PDFs a un formato estándar.  
2. **Notarización:** Ejecutar el script para "anclar" la data en Avalanche.  
3. **Despliegue:** Montar la interfaz que consume esa data registrada.

### **1\. Estructura de la Landing Page (Sección por Sección)**

#### **A. Header (Identidad)**

* **Logo:** Alcaldía de Villamaría / Aquamaná (y el logo del proyecto si tienen).  
* **Menú:** Inicio | Lotes y Polígonos | Reportes Técnicos | **Verificador Blockchain**.

#### **B. Hero Section (El Impacto)**

* **Título:** Restauración Ecológica y Seguridad Hídrica – Cuenca Quebrada Chupaderos.  
* **Subtítulo:** Cumpliendo con el contrato SGR-SC-001-2025: Restauración activa, monitoreo y protección de los predios La Albania, La Carpeta y La Carpetica.  
* **Call to Action (CTA):** Botón grande: "Explorar Resultados del Proyecto".

#### **C. Dashboard de Métricas (La Verdad en números)**

* Tres tarjetas simples:  
  * **Árboles Registrados:** (Total de individuos del inventario).  
  * **Área Intervenida:** (Total de hectáreas de los lotes 1 al 8).  
  * **Estado de Ejecución:** "100% Finalizado (Etapa de Mantenimiento)".

#### **D. Mapa de Polígonos (Visualización Geográfica)**

* Integración visual de los archivos de vértices.  
* **Interactividad:** Al pasar el cursor sobre un lote (Lote 1 al 8), que se resalte y muestre un resumen (especies predominantes, estado fitosanitario promedio).

#### **E. Sección Blockchain (El "Core" Técnico)**

* Aquí es donde tu equipo *full stack* debe lucirse:  
  * **Título:** "Certificación de Información en Avalanche".  
  * **Explicación breve:** "Para garantizar la integridad y transparencia, los informes técnicos y el inventario están registrados en la Blockchain de Avalanche, asegurando que los datos sean inalterables."  
  * **La Tabla de Verdad:**  
    * Columna 1: Documento (ej. "Acta de Entrega Final", "Inventario Forestal").  
    * Columna 2: Hash (SHA-256).  
    * Columna 3: **Estado: Verificado en Avalanche (Enlace al TXID en Snowtrace)**.

#### **F. Footer**

* Logos institucionales y créditos a "GM Holding" como consultores tecnológicos.

### **2\. Estilo Visual (Look & Feel)**

* **Paleta de Colores:** Basada en la naturaleza (Verdes, tierra, blanco) para el impacto ecológico, y azules profundos para la sección de Blockchain (que denota tecnología y seguridad).  
* **Tipografía:** Sans-serif limpia (ej. *Inter* o *Montserrat*), fácil de leer y muy profesional.  
* **Imágenes:** Fotos reales de las labores de campo (esto humaniza la data).

### **3\. Recomendaciones para el Team Full Stack**

Para que no te compliquen con costos excesivos:

1. **Framework:** Usar **Next.js** (es rápido para SEO y fácil de desplegar).  
2. **Mapas:** Utilizar **Leaflet.js** o **Mapbox** (son ligeros y gratuitos para este volumen de datos) para graficar los CSVs de vértices.  
3. **Integración Web3:** Solo necesitan leer el contrato (Read-only) en Avalanche. No hace falta que el usuario conecte su wallet (MetaMask) para ver la data, eso simplifica muchísimo la UX.  
4. **Despliegue:** Usar **Vercel** o **Netlify**. Son gratis para este nivel de tráfico y te dan el certificado SSL automáticamente.

### **4\. ¿Cuándo finaliza la Etapa 1? (El punto de control)**

Tu equipo debe marcar el "Done" cuando:

1. La página esté levantada en un dominio público.  
2. Los polígonos de los lotes 1 al 8 se vean correctamente en el mapa.  
3. **Cualquier usuario pueda hacer clic en un TXID y ser redirigido a Snowtrace (explorador de Avalanche) comprobando que el registro existe.**

