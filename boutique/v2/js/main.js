/* ============================================
   Boutique by The Museo — V2 Editorial Magazine
   Interactive layer — light, editorial, unhurried.
   R3: single rAF scroll dispatcher, reactive reduced-motion, accessible nav.
   ============================================ */

(function () {
  'use strict';

  // ----- Reactive reduced-motion -----
  // Capture mql once, but re-read mql.matches on every consumer so a mid-session
  // toggle is honored without page reload. Older Safari uses addListener.
  const motionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionListener = () => { /* re-read; no cache to invalidate */ };
  if (typeof motionMql.addEventListener === 'function') {
    motionMql.addEventListener('change', motionListener);
  } else if (typeof motionMql.addListener === 'function') {
    motionMql.addListener(motionListener);
  }
  const reducedMotion = () => motionMql.matches;

  // ============================================
  // Scroll Reveal (IntersectionObserver)
  // Defers .observe() until window load so layout is settled when reveals begin.
  // ============================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-line, .draw-line, .editorial-img');

  function startReveals() {
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.classList.add('visible'));
      return;
    }
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
  }

  // Staggered child reveals via [data-stagger]
  function startStaggers() {
    document.querySelectorAll('[data-stagger]').forEach((parent) => {
      const children = parent.querySelectorAll('.reveal');
      const delay = parseInt(parent.dataset.stagger, 10) || 120;
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { startReveals(); startStaggers(); });
  } else {
    startReveals();
    startStaggers();
  }

  // ============================================
  // Masthead
  // ============================================
  const masthead = document.querySelector('.masthead-bar');
  // Hysteresis-style anchor: only flip state once we've moved 60px in a new direction.
  let mastheadAnchorY = 0;
  let mastheadDirection = 0; // 1 = hiding (scrolling down), -1 = showing (scrolling up)
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

  // ============================================
  // Mobile menu — focus trap, inert background, Escape-to-close
  // ============================================
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mastheadNav = document.querySelector('.masthead-nav');
  // Background elements that should be inert / aria-hidden while the menu is open.
  // We grab them once; they are stable for the page's lifetime.
  const bgRegions = Array.from(document.querySelectorAll('main, footer, section'));
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
    // Escape-to-close + focus trap inside open menu
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
  // Page Counter with directional flip
  // ============================================
  const pageCounter = document.querySelector('.page-counter');
  const pageNum = document.querySelector('.page-num');
  const pageLabel = document.querySelector('.page-counter-label');
  const sections = document.querySelectorAll('section[data-section]');
  const coverSection = document.querySelector('section[data-cover]');
  const romanMap = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
  const toRoman = (n) => romanMap[parseInt(n, 10)] || String(n);
  let currentSectionNumeric = 0;

  if (pageCounter && pageNum && sections.length) {
    if (coverSection) {
      const coverObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            pageCounter.dataset.hidden = entry.intersectionRatio > 0.5 ? 'true' : 'false';
          });
        },
        { threshold: [0, 0.5, 1] }
      );
      coverObserver.observe(coverSection);
    } else {
      pageCounter.dataset.hidden = 'false';
    }

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        let best = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
          }
        });
        if (!best) return;

        const raw = parseInt(best.target.dataset.section, 10);
        if (!raw || raw === currentSectionNumeric) return;
        const num = toRoman(raw);
        const label = best.target.dataset.sectionLabel || '';
        // Drive tone from a data attribute on the section instead of a string match,
        // so adding a new dark section doesn't require touching JS.
        pageCounter.dataset.tone = best.target.dataset.tone === 'dark' ? 'dark' : 'light';
        if (pageLabel) pageLabel.textContent = label;

        const goingForward = raw > currentSectionNumeric;
        currentSectionNumeric = raw;
        flipPageCounter(num, goingForward);
      },
      { threshold: [0.3, 0.5, 0.7] }
    );
    sections.forEach((s) => sectionObserver.observe(s));
  }

  function flipPageCounter(num, goingForward) {
    if (!pageNum) return;
    if (reducedMotion()) {
      // No animation under reduced motion — just swap the digit.
      pageNum.style.transition = 'none';
      pageNum.style.transform = 'translateY(0)';
      pageNum.textContent = num;
      return;
    }
    const exit = goingForward ? 'translateY(-100%)' : 'translateY(100%)';
    const enter = goingForward ? 'translateY(100%)' : 'translateY(-100%)';
    // 1. Assert exit transition explicitly — never inherit prior 'none'.
    pageNum.style.transition = 'transform 0.3s ease-out';
    pageNum.style.transform = exit;
    setTimeout(() => {
      // 2. Snap to opposite side with transition off, then animate back to 0.
      pageNum.textContent = num;
      pageNum.style.transition = 'none';
      pageNum.style.transform = enter;
      requestAnimationFrame(() => {
        pageNum.style.transition = 'transform 0.35s ease-out';
        pageNum.style.transform = 'translateY(0)';
      });
    }, 300);
  }

  // ============================================
  // Hero parallax — gated, with will-change toggled by IntersectionObserver
  // ============================================
  const heroImg = document.querySelector('.hero-image-wrap');
  let heroInView = false;
  let parallaxEnabled = window.matchMedia('(min-width: 1025px)').matches;
  // Listen to viewport-width changes so resizing from desktop to mobile cleans up state.
  const desktopMql = window.matchMedia('(min-width: 1025px)');
  const desktopListener = (e) => {
    parallaxEnabled = e.matches;
    if (!parallaxEnabled && heroImg) {
      heroImg.style.transform = '';
      heroImg.style.opacity = '';
      heroImg.style.willChange = '';
    }
  };
  if (typeof desktopMql.addEventListener === 'function') {
    desktopMql.addEventListener('change', desktopListener);
  } else if (typeof desktopMql.addListener === 'function') {
    desktopMql.addListener(desktopListener);
  }

  if (heroImg && 'IntersectionObserver' in window) {
    const heroVis = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          heroInView = e.isIntersecting;
          if (heroInView && parallaxEnabled && !reducedMotion()) {
            heroImg.style.willChange = 'transform';
          } else {
            heroImg.style.willChange = '';
          }
        });
      },
      { threshold: [0, 0.1] }
    );
    heroVis.observe(heroImg);
  }

  function tickHeroParallax(y) {
    if (!heroImg) return;
    if (!parallaxEnabled || reducedMotion() || !heroInView) return;
    if (y >= window.innerHeight * 1.5) return;
    heroImg.style.transform = 'translateY(' + (y * 0.14) + 'px)';
    const opacity = Math.max(1 - (y / (window.innerHeight * 0.9)) * 0.6, 0.35);
    heroImg.style.opacity = String(opacity);
  }

  // ============================================
  // Reading Progress
  // ============================================
  const progressBar = document.querySelector('.reading-progress');
  function tickProgress() {
    if (!progressBar) return;
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) {
      progressBar.style.height = '0%';
      return;
    }
    const progress = Math.min((scrollTop / docHeight) * 100, 100);
    progressBar.style.height = progress + '%';
  }

  // ============================================
  // Single rAF-gated scroll dispatcher
  // Coalesces masthead + parallax + progress into one tick. Was three independent
  // listeners (two of them un-throttled), which compounded with the body::before
  // grain overlay to drop frames on long scrolls.
  // ============================================
  let scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const y = window.pageYOffset;
      tickMasthead(y);
      tickHeroParallax(y);
      tickProgress();
      scrollTicking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ============================================
  // Smooth scroll for in-page links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
      }
    });
  });

  // ============================================
  // Voices: drag scroll with momentum, keyboard support, drag-vs-click guard
  // ============================================
  const voicesTrack = document.querySelector('.voices-track');
  const scrollBar = document.querySelector('.voices-scroll-bar');

  if (voicesTrack) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let velocity = 0;
    let lastMoveX = 0;
    let lastMoveTime = 0;
    let momentumId = null;
    let dragDistance = 0;
    let wasDragged = false;

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
      startX = e.pageX - voicesTrack.offsetLeft;
      scrollLeft = voicesTrack.scrollLeft;
      lastMoveX = e.pageX;
      lastMoveTime = Date.now();
      velocity = 0;
      dragDistance = 0;
      wasDragged = false;
    });

    const endDrag = () => {
      if (isDown) {
        voicesTrack.classList.remove('dragging');
        applyMomentum();
      }
      isDown = false;
    };
    voicesTrack.addEventListener('mouseleave', endDrag);
    voicesTrack.addEventListener('mouseup', endDrag);

    voicesTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - voicesTrack.offsetLeft;
      const delta = x - startX;
      dragDistance = Math.abs(delta);
      // Only suppress default + register a drag after 5px — preserves clicks
      // on any future links/buttons inside .voice-card.
      if (dragDistance > 5) {
        e.preventDefault();
        if (!wasDragged) {
          wasDragged = true;
          voicesTrack.classList.add('dragging');
        }
        voicesTrack.scrollLeft = scrollLeft - delta * 1.4;
        const now = Date.now();
        const dt = now - lastMoveTime;
        if (dt > 0) velocity = (e.pageX - lastMoveX) / dt;
        lastMoveX = e.pageX;
        lastMoveTime = now;
      }
    });

    // Filter the synthetic click that follows a drag.
    voicesTrack.addEventListener('click', (e) => {
      if (wasDragged) {
        e.preventDefault();
        e.stopPropagation();
        wasDragged = false;
      }
    }, true);

    function applyMomentum() {
      if (reducedMotion()) return;
      const friction = 0.94;
      let v = velocity * 14;
      function step() {
        if (Math.abs(v) < 0.5) { momentumId = null; return; }
        voicesTrack.scrollLeft -= v;
        v *= friction;
        momentumId = requestAnimationFrame(step);
      }
      step();
    }

    // Keyboard support — Arrow + Home/End
    voicesTrack.addEventListener('keydown', (e) => {
      const step = voicesTrack.clientWidth * 0.6;
      const behavior = reducedMotion() ? 'auto' : 'smooth';
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        voicesTrack.scrollBy({ left: step, behavior });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        voicesTrack.scrollBy({ left: -step, behavior });
      } else if (e.key === 'Home') {
        e.preventDefault();
        voicesTrack.scrollTo({ left: 0, behavior });
      } else if (e.key === 'End') {
        e.preventDefault();
        voicesTrack.scrollTo({ left: voicesTrack.scrollWidth, behavior });
      }
    });

    updateScrollProgress();
  }

  // ============================================
  // Pull-quote rotation correction on reveal
  // ============================================
  const pullQuotes = document.querySelectorAll('.interstitial-pull-quote, .treehouse-pullquote');
  pullQuotes.forEach((quote) => {
    const inner = quote.querySelector('p');
    if (!inner) return;
    if (reducedMotion()) return; // never apply the rotation under reduced motion
    inner.style.transform = 'rotate(-0.45deg)';
    inner.style.transition = 'transform 0.9s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.9s ease';
    const quoteObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            inner.style.transform = 'rotate(0deg)';
            quoteObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    quoteObserver.observe(quote);
  });

  // ============================================
  // Newsletter — fake submit with proper status message + aria-live
  // ============================================
  const newsletterForm = document.querySelector('.newsletter-form');
  const newsletterStatus = document.querySelector('.newsletter-status');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const btn = newsletterForm.querySelector('.newsletter-btn');
      if (!input || !btn) return;
      // Basic email guard — the input still has the native [required][type=email]
      // for keyboard users, but with novalidate on the form we want to be explicit.
      if (!input.value || !input.checkValidity()) {
        input.focus();
        input.reportValidity && input.reportValidity();
        return;
      }
      btn.disabled = true;
      input.disabled = true;
      const originalLabel = btn.textContent;
      btn.textContent = 'Enviando…';
      // Gentle pulse only when motion is allowed and after we know we're in a
      // submitting state — avoids racing against the disable.
      if (!reducedMotion()) {
        btn.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        btn.style.transform = 'scale(1.03)';
        btn.style.boxShadow = '0 0 20px rgba(198, 153, 96, 0.28)';
      }
      setTimeout(() => {
        btn.style.transform = '';
        btn.style.boxShadow = '';
        newsletterForm.setAttribute('data-state', 'submitted');
        if (newsletterStatus) {
          newsletterStatus.innerHTML = '<em lang="es-MX">Gracias.</em> Su nombre est&aacute; en la lista de la pr&oacute;xima edici&oacute;n.';
          newsletterStatus.setAttribute('lang', 'es-MX');
          newsletterStatus.classList.add('is-visible');
        }
        // Restore the button label so if the form is ever re-shown (devtools)
        // it doesn't read "Enviando…".
        btn.textContent = originalLabel;
      }, 600);
    });
  }

  // ============================================
  // Initialize: ensure hero / above-fold reveals fire even if already in view
  // ============================================
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal, .hero .reveal-line, .hero .editorial-img').forEach((el) => {
      el.classList.add('visible');
    });
    // First scroll tick to settle masthead state and progress bar on load.
    onScroll();
  });
})();
