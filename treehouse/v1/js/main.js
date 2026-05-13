/* ============================================
   TREE HOUSE BOUTIQUE HOTEL — V1 Cinematic
   R3: motion + interaction + a11y pass.
   Interactions, intro, cursor, reveals, carousel.
   ============================================ */

(function () {
  'use strict';

  // ---------- Reduced motion + pointer-type capability flags ----------
  // Finding 7: gate JS-driven motion (parallax, cursor trail, hero ken-burns,
  // carousel auto-advance) on a live-updating prefers-reduced-motion check.
  const reduceMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = reduceMotionMQ.matches;
  reduceMotionMQ.addEventListener('change', e => { prefersReducedMotion = e.matches; });

  // Finding 4: pointer-fine + hover are required for the custom cursor /
  // magnetic affordance. Anything else gets the native cursor back.
  const pointerFineMQ = window.matchMedia('(pointer: fine)');
  const hoverHoverMQ = window.matchMedia('(hover: hover)');
  function applyPointerClass() {
    const fine = pointerFineMQ.matches && hoverHoverMQ.matches;
    document.body.classList.toggle('coarse-pointer', !fine);
  }
  applyPointerClass();
  pointerFineMQ.addEventListener('change', applyPointerClass);
  hoverHoverMQ.addEventListener('change', applyPointerClass);

  // ---------- Cinematic intro: wordmark + leaf appears, then overlay dissolves ----------
  // Finding 1: scroll-lock is a JS class, not an inline style on <body>. No-JS
  // users get no lock at all (the <noscript> block in <head> also unhides chrome).
  const introOverlay = document.getElementById('introOverlay');
  document.body.classList.add('intro-locked');

  // Kick off the hero title char animation as soon as we can
  initHeroAnimation();

  // After the wordmark has had a beat to read (1.3s), dissolve the overlay
  setTimeout(() => {
    if (introOverlay) introOverlay.classList.add('dissolved');
    document.body.classList.remove('intro-locked');
  }, 1300);

  // Pull the overlay out of the DOM once dissolve has finished
  setTimeout(() => {
    if (introOverlay) introOverlay.style.display = 'none';
  }, 2400);

  // ---------- Custom Cursor (leaf-green, brightens to ochre over images) ----------
  const cursor = document.querySelector('.cursor');
  const cursorTrail = document.querySelector('.cursor-trail');
  let cursorX = 0, cursorY = 0;
  let trailX = 0, trailY = 0;

  const useCustomCursor = cursor && cursorTrail &&
    pointerFineMQ.matches && hoverHoverMQ.matches;

  if (useCustomCursor) {
    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      cursor.classList.add('visible');
      cursorTrail.classList.add('visible');
    });

    function animateTrail() {
      if (prefersReducedMotion) {
        // Finding 7: snap-to-cursor when reduced motion — no easing loop
        trailX = cursorX;
        trailY = cursorY;
      } else {
        trailX += (cursorX - trailX) * 0.12;
        trailY += (cursorY - trailY) * 0.12;
      }
      cursorTrail.style.left = trailX + 'px';
      cursorTrail.style.top = trailY + 'px';
      requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Hover state on interactives
    const interactives = document.querySelectorAll(
      'a, button, .room-card, .nav-dot, .testimonial-dot, .journal-card, .curated-card'
    );
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

    // Finding 12: Cursor warms to ochre over images via CLASS toggle, not
    // inline style. The class loses to `.hover` cleanly via CSS specificity.
    const imageContainers = document.querySelectorAll(
      '.hero-bg, .sanctuary-image-wrap, .room-card-bg, .art-piece-img, .journal-card__img, .location-image-wrap, .interstitial-bg, .photo-strip-item'
    );
    imageContainers.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('over-image'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('over-image'));
    });
  }

  // ---------- Magnetic Buttons ----------
  // Finding 11: exclude full-bleed submit on narrow viewports — the magnetic
  // wobble on a 100%-wide button is uncalibrated.
  const narrowMQ = window.matchMedia('(max-width: 900px)');
  function magneticEligible(btn) {
    if (!pointerFineMQ.matches || !hoverHoverMQ.matches) return false;
    if (btn.classList.contains('reserve-submit')) return false;
    if (narrowMQ.matches && btn.classList.contains('reserve-submit')) return false;
    return true;
  }

  const magneticBtns = document.querySelectorAll(
    '.magnetic-btn, .hero-cta a.magnetic-btn, .location-cta a'
  );

  magneticBtns.forEach(btn => {
    if (!magneticEligible(btn)) return;

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

    // Click ripple (leaf-green wash)
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(142, 174, 125, 0.32);
        width: 0; height: 0;
        left: ${e.clientX - rect.left}px;
        top: ${e.clientY - rect.top}px;
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: rippleOut 0.6s ease-out forwards;
      `;
      const prevPos = getComputedStyle(btn).position;
      if (prevPos === 'static') btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ---------- Progress Bar ----------
  const progressBar = document.querySelector('.progress-bar');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0 && progressBar) {
      progressBar.style.width = (scrollTop / docHeight) * 100 + '%';
    }
  }

  // ---------- Nav Dots ----------
  // Finding 14: use getBoundingClientRect() so scroll-spy is document-position
  // -agnostic and works whether section offsetParent is body or a wrapper.
  const sections = document.querySelectorAll('[data-section]');
  const navDots = document.querySelectorAll('.nav-dot');

  function updateNavDots() {
    if (sections.length === 0) return;
    const center = window.innerHeight / 2;
    let activeIdx = 0;
    sections.forEach((section, i) => {
      const r = section.getBoundingClientRect();
      if (r.top <= center && r.bottom > center) activeIdx = i;
    });
    navDots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
  }

  navDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = dot.getAttribute('data-target');
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  // ---------- Top Nav scroll effect ----------
  const topNav = document.querySelector('.top-nav');
  function updateNav() {
    if (!topNav) return;
    if (window.scrollY > 80) topNav.classList.add('scrolled');
    else topNav.classList.remove('scrolled');
  }

  // ---------- Hero title char-by-char ----------
  function initHeroAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle || heroTitle.dataset.animated) return;
    heroTitle.dataset.animated = 'true';

    // Walk child nodes so we preserve <em>House</em> structure
    const animateNode = (node, indexRef) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const frag = document.createDocumentFragment();
        for (let i = 0; i < text.length; i++) {
          const c = text[i];
          if (c === ' ') {
            frag.appendChild(document.createTextNode(' '));
            continue;
          }
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = c;
          // Push the chars to start AFTER the intro overlay starts dissolving (1.3s)
          span.style.animationDelay = (1.35 + indexRef.i * 0.05) + 's';
          frag.appendChild(span);
          indexRef.i++;
        }
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Recurse for <em> etc.
        const children = Array.from(node.childNodes);
        children.forEach(c => animateNode(c, indexRef));
      }
    };

    const indexRef = { i: 0 };
    Array.from(heroTitle.childNodes).forEach(n => animateNode(n, indexRef));

    // Start the hero background slow zoom in sync with overlay dissolve
    // (skipped under reduced motion — CSS already pins to scale(1))
    if (!prefersReducedMotion) {
      setTimeout(() => {
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) heroBg.classList.add('loaded');
      }, 900);
    }
  }

  // ---------- Reveal on Scroll ----------
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-img, .reveal-stat'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // Accent lines and dividers
  const accentLines = document.querySelectorAll('.accent-line, .origin-divider, .art-divider');
  const accentObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.4, rootMargin: '0px 0px -40px 0px' });
  accentLines.forEach(el => accentObserver.observe(el));

  // ---------- Sanctuary image parallax ----------
  // Finding 7: parallax respects prefers-reduced-motion.
  const sanctuaryImg = document.querySelector('.sanctuary-image-wrap img');

  function updateParallax() {
    if (!sanctuaryImg) return;
    if (prefersReducedMotion) {
      if (sanctuaryImg.style.transform) sanctuaryImg.style.transform = '';
      return;
    }
    const wrap = sanctuaryImg.parentElement;
    const rect = wrap.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const progress = (rect.top + rect.height) / (window.innerHeight + rect.height);
    const offset = (progress - 0.5) * 90;
    sanctuaryImg.style.transform = `translateY(${offset}px) scale(1.05)`;
  }

  // ---------- Room card click-to-expand ----------
  const roomCards = document.querySelectorAll('.room-card[data-expandable]');
  roomCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't toggle on link clicks
      if (e.target.closest('a')) return;
      card.classList.toggle('expanded');
    });
  });

  // ---------- Voices carousel (Finding 6) ----------
  // Pausable on hover/focus, keyboard-navigable, prev/next buttons,
  // aria-live polite announcements, paused under prefers-reduced-motion,
  // paused on tab-hidden.
  const voicesSection = document.querySelector('.section-voices');
  const testimonials = document.querySelectorAll('.testimonial-item');
  const testimDots = document.querySelectorAll('.testimonial-dot');
  const testimPrev = document.querySelector('.testimonial-prev');
  const testimNext = document.querySelector('.testimonial-next');
  let currentTestimonial = 0;
  let testimonialTimer = null;
  let testimonialPaused = false;

  function dwellMsFor(item) {
    if (!item) return 6000;
    const chars = (item.textContent || '').trim().length;
    // ~50 chars/sec reading + a beat — clamp to 4.5s – 9s.
    return Math.min(9000, Math.max(4500, 2200 + chars * 28));
  }

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

      if (testimonials[currentTestimonial]) {
        testimonials[currentTestimonial].classList.add('active');
      }
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

  function scheduleNextTestimonial() {
    clearTimeout(testimonialTimer);
    if (testimonialPaused || prefersReducedMotion || testimonials.length === 0) return;
    const ms = dwellMsFor(testimonials[currentTestimonial]);
    testimonialTimer = setTimeout(() => {
      nextTestimonial();
      scheduleNextTestimonial();
    }, ms);
  }

  function pauseTestimonials() {
    testimonialPaused = true;
    clearTimeout(testimonialTimer);
  }
  function resumeTestimonials() {
    testimonialPaused = false;
    scheduleNextTestimonial();
  }

  if (testimonials.length > 0) {
    showTestimonial(0);
    scheduleNextTestimonial();

    testimDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearTimeout(testimonialTimer);
        showTestimonial(i);
        scheduleNextTestimonial();
      });
      // Arrow-key navigation between dots (tablist convention)
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const next = (i + 1) % testimDots.length;
          testimDots[next].focus();
          showTestimonial(next);
          scheduleNextTestimonial();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prev = (i - 1 + testimDots.length) % testimDots.length;
          testimDots[prev].focus();
          showTestimonial(prev);
          scheduleNextTestimonial();
        }
      });
    });

    if (testimPrev) {
      testimPrev.addEventListener('click', () => {
        clearTimeout(testimonialTimer);
        prevTestimonial();
        scheduleNextTestimonial();
      });
    }
    if (testimNext) {
      testimNext.addEventListener('click', () => {
        clearTimeout(testimonialTimer);
        nextTestimonial();
        scheduleNextTestimonial();
      });
    }

    if (voicesSection) {
      voicesSection.addEventListener('mouseenter', pauseTestimonials);
      voicesSection.addEventListener('mouseleave', resumeTestimonials);
      voicesSection.addEventListener('focusin', pauseTestimonials);
      voicesSection.addEventListener('focusout', (e) => {
        // Only resume when focus actually leaves the section
        if (!voicesSection.contains(e.relatedTarget)) resumeTestimonials();
      });
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearTimeout(testimonialTimer);
      else if (!testimonialPaused) scheduleNextTestimonial();
    });
  }

  // ---------- Scroll-to-top ----------
  const scrollToTopBtn = document.querySelector('.scroll-to-top');
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }
  function updateScrollToTop() {
    if (!scrollToTopBtn) return;
    if (window.scrollY > window.innerHeight * 0.9) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  }

  // ---------- Smooth anchor scroll ----------
  // Finding 5: respect prefers-reduced-motion when issuing programmatic
  // scrollIntoView. CSS scroll-padding-top handles the fixed-nav offset.
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  // ---------- Reserve form (Finding 10) ----------
  // Polite success / error announcements via aria-live status region.
  // Arrival/Departure min dates derived from "today" (no yesterday-arrival).
  const reserveForm = document.querySelector('.reserve-form');
  const reserveStatus = document.querySelector('.reserve-status');
  const arrivalInput = document.getElementById('arrival');
  const departureInput = document.getElementById('departure');

  if (arrivalInput && departureInput) {
    const today = new Date().toISOString().split('T')[0];
    arrivalInput.min = today;
    departureInput.min = today;
    arrivalInput.addEventListener('change', () => {
      if (arrivalInput.value) departureInput.min = arrivalInput.value;
    });
  }

  if (reserveForm) {
    reserveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submit = reserveForm.querySelector('.reserve-submit');
      if (!submit) return;
      const original = submit.dataset.label || submit.textContent;
      submit.dataset.label = original;

      // Validate arrival < departure if both supplied
      if (arrivalInput && departureInput && arrivalInput.value && departureInput.value &&
          departureInput.value <= arrivalInput.value) {
        if (reserveStatus) {
          reserveStatus.classList.add('is-error');
          reserveStatus.textContent = 'Departure must be after arrival.';
        }
        return;
      }

      submit.textContent = 'Enquiry sent';
      submit.style.background = 'var(--leaf-bright)';
      if (reserveStatus) {
        reserveStatus.classList.remove('is-error');
        reserveStatus.textContent = 'Enquiry received — the house will write back from reservations@treehouseboutiquehotel.com within a day.';
      }

      setTimeout(() => {
        submit.textContent = original;
        submit.style.background = '';
        if (reserveStatus) reserveStatus.textContent = '';
      }, 5000);
    });
  }

  // ---------- Unified scroll handler (rAF-throttled) ----------
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateNavDots();
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
