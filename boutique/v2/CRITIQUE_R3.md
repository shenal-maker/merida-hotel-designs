# CRITIQUE_R3 — V2 Editorial Magazine

## Focus — Motion, Interactions, Polish, Accessibility, Edge Cases

This round assumes R1 (visual hierarchy / typography) and R2 (copy / voice) are settled and does not re-litigate them. The page reads well; what's left is the interaction layer — and that layer has a few load-bearing problems and a handful of small ones. Findings are ordered by severity.

---

### 1. `<html lang="en">` while half the visible copy is Spanish — and the only fully-Spanish testimonial has no `lang="es"` marker. **CRITICAL (a11y)**

**What.** `index.html:2` declares `lang="en"` for the whole document. The R. Manríquez testimonial at `index.html:520–526` is entirely Spanish ("Tres días bastaron para que la casa empezara a sentirse como un tío de Mérida…"). It carries no `lang="es"` attribute on the `<blockquote>` or `<figcaption>`. Every Spanish phrase elsewhere (`refugio`, `quince habitaciones`, `pase la página`, `bienvenida`, the Plate captions, `cada huésped por su nombre`, the entire colophon `Visitar` block) is also unmarked.

**Why it matters.** A screen reader set to English will pronounce R. Manríquez's quote with English phonemes — it will be incomprehensible to the reader. This is *the* concrete a11y bug the R2 reviser flagged and didn't fix. It also affects automated translation, hyphenation, and quotation marks. The brief explicitly asked us to verify this.

**Fix.**
1. Wrap the whole R. Manríquez quote and figcaption in `lang="es"`:
   ```html
   <figure class="voice-card reveal" lang="es">
     <blockquote class="voice-quote">Tres días bastaron…</blockquote>
     <figcaption>…</figcaption>
   </figure>
   ```
2. Add `lang="es"` to other Spanish-only spans where a screen reader would mispronounce them — at minimum, the multi-word Spanish run-ons (`<em lang="es">Un refugio.</em>`, `<em lang="es">Vivir dentro de la exposición.</em>`, the Plate captions, the colophon's "Publicado en…" line, the `voice-place` city names). One-word loanwords like *henequen* or *cenote* are fine to leave.
3. Consider whether `lang="es-MX"` on the page-level Spanish blocks is more accurate than bare `es`.

---

### 2. Two scroll listeners on `window`, neither coordinated, and the hero parallax handler has no rAF gate. **CRITICAL (perf)**

**What.** `js/main.js` attaches three separate scroll listeners: (a) masthead hide/show at line 57, (b) reading-progress at line 179 (rAF-gated, good), and (c) hero parallax at line 213 (no rAF, no throttle). All three are `passive: true`, but the hero parallax handler writes `transform` and `opacity` on every scroll tick, which forces a composite + paint each frame, and runs alongside the masthead handler that toggles classes on every tick. On a long page with `mix-blend-mode: multiply` paper-grain fixed overlay (`body::before`, `css/style.css:49–61`), this is a measurable jank source on a 4K display.

**Why it matters.** Editorial luxury cannot feel laggy. The grain overlay is the most expensive thing on the page (fixed, full-viewport, blend mode); compounding it with un-throttled scroll work in JS is exactly the wrong place to spend budget.

**Fix.**
1. Single shared rAF tick: collapse all three handlers into one `scroll` listener that schedules one rAF, reads `pageYOffset` once, and dispatches to three pure functions.
2. Use `will-change: transform` on `.hero-image-wrap` only while the hero is in view, then remove it (an IntersectionObserver gates it). Setting `will-change` permanently is worse than not setting it.
3. The paper-grain `body::before` could move from `position: fixed` to `background-attachment: fixed` on the body itself, or be backed by a CSS-painted texture rather than a `<filter>` SVG re-rasterizing on every paint. At minimum, drop `mix-blend-mode: multiply` — it forces an additional compositor pass.

---

### 3. Page counter flip animation is broken on the very first transition and runs the wrong direction when scrolling back. **MAJOR**

**What.** `js/main.js:152–167`:
```js
if (num !== currentSection) {
  pageNum.style.transform = 'translateY(-100%)';   // exits UP
  setTimeout(() => {
    pageNum.textContent = num;
    pageNum.style.transition = 'none';
    pageNum.style.transform = 'translateY(100%)';  // re-enters from BELOW
    requestAnimationFrame(() => {
      pageNum.style.transition = 'transform 0.35s ease-out';
      pageNum.style.transform = 'translateY(0)';
    });
  }, 200);
```
Two bugs:
- **No exit transition is asserted before setting `translateY(-100%)`.** On the first transition the inline style has not yet been touched, so the element inherits the `0.3s ease-out` from `css/style.css:142`. Fine. But after the first run, `transition` is set to `'none'` on the re-entry and never re-asserted *before* the next exit — so the next exit also runs with `transition: none`, meaning the digit teleports off-screen with no animation, and only the re-entry animates. The flip looks half-broken on every transition past the first.
- **Direction is hard-coded.** Scrolling *back up* (IX → VIII → VII) still exits up and enters from below, which reads as "advancing" — the opposite of what's happening. The eye expects symmetry: scrolling up should flip the other way.

**Why it matters.** The whole point of the flip is to feel like a counter, not a glitch. Right now it feels like a state-machine bug — and on Safari it visibly stutters.

**Fix.**
```js
const prev = parseInt(romanMap.indexOf(currentSection), 10);
const curr = parseInt(raw, 10);
const goingForward = !currentSection || curr > prev;

pageNum.style.transition = 'transform 0.3s ease-out';
pageNum.style.transform = goingForward ? 'translateY(-100%)' : 'translateY(100%)';
setTimeout(() => {
  pageNum.textContent = num;
  pageNum.style.transition = 'none';
  pageNum.style.transform = goingForward ? 'translateY(100%)' : 'translateY(-100%)';
  requestAnimationFrame(() => {
    pageNum.style.transition = 'transform 0.35s ease-out';
    pageNum.style.transform = 'translateY(0)';
  });
}, 300);
```
Also honour `prefersReducedMotion` — currently the flip animation runs even when the user has requested reduced motion (the global `transition-duration: 0.01ms` in the reduced-motion media query only zeroes CSS transitions, but the inline-style `transition: 'transform 0.35s ease-out'` set by JS overrides that). Either skip the flip entirely under `prefersReducedMotion`, or set `transition: 'none'` in that branch.

---

### 4. `prefers-reduced-motion` only applies on initial page load — JS doesn't react when the user toggles it mid-session, and the voices momentum + parallax + flip are not actually disabled. **MAJOR (a11y)**

**What.** `js/main.js:9` captures `prefersReducedMotion` *once* at IIFE entry. The flag gates voices momentum (line 289) and pull-quote rotation (line 318) — but **not**:
- The page-counter flip (lines 154–162; runs an inline-style transition that survives the CSS `prefers-reduced-motion` override).
- The masthead hide-on-scroll-down (line 65; pure class toggle but the CSS transition is zeroed, so it snaps — acceptable, but the hide itself still happens, which is more aggressive than a reduced-motion user wants).
- The `.editorial-img` hover scale (CSS `css/style.css:225–228`; the `prefers-reduced-motion` block at line 2356 zeroes `transform: none` only on `.editorial-img img` *initially*, not on hover — `:hover { transform: scale(1.02) }` still applies because it has a `0.01ms` transition).
- The `.merida-entry:hover { padding-left: 1.2rem }` "slide-right" interaction (CSS line 1413), which is decorative movement reduced-motion users would prefer disabled.
- The reading-progress bar — fine, it's informational.

**Why it matters.** "Reduced motion" is a user request, not a build-time flag. WCAG 2.3.3 expects vestibular-disorder users to be able to use the page without animation surprises.

**Fix.**
1. Wrap the flip and the merida hover-slide and the editorial-img hover-scale inside `@media (prefers-reduced-motion: no-preference)` instead of unconditional, so the *default* is the static state.
2. Listen for changes to the media query and re-evaluate:
   ```js
   const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
   let prefersReducedMotion = mql.matches;
   mql.addEventListener('change', (e) => { prefersReducedMotion = e.matches; });
   ```
3. Add an explicit guard in the flip handler and the parallax handler.

---

### 5. The voices horizontal track is a keyboard trap waiting to happen, and the drag handlers swallow click events on links. **MAJOR (a11y)**

**What.** `index.html:484` sets `tabindex="0"` on `.voices-track` with `role="region"` and an `aria-label`. Keyboard arrows work (`js/main.js:302`). But:
- There is **no `Home`/`End` key support** — keyboard users cannot jump to the first or last voice.
- The `mousedown` → `mousemove` → `mouseup` handler at `js/main.js:253–286` calls `e.preventDefault()` on `mousemove` (line 277) but **does not distinguish "click" from "drag"** — a click on any `<a>` or `<button>` *inside* a `.voice-card` (none today, but the moment one is added) would be hijacked unless the user moved more than 0 pixels. Add a drag-threshold guard now or you'll regret it the next time a "read more" link gets added inside a voice card.
- **`scroll-snap-type: x mandatory`** (CSS line 1500) combined with JS-driven momentum (line 288) fights itself — momentum scroll completes, then the snap yanks it to a snap point, producing a visible jerk on release. Either use `scroll-snap-type: x proximity` or skip the JS momentum and rely on native inertial scroll on touch + smooth scroll on keyboard.
- The card scroll-snap-align is `start`, so the *last* card sometimes can't reach a snap state (the track ends before it would be at start). Use `scroll-padding-inline: 1.5rem` and consider `scroll-snap-stop: always`.

**Why it matters.** Keyboard users currently can't reach the last voice in two key presses, and the snap/momentum fight feels janky on every interaction.

**Fix.**
- Add `Home` / `End` handlers to the existing keydown listener.
- In the mousemove handler, only set `e.preventDefault()` once total drag distance exceeds ~5px, and record `wasDragged` so a synthetic click on `mouseup` can be filtered if a link is ever added.
- Switch `scroll-snap-type` to `x proximity` *or* drop the JS momentum.

---

### 6. The "draw-line" hr elements don't reset when scrolled back into view — but more importantly, the section-marker reveal triggers don't either. **MAJOR**

**What.** `js/main.js:20` calls `revealObserver.unobserve(entry.target)` on first intersection. That's correct *if* reveals are one-shot, but it means:
- A user who scrolls down past Section 03 (Rooms), then scrolls *back up* to the hero, then back down, sees no re-animation — fine.
- A user resizing the window or zooming such that the `intersectionRatio` changes from > 0.12 to < 0.12 *before* the initial 0.12 hit doesn't get a re-trigger — fine, but…
- The `.draw-line` elements use `transform: scaleX(0) → scaleX(1)` with `transition-delay: 0.2s` (CSS line 196). On slow networks where the IntersectionObserver fires before the section is fully laid out (Treehouse `draw-line--medium` is inside a section with multiple image-driven `aspect-ratio` boxes), the animation can fire while the line is still scaling to its final width, producing a janky scale-then-resize.
- Also, the rooms-draw line (`index.html:195`) has class `draw-line--short rooms-draw` but `.rooms-draw` is defined (`css/style.css:854`) as `margin-bottom: 5rem` while `.draw-line--short` already specifies `margin: 0 0 2.5rem 0`. The longhand override on `rooms-draw` is fine, but `.draw-line--short`'s shorthand zeroes the top/left margins — verify intentional.

**Why it matters.** The "magazine spine drawing in" is the signature animation. It needs to feel deliberate, not luck-of-the-load.

**Fix.**
- Defer the IntersectionObserver setup until `window.addEventListener('load', …)` (or DOMContentLoaded if images are deprioritized), so layout is settled when reveals start firing.
- For `.draw-line`, set `transition-property: transform` only (not `all`) so subsequent layout shifts don't replay the animation.
- Confirm whether the rooms-draw margin override is intentional, then comment it.

---

### 7. Drop caps use `::first-letter`, which silently breaks on quotation marks, accented capitals in some fonts, and emojis. **MAJOR**

**What.** Three drop-cap paragraphs:
- `index.html:106` — "We did not set out…" — capital W, safe.
- `index.html:164` — "The house dates to the late nineteenth century…" — capital T, safe.
- `index.html:341` — `<em>Vivir dentro de la exposición.</em> Not visit it…` — the paragraph **starts with an `<em>`**. CSS `::first-letter` per the spec picks up the first letter regardless of element boundaries, **but** if the paragraph begins with a punctuation mark or specific tags, browsers diverge. WebKit and Blink pick the V from inside the `<em>`, then the drop-cap inherits *italic* style from the `<em>` parent — meaning **the drop-cap is italic**, not the upright DM Serif Display the other two are. Firefox handles this slightly differently.

**Why it matters.** The third drop cap will render differently from the other two on Chrome (italic V) vs. on Safari, and the editorial conceit "three matched drop caps" is broken. R1 specifically fixed the drop cap; this is the regression R2 introduced by sticking an `<em>` at the start of the Treehouse deck.

**Fix.** Wrap the `<em>` so it starts *after* the first letter, or use a manual drop-cap span:
```html
<p class="reveal treehouse-deck drop-cap">
  <em><span class="dropcap-letter">V</span>ivir dentro de la exposición.</em> Not visit it…
</p>
```
…and style `.dropcap-letter` directly (font-family, color, float, size) instead of relying on `::first-letter`. Also: `::first-letter` won't pick up a leading "—" or curly quote if the paragraph were ever to start with one, which is a fragility worth removing now.

Additional `::first-letter` quirk to verify: the editor's note opens with **"We did not set out…"** but if a copywriter later adds a leading quotation mark (e.g. `"Quince habitaciones,"`), Safari includes the punctuation in the drop-cap and Chrome doesn't.

---

### 8. The reading-progress spine is at `left: 1.5rem` (`0.6rem` mobile) — directly under the masthead bar, with no offset for it. **MAJOR**

**What.** `.reading-progress` is `position: fixed; top: 0; left: 1.5rem; width: 1px` (`css/style.css:91`). The masthead bar at `top: 0` is `padding: 1.3rem 2.6rem` and has a `border-bottom`. The progress bar's top end therefore runs *behind* the masthead, and when the masthead is in `.scrolled` state with `background: var(--limestone)`, the progress bar disappears under it visually until the masthead hides.

**Why it matters.** A reading-progress spine that vanishes whenever the masthead is visible (i.e., when the user is scrolling up) defeats its own purpose.

**Fix.**
- Offset the progress bar's `top` to start *below* the masthead, e.g. `top: 4rem`, and shrink its max-height accordingly.
- Or set the masthead `background` to `transparent` and use a backdrop-filter blur, so the spine reads through.
- Or move the progress bar to the *right* margin (matching the page-counter at `right: 2rem`), where it has no z-stack collision.

---

### 9. Mobile menu (`<nav>` open state) makes the rest of the page focusable behind the overlay — no `inert` / no focus trap. **MAJOR (a11y)**

**What.** `js/main.js:84–98` toggles `.masthead-nav.open`, which uses `opacity: 0/1` + `pointer-events` (CSS line 2118). Body overflow is locked. But:
- Keyboard tabbing while the menu is open will still focus elements *behind* the overlay (the hero CTAs, the editor's note links, etc.), because they're not made `inert` and there's no focus trap.
- The toggle button's `aria-expanded` is updated correctly. But the nav doesn't get `aria-hidden="true"` when closed, and the body content doesn't get `aria-hidden="true"` when the menu is open.
- Pressing `Escape` does not close the menu.

**Why it matters.** A keyboard user opens the menu, tabs once, and is now focused on something they can't see. Classic mobile-nav bug.

**Fix.**
```js
menuToggle.addEventListener('click', () => {
  const isOpen = mastheadNav.classList.toggle('open');
  menuToggle.classList.toggle('active');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
  // Inert everything else
  document.querySelectorAll('main, header > *:not(nav):not(.mobile-menu-toggle), footer, section').forEach(el => {
    if (isOpen) el.setAttribute('inert', '');
    else el.removeAttribute('inert');
  });
  if (isOpen) mastheadNav.querySelector('a').focus();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mastheadNav.classList.contains('open')) {
    menuToggle.click();
    menuToggle.focus();
  }
});
```

---

### 10. Newsletter "fake response" is implemented inline on `onsubmit` and produces a fundamentally broken state. **MAJOR**

**What.** `index.html:689`:
```html
<form class="newsletter-form" onsubmit="event.preventDefault(); this.querySelector('input').value='Gracias.'; this.querySelector('input').disabled=true; this.querySelector('button').disabled=true;">
```
This:
- Mixes inline JS into otherwise-clean HTML (the rest of the page uses `main.js`).
- Sets the *email input value* to "Gracias." — which leaves the disabled `type="email"` field with invalid value "Gracias." (the browser may flag this as invalid input on resubmit if the user re-enables the form via devtools, but more importantly it's semantically wrong — the input is for an email, not for a success message).
- Has no loading state. The fake response is instant; for a luxury hotel, a 600ms "Enviando…" intermediary state is the difference between a press and a confirmation.
- The `js/main.js:341` "gentle pulse" handler also fires on submit, but the pulse runs against a button that is being disabled in the same tick — race-y.
- No success message is announced to screen readers (`aria-live`).

**Why it matters.** The newsletter is the only conversion-adjacent moment in the footer; "Gracias." appearing inside the email field looks like the form is broken, not done.

**Fix.** Move the submit handling into `main.js`, add a `<span class="newsletter-status" aria-live="polite"></span>` next to the form, and on submit:
1. Disable the button, swap its label to "Enviando…", show a single subtle dot animation.
2. After 500ms, swap the form for the status message ("Gracias. Su nombre está en la lista de la próxima edición.").
3. Don't mutate the email input's value.

---

### 11. Image hover ::after gradient is always painted (opacity 0 → 1), forcing a compositor layer on every `editorial-img` even when not hovered. **MAJOR (perf)**

**What.** `css/style.css:237–249`:
```css
.editorial-img::after {
  content: '';
  position: absolute;
  inset: 0;
  mix-blend-mode: multiply;       /* expensive */
  opacity: 0;
  background: linear-gradient(...);  /* paint cost */
  transition: opacity 0.5s ease;
  pointer-events: none;
}
```
Every `editorial-img` (there are ~25 on the page) gets a `::after` with `mix-blend-mode: multiply`. Even at `opacity: 0`, blend modes force the compositor to allocate a stacking context and a separate buffer. Combined with the `.editorial-img img { filter: saturate(0.95) brightness(0.98) }` on every image, the page has ~50 compositor surfaces.

**Why it matters.** Scroll FPS on a mid-range laptop will sit around 45–50fps when it should be a solid 60. The Photo Essay interstitial section (8 images in tight row layouts) is where this is most visible.

**Fix.**
- Gate the `::after` behind `.editorial-img:hover::after { display: block; opacity: 1 }` and `.editorial-img::after { display: none; opacity: 0 }` so it doesn't allocate when not needed. Or:
- Drop `mix-blend-mode: multiply` and use a flat semi-transparent overlay — the visual difference at 0.07 opacity is negligible.
- The image `filter: saturate(0.95) brightness(0.98)` is so subtle it's nearly imperceptible. Either commit harder (saturate 0.85) or remove the filter and avoid the compositor cost.

---

### 12. Inline `onsubmit`, inline `style="margin-top: 0.6rem;"`, and inline `style="margin-bottom: 0.6rem;"` in the colophon — all of which point to missing CSS classes. **MINOR**

**What.**
- `index.html:672` — `<p style="margin-top:0.6rem;">A pasos del Palacio Cantón</p>`
- `index.html:688` — `<p style="margin-bottom: 0.6rem;">Nuevas ediciones, rotaciones…</p>`
- `index.html:689` — inline `onsubmit` (Finding 10).

**Why it matters.** These are tells that the colophon CSS isn't quite finished. They'll also slip through any future CSP that disallows inline styles/scripts.

**Fix.** Add `.colophon-section p + p { margin-top: 0.6rem; }` or a `.colophon-section p--space-above` utility class.

---

### 13. The masthead hide-on-scroll triggers on a 4-pixel threshold — too sensitive on macOS trackpads with momentum scrolling. **MINOR**

**What.** `js/main.js:64`:
```js
if (currentScroll > lastScroll + 4) masthead.classList.add('hidden');
else if (currentScroll < lastScroll - 4) masthead.classList.remove('hidden');
```
The threshold is 4px between consecutive scroll *events*, not between scroll start/end. On a macOS trackpad, a single inertial swipe-back fires dozens of small scroll deltas — alternately positive and negative as the rubber-banding works out — and the masthead flickers between hidden and visible on the rebound.

**Why it matters.** It's a visible flash, and on a publication that prides itself on quiet, it reads as nervous chrome.

**Fix.** Sample the scroll position less frequently (every ~100ms via rAF + delta accumulator), or compare against a `scrollAnchor` set when direction changes rather than `lastScroll`. Standard pattern:
```js
let anchorY = 0;
let direction = 0;
// in handler:
const dy = currentScroll - anchorY;
if (dy > 60 && direction !== 1) { direction = 1; masthead.classList.add('hidden'); anchorY = currentScroll; }
if (dy < -60 && direction !== -1) { direction = -1; masthead.classList.remove('hidden'); anchorY = currentScroll; }
```

---

### 14. Section-marker reveals on the dark El Estándar panel arrive *before* the dark background does — the ochre marker briefly flashes on ivory. **MINOR**

**What.** `.standard` has `background: var(--ink)` (`css/style.css:989`). Its `.section-marker` is ochre (`css/style.css:992`). When scrolling into the section, the IntersectionObserver fires on the section *before* its full background fills the viewport — so the ochre marker is briefly visible against the previous section's ivory, then the ink wash arrives behind it. Same on `.visit`.

Also: the `.section-marker` class is repeated on every section (CSS line 158), so all section markers share base styling. Within `.standard`, `.standard .section-marker` overrides the color — but the inherited `margin-bottom: 2.5rem` plus the section's `padding: 10rem 3rem 9rem` means the marker sits ~10rem below the section's top edge, far enough that the ivory→ink transition is mostly complete by the time it's visible. Acceptable in most cases, but worth a manual scroll-through on a 1080p viewport.

**Why it matters.** Subtle visual stutter that breaks the "page settling into place" rhythm.

**Fix.** Either delay the section-marker reveal until after the section's background is in place (e.g., `transition-delay: 0.15s` for `.standard .section-marker.reveal, .visit .section-marker.reveal`), or add a `data-bg-tone="dark"` attribute on those sections and animate the body background to match a beat earlier.

---

### 15. Page-counter, reading-progress, and hero scroll-hint share `z-index` real estate poorly; the page-counter sits at `z: 100`, but the paper-grain overlay is at `z: 9999`. **MINOR**

**What.** `css/style.css`:
- `body::before` (paper grain) → `z-index: 9999`
- `.skip-link` → `z-index: 10000`
- `.reading-progress` → `z-index: 9998`
- `.masthead-bar` → `z-index: 1000`
- `.page-counter` → `z-index: 100`

The paper grain at 9999 with `mix-blend-mode: multiply` *is rendered over* the page-counter and reading-progress. The grain is at 0.035 opacity so it's barely visible, but the page-counter's tabular-nums roman numeral has paper grain laid over it.

**Why it matters.** Mostly fine, but the page-counter on the dark sections (`data-tone="dark"`, ivory text on ink) is the one place where the grain is visible against high-contrast text. The grain at multiply over an ivory text glyph subtracts brightness slightly. Verify visually that the counter is still legible against `--ink`.

**Fix.** Either lower the grain's `z-index` to ~10 (below all chrome) and put it behind the content via a parent stacking context, or exempt the chrome elements with `isolation: isolate` and a higher z-index. The current ordering is haphazard.

---

### 16. Hero image fixed-aspect-ratio `aspect-ratio: 3/4` on `.hero-image-wrap` — but no width/height attributes on the `<img>`, so CLS during font load is non-zero. **MINOR**

**What.** `index.html:85`: `<img src="…DSC00113-Edit.jpg" alt="…" loading="eager">` — no `width` or `height` attributes. The wrapper has `aspect-ratio: 3/4` (CSS line 558), which prevents CLS on the *wrapper*, but the `<img>` itself can still shift the wrapper's measured size during initial paint on browsers that don't yet support `aspect-ratio`-driven intrinsic sizing for replaced elements (Safari has had quirks here historically).

The same is true of every other `<img>` on the page — none have explicit dimensions. Many are inside `.editorial-img` wrappers with `aspect-ratio` set, but several (e.g. `.editors-note-image .editorial-img`) inherit `aspect-ratio: 3/4` from the wrapper. The Unsplash hero/treehouse images load over an empty container until the network resolves them.

**Why it matters.** Lighthouse CLS score will flag this. The hero is preloaded (`<link rel="preload">` line 11) which mitigates it, but the below-fold images all trigger small CLS contributions as they resolve.

**Fix.** Add `width` and `height` attributes to every `<img>` matching the aspect ratio of its wrapper (browsers compute `width / height` and apply intrinsic ratio). For Unsplash URLs, append `&w=1600&h=1067` or similar and set matching `width="1600" height="1067"` on the `<img>`.

---

### 17. Hot-linked Boutique image URLs are a fragility, and Unsplash images mix into the same image grid. **NIT (flagged per brief)**

**What.** Of ~25 images, 11 are hot-linked from `boutiquebythemuseo.com/wp-content/uploads/…` (server-owned by a third party) and 8 from `images.unsplash.com` (Unsplash, also third party). One image at `index.html:154` references a `Boutique4-683x1024.jpg` that may or may not still exist — and we have no fallback if it 404s. There's no `onerror` handler, no `<picture>` with a local fallback.

**Why it matters.** A single 404 on the hero image breaks the entire first impression. The R3 brief explicitly flagged this; it's out of scope to fix but worth recording.

**Fix.** Long-term, host all photography locally with versioned filenames and CDN. Short-term, add an `onerror` handler that swaps to a CSS background or to a fallback solid color, so a 404 doesn't render alt text against the gradient background.

---

### 18. No-JS state — the page mostly works, but reveal elements stay hidden forever. **NIT**

**What.** `css/style.css:170–178`: `.reveal { opacity: 0; transform: translateY(28px) }` and `.reveal-line { clip-path: inset(0 0 100% 0) }`. These rules apply unconditionally. If JS fails or is disabled, the IntersectionObserver never fires, and **every reveal element stays invisible**. That includes the editor's note paragraphs, the section markers, the room headlines, the testimonials.

**Why it matters.** It's a luxury hotel landing page. A user with NoScript or an ad-blocker that breaks JS sees a half-blank page. The `<noscript>` reveal fallback is one line.

**Fix.** Add to CSS:
```css
.no-js .reveal, .no-js .reveal-line, .no-js .draw-line, .no-js .editorial-img {
  opacity: 1; transform: none; clip-path: none;
}
```
…or a `<noscript><style>.reveal{opacity:1;transform:none}.reveal-line{clip-path:none}.draw-line{transform:scaleX(1)}</style></noscript>` in the `<head>`.

---

### 19. Several small polish nits worth a pass. **NIT**

- **`treehouse-fullbleed-caption`** uses `position: absolute; bottom: -3rem` (CSS line 1203). On mobile (line 2062) it falls back to `position: static`. Verify the negative bottom doesn't overlap the next section on the *exact* viewport where the responsive breakpoint hasn't kicked in (e.g. 1024px ± 1).
- **`.merida-list { counter-reset: merida }`** (CSS line 1402) is set up but never used — there's no `counter-increment` or `content: counter(merida, lower-roman)`. The Roman lowercase `i. ii. iii. iv.` numerals are hand-coded in HTML (`index.html:440, 448, 456, 464`). Either commit to the CSS counter (more flexible) or remove the dead `counter-reset`.
- **`.sanctuary-detail--spanish`** is defined (CSS line 806) but never used in HTML.
- **`darkSections` Set** (`js/main.js:107`) hardcodes string match on `'Estándar'` and `'Visitar'`. Cleaner: drive it from a `data-tone="dark"` attribute on the section itself.
- **`romanMap`** includes index 10 = `'X'` but the comment says "page never exceeds 9". Either the page can reach X (and the comment is wrong) or the entry is dead. With 9 numbered sections, you're at IX max; safe to leave but worth a comment cleanup.
- **`heroImg` parallax** (`js/main.js:212`) is gated on `min-width: 1025px` — but the matchMedia check is captured at script-eval time and won't update on resize. A user resizing from desktop to mobile will see the parallax frozen at its last value with no cleanup.
- **`.colophon-section a::after` underline-grow** sits at `bottom: 0.05rem` (CSS line 1877). The text is set in Cormorant at 1.02rem with `line-height: 1.55`, so the underline lands right at the baseline — fine. R1 flagged a previous version of this; verify it now reads correctly.
- **Duplicate IDs / aria-controls.** None found — all section IDs are unique.
- **Hero `data-cover="true"`** is checked in JS (`coverSection`) but the attribute could just be `id="top"` since that's already there. Minor duplication.

---

## What's working (protect)

A few interaction pieces are notably well-done and shouldn't be touched in this round:

1. **The reveal stagger via IntersectionObserver** (`js/main.js:32–50`) is correctly written and respects timing. The CSS transition curve `cubic-bezier(0.22, 0.61, 0.36, 1)` is the right "settling" curve.
2. **The reading-progress bar is rAF-throttled correctly** (line 178) — the `ticking` boolean pattern is textbook.
3. **The voices keyboard arrow support exists at all** — most luxury hotel sites with horizontal scroll-tracks ship without it.
4. **The cover-section IntersectionObserver** that hides the page-counter on the hero (line 117) is a thoughtful touch.
5. **`prefers-reduced-motion`** is honoured at the CSS layer (`@media (prefers-reduced-motion: reduce)` at line 2351), even if JS has gaps.
6. **Mobile menu body-scroll lock** (`document.body.style.overflow = 'hidden'`) is the right move.

---

## Recommended order of operations

1. Fix the `lang` attributes (Finding 1) — 10 minutes, biggest a11y win.
2. Fix the page-counter flip direction + reduced-motion gap (Findings 3 + 4) — most visible motion bug.
3. Fix the drop cap on the Treehouse deck (Finding 7) — visible visual regression.
4. Coalesce the scroll listeners (Finding 2) — measurable perf win.
5. Add mobile menu escape + inert + focus trap (Finding 9).
6. The rest are polish.

Total estimated fix time: ~3 hours, including verification across 320 / 768 / 1024 / 1920 / 2560.
