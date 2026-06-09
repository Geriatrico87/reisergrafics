/**
 * mobile-menu.js — Off-Canvas Mobile Navigation
 * Reiser Grafics Premium Landing Page
 *
 * • Toggles the mobile menu open / closed via the hamburger button.
 * • Prevents body scroll while the menu is open (`menu-open` on <body>).
 * • Closes on: backdrop click, Escape key, nav-link click.
 * • Manages `aria-expanded` for screen-reader accessibility.
 * • Traps keyboard focus inside the menu while it is open.
 */

/**
 * Initializes the mobile-menu behaviour.
 */
export function initMobileMenu() {
  const hamburger = document.querySelector('.header__hamburger');
  const menu      = document.querySelector('.mobile-menu');

  // Both elements are required — bail gracefully if either is missing
  if (!hamburger || !menu) return;

  const body = document.body;

  /* -----------------------------------------------------------
   * 1. State helpers
   * --------------------------------------------------------- */
  let isOpen = false;

  /** All focusable elements inside the menu (computed on open) */
  let focusableEls  = [];
  let firstFocusable = null;
  let lastFocusable  = null;

  /**
   * Query all focusable elements currently inside the menu.
   */
  function cacheFocusableElements() {
    focusableEls = Array.from(
      menu.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), ' +
        'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    firstFocusable = focusableEls[0]  || null;
    lastFocusable  = focusableEls[focusableEls.length - 1] || null;
  }

  /* -----------------------------------------------------------
   * 2. Open / Close
   * --------------------------------------------------------- */

  /**
   * Opens the mobile menu.
   */
  function openMenu() {
    if (isOpen) return;
    isOpen = true;

    menu.classList.add('is-active');
    hamburger.classList.add('is-active');
    body.classList.add('menu-open');

    hamburger.setAttribute('aria-expanded', 'true');

    // Refresh focusable cache and move focus into the menu
    cacheFocusableElements();
    if (firstFocusable) {
      // Small delay so the transition isn't interrupted
      requestAnimationFrame(() => firstFocusable.focus());
    }

    // Attach close-listeners
    document.addEventListener('keydown', onKeyDown);
  }

  /**
   * Closes the mobile menu.
   */
  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;

    menu.classList.remove('is-active');
    hamburger.classList.remove('is-active');
    body.classList.remove('menu-open');

    hamburger.setAttribute('aria-expanded', 'false');

    // Return focus to the hamburger button
    hamburger.focus();

    // Remove close-listeners
    document.removeEventListener('keydown', onKeyDown);
  }

  /**
   * Toggles the menu between open and closed.
   */
  function toggleMenu() {
    isOpen ? closeMenu() : openMenu();
  }

  /* -----------------------------------------------------------
   * 3. Keyboard handling (Escape + focus trap)
   * --------------------------------------------------------- */

  /**
   * @param {KeyboardEvent} e
   */
  function onKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
      return;
    }

    // Focus-trap: cycle Tab within the menu
    if (e.key === 'Tab' && focusableEls.length > 0) {
      if (e.shiftKey) {
        // Shift+Tab on first element → wrap to last
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab on last element → wrap to first
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  }

  /* -----------------------------------------------------------
   * 4. Event bindings
   * --------------------------------------------------------- */

  // Hamburger button
  hamburger.addEventListener('click', toggleMenu);

  // Set initial aria state
  hamburger.setAttribute('aria-expanded', 'false');

  // Close when clicking a navigation link inside the menu
  const menuLinks = menu.querySelectorAll('a[href]');
  menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      // Small timeout allows the browser to start navigating / scrolling
      // before the menu closes (avoids visual flicker).
      requestAnimationFrame(() => closeMenu());
    });
  });

  // Close when clicking the backdrop overlay
  // Convention: the `.mobile-menu` itself acts as the backdrop when clicked
  // directly (not on a child element).
  menu.addEventListener('click', (e) => {
    if (e.target === menu) {
      closeMenu();
    }
  });
}
