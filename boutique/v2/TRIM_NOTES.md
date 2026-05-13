# V2 Editorial — Trim Notes

## Line delta
- `index.html`: **774 → 303** (-471 lines, -61%)
- `css/style.css`: 2419 → 1045 (-1374 lines, -57%)
- `js/main.js`: 551 → 202 (-349 lines, -63%)

HTML is comfortably inside the 250–400 target.

## Sections kept (6, per brief)
1. **Hero** — property name, one-line positioning, single hero drop-cap, Reserve CTA + View Rooms ghost CTA
2. **Rooms** — four named types (Deluxe Boutique Room / Deluxe Boutique Suite / Grand Boutique Suite / Penthouse Suite) as a grid, "Reserve" per card
3. **Art Collaboration** — Treehouse × SoHo Galleries, typography-only, one sentence, links to Tree House as namesake venue
4. **Location** — three cards (address / nearby anchors / arrival from MID)
5. **Offers** — Resident's Allocation (6+ nights) + Summer Special (20% off Jun 1–Aug 31, 2026)
6. **Footer** — clean light footer; brand, visit, browse, contact, social

Sticky masthead with Reserve CTA persists across all sections.

## Cut (per brief)
- Page counter (Roman numeral chip)
- Reading-progress spine
- Cinematic intro overlay
- Editor's Note section (and Beatriz S. Aldama signature)
- Sanctuary feature section
- El Estándar / pillars
- Voices testimonials carousel (C. & D. Whitfield, Ana Sofía M., J. Reinhardt, P. Iyer, E. Vargas, R. Manríquez)
- Photo Essay interstitial (8 captioned plates)
- Curated Mérida 4-entry list
- Pull-quote ("María Helena Cantú" / "La Tinta" critic)
- Full-bleed "Tierra Adentro" plate + 3 captioned art plates (M. Ríos, A. Pacheco, J. Manzón)
- All Plate I–XXII / Lám. roman-numeral apparatus
- All Edición No. 1 / Vol. III / Cycle N° III framing
- "Publicado en Mérida" colophon conceit
- Newsletter signup
- Custom cursor (V2 is native-cursor only)
- Hero parallax + section data-section / data-section-label scaffolding
- Drop caps on all sections except the single hero deck

## De-fictionalized
All invented people, stats, programs, exhibitions, and critic quotes removed:
- People: Beatriz S. Aldama, María Helena Cantú, M. Ríos, A. Pacheco, J. Manzón, all initial-attributed testifiers
- Stats: 1898 founding year, "staffing ratio nearly one to one", "Cuaderno XVIII", "70+ años"
- Programs: Tierra Adentro, Cycle N° III, "Cycle N° IV opens mid-September"
- Press conceits: La Tinta, "Cuaderno XVIII otoño MMXXV"

What stayed (per brief — true to the live site):
- 15 rooms
- Paseo de Montejo
- Steps from Palacio Cantón
- 15 minutes from MID
- Four real room-type names
- Resident's Allocation (6+ nights → transfer + gift)
- Summer Special (20% off Jun 1–Aug 31, 2026)
- Treehouse × SoHo Galleries is acknowledged in one sentence, no fake artist names or dates, with an outbound link to the sister property as the real venue

## Photo handling
- All `unsplash-*.jpg` references removed (8 images: gallery-installation, gallery-wall, canvas-ochre, framed-work, sculpture, merida-street, bougainvillea, cenote, coffee, shutter)
- Art Collaboration section is now typography-only — no gallery photos
- Remaining image refs all point to locally-mirrored `assets/boutique-*` files: hero-interior, room-01, room-02-suite, room-03-grand, room-04-penthouse

## Motion fingerprint applied — V2 Editorial Page-turn
- **Scroll reveals (`.editorial-sweep`):** `clip-path: inset(0 100% 0 0) → inset(0)`, **520ms** `cubic-bezier(0.45, 0, 0.15, 1)`. **No opacity fade.** Stagger **120ms** between siblings inside a section (grouped by closest `section/header/footer`).
- **Hero entry:** text via clip-path sweep first; image cross-dissolves in **300ms later** (`opacity 0 → 1`, **400ms** ease-out with `transition-delay: 300ms`); drop-cap is the last to land — `scale(0.7) → scale(1.0)`, **250ms** ease-out, with a **700ms** delay so body settles before the cap "prints" (no fade, scale only).
- **Hover (links):** underline draws left-to-right under `.masthead-nav a`, `.footer-section a`, `.art-collab-link` via `background-image` gradient with `background-size: 0% → 100%`, **280ms** ease-out.
- **Hover (CTAs):** `.hero-cta`, `.room-cta`, `.offer-cta` get a 1px ochre rule that "prints" left-to-right under the label via `::after` width 0 → 100%, **280ms** ease-out.
- **Page intro:** ditched the prior cinematic overlay. `<main>` does a flat **280ms** paper-stock fade-in via `@keyframes paper-stock-in` (opacity only, no curtain).
- **Cursor:** native cursor only. All custom-cursor code removed from JS and CSS.
- **Reduced motion:** all sweeps resolve instantly (`clip-path: none`, image opacity 1, drop-cap scale 1); main fade-in is dropped; transition-duration zeroed globally.

## Class rename
- Replaced shared `.reveal` / `.reveal-line` / `.draw-line` (which collided with sibling variants' motion vocabularies) with variant-specific `.editorial-sweep`. The intersection observer keys off that one class plus `.editorial-img` for the hero image cross-dissolve.

## Accessibility preserved
- `<main id="main">` wrapper added (was missing in the prior R3 version — the skip link previously pointed at `#editors-note`)
- Skip link retargeted to `#main`
- `lang="es-MX"` retained on every Spanish phrase
- `prefers-reduced-motion: reduce` honored
- Mobile menu focus trap + Escape-to-close + `inert` on background regions
- Sticky masthead hide-on-scroll with hysteresis preserved
- All images keep `width`/`height`, `loading` attrs, and onerror fallback to the limestone gradient block
