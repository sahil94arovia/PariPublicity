/**
 * Pari Publicity - Grand Hoarding & 2D Cartoon Van Scroll Journey Engine
 * ============================================================================
 * Handles bidirectional video-scrub style scroll animations:
 * 1. At Scroll 0: Camera frames the Grand Outdoor Hoarding high in the sky.
 * 2. As user scrolls down: Hoarding moves up, camera travels down the Unipole.
 * 3. Reaching road level: 2D Cartoon Pari Publicity Van drives forward along the
 *    Indian highway (NH-44 Morena), spinning wheels and puffing exhaust smoke.
 * 4. As user scrolls up: Animation smoothly scrubs backwards like rewinding a video.
 * ============================================================================
 */

let isInitialized = false;
let trackEl, viewportEl, craneRigEl, vanEl, frontWheelEl, rearWheelEl, exhaustPuffEl, milestoneEl;
let scrollProgress = 0;
let targetScrollProgress = 0;
let rafId = null;

export function initHoardingJourney() {
  trackEl = document.getElementById('home') || document.getElementById('heroHoardingTrack') || document.querySelector('.hero-hoarding-track');
  viewportEl = document.getElementById('heroHoardingViewport');
  craneRigEl = document.getElementById('hoardingCraneRig');
  vanEl = document.getElementById('cartoonVan');
  frontWheelEl = document.getElementById('vanWheelFront');
  rearWheelEl = document.getElementById('vanWheelRear');
  exhaustPuffEl = document.getElementById('vanExhaustGroup');
  milestoneEl = document.getElementById('highwayMilestone');

  if (!trackEl || !craneRigEl) {
    return;
  }

  isInitialized = true;

  // Track scroll position
  window.addEventListener('scroll', onScrollUpdate, { passive: true });
  window.addEventListener('resize', onResizeUpdate, { passive: true });

  // Initial calculation
  onScrollUpdate();

  // Start smooth physics animation loop
  if (!rafId) {
    rafId = requestAnimationFrame(animateLoop);
  }
}

function onScrollUpdate() {
  if (!trackEl) return;
  const rect = trackEl.getBoundingClientRect();
  const trackHeight = trackEl.offsetHeight;
  const windowHeight = window.innerHeight;

  // Calculate normalized progress (0.0 at top of track, 1.0 when track is scrolled through)
  const scrolled = -rect.top;
  const totalScrollable = trackHeight - windowHeight;

  if (totalScrollable <= 0) {
    targetScrollProgress = 0;
    return;
  }

  let p = scrolled / totalScrollable;
  p = Math.max(0, Math.min(1, p));
  targetScrollProgress = p;
}

function onResizeUpdate() {
  onScrollUpdate();
}

function animateLoop() {
  rafId = requestAnimationFrame(animateLoop);

  // Smooth lerp interpolation for silky 60fps video-scrubber feel
  const prevProgress = scrollProgress;
  scrollProgress += (targetScrollProgress - scrollProgress) * 0.15;

  const delta = scrollProgress - prevProgress;

  renderJourney(scrollProgress, delta);
}

function renderJourney(p, delta) {
  if (!craneRigEl) return;

  const isMobile = window.innerWidth <= 768;

  // Dynamic crane travel: precisely aligns the highway road with the bottom of the sticky viewport
  const craneTotalHeight = craneRigEl.offsetHeight;
  const viewportHeight = viewportEl ? viewportEl.offsetHeight : window.innerHeight;
  const maxCraneTravel = Math.max(0, craneTotalHeight - viewportHeight);

  // Phase 1: Camera descends down the Unipole (0.0 to 0.52)
  const craneP = Math.min(1, p / 0.52);
  const craneEase = craneP * craneP * (3 - 2 * craneP);
  const currentCraneY = -craneEase * maxCraneTravel;

  craneRigEl.style.transform = `translate3d(0, ${currentCraneY.toFixed(2)}px, 0)`;

  // Scale and fade on the hoarding assembly so inner board can maintain 3D mouse tilt cleanly
  const hoardingAssembly = document.querySelector('.grand-hoarding-assembly');
  if (hoardingAssembly) {
    if (p < 0.45) {
      const scale = 1 - (p * 0.08);
      const opacity = 1 - Math.max(0, (p - 0.28) / 0.22);
      hoardingAssembly.style.transform = `scale(${scale.toFixed(3)})`;
      hoardingAssembly.style.opacity = Math.max(0.05, opacity).toFixed(2);
    } else {
      hoardingAssembly.style.opacity = '0.05';
    }
  }

  // Phase 2: Ground Road Level & 2D Van Animation (0.35 to 1.0)
  if (vanEl) {
    const vanP = Math.max(0, Math.min(1, (p - 0.35) / 0.65));
    const vanEase = Math.sin((vanP * Math.PI) / 2);

    const travelDistance = isMobile ? (window.innerWidth + 180) : (window.innerWidth * 0.78 + 260);
    const startX = isMobile ? -180 : -260;
    const currentVanX = startX + (vanEase * travelDistance);

    // Van suspension bounce (subtle up/down on driving) and acceleration pitch
    const bounceY = Math.sin(vanP * 28) * (Math.abs(delta) > 0.0004 ? 2.8 : 0.6);
    const pitchAngle = Math.max(-4, Math.min(4, delta * 130));

    vanEl.style.transform = `translate3d(${currentVanX.toFixed(1)}px, ${bounceY.toFixed(1)}px, 0) rotate(${pitchAngle.toFixed(2)}deg)`;

    // Physically locked wheel rotation:
    // Wheel radius in SVG = 28 units. Rotation angle = (distance / radius) in radians -> degrees
    const wheelDeg = (currentVanX / 28) * (180 / Math.PI);
    if (frontWheelEl) {
      frontWheelEl.style.transform = `rotate(${wheelDeg.toFixed(1)}deg)`;
    }
    if (rearWheelEl) {
      rearWheelEl.style.transform = `rotate(${wheelDeg.toFixed(1)}deg)`;
    }

    // Dynamic exhaust smoke puff scaling & opacity
    if (exhaustPuffEl) {
      const isMoving = Math.abs(delta) > 0.0003;
      const puffScale = isMoving ? (0.85 + Math.sin(vanP * 36) * 0.4) : 0.35;
      const puffOpacity = isMoving ? (0.7 + Math.sin(vanP * 30) * 0.25) : 0.12;
      exhaustPuffEl.style.transform = `scale(${puffScale.toFixed(2)})`;
      exhaustPuffEl.style.opacity = puffOpacity.toFixed(2);
    }
  }

  // Milestone parallax
  if (milestoneEl) {
    const groundP = Math.max(0, Math.min(1, (p - 0.4) / 0.6));
    const milestoneShift = -groundP * 45;
    milestoneEl.style.transform = `translate3d(${milestoneShift.toFixed(1)}px, 0, 0)`;
  }

  // Update Scroll Indicator Hint
  const scrollHint = document.getElementById('hoardingScrollHint');
  if (scrollHint) {
    if (p > 0.12) {
      scrollHint.classList.add('faded');
    } else {
      scrollHint.classList.remove('faded');
    }
  }
}
