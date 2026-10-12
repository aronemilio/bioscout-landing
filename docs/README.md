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
│   ├── images/                   # Diagramas, logos y capturas de campo
│   └── video/                    # Video de demostración de misión
│       └── Sin sub.mp4
│
├── docs/                         # Documentación técnica y especificaciones
│   ├── README.md                 # Guía general de arquitectura
│   ├── SPEC.md                   # Especificación técnica inmutable
│   └── Protocolo .md             # Reglas de operación del agente
│
├── src/                          # Código fuente modularizado
│   ├── css/
│   │   └── styles.css            # Hoja de estilos desacoplada
│   └── js/
│       ├── main.js               # Coordinador principal y bootstrap
│       ├── radar.js              # Simulador de radar 2D (CPA y Handover 22%)
│       ├── video.js              # Controles del reproductor integrado
│       └── exporters.js          # Descarga de AAR (SHA-256) y .waypoints QGC
│
├── README.md                     # Documentación principal en raíz
├── SPEC.md                       # Especificación técnica inmutable en raíz
└── Protocolo .md                 # Protocolo de operación en raíz
```

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
