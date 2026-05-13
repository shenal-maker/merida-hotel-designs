/* ============================================
   BOUTIQUE BY THE MUSEO — V3 INTERACTIONS
   Brutalist art-catalog behaviors.
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

    const getInertSiblings = () => {
      // Everything that's a direct child of body EXCEPT the menu overlay itself
      return Array.from(document.body.children).filter(
        (el) => el !== menuOverlay && el.nodeType === 1
      );
    };

    const getMenuFocusables = () => {
      return menuOverlay.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
    };

    const openMenu = () => {
      lastFocused = document.activeElement;
      menuOverlay.classList.add('active');
      menuBtn.setAttribute('aria-expanded', 'true');
      // R3 NIT: nav (z:1000) sits above overlay (z:999) — disable the
      // trigger while open so its click-zone can't re-fire openMenu().
      menuBtn.disabled = true;
      document.body.style.overflow = 'hidden';
      // Apply inert to siblings — modal in truth, not just claim
      getInertSiblings().forEach((el) => el.setAttribute('inert', ''));
      // Focus the close button on open
      if (menuClose) {
        // small delay to let opacity transition apply
        requestAnimationFrame(() => menuClose.focus());
      }
    };
    const closeMenu = () => {
      menuOverlay.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.disabled = false;
      document.body.style.overflow = '';
      getInertSiblings().forEach((el) => el.removeAttribute('inert'));
      // Return focus to the trigger
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      } else {
        menuBtn.focus();
      }
    };

    menuBtn.addEventListener('click', openMenu);
    menuClose && menuClose.addEventListener('click', closeMenu);
    menuLinks.forEach((link) => link.addEventListener('click', closeMenu));

    // Esc closes; Tab cycles within the overlay (focus trap)
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

  // --- CURSOR DATA READOUT ---
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

  // --- LANDING TITLE: mouse-reactive letters + scroll dispersion ---
  const letters = document.querySelectorAll('.landing-title .letter');
  const landing = document.querySelector('.landing');

  const dispersions = [];
  if (letters.length) {
    letters.forEach(() => {
      dispersions.push({
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2
      });
    });
  }

  if (landing && letters.length && !prefersReducedMotion) {
    // Deep-link guard: if the user lands past the hero (e.g. #manifesto),
    // snap letters to dispersed/faded state without animating to avoid a
    // visible first-frame jitter while the manifesto observer fires.
    const deepLinked = window.scrollY > landing.offsetHeight * 0.5
      || (window.location.hash && window.location.hash !== '#main' && window.location.hash !== '#landing');
    if (deepLinked) {
      letters.forEach((letter, i) => {
        letter.style.transition = 'none';
        letter.style.opacity = 0;
        const disperseX = dispersions[i].x * 110;
        const disperseY = dispersions[i].y * 70;
        letter.style.transform = `translate(${disperseX}px, ${disperseY}px)`;
      });
    } else {
      // Explicit baseline so first paint never shows a sub-1 opacity
      letters.forEach(letter => { letter.style.opacity = 1; });
    }

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

    // scroll dispersion — only when landing still occupies the viewport
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Short-circuit when landing is far above the fold — saves layout work
          const landingRect = landing.getBoundingClientRect();
          if (landingRect.bottom < -50) {
            ticking = false;
            return;
          }
          const scrollY = window.scrollY;
          const landingH = landing.offsetHeight;
          const progress = Math.min(scrollY / (landingH * 0.5), 1);
          if (progress > 0) {
            letters.forEach((letter, i) => {
              const disperseX = dispersions[i].x * progress * 110;
              const disperseY = dispersions[i].y * progress * 70;
              const opacity = 1 - progress;
              letter.style.transform = `translate(${disperseX}px, ${disperseY}px)`;
              letter.style.opacity = opacity;
            });
          } else {
            letters.forEach(letter => { letter.style.opacity = 1; });
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // --- MANIFESTO REVEAL ---
  const manifestoLines = document.querySelectorAll('.manifesto-line');
  if (manifestoLines.length) {
    const manifestoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Skip glitch on the whisper line — it's the quiet line
          if (!prefersReducedMotion && !entry.target.classList.contains('manifesto-line--whisper')) {
            entry.target.classList.add('glitch');
            setTimeout(() => entry.target.classList.remove('glitch'), 200);
          }
          manifestoObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -60px 0px' });

    manifestoLines.forEach((line, i) => {
      line.style.transitionDelay = `${i * 0.14}s`;
      manifestoObserver.observe(line);
    });
  }

  // --- NAV INVERSION via class toggle (replaces mix-blend-mode: difference) ---
  // Dark sections drive .nav--dark; observer is cheap because each section
  // is observed once at the same root-margin tripwire as the noise flash.
  const navEl = document.querySelector('.nav');
  if (navEl) {
    const darkSelectors = ['.landing', '.exhibition'];
    const darkSections = document.querySelectorAll(darkSelectors.join(','));
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navEl.classList.add('nav--dark');
        } else {
          // Only un-dark if NO dark section is currently intersecting
          let anyDark = false;
          darkSections.forEach(s => {
            const r = s.getBoundingClientRect();
            if (r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5) {
              anyDark = true;
            }
          });
          if (!anyDark) navEl.classList.remove('nav--dark');
        }
      });
    }, { rootMargin: '-50% 0px -50% 0px' });
    darkSections.forEach(s => navObserver.observe(s));
    // Initial state: top of page is landing (dark)
    navEl.classList.add('nav--dark');
  }

  // --- NOISE FLASH ON SECTION ENTRY (one-shot per section + global cooldown) ---
  const noiseEl = document.querySelector('.section-noise');
  const sections = document.querySelectorAll('section');
  if (noiseEl && sections.length && !prefersReducedMotion) {
    let lastFlash = 0;
    const noiseObserver = new IntersectionObserver((entries) => {
      const now = performance.now();
      entries.forEach(entry => {
        if (entry.isIntersecting && now - lastFlash > 800) {
          noiseEl.classList.add('flash');
          lastFlash = now;
          setTimeout(() => noiseEl.classList.remove('flash'), 150);
          noiseObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => noiseObserver.observe(s));
  }

  // --- COUNTER ANIMATION ---
  const counterNumbers = document.querySelectorAll('.counter-number');

  function animateCounter(el) {
    const textOverride = el.dataset.text;
    if (textOverride) {
      el.textContent = textOverride;
      const line = el.parentElement.querySelector('.counter-line');
      if (line) setTimeout(() => line.classList.add('drawn'), 300);
      return;
    }

    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const isDecimal = String(target).includes('.') && !el.dataset.nodecimal;
    const noDecimal = el.dataset.nodecimal;
    const duration = 1700;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const steppedProgress = Math.floor(progress * 12) / 12;
      const current = target * steppedProgress;

      if (isDecimal) {
        el.textContent = current.toFixed(1) + suffix;
      } else if (noDecimal) {
        el.textContent = Math.floor(current).toString() + suffix;
      } else {
        el.textContent = Math.floor(current).toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (isDecimal) {
          el.textContent = target.toFixed(1) + suffix;
        } else if (noDecimal) {
          el.textContent = target.toString() + suffix;
        } else {
          el.textContent = Math.floor(target).toLocaleString() + suffix;
        }
        const line = el.parentElement.querySelector('.counter-line');
        if (line) setTimeout(() => line.classList.add('drawn'), 250);
      }
    }
    requestAnimationFrame(step);
  }

  if (counterNumbers.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counterNumbers.forEach(el => {
      el.textContent = '0';
      counterObserver.observe(el);
    });
  }

  // --- DATA CELL row/col highlight subsystem retired (R3).
  // Was pointer-only and split sighted-vs-keyboard users; the simple :hover
  // background tint in CSS now carries the interaction for everyone. ---

  // --- ROOM CTA CLICK VIBRATION ---
  document.querySelectorAll('.room-cta, .exhibit-cta').forEach(cta => {
    cta.addEventListener('click', () => {
      cta.classList.add('vibrate');
      setTimeout(() => cta.classList.remove('vibrate'), 150);
    });
  });

  // --- MECHANICAL TYPING IN NEWSLETTER + REAL SUBMIT HANDLER ---
  const newsletterForm = document.querySelector('.footer-newsletter');
  const newsletterInput = document.querySelector('.footer-newsletter input');
  const newsletterStatus = document.querySelector('.footer-newsletter-status');
  if (newsletterInput && !prefersReducedMotion) {
    const placeholder = newsletterInput.placeholder;
    newsletterInput.placeholder = '';
    let charIndex = 0;
    let typerHalted = false;
    function typeChar() {
      // Halt if user is already engaging with the field — don't mutate
      // the placeholder while they type or while it has content.
      if (typerHalted || document.activeElement === newsletterInput || newsletterInput.value) {
        typerHalted = true;
        // Restore the full placeholder once and exit
        if (!newsletterInput.value) newsletterInput.placeholder = placeholder;
        return;
      }
      if (charIndex <= placeholder.length) {
        newsletterInput.placeholder = placeholder.substring(0, charIndex);
        charIndex++;
        const delay = 60 + Math.random() * 120;
        setTimeout(typeChar, delay);
      }
    }
    const haltTyper = () => {
      typerHalted = true;
      if (!newsletterInput.value) newsletterInput.placeholder = placeholder;
    };
    newsletterInput.addEventListener('focus', haltTyper);
    newsletterInput.addEventListener('input', haltTyper);

    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Don't start the typer if user has already engaged
          if (!typerHalted && document.activeElement !== newsletterInput && !newsletterInput.value) {
            typeChar();
          }
          footerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    const footer = newsletterInput.closest('.footer');
    if (footer) footerObserver.observe(footer);
  }
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!newsletterInput || !newsletterInput.checkValidity()) {
        if (newsletterInput) newsletterInput.reportValidity();
        return;
      }
      newsletterForm.classList.add('enrolled');
      if (newsletterStatus) {
        // Pseudo-ledger stamp — matches the brutalist file-number voice
        const stamp = String(Math.floor(Math.random() * 200) + 40).padStart(4, '0');
        newsletterStatus.textContent = `ENROLLED — № ${stamp}`;
      }
      newsletterInput.setAttribute('disabled', '');
      newsletterInput.value = '';
    });
  }

  // --- SPACE GALLERY: one-shot clip-path reveal on scroll ---
  const galleryItems = document.querySelectorAll('.space-gallery-item img');
  if (galleryItems.length) {
    const galleryObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          galleryObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    galleryItems.forEach(img => galleryObserver.observe(img));
  }

  // --- SECTION LABEL LINE-DRAW ---
  const sectionLabels = document.querySelectorAll('.section-label');
  if (sectionLabels.length) {
    const labelObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('line-drawn');
          labelObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    sectionLabels.forEach(el => labelObserver.observe(el));
  }

  // --- COUNTER CELL: glow after counting ---
  const counterLines = document.querySelectorAll('.counter-line');
  if (counterLines.length) {
    const lineObserver = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        if (m.target.classList.contains('drawn')) {
          const cell = m.target.closest('.counter-cell');
          if (cell) cell.classList.add('counted');
        }
      });
    });
    counterLines.forEach(line => {
      lineObserver.observe(line, { attributes: true, attributeFilter: ['class'] });
    });
  }

  // --- ANCHOR LINKS: instant scroll, brutalist ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

  // --- PLATE CAPTIONS: subtle reveal-on-view ---
  const plates = document.querySelectorAll('.plate');
  if (plates.length) {
    const plateObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          plateObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    plates.forEach(p => plateObs.observe(p));
  }

})();
