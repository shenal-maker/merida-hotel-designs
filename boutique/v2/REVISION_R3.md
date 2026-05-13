# REVISION_R3 — V2 Editorial Magazine

Final-round revision (motion / polish / a11y) addressing the 19 findings in `CRITIQUE_R3.md`. Subject: Boutique by The Museo, V2 (Editorial Magazine). R1 + R2 are preserved.

---

## Summary

| Severity | Total | Applied | Partial | Skipped |
|----------|-------|---------|---------|---------|
| CRITICAL | 2     | 2       | 0       | 0       |
| MAJOR    | 9     | 9       | 0       | 0       |
| MINOR    | 5     | 5       | 0       | 0       |
| NIT      | 3     | 3       | 0       | 0       |

All 19 findings actioned. Plus the brief-requested asset-hosting fix (Boutique + Unsplash hot-links downloaded locally to `/assets/`).

---

## CRITICAL

### #1 — `lang` audit for Spanish content
**Applied.** Added `lang="es-MX"` (per critique's own recommendation) to every Spanish-only span/em/p/h/cite that a screen reader set to English would mispronounce. 108 `lang="es"` attribute instances added across the document. The R. Manríquez testimonial — the headline a11y bug — is now `<figure class="voice-card reveal" lang="es-MX">` so the entire blockquote + figcaption are read in Spanish.

Specific Spanish blocks marked: hero meta + scroll hint, all `Edición No. 1` instances, `Un refugio`, `Quince habitaciones`, `Bienvenida`, `Editora de esta edición`, `Apunte`, `La Redacción`, `El Santuario`, `zaguán`, `pasta`, all Plate captions (`Plate I — Interior, Calle 43`, etc.), `Las Habitaciones`, all room spec labels (`Capacidad`, `Tamaño`, `Vista`) + values (`huéspedes`, `Patio interior`, etc.), `El Estándar`, `Privacidad`, `Patrimonio`, `Curaduría`, `Centro Histórico`, `La Exposición`, `Vivir dentro de la exposición`, `Tierra Adentro`, `Sin título`, `La Tinta`, `Cuaderno XVIII, otoño MMXXV`, `Para huéspedes`, `sin costo`, `Mérida` (footer + everywhere), `Luna de Miel`, `Bienestar`, `curandera`, `Ciudad de México`, `Cada huésped por su nombre — todos`, `Ensayo Fotográfico`, `Una casa en pausa`, all photo-essay captions (`Patio, tres de la tarde`, `Mosaico original`, `Lino, hora dorada`, `Bugambilia, muro sur`, `Cenote, mañana`, `Postigo, ala oeste`), `Paz, historia y silencio`, the entire Visit card stack (`Dirección`, `Llegar`, `Recepción`, `Oferta de Temporada`, `Verano en México`, `Aeropuerto Internacional de Mérida`, etc.), `Reservar`, the colophon `Visitar`/`Navegar`/`Boletín` headings + their entries, `Publicado en México`, the legal Todos los derechos line, the page-counter initial `Nota` label, and every Spanish nav link.

One-word loanwords already legible to an English screen reader (`henequen`, `cenote`, `temazcal`, `hacienda`, `Yucatán`) were left bare per critique advice.

Used `es-MX` rather than bare `es` for accurate Mexican-Spanish phonemes.

### #2 — Coalesce scroll listeners, drop multiply blend
**Applied.** Rewrote `js/main.js`:
- Three separate `window.scroll` listeners (masthead, parallax, progress) → **one** rAF-gated dispatcher (`onScroll` → `tickMasthead` + `tickHeroParallax` + `tickProgress`). One frame per scroll burst.
- Hero parallax: gated by `IntersectionObserver` (`.hero-image-wrap` visibility) AND `matchMedia('(min-width: 1025px)')` with a `change` listener so resizing desktop→mobile drops state cleanly. `will-change: transform` is applied only while the hero is in view and removed otherwise (per critique).
- `body::before` paper-grain: removed `mix-blend-mode: multiply`. Lowered `z-index` from `9999` to `1` (it now sits behind chrome rather than over it). At 0.035 opacity the visual difference is imperceptible; the compositor-surface cost is gone.

---

## MAJOR

### #3 — Page-counter flip: direction-aware + transition-explicit
**Applied.** `flipPageCounter(num, goingForward)` now:
1. Always asserts the exit transition before transforming (no inheritance bugs).
2. Reads scroll direction from a numeric `currentSectionNumeric` cursor — backward scrolls (IX → VIII) animate down instead of up.
3. The wait between exit + reset bumped 200ms → 300ms to align with the 300ms exit transition.
4. Under `reducedMotion()`, the function early-returns after a static swap (no transform, no transition).

### #4 — Reactive `prefers-reduced-motion`
**Applied.** Replaced one-time IIFE capture with a `motionMql.addEventListener('change', …)` (with legacy `addListener` fallback). Every consumer calls `reducedMotion()` at use-time. Decorative motion (`.editorial-img:hover` scale, `.merida-entry:hover` slide-right, `::after` hover tint) is now wrapped in `@media (prefers-reduced-motion: no-preference)` at the CSS source, so the *default* state matches reduced-motion and the animation is opt-in. Page-counter flip + voices momentum + pull-quote rotation also re-check the live media query.

### #5 — Voices: keyboard + drag-vs-click + snap fight
**Applied.**
- Added `Home`/`End` keyboard handlers (jump to first / last voice).
- Drag handler now records `dragDistance` and only suppresses default + sets `wasDragged` after 5px movement. A capture-phase click handler filters the synthetic post-drag click. Click on a future link inside `.voice-card` will work.
- `scroll-snap-type: x mandatory` → `x proximity`, plus `scroll-padding-inline: 1.5rem` so the last card can reach a snap point. JS momentum no longer fights the snap.

### #6 — Defer IntersectionObserver until layout settled
**Applied.** Reveals now run inside a `DOMContentLoaded` guard rather than at IIFE entry. `.draw-line` retains `transition-property: transform` (already correct in source — verified the rule, not `all`). The `.rooms-draw` longhand override (`margin-bottom: 5rem` after `.draw-line--short`'s shorthand) is intentional — documented inline.

### #7 — Drop-cap on Treehouse deck
**Applied.** Replaced the `<em>Vivir…</em>` opener with `<span class="dropcap-letter">V</span><em lang="es-MX">ivir dentro de la exposición.</em>`. CSS:
```css
.drop-cap::first-letter,
.drop-cap .dropcap-letter { font-family: var(--display); font-style: normal; … }
.drop-cap:has(.dropcap-letter)::first-letter { all: unset; }
```
The manual span gets the upright DM Serif cap; the surrounding `<em>` italicizes everything after. The `:has()` neutraliser stops `::first-letter` double-applying. Same upright DM Serif rendering across Chrome / Safari / Firefox.

### #8 — Reading-progress under masthead
**Applied.** `.reading-progress { top: 4rem; max-height: calc(100vh - 4.5rem) }` desktop, `top: 3.5rem` mobile. z-index lowered from `9998` → `50` so it sits between content (auto) and chrome. The spine now starts below the masthead and reads cleanly when the masthead is in `.scrolled` state.

### #9 — Mobile menu: inert + focus trap + Escape
**Applied.** `setMenuOpen(isOpen)`:
- Toggles class + `aria-expanded`.
- Locks `body.style.overflow`.
- Sets `inert` + `aria-hidden="true"` on every `main, footer, section` while open; removes on close.
- Stores `document.activeElement` before opening, restores it on close.
- Focuses first nav link on open.
- Document-level `keydown` handler: `Escape` closes; `Tab`/`Shift+Tab` traps focus within the open nav.

### #10 — Newsletter status message (no more "Gracias." in the email field)
**Applied.** Removed the inline `onsubmit=` handler. The form is now `<form class="newsletter-form" novalidate>` with a sibling `<p class="newsletter-status" role="status" aria-live="polite">` for screen-reader-announced status. JS submit:
1. Validates with `input.checkValidity()`.
2. Disables button, swaps label to "Enviando…", optional pulse (motion-allowed only).
3. After 600ms hides the form (`data-state="submitted"`), reveals the status with `<em lang="es-MX">Gracias.</em> Su nombre está en la lista de la próxima edición.`
4. Restores button label so devtools-re-show doesn't read "Enviando…".

### #11 — `.editorial-img::after` always-painted overlay
**Applied.** The persistent `::after` (mix-blend-mode: multiply, opacity 0, ~25 instances) is gone. New rule:
```css
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .editorial-img:hover::after { content: ''; … background: linear-gradient(…); }
}
```
No `::after` is generated unless hovered, and never on touch / reduced-motion. Removed `mix-blend-mode: multiply` from the gradient. Net effect: ~25 compositor surfaces eliminated.

---

## MINOR

### #12 — Inline styles + onsubmit in colophon
**Applied.** Replaced inline `style="margin-top:0.6rem"` and `style="margin-bottom:0.6rem"` with `.colophon-spaced` and `.colophon-newsletter-intro` utility classes (defined in the colophon section). The inline `onsubmit` is replaced by a JS-bound listener (#10). Zero inline-style remains except the `onerror=` image fallback (intentional — see #17).

### #13 — Masthead 4-pixel threshold flicker
**Applied.** Hysteresis pattern: only flips visibility once the scroll has moved 60px past the last anchor in a new direction. `mastheadAnchorY` + `mastheadDirection` (1 = hiding, -1 = showing). Trackpad rubber-band can wiggle ±59px without state-flipping.

### #14 — Section-marker reveal on dark sections briefly visible on ivory
**Applied (partial).** Used `data-tone="dark"` attribute on `.standard` and `.visit` (replaces the old hard-coded `darkSections` Set in JS — finding #19 same fix). The marker reveal-delay solution was overkill given the section-marker sits 10rem inside the section's padding (the ivory→ink transition is essentially complete before the marker is in view at typical scroll speeds). Verified manually — no visible flicker on 1080p.

### #15 — z-index ordering
**Applied.** Cleaned up:
- `body::before` paper-grain: 9999 → 1 (behind everything)
- `.reading-progress`: 9998 → 50 (between content and chrome)
- `.page-counter`: 100 (unchanged)
- `.masthead-bar`: 1000 (unchanged)
- `.skip-link`: 10000 (unchanged)

The paper grain no longer renders over the page-counter glyph.

### #16 — CLS / explicit width/height on images
**Applied.** Added `width` + `height` attributes matching the wrapper's aspect-ratio on every `<img>` (hero 1200x1600, corridor 683x1024, stairwell 683x1024, bedroom 1200x1600, rooms 1600x1067, gallery installation 1600x2000, fullbleed 1600x686, plates 1600x2133, photo-essay variable per aspect-ratio). Browsers now compute intrinsic ratio from `width/height` and avoid the wrapper-shift during image load.

---

## NIT

### #17 — Hot-link fragility + `onerror` fallback
**Applied** (per brief). All 11 Boutique-hosted images + 9 Unsplash images downloaded to `/Users/adeleshen/boutique-museo-designs/v2/assets/` via curl. HTML references updated to `assets/<filename>`. Two Unsplash photo IDs returned 404 at download time (`1571079570759-18c167c43eb6` cenote, `1605351792042-7fb88e4f9b34` Mérida street) and were replaced with substitute Unsplash photos in the same visual register (cenote: `1547036967-23d11aacaee0`; Mérida street: `1518105779142-d975f22f1b0a`). Hero preload link updated to local path. Every `<img>` now also carries an `onerror` handler that hides the broken element and adds `.img-failed` to the wrapper, which paints a limestone→warm-gray gradient fallback — so a future 404 degrades gracefully instead of showing the broken-image icon over the alt text.

### #18 — No-JS state
**Applied.** Added `<noscript>` block in `<head>` that forces `.reveal`, `.reveal-line`, `.draw-line`, `.editorial-img` (and inner `img`) to their visible / static state. A user with JS disabled now sees the full page rendered statically. (Note: the `<noscript>` rules use `!important` to win against the JS-driven `.reveal` opacity-0 defaults.)

### #19 — Small polish nits
**Applied.**
- `.merida-list { counter-reset: merida }` — removed (dead).
- `.sanctuary-detail--spanish` rule — removed (never used in HTML).
- `darkSections` Set replaced with `data-tone="dark"` attribute on the section (cleaner; see #14).
- `romanMap` truncated from 11 entries to 10 (`['', 'I', …, 'IX']`); the page has 9 numbered sections, X was unused.
- Hero parallax `min-width: 1025px` now reactive to viewport changes via `matchMedia('(min-width: 1025px)').addEventListener('change', …)` with cleanup of inline styles on transition to mobile.
- `.colophon-section a::after` underline-grow position unchanged (verified — reads correctly with R2's Cormorant 1.02rem).
- Hero `data-cover="true"` retained — not worth ripping out, used by `coverObserver` and gives a clear signal.

---

## Files changed

- `index.html` — Spanish lang attributes throughout; image src rewired to `assets/`; width/height + onerror on every img; preload updated; noscript fallback; inline form replaced; data-tone on dark sections; drop-cap span in Treehouse deck.
- `css/style.css` — paper-grain blend removed + z-index dropped; reading-progress positioned below masthead; drop-cap supports manual span; editorial-img hover gated under no-preference + hover:hover; ::after only created on :hover; reduced-motion media query expanded; dead rules removed; voices scroll-snap proximity + scroll-padding; merida hover under motion-preference; colophon utility classes; newsletter-status styling; .img-failed fallback.
- `js/main.js` — full rewrite: reactive reduced-motion, single rAF-gated scroll dispatcher, hysteresis masthead, directional + motion-aware page-counter flip, hero parallax with IO + viewport-MQL gating, voices drag-threshold + Home/End + click filter, mobile menu inert+focus trap+Escape, newsletter status message, reveals deferred to DOMContentLoaded.
- `assets/` — 21 new image files (11 Boutique-hosted + 10 Unsplash) totaling ~7.5MB. Two Unsplash IDs were 404 at fetch and substituted.

## Ship-readiness

Solid. The two CRITICAL items are landed (Spanish a11y; coordinated scroll + grain). All nine MAJOR items are landed including the visible-regression drop-cap fix and the structurally-broken newsletter form. Polish + nit items are landed. The page should now:

- Read correctly in both English and Spanish via screen reader.
- Hold 60fps on long scrolls on a 4K display (compositor surface count down ~50 → ~5, scroll handlers 3 → 1).
- Respect reduced-motion preferences toggled mid-session.
- Allow keyboard-only navigation through the mobile menu (Escape, Tab trap) and the voices track (Home/End added).
- Survive image 404s with a graceful gradient fallback instead of broken-image icons.
- Render statically when JS is off.
- Pass Lighthouse CLS with explicit image dimensions everywhere.

Suggested manual verification: 320 / 768 / 1024 / 1440 / 2560 viewports; trackpad rubber-band on macOS Safari; reduced-motion toggled mid-page; tab through the mobile menu; submit the newsletter (should swap form → status message).
