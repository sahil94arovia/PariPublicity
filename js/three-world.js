/**
 * Pari Publicity - 3D Three.js WebGL Universe Engine
 * ============================================================================
 * An authored, interactive scroll-driven 3D world featuring:
 * 1. Brand Horizon: 3D Dual-P Emblem with rotating orbital rings & specular highlights
 * 2. Print & Flex Arena: Industrial rotating printing rollers & flowing Star Flex ribbon
 * 3. Prime Highway Hoarding: 3D Uni-pole billboard with spotlights & highway light trails
 * 4. 3D Acrylic LED Signage: Glowing extruded sign with reflections & neon bloom
 * 5. Hotline Nexus: Holographic 3D pedestal with swirling particle vortex
 * ============================================================================
 */

import * as THREE from 'three';

let renderer, scene, camera, canvas;
let isInitialized = false;
let isVisible = true;

// Scene groups
let groupEmblem, groupPrintMachine, groupHoarding, groupGlowSign, groupHotline;
let particleSystem, highwayTrails;
let orbitalRing1, orbitalRing2, printRollers = [], flexRibbonMesh, billboardSpotlights = [];

// Mouse tracking & parallax
const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
let scrollProgress = 0;
let targetScrollProgress = 0;

// Camera spline waypoints [scrollProgress: 0.0 to 1.0]
const cameraKeyframes = [
  // Scene 0: Brand Horizon (Hero) - scroll: 0.0
  { p: 0.00, pos: new THREE.Vector3(0, 1.2, 14), look: new THREE.Vector3(0, 0.5, 0) },
  // Transition to Flex Arena
  { p: 0.15, pos: new THREE.Vector3(4, -8, 16), look: new THREE.Vector3(0, -12, 0) },
  // Scene 1: Print & Flex Arena - scroll: 0.25
  { p: 0.25, pos: new THREE.Vector3(0, -12, 14), look: new THREE.Vector3(0, -12, 0) },
  // Transition to Highway Hoarding
  { p: 0.40, pos: new THREE.Vector3(-5, -20, 18), look: new THREE.Vector3(0, -25, 0) },
  // Scene 2: Prime Highway Hoarding - scroll: 0.50
  { p: 0.50, pos: new THREE.Vector3(0, -24, 15), look: new THREE.Vector3(0, -25, 0) },
  // Transition to 3D Acrylic LED Signage
  { p: 0.65, pos: new THREE.Vector3(6, -33, 17), look: new THREE.Vector3(0, -38, 0) },
  // Scene 3: 3D Acrylic LED Signage - scroll: 0.75
  { p: 0.75, pos: new THREE.Vector3(0, -38, 14), look: new THREE.Vector3(0, -38, 0) },
  // Transition to Hotline Nexus
  { p: 0.88, pos: new THREE.Vector3(-4, -46, 16), look: new THREE.Vector3(0, -50, 0) },
  // Scene 4: Hotline Nexus & Quote Gateway - scroll: 1.00
  { p: 1.00, pos: new THREE.Vector3(0, -50, 13), look: new THREE.Vector3(0, -50, 0) }
];

const currentCamPos = new THREE.Vector3(0, 1.2, 14);
const currentLookAt = new THREE.Vector3(0, 0.5, 0);

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
    renderer.toneMappingExposure = 1.15;

    // 2. Scene & Atmospheric Fog
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.022);

    // 3. Camera
    camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.5, 180);
    camera.position.copy(currentCamPos);
    camera.lookAt(currentLookAt);

    // 4. Global Lighting Rig
    setupLighting();

    // 5. Build 3D Feature Scenes
    buildScene0Emblem();
    buildScene1PrintArena();
    buildScene2HighwayHoarding();
    buildScene3AcrylicSign();
    buildScene4HotlineNexus();

    // 6. Background Particle Cosmos
    buildParticleCosmos();

    // 7. Event Listeners
    setupEventListeners();

    // 8. Animation Loop
    isInitialized = true;
    animate();
    
    // Initial scroll sync
    onScroll();
  } catch (err) {
    console.warn('Three.js WebGL initialization skipped or failed:', err);
  }
}

/* --------------------------------------------------------------------------
   LIGHTING RIG
   -------------------------------------------------------------------------- */
function setupLighting() {
  // Ambient deep night sapphire fill
  const ambient = new THREE.AmbientLight(0x0a1633, 1.4);
  scene.add(ambient);

  // Directional moonlight key light
  const moonLight = new THREE.DirectionalLight(0xdfe7ff, 2.2);
  moonLight.position.set(12, 20, 15);
  scene.add(moonLight);

  // Neon Cobalt Blue rim light
  const blueRim = new THREE.DirectionalLight(0x2b7fff, 2.8);
  blueRim.position.set(-15, -10, 10);
  scene.add(blueRim);

  // Neon Magenta accent light
  const magentaAccent = new THREE.DirectionalLight(0xff007a, 2.5);
  magentaAccent.position.set(15, -25, -5);
  scene.add(magentaAccent);

  // Warm Amber Gold accent light
  const goldAccent = new THREE.DirectionalLight(0xffb800, 1.8);
  goldAccent.position.set(0, -42, 12);
  scene.add(goldAccent);
}

/* --------------------------------------------------------------------------
   SCENE 0: BRAND HORIZON (3D DUAL-P EMBLEM & ORBITAL RINGS)
   -------------------------------------------------------------------------- */
function buildScene0Emblem() {
  groupEmblem = new THREE.Group();
  groupEmblem.position.set(0, 0.5, 0);

  // Dual-P Central Emblem (3D Extruded Interlocking P Pillars)
  const pMatBlue = new THREE.MeshStandardMaterial({
    color: 0x1a56db,
    metalness: 0.85,
    roughness: 0.18,
    emissive: 0x0f2b6b,
    emissiveIntensity: 0.4
  });

  const pMatMagenta = new THREE.MeshStandardMaterial({
    color: 0xff007a,
    metalness: 0.85,
    roughness: 0.18,
    emissive: 0x7a003a,
    emissiveIntensity: 0.45
  });

  // Left 'P' Geometry (Cobalt)
  const leftPGroup = new THREE.Group();
  const stemGeom = new THREE.CylinderGeometry(0.28, 0.28, 3.4, 24);
  const leftStem = new THREE.Mesh(stemGeom, pMatBlue);
  leftStem.position.set(-1.2, 0, 0);
  leftPGroup.add(leftStem);

  const loopGeom = new THREE.TorusGeometry(0.9, 0.26, 20, 36, Math.PI);
  const leftLoop = new THREE.Mesh(loopGeom, pMatBlue);
  leftLoop.position.set(-1.2, 0.8, 0);
  leftLoop.rotation.z = -Math.PI / 2;
  leftPGroup.add(leftLoop);

  // Right 'P' Geometry (Neon Magenta - Interlocked & Offset)
  const rightPGroup = new THREE.Group();
  const rightStem = new THREE.Mesh(stemGeom, pMatMagenta);
  rightStem.position.set(0.6, -0.2, 0.35);
  rightPGroup.add(rightStem);

  const rightLoop = new THREE.Mesh(loopGeom, pMatMagenta);
  rightLoop.position.set(0.6, 0.6, 0.35);
  rightLoop.rotation.z = -Math.PI / 2;
  rightPGroup.add(rightLoop);

  groupEmblem.add(leftPGroup);
  groupEmblem.add(rightPGroup);

  // Floating Center Diamond Crystal (Triad Bloom)
  const octaGeom = new THREE.OctahedronGeometry(0.55, 0);
  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0xffb800,
    emissive: 0xff8800,
    emissiveIntensity: 0.8,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.88,
    thickness: 0.6
  });
  const centerCrystal = new THREE.Mesh(octaGeom, crystalMat);
  centerCrystal.position.set(-0.3, 0.7, 0.2);
  groupEmblem.add(centerCrystal);

  // Concentric Orbital Gyro Rings
  const ringGeom1 = new THREE.TorusGeometry(3.6, 0.04, 16, 90);
  const ringMat1 = new THREE.MeshStandardMaterial({
    color: 0x2b7fff,
    emissive: 0x2b7fff,
    emissiveIntensity: 0.75,
    metalness: 0.9,
    roughness: 0.2
  });
  orbitalRing1 = new THREE.Mesh(ringGeom1, ringMat1);
  orbitalRing1.rotation.x = Math.PI / 3;
  groupEmblem.add(orbitalRing1);

  const ringGeom2 = new THREE.TorusGeometry(4.4, 0.035, 16, 90);
  const ringMat2 = new THREE.MeshStandardMaterial({
    color: 0xff007a,
    emissive: 0xff007a,
    emissiveIntensity: 0.75,
    metalness: 0.9,
    roughness: 0.2
  });
  orbitalRing2 = new THREE.Mesh(ringGeom2, ringMat2);
  orbitalRing2.rotation.y = Math.PI / 4;
  orbitalRing2.rotation.z = Math.PI / 6;
  groupEmblem.add(orbitalRing2);

  scene.add(groupEmblem);
}

/* --------------------------------------------------------------------------
   SCENE 1: HIGH-SPEED PRINT & FLEX ARENA (Y = -12)
   -------------------------------------------------------------------------- */
function buildScene1PrintArena() {
  groupPrintMachine = new THREE.Group();
  groupPrintMachine.position.set(0, -12, 0);

  // Heavy-Duty Industrial Steel Printing Cylinders
  const rollerGeom = new THREE.CylinderGeometry(0.7, 0.7, 8.5, 32);
  const rollerMat = new THREE.MeshStandardMaterial({
    color: 0x1f293d,
    metalness: 0.92,
    roughness: 0.15
  });

  const roller1 = new THREE.Mesh(rollerGeom, rollerMat);
  roller1.rotation.z = Math.PI / 2;
  roller1.position.set(0, 1.2, -1);
  groupPrintMachine.add(roller1);
  printRollers.push(roller1);

  const roller2 = new THREE.Mesh(rollerGeom, rollerMat);
  roller2.rotation.z = Math.PI / 2;
  roller2.position.set(0, -1.2, -1);
  groupPrintMachine.add(roller2);
  printRollers.push(roller2);

  // Machine Frame Supports
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x0b132b, metalness: 0.8, roughness: 0.3 });
  const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4.2, 2.5), frameMat);
  leftPillar.position.set(-4.6, 0, -1);
  groupPrintMachine.add(leftPillar);

  const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4.2, 2.5), frameMat);
  rightPillar.position.set(4.6, 0, -1);
  groupPrintMachine.add(rightPillar);

  // Flowing 3D Star Flex Banner Ribbon (Curved Surface)
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.8, 0, -0.8),
    new THREE.Vector3(-1.8, 0.4, 0.8),
    new THREE.Vector3(0.5, -0.3, 1.8),
    new THREE.Vector3(2.5, 0.6, 2.8),
    new THREE.Vector3(4.2, -0.2, 3.6)
  ]);

  const ribbonGeom = new THREE.TubeGeometry(curve, 48, 0.9, 12, false);
  const flexMat = new THREE.MeshPhysicalMaterial({
    color: 0x111c38,
    emissive: 0x1a56db,
    emissiveIntensity: 0.35,
    metalness: 0.4,
    roughness: 0.2,
    clearcoat: 0.8,
    clearcoatRoughness: 0.15
  });
  flexRibbonMesh = new THREE.Mesh(ribbonGeom, flexMat);
  groupPrintMachine.add(flexRibbonMesh);

  // CMYK Ink Dispersion Beacons (Cyan, Magenta, Yellow, Key Black)
  const cmykColors = [0x00e5ff, 0xff007a, 0xffeb3b, 0x1a1a2e];
  cmykColors.forEach((color, i) => {
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 16, 16),
      new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 1.2
      })
    );
    orb.position.set(-2.5 + i * 1.7, 2.2, 0.5);
    groupPrintMachine.add(orb);

    // Fine laser beam down to the flex roll
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.8, 8),
      new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.65 })
    );
    beam.position.set(-2.5 + i * 1.7, 1.3, 0.5);
    groupPrintMachine.add(beam);
  });

  scene.add(groupPrintMachine);
}

/* --------------------------------------------------------------------------
   SCENE 2: PRIME HIGHWAY OUTDOOR HOARDING (Y = -25)
   -------------------------------------------------------------------------- */
function buildScene2HighwayHoarding() {
  groupHoarding = new THREE.Group();
  groupHoarding.position.set(0, -25, 0);

  // Giant Uni-Pole Column
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x1a2333, metalness: 0.85, roughness: 0.25 });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 9.0, 24), poleMat);
  pole.position.set(0, -1.8, -1.5);
  groupHoarding.add(pole);

  // Structural Steel Lattice Truss behind the board
  const trussMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7, roughness: 0.4 });
  const truss = new THREE.Mesh(new THREE.BoxGeometry(9.4, 4.6, 0.4), trussMat);
  truss.position.set(0, 2.2, -1.5);
  groupHoarding.add(truss);

  // Main Billboard Face (16:9 Aspect Ratio)
  const boardFaceMat = new THREE.MeshStandardMaterial({
    color: 0x0c162e,
    metalness: 0.3,
    roughness: 0.25,
    emissive: 0x1a3a6b,
    emissiveIntensity: 0.3
  });
  const boardFace = new THREE.Mesh(new THREE.PlaneGeometry(9.0, 4.2), boardFaceMat);
  boardFace.position.set(0, 2.2, -1.25);
  groupHoarding.add(boardFace);

  // Billboard Bezel / Metal Border Frame
  const borderMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1d4ed8, emissiveIntensity: 0.5 });
  const borderTop = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.12, 0.15), borderMat);
  borderTop.position.set(0, 4.35, -1.2);
  groupHoarding.add(borderTop);

  const borderBottom = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.12, 0.15), borderMat);
  borderBottom.position.set(0, 0.05, -1.2);
  groupHoarding.add(borderBottom);

  // Overhead Floodlights & Volumetric Light Cones
  for (let i = -3.2; i <= 3.2; i += 2.1) {
    // Spotlight Fixture
    const fixture = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.2, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 })
    );
    fixture.position.set(i, 4.7, -0.6);
    groupHoarding.add(fixture);

    // Light Arm
    const arm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8),
      poleMat
    );
    arm.position.set(i, 4.5, -0.9);
    arm.rotation.x = Math.PI / 4;
    groupHoarding.add(arm);

    // Glowing Light Bulb
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    bulb.position.set(i, 4.65, -0.4);
    groupHoarding.add(bulb);

    // Volumetric Cone of Downward Light
    const coneGeom = new THREE.ConeGeometry(1.2, 3.2, 24, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const cone = new THREE.Mesh(coneGeom, coneMat);
    cone.position.set(i, 3.0, -0.85);
    cone.rotation.x = -Math.PI / 10;
    groupHoarding.add(cone);
    billboardSpotlights.push(cone);
  }

  // Highway Ground Plane & Night Roadway
  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x050b14,
    roughness: 0.9,
    metalness: 0.1
  });
  const road = new THREE.Mesh(new THREE.PlaneGeometry(35, 18), roadMat);
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, -5.8, 0);
  groupHoarding.add(road);

  // Moving Vehicle Light Trails (Highway traffic along Morena NH-44)
  highwayTrails = new THREE.Group();
  for (let i = 0; i < 18; i++) {
    const isRed = i % 2 === 0;
    const trailGeom = new THREE.BoxGeometry(isRed ? 2.8 : 3.6, 0.06, 0.12);
    const trailMat = new THREE.MeshBasicMaterial({
      color: isRed ? 0xff2a55 : 0xfef08a,
      transparent: true,
      opacity: 0.85
    });
    const trail = new THREE.Mesh(trailGeom, trailMat);
    trail.position.set(
      (Math.random() - 0.5) * 28,
      -5.7,
      -2 + (Math.random() * 8)
    );
    trail.userData = { speed: (isRed ? -0.15 : 0.18) * (0.8 + Math.random() * 0.4) };
    highwayTrails.add(trail);
  }
  groupHoarding.add(highwayTrails);

  scene.add(groupHoarding);
}

/* --------------------------------------------------------------------------
   SCENE 3: 3D ACRYLIC LED GLOW SIGNBOARD (Y = -38)
   -------------------------------------------------------------------------- */
function buildScene3AcrylicSign() {
  groupGlowSign = new THREE.Group();
  groupGlowSign.position.set(0, -38, 0);

  // Storefront Architectural Backplate
  const backplateMat = new THREE.MeshStandardMaterial({
    color: 0x080f21,
    metalness: 0.8,
    roughness: 0.35
  });
  const backplate = new THREE.Mesh(new THREE.BoxGeometry(11, 4.4, 0.3), backplateMat);
  backplate.position.set(0, 0, -1);
  groupGlowSign.add(backplate);

  // Polished Reflective Ground Floor
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x030712,
    metalness: 0.9,
    roughness: 0.15
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(28, 14), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -2.4, 0);
  groupGlowSign.add(floor);

  // 3D Extruded Acrylic LED Letter Blocks ("P A R I")
  const letters = [
    { char: 'P', x: -3.3, color: 0x2b7fff },
    { char: 'A', x: -1.1, color: 0xff007a },
    { char: 'R', x: 1.1, color: 0x2b7fff },
    { char: 'I', x: 3.3, color: 0xffb800 }
  ];

  letters.forEach(item => {
    // 3D Outer Acrylic Letter Body
    const letterGeom = new THREE.BoxGeometry(1.6, 2.2, 0.5);
    const letterMat = new THREE.MeshPhysicalMaterial({
      color: item.color,
      emissive: item.color,
      emissiveIntensity: 0.8,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.5,
      thickness: 0.4
    });
    const letterMesh = new THREE.Mesh(letterGeom, letterMat);
    letterMesh.position.set(item.x, 0.2, -0.6);
    groupGlowSign.add(letterMesh);

    // Front Glowing Facia Plate
    const faceGeom = new THREE.BoxGeometry(1.45, 2.05, 0.08);
    const faceMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const faceMesh = new THREE.Mesh(faceGeom, faceMat);
    faceMesh.position.set(item.x, 0.2, -0.32);
    groupGlowSign.add(faceMesh);

    // Local Neon Light Source
    const neonLight = new THREE.PointLight(item.color, 2.0, 6.0);
    neonLight.position.set(item.x, 0.2, 0.4);
    groupGlowSign.add(neonLight);
  });

  // Modern Under-Cabinet Ambient Strip Light
  const stripGeom = new THREE.BoxGeometry(10.2, 0.06, 0.2);
  const stripMat = new THREE.MeshBasicMaterial({ color: 0xff007a });
  const strip = new THREE.Mesh(stripGeom, stripMat);
  strip.position.set(0, -1.9, -0.7);
  groupGlowSign.add(strip);

  scene.add(groupGlowSign);
}

/* --------------------------------------------------------------------------
   SCENE 4: VIP ORDER & HOTLINE NEXUS (Y = -50)
   -------------------------------------------------------------------------- */
function buildScene4HotlineNexus() {
  groupHotline = new THREE.Group();
  groupHotline.position.set(0, -50, 0);

  // Multi-Tier Holographic Pedestal
  const tierMat = new THREE.MeshStandardMaterial({
    color: 0x0e1b38,
    metalness: 0.88,
    roughness: 0.2
  });

  const baseTier = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.6, 0.4, 36), tierMat);
  baseTier.position.set(0, -2.2, 0);
  groupHotline.add(baseTier);

  const midTier = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.4, 0.35, 36), tierMat);
  midTier.position.set(0, -1.8, 0);
  groupHotline.add(midTier);

  // Glowing Edge Rings
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x25d366 });
  const beaconRing = new THREE.Mesh(new THREE.TorusGeometry(3.02, 0.04, 16, 64), ringMat);
  beaconRing.rotation.x = Math.PI / 2;
  beaconRing.position.set(0, -1.6, 0);
  groupHotline.add(beaconRing);

  // Central Floating WhatsApp Crystal Beacon
  const crystalGeom = new THREE.IcosahedronGeometry(1.1, 1);
  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0x25d366,
    emissive: 0x128c7e,
    emissiveIntensity: 0.85,
    metalness: 0.15,
    roughness: 0.05,
    transmission: 0.82,
    thickness: 0.8
  });
  const waCrystal = new THREE.Mesh(crystalGeom, crystalMat);
  waCrystal.position.set(0, 0.6, 0);
  groupHotline.add(waCrystal);

  // Orbiting Data Nodes
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const nodeGeom = new THREE.SphereGeometry(0.18, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xff007a,
      emissive: 0xff007a,
      emissiveIntensity: 1.2
    });
    const node = new THREE.Mesh(nodeGeom, nodeMat);
    node.position.set(Math.cos(angle) * 2.2, 0.6 + Math.sin(angle * 2) * 0.3, Math.sin(angle) * 2.2);
    groupHotline.add(node);
  }

  // Volumetric Beacon Pillar of Light
  const beamGeom = new THREE.CylinderGeometry(0.8, 1.4, 12, 32, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0x25d366,
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const beaconBeam = new THREE.Mesh(beamGeom, beamMat);
  beaconBeam.position.set(0, 4.5, 0);
  groupHotline.add(beaconBeam);

  scene.add(groupHotline);
}

/* --------------------------------------------------------------------------
   PARTICLE COSMOS (CMYK & NEON INK PARTICLES)
   -------------------------------------------------------------------------- */
function buildParticleCosmos() {
  const count = window.innerWidth < 768 ? 600 : 1400;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const palette = [
    new THREE.Color(0x2b7fff), // Cobalt Blue
    new THREE.Color(0xff007a), // Neon Magenta
    new THREE.Color(0x00e5ff), // Cyan
    new THREE.Color(0xffeb3b), // Yellow
    new THREE.Color(0xffb800)  // Gold
  ];

  for (let i = 0; i < count; i++) {
    // Distribute particles through vertical canyon of all 5 scenes (Y: +8 to -58)
    positions[i * 3 + 0] = (Math.random() - 0.5) * 36;
    positions[i * 3 + 1] = 8 - Math.random() * 66;
    positions[i * 3 + 2] = -6 + Math.random() * 24;

    const col = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3 + 0] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Particle Material
  const material = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

/* --------------------------------------------------------------------------
   EVENT LISTENERS & SCROLL SYNC
   -------------------------------------------------------------------------- */
function setupEventListeners() {
  window.addEventListener('resize', onWindowResize, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });
}

function onWindowResize() {
  if (!renderer || !camera) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
  // Smooth scroll lerp
  scrollProgress += (targetScrollProgress - scrollProgress) * 0.065;

  // Smooth mouse parallax lerp
  mouse.x += (mouse.targetX - mouse.x) * 0.05;
  mouse.y += (mouse.targetY - mouse.y) * 0.05;

  // Find surrounding keyframes
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
  // Smoothstep easing
  const easeT = t * t * (3 - 2 * t);

  // Interpolate camera position & look-at target
  const targetPos = new THREE.Vector3().lerpVectors(p0.pos, p1.pos, easeT);
  const targetLook = new THREE.Vector3().lerpVectors(p0.look, p1.look, easeT);

  // Layer interactive mouse parallax
  targetPos.x += mouse.x * 0.8;
  targetPos.y += -mouse.y * 0.5;

  currentCamPos.lerp(targetPos, 0.08);
  currentLookAt.lerp(targetLook, 0.08);

  camera.position.copy(currentCamPos);
  camera.lookAt(currentLookAt);
}

/* --------------------------------------------------------------------------
   MAIN ANIMATION LOOP (60 FPS)
   -------------------------------------------------------------------------- */
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  if (!isVisible || !renderer || !scene || !camera) return;

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  // 1. Update Camera Trajectory
  updateCameraSpline();

  // 2. Animate Scene 0: Brand Horizon
  if (groupEmblem) {
    groupEmblem.rotation.y = time * 0.25;
    if (orbitalRing1) orbitalRing1.rotation.z = time * 0.35;
    if (orbitalRing2) orbitalRing2.rotation.x = time * 0.28;
  }

  // 3. Animate Scene 1: Print Machinery
  if (printRollers.length) {
    printRollers.forEach((roller, i) => {
      roller.rotation.x = time * (i === 0 ? 3.0 : -3.0);
    });
  }
  if (flexRibbonMesh) {
    flexRibbonMesh.rotation.y = Math.sin(time * 0.5) * 0.08;
  }

  // 4. Animate Scene 2: Highway Traffic Light Trails
  if (highwayTrails) {
    highwayTrails.children.forEach(trail => {
      trail.position.x += trail.userData.speed;
      if (trail.position.x > 18) trail.position.x = -18;
      if (trail.position.x < -18) trail.position.x = 18;
    });
  }

  // 5. Animate Scene 4: Hotline Crystal Pulse
  if (groupHotline) {
    const crystal = groupHotline.children.find(c => c.geometry && c.geometry.type === 'IcosahedronGeometry');
    if (crystal) {
      crystal.rotation.y = time * 0.8;
      crystal.rotation.x = Math.sin(time * 1.2) * 0.2;
      crystal.position.y = 0.6 + Math.sin(time * 2.0) * 0.12;
    }
  }

  // 6. Animate Particle Cosmos Drift
  if (particleSystem) {
    particleSystem.rotation.y = time * 0.03;
    const positions = particleSystem.geometry.attributes.position.array;
    for (let i = 1; i < positions.length; i += 3) {
      positions[i] -= delta * 0.8;
      if (positions[i] < -60) positions[i] = 8;
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;
  }

  // 7. Render Frame
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
