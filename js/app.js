/**
 * app.js — Main Orchestrator
 * Reiser Grafics Premium Multi-Page Site
 */

import { initHeader }           from './header.js';
import { initScrollAnimations } from './animations.js';
import { initMouseTracking }    from './mouse-tracking.js';
import { initMobileMenu }       from './mobile-menu.js';
import { initSlider }           from './slider.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initSlider();
  initScrollAnimations();
  initMouseTracking();
  initMobileMenu();
});
