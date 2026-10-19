# BioScout | ARES (Autonomous Rescue Emergency System)

Plataforma táctica de alto rendimiento e independiente para la orquestación autónoma de enjambres de drones de rescate (UAVs) diseñada para intervenciones críticas durante la **"Hora Dorada" (<60 min)** tras catástrofes naturales.

Repositorio Oficial de Desarrollo: [https://github.com/NotMetrx/ARES-Autonomous-Rescue-Emergency-System-](https://github.com/NotMetrx/ARES-Autonomous-Rescue-Emergency-System-)

---

## ⚡ Propósito y Capacidades Principales

Cuando un sismo de gran magnitud o un alud masivo impacta una región, las carreteras colapsan y las redes eléctricas y celulares quedan destruidas. **BioScout (Módulo ARES)** resuelve el aislamiento geográfico inicial:

1. **Intervención en la Hora Dorada (<60 min)**: Despliegue inmediato de escuadrones autónomos para cartografía térmica y localización de víctimas vivas.
2. **100% Edge Computing Offline**: Cero dependencia de internet, nube pública o cobertura celular comercial. Toda la inferencia y cinemática corre en los procesadores locales a bordo de cada UAV.
3. **Percepción Neuronal D-FINE (RT-DETR)**: Visión multiescala a 45 FPS con calibración espectral contra la Tasa de Falsos Descubrimientos (FDR), discriminando radiación metabólica humana en humo denso y escombros.
4. **Cinemática de Evasión 3D (<50 ms)**: Burbuja esférica de protección de 15 metros por nodo, con cálculo del Punto de Mayor Aproximación (CPA) y filtros de Kalman de 6 grados de libertad.
5. **Telemetría Descentralizada (10–30 Hz)**: Canales WebSocket locales y radioenlaces LoRa en binario comprimido de largo alcance.
6. **Auditoría Forense Criptográfica (SHA-256)**: Registro inmutable de misión en SQLite WAL y exportación de waypoints QGroundControl (`.waypoints` WPL 110) y dossiers JSON.

---

## 📁 Arquitectura del Repositorio

```text
bioscout-landing/
├── index.html                    # Aplicación web estática unificada (SPA)
├── assets/                       # Recursos multimedia y documentos
│   ├── docs/                     # Presentaciones oficiales
│   │   └── Cuando-la-tierra-tiembla final.pptx
│   ├── images/                   # Diagramas y capturas de campo
│   ├── logos/                    # Logos e insignias vectoriales oficiales (SVG)
│   │   ├── logo_bioscaout_principal.svg
│   │   ├── logo_bioscaout_badge.svg
│   │   ├── logo_bioscaout_icon.svg
│   │   ├── logo_cross_tactical.svg
│   │   └── drone_tactical_symbol.svg
│   └── video/                    # Demostración en video de pruebas de vuelo
│       ├── Sin sub_compressed.mp4  # Versión optimizada servida en la landing
│       └── Sin sub.mp4
├── docs/                         # Documentación técnica
│   ├── README.md                 # Arquitectura del proyecto
│   ├── SPEC.md                   # Especificación técnica inmutable
│   └── Protocolo .md             # Reglas operativas del agente
├── src/                          # Código modularizado desacoplado
│   ├── css/
│   │   ├── theme.css             # Tokens de diseño, componentes y 4 modos visuales (activo)
│   │   ├── animations.css        # Keyframes y utilidades tácticas (activo)
│   │   └── styles.css            # Hoja heredada, no enlazada por la landing
│   └── js/
│       ├── app.js                # Orquestador único activo (radar, enjambre, HUD, exportadores, modos)
│       └── *.js                  # Módulos heredados (radar/swarm/video/...) no usados por index.html
├── package.json                  # Definición de dependencias
├── SPEC.md                       # Especificación técnica en raíz
├── Protocolo .md                 # Protocolo y manual de reglas
└── README.md                     # Documentación principal
```

---

## 🎨 Sistema de Diseño

La landing se construye sobre el sistema de diseño oficial reciclado **"TeMA Y ESTILO BIOSCAOUT"** ([`TeMA Y ESTILO BIOSCAOUT/`](TeMA%20Y%20ESTILO%20BIOSCAOUT/)), adaptado a la estética de pitch de BioScout:

- **Tokens de color**: superficies obsidiana (`#060911` base / `#0b1220` paneles C2 / `#111c30` elevadas), acento principal **NARANJA RESCATE `#f97316`** (escala `rescue` 50→950) y señales tácticas secundarias: cian `#38bdf8` (telemetría/radar), esmeralda `#10b981` (nominal/detectado), rosa `#f43f5e` (alerta) y ámbar `#f59e0b` (aviso). Tipografías Plus Jakarta Sans (UI) y JetBrains Mono (telemetría).
- **Componentes**: paneles glass (`.c2-panel`, `.glass-card`), insignias de estado (`.badge-*`) y botones tácticos (`.btn-tactical-*`), además de textura de ruido y sombras tácticas; definidos en `src/css/theme.css`.
- **Modos visuales**: 4 modos conmutables con persistencia — **Dark HUD** (predeterminado), **Light** diurno, **NVG** (fósforo verde) y **Amber** (FLIR térmico ámbar). Los filtros NVG/Amber se desactivan bajo `prefers-reduced-motion`.
- **Animaciones**: catálogo de keyframes y utilidades tácticas en `src/css/animations.css` (float, breathe, redGlowPulse, pulseGlow, shimmer, slideUpFade, subtlePulse, breathRed, radarSweep, gridTravel).
- **Logos e insignias**: 5 SVG oficiales en `assets/logos/` (`logo_bioscaout_principal`, `logo_bioscaout_badge`, `logo_bioscaout_icon`, `logo_cross_tactical`, `drone_tactical_symbol`).

---

## ♿ Accesibilidad y Buenas Prácticas

- **Semántica y navegación**: HTML5 con landmarks (`header`/`nav`/`main`/`footer`), un único `h1`, enlace de salto al contenido (`<main id="contenido" tabindex="-1">`) y orden de foco lógico.
- **Teclado**: foco visible con `:focus-visible` y token propio; modal de video con `role="dialog"`, `aria-modal`, fondo inerte (`inert`) y **trampa de foco**; cierre con `ESC` garantizado desde cualquier punto mediante **controles de video propios** (sin los controles nativos que capturan la tecla).
- **Movimiento reducido**: bajo `prefers-reduced-motion` se detienen las partículas, el sobrevuelo y el radar (frame estático) y se desactivan los filtros NVG/Amber.
- **Contraste**: combinaciones conformes con AA en los modos Dark, NVG, Amber y Light (con ajustes específicos de contraste en modo luz).
- **Progressive enhancement**: contenido estático funcional sin JavaScript; scripts con `defer` y versión de Lucide fijada. El encabezado es responsive y mantiene el CTA del repositorio siempre visible.

---

## 🚀 Despliegue y Ejecución Local

BioScout es una aplicación estática pura (HTML5, Tailwind CSS vía CDN, Lucide Icons con versión fijada y Canvas 2D interactivo) sin dependencias de compilación externa:

```bash
# Servidor local con Python 3
python3 -m http.server 8080

# Abrir en el navegador:
# http://localhost:8080
```

También es compatible con despliegue directo mediante **Antigravity CLI** en Linux o cualquier proveedor estático (Netlify, Vercel, GitHub Pages).

---

## 🌎 Casos de Impacto Regional (Latinoamérica)

El diseño operativo de BioScout está calibrado a partir de lecciones aprendidas en los desastres más severos de la región:

- **Tragedia de Vargas (Venezuela, 1999)**: Deslaves masivos de montaña que destruyeron las autopistas y dejaron incomunicadas a las brigadas terrestres por más de 72 horas.
- **Avalancha de Mocoa (Colombia, 2017)**: Creciente súbita nocturna a las 3:00 AM con corte total de energía y comunicaciones que impidió el triage médico de urgencia.
- **Terremoto de Pisco (Perú, 2007)**: Megaterremoto M7.9 que fracturó la autopista Panamericana Sur, retrasando convoyes médicos mientras las réplicas impedían el ingreso a edificios derruidos.

---

## 👥 Equipo de Mando Técnico (SENATI)

- **Jhoao López** — Tech Lead / Frontend (Consola Táctica HUD, Radar Canvas y Telemetría WebSocket)
- **Aron Ayala** — Lead & QA / Tester (Sistemas Embebidos, Resiliencia Offline y Malla LoRa)
- **Valentín García** — AI & Backend Architect (Modelo D-FINE RT-DETR, Filtrado FDR y Cinemática CPA)
- **Charlen Calero H.** — Tutor & Dirección Técnica

*Proyecto postulado al Concurso Nacional de Innovación Tecnológica de SENATI.*
