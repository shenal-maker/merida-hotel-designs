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

  // ============================================
  // Reservation card — date defaults, min clamps,
  // submit confirmation, room prefill from room cards.
  // Ported from v4-minimal, restyled for V2 editorial register.
  // ============================================
  const fmt = (d) => d.toISOString().slice(0, 10);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const plusFour = new Date(today); plusFour.setDate(plusFour.getDate() + 4);

  document.querySelectorAll('input[type="date"][data-role="arrival"]').forEach((el) => {
    el.min = fmt(today);
    if (!el.value) el.value = fmt(tomorrow);
  });
  document.querySelectorAll('input[type="date"][data-role="departure"]').forEach((el) => {
    el.min = fmt(tomorrow);
    if (!el.value) el.value = fmt(plusFour);
  });

  const reservationForms = document.querySelectorAll('.reservation-card');
  reservationForms.forEach((form) => {
    const arrival = form.querySelector('[data-role="arrival"]');
    const departure = form.querySelector('[data-role="departure"]');
    if (arrival && departure) {
      arrival.addEventListener('change', () => {
        const a = new Date(arrival.value);
        if (isNaN(a)) return;
        const minDep = new Date(a); minDep.setDate(minDep.getDate() + 1);
        departure.min = fmt(minDep);
        if (new Date(departure.value) <= a) departure.value = fmt(minDep);
      });
    }

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const a = arrival ? arrival.value : '';
      const d = departure ? departure.value : '';
      const guestsEl = form.querySelector('[data-role="guests"]');
      const g = guestsEl ? guestsEl.value : '2';
      // Portfolio build — surface a non-blocking confirmation.
      const btn = form.querySelector('.reservation-cta');
      if (!btn) return;
      if (!btn.dataset.label) btn.dataset.label = btn.innerHTML;
      btn.textContent = `Checking ${a} → ${d} · ${g}`;
      setTimeout(() => { btn.innerHTML = btn.dataset.label; }, 1800);
    });
  });

  // Prefill from per-room "Reserve this room" CTAs.
  // Each room CTA carries data-room (label) + data-guests (capacity).
  // On click: set hidden room input, update the visible label,
  // bump guests select to capacity (clamped to existing options),
  // then let the existing smooth-scroll handler do the scroll.
  const bookingForm = document.getElementById('booking');
  const roomLabelEl = bookingForm ? bookingForm.querySelector('[data-role="room-label"]') : null;
  const roomHiddenEl = bookingForm ? bookingForm.querySelector('input[data-role="room"]') : null;
  const guestsSelect = bookingForm ? bookingForm.querySelector('select[data-role="guests"]') : null;

  document.querySelectorAll('.room-cta[data-room]').forEach((cta) => {
    cta.addEventListener('click', () => {
      const room = cta.getAttribute('data-room') || '';
      const guests = cta.getAttribute('data-guests');
      if (roomHiddenEl) roomHiddenEl.value = room;
      if (roomLabelEl && room) {
        roomLabelEl.innerHTML = 'For <strong>' + room + '</strong>';
      }
      if (guestsSelect && guests) {
        // Clamp to highest available option <= requested guests.
        const requested = parseInt(guests, 10);
        const options = Array.from(guestsSelect.options).map((o) => parseInt(o.value, 10));
        const match = options.filter((v) => !isNaN(v) && v <= requested).pop();
        if (typeof match === 'number') guestsSelect.value = String(match);
      }
    });
  });

})();
