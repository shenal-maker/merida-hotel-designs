# V3 — Brutalist Art-Forward · Photo Swap Log

Replaced all Unsplash placeholders in `v3/index.html` and `v3/css/style.css` with curated property photography from `treehouse/assets/`. Paths use `../assets/filename.jpg` (assets is one level up from `v3/`).

Property brand assets (Michelin Key webp, FooterLogo.png, Travellers' Choice badge) were intentionally left in place per the brief.

The Arboretum was intentionally **not** touched — R1 reviser swapped taxon photos for typographic glyphs and the brief says to preserve that.

The Journal — Field Dispatches has **no image slots** in the current HTML/CSS (text-only cards by R1 design). Adding images would violate "Do NOT modify layout." Documented as a gap below.

---

## Swaps applied

### Landing / Hero

| Slot | Was | Now | Why |
|---|---|---|---|
| `<link rel="preload">` (head) | unsplash photo-1564501049412 | `../assets/hero-tree-courtyard.jpg` | Match new background asset |
| `.landing-bg` (CSS background-image) | unsplash photo-1564501049412 | `../assets/hero-tree-courtyard.jpg` | Manifest's designated hero: tree growing through courtyard, two-story house wrapping it. The "tree house" in one frame. Vertical, full-bleed-safe. |

### Manifesto Strip (6 unique + 3 loop dupes)

| Slot | Now | Why |
|---|---|---|
| Strip 1 / 7 | `sanctuary-arched-windows.jpg` | Interiority+exteriority — primary atmospheric register |
| Strip 2 / 8 | `canopy-waterfall.jpg` | Lush jungle hotel — canopy identity |
| Strip 3 / 9 | `sanctuary-corridor-day.jpg` | Open-air corridor, palms, lanterns |
| Strip 4 | `breath-hammock-waterfall.jpg` | "What an afternoon here looks like" — adds programming hint |
| Strip 5 | `sanctuary-staircase.jpg` | Quietest, most adults-only frame |
| Strip 6 | `canopy-tree-pool.jpg` | Different angle on water-channel, golden register |

### Data Grid (9 cells, hover-reveal backgrounds)

| Cell label | Now | Why |
|---|---|---|
| ROOMS: FIFTEEN | `room-balcony-doors.jpg` | Literal room, doors open to tree — "rooms" |
| BUILT: c. 1907 | `sanctuary-staircase.jpg` | Architectural heritage register |
| GARDENER: ONE | `canopy-overhead-pool.jpg` | Overhead view of foliage that the single gardener tends |
| COURTYARDS: III | `canopy-courtyard-wing.jpg` | Wide establishing courtyard shot — literally the courtyard |
| CANOPY: ~640 M² | `canopy-tree-pool.jpg` | Trees rising from linear pool — canopy coverage |
| SPECIES: 42 | `canopy-waterfall.jpg` | Lush, multi-species fern + tree composition |
| MICHELIN KEY: 2025 | `art-window-painting.jpg` | "Hotel as gallery" — register matches the Key's prestige |
| NEIGHBORS: PARQUE SANTA ANA | `breath-night-arch.jpg` | Looking from dark courtyard into lit lounge — neighborhood/evening |
| EXHIBITION: ACTIVE | `art-bar-figurines.jpg` | Literal art objects (bronze figurines) in place — "exhibition active" |

### The Collection — Rooms (4 plates)

| Plate / Name | Now | Why |
|---|---|---|
| Plate I — King Garden Room (28 m², south patio, frangipani view) | `room-balcony-doors.jpg` | French doors flung open onto wrought-iron balcony with a tree right outside — most "garden room" of the four. |
| Plate II — Queen Courtyard Suite (42 m², vine courtyard, sitting nook) | `room-slat-headboard.jpg` | Wide DJI shot showing chair-and-side-table corner — reads as a suite with sitting area. |
| Plate III — King Garden Suite (58 m², jardín + terraza, largest with living/dining nook) | `room-staggered-stick.jpg` | Most sculptural/design-forward room (vertical wood-stick headboard, onyx sconces). The "suite" with the strongest design statement matches the largest standard room. |
| Plate IV — Penthouse Canopy (105 m², top floor, azotea + parque) | `room-limestone-skylight.jpg` | Three rectangular skylights cutting through limestone — light-from-above reads as top-floor / penthouse identity. |

### The Exhibition — 6 Plates (3 art + 3 atmospheric per brief)

| Plate / Work | Now | Why |
|---|---|---|
| Plate 01 — Pech, *Sin título (henequén III)*, sculpture beneath ceiba | `art-bar-figurines.jpg` | Has actual bronze figurine sculptures on grid shelving — most-explicit "art-in-place" frame in the set. |
| Plate 02 — Quiñones, *Limestone, Reading*, painting in Suite II | `art-window-painting.jpg` | Literally shows a colorful painting on the lounge wall through an arched window — perfect literal match. |
| Plate 03 — Maza, *El dosel (study)*, suspended fiber, stairwell floors 1–3 | `sanctuary-staircase.jpg` | The actual stairwell — wooden ceiling slats, iron-and-wood stair, niche under stairs. Atmospheric / brutalist register. |
| Plate 04 — Verástegui, *Cenote (siete pruebas)*, photogravure, penthouse bedside | `strip-tile-detail.jpg` | Half cement-tile pattern / half raw concrete — hardest-edged "material" frame, monochrome read fits photogravure register. |
| Plate 05 — Aké, *Cuarto sin techo*, 4-channel sound, azotea | `strip-onyx-sconce.jpg` | Glowing alabaster sconce against louvered shadow striping — "sound rendered as light" register, pause-of-breath quality. |
| Plate 06 — Cetina, *Herbarium, Santa Ana*, ink+gouache, library + entrance | `art-chair-tableau.jpg` | Two chairs across walnut table, raw-wood bench with stacked books — the gallery/library context for the Cetina herbarium series. |

### The Space gallery (8 cells; cell 8 is hidden by CSS at desktop)

| Cell | Tag | Now | Why |
|---|---|---|---|
| 1 | JARDÍN | `hero-ficus-twilight.jpg` | Hero-alt evening register; root-buttressed ficus at blue hour with linear pool lit cyan |
| 2 | SUITE № I | `editorial-shower-tree.jpg` | Bathroom with full-height window framing courtyard tree — room/bath crossover. (All 4 room photos used in Collection; this is the cleanest "Suite I" stand-in.) |
| 3 | SUITE № II | `sanctuary-arched-windows.jpg` | Lounge interior opening to fountain — reads as "suite interior with view." |
| 4 | PATIO NORTE | `sanctuary-corridor-evening.jpg` | Ground-floor open-air corridor at night, palms spilling in — fits "patio." |
| 5 | SUITE № III | `strip-door-shadow.jpg` | Warm walnut door with leaf-shadow play — threshold of a suite. Craft-detail register fits brutalist catalog. |
| 6 | CANOPY | `canopy-waterfall.jpg` | Pure canopy identity. |
| 7 | PENTHOUSE | `canopy-overhead-pool.jpg` | Overhead view from balcony — closest the shoot gets to "penthouse perspective." |
| 8 | AZOTEA | `breath-blue-hour.jpg` | Twilight fountain w/ uplighting (cell hidden at desktop by CSS but populated for mobile/future). |

---

## Counts

- Total Unsplash references swapped: **24** (across HTML `<img>`, HTML inline `background-image`, CSS `background-image`, and `<link rel="preload">`)
  - 1 CSS background-image (landing-bg)
  - 1 preload link
  - 9 manifesto-strip images (6 unique + 3 dup tail)
  - 9 data-grid cell backgrounds
  - 4 room collection images
  - 6 exhibition plate images
  - 8 space-gallery images
  - = 1 + 1 + 9 + 9 + 4 + 6 + 8 = **38** image references touched (some assets re-used across slots)
- Distinct curated photos referenced: **24 of 28** in the manifest
- Unused photos (4): `strip-leaves-stone.jpg`, `strip-ceramic-bottles.jpg`, `culture-quartet.jpg`, plus minor: every other photo used at least once

---

## Gaps & fit notes

1. **Journal — Field Dispatches has no image slots.** The R1 design renders the 4 entries as text-only cards. The brief asked for "small images for each entry" but the existing HTML/CSS has no `<img>` or background slots in `.journal-card`. Adding them would change layout. **Left as-is per the "do not modify layout" constraint.** If desired in a future pass, candidate matches would be:
   - Entry 01 (hidden cenotes) → `breath-blue-hour.jpg` (cenote-like water register)
   - Entry 02 (Mercado Santa Ana) → `culture-quartet.jpg` (closest culture/programming photo we have)
   - Entry 03 (frangipani opens) → `editorial-eucalyptus.jpg` (botanical specimen register)
   - Entry 04 (reading the city) → `strip-leaves-stone.jpg` (intimate texture / "a reader's route")

2. **The Collection's room captions describe specifics that don't map perfectly to the 4 available room photos.** The captions reference "south patio" (Plate I), "north wing, vine-walled patio" (Plate II), "garden wing, central jardín" (Plate III), and "rooftop azotea overlooking Parque Santa Ana" (Plate IV). The shoot delivered 4 visually distinct rooms but none are tagged with which wing/floor they actually live in. Mapping was done by visual register, not literal floor/wing. **Captions left unchanged.** A future content pass could either rewrite captions to fit the photos, or commission additional room photography matching the canonical 4 rooms.

3. **Penthouse fit caveat.** `room-limestone-skylight.jpg` was assigned to Plate IV (Penthouse Canopy) because the skylights give a top-floor reading. But the manifest doesn't actually identify which of the 4 rooms is the penthouse. If the property tags one of the other 3 photos as the penthouse, swap accordingly.

4. **Space gallery SUITE labels are loose.** Cells 2, 3, 5 are tagged "SUITE №§ I/II/III" but draw from atmospheric/editorial pool because all 4 actual room photos were consumed by The Collection (each room appears only in its catalog entry to keep them legible). The substitutes (bathroom-tree, lounge-arched-windows, walnut-door) read as "places inside a suite" rather than "suite hero shots." Acceptable for the V3 brutalist register where a catalog allows oblique angles.

5. **Hero loading filter is preserved.** `.landing-bg` keeps `opacity: 0.36` and `filter: contrast(1.05) saturate(0.9) hue-rotate(-6deg)` — the green tritone overlay (`.landing-veil`) sits on top. The new photo (`hero-tree-courtyard.jpg`) is dappled tree-courtyard in warm tones; the existing filter chain reads it as a slightly cooler/greener atmosphere consistent with V3's canopy palette. Visual QA recommended; no changes to filter values made.

6. **Unused curated photos:** `strip-leaves-stone.jpg`, `strip-ceramic-bottles.jpg`, `culture-quartet.jpg`, `editorial-eucalyptus.jpg`. Reserve for Journal images if that gap gets filled, or for an experiences/programming section in a future pass.

7. **No glassmorphism introduced.** No new background filters, no backdrop-blur, no translucent panels added. All R1 work (typography, palette, grid, focus trap, terracotta carving, cenote deployment, ledger stamps, manifesto whisper line, arboretum typographic glyphs) preserved.

---

## Files modified

- `/Users/adeleshen/boutique-museo-designs/treehouse/v3/index.html`
- `/Users/adeleshen/boutique-museo-designs/treehouse/v3/css/style.css` (one rule: `.landing-bg`)
