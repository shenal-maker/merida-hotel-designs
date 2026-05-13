/* ============================================
   TREE HOUSE BOUTIQUE HOTEL — V3 INTERACTIONS
   Brutalist art-forward. Motion fingerprint: SNAP / STACCATO.
   ============================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isHoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // --- MENU TOGGLE with FOCUS TRAP (preserved from R3) ---
  const menuBtn = document.querySelector('.nav-menu-btn');
  const menuOverlay = document.querySelector('.menu-overlay');
  const menuClose = document.querySelector('.menu-close');
  const menuLinks = document.querySelectorAll('.menu-overlay a');

  if (menuBtn && menuOverlay) {
    let lastFocused = null;

    const getInertSiblings = () =>
      Array.from(document.body.children).filter(
        (el) => el !== menuOverlay && el.nodeType === 1
      );

    const getMenuFocusables = () =>
      menuOverlay.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

    const openMenu = () => {
      lastFocused = document.activeElement;
      menuOverlay.classList.add('active');
      menuOverlay.removeAttribute('inert');
      menuOverlay.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.disabled = true;
      document.body.style.overflow = 'hidden';
      getInertSiblings().forEach((el) => el.setAttribute('inert', ''));
      if (menuClose) requestAnimationFrame(() => menuClose.focus());
    };
    const closeMenu = () => {
      menuOverlay.classList.remove('active');
      menuOverlay.setAttribute('inert', '');
      menuOverlay.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.disabled = false;
      document.body.style.overflow = '';
      getInertSiblings().forEach((el) => el.removeAttribute('inert'));
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      } else {
        menuBtn.focus();
      }
    };

    menuBtn.addEventListener('click', openMenu);
    menuClose && menuClose.addEventListener('click', closeMenu);
    menuLinks.forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
      if (!menuOverlay.classList.contains('active')) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = getMenuFocusables();
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

  // --- CURSOR DATA READOUT (crosshair / coordinate readout, V3 motion fingerprint) ---
  const cursorReadout = document.querySelector('.cursor-readout');
  const cursorX = document.querySelector('.cursor-readout-x');
  const cursorY = document.querySelector('.cursor-readout-y');

  if (cursorReadout && !prefersReducedMotion && isHoverCapable) {
    let readoutVisible = false;
    let readoutRaf = false;
    document.addEventListener('mousemove', (e) => {
      if (readoutRaf) return;
      readoutRaf = true;
      requestAnimationFrame(() => {
        if (!readoutVisible) {
          cursorReadout.classList.remove('hidden');
          readoutVisible = true;
        }
        cursorReadout.style.transform = `translate(${e.clientX + 20}px, ${e.clientY + 20}px)`;
        cursorX.textContent = `X: ${String(e.clientX).padStart(4, '0')}`;
        cursorY.textContent = `Y: ${String(e.clientY).padStart(4, '0')}`;
        readoutRaf = false;
      });
    }, { passive: true });
    document.addEventListener('mouseleave', () => {
      cursorReadout.classList.add('hidden');
      readoutVisible = false;
    });
  }

  // --- HERO ENTRY (brutalist-snap fingerprint) ---
  // 1. Wordmark letters appear one-by-one, 35ms per-letter, no easing (CSS handles no transition).
  // 2. After all letters land, coordinate readout flickers in (3 opacity flashes over 200ms).
  const landingTitle = document.querySelector('.landing-title');
  const letters = document.querySelectorAll('.landing-title .letter');
  const coordReadout = document.querySelector('.landing-corner--tr');

  if (landingTitle && letters.length) {
    if (prefersReducedMotion) {
      landingTitle.classList.add('letters-in');
      // CSS reduced-motion rule already ensures opacity:1
    } else {
      // Step letters on with 35ms delay; CSS handles the snap (no transition).
      letters.forEach((letter, i) => {
        letter.style.transitionDelay = `0ms`;
      });
      let idx = 0;
      const stepLetter = () => {
        if (idx >= letters.length) {
          // All landed — flicker the coord readout
          if (coordReadout) {
            coordReadout.classList.add('flicker');
          }
          return;
        }
        // Add a flag at first letter so CSS reveals via .letters-in selector
        if (idx === 0) landingTitle.classList.add('letters-in');
        // Force a per-letter delay by mutating inline opacity
        letters[idx].style.opacity = '1';
        idx++;
        setTimeout(stepLetter, 35);
      };
      // Kick off after a tick so initial paint with opacity:0 is locked in
      requestAnimationFrame(stepLetter);
    }
  }

  // --- BRUTALIST-SNAP SCROLL REVEALS ---
  // transform: translateY(8px → 0) + opacity 0 → 1 in 80ms linear. Stagger 40ms.
  // CSS does the transition; JS adds .in with a per-element 40ms delay among siblings.
  const snapTargets = document.querySelectorAll('.brutalist-snap');
  if (snapTargets.length) {
    if (prefersReducedMotion) {
      snapTargets.forEach((el) => el.classList.add('in'));
    } else {
      const snapObserver = new IntersectionObserver((entries) => {
        // Sort by document order so the staccato cascade reads top-to-bottom
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target);
        visible.forEach((target, i) => {
          // 40ms stagger between siblings entering together
          setTimeout(() => target.classList.add('in'), i * 40);
          snapObserver.unobserve(target);
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

      snapTargets.forEach((el) => snapObserver.observe(el));
    }
  }

  // --- SECTION LABEL LINE-DRAW ---
  const sectionLabels = document.querySelectorAll('.section-label');
  if (sectionLabels.length) {
    const labelObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('line-drawn');
          labelObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    sectionLabels.forEach((el) => labelObserver.observe(el));
  }

  // --- CTA CLICK VIBRATION (room + offers + footer Reserve buttons) ---
  document.querySelectorAll('.room-cta, .offers-cta, .footer-cta, .landing-cta, .nav-cta').forEach((cta) => {
    cta.addEventListener('click', () => {
      cta.classList.add('vibrate');
      setTimeout(() => cta.classList.remove('vibrate'), 150);
    });
  });

})();
