/* ============================================
   BOUTIQUE BY THE MUSEO — V3 INTERACTIONS
   Brutalist Snap / Staccato motion fingerprint.
   ============================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- MENU TOGGLE with FOCUS TRAP ---
  const menuBtn = document.querySelector('.nav-menu-btn');
  const menuOverlay = document.querySelector('.menu-overlay');
  const menuClose = document.querySelector('.menu-close');
  const menuLinks = document.querySelectorAll('.menu-overlay a');

  if (menuBtn && menuOverlay) {
    let lastFocused = null;

    const getInertSiblings = () => Array.from(document.body.children).filter(
      (el) => el !== menuOverlay && el.nodeType === 1
    );

    const getMenuFocusables = () => menuOverlay.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const openMenu = () => {
      lastFocused = document.activeElement;
      menuOverlay.classList.add('active');
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.disabled = true;
      document.body.style.overflow = 'hidden';
      getInertSiblings().forEach((el) => el.setAttribute('inert', ''));
      if (menuClose) {
        requestAnimationFrame(() => menuClose.focus());
      }
    };
    const closeMenu = () => {
      menuOverlay.classList.remove('active');
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

  // --- CURSOR DATA READOUT (crosshair coordinates) ---
  const cursorReadout = document.querySelector('.cursor-readout');
  const cursorX = document.querySelector('.cursor-readout-x');
  const cursorY = document.querySelector('.cursor-readout-y');

  if (cursorReadout && !prefersReducedMotion) {
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

  // --- HERO ENTRY: letter-by-letter typewriter (35ms per letter), then coord flicker ---
  const letters = document.querySelectorAll('.landing-title .letter');
  const landingCoords = document.querySelector('.landing-coords');

  if (letters.length) {
    if (prefersReducedMotion) {
      // Reduced motion: everything lit immediately
      letters.forEach((l) => l.classList.add('lit'));
      if (landingCoords) {
        landingCoords.style.animation = 'none';
        landingCoords.style.opacity = '0.55';
      }
    } else {
      // 35ms per letter, no easing — snap
      letters.forEach((letter, i) => {
        setTimeout(() => letter.classList.add('lit'), i * 35);
      });
      // After all letters land, flicker coord readout in (3 opacity flashes over 200ms)
      const coordDelay = letters.length * 35 + 80;
      if (landingCoords) {
        setTimeout(() => landingCoords.classList.add('flicker-in'), coordDelay);
      }
    }
  }

  // --- LANDING: mouse-reactive letter jitter (kept — brutalist signature) ---
  const landing = document.querySelector('.landing');
  if (landing && letters.length && !prefersReducedMotion) {
    let letterRaf = false;
    landing.addEventListener('mousemove', (e) => {
      if (letterRaf) return;
      letterRaf = true;
      requestAnimationFrame(() => {
        const rect = landing.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        letters.forEach((letter, i) => {
          const intensity = ((i % 5) + 1) * 2;
          letter.style.transform = `translate(${dx * intensity}px, ${dy * intensity}px)`;
        });
        letterRaf = false;
      });
    }, { passive: true });

    landing.addEventListener('mouseleave', () => {
      letters.forEach(letter => { letter.style.transform = 'translate(0, 0)'; });
    });
  }

  // --- BRUTALIST SNAP REVEAL ---
  // 80ms linear reveal + 40ms stagger within each section group.
  // Stagger is keyed off the element's index within its parent group.
  const snapEls = document.querySelectorAll('.brutalist-snap');
  if (snapEls.length && !prefersReducedMotion) {
    // Group by nearest section / room-block / landing — set --i per group
    const groups = new Map();
    snapEls.forEach((el) => {
      const group = el.closest('section, .footer-inner, .room-block, .offer-block, .location-grid, .booking-strip') || el.parentElement;
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(el);
    });
    groups.forEach((els) => {
      els.forEach((el, idx) => el.style.setProperty('--i', idx));
    });

    const snapObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('snapped');
          snapObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    snapEls.forEach((el) => snapObserver.observe(el));
  } else {
    // Reduced motion: ensure visible state
    snapEls.forEach((el) => el.classList.add('snapped'));
  }

  // --- NAV INVERSION: dark sections drive .nav--dark ---
  const navEl = document.querySelector('.nav');
  if (navEl) {
    const darkSelectors = ['.landing', '.art-collab'];
    const darkSections = document.querySelectorAll(darkSelectors.join(','));
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navEl.classList.add('nav--dark');
        } else {
          let anyDark = false;
          darkSections.forEach((s) => {
            const r = s.getBoundingClientRect();
            if (r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5) {
              anyDark = true;
            }
          });
          if (!anyDark) navEl.classList.remove('nav--dark');
        }
      });
    }, { rootMargin: '-50% 0px -50% 0px' });
    darkSections.forEach((s) => navObserver.observe(s));
    navEl.classList.add('nav--dark');
  }

  // --- ROOM / CTA CLICK VIBRATION (kept — brutalist micro-feedback) ---
  document.querySelectorAll('.room-cta, .art-collab-cta, .offer-cta, .landing-cta, .footer-cta, .booking-cell--cta').forEach((cta) => {
    cta.addEventListener('click', () => {
      cta.classList.add('vibrate');
      setTimeout(() => cta.classList.remove('vibrate'), 150);
    });
  });

  // --- BOOKING WIDGET ---
  // Date defaults: arrival = tomorrow, departure = arrival + 3 nights.
  // Keep departure >= arrival + 1 day. Pure vanilla, ported from V4 pattern.
  const bookingForm = document.getElementById('booking');
  if (bookingForm) {
    const fmt = (d) => d.toISOString().slice(0, 10);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const plusFour = new Date(today); plusFour.setDate(plusFour.getDate() + 4);

    const arrival = bookingForm.querySelector('[data-role="arrival"]');
    const departure = bookingForm.querySelector('[data-role="departure"]');
    const guests = bookingForm.querySelector('[data-role="guests"]');
    const roomField = bookingForm.querySelector('[data-role="room"]');
    const stepUp = bookingForm.querySelector('.booking-step--up');
    const stepDown = bookingForm.querySelector('.booking-step--down');
    const submitBtn = bookingForm.querySelector('.booking-cell--cta');

    if (arrival) {
      arrival.min = fmt(today);
      if (!arrival.value) arrival.value = fmt(tomorrow);
    }
    if (departure) {
      departure.min = fmt(tomorrow);
      if (!departure.value) departure.value = fmt(plusFour);
    }

    // Keep arrival/departure consistent — auto-shift departure forward
    if (arrival && departure) {
      arrival.addEventListener('change', () => {
        const a = new Date(arrival.value);
        if (isNaN(a)) return;
        const minDep = new Date(a); minDep.setDate(minDep.getDate() + 1);
        departure.min = fmt(minDep);
        if (new Date(departure.value) <= a) departure.value = fmt(minDep);
      });
    }

    // Stepper buttons (1–9)
    const clampGuests = (n) => Math.max(1, Math.min(9, n));
    const setGuests = (n) => {
      if (!guests) return;
      guests.value = String(clampGuests(parseInt(n, 10) || 2));
    };
    if (stepUp && guests) {
      stepUp.addEventListener('click', () => setGuests(parseInt(guests.value, 10) + 1));
    }
    if (stepDown && guests) {
      stepDown.addEventListener('click', () => setGuests(parseInt(guests.value, 10) - 1));
    }

    // Submit: surface confirmation without leaving page (placeholder booking engine)
    bookingForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const a = arrival ? arrival.value : '';
      const d = departure ? departure.value : '';
      const g = guests ? guests.value : '2';
      const room = roomField && roomField.value ? roomField.value : null;
      if (submitBtn) {
        const labelEl = submitBtn.querySelector('.booking-cta-label');
        const bracketEl = submitBtn.querySelector('.booking-cta-bracket');
        const originalLabel = submitBtn.dataset.label || (labelEl ? labelEl.textContent : '[ ENTER →');
        submitBtn.dataset.label = originalLabel;
        submitBtn.classList.add('is-checking');
        if (labelEl) {
          const summary = room
            ? `[ ${room.toUpperCase()} · ${a} → ${d} · ${g}`
            : `[ ${a} → ${d} · ${g}`;
          labelEl.textContent = summary;
        }
        if (bracketEl) bracketEl.textContent = ']';
        setTimeout(() => {
          if (labelEl) labelEl.textContent = originalLabel;
          submitBtn.classList.remove('is-checking');
        }, 2200);
      }
    });

    // Per-room prefill — any anchor with [data-room] populates hidden field +
    // bumps guest count to the room's capacity, then scrolls to widget.
    document.querySelectorAll('[data-room]').forEach((cta) => {
      cta.addEventListener('click', () => {
        const roomName = cta.getAttribute('data-room');
        const roomGuests = parseInt(cta.getAttribute('data-room-guests'), 10);
        if (roomField) roomField.value = roomName || '';
        if (guests && !isNaN(roomGuests)) {
          // Match capacity, but never less than current selection
          const current = parseInt(guests.value, 10) || 2;
          setGuests(Math.max(current, roomGuests));
        }
        // Light visual ack on the widget
        bookingForm.classList.add('booking-strip--prefilled');
        setTimeout(() => bookingForm.classList.remove('booking-strip--prefilled'), 600);
      });
    });
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

  // --- ANCHOR LINKS: instant scroll, brutalist ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    });
  });

})();
