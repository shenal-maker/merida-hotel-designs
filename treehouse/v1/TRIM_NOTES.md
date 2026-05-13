# Treehouse V1 — Trim Notes

## Line delta

| File | Before | After | Delta |
|---|---|---|---|
| `index.html` | 887 | 387 | −500 (−56%) |
| `css/style.css` | 2916 | 1504 | −1412 (−48%) |
| `js/main.js` | 535 | 227 | −308 (−58%) |

## Final section structure (6 sections)

1. **Hero** — full-bleed dark cinematic. `Tree House` wordmark, one-line positioning ("Colonial charm, contemporary comfort. Fifteen rooms under the canopy."), primary `Reserve` CTA + secondary `Walk under the leaves`. Michelin Key folded in as a small accolade strip at the bottom of the hero (Michelin Key + Travellers' Choice + "15 Rooms · Adults Only"), per the brief.
2. **Rooms** — 4-card grid. Placeholder labels: King Garden Room, Queen Courtyard Suite, Grand Foliage Suite, Penthouse Canopy. Each card has one short summary + a `Reserve →` CTA. No fake square-metres, no fake bed configs, no fake N°/category lines beyond a clean N° 01–04.
3. **Art Collaboration** — Treehouse × SoHo Galleries. Header + one short truthful paragraph (program name, namesake venue, work lives in the rooms) + 3 on-property art photos (`art-bar-figurines`, `art-chair-tableau`, `art-window-painting`). No captions, no plate numbers, no rotation names, no artist credits.
4. **Location** — split hero with `sanctuary-corridor-evening.jpg` on the left, address block + 3 nearby anchors on the right (Plaza Santa Ana, Paseo de Montejo, Airport MID — all qualitative, no fake distances or walking minutes). One CTA opens Google Maps.
5. **Offers** — two cards: the 5+ nights = 30% off Canopy Allocation, and a sister-property handoff to Boutique by The Museo. Email line below.
6. **Footer** — brand block w/ Michelin Key badge, three columns (The House, Visit, Reserve). Journal lives as a single link under "The House" pointing to `/journal` placeholder.

## What was cut (and why)

| Cut | Reason |
|---|---|
| Sanctuary section ("La Casa Verde", 1898 restoration, two flamboyanes, higuera, 32°C↔22°C, fifty years of botanical accumulation) | All invented specifics. Folded the truthful sliver ("Colonial charm, contemporary comfort. Fifteen rooms under the canopy.") into the hero tagline. |
| Dedicated Michelin section ("La Llave Michelin" with 3-cell prose about inspectors and the gurgling fountain) | Brief says preserve as a small accolade strip, NOT a dedicated section. Now lives in the hero. |
| Breathing pull-quote ("Some houses keep you from the heat...") | Brief: no breath/interstitial sections. |
| Sanctuary pillars (Canopy / Adults Only / Barrio) | Brief: cut El Estándar / pillars. |
| Journal section (4 cards: Hidden cenotes, Mercado Santiago, dry season, henequen haciendas) | Brief: link from footer to `/journal` placeholder — done. |
| Curated Mérida (Honeymoon / Cenotes & Haciendas / Wellness / Transfers) | Brief: compress or cut. Cut entirely; these belong on a sub-page. |
| Photo strip (auto-scrolling marquee of 5 strip-* photos × 2) | Brief: any auto-rotating content cut. |
| Voices / Testimonials carousel (C&J Berlin, Sébastien Paris, M Mexico City, Iris Copenhagen, Travel Diary) | Brief: testimonials are wrong register; all attributions invented. |
| Spanish interstitial ("No hay recepción. Hay alguien que ya sabe en qué silla cae la última luz.") | Brief: no breath/interstitial sections. |
| Art rotation header + 3 captioned art pieces ("Rotation N° V — Bajo el Dosel", "Five Yucatecan artists. Eighteen works installed...", "Rotation V installation view" captions, "Friday & Saturday, five o'clock" walking tour, founding-statement pull quote) | All invented program scaffolding. The truthful Treehouse × SoHo handoff is now one short paragraph. |
| Art marquee (Treehouse · SoHo Galleries / Anchor Venue / Four rotations a year — auto-scrolling) | Brief: no auto-rotating content. Also "four rotations a year" was invented. |
| Room specs (Sleeps / Bed / Outlook / m²) and click-to-expand behaviour | Brief: simple grid with price-from + Reserve. We don't have real square-metres or bed configs, so cut entirely; left a clean one-line summary per room. |
| Reserve form (arrival/departure/guests fields + submit + status region) | Brief: re-booking entry lives in footer; primary path is `Reserve` CTA + direct email. Form was UI theatre with no backend. |
| Nav dots / scroll-spy (Hero/Sanctuary/Michelin/Rooms/Art/Journal/Curated/Voices/Calle 43/Reserve) | Sections it pointed to no longer exist. Top-nav covers what remains. |
| Scroll-to-top button | Page is short enough now that it's not needed. |

## De-fictionalization audit

Grep'd for every name in the brief's kill list — clean. Specifically removed/replaced:
- T. Mendoza, S. Ramírez & J. Casares, Beatriz S. Aldama, Don Eulogio, Doña Marisol, Paloma Cetina, María Helena Cantú, Lic. Beatriz Cervera, Pech/Quiñones/Maza/Verástegui/Aké, all initial-attributed testimonials (C&J/Sébastien/M/Iris) — never made it into the trim because their host sections were cut.
- 32°C / 22°C microclimate, two flamboyanes, the higuera count, "1898", "2019 restoration", "70+ años", "23 Tillandsias", "70+ años bajo el mismo dosel" — all cut.
- "Rotation N° V", "Bajo el Dosel", "Five Yucatecan artists", "Eighteen works", "four rotations a year", "Notas escritas al partir" — all cut.
- "CANOPY30" promo code — cut (the owner can introduce a real code if they want one).
- Fake distances: "40 metres · 1 min on foot", "700 m · 9 min", "1.2 km · 14 min", "15 min by car", "60 min by car · Cenote Cuzamá" — replaced with qualitative copy ("A short walk", "Walking distance", "A short drive").
- Fake phone "+52 (999) 900 0000" — cut.

## Truthful facts kept

- Tree House Boutique Hotel · adults-only · 15 rooms
- First Michelin Key in Mérida + Travellers' Choice (both real, both surfaced in the hero accolade strip)
- Address: Calle 43 × 58 y 60, #489, Mérida 97000 · Santa Ana
- "Colonial charm meets contemporary comfort" — used in the hero tagline (slight rephrase: "Colonial charm, contemporary comfort.")
- "Lush greenery / naturally cool microclimate" — qualitative only, expressed via "Fifteen rooms under the canopy" and "wrapped in leaves" in the footer
- 5+ nights = 30% off (the Canopy Allocation)
- Sister property to Boutique by The Museo (explicit handoff in Offers section + footer)
- Treehouse × SoHo Galleries: one short paragraph, namesake venue framing, no specifics
- `/journal` link in footer (placeholder)

## Photo handling

- All `../assets/` references are real property photos from the 28-photo manifest.
- Art Collab section uses ONLY the 3 designated photos: `art-bar-figurines.jpg`, `art-chair-tableau.jpg`, `art-window-painting.jpg`. The previous third slot (`editorial-eucalyptus.jpg`) was swapped out.
- Michelin Key webp served self-hosted from `assets/michelin-key.webp`.
- Zero Unsplash references in HTML or CSS (grep'd).

## Motion fingerprint — V1 Cinematic Sustained

Implemented:
- **`.cinematic-rise`** replaces the old shared `.reveal` family. Single class. `opacity 0→1` + `translateY(40px → 0)`, **1200ms** `cubic-bezier(0.16, 1, 0.3, 1)`. 180ms stagger via `:nth-child(n)` `transition-delay` (no JS-side stagger math). Stagger applies generically within a section and is also scoped explicitly to `.section-rooms` and `.art-pieces` so the grid cards cascade.
- **Hero ken-burns**: `scale 1.06 → 1.00` over **11s** ease-out, triggered after the intro overlay starts dissolving. CSS-driven (`.hero-bg.loaded img`).
- **Hero copy stagger**: eyebrow → title (per-char) → tagline → CTAs → accolade strip → scroll-indicator, each ~250ms after the prior, on top of the cinematic ease.
- **Hero title**: per-character reveal preserved from prior work (`charReveal` keyframe, 50ms per char, after intro).
- **Primary CTA hover**: scale `1.00 → 1.025` + ochre glow (`box-shadow 0 0 0 6px var(--ochre-glow)` + drop shadow), 300ms ease. Applies to both hero `Reserve` and `Find Calle 43`. Nav-CTA also gets the ochre glow.
- **Intro overlay**: kept (botanical wordmark + leaf glyph + "Santa Ana · Mérida" subtitle, dissolves at 1.3s, fully removed by 2.4s). Load-bearing for variant identity.
- **Custom cursor**: kept — leaf-bright dot + difference-blend trail ring; warms to ochre over images. Disabled on coarse-pointer + reduced-motion.
- **Reduced motion**: every `.cinematic-rise` instantly settles to its final state; hero ken-burns pinned to `scale(1)`; per-char hero animation skipped; cursor trail hidden.

## a11y preserved

- `<html lang="es-MX">`, skip link, `<main id="main">`, `lang="es-MX"` on Spanish fragments, focus-visible outline rules.
- `prefers-reduced-motion` honoured for every transition, the hero ken-burns, the canopy breathing wash, and the scroll-pulse indicator.
- Custom cursor only enabled under `(pointer: fine) and (hover: hover)`, with `body.coarse-pointer` forcing native cursor + visibility back.
- `<noscript>` fallback shows all `.cinematic-rise` content at final state and hides intro overlay, cursor, and grain.

## CTA vocabulary

- Primary booking CTA: **`Reserve →`** (luxury register, per brief).
- Secondary: **`Walk under the leaves →`** (R2 "Hold / Walk / Write / Find" family).
- Location: **`Find Calle 43 →`**.
- Per-room: **`Reserve →`** (the conversion-load-bearing verb).
- Offers footer line: **`Hold a key — write directly to ...`** (Hold + Write, both from R2 vocabulary).
