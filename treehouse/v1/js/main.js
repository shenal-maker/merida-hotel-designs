/* ============================================
   TREE HOUSE BOUTIQUE HOTEL — V1 Cinematic (trimmed)
   Motion fingerprint: Sustained.
   - Cinematic intro overlay (curtain dissolve)
   - Hero ken-burns + per-char title reveal + staggered copy
   - Scroll reveals on .cinematic-rise (1200ms cubic-bezier(0.16,1,0.3,1), 180ms stagger via CSS)
   - Custom cursor with leaf-bright/ochre + difference-blend trail
   ============================================ */

(function () {
  'use strict';

  // ---------- Reduced motion + pointer-type capability flags ----------
  const reduceMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = reduceMotionMQ.matches;
  reduceMotionMQ.addEventListener('change', e => { prefersReducedMotion = e.matches; });

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

  // ---------- Custom Cursor (leaf-bright, warms to ochre over images) ----------
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

    const interactives = document.querySelectorAll('a, button, .room-card');
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

    // Cursor warms to ochre over images
    const imageContainers = document.querySelectorAll(
      '.hero-bg, .room-card-bg, .art-piece-img, .location-image-wrap'
    );
    imageContainers.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('over-image'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('over-image'));
    });
  }

  // ---------- Magnetic primary CTA (hero + location) ----------
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach(btn => {
    if (!pointerFineMQ.matches || !hoverHoverMQ.matches) return;

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

  // ---------- Progress Bar ----------
  const progressBar = document.querySelector('.progress-bar');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0 && progressBar) {
      progressBar.style.width = (scrollTop / docHeight) * 100 + '%';
    }
  }

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
        const children = Array.from(node.childNodes);
        children.forEach(c => animateNode(c, indexRef));
      }
    };

    const indexRef = { i: 0 };
    Array.from(heroTitle.childNodes).forEach(n => animateNode(n, indexRef));

    // Hero ken-burns: scale 1.06 → 1.00 over ~11s (CSS-driven), kicked off after intro
    if (!prefersReducedMotion) {
      setTimeout(() => {
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) heroBg.classList.add('loaded');
      }, 900);
    }
  }

  // ---------- Reveal on Scroll: .cinematic-rise ----------
  // 1200ms ease-out + translateY(40px→0) is in CSS. Stagger is also in CSS via :nth-child.
  // JS only adds .visible when the element enters the viewport.
  const revealElements = document.querySelectorAll('.cinematic-rise');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- Smooth anchor scroll ----------
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

  // ---------- Unified scroll handler (rAF-throttled) ----------
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateNav();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

})();
