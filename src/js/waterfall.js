/**
 * waterfall.js - Cascada Infinita de Partículas de Ceniza, Polvo y Haces de Luz
 * Reacciona a la velocidad del scroll del usuario en zonas de derrumbe.
 */

(function initWaterfall() {
  const waterfallCanvas = document.getElementById('infinite-waterfall-canvas');
  if (!waterfallCanvas) return;

  const wCtx = waterfallCanvas.getContext('2d');
  let wWidth, wHeight;
  let scrollVelocity = 0;
  let lastScrollY = window.scrollY;

  function resizeWaterfallCanvas() {
    wWidth = waterfallCanvas.width = window.innerWidth;
    wHeight = waterfallCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeWaterfallCanvas);
  resizeWaterfallCanvas();

  window.addEventListener('scroll', () => {
    const curY = window.scrollY;
    scrollVelocity = Math.min(30, Math.abs(curY - lastScrollY));
    lastScrollY = curY;
  });

  // Partículas de polvo de derrumbe y partículas en suspensión
  const dustParticles = [];
  const DUST_COUNT = 110;

  for (let i = 0; i < DUST_COUNT; i++) {
    dustParticles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2.5 + 0.8,
      length: Math.random() * 30 + 10,
      speedY: Math.random() * 2.0 + 0.8,
      speedX: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.45 + 0.15,
      // Tonos de tierra, ceniza y chispas cálidas de rescate
      hue: Math.random() > 0.4 ? 35 : (Math.random() > 0.5 ? 180 : 25)
    });
  }

  function renderEarthquakeWaterfall() {
    wCtx.clearRect(0, 0, wWidth, wHeight);

    scrollVelocity *= 0.94;
    const boost = scrollVelocity * 0.85;

    for (let p of dustParticles) {
      p.y += p.speedY + boost;
      p.x += p.speedX;

      if (p.y > wHeight) {
        p.y = -p.length;
        p.x = Math.random() * wWidth;
      }
      if (p.x < 0) p.x = wWidth;
      if (p.x > wWidth) p.x = 0;

      const grad = wCtx.createLinearGradient(p.x, p.y, p.x + p.speedX * 3, p.y + p.length);
      grad.addColorStop(0, `hsla(${p.hue}, 80%, 45%, 0)`);
      grad.addColorStop(0.7, `hsla(${p.hue}, 85%, 55%, ${p.opacity})`);
      grad.addColorStop(1, `hsla(${p.hue}, 90%, 65%, ${p.opacity * 1.4})`);

      wCtx.strokeStyle = grad;
      wCtx.lineWidth = p.radius;
      wCtx.beginPath();
      wCtx.moveTo(p.x, p.y);
      wCtx.lineTo(p.x + p.speedX * 3, p.y + p.length);
      wCtx.stroke();
    }

    requestAnimationFrame(renderEarthquakeWaterfall);
  }

  requestAnimationFrame(renderEarthquakeWaterfall);
})();
