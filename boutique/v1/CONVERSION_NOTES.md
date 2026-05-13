# V1 Cinematic Immersive — Conversion Polish Notes

Scope: add booking widget, room pricing, room specs, and prefill-on-CTA to the
V1 Cinematic variant per `/CONVERSION_POLISH.md`, while preserving the variant's
Sustained motion fingerprint, dark cinematic palette, custom cursor, and intro
overlay.

---

## Files touched

| File | Before | After | Δ |
|---|---:|---:|---:|
| `index.html` | 310 | 368 | +58 |
| `css/style.css` | 1257 | 1453 | +196 |
| `js/main.js` | 256 | 350 | +94 |

No new sections were added. No Lucide icons were introduced. R3 accessibility
work (skip-link, `<main>`, `lang="es-MX"`, focus-visible outlines) is intact.

---

## 1. Hero booking widget — "brass plate"

A translucent ivory card placed inside the hero, between `.hero-cta` and
`.hero-meta`. Reads as a brass reservation plate sitting on the cinematic
darkness.

### Structure

```html
<form class="booking-plate cinematic-rise" id="booking" data-rise-delay="1.9s">
  <span class="booking-plate__eyebrow">Reservations · Direct</span>
  <div class="booking-plate__row">
    Arrival · | · Departure · | · Guests · Reserve
  </div>
</form>
```

- `id="booking"` — the canonical jump-target. Header Reserve CTA, hero Check
  Availability CTA, offer-section CTA, and all per-room Reserve CTAs all point
  here.
- 3 inputs: arrival date, departure date, guests select (1–6).
- Hidden `room` field gets populated by per-room Reserve CTAs (see §4).
- Vertical ochre hairlines (`.booking-plate__rule`) divide the three fields on
  desktop. They collapse on mobile (`max-width: 900px`), where the row stacks.

### Visual register

- Background: `rgba(250, 246, 238, 0.94)` (translucent ivory)
- Border: 1px solid `var(--ochre)` — single ochre hairline (per brief)
- Corners: 8px (per brief)
- Box shadow: layered — inner 1px ochre lip + 18px/48px ink drop-shadow for
  the brass-plate-resting-on-velvet feel
- Field labels: tiny uppercase Inter at `0.58rem` / `ls-wide` — matches the
  hero-eyebrow / `.label` register
- Date + select values: **Cormorant serif at 1.05rem** — picks up the
  variant's italic serif body face. (Choice: tried small-caps Inter; the
  Cormorant pulls the widget into the cinematic register and reads as a
  hand-set reservation plate rather than a generic form.)
- Submit button: solid ochre block, ink text, `cinematic-rise` hover (scale
  1.025 + 28px ochre glow) — matches `.hero-cta a:hover` exactly.

### Motion

- Class `.cinematic-rise` reveals the widget on scroll-in.
- `data-rise-delay="1.9s"` — explicit override consumed by the existing
  `cinematic-rise` JS observer. Lands the widget **after** the hero CTAs
  finish their keyframe (which completes at ~1.75s + 1.2s duration). The
  widget feels like the closing beat of the hero rather than a 4th equal
  element.
- The JS observer now honors `data-rise-delay` before applying its 180ms
  sibling stagger.

### Accessibility

- `<form aria-label="Check availability">`
- Each input has both a visible `<span class="booking-field__label">` and an
  `aria-label`.
- Submit min-height 44px, ochre `focus-visible` outline (inherited from the
  global rule), keyboard-only users land on `arrival` after a room-CTA prefill
  (focus moves after the smooth-scroll settles).

---

## 2. Pricing — visible on every room card

Each of the four `.room-card`s now has a `.room-price` element above the
hover-revealed CTA. Pricing stays visible without hover so a visitor can
answer "what does this cost" in <5 seconds.

```html
<p class="room-price">
  From <strong class="room-price__amount" data-placeholder="true">$295</strong>
  <span class="room-price__unit">/ night</span>
</p>
```

- The dollar amount is **DM Serif Display, ochre, 1.45rem** — matching the
  variant's display family.
- "From" prefix + "/ night" suffix: tight Inter caps in `--fg-dim` — quiet
  enough not to compete with the room name.
- `data-placeholder="true"` is set on every `.room-price__amount`.
- Each card is preceded by an HTML comment `<!-- placeholder pricing; replace
  with real rates -->` so the owner can find-and-replace.

### Placeholder rates (from brief)

| Room | Rate |
|---|---:|
| Deluxe Boutique Room | $295 |
| Deluxe Boutique Suite | $395 |
| Grand Boutique Suite | $545 |
| Penthouse Suite | $895 |

---

## 3. Specs — visible on every room card

A 3-cell small-caps row sits below the price. No icons (V1 vocabulary).

```html
<ul class="room-specs" data-placeholder="true">
  <li>Sleeps 2</li>
  <li>32 m²</li>
  <li>Garden view</li>
</ul>
```

- `<ul>` with `aria-label="Room specifications"` and `list-style: none`.
- Items are separated by an ochre `·` pseudo-divider (mirrors the
  `.hero-meta__divider` and `.logo__amp` ornamentation).
- Inter small-caps `0.6rem` / `ls-tight`, ivory at 78% opacity — quiet enough
  to read as caption.
- `data-placeholder="true"` on the container.

### Specs by room (from brief)

| Room | Sleeps | m² | View |
|---|:-:|:-:|---|
| Deluxe Boutique Room | 2 | 32 | Garden view |
| Deluxe Boutique Suite | 4 | 48 | Courtyard view |
| Grand Boutique Suite | 6 | 72 | Courtyard + garden |
| Penthouse Suite | 6 | 95 | Private terrace |

---

## 4. Room CTA prefill behavior

Each per-card Reserve link is now:

```html
<a href="#booking"
   class="room-reserve"
   data-room="deluxe-room"
   data-max-guests="2">Reserve this room →</a>
```

On click (handler in `js/main.js`):

1. `preventDefault()` — bypass the global anchor handler.
2. Set the hidden `room` field on the booking widget to the room key
   (`deluxe-room` / `deluxe-suite` / `grand-suite` / `penthouse-suite`).
3. **Bump guest count up to room max if current value is lower.** A visitor
   browsing as 2 guests who clicks the Grand Suite (sleeps 6) gets bumped to
   6 — the widget reflects what their pick supports. We never bump *down* —
   if they had 4 selected and click a Sleeps-2 room, we leave it.
4. Add `.is-prefilled` to the booking-plate for 1.4s → ochre ring + glow
   flashes the widget to confirm the prefill landed visually.
5. Smooth-scroll to the widget with 96px top offset (clears the sticky nav).
6. After scroll, move keyboard focus to the arrival input
   (`focus({ preventScroll: true })`).

Reduced-motion: scroll becomes `auto`, focus moves immediately.

The room key on the hidden field is the contract the eventual booking-engine
integration will read. The find-and-replace cost when the real engine is
wired in is one event handler.

---

## 5. Wider site adjustments

- **`.section-hero`** — switched from fixed `height: 100vh` to
  `min-height: 100vh` + `padding: 14vh 0 13vh`. The hero now grows to
  accommodate the booking plate without the meta strip colliding with the
  CTAs on shorter laptops.
- **Header Reserve nav-cta** — was `href="#offers"`, now `href="#booking"`.
- **Hero "Check Availability" magnetic-btn** — was `href="#offers"`, now
  `href="#booking"`.
- **Offers section "Reserve a room"** — was `mailto:`, now `href="#booking"`.
  The email-direct CTA below it is preserved for visitors who prefer email.

---

## 6. Visual decisions worth flagging

- **Date inputs use Cormorant italic body face.** Briefed alternative was
  small-caps Inter. Tried both — the Cormorant version reads as cinematic
  rather than chrome. It does mean the dates feel slightly less data-y;
  if the owner wants a more transactional read, swap
  `.booking-plate input[type="date"]` font-family to `'Inter', sans-serif`
  and add `letter-spacing: var(--ls-tight); text-transform: uppercase`.
- **Native date pickers.** Used `<input type="date">` for date-default
  parity with V4 — accepting the platform's native date UI as the trade-off
  for zero-dep correctness. The calendar-picker indicator gets a sepia
  tint to harmonize with the ochre palette.
- **Booking widget is the only ivory island.** The rest of V1 is ink-on-ink
  with ochre accents — the ivory plate creates a clear "actionable surface"
  contrast point in the hero. This is intentional: the widget should feel
  like the one place to act. If this reads as too much contrast in
  preview, drop the background to `rgba(250, 246, 238, 0.78)` for a more
  glass-tile read.
- **Custom cursor still catches the widget.** The existing
  `'a, button, .room-card, input, select'` cursor-hover query already covers
  every widget element — no JS change needed.
- **Reserve CTA stays hover-revealed** on the room cards (still hidden on
  idle desktop, visible on touch + on focus-within + on `.expanded`). The
  always-visible price + specs are what carry the "books in <5 seconds"
  load; the hover reveal preserves the cinematic restraint.
