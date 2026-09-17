/**
 * Pari Publicity - High-End 3D Three.js WebGL Universe Engine
 * ============================================================================
 * An authored, interactive scroll-driven 3D WebGL experience featuring:
 * 1. Scene 0: 3D Dual-P Brand Monolith & Gyro Orbital Rings (Hero)
 * 2. Scene 1: High-Speed Industrial Flex Rollers & Flowing Banner Ribbon
 * 3. Scene 2: Prime Highway Uni-Pole Billboard with Spotlights & Traffic Trails
 * 4. Scene 3: 3D Acrylic LED Signage ("PARI") with Polished Floor Reflections
 * 5. Scene 4: VIP Hotline Nexus with Glowing WhatsApp Beacon & Particle Vortex
 * ============================================================================
 */

import * as THREE from 'three';

let renderer, scene, camera, canvas;
let isInitialized = false;
let isVisible = true;

// Scene groups
let groupEmblem, groupPrintMachine, groupHoarding, groupGlowSign, groupHotline;
let particleSystem, highwayTrails;
let orbitalRing1, orbitalRing2, printRollers = [], flexRibbonMesh;

// Interactive drag rotation state
const drag = {
  isDragging: false,
  previousMouseX: 0,
  previousMouseY: 0,
  rotVelocityX: 0,
  rotVelocityY: 0,
  manualRotX: 0,
  manualRotY: 0
};

// Mouse tracking & parallax
const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
let scrollProgress = 0;
let targetScrollProgress = 0;

// Camera spline waypoints [scrollProgress: 0.0 to 1.0]
const cameraKeyframes = [
  // Scene 0: Brand Horizon (Hero) - scroll: 0.0
  { p: 0.00, pos: new THREE.Vector3(0, 0.5, 11), look: new THREE.Vector3(0, 0.3, 0) },
  // Transition to Flex Arena
  { p: 0.12, pos: new THREE.Vector3(2.5, -6, 13), look: new THREE.Vector3(0, -9, 0) },
  // Scene 1: Print & Flex Arena - scroll: 0.25
  { p: 0.25, pos: new THREE.Vector3(0, -13, 12), look: new THREE.Vector3(0, -13, 0) },
  // Transition to Highway Hoarding
  { p: 0.38, pos: new THREE.Vector3(-3.5, -20, 15), look: new THREE.Vector3(0, -26, 0) },
  // Scene 2: Prime Highway Hoarding - scroll: 0.50
  { p: 0.50, pos: new THREE.Vector3(0, -26, 13.5), look: new THREE.Vector3(0, -26, 0) },
  // Transition to 3D Acrylic LED Signage
  { p: 0.63, pos: new THREE.Vector3(3.5, -33, 14), look: new THREE.Vector3(0, -39, 0) },
  // Scene 3: 3D Acrylic LED Signage - scroll: 0.75
  { p: 0.75, pos: new THREE.Vector3(0, -39, 12.5), look: new THREE.Vector3(0, -39, 0) },
  // Transition to Hotline Nexus
  { p: 0.88, pos: new THREE.Vector3(-2.5, -46, 13), look: new THREE.Vector3(0, -52, 0) },
  // Scene 4: Hotline Nexus & Quote Gateway - scroll: 1.00
  { p: 1.00, pos: new THREE.Vector3(0, -52, 11), look: new THREE.Vector3(0, -52, 0) }
];

const currentCamPos = new THREE.Vector3(0, 0.5, 11);
const currentLookAt = new THREE.Vector3(0, 0.3, 0);

export function initThreeWorld() {
  canvas = document.getElementById('gl');
  if (!canvas || isInitialized) return;

  try {
    // 1. WebGL Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    // 2. Scene & Subtle Atmospheric Fog
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.008);

    // 3. Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.3, 200);
    camera.position.copy(currentCamPos);
    camera.lookAt(currentLookAt);

    // 4. Global Lighting Rig
    setupLighting();

    // 5. Build 3D Feature Scenes
    buildScene0Emblem();
    updateEmblemPositionToDOM();
    buildScene1PrintArena();
    buildScene2HighwayHoarding();
    buildScene3AcrylicSign();
    buildScene4HotlineNexus();

    // 6. Background Particle Cosmos
    buildParticleCosmos();

    // 7. Event Listeners & Interaction
    setupEventListeners();

    // 8. Animation Loop
    isInitialized = true;
    animate();

    // Initial scroll sync
    onScroll();
  } catch (err) {
    console.error('Three.js initialization failed:', err);
  }
}

/* --------------------------------------------------------------------------
   LIGHTING RIG (VIBRANT NEON & SPECULAR KEY LIGHTS)
   -------------------------------------------------------------------------- */
function setupLighting() {
  // Ambient fill
  const ambient = new THREE.AmbientLight(0x18284d, 2.5);
  scene.add(ambient);

  // Directional moonlight key light
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
  keyLight.position.set(10, 20, 15);
  scene.add(keyLight);

  // Electric Cobalt Blue rim light
  const blueRim = new THREE.DirectionalLight(0x2b7fff, 4.0);
  blueRim.position.set(-14, 5, 10);
  scene.add(blueRim);

  // Neon Hot Magenta rim light
  const magentaRim = new THREE.DirectionalLight(0xff007a, 3.8);
  magentaRim.position.set(14, -10, 8);
  scene.add(magentaRim);

  // Warm Gold fill light
  const goldLight = new THREE.PointLight(0xffb800, 2.5, 30);
  goldLight.position.set(0, 4, 6);
  scene.add(goldLight);
}

/* --------------------------------------------------------------------------
   ALIGN 3D EMBLEM PRECISELY WITH THE HERO VIEWPORT DOM ELEMENT
   -------------------------------------------------------------------------- */
function updateEmblemPositionToDOM() {
  if (!groupEmblem || !camera) return;

  const viewportEl = document.getElementById('stageViewport');
  if (viewportEl) {
    const rect = viewportEl.getBoundingClientRect();
    const ndcX = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1;
    const ndcY = -(((rect.top + rect.height / 2) / window.innerHeight) * 2 - 1);

    const vec = new THREE.Vector3(ndcX, ndcY, 0.5);
    vec.unproject(camera);
    vec.sub(camera.position).normalize();
    const distance = -camera.position.z / vec.z;
    const worldPos = camera.position.clone().add(vec.multiplyScalar(distance));

    groupEmblem.position.x = worldPos.x;
    groupEmblem.position.y = worldPos.y;
  } else {
    groupEmblem.position.x = window.innerWidth > 992 ? 2.6 : 0;
    groupEmblem.position.y = 0.4;
  }

  // Responsive scale
  if (window.innerWidth < 768) {
    groupEmblem.scale.set(0.72, 0.72, 0.72);
  } else if (window.innerWidth < 1024) {
    groupEmblem.scale.set(0.85, 0.85, 0.85);
  } else {
    groupEmblem.scale.set(1.0, 1.0, 1.0);
  }
}

/* --------------------------------------------------------------------------
   SCENE 0: BRAND HORIZON (3D DUAL-P EMBLEM & GYRO ORBITAL RINGS)
   -------------------------------------------------------------------------- */
function buildScene0Emblem() {
  groupEmblem = new THREE.Group();
  groupEmblem.position.set(2.6, 0.4, 0);

  // Radiant Glowing Materials
  const pMatBlue = new THREE.MeshStandardMaterial({
    color: 0x2b7fff,
    emissive: 0x1a56db,
    emissiveIntensity: 0.95,
    metalness: 0.25,
    roughness: 0.15
  });

  const pMatMagenta = new THREE.MeshStandardMaterial({
    color: 0xff007a,
    emissive: 0xd90066,
    emissiveIntensity: 0.95,
    metalness: 0.25,
    roughness: 0.15
  });

  // Left 'P' (Electric Cobalt Blue)
  const leftP = new THREE.Group();
  const stemGeom = new THREE.CylinderGeometry(0.32, 0.32, 3.2, 28);
  const stemL = new THREE.Mesh(stemGeom, pMatBlue);
  stemL.position.set(-1.1, 0, 0);
  leftP.add(stemL);

  const loopGeom = new THREE.TorusGeometry(0.95, 0.3, 20, 40, Math.PI);
  const loopL = new THREE.Mesh(loopGeom, pMatBlue);
  loopL.position.set(-1.1, 0.7, 0);
  loopL.rotation.z = -Math.PI / 2;
  leftP.add(loopL);
  groupEmblem.add(leftP);

  // Right 'P' (Hot Neon Magenta - Interlocked & Offset)
  const rightP = new THREE.Group();
  const stemR = new THREE.Mesh(stemGeom, pMatMagenta);
  stemR.position.set(0.65, -0.2, 0.4);
  rightP.add(stemR);

  const loopR = new THREE.Mesh(loopGeom, pMatMagenta);
  loopR.position.set(0.65, 0.5, 0.4);
  loopR.rotation.z = -Math.PI / 2;
  rightP.add(loopR);
  groupEmblem.add(rightP);

  // 3 Triad Petals Crowning the Top (Cobalt, Magenta, Amber Gold)
  const petalColors = [0x00e5ff, 0xff007a, 0xffb800];
  const petalAngles = [-0.4, 0, 0.4];
  petalColors.forEach((col, idx) => {
    const petalGeom = new THREE.ConeGeometry(0.28, 1.1, 16);
    const petalMat = new THREE.MeshStandardMaterial({
      color: col,
      emissive: col,
      emissiveIntensity: 1.2,
      roughness: 0.15
    });
    const petal = new THREE.Mesh(petalGeom, petalMat);
    petal.position.set(-0.25 + idx * 0.4, 2.2 + (idx === 1 ? 0.2 : 0), 0.2);
    petal.rotation.z = -petalAngles[idx];
    groupEmblem.add(petal);
  });

  // Concentric Gyro Orbital Rings
  const ringGeom1 = new THREE.TorusGeometry(3.6, 0.06, 16, 90);
  const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x2b7fff, transparent: true, opacity: 0.85 });
  orbitalRing1 = new THREE.Mesh(ringGeom1, ringMat1);
  orbitalRing1.rotation.x = Math.PI / 3.2;
  groupEmblem.add(orbitalRing1);

  const ringGeom2 = new THREE.TorusGeometry(4.3, 0.05, 16, 90);
  const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xff007a, transparent: true, opacity: 0.85 });
  orbitalRing2 = new THREE.Mesh(ringGeom2, ringMat2);
  orbitalRing2.rotation.y = Math.PI / 4;
  orbitalRing2.rotation.z = Math.PI / 6;
  groupEmblem.add(orbitalRing2);

  // Dedicated Local Spotlights on Emblem
  const emblemLight1 = new THREE.PointLight(0x2b7fff, 4.0, 9.0);
  emblemLight1.position.set(-2, 1, 2);
  groupEmblem.add(emblemLight1);

  const emblemLight2 = new THREE.PointLight(0xff007a, 4.0, 9.0);
  emblemLight2.position.set(2, 1, 2);
  groupEmblem.add(emblemLight2);

  scene.add(groupEmblem);
}

/* --------------------------------------------------------------------------
   TEXTURE GENERATOR: STAR FLEX RIBBON BANNER STRIP
   -------------------------------------------------------------------------- */
function createFlexRibbonTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 128;
  const ctx = c.getContext('2d');

  // CMYK gradient background
  const grad = ctx.createLinearGradient(0, 0, 1024, 0);
  grad.addColorStop(0.0, '#00E5FF');
  grad.addColorStop(0.25, '#FF007A');
  grad.addColorStop(0.5, '#FFEB3B');
  grad.addColorStop(0.75, '#1E293B');
  grad.addColorStop(1.0, '#2B7FFF');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 128);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('★ 10-COLOR JAPANESE HIGH-SPEED STAR FLEX PRINTING • PARI PUBLICITY ★', 512, 75);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* --------------------------------------------------------------------------
   SCENE 1: HIGH-SPEED PRINT & FLEX ARENA (Y = -13)
   -------------------------------------------------------------------------- */
function buildScene1PrintArena() {
  groupPrintMachine = new THREE.Group();
  groupPrintMachine.position.set(0, -13, 0);

  // Heavy-Duty Industrial Printing Rollers (Bright Polished Steel)
  const rollerGeom = new THREE.CylinderGeometry(0.75, 0.75, 9.5, 32);
  const rollerMat = new THREE.MeshStandardMaterial({
    color: 0x4a6999,
    metalness: 0.35,
    roughness: 0.25,
    emissive: 0x1a3a6b,
    emissiveIntensity: 0.55
  });

  const roller1 = new THREE.Mesh(rollerGeom, rollerMat);
  roller1.rotation.z = Math.PI / 2;
  roller1.position.set(0, 1.4, -0.8);
  groupPrintMachine.add(roller1);
  printRollers.push(roller1);

  const roller2 = new THREE.Mesh(rollerGeom, rollerMat);
  roller2.rotation.z = Math.PI / 2;
  roller2.position.set(0, -1.4, -0.8);
  groupPrintMachine.add(roller2);
  printRollers.push(roller2);

  // Industrial Machine Chassis Frame
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x1e3359,
    emissive: 0x0a162b,
    emissiveIntensity: 0.45,
    metalness: 0.35,
    roughness: 0.3
  });
  const pillarL = new THREE.Mesh(new THREE.BoxGeometry(1.0, 4.8, 2.8), chassisMat);
  pillarL.position.set(-5.1, 0, -0.8);
  groupPrintMachine.add(pillarL);

  const pillarR = new THREE.Mesh(new THREE.BoxGeometry(1.0, 4.8, 2.8), chassisMat);
  pillarR.position.set(5.1, 0, -0.8);
  groupPrintMachine.add(pillarR);

  // Flowing 3D Star Flex Banner Ribbon
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-4.4, 0, -0.6),
    new THREE.Vector3(-2.2, 0.6, 1.2),
    new THREE.Vector3(0.5, -0.4, 2.4),
    new THREE.Vector3(2.8, 0.8, 3.4),
    new THREE.Vector3(4.8, -0.2, 4.2)
  ]);

  const ribbonGeom = new THREE.TubeGeometry(curve, 64, 1.1, 16, false);
  const flexMat = new THREE.MeshStandardMaterial({
    map: createFlexRibbonTexture(),
    emissive: 0x1a3a6b,
    emissiveIntensity: 0.4,
    metalness: 0.25,
    roughness: 0.2
  });
  flexRibbonMesh = new THREE.Mesh(ribbonGeom, flexMat);
  groupPrintMachine.add(flexRibbonMesh);

  // CMYK Ink Beacons & Glowing Injection Beams
  const cmyk = [
    { col: 0x00e5ff, x: -2.7 },
    { col: 0xff007a, x: -0.9 },
    { col: 0xffeb3b, x: 0.9 },
    { col: 0x2b7fff, x: 2.7 }
  ];

  cmyk.forEach(item => {
    const emitter = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 16, 16),
      new THREE.MeshBasicMaterial({ color: item.col })
    );
    emitter.position.set(item.x, 2.6, 0.6);
    groupPrintMachine.add(emitter);

    const laser = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8),
      new THREE.MeshBasicMaterial({ color: item.col, transparent: true, opacity: 0.85 })
    );
    laser.position.set(item.x, 1.5, 0.6);
    groupPrintMachine.add(laser);

    // Local ink glow light
    const inkLight = new THREE.PointLight(item.col, 2.0, 5.0);
    inkLight.position.set(item.x, 2.0, 0.9);
    groupPrintMachine.add(inkLight);
  });

  scene.add(groupPrintMachine);
}

/* --------------------------------------------------------------------------
   TEXTURE GENERATOR: AUTHENTIC 3D HIGHWAY BILLBOARD FACEPLATE
   -------------------------------------------------------------------------- */
function createBillboardTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep Navy background
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 512);
  bgGrad.addColorStop(0, '#040b1a');
  bgGrad.addColorStop(0.5, '#0b1b3d');
  bgGrad.addColorStop(1, '#07122a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Glowing borders
  ctx.strokeStyle = '#2B7FFF';
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, 1004, 492);

  // Outer Neon accent line
  ctx.strokeStyle = '#FF007A';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, 976, 464);

  // Top Badge
  ctx.fillStyle = '#FF007A';
  ctx.beginPath();
  ctx.roundRect(360, 44, 304, 40, 20);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PRIME OUTDOOR MEDIA NETWORK', 512, 70);

  // Main Brand Name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 64px sans-serif';
  ctx.fillText('PARI PUBLICITY', 512, 180);

  // Subtitle
  const gradText = ctx.createLinearGradient(200, 0, 800, 0);
  gradText.addColorStop(0, '#2B7FFF');
  gradText.addColorStop(0.5, '#FF007A');
  gradText.addColorStop(1, '#FFB800');
  ctx.fillStyle = gradText;
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('HIGHWAY UNIPOLES & HOARDINGS', 512, 242);

  // Highlights
  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 24px sans-serif';
  ctx.fillText('NH-44 MORENA • GWALIOR ROAD • PRIME CORRIDORS', 512, 308);

  // CTA Pill
  ctx.fillStyle = '#25D366';
  ctx.beginPath();
  ctx.roundRect(320, 355, 384, 62, 31);
  ctx.fill();

  ctx.fillStyle = '#030712';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('CALL / WHATSAPP: 97558 12374', 512, 395);

  // Bottom trust mark
  ctx.fillStyle = '#64748B';
  ctx.font = '16px sans-serif';
  ctx.fillText('Direct Machine Rates • 100% In-House • Ganeshpura, Morena', 512, 465);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/* --------------------------------------------------------------------------
   SCENE 2: PRIME HIGHWAY OUTDOOR HOARDING (Y = -26)
   -------------------------------------------------------------------------- */
function buildScene2HighwayHoarding() {
  groupHoarding = new THREE.Group();
  groupHoarding.position.set(0, -26, 0);

  // Uni-Pole Towering Column
  const poleMat = new THREE.MeshStandardMaterial({
    color: 0x3a4f75,
    metalness: 0.35,
    roughness: 0.3,
    emissive: 0x111c33,
    emissiveIntensity: 0.4
  });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 9.6, 24), poleMat);
  pole.position.set(0, -1.8, -1.6);
  groupHoarding.add(pole);

  // Rear Lattice Support Truss
  const trussMat = new THREE.MeshStandardMaterial({
    color: 0x223659,
    metalness: 0.3,
    roughness: 0.35
  });
  const truss = new THREE.Mesh(new THREE.BoxGeometry(10.2, 4.8, 0.4), trussMat);
  truss.position.set(0, 2.4, -1.5);
  groupHoarding.add(truss);

  // Giant Billboard Face Plate (16:9 Display with High-Res Texture)
  const boardMat = new THREE.MeshStandardMaterial({
    map: createBillboardTexture(),
    emissive: 0x162c54,
    emissiveIntensity: 0.5,
    roughness: 0.25,
    metalness: 0.15
  });
  const board = new THREE.Mesh(new THREE.PlaneGeometry(9.6, 4.8), boardMat);
  board.position.set(0, 2.4, -1.25);
  groupHoarding.add(board);

  // Neon Illuminated Bezel Frame
  const frameBorder = new THREE.Mesh(
    new THREE.BoxGeometry(9.8, 0.14, 0.2),
    new THREE.MeshBasicMaterial({ color: 0x2b7fff })
  );
  frameBorder.position.set(0, 4.85, -1.2);
  groupHoarding.add(frameBorder);

  // Overhead Floodlights & Conical Light Beams
  for (let i = -3.4; i <= 3.4; i += 2.25) {
    const fixture = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.25, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x3a4f75, metalness: 0.4 })
    );
    fixture.position.set(i, 5.15, -0.6);
    groupHoarding.add(fixture);

    const lightBulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    lightBulb.position.set(i, 5.0, -0.6);
    groupHoarding.add(lightBulb);

    // Volumetric Spotlight Cones
    const coneGeom = new THREE.ConeGeometry(1.6, 3.8, 24, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x2b7fff,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const cone = new THREE.Mesh(coneGeom, coneMat);
    cone.position.set(i, 3.1, -0.85);
    cone.rotation.x = 0.28;
    groupHoarding.add(cone);

    const floodPoint = new THREE.PointLight(0x2b7fff, 2.2, 7.0);
    floodPoint.position.set(i, 4.8, -0.5);
    groupHoarding.add(floodPoint);
  }

  // Highway Ground Surface with Animated Light Trails
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x050a16, roughness: 0.6, metalness: 0.2 });
  const road = new THREE.Mesh(new THREE.PlaneGeometry(36, 14), roadMat);
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, -6.0, 2.5);
  groupHoarding.add(road);

  // Dynamic Highway Traffic Light Trails
  highwayTrails = new THREE.Group();
  for (let i = 0; i < 28; i++) {
    const isRed = i % 2 === 0;
    const trailGeom = new THREE.CylinderGeometry(0.04, 0.04, 2.5 + Math.random() * 3.5, 8);
    const trailMat = new THREE.MeshBasicMaterial({
      color: isRed ? 0xff1744 : 0xffd600,
      transparent: true,
      opacity: 0.75
    });
    const trail = new THREE.Mesh(trailGeom, trailMat);
    trail.rotation.z = Math.PI / 2;
    trail.position.set(
      (Math.random() - 0.5) * 32,
      -5.9,
      -2 + Math.random() * 9
    );
    trail.userData = { speed: (isRed ? -0.16 : 0.20) * (0.8 + Math.random() * 0.4) };
    highwayTrails.add(trail);
  }
  groupHoarding.add(highwayTrails);

  scene.add(groupHoarding);
}

/* --------------------------------------------------------------------------
   SCENE 3: 3D ACRYLIC LED GLOW SIGNBOARD (Y = -39)
   -------------------------------------------------------------------------- */
function buildScene3AcrylicSign() {
  groupGlowSign = new THREE.Group();
  groupGlowSign.position.set(0, -39, 0);

  // Storefront Backplate
  const backMat = new THREE.MeshStandardMaterial({
    color: 0x162445,
    emissive: 0x0c152a,
    emissiveIntensity: 0.45,
    metalness: 0.35,
    roughness: 0.3
  });
  const backplate = new THREE.Mesh(new THREE.BoxGeometry(11.5, 4.6, 0.3), backMat);
  backplate.position.set(0, 0, -1);
  groupGlowSign.add(backplate);

  // Polished Reflective Ground Floor
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x081329,
    metalness: 0.45,
    roughness: 0.2,
    emissive: 0x040a17,
    emissiveIntensity: 0.3
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 15), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -2.4, 0);
  groupGlowSign.add(floor);

  // 3D Extruded Acrylic Letter Blocks ("P A R I")
  const letters = [
    { char: 'P', x: -3.4, color: 0x2b7fff },
    { char: 'A', x: -1.15, color: 0xff007a },
    { char: 'R', x: 1.15, color: 0x00e5ff },
    { char: 'I', x: 3.4, color: 0xffb800 }
  ];

  letters.forEach(item => {
    // 3D Outer Colored Acrylic Letter Body
    const letterGeom = new THREE.BoxGeometry(1.7, 2.3, 0.55);
    const letterMat = new THREE.MeshStandardMaterial({
      color: item.color,
      emissive: item.color,
      emissiveIntensity: 0.95,
      metalness: 0.25,
      roughness: 0.15
    });
    const letterMesh = new THREE.Mesh(letterGeom, letterMat);
    letterMesh.position.set(item.x, 0.2, -0.6);
    groupGlowSign.add(letterMesh);

    // Front Bright Glowing Faceplate
    const faceGeom = new THREE.BoxGeometry(1.5, 2.1, 0.1);
    const faceMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const faceMesh = new THREE.Mesh(faceGeom, faceMat);
    faceMesh.position.set(item.x, 0.2, -0.3);
    groupGlowSign.add(faceMesh);

    // Intense Point Light Casting Colored Bloom
    const pointL = new THREE.PointLight(item.color, 3.2, 8.0);
    pointL.position.set(item.x, 0.2, 0.6);
    groupGlowSign.add(pointL);
  });

  // Architectural Under-Cabinet Neon Light Bar
  const neonBar = new THREE.Mesh(
    new THREE.BoxGeometry(10.6, 0.08, 0.25),
    new THREE.MeshBasicMaterial({ color: 0xff007a })
  );
  neonBar.position.set(0, -1.95, -0.65);
  groupGlowSign.add(neonBar);

  scene.add(groupGlowSign);
}

/* --------------------------------------------------------------------------
   SCENE 4: VIP ORDER & HOTLINE NEXUS (Y = -52)
   -------------------------------------------------------------------------- */
function buildScene4HotlineNexus() {
  groupHotline = new THREE.Group();
  groupHotline.position.set(0, -52, 0);

  // Multi-Tier Metallic Dais
  const tierMat = new THREE.MeshStandardMaterial({
    color: 0x1e3563,
    emissive: 0x0b1730,
    emissiveIntensity: 0.5,
    metalness: 0.35,
    roughness: 0.25
  });
  const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.8, 0.45, 36), tierMat);
  tier1.position.set(0, -2.2, 0);
  groupHotline.add(tier1);

  const tier2 = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.6, 0.4, 36), tierMat);
  tier2.position.set(0, -1.8, 0);
  groupHotline.add(tier2);

  // Glowing Green Edge Ring
  const ringGeom = new THREE.TorusGeometry(3.22, 0.05, 16, 64);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x25d366 });
  const edgeRing = new THREE.Mesh(ringGeom, ringMat);
  edgeRing.rotation.x = Math.PI / 2;
  edgeRing.position.set(0, -1.6, 0);
  groupHotline.add(edgeRing);

  // Floating 3D WhatsApp Beacon Crystal
  const crystalGeom = new THREE.IcosahedronGeometry(1.2, 1);
  const crystalMat = new THREE.MeshStandardMaterial({
    color: 0x25d366,
    emissive: 0x128c7e,
    emissiveIntensity: 1.1,
    metalness: 0.2,
    roughness: 0.1
  });
  const crystal = new THREE.Mesh(crystalGeom, crystalMat);
  crystal.position.set(0, 0.8, 0);
  groupHotline.add(crystal);

  // Orbiting Data Nodes
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const node = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xff007a, emissive: 0xff007a, emissiveIntensity: 1.4 })
    );
    node.position.set(Math.cos(angle) * 2.3, 0.8 + Math.sin(angle * 2) * 0.35, Math.sin(angle) * 2.3);
    groupHotline.add(node);
  }

  // Upward Volumetric Beacon Beam
  const beamGeom = new THREE.CylinderGeometry(0.9, 1.6, 14, 32, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0x25d366,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const beam = new THREE.Mesh(beamGeom, beamMat);
  beam.position.set(0, 5.0, 0);
  groupHotline.add(beam);

  // Local WhatsApp green point light
  const waLight = new THREE.PointLight(0x25d366, 3.5, 9.0);
  waLight.position.set(0, 1.5, 1.0);
  groupHotline.add(waLight);

  scene.add(groupHotline);
}

/* --------------------------------------------------------------------------
   PARTICLE COSMOS (FLOATING CMYK & NEON PARTICLES)
   -------------------------------------------------------------------------- */
function buildParticleCosmos() {
  const count = window.innerWidth < 768 ? 700 : 1600;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const palette = [
    new THREE.Color(0x2b7fff), // Cobalt Blue
    new THREE.Color(0xff007a), // Hot Magenta
    new THREE.Color(0x00e5ff), // Cyan
    new THREE.Color(0xffeb3b), // Yellow
    new THREE.Color(0xffb800)  // Gold
  ];

  for (let i = 0; i < count; i++) {
    // Distribute through vertical canyon of all scenes (Y: +8 to -62)
    positions[i * 3 + 0] = (Math.random() - 0.5) * 38;
    positions[i * 3 + 1] = 8 - Math.random() * 68;
    positions[i * 3 + 2] = -6 + Math.random() * 16;

    const col = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3 + 0] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.24,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

/* --------------------------------------------------------------------------
   INTERACTION & EVENT LISTENERS
   -------------------------------------------------------------------------- */
function setupEventListeners() {
  window.addEventListener('resize', onWindowResize, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;

    if (drag.isDragging) {
      const deltaX = e.clientX - drag.previousMouseX;
      const deltaY = e.clientY - drag.previousMouseY;
      drag.rotVelocityX = deltaY * 0.005;
      drag.rotVelocityY = deltaX * 0.005;
      drag.previousMouseX = e.clientX;
      drag.previousMouseY = e.clientY;
    }
  }, { passive: true });

  window.addEventListener('mousedown', (e) => {
    // Avoid dragging inside buttons, inputs, links, or nav menus
    if (e.target.closest('button, a, input, select, textarea, .nav-menu, .mobile-drawer')) return;
    drag.isDragging = true;
    drag.previousMouseX = e.clientX;
    drag.previousMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    drag.isDragging = false;
  });

  // Direct viewport interaction
  const stageViewport = document.getElementById('stageViewport');
  if (stageViewport) {
    stageViewport.addEventListener('mousedown', (e) => {
      drag.isDragging = true;
      drag.previousMouseX = e.clientX;
      drag.previousMouseY = e.clientY;
    });
  }

  // Touch drag support
  window.addEventListener('touchstart', (e) => {
    if (e.target.closest('button, a, input, select, textarea, .nav-menu, .mobile-drawer')) return;
    if (e.touches.length === 1) {
      drag.isDragging = true;
      drag.previousMouseX = e.touches[0].clientX;
      drag.previousMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (drag.isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - drag.previousMouseX;
      const deltaY = e.touches[0].clientY - drag.previousMouseY;
      drag.rotVelocityX = deltaY * 0.005;
      drag.rotVelocityY = deltaX * 0.005;
      drag.previousMouseX = e.touches[0].clientX;
      drag.previousMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    drag.isDragging = false;
  });

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  updateEmblemPositionToDOM();
}

function onScroll() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return;
  targetScrollProgress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
}

/* --------------------------------------------------------------------------
   CAMERA TRAJECTORY INTERPOLATION
   -------------------------------------------------------------------------- */
function updateCameraSpline() {
  // Smooth scroll interpolation
  scrollProgress += (targetScrollProgress - scrollProgress) * 0.075;

  // Mouse parallax interpolation
  mouse.x += (mouse.targetX - mouse.x) * 0.05;
  mouse.y += (mouse.targetY - mouse.y) * 0.05;

  // Find keyframe interval
  let p0 = cameraKeyframes[0];
  let p1 = cameraKeyframes[cameraKeyframes.length - 1];

  for (let i = 0; i < cameraKeyframes.length - 1; i++) {
    if (scrollProgress >= cameraKeyframes[i].p && scrollProgress <= cameraKeyframes[i + 1].p) {
      p0 = cameraKeyframes[i];
      p1 = cameraKeyframes[i + 1];
      break;
    }
  }

  const range = (p1.p - p0.p) || 0.0001;
  const t = (scrollProgress - p0.p) / range;
  const easeT = t * t * (3 - 2 * t);

  const targetPos = new THREE.Vector3().lerpVectors(p0.pos, p1.pos, easeT);
  const targetLook = new THREE.Vector3().lerpVectors(p0.look, p1.look, easeT);

  // Add interactive mouse drift
  targetPos.x += mouse.x * 0.9;
  targetPos.y += -mouse.y * 0.6;

  currentCamPos.lerp(targetPos, 0.09);
  currentLookAt.lerp(targetLook, 0.09);

  camera.position.copy(currentCamPos);
  camera.lookAt(currentLookAt);
}

/* --------------------------------------------------------------------------
   MAIN ANIMATION & PHYSICS TICK LOOP
   -------------------------------------------------------------------------- */
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  if (!isVisible) return;

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  // 1. Camera Spline Update
  updateCameraSpline();

  // 2. Inertial Drag Rotation Physics
  drag.manualRotX += drag.rotVelocityX;
  drag.manualRotY += drag.rotVelocityY;
  drag.rotVelocityX *= 0.92;
  drag.rotVelocityY *= 0.92;

  // 3. Animate Scene 0: Emblem & Gyro Rings
  if (groupEmblem) {
    groupEmblem.rotation.y = time * 0.3 + drag.manualRotY;
    groupEmblem.rotation.x = Math.sin(time * 0.5) * 0.1 + drag.manualRotX;
    if (orbitalRing1) orbitalRing1.rotation.z = time * 0.4;
    if (orbitalRing2) orbitalRing2.rotation.x = time * 0.32;
  }

  // 4. Animate Scene 1: Print Machinery
  if (printRollers.length) {
    printRollers.forEach((roller, i) => {
      roller.rotation.x = time * (i === 0 ? 3.5 : -3.5);
    });
  }
  if (flexRibbonMesh) {
    flexRibbonMesh.rotation.y = Math.sin(time * 0.6) * 0.1;
  }

  // 5. Animate Scene 2: Highway Light Trails
  if (highwayTrails) {
    highwayTrails.children.forEach(trail => {
      trail.position.x += trail.userData.speed;
      if (trail.position.x > 18) trail.position.x = -18;
      if (trail.position.x < -18) trail.position.x = 18;
    });
  }

  // 6. Animate Scene 4: Hotline Crystal Pulse
  if (groupHotline) {
    const crystal = groupHotline.children.find(c => c.geometry && c.geometry.type === 'IcosahedronGeometry');
    if (crystal) {
      crystal.rotation.y = time * 0.9;
      crystal.rotation.x = Math.sin(time * 1.4) * 0.25;
      crystal.position.y = 0.8 + Math.sin(time * 2.2) * 0.15;
    }
  }

  // 7. Animate Particle Cosmos
  if (particleSystem) {
    particleSystem.rotation.y = time * 0.025;
    const positions = particleSystem.geometry.attributes.position.array;
    for (let i = 1; i < positions.length; i += 3) {
      positions[i] -= delta * 0.9;
      if (positions[i] < -62) positions[i] = 8;
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;
  }

  // 8. Render Frame
  renderer.render(scene, camera);
}

/* --------------------------------------------------------------------------
   PUBLIC CONTROLS: JUMP TO SPECIFIC 3D CHAPTER
   -------------------------------------------------------------------------- */
export function goTo3DChapter(chapterIndex) {
  const chapterProgressMap = [0.0, 0.25, 0.50, 0.75, 1.0];
  const targetP = chapterProgressMap[chapterIndex] || 0;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const targetScrollY = targetP * maxScroll;

  window.scrollTo({
    top: targetScrollY,
    behavior: 'smooth'
  });
}
