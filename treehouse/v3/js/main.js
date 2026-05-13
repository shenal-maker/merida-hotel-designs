/* ============================================
   TREE HOUSE BOUTIQUE HOTEL — V3 INTERACTIONS
   Brutalist art-catalog + arboretum behaviors.
   ============================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isHoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // --- MENU TOGGLE with FOCUS TRAP + closed-state aria-hidden/inert (R3 #1) ---
  const menuBtn = document.querySelector('.nav-menu-btn');
  const menuOverlay = document.querySelector('.menu-overlay');
  const menuClose = document.querySelector('.menu-close');
  const menuLinks = document.querySelectorAll('.menu-overlay a');

  if (menuBtn && menuOverlay) {
    let lastFocused = null;

    const getInertSiblings = () => {
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
      menuOverlay.removeAttribute('inert');
      menuOverlay.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      // Nav button sits above overlay z-stack — disable while open so its hit area is inert
      menuBtn.disabled = true;
      document.body.style.overflow = 'hidden';
      getInertSiblings().forEach((el) => el.setAttribute('inert', ''));
      if (menuClose) {
        requestAnimationFrame(() => menuClose.focus());
      }
    };
    const closeMenu = () => {
      menuOverlay.classList.remove('active');
      menuOverlay.setAttribute('inert', '');
      menuOverlay.setAttribute('aria-hidden', 'true');
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
  // R3 #13: only attach mousemove handler when hover+fine-pointer is the input
  // modality. Touch + hybrid devices skip the listener entirely.
  const cursorReadout = document.querySelector('.cursor-readout');
  const cursorX = document.querySelector('.cursor-readout-x');
  const cursorY = document.querySelector('.cursor-readout-y');

  if (cursorReadout && !prefersReducedMotion && isHoverCapable) {
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

  // --- LANDING TITLE: mouse-reactive letters + scroll dispersion (R3 #12) ---
  // Each letter has independent per-axis contributions from the cursor and the
  // scroll handler. Both write into a shared state object; a single paint
  // composes them into one transform per frame so they no longer overwrite.
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
    const state = Array.from(letters, () => ({ mx: 0, my: 0, dx: 0, dy: 0, op: 1 }));

    const paint = () => {
      letters.forEach((l, i) => {
        const s = state[i];
        l.style.transform = `translate(${s.mx + s.dx}px, ${s.my + s.dy}px)`;
        l.style.opacity = s.op;
      });
    };
    // Initial baseline — never start at sub-1 opacity unless scrolled
    paint();

    let letterRaf = false;
    const requestPaint = () => {
      if (letterRaf) return;
      letterRaf = true;
      requestAnimationFrame(() => { paint(); letterRaf = false; });
    };

    landing.addEventListener('mousemove', (e) => {
      const rect = landing.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      letters.forEach((_, i) => {
        const intensity = ((i % 5) + 1) * 2;
        state[i].mx = dx * intensity;
        state[i].my = dy * intensity;
      });
      requestPaint();
    }, { passive: true });

    landing.addEventListener('mouseleave', () => {
      state.forEach(s => { s.mx = 0; s.my = 0; });
      requestPaint();
    });

    // scroll dispersion — only updates the d* / op contributions
    window.addEventListener('scroll', () => {
      const landingRect = landing.getBoundingClientRect();
      // Short-circuit when landing is well past — letters are off-screen anyway
      if (landingRect.bottom < -50) return;
      const scrollY = window.scrollY;
      const landingH = landing.offsetHeight;
      const progress = Math.min(scrollY / (landingH * 0.5), 1);
      if (progress > 0) {
        letters.forEach((_, i) => {
          state[i].dx = dispersions[i].x * progress * 110;
          state[i].dy = dispersions[i].y * progress * 70;
          state[i].op = 1 - progress;
        });
      } else {
        // explicit reset when scrolled back to top
        state.forEach(s => { s.dx = 0; s.dy = 0; s.op = 1; });
      }
      requestPaint();
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

  // --- MANIFESTO STRIP: pause marquee when not in view (R3 #16) ---
  const manifestoSection = document.querySelector('.manifesto');
  const manifestoStrip = document.querySelector('.manifesto-strip');
  if (manifestoSection && manifestoStrip) {
    const stripObs = new IntersectionObserver(
      ([entry]) => {
        manifestoSection.classList.toggle('strip-in-view', entry.isIntersecting);
      },
      { rootMargin: '200px' }
    );
    stripObs.observe(manifestoStrip);
  }

  // --- NOISE FLASH ON SECTION ENTRY (R3 #4) ---
  // Single threshold + global cooldown + unobserve-after-first-fire.
  // No more stacked flashes from 3 thresholds racing each other.
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
          setTimeout(() => noiseEl.classList.remove('flash'), 180);
          noiseObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => noiseObserver.observe(s));
  }

  // --- COUNTER ANIMATION ---
  // R3 #9: counters now ship with their target value as static fallback text.
  // We capture it, swap to '0', then animate. Without JS, the static value
  // remains in the DOM.
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
      // Remember the static fallback (now sitting in the DOM at parse time),
      // then swap to "0" before the observer fires.
      el.dataset.fallback = el.textContent;
      el.textContent = '0';
      counterObserver.observe(el);
    });
  }

  // --- DATA CELL row/col highlight subsystem retired (R3 #3).
  // The CSS `.data-grid-inner:hover .data-cell:not(:hover)` dimming rule already
  // carries the affordance; the JS subsystem dimmed everything then re-tinted
  // contradictorily and was pointer-only. Keyboard users now get the same simple
  // :focus background tint as everyone else. ---

  // --- CTA CLICK VIBRATION ---
  document.querySelectorAll('.room-cta, .exhibit-cta').forEach(cta => {
    cta.addEventListener('click', () => {
      cta.classList.add('vibrate');
      setTimeout(() => cta.classList.remove('vibrate'), 150);
    });
  });

  // --- MECHANICAL TYPING IN NEWSLETTER + REAL SUBMIT HANDLER (R3 #7) ---
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterInput = document.getElementById('newsletter-email');
  const newsletterStatus = document.getElementById('newsletter-status');
  if (newsletterInput && !prefersReducedMotion) {
    const placeholder = newsletterInput.placeholder;
    newsletterInput.placeholder = '';
    let charIndex = 0;
    let typerHalted = false;
    function typeChar() {
      if (typerHalted || document.activeElement === newsletterInput || newsletterInput.value) {
        typerHalted = true;
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
  if (newsletterForm && newsletterInput) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!newsletterInput.checkValidity()) {
        if (newsletterStatus) {
          newsletterStatus.textContent = '— DISPATCH NOT SENT / ENTER A VALID EMAIL.';
          newsletterStatus.dataset.state = 'error';
        }
        newsletterInput.reportValidity();
        return;
      }
      newsletterForm.classList.add('enrolled');
      if (newsletterStatus) {
        const stamp = String(Math.floor(Math.random() * 200) + 40).padStart(4, '0');
        newsletterStatus.textContent = `ENROLLED — № ${stamp} / NEXT QUARTERLY DISPATCH IN ~14 WEEKS.`;
        newsletterStatus.dataset.state = 'ok';
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

  // --- ANCHOR LINKS: JS handler retired (R3 #15).
  // CSS `html { scroll-padding-top: 4rem }` + `:target { scroll-margin-top: 4rem }`
  // now handle the nav clearance natively. Skip link, menu, floorplan cross-references,
  // and footer index all land cleanly without their target heading occluded.
  // Browser scroll-behavior is `auto` at the html level so jumps remain brutalist. ---

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

  // --- TAXON CARDS: keyboard navigation (Arrow keys) for tabbed taxa ---
  const taxa = Array.from(document.querySelectorAll('.taxon'));
  if (taxa.length) {
    taxa.forEach((taxon, i) => {
      taxon.addEventListener('keydown', (e) => {
        let next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          next = taxa[Math.min(i + 1, taxa.length - 1)];
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          next = taxa[Math.max(i - 1, 0)];
        }
        if (next) {
          e.preventDefault();
          next.focus();
        }
      });
    });
  }

})();
