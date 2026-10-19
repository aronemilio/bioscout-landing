# BIOSCOUT SPEC & RULES SPECIFICATION

## 1. Identidad y Dominio del Proyecto
- Nombre oficial: BioScout (módulo de misión: ARES - Autonomous Rescue Emergency System).
- Repositorio oficial en GitHub: https://github.com/NotMetrx/ARES-Autonomous-Rescue-Emergency-System-
- Propósito: Plataforma para la orquestación autónoma de enjambres de drones de rescate (UAVs) en zonas de desastre.
- Objetivo operativo: Intervención crítica durante la "Hora Dorada" (< 60 minutos post-impacto).
- Topología de red: 100% autónomo y local (Edge Computing). Prohibida la dependencia de nube pública o internet para funciones operativas centrales.

## 2. Restricciones Técnicas Inmutables
- Inferencia de Visión: Red neuronal D-FINE (arquitectura RT-DETR) con calibración FDR y filtros espectrales anti-falsos positivos.
- Cinemática de Evasión: Algoritmo reactivo 3D con punto de mayor aproximación (CPA), filtros Kalman, burbuja táctica de 15 m y latencia < 50 ms.
- Telemetría: Streaming en tiempo real entre 10 y 30 Hz (JSON vía WebSocket y binario comprimido RF/LoRa).
- Gestión Energética: Handover automático de patrulla si la batería cae por debajo del 22%.
- Auditoría Post-Misión: Reportes After-Action Review (AAR) exportados con firma criptográfica SHA-256 y waypoints `.waypoints` (QGroundControl WPL 110).

## 3. Especificación de la Web Independiente
- Tipo: Single Page Application (SPA) táctica, interactiva y de alto rendimiento.
- Entorno: Compatible con despliegue en Linux mediante Antigravity CLI / servidores estáticos locales (`python3 -m http.server`).
- UI/UX & Atmósfera de Misión:
  - Estética visual: Paleta de marca obsidiana (#060911 superficie base / #0b1220 paneles C2 / #111c30 superficies elevadas) con acento principal NARANJA RESCATE (#f97316, escala rescue 50→950 completa) y señales tácticas secundarias: cian #38bdf8 (telemetría/radar), esmeralda #10b981 (nominal/detectado), rosa #f43f5e (alerta crítica) y ámbar #f59e0b (aviso).
  - Sistema de diseño reciclado: Integración del sistema oficial "TeMA Y ESTILO BIOSCAOUT" (tokens de diseño, componentes .c2-panel / .glass-card / .badge-* / .btn-tactical-*, textura de ruido y sombras tácticas) como base visual de la landing.
  - Modos visuales operacionales: 4 modos conmutables con persistencia (Dark HUD predeterminado / Light diurno / NVG fósforo verde / Amber FLIR térmico ámbar); los filtros NVG y Amber se desactivan bajo `prefers-reduced-motion`.
  - Logos oficiales: 5 SVG oficiales copiados a `assets/logos/` (logo_bioscaout_principal, logo_bioscaout_badge, logo_bioscaout_icon, logo_cross_tactical, drone_tactical_symbol).
  - Modularización: estilos desacoplados en `src/css/theme.css` (tokens y componentes) y `src/css/animations.css` (keyframes y utilidades tácticas float, breathe, redGlowPulse, pulseGlow, shimmer, slideUpFade, subtlePulse, breathRed, radarSweep, gridTravel); lógica unificada en `src/js/app.js` (partículas ambientales, sobrevuelo del enjambre, spotlight de cursor, tilt cards, number ticker, hora dorada + reloj Zulu, video/modal accesible, exportadores AAR y waypoints, radar Canvas 2D, conmutador de modo visual y menú móvil). El `index.html` ya no contiene CSS ni JS inline; Tailwind sigue vía CDN ampliado con los tokens colors.obsidian / colors.rescue / colors.tactical.
  - Accesibilidad (a11y): enlace de salto (`<main id="contenido">` con `tabindex="-1"`), HTML semántico (header/nav/main/section/article/footer), foco visible (:focus-visible), soporte de `prefers-reduced-motion` (partículas, sobrevuelo, radar en frame estático y filtros NVG/Amber desactivados), menú de navegación móvil accesible con `aria-expanded`/`aria-controls`, modal de video con `role="dialog"`, `aria-modal`, fondo `inert` y trap de foco + cierre con ESC garantizado mediante controles de video propios, encabezado responsive sin desbordamiento (CTA de repositorio siempre visible), contraste AA en los 4 modos incluido Light, `aria-label` en botones de icono, atributos data-* para progressive enhancement, scripts con `defer` y versión de Lucide fijada.
  - Fondo dinámico táctico: Canvas con partículas en suspensión (polvo sísmico y micro-destellos de rescate), combinado con malla topográfica/lidar sutil y haces de luz ambientales.
  - Animación breve de sobrevuelo de enjambre (Flyover inicial): Al cargar la página, los 4 drones ARES cruzan el espacio aéreo en formación táctica con estelas luminosas y conos de escaneo láser, desvaneciéndose suavemente a los 3.5s (con botón para repetir el sobrevuelo en el navbar).
  - Tipografía: Plus Jakarta Sans para interfaz general y JetBrains Mono para telemetría, métricas y HUD.
  - Video Pitch Above the Fold: Contenedor 16:9 integrado directamente en el Hero con marco HUD táctico, controles rápidos y brillo sutil.
  - Redirección al Repositorio: Enlaces directos a `https://github.com/NotMetrx/ARES-Autonomous-Rescue-Emergency-System-` en el Header y botones principales.
  - Idioma: Interfaz 100% en español técnico respetando terminología de la industria (Edge, LoRa, MAVLink, CPA, RT-DETR).
- Impacto Regional en Latinoamérica (3 Casos Clave):
  - Tragedia de Vargas (Venezuela, 1999): Deslaves masivos, colapso de vías y aislamiento terrestre prolongado (>72h).
  - Avalancha de Mocoa (Colombia, 2017): Creciente súbita nocturna, puentes destruidos y corte eléctrico total.
  - Terremoto de Pisco (Perú, 2007): Fractura de la Panamericana Sur, réplicas continuas y aislamiento hospitalario.
- Radar Táctico Interactivo:
  - Canvas 2D con haz giratorio continuo a 60 FPS (frame estático y sin bucle bajo `prefers-reduced-motion`), detección de sobrevivientes con D-FINE FDR, escombros en rosa y drones con burbuja de 15m.
  - Simulador de inyección de obstáculos (evasión <50ms) y relevo por batería baja (<22%).
- Equipo Creador (SENATI):
  - Jhoao López (Tech Lead / Frontend)
  - Aron Ayala (Lead & QA / Tester)
  - Valentín García (AI & Backend Architect)
  - Tutor: Charlen Calero H.

## 4. Protocolo de Modificación de Reglas (Self-Update)
### Registro Histórico de Versiones
- `[2026-10-10T23:53:00-05:00] - [AÑADIDO] - Regla 3.1: Interfaz Táctica ARES v2.0 con Radar Canvas reactivo (15m bubble, CPA vectoring), Telemetría en vivo (10-30Hz), Modal de Video para Sin sub.mp4 y exportador criptográfico AAR/Waypoints.`
- `[2026-10-11T00:03:00-05:00] - [MODIFICADO] - Regla 3.2: Evolución a SPA Inmersiva Scrollytelling con Cascada Infinita de partículas, enjambre de drones reactivo al scroll, sección de proceso/génesis de la solución, y presentación del equipo creador con UI atractiva y amigable.`
- `[2026-10-11T01:25:00-05:00] - [MODIFICADO] - Regla 3.3: Integración del video Sin sub.mp4 directamente en el flujo de la cascada, ambientación de ciudad en colapso por sismo/escombros/tierra, tipografía suave (Plus Jakarta Sans), remoción del HUD flotante inferior y acreditación oficial de integrantes del PPT.`
- `[2026-10-11T01:42:00-05:00] - [AÑADIDO] - Regla 3.4: Arquitectura modular de proyecto: separación de fuentes en src/js y src/css, organización de recursos multimedia en assets/ y documentación técnica en docs/.`
- `[2026-10-11T01:50:00-05:00] - [MODIFICADO] - Regla 3.5: Landing Page Épica de Alto Nivel BioScout ARES: Estética táctica militar/rescate en bg-slate-950 con acentos cyan (#00f2fe) y emerald (#10b981), Hero con contador de Hora Dorada (<60 min) y telemetría en vivo.`
- `[2026-10-11T02:08:00-05:00] - [MODIFICADO] - Regla 3.6: Enfoque Apple/Huawei para jurados de concurso: video protagónico al entrar con animación de enjambre, paleta de colores de tierra/terremoto/emergencia y logo de SENATI para concurso estudiantil.`
- `[2026-10-12T16:25:00-05:00] - [MODIFICADO] - Regla 3.7: Adaptación completa de interfaz al español técnico, paleta táctica obsidiana/cian/esmeralda (#04070b / #06b6d4 / #10b981), video pitch Above the Fold en el Hero con marco HUD táctico, enlaces directos al repositorio oficial ARES en GitHub (NotMetrx), y sección de casos históricos de desastres en Latinoamérica (Tragedia de Vargas, Avalancha de Mocoa, Terremoto de Pisco).`
- `[2026-10-12T17:15:00-05:00] - [MODIFICADO] - Regla 3.8: Rediseño del fondo táctico ambiental con partículas en suspensión (polvo/escombros) y malla lidar de contornos topográficos; animación cinemática breve de sobrevuelo del enjambre de 4 drones (ARES 01-04) al cargar la página con estelas de plasma, conos de escaneo térmico descendente y botón de repetición en el navbar.`
- `[2026-10-15T00:00:00-05:00] - [MODIFICADO] - Regla 3.9: Integración completa del sistema de diseño BIOSCAOUT (TeMA Y ESTILO BIOSCAOUT): paleta de acento naranja rescate #f97316 sobre superficies obsidiana, tokens de diseño, 4 modos visuales (Dark HUD/Light/NVG/Amber) con persistencia, logos oficiales SVG, catálogo de animaciones reciclado, modularización completa de estilos (src/css/theme.css, src/css/animations.css) y scripts (src/js/app.js), y mejoras de accesibilidad (skip link, semántica, foco visible, prefers-reduced-motion, menú móvil accesible).`
- `[2026-10-16T00:00:00-05:00] - [MODIFICADO] - Regla 3.10: Endurecimiento de la landing tras auditoría de accesibilidad y buenas prácticas: encabezado responsive sin desbordamiento (CTA del repositorio siempre visible), modal de video a nivel de body con fondo inert, trampa de foco y cierre con ESC garantizado mediante controles de video propios, radar en frame estático bajo prefers-reduced-motion, contraste AA en modo luz, enlace de salto enfocable (tabindex=-1 en main), regla [hidden]{display:none!important} y versión de Lucide fijada (0.454.0).`