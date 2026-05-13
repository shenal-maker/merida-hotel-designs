/* ============================================
   Tree House Boutique Hotel — V2 Editorial Magazine
   Trimmed JS:
     • Masthead hide-on-scroll / scrolled state
     • Mobile menu w/ focus trap + Esc
     • Smooth scroll for in-page links
     • V2 motion signature — clip-path L→R sweep reveals
       (520ms cubic-bezier(0.45, 0, 0.15, 1), 120ms stagger per section)
   ============================================ */

(function () {
  'use strict';

  // Reactive reduced-motion
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduce = reduceMQ.matches;
  if (typeof reduceMQ.addEventListener === 'function') {
    reduceMQ.addEventListener('change', (e) => { reduce = e.matches; });
  } else if (typeof reduceMQ.addListener === 'function') {
    reduceMQ.addListener((e) => { reduce = e.matches; });
  }

  // ---------- V2 reveals: clip-path sweep with 120ms stagger ----------
  // Children of a section animate in document order. Each section observes
  // independently so cross-section staggering doesn't accumulate.
  const STAGGER = 120;

  const sections = document.querySelectorAll('section, footer');

  if ('IntersectionObserver' in window) {
    sections.forEach((section) => {
      const sweeps = Array.from(section.querySelectorAll('.editorial-sweep'));
      if (sweeps.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            if (reduce) {
              sweeps.forEach((el) => el.classList.add('visible'));
            } else {
              sweeps.forEach((el, i) => {
                setTimeout(() => el.classList.add('visible'), i * STAGGER);
              });
            }
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      observer.observe(section);
    });

    // Also reveal draw-lines via the same observer pattern
    const drawLines = document.querySelectorAll('.draw-line');
    if (drawLines.length) {
      const drawObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              drawObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      drawLines.forEach((el) => drawObserver.observe(el));
    }
  } else {
    // No IO support → show everything immediately
    document.querySelectorAll('.editorial-sweep, .draw-line').forEach((el) => {
      el.classList.add('visible');
    });
  }

  // Make sure above-the-fold hero reveals fire even if already in viewport
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .editorial-sweep').forEach((el, i) => {
      if (reduce) {
        el.classList.add('visible');
      } else {
        setTimeout(() => el.classList.add('visible'), i * STAGGER);
      }
    });
  });

  // ---------- Masthead hide-on-scroll / scrolled state ----------
  const masthead = document.querySelector('.masthead-bar');
  let lastScroll = 0;
  const scrollThreshold = 100;

  window.addEventListener(
    'scroll',
    () => {
      if (!masthead) return;
      const currentScroll = window.scrollY;

      if (currentScroll > scrollThreshold) {
        if (currentScroll > lastScroll + 4) {
          masthead.classList.add('hidden');
        } else if (currentScroll < lastScroll - 4) {
          masthead.classList.remove('hidden');
        }
        masthead.classList.add('scrolled');
      } else {
        masthead.classList.remove('hidden');
        masthead.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    },
    { passive: true }
  );

  // ---------- Mobile menu: focus trap + Esc + return focus ----------
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mastheadNav = document.querySelector('.masthead-nav');

  if (menuToggle && mastheadNav) {
    const getNavLinks = () => Array.from(mastheadNav.querySelectorAll('a'));

    function trapKeydown(e) {
      if (e.key === 'Escape') {
        closeMenu();
        return;
      }
      if (e.key !== 'Tab') return;
      const links = getNavLinks();
      if (!links.length) return;
      const first = links[0];
      const last = links[links.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }

    function openMenu() {
      mastheadNav.classList.add('open');
      menuToggle.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      const firstLink = getNavLinks()[0];
      if (firstLink) firstLink.focus();
      document.addEventListener('keydown', trapKeydown);
    }

    function closeMenu() {
      const wasOpen = mastheadNav.classList.contains('open');
      mastheadNav.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', trapKeydown);
      if (wasOpen) menuToggle.focus();
    }

    menuToggle.addEventListener('click', () => {
      if (mastheadNav.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mastheadNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (mastheadNav.classList.contains('open')) closeMenu();
      });
    });
  }

  // ---------- Reservation card: date defaults + integrity ----------
  // Port of the V4 booking pattern, kept self-contained.
  const fmtDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const plusFour = new Date(today);
  plusFour.setDate(plusFour.getDate() + 4);

  const reservationForm = document.querySelector('.reservation-card');
  if (reservationForm) {
    const arrival = reservationForm.querySelector('input[data-role="arrival"]');
    const departure = reservationForm.querySelector('input[data-role="departure"]');
    const guests = reservationForm.querySelector('select[data-role="guests"]');
    const roomField = reservationForm.querySelector('input[data-role="room"]');
    const submitBtn = reservationForm.querySelector('.reservation-submit');

    if (arrival) {
      arrival.min = fmtDate(today);
      if (!arrival.value) arrival.value = fmtDate(tomorrow);
    }
    if (departure) {
      departure.min = fmtDate(tomorrow);
      if (!departure.value) departure.value = fmtDate(plusFour);
    }

    if (arrival && departure) {
      arrival.addEventListener('change', () => {
        const a = new Date(arrival.value);
        if (isNaN(a)) return;
        const minDep = new Date(a);
        minDep.setDate(minDep.getDate() + 1);
        departure.min = fmtDate(minDep);
        if (new Date(departure.value) <= a) {
          departure.value = fmtDate(minDep);
        }
      });
    }

    reservationForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      if (!submitBtn) return;
      const a = arrival ? arrival.value : '';
      const d = departure ? departure.value : '';
      const g = guests ? guests.value : '2';
      const r = roomField && roomField.value ? ` · ${roomField.value}` : '';
      const labelEl = submitBtn.querySelector('.reservation-submit-label');
      if (!labelEl) return;
      const original = submitBtn.dataset.label || labelEl.textContent.trim();
      submitBtn.dataset.label = original;
      labelEl.textContent = `Checking ${a} → ${d} · ${g}${r}`;
      setTimeout(() => { labelEl.textContent = original; }, 1800);
    });

    // ---------- Room-card Reserve: prefill room + guests, then scroll ----------
    document.querySelectorAll('a.room-cta[data-room]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href !== '#booking') return;
        e.preventDefault();
        const room = link.dataset.room || '';
        const g = link.dataset.guests;
        if (roomField) roomField.value = room;
        if (guests && g) {
          const opt = guests.querySelector(`option[value="${g}"]`);
          if (opt) guests.value = g;
        }
        reservationForm.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        // Surface the chosen room in the title region (visually-quiet, focus arrival)
        if (arrival) {
          // small delay so scroll begins first
          setTimeout(() => { try { arrival.focus({ preventScroll: true }); } catch (_) { arrival.focus(); } }, reduce ? 0 : 320);
        }
      });
    });
  }

  // ---------- Smooth scroll for in-page links ----------
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    // Skip room-CTA prefill links — handled above.
    if (link.matches('a.room-cta[data-room]')) return;
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      }
    });
  });
})();
