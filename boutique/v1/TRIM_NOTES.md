# Boutique V1 — Cinematic Immersive · Trim Notes

## Line delta

| File | Before | After | Δ |
|---|---|---|---|
| `index.html` | 736 | 310 | −426 (−58%) |
| `css/style.css` | 2,311 | 1,257 | −1,054 (−46%) |
| `js/main.js` | 465 | 256 | −209 (−45%) |

## Sections kept (6)

1. **Hero** — property name, single-line positioning ("An intimate 15-room sanctuary in the historic center of Mérida"), `Check Availability` primary CTA, ken-burns hero image, sticky-CTA header.
2. **Rooms** — 4 cards, verbatim room names (Deluxe Boutique Room, Deluxe Boutique Suite, Grand Boutique Suite, Penthouse Suite). Hover reveals a `Reserve →` link. No invented specs/areas/prices — left for owner to fill in.
3. **Art Collaboration** — typography-only. Single sentence acknowledging the Treehouse × SoHo Galleries program and pointing readers to Tree House Boutique Hotel as the namesake venue (sister property link).
4. **Location** — image + address block: Paseo de Montejo / Centro Histórico, Palacio Cantón (steps), MID (15 min).
5. **Offers** — Resident's Allocation (6+ nights → airport transfer + welcome gift) + Summer Special (20% off Jun 1 – Aug 31, 2026). `Reserve a room` CTA → `mailto:reservations@boutiquebythemuseo.com`.
6. **Footer** — brand, services list (Honeymoon / Cenotes & Haciendas / In-Suite Wellness / Private Transfers — as non-link items, no fake program pages), reserve column with email + sister-property link.

## What was cut

### Invented people (all removed)
- T. Mendoza (Treehouse field-notes byline in the "breath" pull-quote)
- L & M · Brooklyn, Cécile · Paris, Andrés · CDMX, Iris · Copenhagen, Mariana · Monterrey (testimonial carousel)
- Inés Aldama, Tomás Pérez Caín, Carla Méndez (fake artist credits in the art rotation)

### Invented programs / stats (all removed)
- "Rotation N° IV — *Calor Lento*" and the rotation deck
- "Cycle / Cur. Treehouse / 2026" marquee
- "Four rotations a year"
- "N° 01 · El corredor al mediodía" sanctuary caption
- "20°58'N · 89°37'W" geo coordinate
- "1909 / Estate", "90m / Palacio Cantón" specific distances in hero meta
- Pillars I/II/III (Cal / Madera / Patio)
- All room m² / sleeps / bed / outlook specs (kept structure-free; owner should populate with real numbers)
- "Cuzamá · 60 min", "Plaza Grande · 1.4 km · 18 min" precise distances
- Promo code `VERANO26` (kept only the dates and "20% off" wording)
- "Curator-led walkthrough · Fri & Sat, 5pm"

### Invented quotes (all removed)
- Breath pull-quote ("Some houses ask to be admired...")
- Curator quote ("We didn't want the rooms to be backdrops...")
- Interstitial pull-quote ("Un refugio en el corazón de cal.")
- "Las Voces — Notes left at checkout" carousel (5 testimonials)

### Whole sections cut
- The Sanctuary (folded into hero as the single-line positioning)
- Curated Mérida (services moved into footer as a non-linked list)
- Breathing pull quote / interstitial
- Photo strip
- Voices / testimonial carousel
- Reservation form (replaced with `mailto:` CTA — bookings should travel through the real reservations email or a real booking engine)

### Other deletions
- Nav-dots fixed-rail nav (8 dots) — replaced by sticky header CTA per brief
- All Unsplash references in art section (3 `<img>` tags) — section is now typography-only
- Body warm-shift color cycling (`warm-shift-1..5` JS + CSS)
- Testimonial carousel JS (~110 lines)
- Magnetic-button mousemove pull effect (left intact; CTA hover is now the load-bearing motion)
- Photo strip marquee + art marquee animations
- Various noscript fallbacks for sections that no longer exist
- `.reveal` and `.reveal-img` classes — replaced with variant-specific `.cinematic-rise`

## Photo references — final state

All images use local `assets/` paths:
- `assets/hero.jpg` — hero ken-burns
- `assets/room-deluxe.webp`, `room-suite.jpg`, `room-grand.jpg`, `room-penthouse.jpg` — rooms grid
- `assets/location.png` — location section
- `assets/room-suite.jpg` — offers section atmospheric bg (10% opacity)

Unused but still in `assets/`: `breath.jpg`, `photo-1.png`, `photo-2.png`, `photo-3.png`, `sanctuary-corridor.jpg`. Left in place — owner can use them in future revisions without re-fetching.

## Motion fingerprint applied — V1 Cinematic Sustained

- **Scroll reveals (`.cinematic-rise`)**: `opacity 0 → 1` + `translateY(40px → 0)` over **1200ms** `cubic-bezier(0.16, 1, 0.3, 1)`. Stagger **180ms** between siblings sharing a parent (computed in JS on load via `transitionDelay`).
- **Hero ken-burns**: `scale(1.06 → 1.00)` over **10s** ease-out, triggered when the cinematic intro overlay begins dissolving.
- **Hero copy stagger**: eyebrow → title (char-by-char) → tagline → CTAs → meta → scroll-indicator, each line fades up with **~250ms** between landings (CSS keyframe `heroFadeUp` with sequenced animation-delays at 1.0s / 1.5s / 1.75s / 2.1s / 2.35s).
- **Primary CTA hover**: `scale(1.00 → 1.025)` + ochre `box-shadow` glow over **300ms ease**. Applied to `.hero-cta a`, `.location-cta a`, `.offers-cta .magnetic-btn`, and the sticky `.nav-cta`.
- **Cinematic intro overlay**: preserved (curtain dissolve over 1.1s, ~1.2s hold).
- **Custom cursor + trail**: preserved (ochre dot + delayed trail ring, terracotta warm-up over imagery).
- **Sticky header CTA**: `.top-nav.scrolled` after 80px of scroll — `Reserve` button fills to solid ochre.
- **Reduced motion**: all reveals + ken-burns + hero copy animations collapse to instant `opacity: 1; transform: none;` under `prefers-reduced-motion: reduce`.

## Preserved from R3
- `<main id="main">` landmark + skip link
- `lang="es-MX"`
- `prefers-reduced-motion: reduce` gates throughout CSS + JS
- Coarse-pointer detection → native cursor restore
- Font-loading gate for hero title char-split
- No-JS fallback `<noscript>` block
- Local `assets/` references everywhere (zero `unsplash.com` strings remain)

## Flagged for owner

1. **Room cards have no price / size / sleeps shown.** I removed all the invented "28m² / sleeps two / king bed / courtyard outlook" specs because they weren't sourced. The structure (`.room-card-content`) is ready for real specs and a per-room "from $X" price when you have them — drop into `.room-card-content` after `<h3>`.
2. **Offers section CTA is `mailto:`.** The original had a fake reservation form (date pickers + "Write the house" submit). I replaced it with a direct email link to `reservations@boutiquebythemuseo.com`. If you want a real booking widget (Mews / Cloudbeds / SiteMinder / etc.), the slot is right there.
3. **Phone number was a placeholder** (`+52 (999) 900 0000`) — removed entirely rather than leave a fake. Add a real number to the footer Reserve column if you want one visible.
4. **Address is intentionally not numeric.** The real site says "historic center of Mérida / Paseo de Montejo" without publishing a street number — I matched that exactly. Add Calle X #YYY if you want to be more specific.
5. **Services list in footer is non-linked** — those four services are real per the brief, but I have no subpages to link them to. If you build out `/services/honeymoon` etc., they should become `<a>` tags.
6. **Sister-property link** (`treehouseboutiquehotel.com`) appears in two places: art section and footer Reserve column. Real, citeable handoff between the two houses.
