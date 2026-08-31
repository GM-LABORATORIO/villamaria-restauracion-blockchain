# Regla: estándares glTF

Aplica a todo agente que produzca o modifique un GLB.

- Especificación glTF 2.0. Toda extensión usada se declara en extensionsUsed y, si es
  obligatoria para renderizar, también en extensionsRequired.
- Convención de ejes: Y arriba, norte hacia Z negativo, una unidad igual a un metro.
- El accesor de POSITION lleva siempre min y max. Sin ellos, el encuadre automático falla.
- Verifica el GLB leyendo su JSON antes de declararlo terminado. Reporta triángulos,
  materiales, texturas y extensiones.
- Toda salida pasa por el validador de Khronos. Cero errores; advertencias justificadas.
- El asset lleva generator, copyright y las fuentes de dato.
- Publica siempre dos variantes: una comprimida para web y una compatible sin extensiones
  opcionales, cada una con su matriz de visores soportados documentada.
