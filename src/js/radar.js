/**
 * radar.js - Simulador de Radar Táctico de Enjambre (Canvas 2D)
 * Burbuja esférica de 15 metros, cinemática reactiva CPA Kalman y protocolo Handover.
 */

let tRadarRange = 100;
let tRadarAngle = 0;
let tEvasions = 0;
let tObstacleActive = false;
let tObstaclePos = { x: 30, y: -40, vx: -0.6, vy: 0.5 };

const radarNodes = [
  { id: 'ARES-01', x: 20, y: -18, vx: -0.3, vy: 0.25, bat: 88, color: '#00f2fe' },
  { id: 'ARES-02', x: -25, y: 20, vx: 0.3, vy: -0.2, bat: 76, color: '#f59e0b' },
  { id: 'ARES-03', x: 35, y: 30, vx: -0.25, vy: -0.35, bat: 64, color: '#10b981' },
  { id: 'ARES-04', x: 0, y: 0, vx: 0, vy: 0, bat: 100, color: '#64748b' }
];

function setRadarRange(r) {
  tRadarRange = r;
  const disp = document.getElementById('radar-range-display');
  if (disp) disp.innerText = `${r} METROS`;
  
  ['100', '200', '300'].forEach(x => {
    const btn = document.getElementById(`btn-range-${x}`);
    if (btn) {
      btn.className = x == r 
        ? 'px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold transition-all'
        : 'px-3 py-1.5 rounded-lg text-earth-dust hover:text-white transition-all';
    }
  });
}

function triggerObstacleInjection() {
  tObstacleActive = true;
  tObstaclePos = { x: 35, y: -45, vx: -0.7, vy: 0.6 };
  tEvasions++;
  const evEl = document.getElementById('radar-cpa-evasion');
  if (evEl) evEl.innerText = tEvasions;
  setTimeout(() => { tObstacleActive = false; }, 8500);
}

function triggerHandoverTest() {
  const u3 = radarNodes[2];
  u3.bat = 18;
  u3.color = '#f43f5e';

  const u4 = radarNodes[3];
  u4.color = '#00f2fe';
  u4.vx = 0.35;
  u4.vy = -0.3;

  const st3 = document.getElementById('ares-03-status');
  if (st3) {
    st3.innerText = 'HANDOVER <22%';
    st3.className = 'text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-mono';
  }
  const bat3 = document.getElementById('ares-03-bat');
  if (bat3) {
    bat3.innerText = '18%';
    bat3.className = 'text-rose-400 font-bold';
  }

  const st4 = document.getElementById('ares-04-status');
  if (st4) {
    st4.innerText = 'EN RELEVO';
    st4.className = 'text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono';
  }
  const dot4 = document.getElementById('ares-04-dot');
  if (dot4) dot4.className = 'w-2.5 h-2.5 rounded-full bg-cyan-400';

  const notif = document.getElementById('handover-notification-box');
  if (notif) {
    notif.className = 'mt-4 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500 text-xs text-rose-200 animate-pulse';
    notif.innerHTML = '<strong>ALERTA DE RELEVO ACTIVA:</strong> ARES-03 descargado al 18% (&lt; 22%). Transferencia instantánea de sector a ARES-04 Delta en curso.';
  }
}

(function initRadarRenderer() {
  const tRadarCanvas = document.getElementById('tactical-radar-canvas');
  if (!tRadarCanvas) return;
  const trCtx = tRadarCanvas.getContext('2d');

  function renderTacticalRadar() {
    const w = tRadarCanvas.width;
    const h = tRadarCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = (cx - 20) / tRadarRange;

    trCtx.clearRect(0, 0, w, h);

    // Fondo oscuro táctico
    trCtx.fillStyle = '#070504';
    trCtx.beginPath();
    trCtx.arc(cx, cy, cx - 2, 0, Math.PI * 2);
    trCtx.fill();

    // Círculos concéntricos
    const rings = 4;
    for (let i = 1; i <= rings; i++) {
      const r = ((cx - 20) / rings) * i;
      trCtx.strokeStyle = 'rgba(217, 119, 6, 0.2)';
      trCtx.lineWidth = 1;
      trCtx.beginPath();
      trCtx.arc(cx, cy, r, 0, Math.PI * 2);
      trCtx.stroke();

      trCtx.fillStyle = 'rgba(217, 119, 6, 0.4)';
      trCtx.font = '10px "JetBrains Mono"';
      trCtx.fillText(`${Math.round((tRadarRange / rings) * i)}m`, cx + 6, cy - r + 12);
    }

    // Ejes
    trCtx.strokeStyle = 'rgba(217, 119, 6, 0.25)';
    trCtx.beginPath();
    trCtx.moveTo(cx, 10); trCtx.lineTo(cx, h - 10);
    trCtx.moveTo(10, cy); trCtx.lineTo(w - 10);
    trCtx.stroke();

    // Haz giratorio
    tRadarAngle += 0.025;
    if (tRadarAngle >= Math.PI * 2) tRadarAngle = 0;

    trCtx.save();
    trCtx.beginPath();
    trCtx.moveTo(cx, cy);
    trCtx.arc(cx, cy, cx - 10, tRadarAngle - 0.35, tRadarAngle);
    trCtx.closePath();
    trCtx.fillStyle = 'rgba(6, 182, 212, 0.15)';
    trCtx.fill();

    trCtx.strokeStyle = '#06b6d4';
    trCtx.lineWidth = 1.5;
    trCtx.beginPath();
    trCtx.moveTo(cx, cy);
    trCtx.lineTo(cx + Math.cos(tRadarAngle) * (cx - 10), cy + Math.sin(tRadarAngle) * (cy - 10));
    trCtx.stroke();
    trCtx.restore();

    // Sobreviviente detectado
    const targetPxX = cx - 38 * scale;
    const targetPxY = cy - 30 * scale;
    trCtx.fillStyle = '#10b981';
    trCtx.beginPath();
    trCtx.arc(targetPxX, targetPxY, 5, 0, Math.PI * 2);
    trCtx.fill();

    trCtx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
    trCtx.strokeRect(targetPxX - 10, targetPxY - 10, 20, 20);
    trCtx.font = '10px "JetBrains Mono"';
    trCtx.fillStyle = '#10b981';
    trCtx.fillText('SOBREVIVIENTE (98.4%)', targetPxX + 14, targetPxY + 4);

    // Obstáculo
    if (tObstacleActive) {
      tObstaclePos.x += tObstaclePos.vx;
      tObstaclePos.y += tObstaclePos.vy;
      const opx = cx + tObstaclePos.x * scale;
      const opy = cy + tObstaclePos.y * scale;

      trCtx.fillStyle = '#f59e0b';
      trCtx.beginPath();
      trCtx.arc(opx, opy, 6, 0, Math.PI * 2);
      trCtx.fill();

      trCtx.strokeStyle = '#f59e0b';
      trCtx.strokeRect(opx - 9, opy - 9, 18, 18);
      trCtx.fillText('OBSTÁCULO 3D', opx + 12, opy + 4);
    }

    // Nodos y burbuja de 15m
    const bubblePx = 15.0 * scale;
    radarNodes.forEach(u => {
      if (u.bat > 0 && (u.vx !== 0 || u.vy !== 0)) {
        u.x += u.vx;
        u.y += u.vy;
        if (Math.abs(u.x) > tRadarRange * 0.8) u.vx *= -1;
        if (Math.abs(u.y) > tRadarRange * 0.8) u.vy *= -1;

        if (tObstacleActive) {
          const dx = u.x - tObstaclePos.x;
          const dy = u.y - tObstaclePos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 20) {
            u.vx += (dx / dist) * 0.4;
            u.vy += (dy / dist) * 0.4;
          }
        }

        const px = cx + u.x * scale;
        const py = cy + u.y * scale;

        trCtx.beginPath();
        trCtx.arc(px, py, bubblePx, 0, Math.PI * 2);
        trCtx.strokeStyle = u.color === '#f43f5e' ? 'rgba(244, 63, 94, 0.4)' : 'rgba(6, 182, 212, 0.25)';
        trCtx.lineWidth = 1.5;
        trCtx.setLineDash([4, 4]);
        trCtx.stroke();
        trCtx.setLineDash([]);

        trCtx.fillStyle = u.color;
        trCtx.beginPath();
        trCtx.arc(px, py, 4.5, 0, Math.PI * 2);
        trCtx.fill();

        trCtx.fillStyle = '#ffffff';
        trCtx.font = '10px "Plus Jakarta Sans"';
        trCtx.fillText(u.id, px + 8, py - 5);
      }
    });

    requestAnimationFrame(renderTacticalRadar);
  }

  requestAnimationFrame(renderTacticalRadar);
})();
