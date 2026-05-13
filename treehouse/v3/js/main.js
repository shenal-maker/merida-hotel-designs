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
  document.querySelectorAll('.room-cta, .offers-cta, .footer-cta, .landing-cta, .nav-cta, .booking-cta').forEach((cta) => {
    cta.addEventListener('click', () => {
      cta.classList.add('vibrate');
      setTimeout(() => cta.classList.remove('vibrate'), 150);
    });
  });

  // --- BOOKING WIDGET ---
  // Date defaults: arrival = tomorrow, departure = arrival + 3 nights.
  // Departure auto-shifts forward if arrival is changed past it. Both inputs clamped via min.
  // Stepper: +/- buttons mutate guests, clamped [1, 6].
  // Submit: prevented (portfolio build) — flashes confirmation in the CTA copy.
  // Per-card CTA prefill: smooth-scroll to #booking, set hidden room, bump guests to room occupancy.
  const fmtDate = (d) => d.toISOString().slice(0, 10);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const plusFour = new Date(today); plusFour.setDate(plusFour.getDate() + 4);

  document.querySelectorAll('input[type="date"][data-role="arrival"]').forEach((el) => {
    el.min = fmtDate(today);
    if (!el.value) el.value = fmtDate(tomorrow);
  });
  document.querySelectorAll('input[type="date"][data-role="departure"]').forEach((el) => {
    el.min = fmtDate(tomorrow);
    if (!el.value) el.value = fmtDate(plusFour);
  });

  const bookingForm = document.querySelector('.booking');
  if (bookingForm) {
    const arrival = bookingForm.querySelector('[data-role="arrival"]');
    const departure = bookingForm.querySelector('[data-role="departure"]');
    const guests = bookingForm.querySelector('[data-role="guests"]');
    const cta = bookingForm.querySelector('.booking-cta');
    const ctaMeta = bookingForm.querySelector('#booking-cta-meta');
    const roomField = bookingForm.querySelector('#booking-room');

    if (arrival && departure) {
      arrival.addEventListener('change', () => {
        const a = new Date(arrival.value);
        if (isNaN(a)) return;
        const minDep = new Date(a); minDep.setDate(minDep.getDate() + 1);
        departure.min = fmtDate(minDep);
        if (new Date(departure.value) <= a) departure.value = fmtDate(minDep);
      });
    }

    // Stepper
    bookingForm.querySelectorAll('.booking-step').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!guests) return;
        const delta = parseInt(btn.dataset.step, 10) || 0;
        const min = parseInt(guests.min, 10) || 1;
        const max = parseInt(guests.max, 10) || 6;
        const cur = parseInt(guests.value, 10) || min;
        const next = Math.max(min, Math.min(max, cur + delta));
        guests.value = String(next);
      });
    });

    // Submit — portfolio build: confirmation flash. Production would forward to PMS.
    bookingForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      if (!cta) return;
      const original = cta.dataset.label || cta.textContent.trim();
      cta.dataset.label = original;
      const a = arrival ? arrival.value : '';
      const d = departure ? departure.value : '';
      const g = guests ? guests.value : '2';
      const room = roomField && roomField.value ? roomField.value.toUpperCase().replace(/-/g, ' ') : 'ANY ROOM';
      cta.textContent = `CHECKING ${a} → ${d}`;
      if (ctaMeta) ctaMeta.textContent = `— ${g} GUEST${g === '1' ? '' : 'S'} · ${room}`;
      setTimeout(() => {
        cta.textContent = original;
        if (ctaMeta) ctaMeta.textContent = '— DIRECT BOOKING';
      }, 1800);
    });

    // Per-card Reserve prefill — smooth-scroll, set room, bump guests to room occupancy.
    document.querySelectorAll('.room-cta[data-room]').forEach((roomCta) => {
      roomCta.addEventListener('click', (ev) => {
        const room = roomCta.dataset.room;
        const label = roomCta.dataset.roomLabel || room;
        const occ = parseInt(roomCta.dataset.roomOcc, 10);
        if (roomField) roomField.value = room;
        if (guests && !isNaN(occ)) {
          const max = parseInt(guests.max, 10) || 6;
          guests.value = String(Math.max(1, Math.min(max, occ)));
        }
        if (ctaMeta) ctaMeta.textContent = `— PREFILLED · ${label.toUpperCase()}`;
        // Defer scroll to next tick so the anchor + smooth-scroll handler can fire cleanly
        // even though the href is "#booking" (no preventDefault — let anchor jump happen).
      });
    });
  }

  // --- SMOOTH-SCROLL FOR IN-PAGE ANCHORS ---
  // Tree House V3 disables CSS smooth-scroll (brutalist). For booking-prefill flow we still
  // want users to *land* on the widget rather than be flung past it, so we hijack only the
  // anchors that point to #booking and scroll with a fixed 64px nav offset.
  document.querySelectorAll('a[href="#booking"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector('#booking');
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 64;
      // 'auto' keeps the brutalist register; the anchor jump is a hard cut, no easing.
      window.scrollTo({ top, behavior: 'auto' });
      // Move focus into the widget for keyboard / screen-reader continuity
      const firstInput = target.querySelector('input, button');
      if (firstInput && typeof firstInput.focus === 'function') {
        // Defer so any anchor-default behaviors complete first
        requestAnimationFrame(() => firstInput.focus({ preventScroll: true }));
      }
    });
  });

})();
