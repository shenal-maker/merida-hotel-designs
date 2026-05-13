# Boutique V3 — Brutalist Art-Forward — Trim Notes

## Line deltas
- `index.html`: 669 → **285** lines (−384, −57%)
- `css/style.css`: 2214 → **1141** lines (−1073, −48%)
- `js/main.js`: 488 → **247** lines (−241, −49%)

## Sections kept (6, in order)
1. **Hero** — wordmark, byline, one-line positioning, persistent CTA ("ENTER THE HOUSE")
2. **Rooms** — 4 named types as catalog entries (Deluxe Boutique Room, Deluxe Boutique Suite, Grand Boutique Suite, Penthouse Suite), brutalist room-block layout preserved
3. **Art Collaboration** — typography-only block, dark ground, one-sentence statement crediting SoHo Galleries + handoff to Tree House
4. **Location** — 4-cell 12-col block (Address / Coordinates / Nearby / Arrival)
5. **Offers** — Resident's Allocation (6+ nights) + Summer Special (−20% Jun–Aug 2026), 2-up split, accent-inverted second card
6. **Footer** — contact, sister-property link, index, sticky "ENTER & RESERVE" CTA, ledger stamp

## Sections cut
- Manifesto (FIFTEEN ROOMS / ONE COURTYARD lines + Cormorant whisper + scrolling image strip)
- Data Grid (9 cells of fake hotel data — built 1908, restorer name, family name, ratios)
- Exhibition centerpiece (Vol. III, "El Jardín interior", 6 fake artists, 6 plate captions, curatorial statement, signed by fake co-curators)
- Installation Index / Floorplan (architectural schematic of plate locations)
- Experiences (Cenotes & Haciendas / Honeymoon / Bodywork / Arrival — moved factual offers into a dedicated Offers section, dropped the per-program editorial)
- Reviews / Field Notes (5 fictional ledger transcriptions)
- Counters (15 / 1 / CERO / 6 ARTISTS / EST. 2023)
- The Space gallery (8-fig walk-through). Hero image still used as `.landing-bg`; one room image per room block; the standalone gallery is gone.
- Manifesto strip marquee (auto-scrolling image rail)
- Section noise flash, mutation observer for counter cells, plate intersection observers, gallery clip-path reveals — all dead code removed with the sections they served.

## De-fictionalized
Removed every mention of:
- Pech, Quiñones, Maza, Verástegui, Aké, Solís, Caamal (fake artist roster)
- S. Ramírez & J. Casares (fake curators)
- Salazar & Co. (fake architect), Ramírez family (fake owner-occupation)
- "El Jardín interior", "Vol. III", "Cycle N° III"
- All plate captions with medium / dimensions / edition
- All "Field Notes" reviews with attributed reviewers (M.H., L. & R., A.K., J.P., C.D.)
- All built/restored years (c. 1908 / 2023), floorplate m², ceiling heights, guest:staff ratios
- Plate Roman numerals on rooms ("Plate I — Deluxe Boutique Room, c. 1908, restored 2023, limestone, pasta tile, chukum...")
- USD price lines on rooms (kept "Reserve direct" — no fabricated rates)
- Specific fake email + phone in footer (replaced with site links to boutiquebythemuseo.com + treehouseboutiquehotel.com)

## Truthful facts retained
- "Boutique / by The Museo" wordmark, byline, 15-room positioning
- Coordinates 20.9674° N · 89.6243° W
- Paseo de Montejo, Centro Histórico, Mérida, Yucatán
- 4 real room category names
- Steps from Palacio Cantón; 15 min from MID airport
- Resident's Allocation (6+ nights → airport transfer + gift)
- Summer Special: 20% off Jun 1 – Aug 31, 2026
- Tree House × SoHo Galleries collaboration — one-sentence statement, no specifics
- Sister-property relationship to Tree House Boutique Hotel

## Photo handling
- Kept: `boutique-hero-interior.jpg`, `boutique-room-01.webp`, `boutique-room-02-suite.jpg`, `boutique-room-03-grand.jpg`, `boutique-room-04-penthouse.jpg`
- Dropped from HTML (still on disk): all 6 `unsplash-plate-0X.jpg` files, plus the `boutique-strip-0X` images that powered the manifesto marquee + The Space gallery
- Art-collab section is **typography-only** per brief — no gallery photos, no Unsplash, no contemporary-art stock

## Motion fingerprint — V3 Brutalist Snap / Staccato (applied)
- **Scroll reveals**: `.brutalist-snap` class. `transform: translateY(8px)→0` + `opacity 0→1` in **80ms linear** (hard cut). Stagger via `--i` CSS var × **40ms** per element, computed per-section group in JS. No fade.
- **Hero entry**: wordmark letters appear one-by-one via `.lit` class with **35ms per-letter** delay (typewriter-fast). After all letters land (+80ms), `.landing-coords` gets `.flicker-in` which runs a 200ms `coord-flicker` keyframe — 3 opacity flashes before settling at 0.55.
- **Hover**: terracotta block-highlight `background: terracotta; color: limestone` flips **instantly** (`transition: none`) on `.room-cta`, `.room-spec`, `.offer-cta`, `.nav-cta`, `.landing-cta`, `.footer-cta`, `.art-collab-cta`. Image hover on `.room-image-wrap` uses snap filter swap (no transition).
- **Page transitions**: no intro overlay (none ever existed in V3; brief reaffirms this).
- **Cursor**: crosshair coordinate readout preserved (`.cursor-readout`), no follow ring.
- **Reduced motion**: under `prefers-reduced-motion: reduce`, `.brutalist-snap` is `opacity:1; transform:none; transition:none` immediately; letters all `.lit` at once; coord opacity set to final value, no flicker animation.

## Accessibility preserved
- `<main id="main">`, skip link, `lang="en"` + `lang="es"` on Spanish tokens
- Menu focus trap (Tab cycle, Escape close, return focus on close, sibling `inert` while open)
- ARIA labels on nav, dialog, sections, addresses
- `prefers-reduced-motion` gating on all motion
- Focus-visible outlines on dark + light surfaces

## CTA verb family
"ENTER" / "TAKE" — catalog-register, brief-approved. Used consistently:
- Nav: "ENTER →"
- Hero: "ENTER THE HOUSE →"
- Rooms I–III: "ENTER № I/II/III →"
- Penthouse: "TAKE THE PENTHOUSE →"
- Art: "ENTER TREE HOUSE →"
- Offer 1: "ENTER ALLOCATION →"
- Offer 2: "TAKE THE RATE →"
- Footer: "ENTER & RESERVE →"

Zero instances of "Book Now". One sticky "ENTER →" in nav for persistent booking entry.
