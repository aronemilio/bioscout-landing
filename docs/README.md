# BioScout ARES - Estructura del Proyecto & Documentación

Plataforma interactiva para la orquestación autónoma de enjambres de drones de rescate (UAVs) en zonas de catástrofe y colapso estructural durante la "Hora Dorada" (< 60 minutos).

---

## 📁 Arquitectura del Proyecto

```text
bioscout-landing/
├── assets/                       # Recursos estáticos organizados por tipo
│   ├── docs/                     # Presentaciones y documentos de soporte
│   │   └── Cuando-la-tierra-tiembla final.pptx
│   ├── images/                   # Diagramas, logos y capturas de campo
│   │   ├── image1.png ... image21.png
│   │   └── image4.jpg ... image18.jpg
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
│   │   └── styles.css            # Hoja de estilos desacoplada (dark/earth theme)
│   └── js/
│       ├── main.js               # Coordinador principal y bootstrap
│       ├── waterfall.js          # Cascada continua de partículas de tierra/ceniza
│       ├── swarm.js              # Cinemática y formaciones del enjambre de 4 UAVs
│       ├── radar.js              # Simulador de radar 2D/3D (CPA y Handover 22%)
│       ├── video.js              # Controles del reproductor integrado
│       └── exporters.js          # Descarga de AAR (SHA-256) y .waypoints QGC
│
├── index.html                    # Punto de entrada unificado (Single Page Application)
├── package.json                  # Definición de dependencias
├── .gitignore                    # Reglas de exclusión para Git (>100MB videos, node_modules)
└── Sin sub.mp4                   # Archivo de video en raíz para retrocompatibilidad
```

---

## 🚀 Despliegue Local Rápido

El proyecto está diseñado bajo arquitectura desacoplada y compatible con servidores estáticos estándar de Linux:

```bash
# Servidor local con Python 3
python3 -m http.server 8080

# Abrir en el navegador:
http://localhost:8080
```

---

## 👥 Equipo Oficial del Proyecto

- **Valentín García Dueñas** — Integrante / BioScout Core & Coordinación de Enjambre
- **Jhoao López** — Integrante / Inteligencia Artificial & D-FINE RT-DETR
- **Aron Ayala** — Integrante / Sistemas Embebidos Edge Computing & LoRa Mesh
- **Charlen Calero H.** — Tutor & Dirección Técnica
