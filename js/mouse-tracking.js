/**
 * mouse-tracking.js — Cursor-Reactive Image Overlay
 * Reiser Grafics Premium Landing Page
 *
 * • Tracks the mouse position over `.rg200__image-wrap` and exposes it
 *   as CSS custom properties `--mouse-x` and `--mouse-y` (0 – 100 %).
 * • CSS uses these values in a `radial-gradient` overlay for a spotlight
 *   or parallax-light effect.
 * • Resets smoothly to centre (50 %, 50 %) on mouseleave.
 * • Disabled entirely on touch / non-hover devices for performance.
 */

/**
 * Initializes cursor-reactive custom-property tracking.
 */
export function initMouseTracking() {
  const wrap = document.querySelector('.rg200__image-wrap');
  if (!wrap) return;

  /* -----------------------------------------------------------
   * 1. Feature gate: only activate on devices that support hover
   * --------------------------------------------------------- */
  const supportsHover = window.matchMedia('(hover: hover)').matches;
  const isWideEnough  = window.innerWidth >= 768;

  if (!supportsHover || !isWideEnough) {
    // Park at centre so the CSS gradient still looks fine
    wrap.style.setProperty('--mouse-x', '50%');
    wrap.style.setProperty('--mouse-y', '50%');
    return;
  }

  /* -----------------------------------------------------------
   * 2. State
   * --------------------------------------------------------- */
  let rafId        = null;   // requestAnimationFrame handle
  let currentX     = 50;     // current interpolated X (%)
  let currentY     = 50;     // current interpolated Y (%)
  let targetX      = 50;     // latest raw mouse X (%)
  let targetY      = 50;     // latest raw mouse Y (%)
  let isHovering   = false;  // is the cursor inside the element?

  /** Lerp factor — lower = smoother / slower trailing */
  const LERP = 0.12;

  /* -----------------------------------------------------------
   * 3. Animation loop (runs only while hovering)
   * --------------------------------------------------------- */
  function tick() {
    // Linearly interpolate towards the target for a trailing feel
    currentX += (targetX - currentX) * LERP;
    currentY += (targetY - currentY) * LERP;

    wrap.style.setProperty('--mouse-x', `${currentX.toFixed(2)}%`);
    wrap.style.setProperty('--mouse-y', `${currentY.toFixed(2)}%`);

    // Keep looping while hovering OR while still animating back to centre
    const settled =
      Math.abs(currentX - targetX) < 0.1 &&
      Math.abs(currentY - targetY) < 0.1;

    if (isHovering || !settled) {
      rafId = requestAnimationFrame(tick);
    } else {
      // Snap to exact centre once close enough
      wrap.style.setProperty('--mouse-x', '50%');
      wrap.style.setProperty('--mouse-y', '50%');
      currentX = 50;
      currentY = 50;
      rafId = null;
    }
  }

  /** Start the rAF loop if it isn't already running */
  function ensureLoop() {
    if (rafId === null) {
      rafId = requestAnimationFrame(tick);
    }
  }

  /* -----------------------------------------------------------
   * 4. Event listeners
   * --------------------------------------------------------- */
  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();

    // Convert to percentage relative to the element
    targetX = ((e.clientX - rect.left) / rect.width)  * 100;
    targetY = ((e.clientY - rect.top)  / rect.height) * 100;

    // Clamp to 0–100 in case the event fires slightly outside bounds
    targetX = Math.max(0, Math.min(100, targetX));
    targetY = Math.max(0, Math.min(100, targetY));

    isHovering = true;
    ensureLoop();
  });

  wrap.addEventListener('mouseleave', () => {
    isHovering = false;
    // Animate smoothly back to centre
    targetX = 50;
    targetY = 50;
    ensureLoop();
  });

  // Set sensible defaults on init
  wrap.style.setProperty('--mouse-x', '50%');
  wrap.style.setProperty('--mouse-y', '50%');
}
