# V1 — Cinematic Immersive · Revision R1 Notes

Applied against `CRITIQUE_R1.md`. Voice held — dark cinematic, refined minimalism, *not* editorial magazine. Copy/narrative untouched (that's R2).

---

## Findings applied

### 1 — Hero title's italic "by" (MAJOR) — APPLIED
`.hero-title em`: raised `font-size` from `0.7em` to `0.86em`, dropped the `vertical-align: 0.06em` shim entirely (sits on baseline now), set `letter-spacing: 0`, tightened `margin` from `0 0.15em` to `0 0.04em` so it kerns into "Boutique" / "The".

### 2 — Cormorant doing six different jobs (MAJOR) — APPLIED
Carved clear assignments:
- **Cormorant Italic** — display italic accents only: `.display-*`-tier `em`, `.pull-quote`, `.breath-quote em`, `.art-manifesto em`, `.art-deck`, `.art-rotation-deck`, `.rooms-subtitle`, `.curated-intro`, `.room-summary`, `.footer-spanish`.
- **Cormorant Roman** — kept only for `.art-manifesto` body (the gallery manifesto block — explicit register choice).
- **Reset to Inter** — `.location-val`, `.footer-col ul a`, `.offers-direct`, `.sanctuary-secondary`, `.reserve-field input/select`. These were the loudest collisions.

I did not swap to EB Garamond as the critic suggested — that's a new dependency for one block of body serif, and `art-manifesto` reads coherently in Cormorant 400 with the wider measure now. Documented trade-off, not avoided.

### 3 — `.display-medium` doing too much work (MAJOR) — APPLIED
Split into a proper three-tier scale:
- `.display-huge`  clamp(3.5rem, 10vw, 15rem)   — hero only
- `.display-large` clamp(2.4rem, 5.5vw, 6rem)   — section H2 alt (rooms / curated headers, art-title via override)
- `.display-medium`clamp(2rem, 3.6vw, 3.8rem)   — section H2 (sanctuary / location / offers)
- `.display-small` clamp(1.35rem, 1.9vw, 2rem) — H3 / room title / rotation title (new class, replaces all room-card and rotation `.display-medium` uses in HTML)
- `.pull-quote`    clamp(1.8rem, 3.2vw, 3rem)   — italic Cormorant, used for the interstitial (no longer `.display-medium`)

HTML updated: four room `<h3>` and the rotation `<h3>` changed `.display-medium` → `.display-small`. Interstitial `<p>` changed `.display-medium` → `.pull-quote`.

### 4 — Hero `.display-huge` clamp ceiling (MAJOR) — APPLIED
Adjusted `clamp(3.5rem, 11vw, 13rem)` → `clamp(3.5rem, 10vw, 15rem)`. Lowered the `vw` slope so the scaling curve doesn't peg as early; raised the ceiling so 1920–2560px viewports keep scaling proportionally. Also pulled `.hero-meta` from `bottom: 110px` to `bottom: 96px` to give the title a touch more breathing room above it; bumped `line-height` from 0.92 to 0.94 to relax descender crowding.

### 5 — Ochre / fg-faint contrast on small text (MAJOR — a11y) — APPLIED
- `--fg-faint` lifted from `rgba(250,246,238,0.35)` → `rgba(250,246,238,0.55)` (gets to ~4.7:1 on `--ink`).
- New `--ochre-readable: rgba(198,153,96,0.72)` replaces `--ochre-dim` on every small-text use: `.room-spec-label`, `.curated-tag`, `.offer-tag`, `.breath-attr`, `.hero-meta__divider`, `.geo-caption`.
- `--ochre-dim` (50%) retained only for decorative borders / non-text uses (nav-dot ring, location-cta border, scroll-to-top border) where contrast isn't a text concern.
- Specifically swept: `.hero-meta__lbl`, `.room-spec-label`, `.art-cta-meta`, `.footer-bottom p`, `.footer-brand p`, `.footer-social a` all now on `--fg-dim` or `--ochre-readable`.

### 6 — Letter-spacing inconsistency on uppercase micro-tier (MINOR) — APPLIED
Added three tokens:
```
--ls-tight: 0.2em
--ls-mid:   0.28em
--ls-wide:  0.34em
```
Replaced one-off values across: `.label`, `.hero-eyebrow`, `.top-nav .nav-links a`, `.hero-cta a`, `.location-cta a`, `.reserve-submit`, `.curated-tag`, `.offer-tag`, `.voices-label`, `.testimonial-author`, `.footer-col h4`, `.hero-meta__lbl`, `.room-spec-label`, `.art-cta-meta`, `.art-quote-attr`, `.offer-fine`, `.scroll-indicator span`, `.breath-attr`, `.sanctuary-caption`, `.curated-meta`, `.location-key`, `.footer-social a`, `.intro-mark`. Hero-eyebrow specifically pulled from 0.45em → `--ls-wide` (0.34em).

### 7 — Body line-height too loose / weight too light (MINOR) — APPLIED
`.body-large`: `line-height` 1.8 → 1.68, `font-weight` 300 → 400. Body default `font-weight` also lifted from 300 → 400.

### 8 — Global `em` painting everything ochre (MINOR) — APPLIED
Global `em` rule reduced to italic + inherit color. Ochre + Cormorant Italic treatment scoped explicitly to: `.display-huge em`, `.display-large em`, `.display-medium em`, `.display-small em`, `.pull-quote em`, `.breath-quote em`, `.art-manifesto em`. Removed `display: block` + `margin-top` from `.breath-quote em` — structural shift no longer smuggled into a typographic rule.

### 9 — Art section needs distinct typographic register (MAJOR) — APPLIED
- `.art-piece-title` swapped from DM Serif Display 1.3rem → **Inter 500 uppercase 0.95rem with `--ls-tight`** — reads as a gallery wall label, not another mini-headline.
- `.art-piece-meta` swapped from Cormorant Italic → **Inter 400 0.82rem** with subtle tracking — gallery convention for "Medium · Year".
- `.art-deck` lifted to `font-weight: 500` Cormorant Italic with explicit `letter-spacing: 0.015em` so the section's deck reads at a different cadence than `.rooms-subtitle`/`.curated-intro`.
- `.art-manifesto` got an explicit `letter-spacing: 0.01em` for a slower, more deliberate measure.
- `.art-cross` (the ×) sized up from 0.7em → 0.78em and vertical-align reduced, so the lockup reads as a proper "Treehouse × SoHo" rather than a runt operator.
- Marquee left intact (critic explicitly called it out as working).

### 10 — JetBrains Mono never loaded (MINOR) — APPLIED
Added `&family=JetBrains+Mono:wght@400;500` to the Google Fonts link in `index.html`. `.geo-caption`, `.art-piece-num`, `.offer-fine strong` will now render in the intended monospace. Also added `font-variant-numeric: tabular-nums` to the data-tag uses for the "instrument panel" feel the critic wanted.

### 11 — `.intro-mark` Display-serif at 0.4em letter-spacing (MINOR) — APPLIED
Swapped from DM Serif Display → **Inter 500 0.95rem-1.15rem with `--ls-wide`**. Animation keyframe also retuned (from 0.6em → `--ls-wide` instead of 0.6em → 0.4em). The `__amp` separator keeps a small italic Cormorant moment so the wordmark still has a serif gesture — just not the whole word.

### 12 — Terracotta hidden in chrome (NIT) — APPLIED
Gave terracotta one typographic role: the `<strong>VERANO26</strong>` promo-code chip in `.offer-fine strong` now uses terracotta background/border instead of ochre. The progress bar gradient stays (it's the only restrained chrome use); terracotta now also has a static, readable place in the type system.

### 13 — Mobile testimonial Cormorant swap (NIT) — APPLIED
At `max-width: 480px`, `.testimonial-text` switches `font-family` to Cormorant 500 (true italic). The 1.2rem override deleted — the existing `clamp(1.3rem, 2.4vw, 2.2rem)` already covers that range.

### 14 — Photo filter recipes (NIT) — APPLIED
Defined three filter tokens (`--img-hero`, `--img-panel`, `--img-detail`) on `:root`. Applied to `.sanctuary-image-wrap img`, `.location-image-wrap img`, `.room-card-bg img`, `.photo-strip-item img`, `.art-piece-img img`. Hero, breath, art-hero, and interstitial backgrounds kept their bespoke recipes (they're true atmospheric overlays with different brightness needs, not the panel/detail context).

### 15 — Footer link list typographic register (MINOR) — APPLIED
`.footer-col ul a` switched from Cormorant 1rem → **Inter 400 0.82rem** with subtle letter-spacing. Footer Spanish coda and footer brand paragraph remain in their established voices. The same nav item ("The Sanctuary", "Rooms") now reads in the same typeface family in both the top-nav and the footer.

---

## Findings skipped

None. All CRITICAL/MAJOR findings applied; MINOR and NIT findings all applied where the fix was bounded.

---

## Issues noticed and addressed pre-emptively

1. **`.hero-cta a` font-weight** was 400 — at 0.72rem uppercase tracked, Inter 400 reads thin on dark glass. Bumped to 500. Same applied to `.location-cta a`.

2. **`.hero-eyebrow` font-weight** unset (defaulted to body 300, which the critic implicitly flagged via Finding 7). Made it explicit at 500 to match the rest of the `--ls-wide` micro-tier.

3. **`.geo-caption` size** at 0.65rem with 0.18em tracking was inside the same AA-failure window as Finding 5. Lifted to 0.7rem, brought tracking to 0.12em (mono doesn't need as much letterspacing as Inter caps), and moved color to `--ochre-readable`. Added `font-variant-numeric: tabular-nums`.

4. **`.sanctuary-secondary`** was secretly Cormorant italic at 0.95rem — the critic flagged Cormorant overuse generally; this one was the worst since it's small italic body. Reset to Inter 400, font-style normal. The paragraph's voice ("There is no concierge desk…") doesn't need typographic italics — the copy itself carries the emphasis.

5. **`.reserve-field input/select`** were set in Cormorant — actively confusing for a form field. Switched to Inter 400 0.95rem.

6. **`.pull-quote` text-shadow** added on the interstitial use because it sits over a darkened background image; without the shadow, italic Cormorant at clamp(1.8, 3.2vw, 3rem) gets eaten by the photo at certain crops.

7. **Room card `.display-medium` override** at style.css:843 was a quiet acknowledgement that H3s shouldn't share H2's class. Removing the override entirely now that `.display-small` exists — cascade is cleaner.

---

## Files modified
- `index.html` — font link adds JetBrains Mono; room card H3s + rotation H3 use `.display-small`; interstitial uses `.pull-quote`.
- `css/style.css` — see findings 1–15 above.
- `js/main.js` — not modified (interactions preserved, no typography-specific JS to touch).
