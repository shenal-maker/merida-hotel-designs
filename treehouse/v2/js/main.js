/* ============================================
   Tree House Boutique Hotel — V2 Editorial Magazine
   Interactive layer — light, editorial, botanical
   Sister to Boutique V2; page counter uses Roman numerals
   for the field-journal apparatus.
   ============================================ */

(function () {
  'use strict';

  // --- Reactive reduced-motion (Critique R3 §13) ---
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduce = reduceMQ.matches;
  if (typeof reduceMQ.addEventListener === 'function') {
    reduceMQ.addEventListener('change', (e) => { reduce = e.matches; });
  } else if (typeof reduceMQ.addListener === 'function') {
    reduceMQ.addListener((e) => { reduce = e.matches; });
  }

  // Helper — integer to Roman numeral (handles 1..50, more than enough)
  function toRoman(n) {
    if (n < 1) return '';
    const map = [
      ['L', 50], ['XL', 40], ['X', 10], ['IX', 9],
      ['V', 5], ['IV', 4], ['I', 1]
    ];
    let out = '';
    for (const [letter, value] of map) {
      while (n >= value) {
        out += letter;
        n -= value;
      }
    }
    return out;
  }

  // --- Staggered reveals for children of [data-stagger] ---
  // Run stagger setup first so children can be marked and excluded from
  // the global observer (Critique R3 §14 — observers were colliding).
  const staggeredChildren = new Set();
  document.querySelectorAll('[data-stagger]').forEach((parent) => {
    const children = parent.querySelectorAll('.reveal');
    const delay = parseInt(parent.dataset.stagger, 10) || 120;

    children.forEach((c) => {
      c.classList.add('reveal--staggered');
      staggeredChildren.add(c);
    });

    if (!('IntersectionObserver' in window)) {
      children.forEach((c) => c.classList.add('visible'));
      return;
    }

    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            children.forEach((child, i) => {
              setTimeout(() => child.classList.add('visible'), i * delay);
            });
            staggerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    staggerObserver.observe(parent);
  });

  // --- Scroll Reveal (global) ---
  // Skip the staggered children so the stagger cascade is honoured.
  const revealCandidates = document.querySelectorAll(
    '.reveal, .reveal-line, .draw-line, .editorial-img'
  );
  const revealElements = Array.from(revealCandidates).filter(
    (el) => !staggeredChildren.has(el)
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('visible'));
  }

  // --- Masthead hide-on-scroll-down, show-on-scroll-up + scrolled state ---
  const masthead = document.querySelector('.masthead-bar');
  let lastScroll = 0;
  const scrollThreshold = 100;

  window.addEventListener(
    'scroll',
    () => {
      const currentScroll = window.scrollY;
      if (!masthead) return;

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

  // --- Mobile menu toggle with focus trap + Esc + return focus (Critique R3 §11) ---
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

  // --- Page Counter (Roman numerals) with flip + section label ---
  // Hero is data-section="0" / Portada — counter is hidden across the hero
  // scroll (Critique R1 §10); it only resolves once the reader enters Nota.
  // Reduced-motion + direction-aware flip (Critique R3 §3).
  const pageCounter = document.querySelector('.page-counter');
  const pageNum = document.querySelector('.page-num');
  const pageLabel = document.querySelector('.page-counter-label');
  const sections = document.querySelectorAll('section[data-section]');

  if (pageCounter && pageNum && sections.length) {
    let currentSection = '__init__';
    let lastSectionInt = 0;
    let flipTimer = null;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        // Pick most-visible intersecting section
        let best = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) {
              best = entry;
            }
          }
        });
        if (!best) return;

        const numInt = parseInt(best.target.dataset.section, 10);
        const isHero = numInt === 0;
        const roman = isHero ? '' : toRoman(numInt);
        const label = best.target.dataset.sectionLabel || '';
        const key = isHero ? '__hero__' : roman;

        if (key === currentSection) return;

        if (isHero) {
          pageCounter.setAttribute('data-hidden', 'true');
          if (pageLabel) pageLabel.textContent = label;
          currentSection = key;
          lastSectionInt = numInt;
          return;
        }

        pageCounter.removeAttribute('data-hidden');

        // Reduced-motion: just swap text — no transform animation.
        if (reduce) {
          pageNum.style.transition = 'none';
          pageNum.style.transform = 'translateY(0)';
          pageNum.textContent = roman;
          if (pageLabel) pageLabel.textContent = label;
          currentSection = key;
          lastSectionInt = numInt;
          return;
        }

        // Direction-aware flip
        const goingDown = numInt > lastSectionInt;
        const outDir = goingDown ? '-100%' : '100%';
        const inDir = goingDown ? '100%' : '-100%';

        // Cancel any in-flight flip
        if (flipTimer) clearTimeout(flipTimer);

        pageNum.classList.remove('page-num--flipping');
        // force reflow so the next transition takes effect
        // eslint-disable-next-line no-unused-expressions
        pageNum.offsetWidth;
        pageNum.classList.add('page-num--flipping');
        pageNum.style.transform = `translateY(${outDir})`;

        flipTimer = setTimeout(() => {
          pageNum.classList.remove('page-num--flipping');
          pageNum.textContent = roman;
          pageNum.style.transform = `translateY(${inDir})`;
          requestAnimationFrame(() => {
            pageNum.classList.add('page-num--flipping');
            pageNum.style.transform = 'translateY(0)';
          });
        }, 200);

        if (pageLabel) pageLabel.textContent = label;
        currentSection = key;
        lastSectionInt = numInt;
      },
      { threshold: [0.3, 0.5, 0.7] }
    );

    sections.forEach((s) => sectionObserver.observe(s));
  }

  // --- Reading Progress Bar (editorial spine) ---
  // Use transform scaleY (compositor-only) instead of height (layout); the
  // CSS-side `transition: height` was fighting with the rAF (Critique R3 §5).
  const progressBar = document.querySelector('.reading-progress');
  if (progressBar) {
    let ticking = false;
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const raw = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      const progress = Math.max(0, Math.min(raw, 100));
      progressBar.style.transform = `scaleY(${progress / 100})`;
      ticking = false;
    };
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  // --- Smooth scroll for in-page links ---
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
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

  // --- Hero image: gentle parallax + fade ---
  // rAF-throttled + runtime reduced-motion check (Critique R3 §6).
  const heroImg = document.querySelector('.hero-image-wrap');
  if (heroImg && window.matchMedia('(min-width: 1025px)').matches) {
    let heroTicking = false;
    const onHeroScroll = () => {
      if (reduce) {
        // make sure we leave the image in its resting state
        if (heroImg.style.transform || heroImg.style.opacity) {
          heroImg.style.transform = '';
          heroImg.style.opacity = '';
        }
        return;
      }
      if (heroTicking) return;
      heroTicking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.5) {
          heroImg.style.transform = 'translateY(' + (y * 0.14) + 'px)';
          heroImg.style.opacity = String(
            Math.max(1 - (y / (window.innerHeight * 0.9)) * 0.6, 0.35)
          );
        }
        heroTicking = false;
      });
    };
    window.addEventListener('scroll', onHeroScroll, { passive: true });
  }

  // --- Voices: horizontal drag scroll with momentum + progress bar + keyboard ---
  const voicesTrack = document.querySelector('.voices-track');
  const scrollBar = document.querySelector('.voices-scroll-bar');

  if (voicesTrack) {
    let isDown = false;
    let startX;
    let scrollLeft;
    let velocity = 0;
    let lastMoveX = 0;
    let lastMoveTime = 0;
    let momentumId = null;

    const updateScrollProgress = () => {
      if (!scrollBar) return;
      const maxScroll = voicesTrack.scrollWidth - voicesTrack.clientWidth;
      if (maxScroll <= 0) {
        scrollBar.style.width = '100%';
        return;
      }
      const progress = (voicesTrack.scrollLeft / maxScroll) * 100;
      scrollBar.style.width = progress + '%';
    };

    voicesTrack.addEventListener('scroll', updateScrollProgress, { passive: true });

    voicesTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      if (momentumId) cancelAnimationFrame(momentumId);
      voicesTrack.classList.add('dragging');
      startX = e.pageX - voicesTrack.offsetLeft;
      scrollLeft = voicesTrack.scrollLeft;
      lastMoveX = e.pageX;
      lastMoveTime = Date.now();
      velocity = 0;
    });

    // mouseleave should NOT trigger momentum — a slight vertical trackpad
    // slip would otherwise launch the carousel (Critique R3 §17).
    voicesTrack.addEventListener('mouseleave', () => {
      if (isDown) {
        isDown = false;
        voicesTrack.classList.remove('dragging');
      }
    });
    voicesTrack.addEventListener('mouseup', () => {
      if (isDown) applyMomentum();
      isDown = false;
      voicesTrack.classList.remove('dragging');
    });

    voicesTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - voicesTrack.offsetLeft;
      const walk = (x - startX) * 1.4;
      voicesTrack.scrollLeft = scrollLeft - walk;
      const now = Date.now();
      const dt = now - lastMoveTime;
      if (dt > 0) velocity = (e.pageX - lastMoveX) / dt;
      lastMoveX = e.pageX;
      lastMoveTime = now;
    });

    function applyMomentum() {
      if (reduce) return;
      const friction = 0.94;
      // Cap velocity so a hard flick can't overshoot beyond the snap range
      const capped = Math.max(-3, Math.min(3, velocity));
      let v = capped * 14;
      function step() {
        if (Math.abs(v) < 0.5) return;
        voicesTrack.scrollLeft -= v;
        v *= friction;
        momentumId = requestAnimationFrame(step);
      }
      step();
    }

    // Full keyboard support: Arrow keys + Home/End (Critique R3 §7).
    // Track stays focusable for grouped scrolling; cards are also focusable
    // (tabindex="0" in markup) so the focus stops on individual quotes.
    const handleKey = (e) => {
      const step = voicesTrack.clientWidth * 0.6;
      const behavior = reduce ? 'auto' : 'smooth';
      switch (e.key) {
        case 'ArrowRight':
          voicesTrack.scrollBy({ left: step, behavior });
          e.preventDefault();
          break;
        case 'ArrowLeft':
          voicesTrack.scrollBy({ left: -step, behavior });
          e.preventDefault();
          break;
        case 'Home':
          voicesTrack.scrollTo({ left: 0, behavior });
          e.preventDefault();
          break;
        case 'End':
          voicesTrack.scrollTo({ left: voicesTrack.scrollWidth, behavior });
          e.preventDefault();
          break;
        default:
          break;
      }
    };
    voicesTrack.addEventListener('keydown', handleKey);
    voicesTrack.querySelectorAll('.voice-card').forEach((card) => {
      card.addEventListener('keydown', handleKey);
    });

    updateScrollProgress();
  }

  // --- Pull quotes: subtle rotation correction on reveal ---
  // Reactive reduced-motion: if the user enables RM mid-session, the rotation
  // is removed at observe time as well.
  const pullQuotes = document.querySelectorAll('.interstitial-pull-quote, .treehouse-pullquote');
  pullQuotes.forEach((quote) => {
    const inner = quote.querySelector('p');
    if (!inner) return;
    if (!reduce) {
      inner.style.transform = 'rotate(-0.45deg)';
      inner.style.transition = 'transform 0.9s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.9s ease';
    }

    if (!('IntersectionObserver' in window)) return;
    const quoteObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!reduce) inner.style.transform = 'rotate(0deg)';
            else inner.style.transform = '';
            quoteObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    quoteObserver.observe(quote);
  });

  // --- Newsletter: real submit with aria-live status (Critique R3 §9) ---
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    const btn = newsletterForm.querySelector('.newsletter-btn');
    const input = newsletterForm.querySelector('.newsletter-input');
    const status = newsletterForm.querySelector('.newsletter-status');

    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!input || !input.value || !input.checkValidity()) {
        if (status) {
          status.textContent = 'Por favor, ingresa un correo válido.';
          status.setAttribute('lang', 'es-MX');
        }
        return;
      }

      // Visual feedback — moss pulse on submit
      if (btn && !reduce) {
        btn.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        btn.style.transform = 'scale(1.03)';
        btn.style.boxShadow = '0 0 20px rgba(47, 74, 50, 0.28)';
        setTimeout(() => {
          btn.style.transform = '';
          btn.style.boxShadow = '';
        }, 420);
      }

      try {
        await fetch(newsletterForm.action || '/api/newsletter', {
          method: 'POST',
          body: new FormData(newsletterForm)
        });
        if (status) {
          status.setAttribute('lang', 'es-MX');
          status.textContent = 'Gracias — quedamos en contacto.';
        }
        input.value = '';
      } catch (err) {
        if (status) {
          status.setAttribute('lang', 'es-MX');
          status.textContent = 'No pudimos guardar tu correo. Intenta de nuevo.';
        }
      }
    });
  }

  // --- Diario "Leer la entrada" — decorative; no real link target.
  //     The CTAs now render as <span class="diario-read" aria-hidden="true">
  //     (Critique R3 §10 — they used to <a href="#diario"> which scrolled the
  //     reader to the same section they were already in).

  // --- Initialize: ensure hero / above-fold reveals fire even if already in view ---
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal, .hero .reveal-line, .hero .editorial-img').forEach((el) => {
      el.classList.add('visible');
    });
  });
})();
