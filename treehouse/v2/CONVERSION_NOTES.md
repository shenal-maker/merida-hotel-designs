# Conversion Polish — Treehouse V2 Editorial Magazine

Pass that adds booking clarity to the V2 variant without flattening its character. All character moves (clip-path sweep, ivory + moss + ochre, Cormorant Garamond serif, paper-grain overlay, hide-on-scroll masthead, draw-line rule, native cursor) are preserved.

## What shipped

1. **Reservation card** (`form.reservation-card#booking`) — a paper card with a 1px ochre hairline frame, sitting in the hero between the CTA row and the accolade strip. Reads as a library checkout slip / boarding pass.
   - Cormorant Garamond headline: `Reservar · Reserve` with italic moss accent on "Reserve" and an ochre middle-dot separator.
   - Italic Cormorant edition flourish in the corner — `Edición · MMXXVI` — `aria-hidden`, decorative only.
   - Three fields (Arrival / Departure / Guests) + Reserve submit. Bilingual small-caps labels (`Llegada · Arrival` / `Salida · Departure` / `Huéspedes · Guests`).
   - Hidden `data-role="room"` field so room-CTA prefills can be passed downstream.
   - Inherits the `editorial-sweep` clip-path reveal — the card sweeps in L→R with the rest of the hero deck, 120ms staggered with its siblings.

2. **Per-room price** — italic Cormorant, sitting above the room foot:
   `<em>From <span data-placeholder="true">$325</span> per night</em>`
   The dollar amount is `data-placeholder="true"` so the owner can find-and-replace.

3. **Per-room specs** — bilingual small-caps, `lang="es-MX"`, ochre-dot separators:
   `2 huéspedes · 32 m² · vista al jardín` (and the per-tier variants).
   The whole specs paragraph is `data-placeholder="true"` so guest counts / square meters / view labels can be swapped wholesale.

4. **Room-CTA prefill** — each room's Reserve link carries `data-room` and (for larger rooms) `data-guests`. Clicking it:
   - sets the hidden room field to the room name
   - bumps the Guests select up to match the room's capacity (defaults stay at 2 for the smallest room)
   - smooth-scrolls to `#booking`
   - focuses the Arrival input after the scroll completes (or immediately under reduced-motion).

5. **Date integrity** — ported from V4 minimal:
   - Arrival defaults to tomorrow, departure to arrival + 3 nights.
   - `min` clamps on both inputs.
   - Changing arrival past departure auto-shifts departure forward by one night.
   - Submit surfaces a non-blocking confirmation in the button label for 1.8s (portfolio build — no real booking engine).

6. **Anchor cleanup** — every Reserve link in the page (`masthead-nav-cta`, hero CTA, room CTAs, offer CTA, footer link) now points at `#booking`. The orphan `id="reserve"` on the offer CTA was removed (it linked to itself).

## Pricing applied (per CONVERSION_POLISH brief)

| Room | Was | Now (placeholder) | Specs (placeholder) |
|---|---|---|---|
| Garden Room | $285 | $325 | 2 huéspedes · 32 m² · vista al jardín |
| Courtyard Suite | $365 | $425 | 4 huéspedes · 48 m² · vista al patio |
| Garden Suite | $465 | $595 | 6 huéspedes · 72 m² · vista al patio y jardín |
| Penthouse Suite | $595 | $950 | 6 huéspedes · 95 m² · terraza privada |

Room names kept (no killed-copy revival, no rename to "King Garden / Queen Courtyard / Grand Foliage / Penthouse Canopy"). Brief's pricing template is applied tier-by-tier.

Every price `<span>` and every specs `<p>` carries `data-placeholder="true"` plus an HTML comment so the owner can locate and swap.

## Motion fingerprint kept

- Reservation card uses `editorial-sweep` clip-path reveal (520ms, cubic-bezier(0.45, 0, 0.15, 1)). Hero IO already staggers its children at 120ms — the card slots into that cadence.
- Reserve submit uses the same L→R 1px ochre underline-print hover as `.hero-cta` / `.offer-cta`.
- Reduced-motion: the global `editorial-sweep` reduced-motion rule already cancels the clip-path; submit confirmation and prefill scroll respect the `reduce` flag (instant scroll, immediate focus).

## A11y (R3 preserved)

- Form has `aria-labelledby` pointing at the card title (`h2#reservation-card-title`).
- Each input is wrapped in a `<label>` whose visible label uses bilingual small-caps; native input labels carry `aria-label` as backup.
- Date inputs honor `lang="es-MX"` parent context only where appropriate; `Arrival` / `Departure` / `Guests` carry `lang="en"` spans nested inside the Spanish label so screen readers don't pronounce English words in Spanish.
- All interactive targets meet ≥44px (input min-height 44px, submit min-height 48px, room-CTA pad already ≥44px).
- `focus-visible` 2px moss outline at 4px offset on inputs / select / submit, inherited from the global rule.
- The decorative `Edición · MMXXVI` is `aria-hidden`.
- Hidden room input uses `type="hidden"` (not a focusable empty input).

## Constraints honored

- No new sections (the card lives inside the existing hero).
- No Lucide / icon vocabulary added (V4 territory — kept out).
- No re-introduction of the Michelin section — accolade strip kept.
- No `Don Eulogio` / `Doña Marisol` revival.
- No native-cursor override.
- No `Book Now` — kept `Reserve` everywhere.
- No glass / blur / morphism.

## What the visitor can now answer in <5 seconds

1. **Rooms available?** Four rooms, each named on its card.
2. **Price?** "From $X per night" on every card, italic Cormorant.
3. **Size / fit?** Small-caps bilingual specs row on every card.
4. **How to book?** Card in the hero, sticky `Reserve` in the masthead, per-room `Reserve` jumps + prefills.
