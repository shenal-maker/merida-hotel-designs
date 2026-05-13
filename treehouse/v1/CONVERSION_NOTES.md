# Tree House V1 — Conversion polish notes

What changed, why, and how the variant character was protected.

## What was added

### 1. Hero booking widget — the "brass plate"
- `<form id="booking" class="hero-booking cinematic-rise">` lives inside `.hero-content`, immediately under `.hero-cta` and above the absolutely-positioned `.hero-accolade` / `.scroll-indicator`.
- Three inputs (Arrival · Departure · Guests) + a `Reserve →` button, plus a hidden `[data-role="room"]` field for prefill.
- Card visual:
  - Translucent ivory background — `rgba(247, 243, 235, 0.94)` — lifted opacity so it reads as a confident brass plate on the canopy-dark hero, not a ghosted overlay.
  - 8px corners, ochre hairline border (`--ochre-dim`), soft drop shadow into the canopy below it, plus a 1px ivory inset highlight along the top edge for the "brass" feel.
  - Labels: tiny uppercase Inter (`--label-sm`, `--ls-wide`), `--moss` ink — the variant's existing label register.
  - Inputs: Cormorant serif at 1.02rem in `--canopy-deep` — keeps the cinematic body face inside the widget.
  - Date picker indicator is colour-shifted to ochre via a CSS filter so it doesn't read as a default-browser blue.
  - Reserve button: solid ochre, picks up the same ochre-glow + 1.025 scale on hover as the hero's primary CTA. Same hover register as `.primary-cta` and `.magnetic-btn`.
- Leaf-glyph divider between inputs — re-uses the exact same SVG path as the wordmark and footer leaf. Tree House signature. Sits at 14×14px in `--leaf` at 0.55 opacity.
- The form itself carries `.cinematic-rise`, so it rises on the existing 1200ms cubic-bezier(0.16, 1, 0.3, 1) reveal — same fingerprint as the rest of the page.
- Sticky-header `Reserve` and hero `Reserve` both now target `#booking` (previously `#footer`).

### 2. Price per room card
Inserted between the room name and the existing summary.

| Room | Price |
|---|---|
| King Garden Room | `$325 / night` |
| Queen Courtyard Suite | `$425 / night` |
| Grand Foliage Suite | `$595 / night` |
| Penthouse Canopy | `$950 / night` |

- Markup: `<p class="room-price" data-placeholder="true">From <span class="room-price-num">$325</span> <span class="room-price-unit">/ night</span></p>`
- Visual: Inter caps for the framing words ("From", "/ night"), DM Serif Display for the dollar amount in `--ochre-warm` (the "leaf-bright / ochre" accent from the brief — ochre wins here because the dollar amount needs warmth, not green).
- Every `.room-price` is `data-placeholder="true"` and prefixed by an HTML comment so the owner can find-and-replace.

### 3. Specs per room card
Three-cell small-caps row underneath the price:

| Room | Specs |
|---|---|
| King Garden Room | Sleeps 2 · 32 m² · Garden view |
| Queen Courtyard Suite | Sleeps 4 · 48 m² · Courtyard view |
| Grand Foliage Suite | Sleeps 6 · 72 m² · Courtyard + garden |
| Penthouse Canopy | Sleeps 6 · 95 m² · Private terrace |

- Markup: `<p class="room-specs" data-placeholder="true">…</p>` with a `.room-specs-dot` separator coloured `--leaf-bright` at 0.75 opacity. Reads as a tiny botanical bullet — keeps the leaf motif active inside the card.
- Inter uppercase, `--ls-mid` letter-spacing, `--fg-faint` so it sits quieter than the title but louder than the summary italic.
- Flagged `data-placeholder="true"` per brief.

### 4. Room CTA prefill
Each room card's Reserve link now:
- Points at `#booking` (was `#footer`).
- Carries `data-room="<room name>"`.
- The smooth-scroll handler intercepts clicks, writes the value into the hidden `[data-role="room"]` field, swaps the submit-button label to `Reserve · <room> →`, and *then* scrolls to the booking widget. Reduced-motion users get a jump-scroll; everyone else gets the existing smooth scroll.

### 5. JS additions (one block)
Ported the V4 booking pattern into the existing IIFE:
- `arrival.min = today`, default = tomorrow.
- `departure.min = tomorrow`, default = arrival + 3 nights.
- `arrival.change` re-clamps `departure.min` and auto-shifts departure forward if it'd be ≤ arrival.
- `submit` is non-blocking: replaces the button label with a confirmation echo for 1.8s, surfaces the room if prefilled.

## What was protected

- **`.cinematic-rise` reveal**: the booking widget uses it — gets the 1200ms ease-out lift, 720ms delay through `:nth-child(5)` so it appears after the eyebrow / title / tagline / CTA cascade. No new motion vocabulary added.
- **Canopy + leaf + ochre palette**: every new element uses existing tokens (`--ochre`, `--ochre-warm`, `--moss`, `--canopy-deep`, `--leaf-bright`, `--ivory`). No new colours were introduced.
- **Custom cursor**: explicit `cursor: none` on all new interactive elements (form fields, divider, submit). `body.coarse-pointer` overrides restore native input cursors on touch so the form is still usable.
- **Cinematic intro + leaf-glyph motif**: untouched. Leaf glyph reused inside the booking widget as the field divider — strengthens the motif rather than diluting it.
- **No Lucide icons**: the V4 reference uses Lucide; this port deliberately drops them. The leaf SVG is the only iconography.
- **R3 a11y**:
  - Form has `aria-label="Check availability"`.
  - Every input has both a visible `.booking-label` (inside the `<label>`) and an `aria-label`.
  - Tap targets: submit is min-height 44px on desktop, 48px on mobile.
  - `:focus-visible` rules paint a 2px ochre outline on the inputs and 2px ivory on the submit — both meet contrast against their respective backgrounds.
  - Date inputs hide the default outline and re-paint a `:focus-visible` version so the focus state stays consistent with the rest of the page.
- **No new sections** and **no re-added Michelin Key section**: the widget lives inside the hero block; the accolade strip remains the only Michelin treatment.

## Layout decisions worth knowing
- The hero is `height: 100vh; min-height: 700px`, flex-centered. Adding the widget bumped content height ~100px. I gave `.hero-content` a `padding: 80px 5vw 160px` reservation so the flex-centered block has clear room above the absolutely-positioned accolade and scroll indicator.
- At ≤ 768px the booking widget stacks (column flex), the leaf dividers hide, and the hero gains `min-height: 820px` with `padding: 14vh 0 22vh` so nothing collides. Submit button stretches full-width at that breakpoint.
- At 769–900px the widget stays horizontal but the accolade strip already wraps vertically in the existing CSS — I increased `.hero-content` bottom padding to 220px to clear it.

## Five-second test (per the cross-variant minimum)
1. **What rooms can I book here?** Four named room cards, each visible above the rooms-section fold.
2. **What does each cost?** "From $XXX / night" lives directly under each room name in ochre Serif.
3. **How big / who fits?** Three-cell small-caps row right under the price.
4. **How do I book?** Booking widget in the hero, sticky-nav Reserve targets `#booking`, every room card's Reserve scrolls to the widget and prefills the room.
