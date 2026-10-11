/**
 * main.js - Orquestador Principal BioScout ARES
 * Reloj de Hora Dorada (<60 min), telemetría táctica militar y bootstrap
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de Iconos Lucide
  if (window.lucide) {
    lucide.createIcons();
  }

  // 1. Contador de la Hora Dorada (< 60 minutos)
  let goldenSeconds = 59 * 60 + 59;
  const goldenClockEl = document.getElementById('golden-hour-countdown');
  const zuluClockEl = document.getElementById('zulu-clock');

  setInterval(() => {
    if (goldenSeconds > 0) {
      goldenSeconds--;
      const m = Math.floor(goldenSeconds / 60).toString().padStart(2, '0');
      const s = (goldenSeconds % 60).toString().padStart(2, '0');
      if (goldenClockEl) {
        goldenClockEl.innerText = `${m}:${s}`;
      }
    }

    // Reloj militar UTC / Zulu
    if (zuluClockEl) {
      const now = new Date();
      zuluClockEl.innerText = now.toISOString().substring(11, 19) + 'Z';
    }
  }, 1000);

  // 2. Oscilación de métricas de telemetría en vivo
  const latencyEl = document.getElementById('metric-latency-val');
  const telemetryFreqEl = document.getElementById('metric-freq-val');

  setInterval(() => {
    if (latencyEl) {
      // Variación realista entre 16.2 ms y 19.8 ms (< 50 ms inmutable)
      const lat = (17 + Math.random() * 2.5).toFixed(1);
      latencyEl.innerText = `${lat} ms`;
    }
    if (telemetryFreqEl) {
      // Frecuencia entre 19.8 Hz y 20.4 Hz
      const hz = (20 + (Math.random() - 0.5) * 0.6).toFixed(1);
      telemetryFreqEl.innerText = `${hz} Hz`;
    }
  }, 1200);

  console.log('BioScout ARES v3.5 - Sistema Operacional y Radar 3D Three.js Activo.');
});
