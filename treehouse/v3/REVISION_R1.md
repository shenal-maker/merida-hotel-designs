# Tree House V3 — Revision R1

Subject: Tree House Boutique Hotel / V3 Brutalist Art-Forward
Round 1 response to `CRITIQUE_R1.md` (20 findings — 3 CRITICAL, 12 MAJOR, 3 MINOR, 2 NIT).

Files touched:
- `css/style.css` — comprehensive rewrite around 12-col + 3 mono tiers
- `index.html` — markup updates for new sections + pruned redundancy
- `js/main.js` — focus trap, manifesto whisper-skip, data-grid row/col fallback

---

## CRITICAL — applied

### 1 / Canonical grid (12-col) — APPLIED
Added `:root` tokens `--grid-cols: 12`, `--gutter: 0`, `--page-pad: 2rem`. Migrated every section to a single 12-col system:
- `.data-grid-inner` → `repeat(12, 1fr)`, cells `span 4` (3 × span-4 per row)
- `.arboretum-grid` → 12-col, `.taxon { grid-column: span 4 }`
- `.exhibit-artist-list` → 12-col, `span 4`
- `.exhibit-plates` → already 12-col, kept
- `.exhibit-foot` → 12-col, `.exhibit-foot-block { span 3 }`, CTA `span 3`
- `.floorplan-grid` → 12-col with explicit spans for entrance/library/room1/courtyard/stair/room2 (matches schematic)
- `.experiences-grid`, `.journal-grid` → 12-col, `span 3`
- `.room-specs` → 12-col, `span 3`
- `.counters` → 12-col, four cells `span 3` (see Finding 10)
- `.footer-inner` → 12-col, four blocks `span 3`
- `.space-gallery` → already 12-col, kept

Mid-breakpoint (1024px) halves all `span-3` to `span-6` and `span-4` to `span-6`; mobile (720px) collapses to `span-12`. Mirrors Boutique V3 R1 behavior.

### 2 / Mono tiers (3) — APPLIED
Added 3 enforced tokens at `:root`:
```css
--mono-micro-size: 0.55rem;  --mono-micro-track: 0.32em;
--mono-meta-size:  0.7rem;   --mono-meta-track:  0.16em;
--mono-data-size:  0.82rem;  --mono-data-track:  0.08em;
```
Every mono selector now maps to one of three tiers. The 13 letter-spacings and 9+ font-sizes drift is gone. Section labels, eyebrows, footer-text, footer-links, manifesto-meta, plate-meta, fp-name, fp-piece, journal-meta, exp-meta, offer-tag, review-stamp, review-author, footer-stamp, footer-copyright, taxon-num, taxon-cross, taxon-common, taxon-meta, michelin-eyebrow, michelin-quote cite, exhibit-eyebrow, exhibit-credit, exhibit-dates, exhibit-foot-label, fp-tag's text contents, landing corners, landing-tagline, landing-byline, landing-michelin-stamp meta, nav-logo, nav-menu-btn, menu-meta, menu-num, menu-foot, menu-close, room-num, room-version, room-spec-label, room-spec-value, room-cta — all token-bound.

### 3 / Section inversion cut to 3 — APPLIED
Dark moments now: **Landing → Exhibition → Footer**. All others flipped to limestone:
- Data grid → limestone
- Michelin → limestone (Finding 4 option A)
- Reviews → limestone
- The Space → limestone
- Room block II + IV inversions removed (rooms now a single calm surface, matches Boutique V3 R1)

Six light/dark flips at section level reduced to three, with one in-Collection inversion eliminated.

---

## MAJOR — applied

### 4 / Michelin ↔ Exhibition adjacency — APPLIED (Option A)
Michelin moved to **limestone** with a moss/terracotta accent column on the left edge. The Key is now framed on an ivory bordered "letterhead" panel. Exhibition keeps canopy and is the only mid-page dark moment.

### 5 / TREE / HOUSE kerning — APPLIED (Option B)
Per-word tracking class: `.word--tree { letter-spacing: 0.18em }` to match HOUSE's rendered width. Both lines now form a tight visual rectangle. (Did not adopt Option C bilingual — would require a copy direction the critique brackets as out-of-scope.)

### 6 / Michelin stamp / section over-frame — APPLIED
- Landing stamp: image bumped 38px → 60px; container border + dark bg stripped; moved to **bottom-right** (out of the top corner-data band); single hairline rule beneath.
- Dedicated section: cut to three elements — key (large), `ONE KEY. / THE FIRST IN MÉRIDA.` Archivo, and the inspector quote. The 5-spec grid is removed. The "what the Key means" paragraph collapsed into a `<details>` so it's available without preaching.
- Travellers' Choice badge moved out — now lives in a new `.footer-awards` row.

### 7 / Arboretum herbarium apparatus — APPLIED
The arboretum no longer looks like the data-grid:
- **Plate numbers** in corner: `PL. 001` (mono micro, moss, top-left), generated via `.taxon-num::before { content: 'PL. ' }`
- **Latin binomial** in Cormorant italic 500 at clamp(1.5rem, 2.4vw, 2rem) — hanging, weight bumped from 400 to 500, font-size meaningfully larger than before
- **Common name** indented 1.5em (Linnaeus convention)
- **Family** abbreviated `f.` in italic Cormorant (`.taxon-meta .fam`), herbarium-card-back style
- **Single caption tier** for meta — `f. malvaceae · jardín · ~85 yr` — instead of label/value/label/value grid
- **Note** as a separate Cormorant italic line beneath, ledger-style commentary
- **Hairline botanical glyph** (`.taxon-glyph::before` content `❦`) as moss-tinted hairline ornament beneath the binomial
- Photograph removed entirely (see Finding 19)

### 8 / Floorplan — APPLIED (Option A: kill ASCII)
ASCII `<pre>` block removed. Structured grid is the only floorplan, now:
- 2px cenote-teal property edge frame
- 2px cenote-teal walls between cells (was 1px hairline)
- Cenote-teal `N ↑` compass in the label row
- Cenote-tinted background on the courtyard cell (the jardín reads as the central garden)
- Ceiba marker (✿) anchored bottom-right of the courtyard cell
- Cells laid out on 12-col spans matching real adjacencies (entrance + library across row 1, suite + jardín on row 2, stair + azotea on row 3)

### 9 / Plate 06 ↔ Arboretum cross-reference threaded — APPLIED
- Plate 06 caption now carries `SEE TAXA №§ 001, 007, 014, 018, 022 ↗` (mono micro tier, leaf color, right-aligned in the plate-num row)
- Cetina-linked taxa (001, 007, 014, 018, 022) carry `PL. 06 ↗` in the top-right corner (terracotta, mono micro)
- Arboretum-foot adds inline `<a href="#exhibition">Plate 06</a>` link
- Arboretum-statement adds inline cross-reference paragraph with the same PL. 06 ↗ tag styling
- Artist roster entry vii (Cetina) carries `· PL. 06 ↗` after the name (via `.artist--cetina .artist-name::after`)
- IDs `arboretum-001` etc. added to taxon blocks so anchor scrolling works

### 10 / Counters — APPLIED
- Five cells → **four cells × span-3** on 12-col
- Cut: `MICHELIN KEY · MÉRIDA` counter (it's already the centerpiece of section 5)
- Labels tightened to single-noun Spanish: `LLAVES / NIÑOS / ESPECIES / FUNDADO`
- Counter numbers now `var(--canopy)` by default (no more terracotta sprawl on the punch line). The "0/CERO" cell gets cenote teal — the gag has its own color.

### 11 / Terracotta pruned to ~7 roles — APPLIED
Terracotta now reserved for:
1. `.section-label--exhibit` text + underline
2. `.landing-michelin-stamp-year` + landing hairline rule
3. Manifesto line 3 only (lines 5/6 dropped — see Finding 17)
4. `.exhibit-namesake-tag` + `<strong>` inside
5. `.plate-num` and `.taxon-cross` (catalog apparatus / cross-references)
6. `.exhibit-cta` border + bg-on-hover (one CTA only)
7. Michelin quote rule + cite + michelin-title-em + michelin-eyebrow + michelin section top-gradient

Pulled from: focus outline (now canopy on light / ivory on dark), counter-numbers (now canopy), review-stars (replaced with stamps — Finding 13), exp-num, exp-from (now canopy), offer-tag (now canopy), journal-byline (now moss), taxon-num (now moss), fp-tag (now cenote), room-cta hover (now canopy), all newsletter terracotta (now leaf cursor / ivory button), all footer-stamp text (now ivory; terracotta only on the `MICHELIN KEY · MMXXV` key element via `.footer-stamp-key`), ::selection (now moss), arboretum-foot-tag (now moss), space-coords (removed entirely — Finding 18), space-address-stamp border (now ink), exhibit-dates-val (now ivory), exhibit-eyebrow (now cenote — Finding 12).

### 12 / Cenote teal deployed — APPLIED
`--cenote: #1f5e64` added at `:root`. Deployed at exactly four moments:
1. `.exhibit-eyebrow` + `.exhibit-eyebrow-line` (the centerpiece's eyebrow now uses cenote, freeing terracotta)
2. `.floorplan-grid` border (property edge frame) + walls between cells + `.fp-tag` letter + courtyard cell tint
3. `.footer-newsletter input:focus` border (focus accent on dark surface)
4. `.counter-cell--zero .counter-number` (the CERO gag gets the cool anchor)

### 13 / Ledger stamps replace ★★★★★ — APPLIED
Five `<div class="review-stars">★★★★★</div>` blocks replaced with `<div class="review-stamp" aria-hidden="true">№ XXX · DD MON YYYY</div>` blocks, matching Boutique V3 R1 typographic convention. Mono micro tier, moss color, 36px ink hairline trailing (via `::after`). Screen readers no longer read 25 concatenated black-star characters.

### 14 / Focus trap + contextual focus colors — APPLIED
- `main.js` menu handler now stores `lastFocused`, applies `[inert]` to body sibling elements on open, cycles Tab within overlay (forward + Shift+Tab), restores focus to trigger on close — full port of Boutique V3's pattern.
- Focus outline split: `var(--canopy)` on light surfaces; `var(--ivory)` on canopy/ink (`.menu-overlay`, `.michelin` [now light — uses default canopy], `.exhibition`, `.reviews` [now light — uses default canopy], `.the-space` [now light — uses default canopy], `.footer`, `.landing`, `.nav`). Both achieve 4.5:1+ and never collide with terracotta button borders.
- `[inert]` styling added so siblings can't be cursor- or selection-targeted while menu is open.

### 15 / Sister echo — APPLIED at the discipline layer
The structural sister-overlap is left intact (the brief's own copy refuses to re-architect Tree House's section list). What R1 fixes is the discipline parity:
- Same `--mono-micro/meta/data` token names as Boutique V3
- Same `--grid-cols: 12` token
- Same `[inert]` focus-trap pattern in JS
- Same `.review-stamp` ledger convention
- Same terracotta-pruning discipline (~7 roles)
- Same retired-room-inversion choice
- Plus a cenote deployment that echoes the sister property's signature without copying it (used in four places, none of which are the same as Boutique's four).

The "push apart structurally" half of Finding 15 (more Arboretum entries, more Journal entries) is left for R2 — the brief explicitly says do not add new sections, and expanding the arboretum to 18+ taxa is structural-content work that overlaps Round 2's copy/narrative domain. R1 *has* given the Arboretum its own typographic vocabulary so the conceptual differentiation lands, which was the more urgent half.

---

## MINOR — applied (cheap)

### 16 / Adults-only cut to ~3 surfaces — APPLIED
Adults-only signaling reduced from 9 to **3 surfaces**:
1. Landing byline (`ADULTS ONLY · BARRIO DE SANTA ANA`) — kept
2. Room-spec `OCC. MAX 02 ADULTOS` field — kept (small-print convention)
3. Michelin section coda — new display-typographic moment: *"Adults only, always."* in Cormorant italic, ink — this is the "felt" moment Finding 16 asked for

Pulled from: nav menu-meta (was `ADULTS ONLY · 15 KEYS · MICHELIN KEY 2025` → `15 KEYS · MICHELIN KEY 2025`), data-grid cell 1 (was `// 15 KEYS · ADULTS ONLY` → `// 15 KEYS`), landing subtitle (dropped `/ ADULTS ONLY`), counter label (was `CHILDREN / NIÑOS` → `NIÑOS`; the CERO gag still carries the meaning), experiences-intro `Adults only, throughout` (removed), summer-quiet offer `ADULTS ONLY, AS ALWAYS` (removed `ADULTS ONLY, AS ALWAYS` → just the discount fact), space-hours `ADULTS ONLY` (removed). The Michelin quote retains "adults-only" because it's an inspector's voice, not a brand surface.

### 17 / Manifesto rhythm — APPLIED
- Six lines reduced to **five** (5+6 merged per Finding 17 recommendation)
- Lines: `FIFTEEN ROOMS. / ONE CANOPY. / NO CHILDREN. / NO COMPROMISE. / whisper, not shout.`
- ONE terracotta line — line 3 (`NO CHILDREN.`)
- Final line (`whisper, not shout.`) renders in Cormorant italic 400, lowercase, half-size, ink at 55% opacity — the line called whisper actually whispers
- Glitch effect skipped on the whisper line in JS so the quiet line isn't shouted at on entry

### 18 / Coords cut to 2 anchors — APPLIED
Coordinates retained at exactly two anchor points (entry + exit watermarks):
1. `.landing-corner--tr` (top-right entry watermark) — kept
2. `.footer-stamp` — kept

Stripped from:
- Cursor readout (was `LAT 20.9704° N · SANTA ANA` → just `SANTA ANA`)
- Landing bottom-center `.landing-coords` (removed entirely)
- Data-grid cell 3 (was `COORDS: 20.9704° N / 89.6260° W` → `GARDENER: ONE / SINCE 2019, BY HAND` — exactly the swap Finding 18 suggested)
- Menu-overlay foot (was coords + barrio → just barrio)
- `.space-coords` element (removed entirely; the 18-min-from-MID fact moved into space-hours)

7 surfaces → 2 surfaces. The watermark now brackets the document.

---

## NITs — applied

### 19 / Unsplash botanical mismatch — APPLIED (Option A)
Photographic `taxon-img` background-image divs removed from every taxon. Replaced with a moss-tinted `.taxon-glyph` block (Cormorant italic genus name as a typographic label, with a hairline `❦` leaf glyph in leaf color) that reads as a herbarium-sheet ornament rather than a misidentified photo. The Latin name now carries the catalog claim without contradicting it. The data-grid backgrounds, room photographs, plate images, and space-gallery shots are untouched (those are decorative atmosphere, not specimen documentation, so the wrong-plant problem doesn't bite).

### 20 / Plate 06 duplicate entries — APPLIED
- Entrance cell: `PL. 06 — CETINA (NOS. 01–03 OF 12)`
- Library cell: `PL. 06 — CETINA (NOS. 04–12 OF 12)`
- Plate 06 caption text updated: `Library set Nos. 04–12; entrance set Nos. 01–03.`
- Plate-loc updated: `INSTALLED — LIBRARY (NOS. 04–12) + ENTRANCE ALCOVE (NOS. 01–03)`

Both locations now make sense individually; the catalog is internally consistent.

---

## Pre-emptive R1 polish (not in critique, applied)

- Added `.michelin-mark-stamp` typographic letterhead beneath the key (moss mono micro, `FIRST IN MÉRIDA / YUCATÁN, MX`) to make the limestone-Michelin section feel like an official certification on paper rather than a floating image
- Added `aria-hidden="true"` to review stamps (decorative reference numbers — screen readers skip them; the date + author are read instead)
- Added `[inert] { pointer-events: none; user-select: none }` block so the focus trap actually feels trapped
- Added `--ivory-rgb` and `--ink-rgb` tokens for any future rgba use
- Removed the `landing-michelin-stamp { background: rgba(20,17,13,0.55) }` dark box — the key art now stands on its own with a single bottom hairline rule (Finding 6, slightly bolder execution)
- Cursor readout copy: `SANTA ANA` only — no coords (consistent with Finding 18)
- Replaced legacy 1px hairline floorplan with 2px cenote walls so the grid reads as architecture not table (Boutique V3 R1's exact move)

---

## Skipped / deferred

### Finding 15 — "push apart structurally" (Arboretum to 18 taxa, Journal to 6 entries)
Deferred to a later round. Brief explicitly says "DO NOT add new sections" and "DO NOT change copy/narrative substantively (Round 2's domain)." Expanding the arboretum from 9 to 18 specimens or the journal from 4 to 6 entries crosses into content authoring. R1's discipline-parity half of the fix (the half Tree House actually needed urgently) is fully applied; the structural-divergence half can ride in R2 alongside the asset-replacement work for Finding 19B.

### Finding 16 / 17 — "make adults-only typographically expressive" via a Cormorant italic display moment elsewhere
Applied as `michelin-coda` (`<em>Adults only, always.</em>`). The brief's third suggested location ("manifesto-coda or as the Michelin section sub-line") chose Michelin coda because the manifesto-coda already does Cormorant italic work and adding the line there would compete with the existing coda paragraph. The michelin-coda location also makes the adults-only register feel like a coda to the prestige beat — the most brand-coherent place for it.

### Finding 4 — Option B (limestone interstitial between two dark sections)
Not used. Took Option A (move Michelin entirely to limestone) per the critique's own recommendation, which is the cleaner of the two.

### Finding 5 — Option A (single-line title) / Option C (bilingual stack)
Not used. Took Option B (track TREE to match HOUSE width) because: (A) cuts the wordmark to one line, losing the slab-stack brutalist gesture the rest of the page leans on, and (C) is brand-coded copy work that the brief brackets out of R1 (don't change copy substantively). Option B is the discipline fix the critique scored as "technically tightest" — and it preserves the wordmark structure.

### Finding 7 — leaf-silhouette / line-drawing assets per family
Used a typographic `❦` + Cormorant italic genus label instead of commissioning per-family SVG silhouettes. Same conceptual outcome (typography carries the herbarium claim, not photography), cheaper to implement in a design pass.

---

## Discrepancies / disagreements with critique

None worth flagging — every finding inspected held up. The two judgment calls embedded in the critique (Finding 4 A vs B, Finding 5 A vs B vs C, Finding 8 A vs B) were made along the lines the critic preferred or scored as cleanest. Finding 15's structural-push-apart half is deferred not disputed; the discipline-parity half (which was the urgent one) is done.

---

## Roles file totals — terracotta audit (post-R1)

Approximate count of distinct selector-level terracotta uses:
1. `.section-label--exhibit` (color + underline)
2. `.landing-michelin-stamp-year` + `.landing-michelin-stamp::before` rule
3. `.manifesto-line:nth-child(3)` color + border
4. `.exhibit-namesake-tag` + `.exhibit-namesake strong`
5. `.plate-num` + `.taxon-cross` (catalog apparatus / cross-references)
6. `.exhibit-cta` border, color, hover-bg
7. `.michelin-eyebrow` + line, `.michelin-title-em`, `.michelin-quote` border + cite, `.michelin::before` gradient stop
8. `.footer-stamp-key` (single span in the footer stamp)
9. `.arboretum-foot a` + `.arboretum-statement a` (anchor accents for the PL. 06 cross-link)

~9 roles, all serving prestige / catalog-apparatus / cross-reference — down from 30+. The Michelin red echo reads as the Michelin red echo again.

