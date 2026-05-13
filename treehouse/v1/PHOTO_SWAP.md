# V1 — Cinematic Immersive — Photo Swap Log

Replaced every Unsplash placeholder in `index.html` with curated property photography from the 28-photo manifest at `../assets/`. CSS file (`css/style.css`) had no external image URLs to swap — only inline SVG data-URIs for noise and leaf masks, all left untouched.

## Path strategy

**Chosen:** `../assets/filename.jpg` from `v1/index.html`. The asset folder lives at `/treehouse/assets/` (one level above `v1/`), shared with V2 and V3. No JPEGs duplicated into `v1/assets/`. The single per-variant local asset is `v1/assets/michelin-key.webp`, which is referenced as `assets/michelin-key.webp` (relative to v1/) and was left as-is per the brief.

## Swap table

| Line | Slot / role | Previous | New | Why this photo |
|------|------------|----------|-----|----------------|
| 21 | `<link rel="preload">` hero | unsplash 1542314831 | `../assets/hero-tree-courtyard.jpg` | Match the actual hero image so the preload pays off. |
| 96 | `.hero-bg img` | unsplash 1542314831 | `../assets/hero-tree-courtyard.jpg` | The manifest's #1 pick: mature higuera growing through the courtyard, two-story casona wrapping it, lanterns lit in dappled light. Vertical, full-bleed, "tree house" in a single frame. |
| 137 | `.sanctuary-image-wrap img` | unsplash 1559827260 | `../assets/sanctuary-arched-windows.jpg` | The "room with a view of the property" shot — green-tile lounge looking out through arched steel windows onto the white-stucco fountain. Reads as interiority + exteriority, the manifest's strongest sanctuary frame. |
| 179 | `.michelin-bg img` (decorative) | unsplash 1520250497591 | `../assets/sanctuary-staircase.jpg` | The "quietest, most adults-only frame in the set" — dark, moody iron-and-wood staircase. Pairs naturally with the Michelin Key citation tone (architecture + restraint). |
| 221 | `.breath-bg img` (pull quote) | unsplash 1551776235 | `../assets/breath-blue-hour.jpg` | Manifest explicitly says "use for a full-bleed pull-quote section" — round white fountain at twilight, cobalt sky, bamboo wall, ground uplighting. |
| 244 | Room 1: King Garden Room | unsplash 1582719508 | `../assets/room-balcony-doors.jpg` | Match the room name: "garden-facing, leaf-shaded." This is the room with French doors flung open onto a wrought-iron balcony with a tree right outside — literal garden-facing room. |
| 280 | Room 2: Queen Courtyard Suite | unsplash 1571896349 | `../assets/room-slat-headboard.jpg` | The most restrained / calm of the four distinct rooms — square geometry, solid slat headboard, chair-and-side-table corner. Reads as "two queens, a slow morning ritual." |
| 316 | Room 3: Grand Foliage Suite | unsplash 1551882547 | `../assets/room-limestone-skylight.jpg` | The most architecturally dramatic — limestone feature wall with three skylights pulling light down onto the bed. Closest match to "the house's principal room… vaulted ceiling, claw-foot bath" copy. |
| 352 | Room 4: Penthouse Canopy | unsplash 1564501049 | `../assets/room-staggered-stick.jpg` | The most sculptural / design-forward room — pipe-organ vertical wood-stick headboard, onyx sconces. Matches "the top of the tree" / signature room tone. |
| 391 | `.art-hero-bg img` | unsplash 1577720580 | `../assets/art-window-painting.jpg` | "The hotel is a gallery you sleep in" — evening view through arched window into the lit lounge, with a painting visible on the green wall, tree branches reaching into frame. The most "anchor venue" image in the set. |
| 431 | Art piece N° 01 — Cárdenas | unsplash 1594736797 | `../assets/art-bar-figurines.jpg` | The manifest's most explicit "art-in-place" shot — bronze figurine sculptures on grid shelving, the bar itself in frame. |
| 442 | Art piece N° 02 — Pérez Caín | unsplash 1554907984 | `../assets/art-chair-tableau.jpg` | "The most magazine-cover composition in the shoot" — mid-century chairs, walnut table, eucalyptus posy, layered cement tile, raw-wood bench with Panama hat and books. |
| 453 | Art piece N° 03 — Pat Castro | unsplash 1536924940 | `../assets/editorial-eucalyptus.jpg` | "The single most quintessentially Tree-House composition in the entire shoot" (manifest's words) — glass cube of eucalyptus on seafoam-and-cream tile. Botanical + tile + green palette in one frame. |
| 489 | Journal — Hidden cenotes | unsplash 1505873242 | `../assets/canopy-overhead-pool.jpg` | The closest match to a "limestone pool" feel inside the shoot — overhead view of the plunge pool surrounded by palms and ferns. (See gap note below.) |
| 499 | Journal — Mercado Santiago | unsplash 1540541338 | `../assets/culture-quartet.jpg` | The only "people / programming" frame in the shoot — string quartet around the fountain. Reads as a real-world moment in a tile of card otherwise dominated by property. |
| 509 | Journal — Dry season, slowly | unsplash 1520250497 | `../assets/editorial-shower-tree.jpg` | "Shower in the canopy" — full-height window framing the gnarled tree branches. Matches the slow / interior tone of a "season slowly" entry. Distinct from anything else used. |
| 519 | Journal — Three haciendas | unsplash 1551776235 | `../assets/canopy-courtyard-wing.jpg` | The manifest's horizontal establishing shot — wide view of an entire courtyard wing, ficus aerial roots on the left, linear pool with waterfall on the right. The most "estate" / wide-format frame in the set. |
| 579 | Photo strip 1 | unsplash 1564501049 | `../assets/strip-leaves-stone.jpg` | Manifest strip role. Top-down leaves on limestone pavers, palm fronds, inset uplight — pure texture. |
| 582 | Photo strip 2 | unsplash 1559827260 | `../assets/strip-tile-detail.jpg` | The cleanest "material" frame — green-and-rust fleur tile next to raw concrete. |
| 585 | Photo strip 3 | unsplash 1582719508 | `../assets/strip-onyx-sconce.jpg` | Alabaster cylindrical wall sconce glowing yellow with louvered shadow striping — pause of breath. |
| 588 | Photo strip 4 | unsplash 1540541338 | `../assets/strip-door-shadow.jpg` | Warm walnut door with iron handle, leaf-shadow on the grain — best craft-detail shot. |
| 591 | Photo strip 5 | unsplash 1551776235 | `../assets/strip-ceramic-bottles.jpg` | The three handmade ceramic toiletry bottles — bespoke-craft without being precious. |
| 595–607 | Photo strip duplicates (5x) | Same unsplash URLs | Same `../assets/strip-*.jpg` (5x) | The marquee loop needs duplicates of the same five photos in order. Preserved 1:1 with the originals. |
| 615 | `.voices-bg img` | unsplash 1542314831 | `../assets/hero-ficus-twilight.jpg` | Evening alt-hero — root-buttressed ficus at blue hour, linear pool lit cyan. Drama register fits a quiet testimonial section, and avoids reusing the main hero image. |
| 664 | `.interstitial-bg img` | unsplash 1551776235 | `../assets/breath-night-arch.jpg` | Manifest says this frame "just says come inside" — looking from dark courtyard up through tree foliage into the warmly-lit lounge through an arched steel window. Pairs with the "Una casa que respira hojas" pull quote. |
| 676 | `.location-image-wrap img` | unsplash 1505873242 | `../assets/sanctuary-corridor-evening.jpg` | The shoot has no Mérida street photography (see gap). The closest equivalent on-property is the ground-floor open-air corridor at night — palms, glowing pendants, tile inlays on polished concrete. Reads as "the limestone streets of Santa Ana at last light" but contained to the house. |
| 727 | `.offers-bg img` | unsplash 1542314831 | `../assets/canopy-waterfall.jpg` | "The most lush jungle hotel image in the set" — trees growing out of the linear pool, twin waterfall spouts. Earns the "stay a little longer" copy. |
| 103, 185, 793 | Michelin Key badges | (left as-is) | `assets/michelin-key.webp` | Self-hosted asset from R1. Brief says do not touch. |

## Asset usage roll-up

**25 of 28 photos used in V1:**

- Hero (2): hero-tree-courtyard, hero-ficus-twilight
- Sanctuary (3): sanctuary-arched-windows, sanctuary-staircase, sanctuary-corridor-evening
- Canopy / botanical (3): canopy-waterfall, canopy-overhead-pool, canopy-courtyard-wing
- Rooms (4): room-balcony-doors, room-slat-headboard, room-limestone-skylight, room-staggered-stick
- Art (3): art-window-painting, art-bar-figurines, art-chair-tableau
- Photo strip (5): strip-leaves-stone, strip-tile-detail, strip-onyx-sconce, strip-door-shadow, strip-ceramic-bottles
- Breath / interstitial (2): breath-blue-hour, breath-night-arch
- Culture (1): culture-quartet
- Editorial overflow (2): editorial-eucalyptus, editorial-shower-tree

**3 photos reserved (unused in V1, available for V2/V3):**
- `canopy-tree-pool.jpg`
- `sanctuary-corridor-day.jpg`
- `breath-hammock-waterfall.jpg`

## Gaps / fit notes

1. **No Mérida street / facade shots.** The manifest flags this gap explicitly. The Location section now uses `sanctuary-corridor-evening.jpg` (limestone tile + lantern light) as the closest tonal analog. Copy still reads "Calle 43" and the limestone streets — the image is on-property but the limestone material continuity makes it land.
2. **Journal "Hidden cenotes" entry uses an on-property plunge-pool overhead** since there are no actual cenote shots in the shoot. The water + limestone read works directionally; long-term this slot would benefit from a real cenote image.
3. **Journal "Mercado Santiago" uses the string quartet** — it's the only people-in-frame shot the shoot has, so it's the strongest "context" frame for a market entry, but it doesn't show the market. If a market photo can be sourced, swap.
4. **The Voices section** previously reused the hero image at low opacity. Switched to `hero-ficus-twilight.jpg` so the evening register reads as a moment of reflection rather than a hero echo.
5. **Aspect ratio / CLS.** No `width`/`height` attributes were set on any of the swapped `<img>` elements, and every container uses `object-fit: cover` (13 hits in style.css). Orientation mismatches (a horizontal photo landing in a vertical card, or vice versa) will crop cleanly. No further `object-position` tweaks were necessary.
6. **CSS background-image URLs:** none referenced external images — all `url()` rules in `style.css` are inline SVG data-URIs (grain noise + leaf-shaped masks). Left as-is.
7. **No layout / typography / palette / interaction changes.** R1 reviser work preserved.
