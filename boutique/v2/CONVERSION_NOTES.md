# V2 Editorial — Conversion Polish Notes

Pass: add booking legibility (widget · price · specs · prefill) without
flattening the editorial register or breaking the page-turn motion fingerprint.

## What was added

### 1. Reservation card in the hero (`#booking`)
Paper-stock tear-out, placed inside the hero between the CTA row and the
hero image. Reads as a library checkout slip / boarding-pass card:

- Limestone (`--limestone`) paper background with a 1px ochre hairline
  frame (plus a faint inner inset rule for the paper-edge feel).
- Headline `Reservar · Reserve` in italic Cormorant Garamond.
- Corner flourish `Edición · MMXXVI` in italic Cormorant.
- Bilingual small-caps Inter labels: `Llegada · Arrival`, `Salida · Departure`,
  `Huéspedes · Guests`. The Spanish primary, the English in ochre, comma
  separated by a `·` — same bilingual rhythm V2 has already established
  in the meta row and section markers.
- Inputs sit on a single hairline rule (no boxes), Cormorant body face,
  inherit the editorial paper palette.
- Submit button uses the same overflow + L→R 1px ochre rule print
  vocabulary as `.hero-cta`, `.room-cta`, `.offer-cta`. Hover swap matches
  the hero-cta state (ink → ochre-deep background).
- Reveal: `.editorial-sweep` class — the same clip-path L→R reveal the
  rest of the page uses. Stagger picks it up automatically because it
  shares the hero section bucket.

Header `Reserve` CTA, hero `Reserve` CTA, and footer `Reserve` link all
now point at `#booking` (previously `#reserve`, which was the first
offer card).

### 2. Price + specs per room card
Inserted between `.room-name` and `.room-tasting` on all four cards:

- `.room-price` — italic Cormorant: `<em>From <span data-placeholder>$X</span> per night</em>`.
  The dollar amount is rendered upright and in ochre-deep so the price
  reads at a glance against the italic context.
- `.room-specs` — bilingual small-caps Inter caption in Spanish (the same
  register the location eyebrows use). `lang="es-MX"` applied. Marked
  `data-placeholder="true"` per brief.

Pricing (USD, all `data-placeholder="true"` + HTML comment):
- Deluxe Boutique Room — $295 — 2 huéspedes · 32 m² · vista al jardín
- Deluxe Boutique Suite — $395 — 4 huéspedes · 48 m² · vista al patio
- Grand Boutique Suite — $545 — 6 huéspedes · 72 m² · vista al patio y jardín
- The Penthouse — $895 — 6 huéspedes · 95 m² · terraza privada

### 3. Room CTA → prefill the widget
Each room CTA now carries `data-room` (room name) and `data-guests`
(occupancy). On click:

1. Hidden `input[data-role="room"]` inside the form is set to the room name.
2. `.reservation-card-room` `aria-live="polite"` field renders
   `For <strong>{Room name}</strong>` in italic Cormorant so the user can
   see the widget knows which room they came from.
3. The guests `<select>` is bumped to the largest option ≤ the room's
   capacity (clamped against the actual `<option>` set).
4. The existing smooth-scroll handler (already in `main.js`) carries the
   user to `#booking`.

Label is rendered inside the widget foot, next to the submit button.

### 4. Date defaults + min clamps
Ported the V4-minimal pattern verbatim, re-scoped to `.reservation-card`:

- Arrival defaults to tomorrow, `min` clamped to today.
- Departure defaults to arrival + 3 nights, `min` clamped to tomorrow.
- Changing arrival auto-shifts departure forward if it would otherwise
  fall on or before the new arrival.
- Submit is intercepted: button label flips to
  `Checking {arrival} → {departure} · {guests}` for 1.8s
  (portfolio build — real booking engine wiring is a back-end concern).

## Motion fingerprint — preserved

- The widget reveals via `.editorial-sweep` (clip-path L→R), so it inherits
  the existing 520ms curtain with 120ms intra-section stagger. No new
  motion vocabulary introduced.
- Submit button uses the same L→R hairline-print hover the other CTAs use.
- `prefers-reduced-motion: reduce` block already kills the clip-path
  transition globally; the widget inherits this.

## Constraints checked

- Light ivory editorial palette — only `--limestone`, `--ochre`,
  `--ochre-deep`, `--ink`, `--earth`, `--stone` used. No new colours.
- Native cursor — no custom cursor anywhere.
- No Lucide icons — labels and arrows are text characters (`→`, `·`).
- No new sections — widget lives inside the hero `<section>`; price/specs
  live inside existing `<article class="room-card">` blocks.
- Typography — only DM Serif Display, Cormorant Garamond, Inter. No new
  font request.
- R3 a11y:
  - Form has `aria-label="Reservation"`.
  - Each input/select has an associated `<label>` AND `aria-label`.
  - `lang="es-MX"` on every Spanish word/phrase, matching V2's pattern.
  - Focus-visible outlines preserved via the global rule, plus per-field
    bottom-border-darken on focus.
  - All interactive targets ≥44px on mobile (inputs use `min-height: 44px`,
    submit uses `min-height: 48px`).
  - `aria-live="polite"` on the room-label slot so screen readers
    announce which room was picked.
  - Empty `:empty::before { content: '\00a0'; }` keeps the label height
    stable so the widget doesn't jump when a room is selected.

## Owner replacement targets

Every placeholder is flagged `data-placeholder="true"` plus an HTML
comment (`<!-- placeholder pricing; replace with real rates -->`) on the
line above each price. To replace, search:

```
data-placeholder="true"
```

Eight matches total: four prices, four spec strings.

## Flags / open questions

- The submit handler is portfolio-grade (button label flip). When wired
  to a real booking engine, swap the `setTimeout` block for an
  appropriate POST/redirect.
- Hero is now taller on mobile because of the widget — verified the
  `.hero` `min-height: 100vh` rule still scrolls correctly. If owner
  wants the widget below-the-fold of the hero shot, reduce hero padding
  in the mobile breakpoint. Currently kept the existing padding to
  preserve the editorial breathing room.
- The `Edición · MMXXVI` flourish is wired in but easy to cut — it's a
  single `.reservation-card-edition` span in the head row of the widget.
  Brief flagged it as optional. Kept in because it lands the
  "tear-out / paper-edition" register without crowding.
