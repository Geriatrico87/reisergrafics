/**
 * animations.js — Scroll-Triggered Reveal Animations
 * Reiser Grafics Premium Landing Page
 *
 * • Observes every `.animate-on-scroll` element with an IntersectionObserver.
 * • Adds `is-visible` once the element enters the viewport (one-shot).
 * • For elements inside a `.stagger-children` parent, automatically applies
 *   incremental `transitionDelay` so children animate in sequence.
 */

/** Observer options */
const OBSERVER_OPTIONS = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px',
};

/** Base delay step for staggered children (ms) */
const STAGGER_STEP_MS = 100;

/**
 * Apply incremental transition delays to `.animate-on-scroll` children
 * of every `.stagger-children` container.
 *
 * @param {NodeListOf<Element>} elements - All animate-on-scroll elements.
 */
function applyStaggerDelays(elements) {
  // Group elements by their stagger-parent (if any)
  const parentMap = new Map();

  elements.forEach((el) => {
    const parent = el.closest('.stagger-children');
    if (!parent) return;

    if (!parentMap.has(parent)) {
      parentMap.set(parent, []);
    }
    parentMap.get(parent).push(el);
  });

  // For each group, assign stagger delays in DOM order
  parentMap.forEach((children) => {
    children.forEach((child, index) => {
      child.style.transitionDelay = `${index * STAGGER_STEP_MS}ms`;
    });
  });
}

/**
 * Initializes scroll-triggered reveal animations.
 */
export function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (elements.length === 0) return;

  // Pre-calculate stagger delays before observing
  applyStaggerDelays(elements);

  // Prefer no animations for users who have reduced-motion enabled
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  if (prefersReducedMotion.matches) {
    // Reveal everything immediately — no animation
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // animate only once
      }
    });
  }, OBSERVER_OPTIONS);

  elements.forEach((el) => observer.observe(el));
}
