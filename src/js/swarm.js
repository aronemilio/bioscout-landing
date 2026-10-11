/**
 * swarm.js - Cinemática del Enjambre de 4 Drones ARES
 * Desciende acompañando el scroll y adopta formaciones según la sección.
 */

(function initSwarm() {
  const companionCanvas = document.getElementById('swarm-companion-canvas');
  if (!companionCanvas) return;

  const cCtx = companionCanvas.getContext('2d');
  let cWidth, cHeight;

  function resizeCompanionCanvas() {
    cWidth = companionCanvas.width = window.innerWidth;
    cHeight = companionCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCompanionCanvas);
  resizeCompanionCanvas();

  const swarmUAVs = [
    { id: 'ARES-01', x: 200, y: 150, targetX: 200, targetY: 150, rotorAngle: 0, color: '#00f2fe', label: 'Alpha' },
    { id: 'ARES-02', x: 260, y: 180, targetX: 260, targetY: 180, rotorAngle: 0, color: '#f59e0b', label: 'Bravo' },
    { id: 'ARES-03', x: 140, y: 190, targetX: 140, targetY: 190, rotorAngle: 0, color: '#10b981', label: 'Charlie' },
    { id: 'ARES-04', x: 200, y: 240, targetX: 200, targetY: 240, rotorAngle: 0, color: '#fb923c', label: 'Delta' }
  ];

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateCompanionFormations() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollY / docHeight : 0;

    let centerX, centerY;

    if (progress < 0.20) {
      // En Hero: Formación en Diamante en altitud
      centerX = cWidth > 768 ? cWidth * 0.82 : cWidth * 0.5;
      centerY = cHeight * 0.40;
      swarmUAVs[0].targetX = centerX;        swarmUAVs[0].targetY = centerY - 45;
      swarmUAVs[1].targetX = centerX + 50;   swarmUAVs[1].targetY = centerY;
      swarmUAVs[2].targetX = centerX - 50;   swarmUAVs[2].targetY = centerY;
      swarmUAVs[3].targetX = centerX;        swarmUAVs[3].targetY = centerY + 45;

    } else if (progress < 0.45) {
      // En Video en Cascada: Los drones orbitan suavemente alrededor del reproductor
      centerX = cWidth > 768 ? cWidth * 0.14 : cWidth * 0.5;
      centerY = cHeight * 0.50;
      const t = Date.now() * 0.0018;
      swarmUAVs.forEach((d, idx) => {
        const a = t + (idx * Math.PI / 2);
        d.targetX = centerX + Math.cos(a) * 45;
        d.targetY = centerY + Math.sin(a) * 45;
      });

    } else if (progress < 0.70) {
      // En El Flujo / Proceso: Formación en Línea de Rastreo sobre el terreno
      centerX = cWidth > 768 ? cWidth * 0.86 : cWidth * 0.5;
      centerY = cHeight * 0.52;
      swarmUAVs[0].targetX = centerX - 35;   swarmUAVs[0].targetY = centerY - 35;
      swarmUAVs[1].targetX = centerX + 35;   swarmUAVs[1].targetY = centerY - 35;
      swarmUAVs[2].targetX = centerX - 35;   swarmUAVs[2].targetY = centerY + 35;
      swarmUAVs[3].targetX = centerX + 35;   swarmUAVs[3].targetY = centerY + 35;

    } else {
      // En Integrantes / Equipo: Formación de escolta horizontal
      centerX = cWidth * 0.5;
      centerY = cHeight * 0.25;
      swarmUAVs[0].targetX = centerX - 90;   swarmUAVs[0].targetY = centerY;
      swarmUAVs[1].targetX = centerX - 30;   swarmUAVs[1].targetY = centerY;
      swarmUAVs[2].targetX = centerX + 30;   swarmUAVs[2].targetY = centerY;
      swarmUAVs[3].targetX = centerX + 90;   swarmUAVs[3].targetY = centerY;
    }

    // Repulsión ante cursor
    swarmUAVs.forEach(d => {
      const dx = d.targetX - mouseX;
      const dy = d.targetY - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        d.targetX += (dx / dist) * 25;
        d.targetY += (dy / dist) * 25;
      }
    });
  }

  function drawSwarmDrone(ctx, drone) {
    const x = drone.x;
    const y = drone.y;

    ctx.save();
    ctx.translate(x, y);

    // Haz de escaneo cónico hacia abajo sobre los escombros
    const coneGrad = ctx.createRadialGradient(0, 0, 5, 0, 35, 30);
    coneGrad.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
    coneGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = coneGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-25, 45);
    ctx.lineTo(25, 45);
    ctx.closePath();
    ctx.fill();

    // Brazos del cuadricóptero
    ctx.strokeStyle = '#33271e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-15, -15); ctx.lineTo(15, 15);
    ctx.moveTo(15, -15); ctx.lineTo(-15, 15);
    ctx.stroke();

    // Rotores
    drone.rotorAngle += 0.8;
    const rotorPositions = [[-15, -15], [15, -15], [-15, 15], [15, 15]];
    ctx.strokeStyle = drone.color;
    ctx.lineWidth = 1.5;

    rotorPositions.forEach(([rx, ry], idx) => {
      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(drone.rotorAngle * (idx % 2 === 0 ? 1 : -1));
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 2.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    // Cuerpo central
    ctx.fillStyle = '#160f0b';
    ctx.strokeStyle = drone.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-8, -8, 16, 16, 4);
    ctx.fill();
    ctx.stroke();

    // Ojo de sensor
    ctx.fillStyle = drone.color;
    ctx.beginPath();
    ctx.arc(0, -2, 3, 0, Math.PI * 2);
    ctx.fill();

    // Etiqueta
    ctx.fillStyle = '#ffffff';
    ctx.font = '9px "Plus Jakarta Sans"';
    ctx.textAlign = 'center';
    ctx.fillText(drone.label, 0, 24);

    ctx.restore();
  }

  function renderCompanionSwarm() {
    cCtx.clearRect(0, 0, cWidth, cHeight);
    updateCompanionFormations();

    // Enlaces de red Mesh entre drones
    cCtx.strokeStyle = 'rgba(217, 119, 6, 0.25)';
    cCtx.lineWidth = 1;
    cCtx.setLineDash([3, 3]);
    for (let i = 0; i < swarmUAVs.length; i++) {
      for (let j = i + 1; j < swarmUAVs.length; j++) {
        cCtx.beginPath();
        cCtx.moveTo(swarmUAVs[i].x, swarmUAVs[i].y);
        cCtx.lineTo(swarmUAVs[j].x, swarmUAVs[j].y);
        cCtx.stroke();
      }
    }
    cCtx.setLineDash([]);

    swarmUAVs.forEach(d => {
      d.x += (d.targetX - d.x) * 0.08;
      d.y += (d.targetY - d.y) * 0.08;
      drawSwarmDrone(cCtx, d);
    });

    requestAnimationFrame(renderCompanionSwarm);
  }

  requestAnimationFrame(renderCompanionSwarm);
})();
