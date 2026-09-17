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
let currentWheelAngle = 0;
let rafId = null;

export function initHoardingJourney() {
  trackEl = document.getElementById('heroHoardingTrack');
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
  scrollProgress += (targetScrollProgress - scrollProgress) * 0.085;

  const delta = scrollProgress - prevProgress;

  renderJourney(scrollProgress, delta);
}

function renderJourney(p, delta) {
  if (!craneRigEl) return;

  const isMobile = window.innerWidth <= 768;
  const vh = window.innerHeight;

  // Phase 1: Camera descends down the Unipole (0.0 to 0.55)
  // Crane rig translates upwards, moving the Hoarding out of top view and bringing the ground into view
  const maxCraneTravel = isMobile ? vh * 1.15 : vh * 1.05;
  const craneP = Math.min(1, p / 0.55);
  // Custom ease-in-out curve for natural camera crane feel
  const craneEase = craneP * craneP * (3 - 2 * craneP);
  const currentCraneY = -craneEase * maxCraneTravel;

  craneRigEl.style.transform = `translate3d(0, ${currentCraneY.toFixed(2)}px, 0)`;

  // Subtle parallax tilt on the hoarding faceplate while at top
  const hoardingBoard = document.getElementById('grandHoardingBoard');
  if (hoardingBoard && p < 0.4) {
    const scale = 1 - (p * 0.08);
    const opacity = 1 - Math.max(0, (p - 0.28) / 0.22);
    hoardingBoard.style.transform = `scale(${scale.toFixed(3)})`;
    hoardingBoard.style.opacity = Math.max(0.1, opacity).toFixed(2);
  } else if (hoardingBoard) {
    hoardingBoard.style.opacity = '0.1';
  }

  // Phase 2: Ground Road Level & 2D Van Animation (0.35 to 1.0)
  if (vanEl) {
    // Van starts driving once camera reaches near the road (p >= 0.35)
    const vanP = Math.max(0, Math.min(1, (p - 0.35) / 0.65));
    // Smooth cubic bezier easing
    const vanEase = Math.sin((vanP * Math.PI) / 2);

    // Van moves across the road: from off-screen left (-35% or -220px) to center/forward
    const travelDistance = isMobile ? (window.innerWidth + 200) : (window.innerWidth * 0.82 + 250);
    const startX = isMobile ? -180 : -260;
    const currentVanX = startX + (vanEase * travelDistance);

    // Van suspension bounce (slight up and down as it drives along road)
    const bounceY = Math.sin(vanP * 28) * (Math.abs(delta) > 0.0005 ? 3.2 : 0.8);
    const pitchAngle = (delta * 120); // subtle nose dip / lift on accelerate/brake

    vanEl.style.transform = `translate3d(${currentVanX.toFixed(1)}px, ${bounceY.toFixed(1)}px, 0) rotate(${pitchAngle.toFixed(2)}deg)`;

    // Rotate Wheels based on movement
    currentWheelAngle += delta * 1850;
    if (frontWheelEl) {
      frontWheelEl.style.transform = `rotate(${currentWheelAngle.toFixed(1)}deg)`;
    }
    if (rearWheelEl) {
      rearWheelEl.style.transform = `rotate(${currentWheelAngle.toFixed(1)}deg)`;
    }

    // Dynamic exhaust smoke puff scaling & opacity
    if (exhaustPuffEl) {
      const isMoving = Math.abs(delta) > 0.0004;
      const puffScale = isMoving ? (0.9 + Math.sin(vanP * 40) * 0.45) : 0.4;
      const puffOpacity = isMoving ? (0.7 + Math.sin(vanP * 35) * 0.25) : 0.15;
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
    if (p > 0.15) {
      scrollHint.classList.add('faded');
    } else {
      scrollHint.classList.remove('faded');
    }
  }
}
