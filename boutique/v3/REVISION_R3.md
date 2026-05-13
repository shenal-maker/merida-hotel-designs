# REVISION — V3 / Round 3 (Motion, Polish, A11y, Edge Cases)

Subject: `Boutique by The Museo` — Brutalist Art-Forward variant.
Posture: final-round polish. All CRITICAL and MAJOR findings from `CRITIQUE_R3.md` applied. MINOR/NIT findings applied where cheap.

R3 preserves R1 + R2 work: focus trap, `prefers-reduced-motion` coverage, `(hover: none)` cursor-readout guard, counter line-draw sequencing, plate caption contrast, and the typography + copy decisions from earlier rounds.

---

## Findings → Action

### CRITICAL

**#1 — No `<main>` landmark; skip link skipped the brand.** Applied.
- Wrapped `<section class="landing">` through `<section class="the-space">` in `<main id="main">`.
- Retargeted skip link from `#manifesto` to `#main`. The hero stays inside `<main>`, landmark navigation works (NVDA "D", VoiceOver rotor), and the skip link no longer bypasses the H1.

**#2 — `lang="en"` was wrong for the Spanish review + coda.** Applied.
- Document remains `lang="en"` (English is still the majority language) with explicit `lang="es"` markup on Spanish content:
  - C.D. review block: `<div class="review-text" lang="es">`.
  - Manifesto coda Spanish sentence: `<span lang="es">Un refugio en el corazón de Mérida.</span>`.
  - All 8 section labels: `MANIFIESTO`, `ESPECIFICACIONES`, `LA COLECCIÓN`, `LA EXPOSICIÓN`, `EL JARDÍN INTERIOR`, `MÉRIDA CURADA`, `NOTAS DE CAMPO`, `ÍNDICE`, `EL ESPACIO` each wrapped in `<span lang="es">`.
  - Gallery tags `BAÑO` and `TERRAZA` wrapped in `<span lang="es">`.
  - CERO counter `data-text` value spans `lang="es"` (see #6).
- Whisper line left mixed-English (`coffee at six. limestone, before the light.`) — phrase is English.

**#3 — Deep-link to `#manifesto` caused observer-order jitter.** Applied.
- Added deep-link guard at landing letter-dispersion init: if user lands with a hash other than `#main`/`#landing`, or with `scrollY > landing.offsetHeight * 0.5`, letters snap to dispersed/faded state with `transition: none` — no first-frame animation.
- Added explicit `opacity: 1` baseline on letters when NOT deep-linked, so first paint never shows pre-faded state.
- Scroll handler now short-circuits when `landing.getBoundingClientRect().bottom < -50` — saves layout reads after the user is past the hero.

### MAJOR

**#4 + #5 — Data-cell row/col highlight + `getGridCols()` thrash.** Applied (option a).
- Deleted the entire `.data-cell` `mouseenter`/`mouseleave` row/column subsystem and the `getGridCols()` heuristic from `js/main.js`.
- Removed the now-orphaned `.data-cell.highlight-row`/`.highlight-col` CSS rules.
- The CSS `:hover` background tint (`rgba(var(--ink-rgb), 0.07)`) is now the entire interaction — works for sighted-pointer users; keyboard users aren't split off; mobile gets the same simple state on touch.

**#6 — CERO counter animated 0→0 silently.** Applied.
- Restored `data-text="CERO"` on the counter cell — the existing `animateCounter()` already handles `data-text` overrides as a direct word-set + line-draw.
- Added Spanish `lang="es"` on the cell.
- Added CSS `zero-flicker` keyframe animation on `.counter-cell.counted .counter-number[data-text="CERO"]` — 600ms `steps(6)` opacity flicker so the cell has arrival motion that matches the brutalist beat. Tightened font-size (clamp 3rem → 8rem) so the 4-letter word fits the cell without overflow.

**#7 — Room CTA focus invisible on hover.** Applied.
- Added `.room-cta:focus-visible { outline: 2px solid var(--terracotta); outline-offset: 4px; }` — terracotta passes 4.3:1 against limestone (resting) and 5.1:1 against ink (hover), so the ring stays visible in both states.

**#8 — `.nav` `mix-blend-mode: difference` compositor cost.** Applied.
- Dropped `mix-blend-mode: difference` from `.nav` entirely.
- Added `.nav--dark` class that swaps text color via `transition: color 0.2s ease`.
- Added a small IntersectionObserver in JS that toggles `.nav--dark` based on whether `.landing` or `.exhibition` (the only dark sections) is centered in the viewport. Initial state at load: `.nav--dark` is on (landing is dark).
- No more fullscreen GPU layer for the nav stacked with `multiply` on the noise overlay.

**#9 — Noise flash fired 3–6× during fast scroll.** Applied.
- Replaced `threshold: [0.05, 0.1, 0.2]` + window-range check with `rootMargin: '-30% 0px -60% 0px'` — single tripwire per section.
- Added 800ms global cooldown via `performance.now()` `lastFlash` tracking.
- Added `noiseObserver.unobserve(entry.target)` after first fire — each section can flash at most once per page load.

**#10 — Whisper line wrapped badly on mobile + mismatched padding.** Applied.
- `padding-left` changed from `1.4rem` → `1.2rem` to align with other manifesto lines.
- `line-height` changed from `1.1` → `1.25` to breathe with descenders.
- Added `max-width: 22ch` to force a balanced wrap before the line runs into "f"/"g" descender collisions.
- Added mobile (`max-width: 768px`) font-size override `clamp(1.2rem, 5vw, 2rem)` and `padding-left: 0.8rem` to match `.manifesto-line` mobile padding.

**#11 — Hot-linked Boutique URLs.** Applied.
- All `boutiquebythemuseo.com` images and all `images.unsplash.com` images downloaded to `/v3/assets/`.
- 16 files total: 5 boutique room/hero images, 5 boutique strip/screenshot PNGs+JPGs, 6 unsplash plate JPGs.
- Two unsplash photo IDs (`1561839561-b13bcfe95249` and `1577083552431-6e5fd01988ec`) returned HTTP 404 from imgix at time of fetch; substituted with locally-available equivalents from `/v2/assets/` (`unsplash-framed-work.jpg` → `unsplash-plate-04.jpg`, `unsplash-cenote.jpg` → `unsplash-plate-05.jpg`) preserving the catalog feel.
- HTML `<img>` and CSS `background-image` paths rewritten to `assets/...` (relative from `index.html`) and `../assets/...` (relative from `css/style.css`).
- Preload tag rewritten to local asset.

**#12 — Missing `width`/`height` → CLS.** Applied.
- Every `<img>` in the document now has explicit intrinsic `width` and `height` attributes derived from the downloaded file's actual pixel dimensions (read via `file`/sips on the assets).
- Marquee strip: added `width: 28vw; min-width: 220px` on `.manifesto-strip__track img` so the track's total width is deterministic before images load — no more loop-seam jump.

**#13 — Menu toggle `aria-controls`/redundant `aria-label`.** Applied.
- INDEX button: removed `aria-label="Open menu"`, added `aria-controls="site-index"`. Visible "INDEX" text speaks for itself now.
- Menu overlay: added `id="site-index"`.
- CLOSE button: removed `aria-label="Close menu"` — same redundancy issue.

**#14 — Newsletter form polish.** Applied.
- HTML: input gained `name="email"`, `autocomplete="email"`, `inputmode="email"`. Form lost the inline `onsubmit="event.preventDefault();"` in favor of a real JS handler. Added `<div class="footer-newsletter-status" aria-live="polite">` for the success message.
- JS: placeholder typer is now gated on `document.activeElement !== input && !input.value`. Added `focus` + `input` listeners on the input that halt the typer and restore the full placeholder. If the user is already focused or has typed before the observer fires, the typer never starts.
- JS: real submit handler — validates `checkValidity()`, calls `reportValidity()` on failure, otherwise sets `.enrolled` class, writes "ENROLLED — № NNNN" stamp into the aria-live region, disables the input, clears the value.
- CSS: `.footer-newsletter-status` styled in terracotta-on-ink mono, hidden by default, revealed on `.enrolled`.

### MINOR / NIT (#15)

- **Stale comment** at `.manifesto-line--whisper` rule referring to "WHISPER, DON'T SHOUT" — updated to reflect R2's coffee/limestone copy.
- **Identical `.counter-number--small`** — differentiated. Now `font-size: clamp(3rem, 8vw, 7rem); letter-spacing: -0.04em;` so the 2023 year cell reads as a date, not a count.
- **Gallery clip-path reveal** toggling on/off — now one-shot. Added `galleryObserver.unobserve(entry.target)` after first reveal.
- **Skip link `top: -100%`** — changed to `top: -3rem` (more conventional and predictable across containing-block edge cases).
- **Doubled-event path** when INDEX clicked while menu open — `openMenu()` now sets `menuBtn.disabled = true`, `closeMenu()` re-enables. Click on the (still z-stacked) INDEX button is now a no-op while the overlay is open.

---

## Skipped

None. Every CRITICAL, MAJOR, MINOR, and NIT from CRITIQUE_R3.md has been addressed in some form. Where the critique offered an A-or-B choice, I picked the cheaper / less brittle option (deleted data-cell row/col system rather than re-enabling with arrow-key nav; restored `data-text="CERO"` rather than building a scramble flicker — the existing override path already produces a clean reveal, plus added a CSS flicker for arrival motion).

---

## Preserved (do not regress)

- **Menu focus trap** — `openMenu`/`closeMenu` capture/restore `lastFocused`, apply/remove `inert` on siblings, cycle Tab forward + backward, close on Esc. Only addition: `menuBtn.disabled` toggle while open.
- **`prefers-reduced-motion` coverage** — gates cursor readout, letter dispersion, manifesto glitch, noise flash, newsletter typer. CSS `@media (prefers-reduced-motion)` block at line 2153 still nukes all animation/transition durations. CERO flicker animation is included in that sweep (animation-duration → 0.001s).
- **`(hover: none)` cursor-readout guard** — unchanged at CSS line 176.
- **Counter line-draw sequencing** — unchanged. The MutationObserver still adds `.counted` to the cell once the line draws, which now also triggers the new CERO flicker keyframe.
- **Plate caption contrast** — unchanged.
- **R2 typography + copy** — every section header, whisper line, coda paragraph, exhibition title, review copy, and curated-Mérida program text is unchanged. Only Spanish-language markup spans were added around existing words.

---

## Ship-readiness

Ready. R3 is a polish pass — no new sections, no copy rewrites, no typographic changes. The art-catalog voice and brutalist treatment are intact. Performance footprint is meaningfully smaller (mix-blend-mode dropped, noise observer is one-shot, gallery observer is one-shot, getGridCols thrash eliminated). Accessibility is materially better (landmark, lang-of-parts, focus visibility, form field semantics, ARIA disclosure pattern).

Files touched:
- `/Users/adeleshen/boutique-museo-designs/v3/index.html`
- `/Users/adeleshen/boutique-museo-designs/v3/css/style.css`
- `/Users/adeleshen/boutique-museo-designs/v3/js/main.js`
- `/Users/adeleshen/boutique-museo-designs/v3/assets/` (new directory, 16 image files)
