# V2 Editorial Magazine — Trim Notes

## Line delta
| File         | Before | After | Δ    |
|--------------|-------:|------:|-----:|
| index.html   |    839 |   295 | −544 (−65%) |
| css/style.css |   2924 |  1103 | −1821 (−62%) |
| js/main.js   |    546 |   188 | −358 (−66%) |

## Final structure (6 sections)
1. **Hero** + Michelin Key accolade strip (Michelin Key + Travellers' Choice + sister-property note as a single inline strip; not a dedicated section)
2. **Rooms** — 4-card grid: Garden Room / Courtyard Suite / Garden Suite / Penthouse Suite, each with price-from and "Reserve" CTA
3. **Art Collaboration** — Treehouse × SoHo Galleries; one paragraph + 3 on-property art photos
4. **Visit / Location** — address + nearby anchors + arrival
5. **Offer** — 5+ nights = 30% off
6. **Footer** — brand, address, contact, browse, social

## What was cut
- Editor's Note section (the dated cuaderno entry with the ficus-branch anecdote)
- Sanctuary section
- Michelin as a dedicated section (collapsed to accolade strip in hero)
- El Estándar / 3 pillars (Privacidad / Botánica / Curaduría)
- El Diario / 4 journal cards (the named-character entries)
- Curated Mérida / Honeymoon / Cenotes / In-Suite Wellness / Estancia Larga (the Estancia Larga offer is now the Offer section)
- Voices / testimonials carousel
- Photo Essay interstitial (8 plates)
- Reading-progress spine
- Page counter (Roman numerals + section labels)
- Drop caps (all 4 — they were apparatus for sections that no longer exist)
- Plate numbering (Lám. I–XXII) and all caption apparatus
- Latin plant labels (Ficus benjamina, Bougainvillea spectabilis, etc.)
- "Edición Botánica No. 1" masthead framing
- Colophon-style footer (replaced by clean light footer)
- Newsletter signup form
- Treehouse pull-quote rotation JS
- Voices drag-scroll JS + momentum + scroll-progress
- All assets-external/ refs except `michelin-key.webp` (footer-logo.png removed; footer is now wordmark-only)

## De-fictionalization (kill list applied)
Every flagged person, stat, program, and quote is gone:
- People: Don Eulogio, Doña Marisol / Mari, Lic. Beatriz Cervera, Lourdes Pacheco-Torres, M. Ríos, A. Pacheco, C. & D. Whitfield, Ana Sofía Mendoza, "Lola" — all removed
- Stats: "-4°C", "seventy years", "23 Tillandsias", "2019 Campeche", "1955", "c.1898" — all removed
- Programs: "Edición Botánica No. 1", "Ciclo N° III", "Botánica de la Sombra", "Apuntes del cuaderno verde", "Cuaderno N° 01–04" — all removed
- Quotes: critic pull-quote, all 5 testimonials, "house ledger" quote, Condé Nast Hot List quote — all removed
- Apparatus: "MMXXV / MMXXVI" wherever it was decorative; "Lám. I–XXII"; "Pase la página"; "Edición No. 1" — all removed

## What was kept (truthful facts only)
- Tree House Boutique Hotel
- Adults-only
- 15 rooms
- "First Michelin Key in Mérida"
- Travellers' Choice
- Santa Ana, Calle 43 × 58 y 60, #489, Mérida 97000
- "Colonial charm meets contemporary comfort"
- "Lush greenery, naturally cool microclimate" (no temperature numbers)
- 5+ nights = 30% off
- Sister to Boutique by The Museo
- 4 room categories (placeholder names: Garden Room / Courtyard Suite / Garden Suite / Penthouse Suite)
- Treehouse × SoHo Galleries collaboration — one paragraph, no specifics

## Photos
All hero / rooms / art images route through `../assets/` (the property's own shoot):
- Hero: `hero-tree-courtyard.jpg`
- Rooms: `room-slat-headboard.jpg`, `room-balcony-doors.jpg`, `room-staggered-stick.jpg`, `room-limestone-skylight.jpg`
- Art (3-up): `art-window-painting.jpg`, `art-bar-figurines.jpg`, `art-chair-tableau.jpg`

Only `assets-external/michelin-key.webp` is retained as a non-property asset (it's the actual Michelin Key mark and belongs to the accolade strip).

No `unsplash.com` references in any of the three files (verified by grep).

## Motion applied — V2 Editorial Page-turn
Variant-specific class: **`.editorial-sweep`**

- **Scroll reveals:** `clip-path: inset(0 100% 0 0) → inset(0)` over **520ms** `cubic-bezier(0.45, 0, 0.15, 1)`. No opacity fade. **120ms stagger** between siblings within each section (each section gets its own IntersectionObserver so stagger doesn't accumulate across the page).
- **Hero entry:** text sweeps in via clip-path first; the hero image is overridden to use `opacity 0 → 1` with a **300ms delay + 400ms** cross-dissolve so it lands after the text settles. (The image element keeps `.editorial-sweep` so observer logic stays uniform; CSS overrides the clip-path for that element specifically.)
- **Hover — nav links + footer links:** underline draws L→R via `background-image` + `background-size: 0% → 100% 1px`, **280ms ease-out**.
- **Hover — CTAs (hero, room, offer):** a 1px ochre rule prints L→R along the bottom edge using a `::after` pseudo + `width: 0 → 100%`, **280ms ease-out**.
- **Page intro:** dropped the heavy intro overlay. `<main>` paper-stock fades in over **280ms** ease-out via CSS keyframe.
- **Cursor:** native only. (No custom cursor markup ever existed on V2; confirmed.)
- **Reduced motion:** under `prefers-reduced-motion: reduce` every `.editorial-sweep` immediately resolves to `clip-path: none; opacity: 1` and the page-intro keyframe is suppressed.

## Accessibility preserved
- `<main id="main">` retained, skip link retained
- `lang="es-MX"` retained on all Spanish phrases inline (barrio, Solo para Adultos, address fields, etc.)
- Focus trap + Esc + return-focus on mobile menu — kept verbatim from R3
- All CTAs have visible text (no icon-only buttons)
- `prefers-reduced-motion` gate is the global default; JS also reads it reactively
- Image alts kept descriptive (no decorative-only language for content imagery)
