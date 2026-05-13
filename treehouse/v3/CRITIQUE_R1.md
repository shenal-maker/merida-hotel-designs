# Tree House V3 — Critique R1

Subject: Tree House Boutique Hotel / V3 Brutalist Art-Forward
Style anchor: Peter & Paul + Pan & Koffee V3. Limestone/canopy high-contrast, hotel-as-arboretum-as-gallery.
Focus area: visual hierarchy & typography.

The variant is ambitious and the conceptual move (hotel = arboretum = gallery, namesake-venue moment, taxonomic Latin against condensed Archivo 900) is the right one. But it inherits almost every R1-grade problem the Boutique sibling already had its critique on, *plus* a green-monoculture problem of its own. The art catalog is rich; the apparatus underneath is loose.

---

## 1. No canonical grid — every section invents its own. **CRITICAL**

**What.** There is no shared grid token. `:root` defines `--moss`, `--canopy`, `--mono`, `--sans` — but no `--grid-cols`, no `--gutter`, no `--page-pad`. Inspecting actual sections:
- `.data-grid-inner` → `repeat(3, 1fr)` (3-col implicit)
- `.exhibit-plates` → `repeat(12, 1fr)` (12-col)
- `.exhibit-artist-list` → `repeat(auto-fill, minmax(280px, 1fr))` (fluid)
- `.exhibit-foot` → `repeat(auto-fit, minmax(220px, 1fr))` (fluid)
- `.floorplan-grid` → `repeat(3, 1fr)`
- `.arboretum-grid` → `repeat(3, 1fr)` (3-col)
- `.counters` → `repeat(5, 1fr)` (5-col — doesn't divide either 12 or 3)
- `.reviews-grid` → `repeat(12, 1fr)`
- `.space-gallery` → `repeat(12, 1fr)`
- `.journal-grid`, `.experiences-grid`, `.michelin-specs`, `.room-specs`, `.footer-inner` → fluid `auto-fit`

So a single page mixes 3-col, 5-col, 12-col, and four different auto-fit minmaxes. The plates land on a 12-col grid; the cell directly above them (artists) is auto-fit; the cell directly below (floorplan) is 3-col. Edges do not align.

**Why it matters.** Brutalist + art-catalog typography reads as discipline. Discipline reads as a grid the eye can find without thinking. Pan & Koffee and Peter & Paul don't switch grid systems between sections — they hold one and let it cut through. Mixing 3 / 5 / 12 / auto-fit means the page *feels* designed-by-section, not designed-as-catalog. It's the single biggest reason the layout reads "ambitious but inconsistent" rather than "rigorous."

**Fix.** Define `--grid-cols: 12`, `--page-pad: 2rem` at `:root`. Opt every section into 12:
- data-grid → 9 cells × span-4 (or 3 × span-4 per row)
- arboretum → 9 cells × span-4
- floorplan-grid → spans 4+4+4 on the same 12 base
- counters → 5 cells = 4 × span-2 + 1 × span-4 (sums to 12; matches what Boutique V3 R1 did with the `--wide` cell)
- experiences/journal/michelin-specs/room-specs/footer-inner → span-3 on a 12 base, or span-6 at mid-breakpoint
This is the same surgery Boutique V3 already received in revision; it has to happen here.

---

## 2. Mono microcopy has no enforced tiers — sizes drift continuously from 0.5rem to 0.85rem. **CRITICAL**

**What.** Counting unique `font-size` values on mono text in this stylesheet: `0.5rem`, `0.55rem`, `0.6rem`, `0.62rem`, `0.65rem`, `0.7rem`, `0.72rem`, `0.75rem`, `clamp(0.55rem, 0.85vw, 0.78rem)`, `clamp(0.6rem, 1vw, 0.78rem)`, `clamp(0.65rem, 1.2vw, 0.85rem)`, `clamp(0.7rem, 1vw, 0.9rem)`, `clamp(0.62rem, 1vw, 0.78rem)`. Same survey on `letter-spacing`: `0.05em`, `0.08em`, `0.1em`, `0.12em`, `0.15em`, `0.18em`, `0.2em`, `0.22em`, `0.25em`, `0.28em`, `0.3em`, `0.32em`, `0.4em`. That is **13 spacings and 9+ sizes** across mono.

The brief explicitly says "3 clear tiers (eyebrow / meta / data)." There aren't three; there are a dozen, applied selector-by-selector.

**Why it matters.** Mono is the structural connective tissue of this design — it labels every cell, every plate, every taxon. When mono drifts, the eye stops trusting it as a system and starts reading it as decorative noise. The art-catalog framing dies without disciplined apparatus. Boutique V3 named this finding CRITICAL and applied 3 enforced tokens; the same fix is required here.

**Fix.** Add to `:root`:
```css
--mono-micro-size: 0.55rem;  --mono-micro-track: 0.32em;  /* legals, watermark coords, copyright */
--mono-meta-size:  0.7rem;   --mono-meta-track:  0.16em;  /* labels, eyebrows, run-of-page */
--mono-data-size:  0.82rem;  --mono-data-track:  0.08em;  /* numerical specs you scan */
```
Map every existing mono selector to exactly one tier. Eyebrow tier = `--mono-meta`. Section labels = `--mono-meta`. Cursor readout, landing corners, manifesto-meta, plate-loc, footer-stamp, footer-copyright, taxon-num = `--mono-micro`. Room-spec-value, michelin-spec-value, taxon-meta value side, exhibit-dates-val, exp-from = `--mono-data`. Burn the 13 drift sizes.

---

## 3. Section inversion is constant: limestone ↔ canopy flips ~9 times in 12 sections — no rhythm, just oscillation. **CRITICAL**

**What.** Section background sequence top-to-bottom:
1. Landing — canopy
2. Manifesto — limestone
3. Data grid — **canopy**
4. Collection — limestone (with room blocks II and IV individually re-inverted to canopy → so within Collection alone the bg flips three more times)
5. Michelin — **canopy**
6. Exhibition — **canopy** (back-to-back with Michelin)
7. Arboretum — limestone
8. Journal — ivory
9. Experiences — limestone
10. Reviews — **canopy**
11. Counters — limestone
12. Space — **canopy**
13. Footer — ink

That's roughly six light/dark flips at section level, plus two extra mid-Collection inversions inside one section. There is no narrative reason for the data grid to be dark while Michelin is dark while Exhibition is dark — those are three different *kinds* of moment treated identically.

**Why it matters.** Inversion is the loudest tool in the brutalist kit. Use it once and it's a thunderclap. Use it nine times and the page reads as a checkerboard. Boutique V3's R1 fix reduced inversion to **three** dark sections at narrative beats (landing entry, exhibition centerpiece, footer sign-off). The same discipline is needed here — and it's more important here because the canopy green is darker than Boutique's ink, so the dark sections weigh more.

**Fix.** Pick three dark moments and commit:
- **Landing** (entry)
- **Exhibition** (centerpiece — this is the namesake venue, it earns the inversion)
- **Footer** (sign-off)

Flip Michelin, data-grid, reviews, the-space, and the room-block-II/IV inversions back to limestone (or, for Michelin specifically, to a single moss-tinted limestone variant that holds the prestige beat without competing with Exhibition; see Finding 4). Move the manifesto-strip rail and a few hairline rules to do the *rhythmic* work that inversion is currently being asked to do.

---

## 4. Michelin canopy → Exhibition canopy back-to-back: the prestige beat gets eaten by the centerpiece. **MAJOR**

**What.** Builder flagged this. After confirming: yes, sections 5 and 6 are both `background: var(--canopy)` with no separating limestone breath. The Michelin section already pulls the eye with the round red key + the orange Travellers' Choice badge + a terracotta gradient top-rule + a Cormorant blockquote. Then immediately the Exhibition section opens with `.section-label--exhibit` (canopy bg, terracotta text) followed by the same canopy with a 13rem Archivo headline. The two strongest moments in the page hit consecutively on the same value. The eye has no place to rest, and the second one — the *centerpiece* — loses impact because the first one already exhausted the dark register.

**Why it matters.** The Michelin Key is real prestige. The Exhibition is the brand's namesake. They are *different kinds of* prestige and need different staging. Right now they share a color register and the centerpiece (which should be the page's peak) reads as "another dark section." This is a worse problem than in Boutique V3 because the Tree House dark is darker (canopy `#1a2e1f` vs Boutique ink `#1a1410` — within 10% lightness of each other, both very dark) so the back-to-back is less differentiated.

**Fix.** Two viable moves:
- **(A)** Move Michelin to a *limestone* section with the Michelin Key art-treatment elements doing the heavy lifting — a hairline-bordered card, the round red key as the focal mark on an off-white field, terracotta sub-rule, moss text. The Key reads "official certification on letterhead." Exhibition then keeps canopy and earns its weight as the *only* dark editorial moment.
- **(B)** Keep both dark, but introduce a 1-screen limestone interstitial between them — a single quotation or a `.section-label`-only band on limestone. Acts as a palate cleanser. Boutique V3 has the manifesto-strip rail doing similar work between its earlier inversion sequence; replicate that pattern here.

Either is fine. Doing nothing is not.

---

## 5. Two-line title "TREE / HOUSE" stacks unevenly — Archivo 900 wants to be one block. **MAJOR**

**What.** The hero h1 splits across two lines:
- Line 1: `TREE` (4 letters)
- Line 2: `HOUSE` (5 letters)

At `clamp(3rem, 14vw, 17rem)`, line-height 0.85, letter-spacing -0.055em, that gives a roughly 4:5 letter-count ratio with no width matching. "HOUSE" is meaningfully wider than "TREE." The composition reads as left-anchored-but-not-quite — neither flush-left, nor visually balanced, nor a deliberate ragged-right gesture. Compared with Boutique V3, where the single word "BOUTIQUE" (8 letters) is a unified slab, this two-line stack feels like the designer wrote "TREE HOUSE" and then didn't decide what to do with it.

**Why it matters.** The wordmark is the brand. Brutalist condensed display at 17rem must *land*. Right now it lands sloppily — the brand sits as two words of unequal width, centered, with the gap between them swallowed by line-height 0.85, producing a shape that's neither a square nor a rectangle nor a rhomboid — just a near-shape.

**Fix.** Three options, pick one:
- **(A)** Single line: `TREE HOUSE` with a thin-space or short rule between the words. Lose the cap on font-size if needed (`clamp(2.4rem, 11vw, 13rem)`) so it fits on one row at all breakpoints. This is the Boutique-V3 sibling-echo move and is the safest.
- **(B)** Stack with width-match: `TREE` line, `HOUSE` line, but track `TREE` to match `HOUSE`'s rendered width (probably ~0.04em → ~0.18em positive tracking on `TREE` only). Then the two lines are equal-width and the stack reads as a tight rectangle — a proper slab. Apply via a `--tree-line-track` per-word.
- **(C)** Bilingual stack: `TREE` (English) line, `casa·árbol` (Spanish Cormorant italic) line — uses the same visual move that Exhibition and Arboretum use elsewhere on the page (Archivo + Cormorant italic counterweight). Brand-coherent, leans into "Bilingual: lean *more* into Spanish than Boutique" from the brief.

(C) is the strongest brand-wise. (A) is the safest. (B) is the technically-tightest brutalist read.

---

## 6. Michelin Key fixture is technically present in two places, but the landing stamp is undersized and the dedicated section over-frames. **MAJOR**

**What.**
- Landing stamp: 38×38px image inside a 0.5rem-padded container, tucked under the nav, at `top: 5rem` — visually it reads as a sticker, not a credential. Sits in the same `top: 5rem` band as the two corner data-readouts, so it competes with three other things in the same horizontal band.
- Dedicated Michelin section: 220px key + 110px Travellers' Choice badge + terracotta top-gradient + giant Archivo `ONE KEY.` + 5 spec cells + Cormorant blockquote + "what the key means" paragraph. **Too much.** The Michelin Key is one accolade. The section currently treats it like a stamp catalog — five "MICHELIN-SPEC" cells, a quote, *and* an explainer.

**Why it matters.** Prestige is restraint. The Michelin guide itself uses one key icon, a city tag, and the property name — nothing else. Tree House is loading the moment up to compensate for thinness elsewhere, but the effect is the opposite: the prestige reads as *eager*.

**Fix.**
- **Landing stamp:** bump key to ~56–64px. Strip the box (`border: 1px solid rgba(184,90,58,0.45)` + dark background) and let the key art stand on its own with a single hairline rule under "MICHELIN KEY · MMXXV · FIRST · MÉRIDA, YUC." Position bottom-center or top-right (out of the corner-data band).
- **Dedicated section:** cut to three elements — the key (large), the Archivo `ONE KEY. / THE FIRST IN MÉRIDA.`, and the Michelin inspector quote. Drop the 5-spec grid (the year and city are already in the quote eyebrow). Drop "what the key means" — or move it into a tiny `<details>` so it's available without being preached. The Travellers' Choice badge is a *different* award and currently confuses the visual ("two badges, both red-ish, side-by-side") — relegate to the footer awards row.

---

## 7. The Arboretum is the brand's most unique section — and typographically it looks identical to the Data Grid. **MAJOR**

**What.** Compare:
- **Data grid cell:** mono number → mono caption with `<br><small>`. 3-col grid. Bg-image on hover.
- **Arboretum taxon:** mono `№ 001` → 120px image strip → Cormorant italic Latin → mono common name → mono key/value meta grid. 3-col grid.

The Latin name (Cormorant italic) is the only typographic gesture that says "specimen catalog" — everything else is identical brutalist-grid apparatus. There's no leaf icon, no hairline botanical motif, no "FAM." abbreviation indent convention, no Linnaeus-style hanging punctuation, no plate-style edge tabs. A real herbarium page has *its own* typographic vocabulary — hanging Latin binomials, indented vernacular, fine-rule data tables, often a watercolor or pen-and-ink figure with its own caption tier. This grid could be specs for a sneaker drop.

**Why it matters.** The Arboretum is what makes Tree House *Tree House and not Boutique*. The brief flags it explicitly as the property's signature. If the Arboretum reads as "data grid with Latin names," the brand has nothing the sister doesn't. It's the single biggest distinctness lever — and it's currently being underused.

**Fix.**
- Add a **plate number convention** in margins: each taxon gets `PL. 001` corner-set in micro mono, like an actual herbarium sheet.
- **Latin binomial** in Cormorant italic 500, hanging — left edge sets the optical baseline, common name indents 1.5em.
- **Family** abbreviated `f. MALVACEAE` (italic short form, herbarium convention) instead of `FAMILIA / MALVACEAE` data-pair.
- Replace the photographic `taxon-img` with a moss-tinted **silhouette/illustration treatment** (CSS `filter: grayscale(1) brightness(0.95) sepia(0.3) hue-rotate(60deg)`) so it reads as a botanical plate, not a stock photo. Or commit to actual line-drawing assets if available.
- Add a **hairline botanical motif** (a thin leaf or vine svg as a 16px right-margin ornament for `taxon` cards on hover) — the kind of motif the brief calls out for the V2 variant but which earns space here too if used subtly.
- Optionally: collapse `taxon-meta` from the current "label/value/label/value" grid into a **single mono caption tier** (`f. malvaceae · jardín · ~85 yr`) so that the data reads as a herbarium card-back, not a data-cell.

The point isn't to add more — it's to swap *out* the data-grid-shaped apparatus and swap *in* herbarium-shaped apparatus, so the section's typography earns the conceptual claim.

---

## 8. Floorplan ASCII + structured grid: both present, both partial, neither authoritative. **MAJOR**

**What.** Builder flagged. Confirmed:
- `<pre class="floorplan-ascii">` block: 6 zones labeled A/B/C/D/E/F with `▴ plate XX` markers and `✿` flowers around the ceiba.
- `.floorplan-grid` directly below: same 6 zones labeled A/B/C/D/E/F with `.fp-piece` mono text describing the same installations.

The two representations duplicate content with slight inconsistencies — `[E] SUITE №II · ▴ pl.02` in ASCII vs `E · SUITE № II · PLATE 02 — QUIÑONES` in the grid (one says "pl.02," the other "PLATE 02 — QUIÑONES"). Both occupy meaningful vertical space. Both claim to be the floorplan.

**Why it matters.** Two of anything in brutalism is usually one too many. ASCII art *can* earn a place — it's a brand-coherent gesture for this aesthetic — but only if the structured grid is doing something the ASCII can't, or vice versa. Right now they're saying the same thing twice, which makes both feel like draft material.

**Fix.** Pick one of two paths:
- **(A) Kill the ASCII.** Keep only `.floorplan-grid`. Bump its borders (Boutique V3 R1 went from 1px hairlines to 2px walls for exactly this reason — to make the grid read as architecture rather than a table). Add a North arrow and a property-edge frame. Now the structured grid *is* the schematic.
- **(B) Keep the ASCII, kill the grid.** Treat the `<pre>` block as the only floorplan. It already has the flowers around the ceiba and the zone tags. Make it the deliberate brutalist gesture, full-width, generous padding, and let it speak alone. Below it, the existing `.exhibit-foot` block (partners / program / catalog) supplies the structured data.

(A) is the safer move; (B) is the bolder one. Doing both is the worst move and is what's currently on screen.

---

## 9. Cross-reference between Arboretum and Exhibition Plate 06 is asserted in copy but not threaded typographically. **MAJOR**

**What.** Builder flagged the Paloma Cetina Plate 06 ↔ Arboretum link. The mechanism is there:
- Plate 06: *Herbarium, Santa Ana* — Paloma Cetina — set of 12 botanical illustrations.
- Arboretum foot: "Full *Herbarium, Santa Ana* by Paloma Cetina hangs in the library — referenced in Plate 06."

But the link is invisible until you read both blocks of body copy. There's no anchor link, no shared visual token, no "see PLATE 06 ↑" marginalia, no Cetina byline carried over to the arboretum hover state, no shared figure-numbering scheme. Two pages of the same catalog should *show* their relationship.

**Why it matters.** The conceit "the arboretum is the live catalog; the herbarium plates *are* the arboretum drawn" is genuinely good. It earns the entire Tree-House-as-namesake conceit. But it's hidden in prose. A catalog reader would expect: a plate stamp near the Cetina taxon entries, a cross-reference numeral, a parallel set of 12 numbered cards. The link is the cleverest thing on the page, and right now it's whispered, not threaded.

**Fix.**
- Add a `PL. 06 ↗` marginal note to the Cetina-linked taxa (entries that the Herbarium series depicts — Ceiba, Plumeria, Bougainvillea, etc.). Mono micro tier, terracotta, top-right of `.taxon`.
- Add `SEE TAXA №§ 001, 007, 014, 018, 022 ↗` to the Plate 06 caption-meta line.
- Make both anchors actually scroll (the cross-anchor existing href could be `#arboretum-001`).
- Optionally: shared figure number — `FIG. 001` vs `TAXON № 001` vs `PLATE 06.001` — pick one numeric universe and let it run.

This isn't a polish item; it's the bridge that makes the conceptual move legible.

---

## 10. Counters row has five cells but the labels read like prose, not glance-data. **MAJOR**

**What.**
- 15 — "ROOMS / LLAVES"
- 1 — "MICHELIN KEY · MÉRIDA"
- 0 (renders "CERO") — "CHILDREN / NIÑOS"
- 42 — "SPECIES / ESPECIES"
- 2019 — "EST. / DESDE SANTA ANA, MÉRIDA"

Issues:
- The "0 / CERO" cell uses `data-text="CERO"`, so JS overrides the count animation and just dumps the Spanish word in. Good gag — but it lands flat because at glance, you see four numerals and one word. The eye reads "list of numbers (mostly) with one weird word."
- "MICHELIN KEY · MÉRIDA" is two facts ("MICHELIN KEY" + "MÉRIDA"). The cell is asking the number `1` to carry "the only one of these in this city," which is more than a counter number can do without context. The label is doing the heavy lifting.
- "EST. / DESDE SANTA ANA, MÉRIDA" — 2019 is the founding year. The label crams the year-meaning *and* a location. Pick one.
- The 5-cell row doesn't divide cleanly into either 12 or 6 columns — at the 1024px breakpoint the wide cell breaks to span-1 alongside the rest, and at <720px it collapses to a 1+1 stack where 2019 sits next to "CHILDREN" in a way that reads accidentally.

**Why it matters.** Counters are brutalism's punchline section — short, scannable, often the most-shared screenshot. Tree House's counters are doing fine intellectually but poorly visually. The Boutique V3 R1 fix regularized the `--wide` cell to span 4 of 12 with the number at the full counter scale; same surgery applies here.

**Fix.**
- Drop `MICHELIN KEY · MÉRIDA` from the counters — it's already the centerpiece of section 5; repetition cheapens.
- Collapse to **4 cells × span-3** on a 12-col grid: `15 / ROOMS`, `0 (CERO) / NIÑOS`, `42 / ESPECIES`, `2019 / FUNDED`. The "CERO" gag survives, the row is even, the math divides 12.
- Move location and Michelin context out — they live in the footer-stamp and the dedicated Michelin section already.
- Label convention: single noun, no slashes, single language per cell (alternate ES/EN across the row if bilingualism is desired — `LLAVES / NIÑOS / ESPECIES / FUNDADO`).

---

## 11. Terracotta sprawl — accent used in ~20+ roles, including outline, eyebrow, accent text, button hover, hairline gradient, ::selection, sub-labels. **MAJOR**

**What.** Counting terracotta uses: focus outline, menu-num, manifesto-line-3/5/6, michelin-eyebrow, michelin-eyebrow-line, michelin-title-em, michelin-quote border + cite, michelin meaning area indirectly, exhibit-eyebrow, exhibit-eyebrow-line, exhibit-dates-val, exhibit-namesake border + tag + strong, exhibit-statement em color (via leaf, but adjacent), plate-num, plate-caption border references, fp-tag, exhibit-cta border + bg, exhibit-cta hover bg, arboretum-foot-tag, taxon-num, taxon-img border indirectly, journal-byline, exp-num, exp-from, offer-tag, review-stars, review-card:hover border, counter-number, counter-line, the-space-heading sub indirectly, space-address-stamp border, space-coords, footer border-top, footer-newsletter-label, footer-newsletter input focus border, footer-newsletter button hover, footer-stamp text + rule, landing-michelin-stamp border + year. **Plus** terracotta is the named "Michelin red echo" in the palette, so it's *supposed* to be the prestige tag.

When terracotta is on the room CTA hover, the newsletter button, the review-stars, the counter numbers, the focus outline, *and* the Michelin badge, it's no longer a prestige tag. It's the accent color, and it has lost its referent.

**Why it matters.** The brief says "used sparingly — Michelin red echo." When used in ~30 places, the Michelin moment doesn't *register as different* from the CTA hover or the counter color. Boutique V3 R1 pruned terracotta to 7 deliberate roles. Same discipline is needed here, and the meaning is even more important here because terracotta is supposed to do brand-coded work that the green palette can't.

**Fix.** Reserve terracotta for ~6–7 roles only:
1. `.section-label--exhibit` text + underline
2. `.landing-michelin-stamp-year` and the Michelin section's quote rule + cite
3. Manifesto line 3 *only* (drop the line-5/6 terracotta; that turns the manifesto's punchline into wallpaper)
4. `.exhibit-namesake-tag` + the `strong` inside
5. `.plate-num` (catalog-numeral apparatus)
6. `.exhibit-cta` only (one CTA button; not also the room-cta hover)
7. The Michelin landing stamp meta year + border (one corner of the page)

Pull from: focus outline (use ivory-on-canopy / moss-on-limestone for proper 3:1 contrast — see Finding 18), counter-number (use canopy; the *size* is the gesture), review-stars (replace with a stamp anyway — see Finding 13), exp-num/exp-from, offer-tag, journal-byline, taxon-num, fp-tag, room-cta hover bg (use canopy), all newsletter terracotta, all footer-stamp terracotta, ::selection (use moss), arboretum-foot-tag, space-coords, space-address-stamp border, exhibit-dates-val (use leaf or ivory).

---

## 12. The green palette is its own monoculture — moss / canopy / leaf / sage all read as "dark green / mid green / pale green." **MAJOR**

**What.** Sequence of green values in `:root`:
- `--moss: #2f4a32` (deep)
- `--canopy: #1a2e1f` (near-black green)
- `--leaf: #6b8e5f` (mid)
- `--sage: #b5c4a8` (pale)

Plus `--ivory` and `--limestone` (warm) and `--ochre` and `--terracotta` (warm). No mid-tone *non-green non-warm* anchor — the palette is binary: greens for the cool side, ochre/terracotta for the accent. The result is that on canopy sections, every micro-decision (eyebrow text, sub-label, caption, value text, opacity-mod ivory) is forced to be one of leaf / sage / opacity-shifted-ivory. You see this everywhere: `michelin-spec-label` is leaf, `plate-meta` is sage, `plate-loc` is leaf, `floorplan-label` is leaf, `taxon-meta` odd-children are moss, etc. All these things end up reading as roughly the same green-against-dark, just at slightly different lightnesses.

**Why it matters.** The brief calls out: "treat the green palette as a character." Right now the green palette is *every* character. Tree House should feel botanical — but "botanical" doesn't mean "everything green." A real garden has limestone walls, bark, terracotta pots, rust on the gate, brass tags — the *non-green* parts of the garden are what make the green readable. Boutique V3 has `--cenote: #1f5e64` as a deliberate cool non-green anchor for exactly this reason; Tree House has nothing equivalent.

**Fix.** Add **one** non-green cool anchor. Two options:
- **(A) Cenote teal** (`#1f5e64`) — same as Boutique V3, would echo the sister property's signature. Use it for: namesake-venue tag, courtyard letter in floorplan, newsletter-focus underline, one moment in the Michelin section. Three or four deliberate uses, no more.
- **(B) Patina copper / verdigris** (something like `#3a5d56`) — a green-blue oxidation tone, which would feel even more "botanical garden" (brass tags, copper drip stains) and would differ enough from Boutique to keep the sisters distinct.

Whichever — adding *one* cool non-green token solves the monoculture problem. **Note this is also Finding 13 in the round-1 checklist about cenote teal — answer: yes, deploy it here too, lightly.**

Then audit moss/leaf/sage uses and consolidate. Right now `leaf` is doing both eyebrow-text duty *and* sub-label-text duty *and* small-meta-text duty *and* gradient-stop duty — split those into two (eyebrow = `leaf`, body-sub = ivory at 0.6 opacity, gradient-stop = moss).

---

## 13. Reviews "★★★★★" — five U+2605 stars × 5 cards = the same accessibility paper-cut Boutique already fixed. **MAJOR**

**What.** Every review card opens with `<div class="review-stars">★★★★★</div>` — five literal star characters, terracotta, no `aria-hidden`, no `aria-label`. Screen readers read "black star black star black star black star black star" five times in a row. The cards are also rotated and stacked with `transform: rotate(…)` in a way that mimics paper notes, which is a strong visual move — but the stars contradict it (paper field-notes don't have TripAdvisor ratings stamped on them).

**Why it matters.** Two reasons. (1) Accessibility — five concatenated star characters with no aria treatment is a known noise pattern. (2) Brand coherence — the reviews heading says "TRANSCRIBED FROM GUEST LEDGER, 2024–2026," which is a hand-ledger framing. A hand ledger has a *stamp* or a *date entry*, not a TripAdvisor rating. Boutique V3 R1 already swapped to ledger stamps for this exact reason.

**Fix.** Replace each `.review-stars` with a `.review-stamp`:
```
№ 041 · 12 MAR 2026
№ 047 · 28 APR 2026
…
```
Mono micro tier. Moss color, with a 36px ink hairline trailing. Aria-hidden the decorative rule. The cards now actually read as ledger entries.

---

## 14. Focus trap missing on menu overlay; focus outline uses terracotta (contrast issues on canopy bg). **MAJOR**

**What.**
- `main.js` menu handler: no `lastFocused`, no `inert`-on-siblings, no Tab cycling. Just open/close + Escape. `aria-modal="true"` is declared in HTML but not enforced in behavior — focus can wander out of the overlay onto the inert body content underneath.
- Focus outline globally: `outline: 2px solid var(--terracotta);` — `#b85a3a`. Against `--canopy` (`#1a2e1f`) the contrast ratio is roughly 4.1:1, which is just-barely AA for non-text but feels muddy. Against `--ivory` background, terracotta-on-ivory is about 3.6:1, below the 3:1 non-text bar for some letter shapes. The bigger issue: focus outline is terracotta *everywhere*, including buttons that already have terracotta borders, where the focus state visually disappears.

**Why it matters.** Boutique V3 already received this exact finding and implemented (a) full focus trap with `inert`-on-siblings, (b) contextual focus colors — ink on light, limestone on dark. Tree House should at minimum match.

**Fix.**
- Port the focus-trap implementation from Boutique V3's `js/main.js` (lines ~11–85 of that file). Stores `lastFocused`, applies `[inert]` to body children, cycles Tab within overlay, restores focus on close, traps Escape.
- Split the focus outline into two contexts: on canopy/ink backgrounds → `outline: 2px solid var(--ivory)`. On limestone/ivory → `outline: 2px solid var(--canopy)` or `var(--moss)`. Both achieve 4.5:1+ and the focus state never collides with a terracotta button border.

---

## 15. Sister echo to Boutique V3 — currently *too close* on structure, *not close enough* on shared signature touches. **MAJOR**

**What.**
- Same structurally: cursor readout, section-label numbering scheme, manifesto with `<br>`-broken lines + nth-child color accent, data-grid, room-blocks with Roman numerals, exhibition with plates 01–06 and a floorplan and an artist roster, reviews-as-rotated-cards, counters row, space-gallery 12-col mosaic, footer with quarterly-dispatch newsletter. Every section maps 1:1.
- Different: green palette, Michelin section, Arboretum section, Journal section.

The structural overlap is so high that returning visitors will read Tree House as "Boutique with green skin." But the *signature* moves Boutique developed in R1 — the cenote teal accent, the inert-trap accessibility, the disciplined mono tiers, the canonical 12-col grid, the pruned terracotta — Tree House doesn't have. So the sisters are echoing the *wrong layer*: copying the apparatus, not the discipline.

**Why it matters.** The brief says "related but distinct." Right now they are *related* in skeleton, *distinct* only in palette. That's the inverse of what good sister branding does: distinct skeletons (different signature sections), shared discipline (same grid, same focus behavior, same mono tier tokens, same terracotta restraint).

**Fix.** Two things:
- **Push apart structurally.** The Arboretum and Journal are Tree House's structural differentiators — *give them more space*. Arboretum should run two screens, not one (the partial-index of 9 of 42 is a tease that earns expansion — show 18, group by `family`, add the `f.` herbarium convention from Finding 7). Journal should also gain weight — maybe 6 entries on two rows instead of 4 on one, with a dedicated reading-list typography (drop caps, narrower measure).
- **Pull together on discipline.** Mono tiers token-for-token. Canonical 12-col token. Inert focus trap. Terracotta pruned. Cenote-or-equivalent deployment. These are the *shared* siblings-have-the-same-bones moves. Right now they don't share bones — just outfits.

---

## 16. Adults-only signaling is loud (5+ surfaces) but never *typographically* expressive. **MINOR**

**What.** "Adults only" / "NO CHILDREN" / "18+" / "ADULTS ONLY, AS ALWAYS" / "OCC. 02 ADULTOS" appears in: nav menu meta, landing byline, landing subtitle, manifesto line 3 ("NO CHILDREN."), data-grid first cell, every room-spec block, summer-quiet offer, experiences intro, dedicated counter cell ("0 / NIÑOS"). That's nine surfaces.

But typographically the signaling is always the same: small-caps mono, often paired with the bilingual ES. The manifesto's "NO CHILDREN." line in Archivo 900 at clamp(2rem, 7vw, 6rem) is the only moment where it lands as a typographic gesture rather than a label.

**Why it matters.** Adults-only is a brand feel, not a fact. The brief calls it "the grown-up retreat." Listing it nine times in mono is the opposite of "felt" — it's "pasted." Boutique V2 / V3 don't have this problem because they're not adults-only. Here it has to do real character work.

**Fix.**
- Cut to **3 surfaces**: manifesto line 3 (loud — keep), the room-spec `OCC.` field (small print — keep), and one display-typographic moment elsewhere. The display moment is the one you want — maybe a Cormorant italic "fifteen quiet rooms" or "adults only, always" inset in the manifesto-coda or as the Michelin section sub-line.
- Pull `NO NIÑOS` / `ADULTS ONLY` from: nav menu meta (over-claiming), data-grid first cell (redundant with `15 KEYS`), landing subtitle ("ADULTS ONLY" already on the byline above), counter cell (let "CERO / NIÑOS" carry it — that gag works once), experiences-intro ("Adults only, throughout" is fine but the "as always" in the summer-offer is the third hit).

Less is louder.

---

## 17. Manifesto rhythm: 6 lines with 3 accent-color lines (3/5/6) flattens the climax. **MINOR**

**What.** Manifesto:
1. FIFTEEN ROOMS.
2. ONE CANOPY.
3. **NO CHILDREN.** (terracotta)
4. NO COMPROMISE.
5. **WHISPER.** (terracotta)
6. **NOT SHOUT.** (terracotta)

Three out of six lines are terracotta. The visual rhythm is: dark, dark, red, dark, red, red. That's not a climax — that's a thicket of red at the end. Boutique V3's R1 fix went to 1 terracotta line (line 3 as the lone declarative accent) and made line 6 the *whisper* — Cormorant italic, lowercase, smaller. The line called "whisper" actually whispers.

**Why it matters.** Manifesto sections in brutalism are doing rhetorical work. A manifesto with three highlighted lines reads like a manifesto with *no* highlighted lines — the highlight has lost meaning. And lines 5 and 6 ("WHISPER. / NOT SHOUT.") *say* whisper while *shouting* in Archivo 900 terracotta — the typography contradicts the words.

**Fix.**
- Keep line 3 (`NO CHILDREN.`) in terracotta — the declarative beat works.
- Lines 5/6 ("WHISPER. / NOT SHOUT.") → swap to Cormorant 400 italic, lowercase: `whisper.` / `not shout.`. Half the size. Ink at 55% opacity. The line called whisper *whispers*. The contrast against the four Archivo lines above is the gesture.
- Better still: merge 5+6 into one line — `whisper, not shout.` — one closing breath, like Boutique V3.

---

## 18. Cursor readout is third-or-fourth-redundant for the coordinate data. **MINOR**

**What.** `20.9704° N · 89.6260° W` appears in:
1. Cursor-readout fixed top-left (`LAT 20.9704° N · SANTA ANA`)
2. Landing top-right corner (`20.9704° N / 89.6260° W / ELEV 9 M`)
3. Landing bottom-center (`LAT 20.9704° N · LON 89.6260° W · SANTA ANA`)
4. Menu overlay foot (`20.9704° N / 89.6260° W · BARRIO DE SANTA ANA`)
5. Data-grid cell 3 (`COORDS: 20.9704° N / 89.6260° W`)
6. Space section (`20.9704° N · 89.6260° W / 18 MIN FROM MID`)
7. Footer stamp (`20.9704° N · 89.6260° W`)

Seven times. The coordinates aren't a navigational asset for guests — they're a brutalist gesture *once*, ornament thereafter.

**Why it matters.** Repetition without rhetoric is just clutter. The coords-as-watermark conceit works at one or two anchor points; at seven it becomes content-by-the-yard.

**Fix.** Keep coords at exactly **two** anchor points: the landing top-right corner (entry watermark) and the footer-stamp (exit watermark). Strip from: cursor readout (use just `SANTA ANA · 20.97° N` or just `SANTA ANA`), landing bottom-center (already in landing top-right), data-grid cell 3 (replace with a different fact — `GARDENER: ONE, SINCE 2019`), menu-foot, space-info. Watermarks at two corners brackets the document; at seven it papers it.

---

## 19. Unsplash photographic dependency for *botanical* identity is the wrong source. **NIT** *(builder flagged)*

**What.** Builder flagged. Confirmed: the Arboretum's `taxon-img` for `Ceiba pentandra` uses `photo-1551776235-dde6c2615c2f` (a generic jungle/tropical shot, not a ceiba). `Plumeria rubra` uses `photo-1542314831-068cd1dbfeeb` (greenery courtyard, not a frangipani). `Bougainvillea glabra` uses `photo-1540541338287-41700207dee6` (a vine-covered courtyard wall — coincidentally has bougainvillea, but not the subject of the photo). The same handful of Unsplash hotel-greenery shots are recycled across data-grid backgrounds, room images, plate images, taxon images, and space gallery. The herbarium framing collapses when the "specimen image" is a stock hotel-greenery photo of a different plant.

**Why it matters.** This is a Round 2 / asset-fix item, not a Round 1 typography item — but it does damage the Arboretum's typographic claim. The Latin name says one thing; the image says another.

**Fix.** Two paths:
- **(A) Drop the photos entirely** from the taxon cards. Replace with a small leaf-silhouette SVG glyph per family (one per Malvaceae, one per Arecaceae, etc.). Now the typography carries the catalog, not the photography. This is also the cheaper-and-cleaner brutalist choice.
- **(B) Commission or curate real photos** in Round 2 — each species shot at the property. Outside V3-as-design scope, but worth flagging as the eventual fix.

Recommend (A) for the design pass.

---

## 20. Floorplan ASCII has a duplicated entry: Plate 06 — Cetina at both [A] Entrance and [C] Library. **NIT**

**What.** In the ASCII block (lines 467–484 of index.html):
- `[A] ENTRANCE` — `▴ plate 06 — cetina`
- `[C] LIBRARY` — `▴ plate 06 (set)`

Same in `.floorplan-grid`:
- `fp--entrance` — `PLATE 06 — CETINA`
- `fp--library` — `PLATE 06 — CETINA (SET OF 12)`

It's a 12-piece set, so technically both locations are valid — pieces from the set hang in both places. But the way it's labeled reads like a copy/paste mistake unless you've read the prose context.

**Why it matters.** Catalog integrity. A reader of a catalog notices duplicate entries before they notice anything else.

**Fix.**
- Entrance entry: `PL. 06 — CETINA (NO§§ 01–03)` or similar — show *which* pieces of the set hang there.
- Library entry: `PL. 06 — CETINA (NO§§ 04–12)` — the rest of the series.
- Now both entries make sense individually and the catalog is internally consistent.

---

## What's Working — Coda

A few moments that *are* landing and should be protected:

- **The Exhibit-namesake callout** (the small bordered block "Tree House is the founding venue of the Treehouse program. The 'Treehouse' in Treehouse × SoHo Galleries is, literally, this house."). This is the page's clearest brand moment — typographically modest, content-strong. Don't ornament it further.
- **The `EL DOSEL / verde` exhibition title** (Archivo 900 stacked over Cormorant italic 300 lowercase). The two-voice display move works — Archivo's slab against Cormorant's stem creates the catalog/whisper pairing the brief asks for. The Arboretum title repeats the move (`EL / arboretum`); both land. *This is the typographic signature.* Hold it.
- **The CTA button copy "REQUEST PRIVATE WALKTHROUGH →"** — exhibition section CTA. Right voice for the property. The room CTAs ("RESERVE — № I →") are also right.
- **The `OCCUPATION: 02 ADULTOS`** room-spec convention. Spanish + numeral + adults-only fact in one spec field. Tight, brand-coded, doesn't shout. *More of this.*
- **The arboretum-foot copy** — "Full *Herbarium, Santa Ana* by Paloma Cetina hangs in the library — referenced in Plate 06." This single line is doing the catalog/herbarium/cross-reference work better than the whole cross-section setup. Build outward from it (see Finding 9).
- **The Cormorant italic blockquote** in the Michelin section. Inspector-style voice, right register, doesn't quote-mark-overload. Works.
- **The reviews-as-rotated-paper-cards** geometry (rotate values, z-index stacking, margin-top offsets). The metaphor is good. Just swap stars → stamps (Finding 13) and the section is best-in-page.

The bones are there. The discipline isn't yet.
