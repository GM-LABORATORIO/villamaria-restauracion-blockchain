# Regla: calidad geoespacial

Aplica a todo agente que toque dato espacial.

- Nunca asumas un CRS. Verifícalo con gdalinfo u ogrinfo y decláralo en tu respuesta.
- Nunca mezcles alturas elipsoidales con ortométricas. Declara cuál usas.
- Nunca reportes un área calculada sobre coordenadas geográficas en grados.
- Nunca suavices, rellenes o interpoles sin declarar el método y sus parámetros.
- Cuando dos fuentes discrepen, cuantifica la discrepancia en metros y repórtala.
  No promedies en silencio.
- Todo resultado numérico se acompaña de su método de cálculo y de su incertidumbre.
