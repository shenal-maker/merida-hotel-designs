/* ============================================
   BOUTIQUE BY THE MUSEO — V1 Cinematic Immersive
   Motion fingerprint: Sustained
     - cinematic-rise reveal: 1200ms cubic-bezier(0.16,1,0.3,1), 180ms stagger
     - Hero ken-burns 10s (CSS), hero copy 250ms stagger (CSS keyframe delays)
     - Hover: CTA scale 1.025 + ochre glow, 300ms ease (CSS)
   ============================================ */

(function () {
  'use strict';

  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  const hasHover = window.matchMedia('(hover: hover)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isFinePointer || !hasHover) {
    document.body.classList.add('coarse-pointer');
  }

  // --- Cinematic Intro: brand mark holds, then dissolves to reveal hero ---
  const introOverlay = document.getElementById('introOverlay');
  document.body.classList.add('intro-locked');

  // Gate hero title char-split on font readiness
  if (document.fonts && document.fonts.load) {
    document.fonts.load('1em "DM Serif Display"').then(initHeroTitle).catch(initHeroTitle);
  } else {
    initHeroTitle();
  }

  const introHoldTime = prefersReducedMotion ? 200 : 1200;
  setTimeout(() => {
    if (introOverlay) introOverlay.classList.add('dissolved');
    document.body.classList.remove('intro-locked');
    // Trigger hero ken-burns when overlay starts dissolving
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) heroBg.classList.add('loaded');
  }, introHoldTime);

  setTimeout(() => {
    if (introOverlay) introOverlay.style.display = 'none';
  }, introHoldTime + 1300);

  // --- Custom Cursor + trail (V1 signature; preserved) ---
  const cursor = document.querySelector('.cursor');
  const cursorTrail = document.querySelector('.cursor-trail');
  let cursorX = 0, cursorY = 0;
  let trailX = 0, trailY = 0;

  if (cursor && cursorTrail && isFinePointer && hasHover) {
    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      cursor.classList.add('visible');
      cursorTrail.classList.add('visible');
    });

    if (!prefersReducedMotion) {
      function animateTrail() {
        trailX += (cursorX - trailX) * 0.12;
        trailY += (cursorY - trailY) * 0.12;
        cursorTrail.style.left = trailX + 'px';
        cursorTrail.style.top = trailY + 'px';
        requestAnimationFrame(animateTrail);
      }
      animateTrail();
    } else {
      document.addEventListener('mousemove', (e) => {
        cursorTrail.style.left = e.clientX + 'px';
        cursorTrail.style.top = e.clientY + 'px';
      });
    }

    const interactives = document.querySelectorAll('a, button, .room-card, input, select');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorTrail.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorTrail.classList.remove('hover');
      });
    });

    // Cursor warms over imagery
    const imageContainers = document.querySelectorAll('.hero-bg, .location-image-wrap, .offers-bg');
    imageContainers.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.background = 'var(--terracotta)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.background = '';
      });
    });
  }

  // --- Progress Bar ---
  const progressBar = document.querySelector('.progress-bar');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + '%';
  }

  // --- Top Nav scroll effect (sticky CTA) ---
  const topNav = document.querySelector('.top-nav');
  function updateNav() {
    if (!topNav) return;
    if (window.scrollY > 80) topNav.classList.add('scrolled');
    else topNav.classList.remove('scrolled');
  }

  // --- Hero Title: letter-by-letter reveal, preserves <em> tag ---
  function initHeroTitle() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle || heroTitle.dataset.animated) return;
    heroTitle.dataset.animated = 'true';

    const nodes = Array.from(heroTitle.childNodes);
    heroTitle.innerHTML = '';
    let charIndex = 0;

    function appendCharsFrom(text, targetEl) {
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === ' ' || ch === ' ') {
          targetEl.appendChild(document.createTextNode(ch === ' ' ? ' ' : ' '));
          continue;
        }
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch;
        span.style.animationDelay = (0.1 + charIndex * 0.05) + 's';
        targetEl.appendChild(span);
        charIndex++;
      }
    }

    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        appendCharsFrom(node.textContent, heroTitle);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(false);
        const inner = node.textContent || '';
        appendCharsFrom(inner, clone);
        heroTitle.appendChild(clone);
      }
    });
  }

  // --- Cinematic Rise reveal — 180ms stagger between siblings sharing a parent ---
  const STAGGER_MS = 180;
  // Group reveal elements by parent so each group gets its own staggered sequence
  const riseElements = document.querySelectorAll('.cinematic-rise');
  const groupIndex = new WeakMap();
  riseElements.forEach(el => {
    // Honor explicit delay override (e.g. hero booking-plate joins late)
    if (el.dataset.riseDelay) {
      el.style.transitionDelay = el.dataset.riseDelay;
      return;
    }
    const parent = el.parentElement;
    if (!parent) return;
    const count = groupIndex.get(parent) || 0;
    el.style.transitionDelay = `${count * STAGGER_MS}ms`;
    groupIndex.set(parent, count + 1);
  });

  const riseObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        riseObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
  riseElements.forEach(el => riseObserver.observe(el));

  // --- Accent line + art divider draw ---
  const drawLines = document.querySelectorAll('.accent-line, .art-divider');
  const lineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        lineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4, rootMargin: '0px 0px -40px 0px' });
  drawLines.forEach(el => lineObserver.observe(el));

  // --- Parallax on key images (modest, Sustained register) ---
  const parallaxImages = [
    document.querySelector('.location-image-wrap img'),
  ].filter(Boolean);

  function updateParallax() {
    if (prefersReducedMotion) return;
    parallaxImages.forEach(img => {
      const parent = img.parentElement;
      const rect = parent.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = (rect.top + rect.height) / (window.innerHeight + rect.height);
      const offset = (progress - 0.5) * 60;
      img.style.transform = `translateY(${offset.toFixed(2)}px)`;
    });
  }

  // --- Room Card Click-to-Expand (touch friendly) ---
  const roomCards = document.querySelectorAll('.room-card[data-expandable]');
  roomCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      card.classList.toggle('expanded');
    });
  });

  // --- Scroll to Top ---
  const scrollToTopBtn = document.querySelector('.scroll-to-top');
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }
  function updateScrollToTop() {
    if (!scrollToTopBtn) return;
    if (window.scrollY > window.innerHeight * 0.9) scrollToTopBtn.classList.add('visible');
    else scrollToTopBtn.classList.remove('visible');
  }

  // --- In-page anchors: prevent default on bare '#' anchors ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) {
        e.preventDefault();
      }
    });
  });

  // ============================================
  // BOOKING WIDGET — date defaults, validation, room prefill
  // (Ported from V4 minimal pattern; re-styled to V1's brass-plate voice)
  // ============================================
  const bookingPlate = document.querySelector('.booking-plate');
  if (bookingPlate) {
    const fmt = (d) => d.toISOString().slice(0, 10);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const plusFour = new Date(today); plusFour.setDate(plusFour.getDate() + 4);

    const arrival = bookingPlate.querySelector('[data-role="arrival"]');
    const departure = bookingPlate.querySelector('[data-role="departure"]');
    const guests = bookingPlate.querySelector('[data-role="guests"]');
    const roomField = bookingPlate.querySelector('[data-role="room"]');
    const submitBtn = bookingPlate.querySelector('.booking-plate__submit');

    if (arrival) {
      arrival.min = fmt(today);
      if (!arrival.value) arrival.value = fmt(tomorrow);
    }
    if (departure) {
      departure.min = fmt(tomorrow);
      if (!departure.value) departure.value = fmt(plusFour);
    }

    // Departure must follow arrival
    if (arrival && departure) {
      arrival.addEventListener('change', () => {
        const a = new Date(arrival.value);
        if (isNaN(a)) return;
        const minDep = new Date(a); minDep.setDate(minDep.getDate() + 1);
        departure.min = fmt(minDep);
        if (new Date(departure.value) <= a) departure.value = fmt(minDep);
      });
    }

    // Submit: non-blocking confirmation (portfolio build)
    bookingPlate.addEventListener('submit', (ev) => {
      ev.preventDefault();
      if (!submitBtn) return;
      const a = arrival && arrival.value;
      const d = departure && departure.value;
      const g = guests && guests.value;
      const original = submitBtn.dataset.label || submitBtn.textContent.trim();
      submitBtn.dataset.label = original;
      submitBtn.textContent = `Checking ${a} → ${d} · ${g}`;
      setTimeout(() => { submitBtn.textContent = original; }, 1800);
    });

    // Room-card Reserve CTAs: prefill + smooth scroll
    const roomReserveLinks = document.querySelectorAll('.room-reserve[data-room]');
    roomReserveLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const roomKey = link.getAttribute('data-room') || '';
        const maxGuests = parseInt(link.getAttribute('data-max-guests') || '0', 10);

        if (roomField) roomField.value = roomKey;

        // Bump guest count if current < room's max capacity (don't lower it)
        if (guests && maxGuests > 0) {
          const current = parseInt(guests.value || '0', 10);
          if (current < maxGuests) {
            const target = String(maxGuests);
            const hasOption = Array.from(guests.options).some(o => o.value === target);
            if (hasOption) guests.value = target;
          }
        }

        // Visual prefill flash
        bookingPlate.classList.add('is-prefilled');
        setTimeout(() => bookingPlate.classList.remove('is-prefilled'), 1400);

        // Smooth scroll to widget
        const targetTop = bookingPlate.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({
          top: targetTop,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });

        // Focus arrival for keyboard users (after scroll settles)
        setTimeout(() => {
          if (arrival) arrival.focus({ preventScroll: true });
        }, prefersReducedMotion ? 0 : 700);
      });
    });
  }

  // --- Unified scroll handler ---
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateNav();
        updateParallax();
        updateScrollToTop();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

})();
