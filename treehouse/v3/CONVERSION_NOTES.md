# Tree House V3 — Conversion Polish Notes

V3 Brutalist Art-Forward pass. Added conversion clarity (hero booking widget,
visible pricing, room specs, prefill-on-CTA) without flattening the brutalist
register or breaking R3 a11y. All scope rules from `CONVERSION_POLISH.md` honored.

## What changed

### 1. Hero booking widget — 4-cell brutalist data row
- `<form class="booking" id="booking">` sits directly below the hero `</section>`,
  above the `01 / LA COLECCIÓN` section label. (Brief: "Place under the hero
  coordinate readout / above the manifesto strip if one remains." No manifesto
  strip remains; widget anchors the bottom of the hero band.)
- 12-col grid strip, four cells, mono micro labels, 1px hairlines:
  - Cell 1 — `ARRIVAL → [date]`
  - Cell 2 — `DEPARTURE → [date]`
  - Cell 3 — `GUESTS → [stepper]` (− / readonly number / +)
  - Cell 4 — `[ ENTER → ]` (full terracotta button, mono caps)
- Reveal: each cell has `.brutalist-snap`. The existing IntersectionObserver in
  `js/main.js` already handles 40ms stagger across siblings entering together.
  Hard cut, no fade. No new motion vocabulary introduced.
- Hover: instant flip — terracotta → canopy on the ENTER cell. No transitions,
  no rounded corners, no shadows, no icons. Matches the rest of V3.

### 2. Price per room — top-right mono stamp
- Every room card now carries `<div class="room-price-stamp" data-placeholder="true">`
  pinned absolute to the top-right of `.room-block`.
- Format: `$325 / NT — FROM` — terracotta amount, ink unit, moss "from" tail.
- Pricing per brief's Tree House list:
  - Room I (King Garden Room) — `$325`
  - Room II (Queen Courtyard Suite) — `$425`
  - Room III (King Garden Suite, slot-3 / Grand Foliage equivalent) — `$595`
  - Room IV (Penthouse Canopy) — `$950`
- Existing spec table's "DESDE" cell also updated from "PRICE ON REQUEST" to
  the placeholder price (also `data-placeholder="true"`) so the owner can
  find-and-replace once real pricing lands.

### 3. Specs per room — mono micro quick-row
- Added `<div class="room-quickspecs" data-placeholder="true">` between the
  image and the existing spec table on every card. Single mono-micro line:
  - Room I — `OCC.2 / 32M² / VIEW.GARDEN`
  - Room II — `OCC.4 / 48M² / VIEW.COURTYARD`
  - Room III — `OCC.6 / 72M² / VIEW.COURTYARD+GARDEN`
  - Room IV — `OCC.6 / 95M² / VIEW.PRIVATE-TERRACE`
- The existing OCC.MAX cell in `.room-specs` was also updated to match
  (`02 / 04 / 06 / 06 ADULTOS`).

### 4. Room CTA prefill
- Every room CTA was retargeted from `https://treehouseboutiquehotel.com`
  (target=_blank) to `#booking` with `data-room`, `data-room-label`, and
  `data-room-occ` attributes.
- Click handler in `js/main.js`:
  - Writes `data-room` into hidden `#booking-room` field.
  - Bumps the guests stepper to the room's max occupancy (clamped to widget max).
  - Updates the `aria-live` meta line under the ENTER button to
    `— PREFILLED · {ROOM LABEL}` so the prefill is perceivable to screen readers.
- Anchor jump to `#booking` is handled by a dedicated smooth-scroll hijack that
  applies *only* to `a[href="#booking"]` — `auto` behavior (hard cut, keeps the
  brutalist register), 64px nav offset, and focus moves to the first input for
  keyboard / SR continuity.

### 5. Wiring follow-ups
- Top-nav `RESERVE` (was `https://treehouseboutiquehotel.com`, _blank) now
  anchors to `#booking`. R3 sticky nav still load-bearing.
- Menu overlay "Reserve" entry (was external, _blank) now anchors to `#booking`.
- Offers section's `RESERVE →` CTA (was external, _blank) now anchors to
  `#booking`. The 5+ nights discount flow continues to land on the widget.

### 6. Date behavior (ported from V4 minimal)
- `arrival` defaults to tomorrow, `min` clamped to today.
- `departure` defaults to arrival + 3 nights, `min` clamped to tomorrow.
- Changing arrival auto-shifts departure forward if it would become invalid.
- Identical pattern to `/Users/adeleshen/boutique-museo-designs/boutique/v4-minimal/js/main.js`.

### 7. Submit behavior
- Non-blocking confirmation flash on submit (portfolio build): the ENTER button
  flips to `CHECKING {arrival} → {departure}` and the meta line shows
  `— {n} GUESTS · {ROOM}` for 1800ms before restoring. Production would forward
  to the PMS.

## Constraints honored

- `.brutalist-snap` motion preserved — the booking widget uses it; no new
  reveal class.
- Palette unchanged — canopy / limestone / cenote / terracotta / moss only.
  The 12-col grid is used end-to-end (hero → widget → rooms → location → offers
  → footer).
- Crosshair cursor, coordinate readout, menu focus-trap, skip link, focus-visible
  outlines, `lang="es-MX"` annotations — all untouched.
- NO icons. NO smooth transitions on hover (all `transition: ... 0s`).
- R3 a11y preserved and extended:
  - All booking inputs have proper `<label for>` or `aria-label`.
  - Stepper exposed as `role="group"` with `aria-labelledby`.
  - Min 44px tap-targets on date inputs, stepper buttons, and ENTER button.
  - `aria-live="polite"` on prefill / submit-confirmation meta line.
  - Anchor jump moves focus into the widget so keyboard users land on the form.
- NO new sections added — widget lives in the hero band, price + specs live in
  existing room cards.
- Killed roster stays killed — no Cetina painter, no Pech/Maza/etc., no 42
  species, no Arboretum. Adults-only / 15 keys / Michelin Key / namesake-of-
  Treehouse-×-SoHo-Galleries copy unchanged.

## Cross-variant minimum check

1. **What rooms can I book here?** Four named rooms in `.collection`, each with
   bold mono numeral and large display headline. ✓
2. **What does each cost?** Top-right terracotta `$XXX / NT — FROM` stamp on
   every card + matching value in the DESDE cell. ✓
3. **How big / who fits?** Mono `OCC.X / XXM² / VIEW.YYY` row on every card,
   plus the four-cell spec table. ✓
4. **How do I book?** Sticky `RESERVE` in nav → `#booking`. Hero widget
   directly below the hero band. Per-card `[ ENTER — № X → ]` prefills the
   widget. Offers CTA and menu Reserve both anchor to `#booking`. ✓

## Files touched

- `index.html` — 317 → 369 lines (+52)
- `css/style.css` — added `.booking*`, `.room-price-stamp*`, `.room-quickspecs`
  blocks plus responsive rules at 1024px / 720px breakpoints.
- `js/main.js` — added booking-widget block (date defaults, stepper, submit
  flash, per-card prefill, `#booking` smooth-scroll hijack with focus move).
