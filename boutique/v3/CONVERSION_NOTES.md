# V3 Brutalist — Conversion Polish Notes

Owner flag addressed: *"you can't even see which rooms and what prices you are booking."*

## What changed

Five conversion-critical additions, all translated into the brutalist mono/data-row register — no new sections, no new vocabulary, no icons.

### 1. Booking strip under the hero (`#booking`)
- 12-col grid, four 3-col cells: `ARRIVAL → [date] | DEPARTURE → [date] | GUESTS → [stepper] | [ ENTER → ]`
- Cell labels use `--mono-micro-size`, values use `--mono-data-size` — same 3-tier system as the rest of the page.
- Hairlines (`var(--line-on-limestone)`) between cells. NO rounded corners. NO shadows. NO icons.
- 4th cell is full terracotta, snap hover flips to `--ink`.
- Reveal: `brutalist-snap` class on each cell — 80ms hard-cut + 40ms stagger across the 4 cells, driven by the existing IntersectionObserver in `main.js` which sets `--i` per group.
- Lives inside `<main>`, immediately after `</section>` of the hero, before the rooms section-label. The "hero coordinate readout / above the manifesto strip" slot from the brief.
- Mobile: collapses to 2x2 at `<=1024px`, full stack at `<=768px`. Inputs are ≥44px tall.
- `scroll-margin-top: 72px` so the fixed nav doesn't overlap the strip on anchor jumps.

### 2. Price stamp per room card
- Top-right of each `.room-header`, absolutely positioned.
- Three spans in the mono data tier: `$295` (terracotta, data) · `/ NT` (meta) · `— FROM` (micro).
- 1px ink border, limestone fill — reads as a stamp, not a chip.
- Marked `data-placeholder="true"` + HTML comment `<!-- placeholder pricing; replace with real rates -->` on every instance for owner find-and-replace.
- Rates per brief:
  - № I  Deluxe Boutique Room — **$295**
  - № II Deluxe Boutique Suite — **$395**
  - № III Grand Boutique Suite — **$545**
  - № IV Penthouse Suite — **$895**
- On mobile, falls into the header flow (`position: static`) so it doesn't overlap the room name.
- `.room-name` got `padding-right: clamp(0, 12vw, 200px)` to keep the stamp's reserved gutter at all desktop widths.

### 3. Explicit specs row per room card
- New `.room-specs-row` between `.room-version` and `.room-image-wrap`.
- Mono micro tier, prefixed with a terracotta `>` to echo the catalog-entry prompt language.
- Per brief format: `OCC.2 / 32M² / VIEW.GARDEN`
  - № I:   `OCC.2 / 32M² / VIEW.GARDEN`
  - № II:  `OCC.4 / 48M² / VIEW.COURTYARD`
  - № III: `OCC.6 / 72M² / VIEW.COURTYARD+GARDEN`
  - № IV:  `OCC.6 / 95M² / VIEW.PRIVATE-TERRACE`
- Marked `data-placeholder="true"` + HTML comment so the owner can replace with real specs.
- Existing 4-cell `.room-specs` grid retained — the new row is a tight summary scan-line; the grid below is the full data table.

### 4. Room CTA prefill (`data-room`, `data-room-guests`)
- Each room's `ENTER →` button now `href="#booking"` (no longer opens boutiquebythemuseo.com) with `data-room="Deluxe Boutique Suite"` and `data-room-guests="4"`.
- JS listener on `[data-room]` populates a hidden `data-role="room"` field inside the widget and bumps guest count up to the room's capacity (never down — respects user-set count).
- Existing anchor handler in `main.js` then scrolls to `#booking` with `behavior: 'auto'` — keeps the V3 staccato motion fingerprint (no smooth slide).
- Widget gets a `.booking-strip--prefilled` class for 600ms: a single cenote-tinted flash animation (`steps(2)`, no fade) to acknowledge the prefill without breaking snap.

### 5. Nav, offers, footer all funnel to `#booking`
- Sticky `RESERVE →` in the nav now points at `#booking` (was `#rooms`).
- Both offer CTAs (`ENTER ALLOCATION →`, `TAKE THE RATE →`) and the footer `ENTER & RESERVE →` redirect to `#booking`. Consolidated reservation funnel; no off-site jumps from those positions.
- Per-room and art-collab CTAs that remain on the page are the brutalist-snap blocks already in V3.

## Date logic (ported from V4 `main.js`)
- `arrival.min` = today, defaults to tomorrow
- `departure.min` = tomorrow, defaults to arrival + 3 nights
- On `arrival` change: `departure.min` auto-shifts to arrival + 1; if departure ≤ arrival, departure jumps forward.
- Guest stepper clamps to [1, 9]. Stepper input is `readonly` to keep behavior deterministic (no fractional / paste-bombs).
- Submit shows a 2.2s `is-checking` micro-state in cenote teal — preview confirmation `"[ DELUXE BOUTIQUE SUITE · 2026-05-14 → 2026-05-17 · 4"`. Wraps in the existing label spans so the bracket character stays in place.

## What was preserved
- `.brutalist-snap` motion (80ms hard-cut + 40ms stagger) — booking cells inherit.
- Mono 3-tier system (micro / meta / data) — every new label is mapped to one of the three.
- 12-col grid — booking strip uses the same column system as `.location-grid` and the room specs.
- Terracotta restraint — only the CTA cell + price amount + `>` prefix use terracotta. Everything else stays ink-on-limestone.
- Cenote teal — used only for the prefill flash and the post-submit micro-state, matching its existing use as the location coords accent.
- Crosshair cursor + coord readout — untouched. Booking inputs also get `cursor: crosshair` to stay in voice.
- NO icons added. No Lucide, no SVG. Date inputs use the native picker indicator (browser-native, treated as a system glyph not a vocabulary icon).
- NO smooth transitions on hover — every interactive state is a hard flip with `transition: none`.
- R3 a11y / focus trap untouched. Booking elements have `aria-label`, the guests group has `role="group"` + `aria-labelledby`, focus-visible outlines match the rest of the page (2px ink, 2px limestone over dark).
- No new sections added. Widget lives in the gap between hero and rooms; price + specs live inside existing `.room-header` and a new sibling row inside each `.room-block`.

## Files touched
- `boutique/v3/index.html` — 285 → 342 lines
- `boutique/v3/css/style.css` — +~190 lines (booking strip, price stamp, specs row, responsive)
- `boutique/v3/js/main.js` — +~95 lines (date logic, stepper, submit, prefill, vibrate hook)

## 5-second test (per brief)
1. **What rooms can I book?** 4 named room blocks, each visible above the fold within `#rooms`.
2. **What does each cost?** Top-right price stamp on every room header.
3. **How big / who fits?** Mono specs row immediately under the catalog-entry line.
4. **How do I book?** Booking strip directly under the hero, sticky `RESERVE →` in the nav, per-room `ENTER →` jumps with prefill.

## Owner find-and-replace anchors
- Pricing: search `data-placeholder="true"` inside `.room-price-stamp` (4 instances).
- Specs: search `data-placeholder="true"` inside `.room-specs-row` (4 instances).
- HTML comments above each: `placeholder pricing; replace with real rates` / `placeholder specs; replace with real specs`.
