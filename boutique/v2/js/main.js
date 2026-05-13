/* ============================================
   Boutique by The Museo — V2 Editorial
   Page-turn motion fingerprint.
   ============================================ */

(function () {
  'use strict';

  // Reactive reduced-motion
  const motionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reducedMotion = () => motionMql.matches;

  // ============================================
  // Scroll reveal — clip-path L→R sweep on .editorial-sweep
  // Stagger 120ms within a section.
  // ============================================
  const sweepEls = document.querySelectorAll('.editorial-sweep, .editorial-img');

  function startReveals() {
    if (reducedMotion()) {
      sweepEls.forEach((el) => el.classList.add('visible'));
      return;
    }
    if (!('IntersectionObserver' in window)) {
      sweepEls.forEach((el) => el.classList.add('visible'));
      return;
    }

    // Group siblings under a common parent so we can stagger them on first reveal.
    const sectionMap = new Map();
    sweepEls.forEach((el) => {
      const section = el.closest('section, header, footer') || document.body;
      if (!sectionMap.has(section)) sectionMap.set(section, []);
      sectionMap.get(section).push(el);
    });

    const revealedSections = new WeakSet();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const section = entry.target.closest('section, header, footer') || document.body;
          if (revealedSections.has(section)) {
            // Section already kicked off — just reveal the latecomer directly.
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
            return;
          }
          revealedSections.add(section);
          const group = sectionMap.get(section) || [entry.target];
          group.forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 120);
            observer.unobserve(el);
          });
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    sweepEls.forEach((el) => observer.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startReveals);
  } else {
    startReveals();
  }

  // ============================================
  // Hero — text sweeps first, image cross-dissolves 300ms later (CSS handles
  // image delay via transition-delay). Drop-cap scale fires after body settles
  // (CSS handles delay). We just ensure .visible is applied on load even if
  // hero is fully above the fold and was already painted.
  // ============================================
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .editorial-sweep, .hero .editorial-img').forEach((el) => {
      el.classList.add('visible');
    });
  });

  // ============================================
  // Sticky masthead with hide-on-scroll-down / show-on-scroll-up
  // ============================================
  const masthead = document.querySelector('.masthead-bar');
  let mastheadAnchorY = 0;
  let mastheadDirection = 0;
  const MASTHEAD_THRESHOLD = 60;
  const MASTHEAD_SCROLLED_AT = 100;

  function tickMasthead(currentScroll) {
    if (!masthead) return;
    if (currentScroll <= MASTHEAD_SCROLLED_AT) {
      masthead.classList.remove('hidden');
      masthead.classList.remove('scrolled');
      mastheadAnchorY = currentScroll;
      mastheadDirection = 0;
      return;
    }
    masthead.classList.add('scrolled');
    const dy = currentScroll - mastheadAnchorY;
    if (dy > MASTHEAD_THRESHOLD && mastheadDirection !== 1) {
      mastheadDirection = 1;
      masthead.classList.add('hidden');
      mastheadAnchorY = currentScroll;
    } else if (dy < -MASTHEAD_THRESHOLD && mastheadDirection !== -1) {
      mastheadDirection = -1;
      masthead.classList.remove('hidden');
      mastheadAnchorY = currentScroll;
    }
  }

  let scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      tickMasthead(window.pageYOffset);
      scrollTicking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ============================================
  // Mobile menu — focus trap, inert background, Escape-to-close
  // ============================================
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mastheadNav = document.querySelector('.masthead-nav');
  const bgRegions = Array.from(document.querySelectorAll('main, footer'));
  let lastFocusBeforeMenu = null;

  function setMenuOpen(isOpen) {
    if (!menuToggle || !mastheadNav) return;
    mastheadNav.classList.toggle('open', isOpen);
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
    bgRegions.forEach((el) => {
      if (isOpen) {
        el.setAttribute('inert', '');
        el.setAttribute('aria-hidden', 'true');
      } else {
        el.removeAttribute('inert');
        el.removeAttribute('aria-hidden');
      }
    });
    if (isOpen) {
      lastFocusBeforeMenu = document.activeElement;
      const firstLink = mastheadNav.querySelector('a');
      if (firstLink) firstLink.focus();
    } else if (lastFocusBeforeMenu && typeof lastFocusBeforeMenu.focus === 'function') {
      lastFocusBeforeMenu.focus();
    }
  }

  if (menuToggle && mastheadNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = !mastheadNav.classList.contains('open');
      setMenuOpen(isOpen);
    });
    mastheadNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });
    document.addEventListener('keydown', (e) => {
      if (!mastheadNav.classList.contains('open')) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (e.key === 'Tab') {
        const focusables = mastheadNav.querySelectorAll('a, button');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  // ============================================
  // Smooth scroll for in-page anchors
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
      }
    });
  });

})();
