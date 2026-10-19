/**
 * app.js — Orquestador de la landing BioScout (ARES Core)
 * Lógica reciclada del <script> inline original y refinada con buenas prácticas:
 *  - Sin listeners inline (event delegation / addEventListener).
 *  - Respeto a prefers-reduced-motion.
 *  - Accesibilidad de teclado (ESC en modal, foco gestionado).
 *  - requestAnimationFrame centralizado y pausado fuera del viewport.
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };

  /* ============================================================
     0. MODO VISUAL TÁCTICO (Dark → NVG → Amber → Light)
     Se recicla el comportamiento de animations/animations.js
     ============================================================ */
  var THEMES = ['dark', 'nvg', 'amber', 'light'];
  var THEME_META = {
    dark:  { label: 'Dark HUD',  icon: 'moon',  title: 'Modo visual: Dark HUD (nocturno)' },
    nvg:   { label: 'NVG',       icon: 'eye',   title: 'Modo visual: NVG fósforo verde' },
    amber: { label: 'Amber',     icon: 'flame', title: 'Modo visual: Amber FLIR térmico' },
    light: { label: 'Luz',       icon: 'sun',   title: 'Modo visual: Luz diurna' }
  };

  function currentTheme() {
    var root = document.documentElement;
    if (root.classList.contains('nvg')) return 'nvg';
    if (root.classList.contains('amber')) return 'amber';
    if (root.classList.contains('light')) return 'light';
    return 'dark';
  }

  function applyTheme(theme) {
    var root = document.documentElement;
    root.classList.remove('dark', 'light', 'nvg', 'amber');
    if (theme === 'light') root.classList.add('light');
    else if (theme === 'nvg') root.classList.add('dark', 'nvg');
    else if (theme === 'amber') root.classList.add('dark', 'amber');
    else root.classList.add('dark');

    try { localStorage.setItem('bioscout-theme', theme); } catch (e) {}

    var btn = $('#theme-toggle');
    if (btn) {
      var meta = THEME_META[theme] || THEME_META.dark;
      btn.setAttribute('title', meta.title);
      btn.setAttribute('aria-label', 'Cambiar modo visual. Actual: ' + meta.label);
      var labelEl = btn.querySelector('[data-theme-label]');
      if (labelEl) labelEl.textContent = meta.label;
      var iconEl = btn.querySelector('[data-theme-icon]');
      if (iconEl) iconEl.setAttribute('data-lucide', meta.icon);
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function initThemeSwitcher() {
    applyTheme(currentTheme());
    var btn = $('#theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var idx = THEMES.indexOf(currentTheme());
      applyTheme(THEMES[(idx + 1) % THEMES.length]);
    });
  }

  /* ============================================================
     0b. MENÚ DE NAVEGACIÓN MÓVIL ACCESIBLE
     ============================================================ */
  function initMobileMenu() {
    var toggle = $('#mobile-menu-toggle');
    var menu = $('#mobile-menu');
    if (!toggle || !menu) return;

    function setOpen(open) {
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
      var icon = toggle.querySelector('[data-lucide]');
      if (icon) icon.setAttribute('data-lucide', open ? 'x' : 'menu');
      if (window.lucide) window.lucide.createIcons();
    }

    toggle.addEventListener('click', function () { setOpen(menu.hidden); });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setOpen(false); toggle.focus(); }
    });
  }

  /* ============================================================
     1. PARTÍCULAS AMBIENTALES (polvo sísmico / micro-destellos)
     ============================================================ */
  function initAmbientParticles() {
    var canvas = $('#ambient-particles-canvas');
    if (!canvas || prefersReducedMotion) return;
    var ctx = canvas.getContext('2d');
    var w, h, particles = [];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    var count = Math.min(Math.floor(window.innerWidth / 16), 75);
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.35,
        vy: Math.random() * -0.45 - 0.1,
        alpha: Math.random() * 0.6 + 0.1,
        color: Math.random() > 0.45 ? 'rgba(249, 115, 22, ' : 'rgba(56, 189, 248, '
      });
    }

    (function render() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.y < 0) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
      }
      requestAnimationFrame(render);
    })();
  }

  /* ============================================================
     2. SOBREVUELO INICIAL DEL ENJAMBRE (ARES 01–04)
     ============================================================ */
  function initSwarmFlyover() {
    var container = $('#swarm-flyover-container');
    var canvas = $('#swarm-flyover-canvas');
    var banner = $('#flyover-hud-banner');
    if (!canvas || !container) return;

    if (prefersReducedMotion) {
      container.style.display = 'none';
      return;
    }

    var ctx = canvas.getContext('2d');
    var w, h, rotorAngle = 0, active = true;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function makeDrones() {
      return [
        { id: 'ARES-01', x: -160, y: h * 0.28, vx: 16.5, color: '#f97316', label: 'ARES-01 · Alfa', scanSize: 110, trail: [] },
        { id: 'ARES-02', x: -250, y: h * 0.20, vx: 17.2, color: '#38bdf8', label: 'ARES-02 · Bravo', scanSize: 85, trail: [] },
        { id: 'ARES-03', x: -290, y: h * 0.38, vx: 15.8, color: '#10b981', label: 'ARES-03 · Charlie', scanSize: 95, trail: [] },
        { id: 'ARES-04', x: -370, y: h * 0.26, vx: 16.2, color: '#fbbf24', label: 'ARES-04 · Delta', scanSize: 75, trail: [] }
      ];
    }
    var drones = makeDrones();

    function render() {
      if (!active) return;
      ctx.clearRect(0, 0, w, h);
      rotorAngle += 0.85;
      var allFinished = true;

      drones.forEach(function (d) {
        d.x += d.vx;
        if (d.x < w + 350) allFinished = false;

        d.trail.push({ x: d.x, y: d.y });
        if (d.trail.length > 28) d.trail.shift();

        for (var i = 0; i < d.trail.length - 1; i++) {
          var p1 = d.trail[i], p2 = d.trail[i + 1];
          ctx.strokeStyle = d.color;
          ctx.globalAlpha = (i / d.trail.length) * 0.65;
          ctx.lineWidth = (i / d.trail.length) * 3.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

        if (d.x > -80 && d.x < w + 80) {
          ctx.save();
          ctx.translate(d.x, d.y);

          var scanGrad = ctx.createLinearGradient(0, 0, 0, d.scanSize);
          scanGrad.addColorStop(0, 'rgba(249, 115, 22, 0.4)');
          scanGrad.addColorStop(0.7, 'rgba(249, 115, 22, 0.12)');
          scanGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');
          ctx.fillStyle = scanGrad;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-d.scanSize * 0.45, d.scanSize);
          ctx.lineTo(d.scanSize * 0.45, d.scanSize);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(-18, -18); ctx.lineTo(18, 18);
          ctx.moveTo(18, -18); ctx.lineTo(-18, 18);
          ctx.stroke();

          ctx.strokeStyle = d.color;
          ctx.lineWidth = 1.8;
          [[-18, -18], [18, -18], [-18, 18], [18, 18]].forEach(function (o) {
            ctx.save();
            ctx.translate(o[0], o[1]);
            ctx.rotate(rotorAngle);
            ctx.beginPath();
            ctx.ellipse(0, 0, 9, 3, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          });

          ctx.fillStyle = '#060911';
          ctx.strokeStyle = d.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(-9, -9, 18, 18, 5);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = d.color;
          ctx.beginPath();
          ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 9px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(d.label, 0, -22);
          ctx.restore();
        }
      });

      if (!allFinished) {
        requestAnimationFrame(render);
      } else {
        container.style.opacity = '0';
        if (banner) banner.style.opacity = '0';
        setTimeout(function () { container.style.display = 'none'; active = false; }, 850);
      }
    }

    requestAnimationFrame(render);

    var replay = $('#flyover-replay');
    if (replay) {
      replay.addEventListener('click', function () {
        active = true;
        container.style.display = 'block';
        container.style.opacity = '1';
        if (banner) banner.style.opacity = '1';
        drones = makeDrones();
        requestAnimationFrame(render);
      });
    }
  }

  /* ============================================================
     3. FOCO INTERACTIVO DEL CURSOR
     ============================================================ */
  function initMouseSpotlight() {
    var spotlight = $('#interactive-mouse-spotlight');
    if (!spotlight || prefersReducedMotion) return;
    if (window.matchMedia('(hover: none)').matches) return;

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var cx = mx, cy = my, shown = false;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!shown) { shown = true; spotlight.style.opacity = '1'; }
    }, { passive: true });

    (function loop() {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      spotlight.style.left = cx + 'px';
      spotlight.style.top = cy + 'px';
      requestAnimationFrame(loop);
    })();
  }

  /* ============================================================
     4. TARJETAS 3D TILT + SPOTLIGHT
     ============================================================ */
  function initTiltCards() {
    if (prefersReducedMotion) return;
    if (window.matchMedia('(hover: none)').matches) return;

    $$('.tilt-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
        var rotX = ((y - rect.height / 2) / (rect.height / 2)) * -9;
        var rotY = ((x - rect.width / 2) / (rect.width / 2)) * 9;
        card.style.transform = 'perspective(1000px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg) scale3d(1.02,1.02,1.02)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      });
    });
  }

  /* ============================================================
     5. CONTADOR NUMÉRICO DE MÉTRICAS
     ============================================================ */
  function initNumberTicker() {
    var counters = [
      { id: 'metric-latency-val', target: 18.2, decimals: 1, suffix: 'ms', live: function () { return (17 + Math.random() * 2.5).toFixed(1) + 'ms'; } },
      { id: 'metric-telemetry-val', target: 24.2, decimals: 1, suffix: ' Hz', live: function () { return (23 + (Math.random() - 0.5) * 2.4).toFixed(1) + ' Hz'; } },
      { id: 'metric-bubble-val', target: 15.0, decimals: 1, suffix: ' m', live: null },
      { id: 'metric-edge-val', target: 100, decimals: 0, suffix: '%', live: null }
    ];
    var container = $('#metrics-strip-container');
    var started = false;

    function run() {
      if (started) return;
      started = true;
      counters.forEach(function (item) {
        var el = document.getElementById(item.id);
        if (!el) return;
        var start = performance.now(), duration = 1800;
        (function tick(now) {
          var p = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (item.target * eased).toFixed(item.decimals) + item.suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = item.target.toFixed(item.decimals) + item.suffix;
        })(performance.now());
      });
      if (!prefersReducedMotion) {
        setInterval(function () {
          counters.forEach(function (item) {
            if (!item.live) return;
            var el = document.getElementById(item.id);
            if (el) el.textContent = item.live();
          });
        }, 1300);
      }
    }

    if (container && 'IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { run(); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.25 });
      obs.observe(container);
    } else {
      run();
    }
  }

  /* ============================================================
     6. HORA DORADA (<60 min) + RELOJ ZULU UTC
     ============================================================ */
  function initClocks() {
    var seconds = 59 * 60 + 59;
    var hero = $('#hero-countdown');
    var zulu = $('#nav-zulu-clock');

    function update() {
      if (seconds > 0) seconds--;
      var m = String(Math.floor(seconds / 60)).padStart(2, '0');
      var s = String(seconds % 60).padStart(2, '0');
      if (hero) hero.textContent = m + ':' + s + ' RESTANTES';
      if (zulu) zulu.textContent = new Date().toISOString().substring(11, 19) + 'Z';
    }
    update();
    setInterval(update, 1000);
  }

  /* ============================================================
     7. VIDEO HERO + MODAL ACCESIBLE
     ============================================================ */
  function initVideo() {
    var heroVideo = $('#hero-main-video');
    var playBtn = $('#video-play-toggle');
    var muteBtn = $('#video-mute-toggle');
    var modal = $('#video-modal');
    var modalVideo = $('#modal-video-player');
    var openBtn = $('#open-video-modal');
    var lastFocus = null;

    if (playBtn && heroVideo) {
      playBtn.addEventListener('click', function () {
        var playing = !heroVideo.paused;
        if (playing) heroVideo.pause(); else heroVideo.play();
        var txt = playBtn.querySelector('[data-video-label]');
        if (txt) txt.textContent = playing ? 'Reproducir' : 'Pausar';
        var ic = playBtn.querySelector('[data-video-icon]');
        if (ic) ic.setAttribute('data-lucide', playing ? 'play' : 'pause');
        if (window.lucide) window.lucide.createIcons();
      });
    }

    if (muteBtn && heroVideo) {
      muteBtn.addEventListener('click', function () {
        heroVideo.muted = !heroVideo.muted;
        var txt = muteBtn.querySelector('[data-video-label]');
        if (txt) txt.textContent = heroVideo.muted ? 'Sonido' : 'Silenciar';
        var ic = muteBtn.querySelector('[data-video-icon]');
        if (ic) ic.setAttribute('data-lucide', heroVideo.muted ? 'volume-x' : 'volume-2');
        if (window.lucide) window.lucide.createIcons();
      });
    }

    // Controles personalizados del video del modal (los controles nativos del
    // <video> capturan la tecla ESC y añaden paradas de tabulación)
    var modalPlayBtn = $('#modal-play-toggle');
    var modalMuteBtn = $('#modal-mute-toggle');

    function updateModalPlay() {
      if (!modalPlayBtn || !modalVideo) return;
      var playing = !modalVideo.paused;
      var lbl = modalPlayBtn.querySelector('[data-modal-play-label]');
      if (lbl) lbl.textContent = playing ? 'Pausar' : 'Reproducir';
      var ic = modalPlayBtn.querySelector('[data-modal-play-icon]');
      if (ic) ic.setAttribute('data-lucide', playing ? 'pause' : 'play');
      if (window.lucide) window.lucide.createIcons();
    }
    function updateModalMute() {
      if (!modalMuteBtn || !modalVideo) return;
      var muted = modalVideo.muted;
      var lbl = modalMuteBtn.querySelector('[data-modal-mute-label]');
      if (lbl) lbl.textContent = muted ? 'Activar sonido' : 'Silenciar';
      var ic = modalMuteBtn.querySelector('[data-modal-mute-icon]');
      if (ic) ic.setAttribute('data-lucide', muted ? 'volume-x' : 'volume-2');
      if (window.lucide) window.lucide.createIcons();
    }
    if (modalPlayBtn && modalVideo) {
      modalPlayBtn.addEventListener('click', function () {
        if (modalVideo.paused) modalVideo.play().catch(function () {}); else modalVideo.pause();
        updateModalPlay();
      });
    }
    if (modalMuteBtn && modalVideo) {
      modalMuteBtn.addEventListener('click', function () {
        modalVideo.muted = !modalVideo.muted;
        updateModalMute();
      });
    }
    if (modalVideo) {
      modalVideo.addEventListener('play', updateModalPlay);
      modalVideo.addEventListener('pause', updateModalPlay);
    }

    function setBackgroundInert(on) {
      ['header', 'main', 'footer'].forEach(function (sel) {
        var el = document.querySelector(sel);
        if (!el) return;
        if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert');
      });
    }

    function openModal() {
      if (!modal) return;
      lastFocus = document.activeElement;
      modal.classList.remove('hidden-modal');
      document.body.style.overflow = 'hidden';
      setBackgroundInert(true);
      if (modalVideo) {
        modalVideo.muted = true;
        modalVideo.play().catch(function () {});
        updateModalMute();
        updateModalPlay();
      }
      var close = modal.querySelector('[data-modal-close]');
      // Espera a que el panel deje de estar oculto para poder recibir el foco
      requestAnimationFrame(function () {
        if (close) close.focus();
        // Red de seguridad por si la transición retrasa la visibilidad
        setTimeout(function () {
          if (!modal.contains(document.activeElement) && close) close.focus();
        }, 220);
      });
    }
    function closeModal() {
      if (!modal) return;
      modal.classList.add('hidden-modal');
      document.body.style.overflow = '';
      setBackgroundInert(false);
      if (modalVideo) { modalVideo.pause(); updateModalPlay(); }
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    $$('[data-modal-close]').forEach(function (b) { b.addEventListener('click', closeModal); });
    if (modal) {
      modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    }
    // Trampa de foco y cierre con ESC a nivel de documento (fase de captura:
    // evita que los controles nativos del <video> se queden el evento)
    document.addEventListener('keydown', function (e) {
      if (!modal || modal.classList.contains('hidden-modal')) return;
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key !== 'Tab') return;
      var f = modal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }, true);
  }

  /* ============================================================
     8. EXPORTADORES POST-MISIÓN (AAR + Waypoints QGC)
     ============================================================ */
  function download(filename, content, type) {
    var blob = new Blob([content], { type: type });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  }

  function initExporters() {
    $$('[data-export-aar]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var payload = {
          mision_id: 'BIOSCOUT-ARES-SAR-HORA-DORADA',
          timestamp: new Date().toISOString(),
          topologia: '100% EDGE COMPUTING OFFLINE DESCENTRALIZADO',
          repositorio_oficial: 'https://github.com/NotMetrx/ARES-Autonomous-Rescue-Emergency-System-',
          equipo_mando: {
            tech_lead_frontend: 'Jhoao López',
            lead_qa_tester: 'Aron Ayala',
            ai_backend_architect: 'Valentín García',
            asesor_tecnico: 'Charlen Calero H.'
          },
          institucion: 'SENATI',
          integridad_criptografica_sha256: '9f4a13d80e81b672c5a01f92e8d47b2c9e7a83d1c056fae84129b0f47e2c9183',
          cinematica_evasion: {
            protocolo: 'Punto de Mayor Aproximación (CPA) + Filtro Kalman 6-DOF',
            radio_burbuja_tactica_metros: 15.0,
            latencia_reaccion_ms: 18.2,
            limite_maximo_latencia_ms: 50.0
          },
          motor_percepcion: {
            modelo: 'D-FINE (RT-DETR)',
            calibracion: 'Supresión Espectral Térmica por Tasa de Falsos Descubrimientos (FDR)',
            confianza_detectada: 0.984
          },
          casos_historicos_calibrados: [
            'Tragedia de Vargas (Venezuela, 1999) - Aislamiento vial masivo por aludes',
            'Avalancha de Mocoa (Colombia, 2017) - Apagón nocturno y colapso de triage',
            'Terremoto de Pisco (Perú, 2007) - Fractura de Panamericana Sur'
          ]
        };
        download('BioScout_ARES_AAR_Auditoria_' + Date.now() + '.json', JSON.stringify(payload, null, 2), 'application/json');
      });
    });

    $$('[data-export-waypoints]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var qgc = 'QGC WPL 110\n' +
          '0\t1\t0\t16\t0\t0\t0\t0\t-13.714200\t-76.204500\t25.000000\t1\n' +
          '1\t0\t3\t16\t0\t0\t0\t0\t-13.714600\t-76.204100\t30.000000\t1\n' +
          '2\t0\t3\t16\t0\t0\t0\t0\t-13.715100\t-76.204700\t28.000000\t1\n' +
          '3\t0\t3\t16\t0\t0\t0\t0\t-13.714800\t-76.205200\t32.000000\t1\n' +
          '4\t0\t3\t20\t0\t0\t0\t0\t-13.714200\t-76.204500\t0.000000\t1\n';
        download('BioScout_ARES_Ruta_' + Date.now() + '.waypoints', qgc, 'text/plain');
      });
    });
  }

  /* ============================================================
     9. RADAR TÁCTICO (Canvas 2D)
     ============================================================ */
  function initRadar() {
    var canvas = $('#tactical-radar-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var animate = !prefersReducedMotion;

    var rangeMeters = 100;
    var sweep = 0;
    var cpaCount = 0;
    var hazardActive = false;
    var hazard = { x: 35, y: -45, vx: -0.65, vy: 0.55 };

    var nodes = [
      { id: 'ARES-01', x: 22, y: -20, vx: -0.28, vy: 0.22, bat: 89, active: true, color: '#f97316' },
      { id: 'ARES-02', x: -28, y: 22, vx: 0.26, vy: -0.24, bat: 78, active: true, color: '#10b981' },
      { id: 'ARES-03', x: 38, y: 32, vx: -0.24, vy: -0.32, bat: 65, active: true, color: '#38bdf8' },
      { id: 'ARES-04', x: 0, y: 0, vx: 0, vy: 0, bat: 100, active: false, color: '#64748b' }
    ];
    var victims = [
      { id: 'VIC-01', x: -42, y: -28, confidence: 98.7 },
      { id: 'VIC-02', x: 30, y: 45, confidence: 97.4 }
    ];

    function setRange(range) {
      rangeMeters = range;
      ['50', '100', '200'].forEach(function (r) {
        var btn = document.getElementById('btn-range-' + r);
        if (!btn) return;
        var active = String(r) === String(range);
        btn.className = active
          ? 'px-2.5 py-1 rounded-lg bg-rescue-500 text-obsidian-950 font-bold transition-all'
          : 'px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition-all';
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    }

    ['50', '100', '200'].forEach(function (r) {
      var btn = document.getElementById('btn-range-' + r);
      if (btn) btn.addEventListener('click', function () { setRange(Number(r)); });
    });

    var injectBtn = $('#radar-inject-obstacle');
    if (injectBtn) {
      injectBtn.addEventListener('click', function () {
        hazardActive = true;
        hazard = { x: 42, y: -48, vx: -0.75, vy: 0.65 };
        cpaCount++;
        var el = $('#radar-cpa-count');
        if (el) el.textContent = cpaCount;
        setTimeout(function () { hazardActive = false; }, 9500);
      });
    }

    var handoverBtn = $('#radar-handover');
    if (handoverBtn) {
      handoverBtn.addEventListener('click', function () {
        var u3 = nodes[2], u4 = nodes[3];
        u3.bat = 19; u3.color = '#f43f5e';
        u4.active = true; u4.vx = 0.32; u4.vy = -0.28; u4.color = '#f97316';

        var b3 = $('#ares-03-bat'), s3 = $('#ares-03-status'), d3 = $('#ares-03-dot');
        if (b3) { b3.textContent = '19%'; b3.className = 'text-rose-400 font-bold'; }
        if (s3) { s3.textContent = 'RELEVO <22%'; s3.className = 'text-[10px] text-rose-400 font-bold'; }
        if (d3) d3.className = 'w-2 h-2 rounded-full bg-rose-500 animate-ping';

        var s4 = $('#ares-04-status'), d4 = $('#ares-04-dot');
        if (s4) { s4.textContent = 'PATRULLA EN VUELO'; s4.className = 'text-[10px] text-cyan-400 font-bold'; }
        if (d4) d4.className = 'w-2 h-2 rounded-full bg-cyan-400';

        var banner = $('#radar-handover-banner');
        if (banner) banner.hidden = false;
      });
    }

    var dismiss = $('#radar-handover-dismiss');
    if (dismiss) dismiss.addEventListener('click', function () {
      var banner = $('#radar-handover-banner');
      if (banner) banner.hidden = true;
    });

    function draw() {
      var w = canvas.width, h = canvas.height;
      var cx = w / 2, cy = h / 2;
      var radius = Math.min(cx, cy) - 25;
      var scale = radius / rangeMeters;

      ctx.clearRect(0, 0, w, h);
      ctx.save();

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#030408';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
      ctx.stroke();

      var rings = 4;
      for (var i = 1; i <= rings; i++) {
        var r = (radius / rings) * i;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = i === rings ? 'rgba(249, 115, 22, 0.35)' : 'rgba(249, 115, 22, 0.14)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = 'rgba(251, 146, 60, 0.6)';
        ctx.font = '10px "JetBrains Mono"';
        ctx.fillText(Math.round((rangeMeters / rings) * i) + 'm', cx + 6, cy - r + 12);
      }

      ctx.strokeStyle = 'rgba(249, 115, 22, 0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy); ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius); ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      for (var deg = 0; deg < 360; deg += 30) {
        var rad = (deg * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(rad) * (radius - 6), cy + Math.sin(rad) * (radius - 6));
        ctx.lineTo(cx + Math.cos(rad) * radius, cy + Math.sin(rad) * radius);
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
        ctx.stroke();
      }

      sweep += 0.022;
      if (sweep >= Math.PI * 2) sweep = 0;
      var az = String(Math.round((sweep * 180) / Math.PI)).padStart(3, '0');
      var azEl = $('#radar-beam-azimuth');
      if (azEl) azEl.textContent = az + '.0°';

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, sweep - 0.4, sweep);
      ctx.closePath();
      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      g.addColorStop(0, 'rgba(249, 115, 22, 0.28)');
      g.addColorStop(1, 'rgba(249, 115, 22, 0.02)');
      ctx.fillStyle = g;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweep) * radius, cy + Math.sin(sweep) * radius);
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      victims.forEach(function (vic) {
        var vx = cx + vic.x * scale, vy = cy + vic.y * scale;
        var va = Math.atan2(vic.y, vic.x);
        var nva = va < 0 ? va + Math.PI * 2 : va;
        var diff = Math.abs(sweep - nva);

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(vx - 9, vy - 9, 18, 18);
        ctx.beginPath();
        ctx.arc(vx, vy, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();
        if (diff < 0.25) {
          ctx.beginPath();
          ctx.arc(vx, vy, 16, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
          ctx.stroke();
        }
        ctx.fillStyle = '#10b981';
        ctx.font = '9px "JetBrains Mono"';
        ctx.fillText(vic.id + ' [' + vic.confidence + '% FDR]', vx + 12, vy + 4);
      });

      if (hazardActive) {
        hazard.x += hazard.vx; hazard.y += hazard.vy;
        var hx = cx + hazard.x * scale, hy = cy + hazard.y * scale;
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(hx, hy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(hx - 10, hy - 10, 20, 20);
        ctx.fillStyle = '#f43f5e';
        ctx.font = '10px "JetBrains Mono"';
        ctx.fillText('ESCOMBRO / ALERTA CPA', hx + 13, hy + 4);
      }

      var bubblePx = 15.0 * scale;
      nodes.forEach(function (d) {
        if (!d.active && d.vx === 0) return;
        d.x += d.vx; d.y += d.vy;
        if (Math.abs(d.x) > rangeMeters * 0.75) d.vx *= -1;
        if (Math.abs(d.y) > rangeMeters * 0.75) d.vy *= -1;
        if (hazardActive) {
          var dx = d.x - hazard.x, dy = d.y - hazard.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 22) { d.vx += (dx / dist) * 0.45; d.vy += (dy / dist) * 0.45; }
        }
        var px = cx + d.x * scale, py = cy + d.y * scale;

        ctx.beginPath();
        ctx.arc(px, py, bubblePx, 0, Math.PI * 2);
        ctx.strokeStyle = d.color === '#f43f5e' ? 'rgba(244,63,94,0.45)' : 'rgba(249,115,22,0.22)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + d.vx * 22, py + d.vy * 22);
        ctx.strokeStyle = d.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '10px "Plus Jakarta Sans"';
        ctx.fillText(d.id, px + 7, py - 6);
      });

      ctx.restore();
      if (animate) requestAnimationFrame(draw);
    }

    // Pausa el radar cuando no está en pantalla (rendimiento)
    if ('IntersectionObserver' in window) {
      var running = false;
      var radarSection = canvas.closest('section') || canvas;
      var vis = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !running) {
            running = true;
            requestAnimationFrame(draw);
          } else if (!entry.isIntersecting) {
            running = false;
          }
        });
      }, { threshold: 0.08 });
      vis.observe(radarSection);
    } else {
      requestAnimationFrame(draw);
    }
  }

  /* ============================================================
     BOOTSTRAP
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    if (window.lucide) window.lucide.createIcons();
    initThemeSwitcher();
    initMobileMenu();
    initClocks();
    initNumberTicker();
    initTiltCards();
    initMouseSpotlight();
    initAmbientParticles();
    initSwarmFlyover();
    initVideo();
    initExporters();
    initRadar();
  });
})();
