/**
 * drone-flyover.js - Vuelo Inicial del Enjambre (Izquierda a Derecha)
 * Al cargar la página, los 4 drones cruzan volando el cielo y revelan el video principal.
 */

document.addEventListener('DOMContentLoaded', () => {
  const flyoverCanvas = document.getElementById('flyover-canvas');
  if (!flyoverCanvas) return;

  const ctx = flyoverCanvas.getContext('2d');
  let width, height;

  function resize() {
    width = flyoverCanvas.width = window.innerWidth;
    height = flyoverCanvas.height = Math.min(window.innerHeight * 0.85, 750);
  }
  window.addEventListener('resize', resize);
  resize();

  // 4 Drones con estelas luminosas
  const drones = [
    { x: -180, y: height * 0.35, vx: 14, size: 26, color: '#00f2fe', label: 'ARES-01', trail: [] },
    { x: -240, y: height * 0.22, vx: 15, size: 22, color: '#f97316', label: 'ARES-02', trail: [] },
    { x: -290, y: height * 0.48, vx: 13.5, size: 24, color: '#10b981', label: 'ARES-03', trail: [] },
    { x: -350, y: height * 0.38, vx: 14.5, size: 20, color: '#fbbf24', label: 'ARES-04', trail: [] }
  ];

  let isAnimationComplete = false;
  let rotorAngle = 0;

  function drawFlyover() {
    ctx.clearRect(0, 0, width, height);

    rotorAngle += 0.9;
    let allFinished = true;

    drones.forEach(d => {
      d.x += d.vx;
      if (d.x < width + 250) {
        allFinished = false;
      }

      // Guardar estela aerodinámica
      d.trail.push({ x: d.x, y: d.y });
      if (d.trail.length > 25) d.trail.shift();

      // Dibujar estela de luz (Vortex trail)
      for (let i = 0; i < d.trail.length - 1; i++) {
        const t1 = d.trail[i];
        const t2 = d.trail[i + 1];
        const alpha = (i / d.trail.length) * 0.6;
        ctx.strokeStyle = d.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = (i / d.trail.length) * 3;
        ctx.beginPath();
        ctx.moveTo(t1.x, t1.y);
        ctx.lineTo(t2.x, t2.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      // Dibujar dron si está en pantalla
      if (d.x > -50 && d.x < width + 50) {
        ctx.save();
        ctx.translate(d.x, d.y);

        // Cono de escaneo láser hacia abajo
        const scanGrad = ctx.createLinearGradient(0, 0, 0, 90);
        scanGrad.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
        scanGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
        ctx.fillStyle = scanGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-28, 90);
        ctx.lineTo(28, 90);
        ctx.closePath();
        ctx.fill();

        // Estructura del cuadricóptero
        ctx.strokeStyle = '#292524';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(-16, -16); ctx.lineTo(16, 16);
        ctx.moveTo(16, -16); ctx.lineTo(-16, 16);
        ctx.stroke();

        // Rotores
        const propOffsets = [[-16, -16], [16, -16], [-16, 16], [16, 16]];
        ctx.strokeStyle = d.color;
        ctx.lineWidth = 1.8;
        propOffsets.forEach(([px, py]) => {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(rotorAngle);
          ctx.beginPath();
          ctx.ellipse(0, 0, 9, 3, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        });

        // Cuerpo central
        ctx.fillStyle = '#0c0a09';
        ctx.strokeStyle = d.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-9, -9, 18, 18, 5);
        ctx.fill();
        ctx.stroke();

        // Luz de navegación LED frontal
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Etiqueta del nodo
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 9px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(d.label, 0, -18);

        ctx.restore();
      }
    });

    if (!allFinished) {
      requestAnimationFrame(drawFlyover);
    } else {
      isAnimationComplete = true;
      // Desvanecer suavemente el canvas tras el sobrevuelo
      flyoverCanvas.style.transition = 'opacity 1s ease-out';
      flyoverCanvas.style.opacity = '0';
      setTimeout(() => {
        flyoverCanvas.style.display = 'none';
      }, 1000);
    }
  }

  // Lanzar el sobrevuelo cinemático inmediatamente
  requestAnimationFrame(drawFlyover);

  // Permitir relanzar la animación
  window.replaySwarmFlyover = function() {
    flyoverCanvas.style.display = 'block';
    flyoverCanvas.style.opacity = '1';
    drones[0].x = -180; drones[0].trail = [];
    drones[1].x = -240; drones[1].trail = [];
    drones[2].x = -290; drones[2].trail = [];
    drones[3].x = -350; drones[3].trail = [];
    requestAnimationFrame(drawFlyover);
  };
});
