# V3 — Round 1 Revision Summary

Subject: Boutique by The Museo / V3 Brutalist Art-Forward
Style anchor: Peter & Paul + Pan & Koffee V3. Limestone/ink/terracotta high-contrast catalog.

---

## Applied — CRITICAL

### 1. Mono microcopy tiers (CRITICAL)
- Introduced 3 enforced mono tiers in `:root`: `--mono-micro-size: 0.55rem / 0.32em`, `--mono-meta-size: 0.7rem / 0.16em`, `--mono-data-size: 0.82rem / 0.08em`.
- `--mono-micro` reserved for: cursor readout, landing corners/coords/subtitle/scroll-indicator, manifesto meta, menu meta/foot, plate-loc, review-stamp, footer-stamp, footer-copyright, fp-piece. (~10 selectors.)
- `--mono-meta` is the run-of-page tier: section labels, all internal sub-labels (exhibit-statement-label, exhibit-roster-label, floorplan-label, exhibit-foot-label, experiences-intro-label, footer-label), nav, room-version, room-spec-label, plate-num, plate-meta, fp-name, exp-num, exp-meta, exp-from, offer-tag/body, review-author, counter-label, space-gallery-tag (kept at micro for noisier overlay).
- `--mono-data` for glance-readable specifications: room-spec-value, exhibit-dates-val, exp-meta values (the bold half), exp-from amounts, room-num. The eye now has somewhere to land in dense apparatus.

### 2. Canonical 12-col grid (CRITICAL)
- Defined `--grid-cols: 12` token at `:root`.
- Opted every grid section into 12-col base:
  - `.data-grid-inner` → 12-col, each `.data-cell` spans 4 (was 3 implicit columns).
  - `.exhibit-plates` → already 12-col, unchanged.
  - `.reviews-grid` → already 12-col.
  - `.counters` → 12-col, regular cells span 2, `--wide` cell spans 4.
  - `.floorplan-grid` → 12-col (was 1fr 2fr 1fr bespoke).
  - `.space-gallery` → already 12-col.
  - `.room-specs` → 4-col fixed (a clean factor of 12) rather than auto-fit.
- Mid-breakpoint (1024px): everything collapses to 6-col with consistent halving (cells span 3 of 6, counters span 2 of 6, wide spans 6).

---

## Applied — MAJOR

### 3. Section inversion reduced from 9 to 3 (MAJOR)
- Dark sections now appear only at narrative beats: **landing** (entry), **exhibition** (centerpiece), **footer** (sign-off).
- Manifesto, data grid, collection (including suites II + IV — removed `room-block--invert` class application), experiences, reviews, counters, space → all limestone.
- Data grid hover behavior reworked for limestone background: row/column highlight now a soft ink tint rather than a terracotta glow.
- Reviews flipped to limestone; rotated review cards now ink-on-ivory, which keeps the field-notes / paper-card metaphor stronger.
- Manifesto-glitch animation still uses `var(--cenote)` in the text-shadow — kept (the deliberate flash on dark would have been wasted; now happens against limestone where the teal can briefly show through).

### 4. Cormorant italic display weight bumped (MAJOR)
- Updated Google Fonts import to include `0,500;1,500` (Cormorant 500 italic).
- `.exhibit-title-line--ital` → font-weight 500 (was 300). Solid stems at 14rem.
- `.the-space-heading` → font-weight 500 (was 300).
- `.artist-name` → 500 italic (was 400).
- Body italic that lives at smaller sizes (`.exhibit-statement p em`, `.exhibit-foot-block strong`, `.plate-title em`, `.review-text`) kept at 400 — they were never the problem.

### 5. Exhibition title now out-ranks rooms (MAJOR)
- `.room-name` clamp shrunk: `clamp(3rem, 11vw, 12rem)` → `clamp(2.2rem, 7vw, 7rem)`. The Roman numeral (`№ I` etc.) plus the smaller name carries the catalog-entry hierarchy.
- `.exhibit-title` clamp bumped: `clamp(3.6rem, 13vw, 14rem)` → `clamp(5rem, 17vw, 19rem)`. Line-height tightened to 0.82.
- Now ~2.7x larger than rooms at desktop. Clear tier separation.

### 6. Inter ↔ Cormorant italic fused (MAJOR)
- `.exhibit-title-line--ital` rewritten: `font-size: 0.6em` (relative to parent — was independent clamp), `margin-top: -0.28em` (overlaps the descenders of "JARDÍN"), `padding-left: 1.6em` (tucks the italic in like a parasitic coda), `font-weight: 500`, **color flipped from terracotta to limestone at 78% opacity**.
- Net effect: "interior" reads as a Cormorant whisper continuing "EL JARDÍN" — same composition, two voices. Terracotta no longer interrupts the monochrome typography move.

### 7. Manifesto line 6 flipped to whisper (MAJOR)
- New `.manifesto-line--whisper` modifier on line 6 ("whisper, don't shout."):
  - Family swapped to Cormorant 400 italic, lowercase (text now reads `whisper, don't shout.`).
  - Size dropped to `clamp(1.4rem, 4vw, 3.4rem)` (was the same Inter 800 condensed scale as the other lines).
  - Color ink at 55% opacity, hairline border-left in soft ink.
  - JS exempts the whisper line from the glitch animation — quiet line stays quiet.
- Line 3 ("NO COMPROMISE.") retains its terracotta accent — it's the only manifesto color flip now. The declarative line earns terracotta; the whispered line earns its register shift.

### 8. Floorplan reframed and content-corrected (MAJOR)
- Label changed from `— SCHEMATIC / GROUND FLOOR INSTALLATION MAP` to `— INSTALLATION INDEX / BY LOCATION`. No more "ground floor" claim.
- Suite IV (Penthouse) cell relabeled: `SUITE № IV — PENTHOUSE`.
- Penthouse cell visually severed from the ground-level plan: occupies its own row across all 12 columns with a stronger top border (`border-top: 2px solid rgba(242,236,224,0.55)`) and an inset `UPPER FLOOR` tag in cenote teal. Visually reads as "the upper floor, accessed via this stairwell."
- Schematic gets actual walls: outer border bumped to `2px solid`, every `.fp` cell gets 2px border-right/bottom rather than the previous 1px gap-as-pseudo-line. Right/bottom edges of perimeter cells override their borders to none so the outer wall doesn't double-thicken.
- North arrow added: `N ↑` in cenote teal, top-right of the schematic (`::before` pseudo-element).
- Courtyard styled as the central void: tinted limestone, centered tag, cenote-colored letter — the heart of the house reads as the heart.

### 9. Cenote deployed (MAJOR)
- Cenote now used in three deliberate places:
  1. `.exhibit-eyebrow` ("CURRENT EXHIBITION · VOL. III") — terracotta replaced with cenote. The exhibition's first signal is now the Mérida ground note.
  2. Floorplan `N ↑` compass arrow + `UPPER FLOOR` tag + courtyard letter tag.
  3. `.footer-newsletter-row:focus-within` border — when the user clicks into the newsletter input, the underline shifts to cenote. A tiny owned moment at the bottom of the page.
- Cenote glitch in manifesto kept (the existing 200ms use is now joined by stable sightings).

### 10. Data cells: noise stripped (MAJOR)
- Removed all `.data-cell-bg` background-image elements from the HTML.
- Removed from CSS: `backdrop-filter: blur(8px)` (the smuggled glass-morphism), inset terracotta box-shadow, image fade-in, hover background overlay on the `<span>`.
- Cells now: clean limestone card, mono caption legible from rest, hover highlights row+column via JS only with a soft ink tint.
- Redundant facts cut. The 9 cells are now 9 different things:
  - ROOMS: FIFTEEN
  - BUILT: c. 1908
  - **ARCHITECT: SALAZAR & CO.** (new — restoration architect)
  - **OWNER-OCCUPIED — RAMÍREZ FAMILY, SINCE 2019** (new — ownership)
  - MATERIAL: LIMESTONE
  - COURTYARDS: 01
  - FLOORPLATE: ~640 M²
  - **GUEST : STAFF — 1.5 : 1** (new — service ratio)
  - EXHIBITION: ACTIVE
- Dropped: COORDS, ELEV, NEIGHBORS — all already shown elsewhere (landing corners, footer stamp).

### 11. Menu focus trap implemented (MAJOR)
- On menu open: stores `document.activeElement` as `lastFocused`, applies `inert` to every direct child of `body` except the menu overlay, focuses the close button.
- On menu close: removes `inert` from siblings, returns focus to `lastFocused`.
- `Tab`/`Shift+Tab` cycles within the overlay focusables (close button + 8 anchor links).
- `Escape` closes the overlay even when focus has moved within it.
- `aria-modal="true"` is now a true statement, not a claim.

### 12. Terracotta pruned (MAJOR)
- Terracotta reserved for ~7 roles:
  1. Section label exhibit variant text (`.section-label--exhibit`)
  2. Exhibition floor-rule decorative gradient (`.exhibition::before`)
  3. Manifesto line 3 (the declarative accent — only line)
  4. Curatorial/sub-labels in the exhibition section: `.exhibit-statement-label`, `.exhibit-roster-label`, `.floorplan-label`, `.plate-num`
  5. `.exhibit-statement p em` — the typographic emphasis inside the curatorial statement
  6. `.exhibit-cta` button background
  7. `.room-num` / `.byline-rule` on landing — the catalog-numeral apparatus
- Pulled from everywhere else: focus outline (now ink on light / limestone on dark for 3:1+ contrast), section-label underline (now ink), counter-number color (now ink — the size is the gesture), counter-line, exhibit-eyebrow (now cenote), exhibit-dates-val (now limestone), exhibit-foot-label (now limestone-faded), experiences-intro-label, exp-num, exp-from rule + text (now ink), offer-row borders, offer-tag, space-gallery-tag border, space-coords, space-address-stamp, footer-label, footer-stamp, footer-newsletter button hover (now limestone), data-cell hover glow, room-cta hover background (now ink), room-version, ::selection.
- Where terracotta used to do duty as "emphasis," weight + size + opacity now do.

---

## Applied — MINOR / NIT

### 13. Em-dash labeling convention enforced
- Internal sub-labels (level 2) consistently begin with `— ` (em-dash + space):
  - `— CURATORIAL STATEMENT`
  - `— ARTISTS IN ROTATION / VOL. III`
  - `— INSTALLATION INDEX / BY LOCATION` (changed from `— SCHEMATIC / ...`)
  - `— CURATED MÉRIDA`
  - `— PARTNERS`, `— PROGRAM`, `— CATALOG` (added dashes)
  - `— RESERVE`, `— CONTACT`, `— INDEX`, `— DISPATCHES, QUARTERLY`
- Top-level section labels (`01 / MANIFIESTO ...`, `02 / ESPECIFICACIONES ...`, etc.) stay no-dash.
- Catalog-numeral / figure tags (`PLATE 01`, `FIG. 01 — COURTYARD`) stay no-dash — they're indices, not labels.

### 14. Reviews: stars replaced with ledger stamps
- Removed five U+2605 BLACK STAR characters from all 5 `.review-card`s.
- Each card now opens with a `.review-stamp` element: `№ 041 · 12 MAR 2026` etc. — mono, micro tier, with a 36px ink hairline trailing.
- Reads as field-notes-from-a-guest-ledger, matches the heading.
- Screen reader now hears a date stamp instead of "black star black star black star black star black star."

### 15. Counter row regularized
- `2023` now renders at the full counter-number scale, not half. CSS: `.counter-number--small { font-size: clamp(3.5rem, 10vw, 9rem); }` — same as full.
- The `--wide` cell still spans 4 columns (vs 2) on the 12-col grid, so 2023 has room to breathe at its full size without crowding neighbors.
- `CERO` remains the only deliberate irregularity in the row — the lexical zero gag now lands clean.

### 16. Manifesto coda flipped to italic
- `.manifesto-coda p` → `font-style: italic`. Convention "italic Cormorant = the human/curatorial voice" now holds at the most voice-y paragraph on the page.

### 17. Mobile fixes
- Penthouse name re-broken: `PENT-<br>HOUSE<br>SUITE` → `PENTHOUSE<br>SUITE`. No more `PENT-` orphan line on mobile.
- Plate grid at mobile (`<=768px`): switched from 1-col stack to **2-col mosaic** with plate 01 and plate 06 spanning both columns. Catalog feel survives.
- Floorplan at `<=1024px`: courtyard preserved as a full-width central block (spans all 6 columns of mid-breakpoint), so the central-void gesture survives the breakpoint. Penthouse stays as full-width upper-floor row.
- Room name at `<=480px`: clamp lowered to `clamp(2rem, 8vw, 4.4rem)` so 3-line stacks ("DELUXE / BOUTIQUE / ROOM") read cleanly.

### 18. Other small fixes
- `::selection` color flipped from terracotta to ink — selection is workhorse, terracotta is reserved.
- `.skip-link` background flipped from terracotta to ink — same reasoning.
- `.menu-num` color flipped from terracotta to limestone-faded — terracotta in the menu overlay was decoration, not signal.
- Exhibit title h2 gets `aria-label="El Jardín interior"` so screen readers read the title as one phrase, with the two visual spans marked `aria-hidden`.
- `[inert]` styled with `pointer-events: none; user-select: none` for older-browser safety.

---

## Skipped (with reason)

- **Finding 15 — "PENT-HOUSE" hyphenated mobile**: applied the rename (PENTHOUSE/SUITE on two lines, no hyphen) — listed under applied, not skipped.
- **Star aria-label alternative**: critique suggested either (a) replace stars or (b) keep stars with sr-only + aria-hidden. Chose (a). The star convention is wrong for the catalog framing, not just an accessibility paper-cut.

No findings were skipped on disagreement grounds.

---

## What changed vs. what didn't

**Preserved (as required):**
- Cursor coord readout (now visually limestone-toned, no terracotta border).
- Landing grid lines (thirds rule on landing only — the canonical 12-col handles document-wide alignment).
- Manifesto structure (6 lines, but line 6 is now register-shifted, not just same-tier accented).
- Counter animations (numbers count up, lines draw, `counted` background glow — all kept).
- ASCII-style floorplan concept (now closer to a real schematic with walls + compass).
- Exhibit catalog structure (eyebrow, title, dates, credit, statement, roster, plates, index, foot).
- Nav, scroll-triggered reveals, data-cell hover (highlight only, no other effects).
- Plate caption typography stack (kept — flagged as "what's working" in critique).
- Artist roster italic + mono apparatus (kept — flagged as "what's working").
- Landing letter mousemove + scroll dispersion (kept — flagged as "what's working").
- Cursor crosshair on landing + data grid (kept — flagged as "what's working").

**Not modified (Round 2 territory):**
- All narrative copy.
- The 4-room collection structure.
- The number/identity of exhibition plates.
- The 4 experiences and 2 offer rows.
