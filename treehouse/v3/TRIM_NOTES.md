# Treehouse V3 — Trim + De-fictionalize Notes

## Line delta

| File           | Before | After | Δ      |
|----------------|--------|-------|--------|
| `index.html`   | 940    | 317   | −623   |
| `css/style.css`| 2800   | 1135  | −1665  |
| `js/main.js`   | 486    | 195   | −291   |
| **Total**      | 4226   | 1647  | −2579  |

HTML lands inside the brief's 300–400 line target.

## Final section list (6)

1. **Hero / Landing** — "TREE / HOUSE" wordmark, coords, byline (Adults Only · 15 Rooms · Santa Ana, Mérida), positioning line ("Colonial charm meets contemporary comfort"), Reserve CTA, **Michelin Key accolade strip** as a small mono stamp + key image in the hero corner (per brief: "small data-strip in or near hero. NOT a dedicated full section").
2. **Rooms** — 4 placeholder categories (King Garden Room, Queen Courtyard Suite, King Garden Suite, Penthouse Canopy), each with image, 4-cell spec row, and a Reserve CTA. Pricing replaced with "PRICE ON REQUEST" since no public prices are known.
3. **Art Collaboration** — Treehouse × SoHo Galleries. One short statement that Tree House is the namesake venue, plus the 3 on-property art photos as the only imagery (per brief).
4. **Location** — 3-column data block: address (Calle 43 × 58 y 60, #489), nearby anchors (Parque Santa Ana, Paseo de Montejo, Centro Histórico), hours.
5. **Offers** — single offer: 5+ nights = 30% off. Brutalist stamp treatment.
6. **Footer** — logo, Reserve CTA, contact, sister-property link to Boutique by The Museo, index, Travellers' Choice award badge, mono stamp with Michelin Key callout.

## Sections cut entirely

- **Landing dark intro overlay** (no equivalent existed but per motion brief: page appears immediately)
- **Manifesto** (6 declarative lines)
- **Manifesto strip** (auto-marquee with photos)
- **Data Grid** (9 cells of fake hotel data: "built c.1907", "640 m² canopy", "42 species", "L. Cetina gardener", etc.)
- **Michelin section** as a standalone section (replaced by small in-hero accolade strip per brief)
- **Exhibition / Cycle N° III / Vol. III / El dosel verde** (all fabricated)
- **Curatorial statement + S. Ramírez & J. Casares sign-off**
- **Artist roster: Maza, Pech, Quiñones, Solís & Caamal, Verástegui, Aké, Cetina**
- **6 plates with title / medium / dimensions / edition / installed-location captions**
- **Floorplan / installation index**
- **Arboretum** (42-species herbarium with fake Latin taxonomy and brass-tag conceit)
- **Journal / Field Dispatches** (now a single footer link to `/journal`)
- **Experiences / Curated Mérida** (4 program cards)
- **Field Notes / Reviews** (5 attributed guest pull-quotes — wrong register for Michelin tier anyway)
- **Counters** (15 / 0 / 42 / 2019)
- **The Space / Interiors gallery** (8-frame editorial)
- **Manifesto-strip marquee, noise flash, data-cell row/col highlight subsystem**
- **Newsletter dispatch form** (out of register for a luxury hotel homepage)

## Kill-list de-fictionalization

Deleted every mention of:

- Painters / artists: Paloma Cetina, Lourdes Maza, Renato Pech, Aurora Quiñones, D. Solís & M. Caamal, Inés Verástegui, Tomás Aké
- Gardener "L. Cetina" / "Don Eulogio"
- Curators "S. Ramírez" & "J. Casares"
- Breakfast chef "E. Canché"
- All initials-attributed guest reviewers (M.H., L. & R., A.K., J.P., C.D.)
- Critic / inspector anecdotes ("inspector arrived on a Tuesday in the off-season…")
- "Small red sun over the front desk"
- "Cycle N° III" / "Vol. III" / "El dosel verde" / "El jardín interior"
- "Forty-two species" / "42 species"
- "640 m² canopy coverage"
- "Built c.1907 / restored 2019"
- "Three courtyards" specific count
- "70+ años bajo el mismo dosel"
- Plate Nos. with title / medium / edition / install location
- Maya botanical names attributed to invented plates
- All fake addresses for SoHo Galleries
- All fake artist bios with birth years and cities
- Fake exhibition opening / closing dates (15 MAY 2026 → 14 SEP 2026)
- Fake catalog ("Vol. III — El dosel verde / ships with checkout / Edition of 300")

## Kept / truthful facts

- "Tree House Boutique Hotel" name
- 15 rooms (one mention each in byline + menu meta — replaces the earlier "FIFTEEN ROOMS" manifesto refrain)
- Adults-only
- "Colonial charm meets contemporary comfort" (lifted verbatim from live site, used as the hero tagline)
- First Michelin Key in Mérida (small accolade strip in hero)
- Travellers' Choice award (badge image in footer awards row)
- Santa Ana neighborhood
- Address: Calle 43 × 58 y 60, #489, Mérida, Yucatán 97000
- 5+ nights = 30% off (offers section)
- Sister property to Boutique by The Museo (footer link)
- Treehouse × SoHo Galleries — one short statement that Tree House is the namesake venue, no specifics
- Coords (20.9704° N, 89.6260° W) — public address-derived, kept in hero TR corner and footer stamp
- 4 room category placeholder names (King Garden Room, Queen Courtyard Suite, King Garden Suite, Penthouse Canopy)

## Motion fingerprint — V3 Brutalist Snap/Staccato

Applied per the brief's motion section, gated on `prefers-reduced-motion: no-preference`:

- **Scroll reveals (`.brutalist-snap`)** — `transform: translateY(8px → 0)` + `opacity: 0 → 1` in **80ms linear** (essentially a hard cut, no fade). The IntersectionObserver staggers entering siblings **40ms** apart — staccato cascade, not a smooth blur.
- **Hero entry** — wordmark letters appear one-by-one with **35ms per-letter** delay (typewriter-fast); each letter snaps on with no transition. After all letters land, the **coordinate readout (TR corner) flickers in** with 3 opacity flashes over 200ms via the `coord-flicker` keyframe before settling.
- **Hover** — terracotta block-highlight flips **instantly** on CTAs (`nav-cta`, `room-cta`, `offers-cta`, `landing-cta`, `footer-cta`, `nav-menu-btn`). No transition on background / color / border-color.
- **Page intro overlay** — deleted entirely. Page appears immediately.
- **Cursor** — crosshair coordinate readout preserved (`.cursor-readout`, `cursor: crosshair` on `.landing`). No follow ring, no glow.
- **Reduced motion** — all reveal classes become `opacity: 1; transform: none;` instantly; `.flicker` animation suppressed.

The motion is **legible within the first viewport**: the wordmark snaps in letter-by-letter and the coord readout flickers, so the brutalist character announces itself before the user scrolls.

## CTA language

Collapsed to **"Reserve"** (luxury register, per brief). Replaced R2-era `GATHER / TEND / DISPATCH` family across the board — every room CTA, the hero CTA, the offer CTA, the footer CTA, and the sticky nav CTA all read "Reserve".

## Preserved

- `<main>` + skip link + `lang="es-MX"` islands of Spanish + a11y from R3
- All `../assets/` photo refs (no Unsplash anywhere — confirmed by grep)
- Menu focus trap (Esc + Tab cycling within overlay, inert siblings, last-focused restore)
- Mono microcopy 3-tier system (`--mono-micro-size` / `--mono-meta-size` / `--mono-data-size`)
- 12-col grid (applied to rooms specs, art-collab, location, offers, footer)
- Cenote teal (`--cenote: #1f5e64`) — deployed in location-list-meta (distance stamps)
- Terracotta carving (`--terracotta: #b85a3a`) — deployed in hero Michelin year, art-collab eyebrow + title-em, all CTA hover flips, offers stamp number, footer stamp key, footer CTA
- No glassmorphism (no backdrop-filter anywhere)
- Variant-specific reveal class: `.brutalist-snap` (not shared with V1/V2)

## What still links externally

- Reserve CTAs → `https://treehouseboutiquehotel.com` (live booking)
- Sister property → `../../boutique/v3/index.html` (local mirror)
- Journal → `/journal` (placeholder, per brief)
- Travellers' Choice + Michelin Key badge images → live treehouseboutiquehotel.com CDN (real award assets)
