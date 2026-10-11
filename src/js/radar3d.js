/**
 * radar3d.js - Simulador Táctico de Enjambre 3D en Three.js
 * Visualización espacial de espacio aéreo, barrido 3D, burbuja de seguridad de 15m y evasión CPA.
 */

(function initThreeRadar() {
  const container = document.getElementById('three-radar-container');
  const canvas = document.getElementById('three-radar-canvas');
  if (!container || !canvas) return;

  // 1. Escena, Cámara y Renderizador
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020617, 0.005);

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    1,
    1000
  );
  camera.position.set(0, 75, 120);
  camera.lookAt(0, 10, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 2. Iluminación Táctica
  const ambientLight = new THREE.AmbientLight(0x06b6d4, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(40, 80, 50);
  scene.add(dirLight);

  // Luz puntual central de barrido
  const centerLight = new THREE.PointLight(0x00f2fe, 1.5, 120);
  centerLight.position.set(0, 15, 0);
  scene.add(centerLight);

  // 3. Terreno Holográfico & Grilla de Distancia
  let radarRange = 100;
  const gridGroup = new THREE.Group();
  scene.add(gridGroup);

  // Anillos concéntricos de radar (50m, 100m, 150m, 200m)
  const ringMaterial = new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.35 });
  const ringRadii = [25, 50, 75, 100];
  
  ringRadii.forEach(radius => {
    const ringGeo = new THREE.BufferGeometry();
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    ringGeo.setFromPoints(points);
    const ring = new THREE.Line(ringGeo, ringMaterial);
    gridGroup.add(ring);
  });

  // Ejes cardinales
  const axisMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.25 });
  const axisGeo = new THREE.BufferGeometry();
  axisGeo.setFromPoints([
    new THREE.Vector3(-105, 0, 0), new THREE.Vector3(105, 0, 0),
    new THREE.Vector3(0, 0, -105), new THREE.Vector3(0, 0, 105)
  ]);
  const axisLines = new THREE.LineSegments(axisGeo, axisMat);
  gridGroup.add(axisLines);

  // Malla de relieve topográfico de escombros/zona de colapso
  const terrainGeo = new THREE.PlaneGeometry(210, 210, 32, 32);
  terrainGeo.rotateX(-Math.PI / 2);
  const posAttr = terrainGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);
    // Relieve suave simulando montículos de escombros
    const d = Math.sqrt(x * x + z * z);
    const elevation = (Math.sin(x * 0.08) * Math.cos(z * 0.08) * 4) * Math.min(1, d / 20);
    posAttr.setY(i, elevation - 2);
  }
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    color: 0x091428,
    wireframe: true,
    transparent: true,
    opacity: 0.28
  });
  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  scene.add(terrainMesh);

  // 4. Haz de Barrido 3D Giratorio (Radar Sweep Cone)
  const sweepGroup = new THREE.Group();
  scene.add(sweepGroup);

  const sweepGeo = new THREE.BufferGeometry();
  const sweepVertices = [];
  const sweepColors = [];
  const sweepSegments = 24;
  const sweepAngle = Math.PI / 4;

  for (let i = 0; i <= sweepSegments; i++) {
    const a = (i / sweepSegments) * sweepAngle;
    sweepVertices.push(0, 0, 0);
    sweepVertices.push(Math.cos(a) * 105, 0, Math.sin(a) * 105);

    const alpha = (i / sweepSegments);
    sweepColors.push(0, 0.9, 1, 0.5 * alpha);
    sweepColors.push(0, 0.9, 1, 0.0);
  }
  sweepGeo.setAttribute('position', new THREE.Float32BufferAttribute(sweepVertices, 3));

  const sweepMat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide
  });

  const sweepMesh = new THREE.Mesh(
    new THREE.RingGeometry(0, 105, 32, 1, 0, Math.PI / 3),
    sweepMat
  );
  sweepMesh.rotation.x = -Math.PI / 2;
  sweepGroup.add(sweepMesh);

  // Línea de barrido frontal brillante
  const sweepLineMat = new THREE.LineBasicMaterial({ color: 0x00f2fe, linewidth: 2 });
  const sweepLineGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0.2, 0),
    new THREE.Vector3(105, 0.2, 0)
  ]);
  const sweepFrontLine = new THREE.Line(sweepLineGeo, sweepLineMat);
  sweepGroup.add(sweepFrontLine);

  // 5. Creación de los 4 Drones UAV con sus Burbujas de 15m
  const droneData = [
    { id: 'ARES-01', name: 'Alpha (Líder)', x: 25, z: -20, alt: 28, vx: -0.15, vz: 0.12, bat: 88, color: 0x00f2fe },
    { id: 'ARES-02', name: 'Bravo (Térmico)', x: -35, z: 25, alt: 34, vx: 0.14, vz: -0.11, bat: 76, color: 0x10b981 },
    { id: 'ARES-03', name: 'Charlie (Recon)', x: 42, z: 32, alt: 22, vx: -0.12, vz: -0.15, bat: 64, color: 0x00f2fe },
    { id: 'ARES-04', name: 'Delta (Standby)', x: 0, z: 0, alt: 2, vx: 0, vz: 0, bat: 100, color: 0x64748b, standby: true }
  ];

  const droneMeshes = [];
  const BUBBLE_RADIUS = 15.0; // 15 metros esféricos según SPEC.md

  droneData.forEach(data => {
    const droneGroup = new THREE.Group();
    droneGroup.position.set(data.x, data.alt, data.z);

    // Fuselaje central del cuadricóptero
    const bodyGeo = new THREE.BoxGeometry(4, 1.2, 4);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.8
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    droneGroup.add(body);

    // Ojo de sensor frontal con luz emisiva
    const eyeGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: data.color });
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.set(0, 0, 2);
    droneGroup.add(eye);

    // Brazos y 4 Rotores
    const armMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 });
    const rotorMat = new THREE.MeshBasicMaterial({ color: data.color, transparent: true, opacity: 0.7 });
    const rotors = [];

    const offsets = [[-3, -3], [3, -3], [-3, 3], [3, 3]];
    offsets.forEach(([ox, oz]) => {
      const armGeo = new THREE.CylinderGeometry(0.3, 0.3, 4);
      armGeo.rotateZ(Math.PI / 4);
      const arm = new THREE.Mesh(armGeo, armMat);
      arm.position.set(ox * 0.5, 0, oz * 0.5);
      droneGroup.add(arm);

      // Disco de hélice giratoria
      const rotorGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.1, 16);
      const rotor = new THREE.Mesh(rotorGeo, rotorMat);
      rotor.position.set(ox, 0.6, oz);
      droneGroup.add(rotor);
      rotors.push(rotor);
    });

    // Burbuja de Seguridad Táctica de 15 Metros (Esfera alámbrica translúcida)
    const bubbleGeo = new THREE.SphereGeometry(BUBBLE_RADIUS, 24, 24);
    const bubbleMat = new THREE.MeshBasicMaterial({
      color: data.color,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
    droneGroup.add(bubble);

    // Proyección vertical al suelo (Altitud láser)
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -data.alt, 0)
    ]);
    const lineMat = new THREE.LineDashedMaterial({
      color: data.color,
      dashSize: 2,
      gapSize: 1,
      transparent: true,
      opacity: 0.4
    });
    const altLine = new THREE.Line(lineGeo, lineMat);
    altLine.computeLineDistances();
    droneGroup.add(altLine);

    scene.add(droneGroup);
    droneMeshes.push({ group: droneGroup, data, rotors, bubble, altLine });
  });

  // 6. Sobreviviente Detectado por D-FINE (Marcador 3D)
  const survivorGroup = new THREE.Group();
  survivorGroup.position.set(-38, 0, -32);

  const markerGeo = new THREE.CylinderGeometry(0.2, 2.5, 6, 4);
  const markerMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  const marker = new THREE.Mesh(markerGeo, markerMat);
  marker.position.y = 3;
  survivorGroup.add(marker);

  // Halo en el suelo
  const haloGeo = new THREE.RingGeometry(2, 4.5, 32);
  haloGeo.rotateX(-Math.PI / 2);
  const haloMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.6 });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.position.y = 0.1;
  survivorGroup.add(halo);

  scene.add(survivorGroup);

  // 7. Obstáculo 3D Inyectable
  let obstacleMesh = null;
  let obstacleData = { active: false, x: 40, y: 25, z: -40, vx: -0.4, vz: 0.35 };

  function spawn3DObstacle() {
    if (obstacleMesh) scene.remove(obstacleMesh);

    obstacleData.active = true;
    obstacleData.x = 45;
    obstacleData.y = 28;
    obstacleData.z = -45;

    const obsGeo = new THREE.DodecahedronGeometry(6);
    const obsMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      wireframe: true,
      emissive: 0xd97706,
      emissiveIntensity: 0.4
    });
    obstacleMesh = new THREE.Mesh(obsGeo, obsMat);
    obstacleMesh.position.set(obstacleData.x, obstacleData.y, obstacleData.z);
    scene.add(obstacleMesh);

    // Incrementar contador de evasiones
    const evEl = document.getElementById('metric-cpa-count');
    if (evEl) {
      evEl.innerText = parseInt(evEl.innerText || '0') + 1;
    }

    setTimeout(() => {
      obstacleData.active = false;
      if (obstacleMesh) scene.remove(obstacleMesh);
    }, 9500);
  }

  // 8. Simulación de Handover al 22%
  function triggerHandover3D() {
    const charlie = droneMeshes[2];
    const delta = droneMeshes[3];

    // Charlie cae a batería crítica < 22%
    charlie.data.bat = 19;
    charlie.bubble.material.color.setHex(0xf43f5e);
    charlie.data.vx = -0.05;
    charlie.data.vz = 0.05;

    // Delta despega y toma el sector
    delta.data.standby = false;
    delta.data.alt = 26;
    delta.data.vx = 0.2;
    delta.data.vz = -0.15;
    delta.data.color = 0x00f2fe;
    delta.bubble.material.color.setHex(0x00f2fe);
    delta.bubble.material.opacity = 0.22;

    const notif = document.getElementById('handover-banner-hud');
    if (notif) {
      notif.classList.remove('hidden');
      setTimeout(() => notif.classList.add('hidden'), 8000);
    }
  }

  // Exponer funciones globales
  window.trigger3DObstacle = spawn3DObstacle;
  window.trigger3DHandover = triggerHandover3D;

  window.set3DRadarRange = function(range) {
    radarRange = range;
    const disp = document.getElementById('three-range-indicator');
    if (disp) disp.innerText = `${range}m`;
    
    // Ajustar escala de la grilla
    const factor = range / 100;
    gridGroup.scale.set(factor, 1, factor);
    terrainMesh.scale.set(factor, 1, factor);
    sweepGroup.scale.set(factor, 1, factor);
  };

  // 9. Interacción con el Mouse para Orbitar la Cámara
  let isDragging = false;
  let prevMousePos = { x: 0, y: 0 };
  let sphericalAngle = { theta: 0, phi: Math.PI / 4, radius: 135 };

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMousePos = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - prevMousePos.x;
    const deltaY = e.clientY - prevMousePos.y;

    sphericalAngle.theta -= deltaX * 0.008;
    sphericalAngle.phi = Math.max(0.15, Math.min(Math.PI / 2.2, sphericalAngle.phi + deltaY * 0.008));

    prevMousePos = { x: e.clientX, y: e.clientY };
  });

  // Zoom con rueda del ratón
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    sphericalAngle.radius = Math.max(60, Math.min(220, sphericalAngle.radius + e.deltaY * 0.1));
  }, { passive: false });

  // 10. Bucle Principal de Renderizado y Física Cinemática
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Actualizar cámara orbital
    camera.position.x = sphericalAngle.radius * Math.sin(sphericalAngle.phi) * Math.sin(sphericalAngle.theta);
    camera.position.y = sphericalAngle.radius * Math.cos(sphericalAngle.phi);
    camera.position.z = sphericalAngle.radius * Math.sin(sphericalAngle.phi) * Math.cos(sphericalAngle.theta);
    camera.lookAt(0, 15, 0);

    // Rotación del haz de barrido (360° en 4s => ~1.57 rad/s)
    sweepGroup.rotation.y += delta * 1.57;

    // Animación del halo del superviviente
    halo.scale.setScalar(1 + Math.sin(time * 3) * 0.15);

    // Actualizar obstáculo si está activo
    if (obstacleData.active && obstacleMesh) {
      obstacleData.x += obstacleData.vx;
      obstacleData.z += obstacleData.vz;
      obstacleMesh.position.set(obstacleData.x, obstacleData.y, obstacleData.z);
      obstacleMesh.rotation.x += delta * 2;
      obstacleMesh.rotation.y += delta * 1.5;
    }

    // Cinemática de los Drones UAV
    droneMeshes.forEach(({ group, data, rotors, altLine }, index) => {
      // Rotar hélices
      rotors.forEach((r, i) => {
        r.rotation.y += (i % 2 === 0 ? 1 : -1) * 25 * delta;
      });

      if (!data.standby) {
        // Oscilación sinusoidal de vuelo suave
        const bob = Math.sin(time * 2 + index) * 0.5;

        data.x += data.vx;
        data.z += data.vz;

        // Rebotar dentro del límite de rango
        const bound = (radarRange * 0.85);
        if (Math.abs(data.x) > bound) data.vx *= -1;
        if (Math.abs(data.z) > bound) data.vz *= -1;

        // Evasión reactiva CPA ante obstáculo activo (< 50ms)
        if (obstacleData.active) {
          const dx = data.x - obstacleData.x;
          const dz = data.z - obstacleData.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < 25) {
            data.vx += (dx / dist) * 0.6;
            data.vz += (dz / dist) * 0.6;
            // Elevación reactiva de seguridad
            data.alt = Math.min(45, data.alt + 0.3);
          }
        }

        group.position.set(data.x, data.alt + bob, data.z);

        // Actualizar línea de altitud
        const points = [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, -(data.alt + bob), 0)
        ];
        altLine.geometry.setFromPoints(points);
        altLine.computeLineDistances();
      }
    });

    renderer.render(scene, camera);
  }

  animate();

  // Redimensionamiento responsivo
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
})();
