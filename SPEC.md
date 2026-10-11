# BIOSCOUT SPEC & RULES SPECIFICATION

## 1. Identidad y Dominio del Proyecto
- Nombre oficial: BioScout (módulo de misión: ARES).
- Propósito: Plataforma para la orquestación autónoma de enjambres de drones de rescate (UAVs) en zonas de desastre.
- Objetivo operativo: Intervención crítica durante la "Hora Dorada" (< 60 minutos post-impacto).
- Topología de red: 100% autónomo y local (Edge Computing). Prohibida la dependencia de nube pública o internet para funciones operativas centrales.

## 2. Restricciones Técnicas Inmutables
- Inferencia de Visión: Red neuronal D-FINE (arquitectura RT-DETR) con calibración FDR y filtros espectrales anti-falsos positivos.
- Cinemática de Evasión: Algoritmo reactivo 3D con punto de mayor aproximación (CPA), filtros Kalman, burbuja táctica de 15 m y latencia < 50 ms.
- Telemetría: Streaming en tiempo real entre 10 y 30 Hz (JSON vía WebSocket y binario comprimido RF/LoRa).
- Gestión Energética: Handover automático de patrulla si la batería cae por debajo del 22%.
- Auditoría Post-Misión: Reportes After-Action Review (AAR) exportados con firma criptográfica SHA-256 y waypoints `.waypoints` (QGroundControl).

## 3. Especificación de la Web Independiente
- Tipo: Single Page Application (SPA) inmersiva, interactiva y explicativa ("Scrollytelling").
- Entorno: Compatible con despliegue en Linux mediante Antigravity CLI / servidores estáticos locales (`python3 -m http.server`).
- UI/UX: Tailwind CSS, presentación amigable, estética técnica moderna y luminosa (dark mode suave con acentos cyan/esmeralda/violeta), microinteracciones táctiles y componentes fluidos.
- Animación de Cascada Infinita & Enjambre Dinámico:
  - Fondo animado de partículas / flujo en cascada continua ("Waterfall Stream") que reacciona a la velocidad y posición del scroll.
  - Enjambre de drones interactivo (renderizado en Canvas 2D/3D con estelas cinemáticas) que desciende, cambia de formación y responde a cada etapa del proceso explicativo.
- Narrativa Explicativa Integral:
  - 1. El Desafío Crítico: La Hora Dorada (<60 min) en zonas de colapso y el fallo de las redes convencionales.
  - 2. La Hipótesis & Solución: Por qué Edge Computing 100% desconectado en lugar de la nube pública.
  - 3. La Tecnología Central: Visión D-FINE (RT-DETR con FDR) y Cinemática 3D (CPA Kalman con burbuja de 15 m y latencia <50 ms).
  - 4. Demostraciones Interactivas: Radar táctico en vivo, simulador de handover (umbral 22%), consola de telemetría y exportador AAR/Waypoints.
  - 5. El Equipo Detrás de BioScout: Explicación de los creadores y perfiles de ingeniería que hicieron posible el proyecto.
  - 6. Modal Multimedia: Integración del video explicativo `Sin sub.mp4`.

## 4. Protocolo de Modificación de Reglas (Self-Update)
- Cada adición o cambio de arquitectura debe quedar registrada bajo una versión incremental.
- Formato de registro de cambios:
  - `[TIMESTAMP] - [MODIFICADO/AÑADIDO/ELIMINADO] - Regla X: Descripción`.

### Registro Histórico de Versiones
- `[2026-10-10T23:53:00-05:00] - [AÑADIDO] - Regla 3.1: Interfaz Táctica ARES v2.0 con Radar Canvas reactivo (15m bubble, CPA vectoring), Telemetría en vivo (10-30Hz), Modal de Video para Sin sub.mp4 y exportador criptográfico AAR/Waypoints.`
- `[2026-10-11T00:03:00-05:00] - [MODIFICADO] - Regla 3.2: Evolución a SPA Inmersiva Scrollytelling con Cascada Infinita de partículas, enjambre de drones reactivo al scroll, sección de proceso/génesis de la solución, y presentación del equipo creador con UI atractiva y amigable.`