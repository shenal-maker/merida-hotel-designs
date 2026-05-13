# Trim + De-fictionalize Brief (shared across all 6 variants)

The current variants are 670–940 HTML lines each. Owner says "way too long." Plus they contain stock Unsplash placeholders (some showing lego art) and a swarm-invented cast of fake people, stats, programs, and critics that have nothing to do with the real properties.

This pass: trim to luxury-boutique-hotel norm (5–7 sections, ~6–8 viewport heights) and replace every invented detail with truthful copy.

---

## The new section structure (target for every variant)

Cut from 9–13 sections to **6 sections**:

1. **Hero** — property name, one-line positioning (NOT a paragraph), persistent booking CTA. For Treehouse: Michelin Key as small accolade strip in or near hero.
2. **Rooms** — 4 room types as a grid. Price-from + "Reserve" per room.
3. **The Art Collaboration** — Treehouse × SoHo Galleries. ONE section, the property's differentiator. (Photo treatment differs per hotel — see below.)
4. **Location** — map or address block + 2–3 nearby anchors. Functional, not a travelogue.
5. **Offers** — Resident's Allocation (Boutique 6+ nights) or 5+ nights = 30% off (Treehouse). One section.
6. **Footer** — full contact, re-booking entry, social.

**CUT entirely (move to subpages or delete):**
- Editor's Note / Manifesto sections (compress to a single hero sub-line if anything)
- Voices / Testimonials (wrong register for Michelin tier; trust signals belong on TripAdvisor/Google, not your homepage)
- Sanctuary as a separate section (fold into hero deck)
- El Estándar / pillars
- Curated Mérida (experiences) — merge a short version into Footer or cut
- Journal (link from Footer to a `/journal` placeholder if needed)
- Photo Essay / interstitial / breath sections
- V3 Arboretum, Data Grid, Counters, Manifesto block (cut to one bar/strip if anything)
- Any auto-rotating testimonial carousels

CTA language: **"Reserve"** (luxury register) or **"Check Availability"**. NEVER "Book Now" — reads OTA-ish. Sticky header CTA on scroll is non-negotiable.

---

## De-fictionalize: kill list

The swarm invented a cast of characters and a vocabulary of fake specifics. **Cut every one of these.** They do not appear on either property's real website. The owner does not know them.

### Invented people (DELETE every mention)
- Beatriz S. Aldama (fake Boutique editor / property director)
- Don Eulogio (fake gardener)
- Doña Marisol / Mari (fake market chef)
- Paloma Cetina (fake painter)
- María Helena Cantú (fake critic)
- Lic. Beatriz Cervera (fake Yucateca reviewer)
- S. Ramírez & J. Casares (fake curators)
- Pech, Quiñones, Maza, Verástegui, Aké (fake artist roster)
- T. Mendoza (fake field-notes reviewer)
- Cécile (Paris), Andrés (CDMX), R. Manríquez, C.D., J.P., Iris, Vargas — every initials-attributed testimonial
- Any other proper name that isn't on the live hotel sites

### Invented stats (DELETE)
- "-4°C patio vs. calle"
- "70+ años bajo el mismo dosel"
- "1908 / c.1908 / 1898 restoration year" (no public year)
- "32°C↔22°C microclimate"
- "two flamboyanes"
- "forty-two species" / "42 species"
- "23 Tillandsias from Campeche 2019"
- "83.5+ SCA score" (this was Pan & Koffee — leaked in)
- Any other specific number/date not on the live hotel sites

### Invented programs (DELETE)
- "Cycle N° III", "Vol. III", "Edición No. 1", "Edición Botánica No. 1"
- "Tierra Adentro" (fake rotation name)
- "El Jardín Interior" (fake exhibition title)
- "Apuntes del cuaderno verde" (fake notebook conceit)
- All Lám./Plate Roman numerals attached to specific captioned artworks
- Any other named program/cycle/volume that isn't published by the hotel

### Invented quotes (DELETE)
- All press-style critic pull-quotes
- All testimonial blocks with attributed reviewers
- All "Field Notes" reviews

---

## What's TRUE — use these (and only these) as factual hooks

### Boutique by The Museo (from boutiquebythemuseo.com)
- "An intimate 15-room sanctuary in the historic center of Mérida"
- Steps from Palacio Cantón
- On / near Paseo de Montejo
- 15 minutes from the airport
- **Room types:** Deluxe Boutique Room, Deluxe Boutique Suite, Grand Boutique Suite, Penthouse Suite
- **Resident's Allocation:** book 6+ nights → complimentary airport transfer on arrival + a surprise gift
- **Summer Special:** 20% off stays from June 1 – August 31, 2026
- Services available: Honeymoon Package, Curated Yucatán Expeditions (Cenotes & Haciendas), In-Suite Wellness & Spa, Private Airport Transfers

### Tree House Boutique Hotel (from treehouseboutiquehotel.com)
- 15 rooms
- Adults-only
- **First Michelin Key hotel in Mérida** (real accolade — surface it as a small accolade strip)
- Travellers' Choice award
- Santa Ana neighborhood
- Address: Calle 43 × 58 y 60, #489, Mérida 97000
- "Colonial charm meets contemporary comfort"
- "Lush greenery" creating "naturally cool microclimate"
- **Offer:** 5+ nights = 30% off
- Has a Journal (curated travel guides) — can link from footer
- Sister property to Boutique by The Museo

### Treehouse × SoHo Galleries art collaboration
- This is REAL (per the owner). Treehouse is the program; SoHo Galleries (Mérida) is the partner. Tree House Hotel is the namesake venue.
- **What you can say:** there is a curated art program; rotating works live at Tree House; guests live inside the exhibition. No specific exhibition titles, dates, artist names, plate numbers, or sale prices.
- One sentence is enough.

---

## Photo handling

### Unsplash references — KILL ALL
Search for `unsplash.com` in HTML and CSS. Replace each reference with:
- For **Treehouse** variants: a property photo from `/Users/adeleshen/boutique-museo-designs/treehouse/assets/` (referenced via `../assets/filename.jpg`). The PHOTO_MANIFEST.md in that folder tells you what each photo is.
- For **Boutique** variants: a press image from `boutique/v{N}/assets/` (already locally mirrored from the live site). If no slot is appropriate, **delete the image element entirely** and let the section be typography-only.

### Art collaboration section specifically
- **Treehouse variants:** use only the 3 on-property art photos: `art-bar-figurines.jpg`, `art-chair-tableau.jpg`, `art-window-painting.jpg`. No Unsplash, no contemporary-art stock.
- **Boutique variants:** typography-only treatment. No gallery photos. The section becomes a one-paragraph statement + a link to Tree House as the namesake venue (a real, citeable handoff between sister properties).

---

## Visual character preservation

Each variant must keep its distinctive feel after trimming:
- **V1 Cinematic:** dark, full-bleed hero. Trim copy aggressively; let imagery and one strong tagline carry it.
- **V2 Editorial:** light ivory, drop cap on hero deck only (kill the other drop caps; they were apparatus for sections that no longer exist). Magazine register lighter — no more "Edición No. 1" masthead.
- **V3 Brutalist:** keep the catalog grid energy. Manifesto, Arboretum, Data Grid, Counters all go — what remains is hero + rooms + art + location + offers + footer, but rendered in the 12-col mono register.

Across all three: the booking CTA is the load-bearing UI moment now, not the storytelling.

---

## Motion fingerprint — each variant gets a DIFFERENT signature

Right now every variant uses the same soft opacity fade-in. That reads as AI-generated default. Give each variant a motion language that belongs to its register. **Do not share `.reveal` between variants.**

### V1 Cinematic — Sustained
- **Scroll reveals:** `opacity 0 → 1` + `transform: translateY(40px) → 0`, **1200ms** `cubic-bezier(0.16, 1, 0.3, 1)` (Apple-tier ease-out, very long tail). Stagger children **180ms** apart.
- **Hero entry:** ken-burns zoom on hero image (slow scale 1.06 → 1.00 over 9–12s); copy fades up from below with **250ms stagger** between lines.
- **Hover:** primary CTA scales 1.00 → 1.025 with glow (`box-shadow` ochre); 300ms ease.
- **Page transitions:** keep the cinematic intro overlay (curtain dissolve) — it's load-bearing for this variant.
- **Cursor:** smooth follow with ochre glow + delayed trail ring (already present; preserve).

### V2 Editorial — Page-turn
- **Scroll reveals:** `clip-path: inset(0 100% 0 0) → inset(0)` — left-to-right curtain reveal, **520ms** `cubic-bezier(0.45, 0, 0.15, 1)`. No `opacity` fade — content is already opaque, the clip-path does the "page turning" feel. Stagger **120ms**.
- **Hero entry:** masthead text appears first via the clip-path sweep; image fills in **300ms later** with a quick 400ms cross-dissolve. Drop-cap appears last (after body settles) with a single-step scale 0.7 → 1.0 (no fade), 250ms ease-out.
- **Hover:** underline draws left-to-right under links (`background-image` gradient with `background-size` 0% → 100%, 280ms ease-out). CTA gets a 1px ochre rule that "prints" left-to-right.
- **Page transitions:** ditch the cinematic intro; instead a quick 280ms paper-stock fade-in of the whole `<main>`, no curtain.
- **Cursor:** native cursor only. The editorial variant doesn't need a custom one — magazines don't have a custom mouse.

### V3 Brutalist — Snap / staccato
- **Scroll reveals:** NO fade. Elements snap to visibility with `transform: translateY(8px) → 0` + `opacity 0 → 1` in **80ms linear** (essentially a hard cut). Stagger **40ms** — staccato cascade. Children appear in a stepped sequence, not a smooth blur.
- **Hero entry:** wordmark letters appear one-by-one with a **35ms per-letter** delay (typewriter-fast); no easing on each, just snap. After all letters land, the coordinate readout flickers in (3 quick opacity flashes over 200ms) before settling.
- **Hover:** terracotta block-highlight (`background: terracotta; color: limestone`) flips instantly on `:hover` — no transition. Mono CTAs invert via `mix-blend-mode` snap.
- **Page transitions:** delete the intro overlay entirely. Page appears immediately.
- **Cursor:** keep the crosshair coordinate readout. No follow ring.

### Across all three
- **All motion gated on `prefers-reduced-motion: no-preference`** — under reduced motion, every reveal becomes `opacity: 1; transform: none;` instantly.
- **Same content can use different motion** — don't share a `.reveal` class. Use variant-specific classes: `.cinematic-rise`, `.editorial-sweep`, `.brutalist-snap` (or whatever names match the rest of each variant's vocabulary).
- The motion should be **legible within the first viewport** — the first reveal should announce the variant's character before the user scrolls.

---

## Constraints

- Preserve `index.html` + `css/style.css` + `js/main.js` file structure
- Preserve all accessibility work (`<main>`, skip links, `lang="es-MX"`, focus traps, `prefers-reduced-motion`)
- Preserve photo-swap work (`../assets/` references stay; only swap Unsplash ones)
- Don't introduce glassmorphism
- Keep palette tokens but cut unused CSS heavily — the file should shrink ~40–50%
- Write a brief `TRIM_NOTES.md` per variant: what was cut, what was kept, total line delta

Final delivery: each variant `index.html` should be **~250–400 HTML lines** (down from 670–940).
