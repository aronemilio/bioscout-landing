# BioScout ARES - Estructura del Proyecto & Documentación

Plataforma interactiva e independiente para la orquestación autónoma de enjambres de drones de rescate (UAVs) en zonas de catástrofe y colapso estructural durante la **"Hora Dorada" (<60 min)**.

Repositorio Oficial en GitHub: [https://github.com/NotMetrx/ARES-Autonomous-Rescue-Emergency-System-](https://github.com/NotMetrx/ARES-Autonomous-Rescue-Emergency-System-)

---

## 📁 Arquitectura del Proyecto

```text
bioscout-landing/
├── index.html                    # Punto de entrada unificado y standalone (SPA)
├── assets/                       # Recursos estáticos organizados por tipo
│   ├── docs/                     # Presentaciones y documentos de soporte
│   │   └── Cuando-la-tierra-tiembla final.pptx
│   ├── images/                   # Diagramas, capturas de campo y material visual
│   ├── logos/                    # Logos e insignias vectoriales oficiales (SVG)
│   │   ├── logo_bioscaout_principal.svg
│   │   ├── logo_bioscaout_badge.svg
│   │   ├── logo_bioscaout_icon.svg
│   │   ├── logo_cross_tactical.svg
│   │   └── drone_tactical_symbol.svg
│   └── video/                    # Video de demostración de misión
│       ├── Sin sub_compressed.mp4  # Versión optimizada servida en la landing
│       └── Sin sub.mp4
│
├── docs/                         # Documentación técnica y especificaciones
│   ├── README.md                 # Guía general de arquitectura
│   ├── SPEC.md                   # Especificación técnica inmutable
│   └── Protocolo .md             # Reglas de operación del agente
│
├── src/                          # Código fuente modularizado
│   ├── css/
│   │   ├── theme.css             # Tokens de diseño, componentes y 4 modos visuales (activo)
│   │   ├── animations.css        # Keyframes y utilidades tácticas (activo)
│   │   └── styles.css            # Hoja heredada, no enlazada por la landing
│   └── js/
│       ├── app.js                # Orquestador único activo (radar, enjambre, HUD, exportadores, modos)
│       └── *.js                  # Módulos heredados (radar/swarm/video/...) no usados por index.html
│
├── README.md                     # Documentación principal en raíz
├── SPEC.md                       # Especificación técnica inmutable en raíz
└── Protocolo .md                 # Protocolo de operación en raíz
```

---

## 🎨 Sistema de Diseño

La interfaz se construye sobre el sistema de diseño oficial reciclado **"TeMA Y ESTILO BIOSCAOUT"**, adaptado a una estética de pitch de alta visibilidad:

- **Tokens de color**: superficies obsidiana (`#060911` base / `#0b1220` paneles C2 / `#111c30` elevadas), acento principal **NARANJA RESCATE `#f97316`** (escala `rescue` 50→950) y señales tácticas secundarias: cian `#38bdf8` (telemetría/radar), esmeralda `#10b981` (nominal/detectado), rosa `#f43f5e` (alerta) y ámbar `#f59e0b` (aviso). Tipografías Plus Jakarta Sans (UI) y JetBrains Mono (telemetría).
- **Componentes**: paneles glass (`.c2-panel`, `.glass-card`), insignias de estado (`.badge-*`) y botones tácticos (`.btn-tactical-*`), junto con textura de ruido y sombras tácticas; definidos en `src/css/theme.css`.
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

## 🚀 Despliegue Local Rápido

El proyecto está diseñado bajo arquitectura desacoplada y compatible con servidores estáticos estándar de Linux:

```bash
# Servidor local con Python 3
python3 -m http.server 8080

# Abrir en el navegador:
# http://localhost:8080
```

---

## 👥 Equipo Oficial del Proyecto (SENATI)

- **Jhoao López** — Tech Lead / Frontend & Consola Táctica HUD
- **Aron Ayala** — Lead & QA / Tester & Sistemas Embebidos LoRa
- **Valentín García** — AI & Backend Architect & Percepción D-FINE
- **Charlen Calero H.** — Tutor & Dirección Técnica
