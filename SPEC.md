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
- UI/UX & Atmósfera de Misión:
  - Estética visual: Ciudad en colapso por terremoto y derrumbe; texturas de tierra, grietas tectónicas, partículas de polvo y escombros en suspensión iluminados por haces de luz de rescate.
  - Tipografía: Fuentes modernas, suaves y legibles (Plus Jakarta Sans y Outfit) combinadas con acentos técnicos legibles.
  - Interfaz despejada: Eliminación de widgets flotantes innecesarios en esquinas (sin cuadros invasivos).
- Animación de Cascada Infinita & Enjambre Dinámico:
  - Cascada ambiental continua con física de descenso de partículas de polvo/tierra, escaneo lidar y sedimentación en tiempo real.
  - Enjambre de 4 drones autónomos acompañando el scroll del usuario a través de las diferentes altitudes y fases de la catástrofe.
- Integración de Video Nativo en la Cascada:
  - El video `Sin sub.mp4` está embebido e integrado de forma fluida directamente en la secuencia narrativa de la cascada con reproducción continua y controles accesibles.
- Identidad y Créditos del Proyecto (Extraídos de presentación oficial):
  - Integrantes: Valentín García Dueñas, Jhoao López, Aron Ayala.
  - Tutor: Charlen Calero H.
  - Contexto de impacto regional: Análisis de víctimas y damnificados por respuesta tardía en Venezuela (+6.300), Colombia (+480k) y Perú (525 distritos).

## 4. Protocolo de Modificación de Reglas (Self-Update)
- Cada adición o cambio de arquitectura debe quedar registrada bajo una versión incremental.
- Formato de registro de cambios:
  - `[TIMESTAMP] - [MODIFICADO/AÑADIDO/ELIMINADO] - Regla X: Descripción`.

### Registro Histórico de Versiones
- `[2026-10-10T23:53:00-05:00] - [AÑADIDO] - Regla 3.1: Interfaz Táctica ARES v2.0 con Radar Canvas reactivo (15m bubble, CPA vectoring), Telemetría en vivo (10-30Hz), Modal de Video para Sin sub.mp4 y exportador criptográfico AAR/Waypoints.`
- `[2026-10-11T00:03:00-05:00] - [MODIFICADO] - Regla 3.2: Evolución a SPA Inmersiva Scrollytelling con Cascada Infinita de partículas, enjambre de drones reactivo al scroll, sección de proceso/génesis de la solución, y presentación del equipo creador con UI atractiva y amigable.`
- `[2026-10-11T01:25:00-05:00] - [MODIFICADO] - Regla 3.3: Integración del video Sin sub.mp4 directamente en el flujo de la cascada, ambientación de ciudad en colapso por sismo/escombros/tierra, tipografía suave (Plus Jakarta Sans), remoción del HUD flotante inferior y acreditación oficial de integrantes del PPT (Valentín García Dueñas, Jhoao López, Aron Ayala, Tutor Charlen Calero H.).`