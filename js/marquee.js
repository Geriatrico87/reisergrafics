/**
 * marquee.js — Infinite Horizontal Marquee
 * Reiser Grafics Premium Landing Page
 *
 * • Clones every child of `.marquee__track` to produce a seamless loop.
 * • The actual scrolling movement is driven by a CSS `@keyframes marquee`
 *   rule — this script only handles the DOM duplication and pause-on-hover.
 * • Adds / removes `.is-paused` on mouseenter / mouseleave so CSS can
 *   toggle `animation-play-state`.
 */

/**
 * Initializes the marquee infinite-loop behaviour.
 */
export function initMarquee() {
  const track = document.querySelector('.marquee__track');
  if (!track) return;

  /* -----------------------------------------------------------
   * 1. Clone children for seamless looping
   * --------------------------------------------------------- */
  const originalItems = Array.from(track.children);

  // Nothing to loop if the track is empty
  if (originalItems.length === 0) return;

  // Clone every original item and mark it as a duplicate (for debugging / CSS)
  const fragment = document.createDocumentFragment();

  originalItems.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true'); // screen-readers skip duplicates
    clone.classList.add('marquee__clone');
    fragment.appendChild(clone);
  });

  track.appendChild(fragment);

  /* -----------------------------------------------------------
   * 2. Ensure the track width covers all items
   *    CSS should set `display: flex; width: max-content;` on the
   *    track, but we expose a custom property as a fallback so the
   *    @keyframes can use it for translateX(-50%).
   * --------------------------------------------------------- */
  // After cloning, the track holds 2× the original content.
  // The CSS keyframe should translate by exactly –50% to loop perfectly.
  // We store the single-set width in a custom property in case the
  // CSS keyframe needs a pixel value instead of a percentage.
  requestAnimationFrame(() => {
    const singleSetWidth = track.scrollWidth / 2;
    track.style.setProperty('--marquee-width', `${singleSetWidth}px`);
  });

  /* -----------------------------------------------------------
   * 3. Pause on hover
   * --------------------------------------------------------- */
  const marqueeContainer = track.closest('.marquee') || track.parentElement;

  marqueeContainer.addEventListener('mouseenter', () => {
    track.classList.add('is-paused');
  });

  marqueeContainer.addEventListener('mouseleave', () => {
    track.classList.remove('is-paused');
  });

  /* -----------------------------------------------------------
   * 4. Respect reduced-motion preference
   * --------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  const handleMotionPreference = (mq) => {
    if (mq.matches) {
      track.classList.add('is-paused');
    } else {
      track.classList.remove('is-paused');
    }
  };

  handleMotionPreference(prefersReducedMotion);
  prefersReducedMotion.addEventListener('change', handleMotionPreference);
}
