# V2 — Editorial Magazine — Photo Swap Log

Replaced all 17 Unsplash placeholders in `v2/index.html` with curated property photography from `../assets/`. No CSS background-image rules pointed at external photo CDNs — only the SVG-noise data URI and one local gradient. Both untouched. The Michelin Key webp and the footer logo png (both self-hosted on treehouseboutiquehotel.com) are preserved per brief.

## Swap table

| Plate / slot | Section | Previous (Unsplash) | New (local) | Caption change |
|---|---|---|---|---|
| Preload + Lám. I | Hero | photo-1542314831 | `hero-tree-courtyard.jpg` | Yes — "Estudio botánico, Yucatán (imágen representativa)" → "La casa bajo el dosel, Santa Ana" (placeholder language dropped) |
| Lám. II | Editor's Note | photo-1559827260 | `sanctuary-corridor-day.jpg` | None — caption "Esquina del patio, mañana" still fits the morning-corridor frame |
| Lám. III | Sanctuary left | photo-1551776235 | `canopy-courtyard-wing.jpg` | Yes — "Muro vegetal, ala oeste" → "Ala del patio, dosel y agua" (the photo is the wing with linear pool, not a green wall) |
| Lám. IV | Sanctuary right | photo-1571896349842 | `sanctuary-arched-windows.jpg` | Yes — "Habitación, hora botánica" → "Salón verde, hora botánica" (the photo is the lounge with arched windows, not a bedroom; bedrooms are reserved for Habitaciones section) |
| Lám. VI | Habitaciones — King Garden | photo-1551882547 | `room-slat-headboard.jpg` | None |
| Lám. VII | Habitaciones — Queen Courtyard | photo-1582719508 | `room-balcony-doors.jpg` | None — "window opens onto the canopy" copy fits the French-doors-to-tree frame |
| Lám. VIII | Habitaciones — Garden Suite | photo-1564501049 | `room-staggered-stick.jpg` | None — sculptural room reads as "widest of our suites" |
| Lám. IX | Habitaciones — Penthouse Canopy | photo-1520250497 | `room-limestone-skylight.jpg` | None — skylights read as "top of the house" |
| Lám. X | Treehouse frontispiece | photo-1577720580 | `breath-night-arch.jpg` | Yes — "Sala mayor, The Treehouse" → "Sala mayor, vista desde el patio" (looking from courtyard into the lounge through arched window) |
| Lám. XI | Treehouse full-bleed | photo-1594736797 | `sanctuary-corridor-evening.jpg` | Yes — caption rewritten to describe the lit corridor at dusk rather than three canvases (no actual canvas-on-wall photos in the set) |
| Lám. XII | Treehouse plate | photo-1554907984 | `art-window-painting.jpg` | Minor — "courtyard wall" → "salón verde" (more accurate to the frame); rest of caption fits the painting-seen-through-window-near-tree-branches composition |
| Lám. XIII | Treehouse plate | photo-1536924940 | `art-bar-figurines.jpg` | Yes — "Hojas (IV), A. Pacheco / Mixed media on paper — Garden Suite" → "Dos Figuras, A. Pacheco / Cast bronze on walnut — bar shelf, ala oriente" (the photo IS sculpture, not paper-on-wall) |
| Lám. XIV | Treehouse plate | photo-1605351792 | `art-chair-tableau.jpg` | Yes — "Raíz, J. Manzón / Cast bronze — library alcove, north" → "Conversación, tableau Nº III / Sillas, mesa, eucalipto — library alcove, north" (the photo is a chair-and-table tableau, not a bronze; kept the library-alcove location anchor) |
| Lám. XV | Photo essay | photo-1540541338 | `canopy-tree-pool.jpg` | None |
| Lám. XVI | Photo essay | photo-1505873242 | `breath-blue-hour.jpg` | Yes — "Calle 43, atardecer" → "Fuente, hora azul" (no street/exterior shot in the set; fountain at twilight covers the same "blue evening of Santa Ana" beat) |
| Lám. XVII | Photo essay | photo-1551776235 | `strip-leaves-stone.jpg` | Slight — "Detalle — Ficus" → "Detalle — hoja sobre piedra" (the photo is leaves on limestone, not a wall of ficus) |
| Lám. XVIII | Photo essay | photo-1571896349 | `strip-door-shadow.jpg` | Yes — "Lino, hora dorada" → "Puerta, sombra de hoja" (no bed/linen close-up in the set; door-with-leaf-shadow is the closest "warm hour" frame) |
| Lám. XIX | Photo essay | photo-1551038247 | `editorial-eucalyptus.jpg` | Yes — "Bugambilia, muro sur" → "Eucalipto sobre azulejo" (no bougainvillea shot in the set; eucalyptus-on-tile is the closest botanical-on-architecture frame) |
| Lám. XX | Photo essay | photo-1571079570 | `canopy-waterfall.jpg` | Yes — "Cenote, mañana" → "Agua del patio, mañana" (no cenote shot in the set; the courtyard waterfall is the closest "water in green" frame) |
| Lám. XXI | Photo essay | photo-1520250497 | `canopy-overhead-pool.jpg` | None — overhead-pool-with-palms reads as "Palmas, azotea" |
| Lám. XXII | Photo essay | photo-1559827260 | `sanctuary-staircase.jpg` | None — quiet staircase corner reads as "Salita, esquina" |

## Plate numbering

Preserved as-is. The existing sequence (I, II, III, IV, then VI, VII, VIII, IX — V is skipped in the original) was not changed. All Roman numerals in plate-ref cross-references (XV, XIX, XX, XXI in copy) remain valid because each cross-referenced plate still exists at the same number.

## Body-copy cross-reference checks

- Editor's Note line "See *Lám. II*, opposite, for the corner of the patio at which the laptop was open" — still works; Lám. II is now the morning corridor.
- El Diario Nº 01 references "see *Lám. II*" — still works.
- Sanctuary text "At three in the afternoon (see *Lám. XV*)" — still works; Lám. XV is the dappled tree-pool at golden/afternoon light.
- Sanctuary text "the spring rotation through the corridors" + "a private gallery space (see *Lám. X*)" — still works; Lám. X is now the lounge-through-arch.
- Treehouse "(see *Láms. X–XIII*)" — all four plates still present.
- Curated Mérida "one in *Lám. XX*" referring to a cenote — caption changed from "Cenote, mañana" to "Agua del patio, mañana." The body copy still says "Three cenotes the tour buses do not know — one in Lám. XX" which now references a courtyard waterfall instead of a cenote. **This is a copy/photo mismatch.** Did not touch the body copy per "R2 copy revisions are not yours to undo" — flagging here so the writing team can either (a) accept the caption as a stand-in image and rephrase the body sentence, or (b) commission a cenote shot. Leaving the reference live with a documented gap.
- Photo essay intro "the *bugambilia*, *Lám. XIX*" — Lám. XIX now shows eucalyptus on tile. **Same mismatch class.** Intro copy still names bougainvillea; caption now says eucalipto. Flagged.
- Photo essay intro "the rooftop palms, *Lám. XXI*" — still accurate.

## Gaps documented

The following slots had no good local fit; closest substitute used, body copy left intact:

1. **Cenote (Lám. XX, Curated Mérida iv).** No cenote photography in the 28-photo shoot. Used the courtyard waterfall as a "water in green" stand-in. **Re-shoot recommendation:** a single cenote frame would unlock Curated Mérida and a separate plate.
2. **Bougainvillea on the south wall (Lám. XIX, plus the bougainvillea-ink/Don Eulogio Diario entries' implicit visual cue).** No bougainvillea in the shoot. Used eucalyptus-on-tile. **Re-shoot recommendation:** the south wall in bloom, in vertical, would resolve the most named botanical motif in the copy.
3. **Calle 43 / facade / street exterior (Lám. XVI).** No exterior of the casona from the street. Used the fountain at blue hour. **Re-shoot recommendation:** the entry/facade from Calle 43, dusk — manifest already flags this as a top gap.
4. **Bedroom linen / golden-hour bed close-up (Lám. XVIII).** Substituted the warm door-with-leaf-shadow detail; same hour and palette, different subject.
5. **Bronze sculpture in a library alcove (Lám. XIV).** Substituted the chair-table tableau; caption rewritten to describe the actual photo.
6. **Three-canvas hung gallery wall (Lám. XI).** No installed-work-on-wall photography in the shoot at all. Substituted the lit corridor at dusk; the eastern-corridor anchor in the caption still works.
7. **String quartet / culture programming.** `culture-quartet.jpg` was not placed — the V2 page has no "experiences / programming" slot with imagery. Held for V3 or a future Curated Mérida visual treatment.
8. **Hammock-over-water moment (`breath-hammock-waterfall.jpg`).** Not placed. Strong "afternoon here" image — candidate for a future visit/season block.
9. **Material/strip details (`strip-tile-detail.jpg`, `strip-onyx-sconce.jpg`, `strip-ceramic-bottles.jpg`).** Two are unused in V2. The masthead/El Estándar/Voices sections do not carry imagery in V2's design — would need a layout change to slot these, which is out of scope.
10. **Editorial overflow (`editorial-shower-tree.jpg`).** Not placed. The "shower in the canopy" frame would be a strong fit if Habitaciones gained a fifth plate or a bath/wellness side-figure.

## Captions changed because the photo content required it

Six captions were rewritten beyond the title change:

- Lám. III: "Muro vegetal, ala oeste" → "Ala del patio, dosel y agua"
- Lám. IV: "Habitación, hora botánica" → "Salón verde, hora botánica"
- Lám. X: "Sala mayor, The Treehouse" → "Sala mayor, vista desde el patio"
- Lám. XI: full caption text rewritten to describe corridor at dusk (no canvases visible)
- Lám. XIII: title + meta rewritten — *Hojas (IV) / mixed media on paper* → *Dos Figuras / cast bronze on walnut*
- Lám. XIV: title + meta rewritten — *Raíz / cast bronze* → *Conversación / sillas, mesa, eucalipto*
- Lám. XVI: "Calle 43, atardecer" → "Fuente, hora azul"
- Lám. XVII: "Detalle — Ficus" → "Detalle — hoja sobre piedra"
- Lám. XVIII: "Lino, hora dorada" → "Puerta, sombra de hoja"
- Lám. XIX: "Bugambilia, muro sur" → "Eucalipto sobre azulejo"
- Lám. XX: "Cenote, mañana" → "Agua del patio, mañana"

All alt text rewritten to describe the actual photo per the manifest notes, replacing the prior representative-image phrasing.

## Preserved per brief

- Reading-progress spine, page counter (Roman numerals), section data-attributes.
- Drop caps, plate-ref cross-references, kicker/small-caps typography.
- Plate-numbering sequence (I → XXII, with V skipped as in original).
- Michelin Key self-hosted webp (4 instances) — untouched.
- All R1 and R2 body copy (the Lám. XX cenote and Lám. XIX bugambilia mismatches are flagged above rather than fixed).
- Drawn rules (`draw-line` hr), section markers, reveal-line animations.
- Footer logo png (treehouseboutiquehotel.com) — kept as the brand mark.

## Count

- **Swapped:** 22 external photo references replaced (21 `<img>` tags + 1 `<link rel="preload">`). Hero photo is referenced twice (preload + hero img); all other references are unique.
- **Removed external photo CDN references:** 22/22 (0 Unsplash URLs remaining).
- **Unique local photos used in V2:** 21 of 28 available.
- **Local photos held for V3 or future use:** 7 (`culture-quartet`, `breath-hammock-waterfall`, `strip-tile-detail`, `strip-onyx-sconce`, `strip-ceramic-bottles`, `editorial-shower-tree`, `hero-ficus-twilight`).
