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
- Tipo: Single Page Application (SPA) informativa y táctica, desacoplada del backend.
- Entorno: Compatible con despliegue en Linux mediante Antigravity CLI / servidores estáticos locales (`python3 -m http.server`).
- UI/UX: Tailwind CSS, estética táctica oscura (`bg-slate-950`), soporte para radar interactivo en Canvas, modal de video y microinteracciones fluidas.

## 4. Protocolo de Modificación de Reglas (Self-Update)
- Cada adición o cambio de arquitectura debe quedar registrada bajo una versión incremental.
- Formato de registro de cambios:
  - `[TIMESTAMP] - [MODIFICADO/AÑADIDO/ELIMINADO] - Regla X: Descripción`.

### Registro Histórico de Versiones
- `[2026-10-10T23:53:00-05:00] - [AÑADIDO] - Regla 3.1: Interfaz Táctica ARES v2.0 con Radar Canvas reactivo (15m bubble, CPA vectoring), Telemetría en vivo (10-30Hz), Modal de Video para Sin sub.mp4 y exportador criptográfico AAR/Waypoints.`