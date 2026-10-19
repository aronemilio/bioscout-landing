# TeMA Y ESTILO BIOSCAOUT
## Bio-Autonomous Swarm Command & Control — Sistema de Diseño, Animaciones y Logos Oficiales

Este paquete contiene la extracción completa, organizada y lista para producción del **estilo visual**, **sistema de animaciones y keyframes**, y **logotipos e insignias vectoriales** del proyecto **BIOSCAOUT** (anteriormente conocido como ARES).

---

## 📁 Estructura del Paquete Extraído

```text
TeMA Y ESTILO BIOSCAOUT/
├── logos/                                # Logotipos e iconografía vectorial SVG oficial
│   ├── logo_bioscaout_principal.svg      # Logo horizontal completo con tipografía e insignias
│   ├── logo_bioscaout_badge.svg          # Emblema táctico circular/redondeado con sirena y glow
│   ├── logo_bioscaout_icon.svg           # Favicon y símbolo geométrico minimalista
│   ├── logo_cross_tactical.svg           # Cruz táctica médica de rescate ✚
│   ├── drone_tactical_symbol.svg         # Silueta vectorial de cuadricóptero UAV para radar
│   └── referencia_arquitectura_ui.jpeg   # Referencia de arquitectura táctica del stack original
│
├── styles/                               # Hojas de estilo y configuraciones de diseño
│   ├── tactical-theme.css                # CSS puro standalone con variables, temas y glassmorphism
│   ├── index.css                         # CSS con directivas @tailwind, noise texture y utilidades
│   ├── tailwind.config.js                # Configuración completa de Tailwind CSS (colores, sombras, etc.)
│   └── postcss.config.js                 # Configuración de PostCSS
│
├── animations/                           # Catálogo de animaciones y keyframes tácticos
│   ├── animations.css                    # Keyframes completos (@keyframes float, breathe, pulse, etc.)
│   └── animations.js                     # Helpers JavaScript (stagger delay, theme switcher, radar loop)
│
├── tokens/                               # Tokens de diseño estructurados para cualquier framework
│   ├── tokens.json                       # Tokens de diseño en formato estándar JSON
│   └── tokens.scss                       # Variables de color, tipografía y sombras para SCSS
│
├── components-sample/                    # Muestras reales extraídas de los componentes de interfaz
│   ├── Header.tsx                        # Barra superior C2 con logo flotante, voz y temas
│   └── KpiRibbon.tsx                     # Cinta de tarjetas KPI tácticas con animación escalonada
│
├── showcase/                             # Demostrador interactivo visual listo para abrir
│   └── index.html                        # Catálogo interactivo ejecutable directamente en el navegador
│
└── README.md                             # Esta guía completa de uso e integración
```

---

## 🎨 1. Estilo Táctico y Sistema de Diseño

### 1.1 Paleta de Colores
* **Fondo Principal (Dark HUD)**: `#060911`
* **Superficie de Paneles C2**: `#0b1220`
* **Superficies Elevadas y Tarjetas**: `#111c30`
* **Borde Sutil Táctico**: `rgba(249, 115, 22, 0.18)`
* **Acento Principal de Rescate**: `#f97316` (Naranja rescate de alta visibilidad)
* **Acento Secundario de Telemetría**: `#38bdf8` (Azul cian táctico)
* **Acento Nominal / Enlace OK**: `#10b981` (Verde esmeralda)
* **Acento de Alerta Crítica / REC**: `#f43f5e` (Rojo carmesí)
* **Acento de Advertencia**: `#f59e0b` (Ámbar)

### 1.2 Escala Monocromática de Rescate (Rescue Scale)
* 50: `#fff4ed`
* 100: `#ffe6d5`
* 200: `#ffc9aa`
* 300: `#ffa371`
* 400: `#ff7a3c`
* 500: `#f97316`
* 600: `#ea580c`
* 700: `#c2410c`
* 800: `#9a3412`
* 900: `#7c2d12`
* 950: `#431407`

### 1.3 Modos Visuales Operacionales (Filtros Tácticos)
El sistema soporta 4 modos visuales conmutables mediante clases en `<html>` o `<body>`:
1. **Dark HUD (Predeterminado)**: Clase `dark`. Alto contraste para operaciones nocturnas o interiores.
2. **Modo Luz (Diurno)**: Clase `light`. Fondos claros `#f1f5f9` para visibilidad en campo bajo luz solar directa.
3. **Modo NVG (Night Vision Goggles)**: Clases `dark nvg`. Emula visión nocturna militar de fósforo verde (`hue-rotate(80deg) saturate(1.4) contrast(1.15) brightness(1.05)`).
4. **Modo Amber (FLIR Térmico)**: Clases `dark amber`. Emula cámaras térmicas infrarrojas de fósforo ámbar militar (`sepia(0.85) saturate(2.4) hue-rotate(345deg)`).

### 1.4 Tipografías
* **Principal (UI)**: `'Plus Jakarta Sans', system-ui, sans-serif`
* **Telemetría y Datos Numéricos**: `'JetBrains Mono', monospace` (tabular nums)

---

## ⚡ 2. Animaciones y Keyframes

Todas las animaciones están preparadas en `animations/animations.css` y en `styles/tailwind.config.js`:

| Keyframe | Duración | Descripción Táctica |
| :--- | :--- | :--- |
| `@keyframes float` | `3s / 4s` | Flotación continua de drones, iconos e insignias (-4px). |
| `@keyframes breathe` | `3s` | Pulso suave de respiración y escala (1.18x) para enlace WebSocket activo. |
| `@keyframes redGlowPulse` | `2s` | Resplandor perimetral e interior carmesí para botón REC de caja negra. |
| `@keyframes pulseGlow` | `2s` | Pulso lumínico cian para radar y objetivos fijados. |
| `@keyframes shimmer` | `2s` | Destello lineal translúcido para loaders tácticos y skeletons. |
| `@keyframes slideUpFade` | `0.6s` | Entrada elástica ascendente para tarjetas de telemetría y métricas. |
| `@keyframes subtlePulse` | `2s` | Onda de choque concéntrica esmeralda para nuevos sobrevivientes detectados. |
| `@keyframes breathRed` | `3s` | Alarma pulsante de zona de exclusión aérea (NFZ) o fuego. |
| `@keyframes counterSpin` | `0.5s` | Giro con desplazamiento vertical de contadores. |
| `@keyframes scaleIn` | `0.4s` | Entrada por escalado cúbico bezier. |
| `@keyframes fadeIn` | `0.4s` | Desvanecimiento de entrada estándar. |

---

## 🛡️ 3. Catálogo de Logos e Insignias

1. **`logo_bioscaout_principal.svg`**:
   - Logotipo vectorial completo con el emblema de rescate a la izquierda, título en degradado blanco/naranja y badges `SWARM v3.0` y `EN VUELO`.
2. **`logo_bioscaout_badge.svg`**:
   - Escudo redondeado con gradiente naranja-ámbar, cruz médica interior, faro/sirena y anillos concéntricos tácticos.
3. **`logo_bioscaout_icon.svg`**:
   - Favicon minimalista en polígono geométrico de rescate (`#f97316`).
4. **`logo_cross_tactical.svg`**:
   - Cruz de rescate médico de emergencia con resplandor suave.
5. **`drone_tactical_symbol.svg`**:
   - Icono táctico de cuadricóptero con indicador de proa y rotores para displays radar.

---

## 🚀 4. Cómo Probar el Demostrador Interactivo

Simplemente abre el archivo:
```text
TeMA Y ESTILO BIOSCAOUT/showcase/index.html
```
en cualquier navegador web (doble clic). Podrás interactuar con los conmutadores de modo diurno/nocturno/NVG/Amber, ver todas las animaciones en tiempo real y explorar la paleta y los logos sin necesidad de instalar servidores ni dependencias.

---

## 💻 5. Cómo Integrar en un Nuevo Proyecto

### Opción A: Proyecto con Tailwind CSS y React / Vite / Next.js
1. Copia `styles/tailwind.config.js` en la raíz de tu nuevo proyecto.
2. Copia `styles/index.css` e impórtalo en tu `main.tsx` o `App.tsx`.
3. Importa los logos desde la carpeta `logos/`.

### Opción B: Proyecto HTML / CSS Puro
1. Agrega los enlaces en tu `<head>`:
   ```html
   <link rel="stylesheet" href="styles/tactical-theme.css">
   <link rel="stylesheet" href="animations/animations.css">
   ```
2. Usa clases como `.c2-panel`, `.glass-card`, `.animate-float`, `.badge-orange`, etc.
