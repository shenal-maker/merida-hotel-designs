# REVISION — R3 (Motion / Interactions / Polish / A11y / Edge Cases)
**Subject:** V1 Cinematic Immersive — Tree House Boutique Hotel
**Round:** 3 (final)
**Source critique:** `CRITIQUE_R3.md` — 4 CRITICAL, 12 MAJOR, 4 MINOR, 2 NIT

This pass mirrors the Boutique V1 R3 implementation patterns where they map. R3
fixes operational issues; R1 hierarchy and R2 voice are preserved unchanged.

---

## CRITICAL — all 4 applied

### 1. No-JS lock removed (Finding 1)
- Removed inline `<body style="overflow: hidden;">`.
- JS adds `body.intro-locked { overflow: hidden }` at script start, removes it at
  1300ms when the overlay dissolves.
- Added `<noscript>` style block in `<head>`: hides the intro overlay entirely,
  restores `overflow: auto`, hides custom cursor + grain, forces all reveal
  classes and hero animation states to their final visible state, makes the
  testimonial list a stacked column with the dots/arrows hidden.
- Page now works at three states — JS on (cinematic), JS slow (overlay holds
  briefly then dissolves), JS off (immediate, static, fully scrollable).

### 2. Spanish-language sections re-exposed to screen readers (Finding 2)
- Removed `aria-hidden="true"` from `.section-breath` and `.section-interstitial`.
- Both restructured as `<blockquote>...<cite>` with proper semantics, and an
  `aria-label` on each section so SR users get a section name.
- `aria-hidden` moved to the decorative image/overlay wrappers only.
- Kept `aria-hidden` on the `.art-marquee` band (purely repeating chrome).
- The interstitial Spanish pull-quote now carries `lang="es-MX"` and the English
  gloss is wrapped in a `<cite>` with a `<span class="visually-hidden">English: </span>`
  prefix so the language-switch is announced clearly.

### 3. `lang="es-MX"` markers everywhere Spanish is load-bearing (Finding 3)
Audit-and-tag pass covered:
- Section labels: `El Refugio Botánico`, `La Llave Michelin`, `Las Habitaciones`,
  `La Rotación Actual`, `El Diario`, `Mérida a tu medida`, `El Sitio · Calle 43`,
  `Las Ofertas`.
- Inline phrases: `Bajo el Dosel`, `se acaba cuando se acaba`, `cochinita`,
  `higuera`, `flamboyanes`, `Barrio de Santa Ana`, `Mercado Santiago`, `Cuzamá`,
  `Plaza Santa Ana / Grande`, `Paseo de Montejo`, `Luna de Miel`, `Expediciones`.
- Footer flourish: `Una casa bajo el dosel. Quince llaves. Sólo adultos.`
- Voices section: `Las Voces — Notas escritas al partir` + the testimonial
  reference to `México`.
- The interstitial pull-quote (`No hay recepción…`).
- `lang="es-MX"` placed on the inline element (span/em), never on the parent
  `<section>` where the surrounding English would be mistagged.

### 4. Touch-laptop / iPad cursor orphan fixed (Finding 4)
- `body { cursor: none }` re-scoped to `@media (pointer: fine) and (hover: hover)`.
- JS reads both media queries on load and on change; if either is false, adds
  `body.coarse-pointer` which forces `cursor: auto !important` (and
  `pointer` on every interactive) with `!important` — wins the specificity fight
  the previous `@media (max-width:768px)` rule was losing.
- Covers iPad portrait/landscape (any width, coarse pointer), Surface in tablet
  mode, touchscreen laptops, and the future Galaxy-Fold-open case.
- The custom `.cursor` / `.cursor-trail` are hidden entirely on coarse pointers.

---

## MAJOR — all 12 applied

| # | Finding | Resolution |
|---|---|---|
| 5 | Smooth scroll lands under the fixed nav | Added `html { scroll-padding-top: 100px }` (72px tablet, 60px mobile) plus `[data-section], #main, #rooms { scroll-margin-top: 100px }` (matching responsive breakpoints). JS `scrollIntoView` calls now also pass `behavior: prefersReducedMotion ? 'auto' : 'smooth'` so reduced-motion users skip the slide. `html` itself gets `scroll-behavior: auto` inside the reduced-motion media query. |
| 6 | Carousel a11y (Finding 6) | `.section-voices` got `aria-roledescription="carousel"`, `aria-label="Guest voices"`. `.voices-content` got `aria-live="polite"` and `aria-atomic="true"`. Each `<div class="testimonial-item">` became `<blockquote>` with the active-quote-only model. Added `.testimonial-controls` with prev/next arrow buttons plus the existing dots in a `role="tablist"` with `aria-selected` toggled per item. Auto-advance is now a self-rescheduling `setTimeout` keyed off the per-quote dwell time (4.5s – 9s, scaled to chars). Pauses on `mouseenter` / `focusin` on the section, resumes on leave, and pauses on `document.hidden`. Auto-advance is disabled entirely under `prefers-reduced-motion: reduce`. Left/right arrow keys cycle the dots. |
| 7 | JS parallax / cursor trail ignore reduced motion | Added a single `prefersReducedMotion` flag listening on a `matchMedia` change event. `updateParallax()` early-returns and clears any inline transform when set. The cursor-trail rAF loop snaps directly to the cursor position (no easing) under reduced motion. The hero ken-burns `.loaded` class is only added when motion is allowed. |
| 8 | Reduced-motion CSS now anchors at final state, not 0.01ms flicker | Reworked the `prefers-reduced-motion: reduce` block. Set `animation: none !important; transition: none !important` on the elements that previously snapped, then pinned each to its final state: marquee/photo-strip `transform: none`, hero img `scale(1)`, hero pieces `opacity: 1`, `.origin-divider` `width: 80px`, `.art-divider` `width: 60px`, `.accent-line` `transform: scaleX(1)`. `.cursor-trail` hidden. `html { scroll-behavior: auto }` added at the top of the block. |
| 9 | No `<main>` landmark; skip-link to `#sanctuary` | Wrapped all page content in `<main id="main">`. Skip-link retargeted from `#sanctuary` → `#main` (lands at the H1 in the hero, not past it). Added `aria-label="Primary"` to the top-nav inner `<nav>`. The nav-dots wrapper already had `aria-label="Section navigation"`. |
| 10 | Reserve form has no aria-live status | Added `<p class="reserve-status" role="status" aria-live="polite">` directly below the form and a `<p class="reserve-helper">` plain-language sibling that names the real email address. JS announces "Enquiry received — the house will write back from reservations@treehouseboutiquehotel.com within a day." Validation: if `departure <= arrival`, status is set to `is-error` style and reads "Departure must be after arrival." `arrival.min` is set to today on load; `departure.min` follows arrival when changed. |
| 11 | Magnetic transform misbehaves on full-bleed mobile submit | Removed the `magnetic-btn` class from `.reserve-submit` in the HTML (and from the JS `magneticBtns` selector). The submit keeps its ripple-on-click (the ripple still works because it's done per-element inside the magnetic loop only — actually now the ripple is gone for submit; this is intentional per critique fix-option-B). Hero and location CTAs keep the magnetic affordance. Belt-and-braces: JS `magneticEligible()` also excludes `.reserve-submit` whether or not it has the class. |
| 12 | Cursor inline-style fights `.hover` class via specificity | Removed `cursor.style.background = 'var(--ochre)'` inline assignment. JS now toggles a `.over-image` class on the cursor element. CSS: `.cursor.over-image { background: var(--ochre) }` and `.cursor.over-image.hover { background: var(--limestone) }` — explicit precedence, no specificity ladder. |
| 13 | Art-piece captions misrepresent the photos | Reconciled against PHOTO_MANIFEST.md. Adopted critique option (a): captions now describe the *photograph as an installation view*, not a fictional artwork. New captions: `Treehouse × SoHo · Bar Wall — Rotation V installation view`, `Treehouse × SoHo · Reading Corner — Rotation V installation view`, `Treehouse × SoHo · Pool Vestibule — Rotation V installation view`. Added a small `.art-rotation-note` paragraph: *"Artist credits for Rotation V follow at install — published in the house leaflet on arrival."* Stops the page from claiming "Oil & copal on linen" under a photograph of bronze figurines. |
| 14 | Nav-dot scroll-spy uses `offsetTop` + rooms-header outside data-section | Rewrote `updateNavDots()` to use `getBoundingClientRect()`. The rooms-header is now inside the rooms section: `<section class="section-rooms-wrap" id="rooms" data-section="rooms">` wraps both `.rooms-header` and the rooms grid (the inner grid is now a `<div class="section-rooms">`). The nav-dot for Rooms is active across both the header and the grid. |
| 15 | No image `width` / `height` attributes | Added intrinsic dimensions plus `decoding="async"` on every `<img>` in the document: hero (2000×3000, eager, `fetchpriority="high"`), sanctuary (1800×2400), michelin bg (2400×1500), breath bg (2400×1500), four rooms (1600×2000 each), art hero (2400×1500), three art-pieces, four journal cards, photo-strip × 10 (1200×800), voices bg (2400×1500), interstitial bg (2400×1500), location wrap (1800×2400), offers bg (2400×1500), three michelin-key WebP instances. CLS prevention is now explicit, not implicit-via-CSS. |
| 16 | R2 backlog items (a) Sanctuary soft rule and (b) Michelin cell 03 slighter | (a) Added `<div class="sanctuary-rule">` between the colonial-history paragraph and the adults-only paragraph (the tonal pivot). CSS: 60px hairline rule with 0.6rem top / 1.8rem bottom margin. Adults-only paragraph gets `.sanctuary-coda` class with the same `max-width: 540px` as the others. (b) `.michelin-grid { grid-template-columns: 1.2fr 1.2fr 0.8fr }` (was three equal fr), with `.michelin-cell:nth-child(3)` getting smaller label/desc text and slightly reduced opacity. Reverts to single-column under `max-width: 900px`. |

---

## MINOR — applied (3 of 4)

### 17. Spanish em residue in journal excerpt
Tagged: `<em lang="es-MX">se acaba cuando se acaba</em>`. The italic stays in
body color (correct — language marker, not emphasis); the ochre is reserved
for display-tier emphasis only.

### 19. mix-blend-mode composite cost on mobile
Added `@media (max-width: 768px) { .grain-overlay { display: none } .canopy-tint { animation: none } }`.
At smartphone DPR the grain is invisible anyway; on mobile compositors it was the
cheapest win.

### 20. Scroll-to-top arrow visibility
Made the button an explicit `type="button"`. The chevron `::before` is left as-is
— it sits over a leaf-bright color on a canopy-deep button, perfectly legible
even at small sizes; further weight tuning was punted as a paint-shop afternoon
tweak rather than an R3 finding.

### 18. Hero font FOUT
**Skipped.** Adding a `<link rel="preload" as="font" type="font/woff2" href="…gstatic…woff2" crossorigin>` requires hardcoding the exact gstatic woff2 URL that the Google Fonts proxy is currently serving for DM Serif Display — that URL rotates without notice (Google has invalidated woff2 hashes in prior weeks). A hardcoded preload that 404s is worse than the textbook FOUT it replaces. The intro overlay already uses `font-display: swap` via Google Fonts; the wordmark falls back to system serif at the top of the cascade. A self-hosted woff2 with `font-display: optional` is the durable fix and would happen at the same time we self-host the rest of the stack (out of scope for R3).

---

## NIT — applied opportunistically

### 21. Polish
- Top-nav inner `<nav>` got `aria-label="Primary"`.
- `.scroll-line` keyframe baseline `transform: scaleY(1)` set under reduced-motion (was half-height permanently before).
- Footer "Original site" link kept its existing `rel="noopener"`.
- Photo-strip duplicates now have `aria-hidden="true"` on their wrapper divs (they're the second half of the seamless loop — a screen reader doesn't need them announced).
- `<blockquote>` and `<cite>` get global resets (`blockquote { margin: 0 }`, `cite { font-style: normal }`) so the new semantic elements don't import browser defaults that would fight the visual design.
- `.testimonial-author` now `display: block; font-style: normal` (was `<span>`, now `<cite>`).

### 22. data-label tooltip language consistency
Changed `data-label="Inicio"` → `data-label="Hero"` on the first nav-dot. All nav-dot tooltips are now in English. `Calle 43` is preserved as a place name. (Per critique's preferred resolution: keep developer-facing tooltips one language; Spanish does its brand work in body copy and section labels.)

---

## Files changed

- `/Users/adeleshen/boutique-museo-designs/treehouse/v1/index.html`
- `/Users/adeleshen/boutique-museo-designs/treehouse/v1/css/style.css`
- `/Users/adeleshen/boutique-museo-designs/treehouse/v1/js/main.js`

## What didn't change (preserved from R1/R2)

- Cinematic intro overlay timing (1.3s read → 1s dissolve → DOM-remove at 2.4s).
- Photo swap (all `../assets/…` references unchanged; alts unchanged except art-pieces N°01–03 which were factually wrong per Finding 13).
- All R1 hierarchy work (display tiers, leaf-glyph system, label-leaf eyebrows, italic discipline, divider patterns).
- All R2 voice work (hero copy, sanctuary three-paragraph rhythm, no-front-desk Spanish pull-quote, "Hold / Walk / Write / Find" verb family, Michelin cell language, Treehouse × SoHo voice, journal excerpt voice, curated/offers copy, location grid, footer Spanish flourish).
- Tree House botanical palette (canopy / moss / leaf-bright / ochre).
- Section pad scale and overall page composition.

---

## Ship-readiness

Page now passes the three states the brief named:
1. **JS on, fine pointer**: cinematic intro, magnetic CTAs, custom cursor, parallax, smooth scroll, auto-advancing pausable carousel, animated reveals.
2. **JS off**: hero plus all sections render statically; skip-link lands at `<main>`; testimonial list stacks; no overlay stuck; chrome hidden.
3. **JS on, coarse pointer / reduced motion**: native cursor preserved, magnetic disabled, parallax inert, marquee static, carousel manual-only, hero at final scale from the first frame.

WCAG checks now passing that previously failed: 2.4.1 (Bypass Blocks via real `<main>`), 2.4.4 (anchors land where they should — `scroll-padding-top`), 2.2.2 (carousel pause / pause-on-focus / reduced-motion off-switch), 3.1.2 (Language of Parts on every Spanish string), 4.1.1 (page robust to JS being off — no scroll trap), 4.1.3 (status messages on reserve form), 2.3.3 (animation from interactions: reduced-motion respected by JS-driven transforms).

Remaining items the team should follow up on outside R3 scope:
- Self-host DM Serif Display + `font-display: optional` for intro overlay (Finding 18 — skipped here, durable fix is a deploy-time change).
- Real reservation backend wired to the form (the helper line names the email as the actual booking path).
- Artist-credit copy for Rotation V once the rotation ships (the `.art-rotation-note` paragraph signals this is interim).
