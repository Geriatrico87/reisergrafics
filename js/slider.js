/**
 * slider.js — Hero Image Slider
 * Crossfade carousel with auto-advance and dot navigation
 */

export function initSlider() {
  const slider = document.getElementById('hero-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slider__slide');
  const dots = slider.querySelectorAll('.hero-slider__dot');
  if (slides.length === 0) return;

  let current = 0;
  let interval = null;
  const INTERVAL_MS = 6000;

  function goTo(index) {
    slides[current].classList.remove('is-active');
    dots[current]?.classList.remove('is-active');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('is-active');
    dots[current]?.classList.add('is-active');
  }

  function next() {
    goTo(current + 1);
  }

  function startAutoplay() {
    stopAutoplay();
    interval = setInterval(next, INTERVAL_MS);
  }

  function stopAutoplay() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  // Dot click handlers
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      startAutoplay(); // restart timer
    });
  });

  // Pause on hover (desktop)
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // Start
  startAutoplay();
}
