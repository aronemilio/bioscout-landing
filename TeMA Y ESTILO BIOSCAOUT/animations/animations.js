/**
 * BIOSCAOUT ANIMATION & THEME UTILITIES (JAVASCRIPT)
 * Helpers para gestión de transiciones escalonadas, temas militares y loops tácticos.
 */

export const BioscaoutThemes = {
  DARK: 'dark',
  LIGHT: 'light',
  NVG: 'nvg',
  AMBER: 'amber',
};

/**
 * Alterna el modo visual del sistema táctico (Dark -> NVG -> Amber -> Light -> Dark)
 * @param {string} [requestedTheme] - Opcional: forzar un tema específico
 * @returns {string} El tema activo resultante
 */
export function toggleTacticalTheme(requestedTheme) {
  const root = document.documentElement;
  const currentThemes = ['dark', 'nvg', 'amber', 'light'];
  
  let nextTheme = requestedTheme;
  if (!nextTheme) {
    let active = 'dark';
    if (root.classList.contains('nvg')) active = 'nvg';
    else if (root.classList.contains('amber')) active = 'amber';
    else if (root.classList.contains('light')) active = 'light';

    const nextIdx = (currentThemes.indexOf(active) + 1) % currentThemes.length;
    nextTheme = currentThemes[nextIdx];
  }

  root.classList.remove('dark', 'light', 'nvg', 'amber');
  if (nextTheme === 'light') {
    root.classList.add('light');
  } else if (nextTheme === 'nvg') {
    root.classList.add('dark', 'nvg');
  } else if (nextTheme === 'amber') {
    root.classList.add('dark', 'amber');
  } else {
    root.classList.add('dark');
  }

  return nextTheme;
}

/**
 * Aplica delays de animación escalonados (stagger) a una lista de elementos DOM
 * @param {string|NodeList|HTMLElement[]} elements - Selector o elementos
 * @param {number} [baseDelayMs=50] - Retardo base por cada elemento (en milisegundos)
 */
export function applyStaggerAnimation(elements, baseDelayMs = 50) {
  const nodes = typeof elements === 'string' ? document.querySelectorAll(elements) : elements;
  nodes.forEach((el, index) => {
    el.style.animationDelay = `${index * baseDelayMs}ms`;
  });
}

/**
 * Crea un bucle de animación para radar táctico usando Canvas API
 * @param {HTMLCanvasElement} canvas
 * @param {Object} [options]
 * @returns {Function} Función para cancelar la animación
 */
export function initRadarSweepLoop(canvas, options = {}) {
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  let angle = 0;
  let animId = null;
  const speed = options.speed || 0.03;
  const sweepColor = options.color || 'rgba(56, 189, 248, 0.15)';

  function render() {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Dibujar línea y cono de barrido
    angle = (angle + speed) % (Math.PI * 2);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, angle - 0.25, angle);
    ctx.closePath();
    ctx.fillStyle = sweepColor;
    ctx.fill();
    ctx.restore();

    animId = requestAnimationFrame(render);
  }

  animId = requestAnimationFrame(render);
  return () => {
    if (animId) cancelAnimationFrame(animId);
  };
}
