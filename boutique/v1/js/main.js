/* ============================================
   BOUTIQUE BY THE MUSEO — V1 Cinematic Immersive
   Animations & Interactions
   ============================================ */

(function () {
  'use strict';

  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  const hasHover = window.matchMedia('(hover: hover)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mark coarse / no-hover devices so CSS can restore native cursor (Finding 3)
  if (!isFinePointer || !hasHover) {
    document.body.classList.add('coarse-pointer');
  }

  // --- Cinematic Intro: brand mark holds, then dissolves to reveal hero ---
  const introOverlay = document.getElementById('introOverlay');

  // JS-only scroll lock (Finding 1) — no inline style, so no-JS pages stay scrollable
  document.body.classList.add('intro-locked');

  // Gate hero title char-split on font readiness so glyphs don't shift mid-animation (Finding 15)
  if (document.fonts && document.fonts.load) {
    document.fonts.load('1em "DM Serif Display"').then(initHeroTitle).catch(initHeroTitle);
  } else {
    initHeroTitle();
  }

  // Dissolve overlay after a deliberate pause (gives the intro mark time to read)
  const introHoldTime = prefersReducedMotion ? 200 : 1200;
  setTimeout(() => {
    if (introOverlay) introOverlay.classList.add('dissolved');
    document.body.classList.remove('intro-locked');
    // Trigger hero bg ken-burns when overlay starts dissolving
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) heroBg.classList.add('loaded');
  }, introHoldTime);

  // Remove overlay from DOM after transition
  setTimeout(() => {
    if (introOverlay) introOverlay.style.display = 'none';
  }, introHoldTime + 1300);

  // --- Custom Cursor (only on devices that earn it) ---
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
      // Reduced motion: snap trail to cursor with no easing (Finding 12)
      document.addEventListener('mousemove', (e) => {
        cursorTrail.style.left = e.clientX + 'px';
        cursorTrail.style.top = e.clientY + 'px';
      });
    }

    const interactives = document.querySelectorAll('a, button, .nav-dot, .testimonial-dot, .room-card, .curated-card, .art-piece, input, select');
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
    const imageContainers = document.querySelectorAll('.hero-bg, .sanctuary-image-wrap, .breath-bg, .art-hero-bg, .art-piece-img, .location-image-wrap, .voices-bg, .interstitial-bg');
    imageContainers.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.background = 'var(--terracotta)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.background = '';
      });
    });
  }

  // --- Magnetic Buttons (Finding 16 — exclude borderless secondary link) ---
  if (isFinePointer && hasHover && !prefersReducedMotion) {
    const magneticBtns = document.querySelectorAll('.magnetic-btn, .hero-cta a:not(.hero-cta-secondary), .reserve-submit, .location-cta a');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const pullX = Math.max(-6, Math.min(6, x * 0.15));
        const pullY = Math.max(-6, Math.min(6, y * 0.15));
        btn.style.transform = `translate(${pullX}px, ${pullY}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
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

  // --- Navigation Dots ---
  const sections = document.querySelectorAll('[data-section]');
  const navDots = document.querySelectorAll('.nav-dot');

  function updateNavDots() {
    const scrollCenter = window.scrollY + window.innerHeight / 2;
    sections.forEach((section, i) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollCenter >= top && scrollCenter < bottom) {
        navDots.forEach(d => d.classList.remove('active'));
        if (navDots[i]) navDots[i].classList.add('active');
      }
    });
  }

  navDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = dot.getAttribute('data-target');
      const el = document.querySelector(target);
      // Let CSS scroll-margin-top + smooth-behavior do the work — no JS easing fight
      if (el) el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  // --- Top Nav scroll effect ---
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

    // Walk child nodes; for text nodes, split into chars; for elements (e.g. <em>), keep tag and split inside
    const nodes = Array.from(heroTitle.childNodes);
    heroTitle.innerHTML = '';

    let charIndex = 0;

    function appendCharsFrom(text, targetEl) {
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === ' ' || ch === ' ') {
          targetEl.appendChild(document.createTextNode(' '));
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
        // Preserve the tag (e.g. <em>by</em>) — animate its chars too
        const clone = node.cloneNode(false);
        const inner = node.textContent || '';
        appendCharsFrom(inner, clone);
        heroTitle.appendChild(clone);
      }
    });
  }

  // --- Reveal on Scroll ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-img');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));

  // --- Accent line + origin divider draw ---
  const drawLines = document.querySelectorAll('.accent-line, .origin-divider, .art-divider');
  const lineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.4, rootMargin: '0px 0px -40px 0px' });
  drawLines.forEach(el => lineObserver.observe(el));

  // --- Body warm shifts ---
  const colorShiftSections = [
    { el: document.querySelector('#hero'),     cls: 'warm-shift-1' },
    { el: document.querySelector('#sanctuary'),cls: 'warm-shift-2' },
    { el: document.querySelector('#rooms'),    cls: 'warm-shift-3' },
    { el: document.querySelector('#curated'),  cls: 'warm-shift-4' },
    { el: document.querySelector('#art'),      cls: 'warm-shift-5' },
  ];

  function updateColorShift() {
    const scrollCenter = window.scrollY + window.innerHeight / 2;
    document.body.classList.remove('warm-shift-1','warm-shift-2','warm-shift-3','warm-shift-4','warm-shift-5');
    for (let i = colorShiftSections.length - 1; i >= 0; i--) {
      const s = colorShiftSections[i];
      if (s.el && scrollCenter >= s.el.offsetTop) {
        document.body.classList.add(s.cls);
        break;
      }
    }
  }

  // --- Parallax on key images ---
  const parallaxImages = [
    document.querySelector('.sanctuary-image-wrap img'),
    document.querySelector('.location-image-wrap img'),
    document.querySelector('.art-hero-bg img'),
  ].filter(Boolean);

  function updateParallax() {
    if (prefersReducedMotion) return;
    parallaxImages.forEach(img => {
      const parent = img.parentElement;
      const rect = parent.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = (rect.top + rect.height) / (window.innerHeight + rect.height);
      const offset = (progress - 0.5) * 70;
      const isArtBg = parent.classList.contains('art-hero-bg');
      const scale = isArtBg ? 1.05 : 1.0;
      img.style.transform = `translateY(${offset.toFixed(2)}px) scale(${scale})`;
    });
  }

  // --- Voices / Testimonials Carousel ---
  // Pausable on hover/focus, keyboard-navigable, prev/next, aria-live announced (Finding 7)
  const voicesSection = document.querySelector('.section-voices');
  const testimonials = document.querySelectorAll('.testimonial-item');
  const testimDots = document.querySelectorAll('.testimonial-dot');
  const testimPrev = document.querySelector('.testimonial-prev');
  const testimNext = document.querySelector('.testimonial-next');
  const TESTIMONIAL_INTERVAL = 6000;
  let currentTestimonial = 0;
  let testimonialInterval = null;
  let paused = false;

  function showTestimonial(index) {
    if (testimonials[currentTestimonial]) {
      testimonials[currentTestimonial].classList.add('exiting');
      testimonials[currentTestimonial].classList.remove('active');
    }
    currentTestimonial = index;
    setTimeout(() => {
      testimonials.forEach(t => {
        t.classList.remove('exiting');
        t.classList.remove('active');
      });
      testimDots.forEach(d => {
        d.classList.remove('active');
        d.setAttribute('aria-selected', 'false');
      });
      if (testimonials[currentTestimonial]) testimonials[currentTestimonial].classList.add('active');
      if (testimDots[currentTestimonial]) {
        testimDots[currentTestimonial].classList.add('active');
        testimDots[currentTestimonial].setAttribute('aria-selected', 'true');
      }
    }, 220);
  }

  function nextTestimonial() {
    showTestimonial((currentTestimonial + 1) % testimonials.length);
  }
  function prevTestimonial() {
    showTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length);
  }
  function startTestimonialAuto() {
    if (paused || prefersReducedMotion || testimonials.length === 0) return;
    stopTestimonialAuto();
    testimonialInterval = setInterval(nextTestimonial, TESTIMONIAL_INTERVAL);
  }
  function stopTestimonialAuto() {
    if (testimonialInterval) {
      clearInterval(testimonialInterval);
      testimonialInterval = null;
    }
  }

  if (testimonials.length > 0) {
    showTestimonial(0);
    startTestimonialAuto();

    testimDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        stopTestimonialAuto();
        showTestimonial(i);
        startTestimonialAuto();
      });
      // Arrow-key navigation between dots (tablist convention)
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const next = (i + 1) % testimDots.length;
          testimDots[next].focus();
          showTestimonial(next);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prev = (i - 1 + testimDots.length) % testimDots.length;
          testimDots[prev].focus();
          showTestimonial(prev);
        }
      });
    });

    if (testimPrev) {
      testimPrev.addEventListener('click', () => {
        stopTestimonialAuto();
        prevTestimonial();
        startTestimonialAuto();
      });
    }
    if (testimNext) {
      testimNext.addEventListener('click', () => {
        stopTestimonialAuto();
        nextTestimonial();
        startTestimonialAuto();
      });
    }

    if (voicesSection) {
      voicesSection.addEventListener('mouseenter', () => { paused = true;  stopTestimonialAuto(); });
      voicesSection.addEventListener('mouseleave', () => { paused = false; startTestimonialAuto(); });
      voicesSection.addEventListener('focusin',    () => { paused = true;  stopTestimonialAuto(); });
      voicesSection.addEventListener('focusout',   (e) => {
        // Only resume if focus is leaving the section entirely
        if (!voicesSection.contains(e.relatedTarget)) {
          paused = false;
          startTestimonialAuto();
        }
      });
    }
  }

  // --- Room Card Click-to-Expand (touch friendly; keyboard is handled via :focus-within in CSS) ---
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

  // --- In-page anchors: prevent default on bare '#' anchors (Finding 19);
  //     otherwise let CSS scroll-behavior + scroll-margin-top do the work (Finding 10) ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) {
        e.preventDefault();
        return;
      }
      // Native anchor navigation handles scroll; CSS handles smoothness + offset.
    });
  });

  // --- Reservation Form (announce success via role=status / aria-live — Finding 8) ---
  const reserveForm = document.querySelector('.reserve-form');
  const reserveStatus = document.querySelector('.reserve-status');
  if (reserveForm) {
    reserveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submit = reserveForm.querySelector('.reserve-submit');
      if (submit) {
        const original = submit.textContent;
        submit.textContent = 'Enquiry sent';
        submit.style.background = 'var(--ivory)';
        setTimeout(() => {
          submit.textContent = original;
          submit.style.background = '';
        }, 3200);
      }
      if (reserveStatus) {
        reserveStatus.textContent = 'Enquiry received — we will write back from the house.';
        reserveStatus.classList.add('visible');
        setTimeout(() => {
          reserveStatus.textContent = '';
          reserveStatus.classList.remove('visible');
        }, 6000);
      }
    });
  }

  // --- Today's date as minimum for arrival field ---
  const arrival = document.getElementById('arrival');
  const departure = document.getElementById('departure');
  if (arrival && departure) {
    const today = new Date().toISOString().split('T')[0];
    arrival.min = today;
    departure.min = today;
    arrival.addEventListener('change', () => {
      if (arrival.value) departure.min = arrival.value;
    });
  }

  // --- Unified scroll handler ---
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateNavDots();
        updateNav();
        updateParallax();
        updateColorShift();
        updateScrollToTop();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

})();
