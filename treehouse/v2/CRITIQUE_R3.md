# CRITIQUE — Round 3 (Motion / Interactions / Polish / A11y)
## Tree House Boutique Hotel — V2 Editorial Magazine

Adversarial pass focusing on motion, micro-interactions, accessibility, and edge cases. R1 (visual) and R2 (copy) issues are out of scope unless they have a Round-3 surface.

---

### 1. **[CRITICAL]** `lang="en"` on a document that is heavily Spanish — fails screen readers and `prefers-language` heuristics

**What.** `<html lang="en">` (line 2). The brief asked for `lang="es-MX"` on Spanish content because R2 added named yucatecas (Beatriz Cervera, Don Eulogio, Doña Marisol, "Lic.", "MMXXVI") and bilingual prose runs through every section. The page is at minimum 35% Spanish — the page-counter labels, eyebrows, the entire Diario, all the Voces, and most of the apparatus are Spanish — and yet there is not a single `lang="es"` or `lang="es-MX"` attribute on the document.

**Why.** A VoiceOver/NVDA reader will pronounce *"Lic. Beatriz Cervera"* with an English phonology — *"Lick Beatriz Servera"* — and *"Habitaciones"* as *"hab-i-tay-shuns"*. For a hotel whose brand promise is "the canopy does the rest" — Spanish-yucateco voice — this is the loudest a11y failure on the page. It also tells Google to index the page as monolingual English.

**Fix.** Two-layer fix:

```html
<!-- 1. Root lang stays the dominant language of the *layout chrome*, but… -->
<html lang="en">
```

…then add `lang="es-MX"` to every Spanish-language run. Pragmatic minimum, with the highest-leverage targets:

```html
<!-- masthead nav items -->
<li><a href="#sanctuary" lang="es-MX">El Santuario</a></li>
<!-- diario section -->
<section class="diario" lang="es-MX" data-section="7" ...>
<!-- voces section -->
<section class="voices" lang="es-MX" ...>
<!-- page-counter label container -->
<span class="page-counter-label" lang="es-MX">Portada</span>
<!-- and on any inline Spanish run inside English prose -->
<em lang="es-MX">solo adultos</em>
```

A simpler structural move would be to flip the root to `lang="es-MX"` (the brand voice *is* Spanish) and tag the English runs instead — fewer attributes, more honest to the editorial position.

---

### 2. **[CRITICAL]** Skip link points to `#editors-note`, not `<main>` — and there is no `<main>` element at all

**What.** Line 17: `<a href="#editors-note" class="skip-link">Skip to content</a>`. There is no `<main>` landmark in the document — the hero, all 13 sections, and the colophon sit directly under `<body>`. The hero (`#top`) is content; skipping past it is a curatorial decision, not an a11y service.

**Why.** Screen-reader users navigating by landmark (`R` in NVDA, `VO+U` in VoiceOver) get `<header>`, `<nav>`, `<footer>` — and nothing in the middle. A keyboard user who hits the skip link lands inside the Editor's Note, having lost the hero — including the Michelin Key badge, the reserve CTA, and the hotel name. That is the most important above-the-fold content; skipping it is not a "skip to content" button, it is a "skip the content" button.

**Fix.**

```html
<main id="main">
  <section class="hero" id="top" ...>
  …all sections except masthead and colophon…
</main>
```

```html
<a href="#main" class="skip-link">Skip to content</a>
```

---

### 3. **[CRITICAL]** Page-counter flip animation is **not reduced-motion-aware** and creates a 200ms blank gap on every section change

**What.** `js/main.js` lines 161–171. The page-number flip is unconditional:

```js
pageNum.style.transform = 'translateY(-100%)';
setTimeout(() => {
  pageNum.textContent = roman;
  pageNum.style.transition = 'none';
  pageNum.style.transform = 'translateY(100%)';
  requestAnimationFrame(() => {
    pageNum.style.transition = 'transform 0.35s ease-out';
    pageNum.style.transform = 'translateY(0)';
  });
}, 200);
```

`prefersReducedMotion` is checked at the top of the IIFE (line 11) but never consulted in the page-counter block. The 200-ms `setTimeout` also means the previous numeral slides out *into emptiness* before the new one slides in — there is a brief frame where `.page-num` contains the wrong number but is mid-translate, and if the user is scrolling fast across two sections, the flips queue up and overwrite each other. (The brief explicitly asks: "works backward as well as forward? Reduced-motion respected?" — neither is satisfied.)

**Why.** Reduced-motion users will still see translate animation, defeating the OS preference. Fast scrollers get visual ghosting. Worse, scrolling backward triggers the *same* flip in the *same* direction — there is no direction awareness in the code, so going up vs. going down looks identical, which is a quietly broken UX promise.

**Fix.**

```js
if (key !== currentSection) {
  if (isHero) { /* …same hide branch… */ return; }
  pageCounter.removeAttribute('data-hidden');

  // Reduced-motion: just swap text.
  if (prefersReducedMotion) {
    pageNum.textContent = roman;
    if (pageLabel) pageLabel.textContent = label;
    currentSection = key;
    return;
  }

  // Direction-aware flip
  const goingDown = parseInt(best.target.dataset.section,10) > (lastSectionInt ?? 0);
  const outDir = goingDown ? '-100%' : '100%';
  const inDir  = goingDown ? '100%'  : '-100%';

  pageNum.style.transform = `translateY(${outDir})`;
  // also cancel any in-flight flip
  clearTimeout(flipTimer);
  flipTimer = setTimeout(() => { /* …same body, swap inDir/0 for current values… */ }, 200);
  lastSectionInt = parseInt(best.target.dataset.section,10);
}
```

Also: `transition-duration: 0.01ms !important;` from the global `prefers-reduced-motion` block (line 2887) collides with `pageNum.style.transition = 'transform 0.35s ease-out'` — the inline style wins, so even the global media-query safety net is bypassed for this element.

---

### 4. **[MAJOR]** Drop cap at line 120 will render the digit **"1"** as the cap, not the prose

**What.** The Editor's Note drop-cap paragraph (`<p class="reveal drop-cap">`) opens with `<em>11 abril, MMXXVI.</em> The ficus…`. `::first-letter` will pick up the first typographic character of the *block*, which is the numeral **"1"** inside an italic `<em>` — so the moss-green 4em drop cap will read **"1"** in italic (because the parent `<em>` is italic and `font-style: normal` on `::first-letter` may not override depending on browser).

**Why.** Cross-browser, `::first-letter` honors the rendered character order; numerals are eligible, the leading `<em>` does not exempt them. Firefox and Safari handle the floated-cap-inside-inline-italic differently from Chromium — and several browsers will inherit the `<em>`'s italic onto the cap and ignore `font-style: normal` on the pseudo. The visual outcome is either a giant green italic "1" (wrong, decorative-numeral look) or a giant green italic "1" with bad spacing — both of which break the editor's-note opening rhythm. The R1 critique-referenced "ensure cap stays roman even if parent text begins italic" CSS fix at line 350 cannot fix the *digit* problem, only the italic problem.

**Fix.** Two options — pick (b):

```html
<!-- (a) reorder the prose -->
<p class="reveal drop-cap">
  Eleven April MMXXVI — the <em>ficus</em> dropped a branch in the night…
</p>
```

```html
<!-- (b) move the date into a leading <span class="dateline"> with its own typography, drop-cap targets the prose start -->
<p class="reveal drop-cap">
  <span class="dateline"><em>11 abril, MMXXVI.</em></span>
  The <em>ficus</em> dropped a branch in the night…
</p>
```

…then in CSS:

```css
.drop-cap .dateline {
  display: block;            /* takes the dateline out of inline flow */
  font-family: var(--sans);
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--stone);
  margin-bottom: 0.8rem;
}
.drop-cap .dateline + * + ::first-letter,
.drop-cap::first-letter { /* now picks up "T" of "The ficus…" */ }
```

The block-level `<span class="dateline">` resets the first-letter candidate to the next inline content. Audit lines 177, 217, and 406 — those start with "The"/"In"/"Every" so they are fine, but verify after any copy edit.

---

### 5. **[MAJOR]** Reading-progress spine has `transition: height 0.15s linear` *and* is updated in `requestAnimationFrame` — these fight each other

**What.** CSS line 150: `transition: height 0.15s linear;`. JS lines 191–198: every scroll frame, height is set inside `requestAnimationFrame`. Each rAF tick sets a new height while the CSS transition is still interpolating toward the *previous* tick's target — the bar visibly lags behind the scroll, especially during fast scrolling on a long page like this (~5 viewport heights of content).

**Why.** This is the classic "double-buffering" bug — you either rAF *or* CSS-transition the property, not both. The visible effect is that on flick-scrolls on a trackpad, the spine appears to lazily catch up over 150 ms after the scroll has stopped, which feels like jank rather than precision. For an editorial spine that is *literally a measurement of position*, lag is a credibility failure.

**Fix.** Drop the CSS transition, let rAF do the smoothing (it is already running on every animation frame).

```css
.reading-progress {
  /* …other rules… */
  transition: none;   /* was: height 0.15s linear */
  will-change: height;
}
```

Or, keep the transition and *throttle* the rAF to once every ~150 ms instead of every frame — but the first option is simpler and more correct.

Bonus: `progressBar.style.height = progress + '%'` causes the browser to recompute the size on each frame. Switching to a `transform: scaleY(progress/100)` with `transform-origin: top` keeps it on the compositor thread:

```css
.reading-progress { height: 100vh; transform-origin: top; transform: scaleY(0); will-change: transform; }
```

```js
progressBar.style.transform = `scaleY(${progress / 100})`;
```

---

### 6. **[MAJOR]** Hero parallax has **no reduced-motion guard at runtime** (only at init), and runs on every scroll event without rAF throttling

**What.** Lines 220–233 of `js/main.js`. The block is gated by `!prefersReducedMotion` at *registration time*, so a user who changes the OS preference after the page loads still gets parallax. More importantly, the scroll handler reads `window.pageYOffset`, sets a `transform` and an `opacity` directly inside the scroll event — no `requestAnimationFrame`, no throttle. The page already has *three* other passive scroll listeners (masthead hide/show, reading progress, voices). The hero handler is the only one not using rAF.

**Why.** `transform` + `opacity` writes during scroll can still trigger layout-thrash if the browser hasn't promoted the layer; without rAF the handler runs at scroll-event frequency (often higher than 60Hz on high-refresh trackpads), wasting CPU. Mobile Safari fires `scroll` differently from desktop; you may be writing transform 120 times a second on an iPhone Pro.

**Fix.**

```js
if (heroImg && window.matchMedia('(min-width: 1025px)').matches) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let ticking = false;

  const onScroll = () => {
    if (reduce.matches) return;           // runtime check
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.pageYOffset;
      if (y < window.innerHeight * 1.5) {
        heroImg.style.transform = 'translateY(' + (y * 0.14) + 'px)';
        heroImg.style.opacity = Math.max(1 - (y / (window.innerHeight * 0.9)) * 0.6, 0.35);
      }
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}
```

Also: `will-change: transform` on `.hero-image-wrap` would promote the layer (currently absent in CSS).

---

### 7. **[MAJOR]** Voices horizontal-scroll keyboard support is incomplete — Home/End/Tab don't work, focus management is wrong

**What.** Lines 309–316 handle `ArrowRight` / `ArrowLeft` only. There is no `Home`, `End`, `PageUp`, `PageDown` handling. The voice cards themselves are not focusable (no `tabindex` on `.voice-card`) — so a keyboard user can tab *into* the track container, arrow-scroll, and that's the whole interaction. Cards don't receive focus, so a screen reader cannot announce them individually after navigation. The author-name and quote text are inside a `<figure>` with no role; a screen reader reads the whole track as one giant region.

**Why.** A keyboard user pressing Tab inside the voices region falls *out* of the region into the next focusable element (the colophon nav) without ever having read a quote. The brief asks: "momentum + keyboard + touch?" — keyboard is the weakest leg here. Screen-reader users get a single 5-quote run with no card boundaries.

**Fix.**

```html
<figure class="voice-card reveal" tabindex="0">
```

```js
voicesTrack.addEventListener('keydown', (e) => {
  const step = voicesTrack.clientWidth * 0.6;
  switch (e.key) {
    case 'ArrowRight': voicesTrack.scrollBy({ left: step, behavior: prefersReducedMotion ? 'auto' : 'smooth' }); e.preventDefault(); break;
    case 'ArrowLeft':  voicesTrack.scrollBy({ left: -step, behavior: prefersReducedMotion ? 'auto' : 'smooth' }); e.preventDefault(); break;
    case 'Home':       voicesTrack.scrollTo({ left: 0, behavior: 'smooth' }); e.preventDefault(); break;
    case 'End':        voicesTrack.scrollTo({ left: voicesTrack.scrollWidth, behavior: 'smooth' }); e.preventDefault(); break;
  }
});
```

Also: the role on the track container is `region` — but `tabindex="0"` on a `region` is unusual; `role="group"` or simply making the *cards* focusable is more accessible.

---

### 8. **[MAJOR]** Hot-linked Unsplash and WordPress URLs — 26 external image dependencies, none downloaded

**What.** `grep` confirms 26 hot-linked images across `index.html`: 23 from `images.unsplash.com`, 3 from `treehouseboutiquehotel.com/wp-content/`. Brief explicitly flags this — "V1/V3 R3 already do this; V2 should match."

**Why.** Every hot-link is a:

- **Performance liability** — Unsplash's CDN is fast but not your edge; you cannot use `srcset`, you cannot use `<picture>`, you cannot generate AVIF/WebP at build time, and the `?w=1600&q=80` query string is delivering the same asset to 320px viewports and 2560px viewports.
- **Privacy/cookie liability** — Unsplash sets analytics cookies and counts impressions; this is a problem for GDPR-conscious EU bookers.
- **Brand-credibility liability** — the captions claim *"L&aacute;m. III — Muro vegetal, ala oeste"* (a wall in the hotel's west wing) but the image is a generic Unsplash tropical wall. The "(imágen representativa)" disclaimer on the hero hides the broader fakery; a Michelin-Key property cannot ship stock for its own rooms. R1/R2 already addressed alt-text honesty; R3 must finish the job by *downloading* and *staging* even the placeholders.
- **Availability liability** — Unsplash periodically de-publishes photos. Three of the URLs in this file (e.g. `photo-1605351792042-7fb88e4f9b34`) are deep enough into the archive that a 404 in production is plausible. There is no `<img onerror>` fallback.

**Fix.**

```
mkdir -p treehouse/v2/assets/img
cd treehouse/v2/assets/img
# pull each URL with curl, name them by lámina (lam-i.webp, lam-ii.webp, …)
# then in HTML:
```

```html
<img src="assets/img/lam-i.webp"
     srcset="assets/img/lam-i-800.webp 800w, assets/img/lam-i-1600.webp 1600w"
     sizes="(max-width:768px) 100vw, 50vw"
     alt="…" width="1600" height="2133" loading="lazy" decoding="async">
```

Also: the hero preload `<link rel="preload" as="image" href="https://images.unsplash.com/..."> ` is preloading a third-party URL — replace with the local asset.

---

### 9. **[MAJOR]** Newsletter form is inline JS, no `<noscript>` fallback, no error state, no real submission

**What.** Line 796:

```html
<form class="newsletter-form" onsubmit="event.preventDefault(); this.querySelector('input').value='Gracias.'; this.querySelector('input').disabled=true; this.querySelector('button').disabled=true;">
```

This is the only `onsubmit` handler in the file. Beyond the obvious — inline JS that violates CSP, replacing the user's typed email with a string "Gracias.", and no real submission anywhere — there is:

- No validation message if `required` fails (browser default is English, even when surrounding copy is Spanish)
- No `aria-live` region for the success state — a screen reader does not know the form succeeded
- No graceful behaviour with JS disabled (Boletín form silently does nothing)
- No `name` attribute on the input, so even if a backend existed, the email wouldn't be in the POST body

**Why.** The Spanish "Gracias." (which is the literal string the input value becomes) is a typographic apology — a user named the input, typed their address, and now sees their address replaced with the word "Gracias." in their own input field. That is a confusing UX for what should be a luxury micro-interaction.

**Fix.**

```html
<form class="newsletter-form" action="/api/newsletter" method="post" novalidate>
  <input type="email" name="email" class="newsletter-input"
         placeholder="tu@correo.com"
         aria-label="Email for the Tree House newsletter"
         aria-describedby="newsletter-status"
         required>
  <button type="submit" class="newsletter-btn">Unirse</button>
  <p id="newsletter-status" class="newsletter-status" role="status" aria-live="polite"></p>
</form>
```

```js
newsletterForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = newsletterForm.querySelector('.newsletter-status');
  const input  = newsletterForm.querySelector('.newsletter-input');
  try {
    await fetch(newsletterForm.action, { method: 'POST', body: new FormData(newsletterForm) });
    status.textContent = 'Gracias — quedamos en contacto.';
    input.value = '';
  } catch {
    status.textContent = 'No pudimos guardar tu correo. Intenta de nuevo.';
  }
});
```

---

### 10. **[MAJOR]** `<a href="#diario">` on every "Leer la entrada" — they all link to the *parent section*, not the article

**What.** Lines 510, 517, 524, 531. Every Diario entry's "Leer la entrada" CTA points to `#diario` — i.e., the same `<section>` the user is already inside. R1 explicitly fixed the wrapper-vs-anchor pattern (no more fake-interactive wrappers), but didn't fix the destination.

**Why.** A keyboard user who Tabs to "Leer la entrada → " and presses Enter scrolls *up*, sometimes invisibly (they were already at `#diario`), and the URL changes to `…#diario` for the third time in a row. The CTA is, functionally, a no-op masquerading as a link. The brief asks: "diario article focus paths — work correctly with keyboard / SR?" — they do not, because there are no real focus destinations.

**Fix.** Either remove the CTA (honest), or give each article a target ID and an actual destination:

```html
<article class="diario-entry reveal" id="diario-01" tabindex="-1">
  <h3 id="diario-01-title">La Llave llegó por correo electrónico</h3>
  …
  <a href="#diario-01" class="diario-read" aria-describedby="diario-01-title">Leer la entrada <span aria-hidden="true">→</span></a>
</article>
```

…and in JS, intercept the click to focus the article heading (so SR users land *on* the entry, not above it):

```js
document.querySelectorAll('.diario-read').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.focus({ preventScroll: false });
  });
});
```

---

### 11. **[MAJOR]** Mobile menu is a focus trap escape hatch, not a focus trap — Tab leaves the open overlay

**What.** Lines 102–117. The mobile menu opens with `body.style.overflow = 'hidden'` (good — locks the scroll), but there is no focus management:

- Focus is not moved into the menu when it opens
- Tab cycles through the (invisible-on-mobile) hero, hero CTAs, etc., behind the overlay, because the overlay does not trap focus
- Pressing `Escape` does nothing
- When the menu closes, focus is not returned to the toggle button — it stays wherever it ended up

**Why.** WCAG 2.1 §2.1.2 (No Keyboard Trap) is the *minimum*; the real failure here is the *inverse* — there is no trap at all. A keyboard user on mobile (rare but real — Bluetooth keyboards, screen-reader gestures) opens the menu and finds themselves tabbing through dimmed content behind it. The hamburger toggle is also missing `aria-controls`.

**Fix.**

```html
<button class="mobile-menu-toggle"
        aria-label="Open menu"
        aria-expanded="false"
        aria-controls="masthead-nav">
```

```html
<ul class="masthead-nav" id="masthead-nav">
```

```js
const firstLink = mastheadNav.querySelector('a');
const lastLink  = [...mastheadNav.querySelectorAll('a')].pop();

menuToggle.addEventListener('click', () => {
  const isOpen = mastheadNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
  if (isOpen) {
    firstLink?.focus();
    document.addEventListener('keydown', trap);
  } else {
    document.removeEventListener('keydown', trap);
    menuToggle.focus();    // return focus
  }
});

function trap(e) {
  if (e.key === 'Escape') { menuToggle.click(); return; }
  if (e.key !== 'Tab') return;
  if (e.shiftKey && document.activeElement === firstLink) { lastLink.focus(); e.preventDefault(); }
  else if (!e.shiftKey && document.activeElement === lastLink) { firstLink.focus(); e.preventDefault(); }
}
```

---

### 12. **[MAJOR]** No `width`/`height` on most images → CLS risk on slow networks

**What.** Of 26 `<img>` elements, only the three Michelin-Key marks and the colophon logo declare `width`/`height`. The 22 Unsplash editorial plates have no intrinsic dimensions in HTML. The CSS uses `aspect-ratio` on the *wrapper* (e.g. `.editorial-img { aspect-ratio: 3/4 }` on the hero), so most images won't shift — *but* `.treehouse-fullbleed`, `.editorial-img--vivid`, and the colophon brand logo rely on natural aspect ratios.

**Why.** `aspect-ratio` on the wrapper saves you only if the wrapper's `aspect-ratio` matches the image's natural ratio. For images that don't have a constrained wrapper (e.g. the colophon `FooterLogo.png` is declared 120×48 but rendered with `max-width: 120px; height: auto;` — fine), this is OK. The risk is future authors swapping plates without checking — defensive `width`/`height` is cheap insurance.

**Fix.** On every `<img>`, declare intrinsic dimensions even if the displayed size differs:

```html
<img src="…" alt="…" width="1600" height="2133" loading="lazy" decoding="async">
```

The browser will compute aspect from `width`/`height` until the image arrives, removing CLS regardless of wrapper rules. `decoding="async"` is also missing on every image except the eagerly-loaded ones — adding it everywhere allows non-blocking decode.

---

### 13. **[MAJOR]** `prefers-reduced-motion` block uses `transition-duration: 0.01ms !important` — but `requestAnimationFrame`-driven JS animations ignore it

**What.** CSS lines 2883–2893:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .reveal, .reveal-line { opacity: 1; transform: none; clip-path: none; }
  .editorial-img img { transform: none; }
  .draw-line { transform: scaleX(1); }
  html { scroll-behavior: auto; }
}
```

This handles CSS transitions and animations, but not:

- The hero parallax (`translateY()` written every scroll frame — ignores CSS)
- The pull-quote rotation correction at line 326 (`inner.style.transform = 'rotate(-0.45deg)'` is guarded by `prefersReducedMotion` at *init*, so changes to the OS preference after load are ignored)
- The momentum-scroll in voices (`applyMomentum()` checks `prefersReducedMotion` at function call time — that one *is* correct)
- The page-counter flip (see Finding #3 — not guarded at all)

**Why.** Defense in depth: reduced-motion users who get JS-driven animation anyway perceive the page as buggy (the OS preference is supposed to be respected by all motion).

**Fix.** Use a `MediaQueryList` and listen for changes:

```js
const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
let reduce = reduceMQ.matches;
reduceMQ.addEventListener('change', e => { reduce = e.matches; });
```

…then every motion handler reads `reduce`, not the captured-at-init `prefersReducedMotion`.

Also: `.editorial-img img { transform: none }` in the reduced-motion block overrides `transform: scale(1.04)` (the rest state) — but a `.visible` plate already has `transform: scale(1)` from the JS class. The result is fine, but the cascading is messy; consider gating the scale-on-reveal explicitly.

---

### 14. **[MINOR]** `data-stagger` IntersectionObserver re-iterates already-revealed children — and the same children are *also* observed by the global observer

**What.** Lines 31–69 of `main.js`. The global reveal observer (line 34) observes every `.reveal`, `.reveal-line`, `.draw-line`, `.editorial-img`. Then the stagger observer (line 55) observes every `[data-stagger]` parent and stagger-reveals its `.reveal` children. Children are observed by *both* observers. Whichever fires first wins; the other unobserves nothing (each observer has its own internal list).

**Why.** The stagger effect is non-deterministic. The standard observer's threshold is 0.12, the stagger's is 0.1 — close enough that on most pages, the standard fires first and the children are already `.visible` before the stagger calls `setTimeout`. The staggered cascade looks instant. The brief asks: "IntersectionObserver thresholds reasonable? Order correct?" — order is wrong.

**Fix.** Exclude staggered children from the global observer:

```js
const revealElements = document.querySelectorAll(
  '.reveal:not([data-stagger] .reveal), .reveal-line, .draw-line, .editorial-img'
);
```

…or, more cleanly, mark children with a class:

```js
document.querySelectorAll('[data-stagger]').forEach(p =>
  p.querySelectorAll('.reveal').forEach(c => c.classList.add('reveal--staggered'))
);
// then global observer skips '.reveal--staggered'
```

Currently only `.michelin-stats` and `.standard-grid` use `data-stagger`; visible effect is small, but the intent (sequential reveal of the Michelin stat numbers and the 3 standards) is lost.

---

### 15. **[MINOR]** `pageYOffset` (twice) and scroll handlers race on iOS Safari

**What.** Two scroll handlers (masthead and hero parallax) use `window.pageYOffset`, the reading-progress one uses it too. iOS Safari's "rubber band" overscroll makes `pageYOffset` go *negative* and *exceed `scrollHeight - innerHeight`*. The reading-progress formula:

```js
const progress = Math.min((scrollTop / docHeight) * 100, 100);
```

…caps the upper bound but not the lower bound. Pull-down to refresh on iOS will show a momentarily *receding* spine (height becomes negative for ~150ms, then snaps to 0). Cosmetic but visible on Tree House's small Michelin-Key-anointed audience that disproportionately reads on iPhone.

**Fix.**

```js
const progress = Math.max(0, Math.min((scrollTop / docHeight) * 100, 100));
```

Also: `window.pageYOffset` is deprecated; prefer `window.scrollY`.

---

### 16. **[MINOR]** Unused / orphan code

**What.** Several no-op or dead items:

- `main.js` lines 363–365: empty `forEach` loop on `.diario-entry` with comment "intentionally left blank — kept for future hooks". Dead code; remove or genuinely use.
- `.standard-stat-plus` class (CSS line 1382) — defined, not used anywhere in HTML.
- `.editorial-img--vivid` class (CSS line 295) — defined, not used anywhere in HTML.
- `.sanctuary-detail--spanish` class (CSS line 938) — defined, not used.
- `.page-counter-sep` (CSS line 189) — defined, not used (R1 §15 swapped the sep for the leaf glyph; the rule is stale).
- The CSS comment at line 1730 references "Critique R1 §12"; comment hygiene is otherwise consistent. The dead-code references read as plumbing the user can see in `view-source`; ship clean.

**Fix.** Delete the four orphan rules, delete the dead `forEach`, delete the stale `.page-counter-sep` rule.

---

### 17. **[MINOR]** Voices track `tabindex="0"` makes the *container* the only focus target — and momentum on mouseleave is a UX trap on trackpads

**What.** Line 594: `<div class="voices-track" ... tabindex="0">`. As covered in #7, the cards are not focusable. Separately, the momentum code (line 296) fires on `mouseleave`, which means if you drag a card and the cursor exits the track *vertically* (a trackpad twitch), the carousel takes off scrolling on its own with no obvious cue to stop. There is no friction cap, no way to stop momentum except clicking back into the track.

**Why.** Momentum scrolling on a *finite* track of 5 cards overshoots into empty space and snaps back via `scroll-snap-type: x mandatory`. The combination is jarring; a slight vertical tremor on the trackpad triggers a horizontal animation.

**Fix.**

```js
voicesTrack.addEventListener('mouseleave', () => {
  if (isDown) {
    // Treat as "release" without momentum if the user just slipped off vertically
    isDown = false;
    voicesTrack.classList.remove('dragging');
    // skip applyMomentum() on mouseleave; only mouseup applies momentum
  }
});
```

Or: cap `velocity` magnitude before passing to `applyMomentum()`.

---

### 18. **[NIT]** `aria-hidden="false"` on `.hero-keybadge` is explicit but redundant; `aria-controls` on the hamburger is missing entirely

**What.** Line 88: `<div class="hero-keybadge reveal" aria-hidden="false">`. Setting `aria-hidden="false"` explicitly is fine but unnecessary — the default is visible to AT. More notable: the hamburger `<button>` has `aria-expanded` but no `aria-controls` — covered in #11.

**Fix.** Remove the explicit `aria-hidden="false"`. Add `aria-controls="masthead-nav"` (see #11 patch).

---

### 19. **[NIT]** Section-marker contrast on `.michelin` (terracotta on ivory) may fail AA at 12px

**What.** Lines 974–978 — `.michelin .section-marker { color: var(--terracotta); }` where `--terracotta: #b85a3a` on `--ivory: #f7f3eb`. Contrast ratio is ~3.95:1 at the displayed size (~10.88px after `font-size: 0.68rem`). WCAG AA non-text is 3:1, AA text is 4.5:1 — borderline AA failure for the small caps eyebrow.

**Fix.**

```css
.michelin .section-marker { color: #9c4828; /* ratio ~4.78:1 */ }
.michelin .section-marker::before { background: #9c4828; }
```

Or bump the eyebrow font size to 0.78rem and recheck.

---

### 20. **[NIT]** Smooth-scroll on anchor click does not offset for fixed masthead — links land *behind* the masthead bar

**What.** Lines 206–216. `target.scrollIntoView({ behavior: 'smooth' })` scrolls the target to `scroll-padding-top` of 0; the fixed masthead (~84px) covers the section's eyebrow/section-marker. The page CSS has no `scroll-padding-top` declared on `html`.

**Fix.**

```css
html { scroll-padding-top: 96px; }    /* matches masthead height */
@media (max-width: 768px) { html { scroll-padding-top: 72px; } }
```

This also fixes the skip-link landing point.

---

## What's working

- **Page-counter Roman numerals** are the right apparatus for a field-journal voice — keeping it hidden across the hero (per R1 §10) and resolving into "II. Nota" / "III. Santuario" is a confident touch. Direction-awareness (#3) is the missing polish.
- **Reading progress as left-edge spine** is the right interpretation of the masgirbau anchor — vertical, hairline, mossy.
- **Skip-link CSS** (`top: -100%` → `top: 1rem` on `:focus`) is one of the few skip-link implementations on this codebase that is genuinely visible when focused; the destination is the failure (see #2), not the styling.
- **Honest alt-text** post-R2 ("representative botanical study, Yucatán") — image-fakery is at least disclosed; this should survive the local-asset migration of #8.
- **`.editorial-img` filter softening** (saturate 0.94 → 1.0 on hover) gives plates a sense of "paper coming alive when the reader engages" that is genuinely on-brief.
- **`@media (hover: none)`** override on `.treehouse-plate figcaption` (CSS line 2876) shows real touch-aware thinking — captions appear by default on phones rather than gated behind hover.
- **`scroll-snap-type: x mandatory` + `scrollbar-width: none`** on the voices track is correct; the gaps are in momentum/keyboard, not the underlying mechanic.
