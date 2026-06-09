/**
 * header.js — Sticky Header
 * Adds subtle shadow on scroll. Always white background.
 */

export function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let isScrolled = false;
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const shouldBeScrolled = window.scrollY > 20;

      if (shouldBeScrolled !== isScrolled) {
        isScrolled = shouldBeScrolled;
        header.classList.toggle('header--scrolled', isScrolled);
      }

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerH = header.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - headerH - 16;

      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    });
  });

  // Set initial state
  onScroll();
}
