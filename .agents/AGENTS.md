# AGENTS.MD — Reglas del Proyecto Bosques Marulanda

## Regla de Oro: Memoria del Proyecto (`CONTEXTO.md`)
- **SIEMPRE** consulta el archivo [`CONTEXTO.md`](file:///G:/Mi%20unidad/1.%20reforestacion/CONTEXTO.md) ubicado en la raíz del espacio de trabajo al comenzar cualquier tarea.
- **SIEMPRE** actualiza el archivo [`CONTEXTO.md`](file:///G:/Mi%20unidad/1.%20reforestacion/CONTEXTO.md) en la tabla de bitácora y en las secciones pertinentes tras realizar cambios técnicos, científicos, geográficos o estructurales en la página o el repositorio.
- **MODULARIDAD Y COMENTARIOS**: Mantén la estructura modular de `app/index.html` (CSS, HTML, JS) con comentarios pedagógicos en español.
- **DESARROLLO LOCAL**: Sigue trabajando localmente y no hagas `git push` a menos que el usuario lo pida explícitamente.

## 🛑 Protocolo de Consulta y Aprobación Previa (REGLA INVIOLABLE)
- **SIEMPRE QUE EL USUARIO FORMULE O INTENCIONE CUALQUIER TIPO DE PREGUNTA O SOLICITUD:**
  1. **Análisis:** Responder primero con el análisis detallado de lo que el usuario ha solicitado.
  2. **Propuesta de Plan:** Presentar un plan de acción claro, por pasos o fases.
  3. **Pausa por Aprobación:** **DETENER LA EJECUCIÓN** y esperar la aprobación explícita del usuario antes de realizar cualquier modificación de código, ejecución de scripts, creación de archivos o actualización.

---

## 🏔️ Equipo 3D "Guardianes del Agua" — Taller & Pipeline Geoespacial

### Principios No Negociables del Taller 3D
1. **Trazabilidad.** Todo número publicado tiene una fuente registrada en `data/PROCEDENCIA.md`. Si no se puede rastrear, no se publica.
2. **Incertidumbre visible.** Lo estimado nunca se presenta con la misma autoridad visual que lo medido. La desaturación progresiva es el mecanismo estándar del proyecto.
3. **Presupuesto antes de producción.** Ningún rol produce sin conocer su presupuesto de triángulos, memoria de textura o peso de transferencia.
4. **Reproducibilidad.** Un comando reconstruye todo desde `data/raw/`. Ningún paso manual oculto.
5. **`data/raw/` es inmutable.** Solo lectura, siempre.
6. **Declarar toda distorsión.** Exageración vertical, simplificación de malla o recorte de rango de color se declaran en el nombre del archivo, metadatos y documentación.

### Convenciones Técnicas 3D
- **CRS de Trabajo**: EPSG:9377 (MAGNA-SIRGAS / Origen Nacional). **Intercambio**: EPSG:4326.
- **Convención 3D**: Y arriba, 1 unidad = 1 metro, Norte hacia Z negativo.
- **Formato Final**: glTF 2.0 / GLB binario.

### Flujo Obligatorio de Compuertas
```
geodata-arquitecto → [Compuerta G1 (dominio-ambiental)] → dem-superficie →
{cartografo-drapeado ‖ malla-terreno} → materiales-pbr → [Compuerta G2 (qa-geoespacial)] →
gltf-entrega → visor-web → [Compuerta G3 (qa-geoespacial)]
```

