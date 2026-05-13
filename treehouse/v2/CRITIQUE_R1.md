# Tree House V2 — Editorial Magazine
## Critique R1 · Visual Hierarchy & Typography

Adversarial read against the brief (`/Users/adeleshen/boutique-museo-designs/treehouse/shared/BRIEF.md`), the Mas Girbau / field-journal anchor, and sister-property Boutique V2 for distinctness. **Type-system and editorial apparatus first.** Files inspected: `index.html`, `css/style.css`, `js/main.js`.

---

### 1. CRITICAL — The plate apparatus is the spine of this design and several plate references point to the wrong plate
**What.** This page sells itself as a field journal — Roman-numeraled plates (Lám. I–XXII) are the bone structure. But the body-copy cross-references don't line up with the actual captions:
- `index.html:178` ("at three in the afternoon, see **Lám. XIV**") — Lám. XIV is captioned at `:482`, "**Raíz**, J. Manzón · cast bronze, library alcove." That is a **sculpture**, not a 3pm patio. The patio-at-3pm plate is actually **Lám. XV** (`:656`).
- `index.html:514` ("one in **Lám. XIX**") and `:567` ("one in **Lám. XIX**") — both promise a hidden **cenote**. Lám. XIX is captioned at `:685` as "**Bugambilia, muro sur**." The cenote is **Lám. XX** (`:693`).
- `index.html:649` ("the **bugambilia, Lám. XVIII**") — Lám. XVIII is "**Lino, hora dorada**" (golden-hour bed linen, `:674`). Bugambilia is XIX.

**Why it matters.** The entire conceit of "field journal" depends on the apparatus being load-bearing — if a reader who is paying attention (your target reader, per the Mas Girbau brief, is paying attention) chases a plate reference and lands on the wrong thing, the whole editorial illusion collapses into kitsch. A real journal does not get its cross-references wrong. Worse, the page proudly displays them four times. This is the single biggest credibility hit on the page.

**Fix.** Re-number cross-references to actual captions. Lám. XIV → **XV** (patio 3pm). Lám. XIX → **XX** (cenote), in both places. Lám. XVIII → **XIX** (bugambilia). Or — easier — renumber the plates themselves so the body references stay. Either way, this needs one careful pass.

---

### 2. CRITICAL — Only 3 drop caps render, brief asked for 4; and one of them is broken
**What.** Brief said "4 of them per builder." Searching `index.html` for `class=".*drop-cap"` returns exactly three: `:119` (Editor's Note), `:177` (Sanctuary middle column), `:411` (Treehouse × SoHo deck). The fourth is missing — Diario, Curated Mérida, El Estándar and Voices are all candidates that pass without one.

Worse: the Treehouse drop cap at `:411` opens on **"*El nombre vive aquí.*"** — an `<em>` tag. The `::first-letter` pseudo applies to the "E" of "El," which is now italicised because of the parent `<em>`. So the drop cap reads as an oblique 4.4em letter — not a settled square drop-cap, a slanting one that looks like a typo. None of the other drop caps are italic.

**Why it matters.** Drop caps are punctuation for the magazine's voice. Three is asymmetric across a long page; one of them being slanted is the kind of thing an art director catches in five seconds and an MD catches in two.

**Fix.** Either lift the `<em>` to wrap only "vive aquí." so the drop cap "E" of "El" stays roman; or wrap the first word in a `<span>` and apply `::first-letter` against that with `font-style: normal`. Then add a fourth drop cap — most likely candidates: opening paragraph of the Michelin section (`:222`), or the opening of Voces / El Diario header. Pick somewhere the rhythm naturally calls for one — not by quota.

---

### 3. CRITICAL — Drop caps are not baseline-anchored, will float above body
**What.** `style.css:312-321`:
```
.drop-cap::first-letter {
  font-family: var(--display);
  font-size: 4.4em;
  float: left;
  line-height: 0.82;
  margin-right: 0.12em;
  margin-top: 0.08em;
  color: var(--moss);
}
```
Compare Boutique V2 sibling (`/Users/adeleshen/boutique-museo-designs/v2/css/style.css:264-278`) which seats the drop cap with `.drop-cap { padding-top: 0.25rem }` against `line-height: 0.78` on the letter — i.e., explicit baseline math. Tree House has no `.drop-cap` block rule at all, only the `::first-letter` rule, and the cap is **larger** (4.4em vs 3.6em). With body `line-height: 1.85`, a 4.4em DM Serif drop cap with `line-height: 0.82` and `margin-top: 0.08em` will sit visibly above the cap-line of the body text — a common amateur drop-cap symptom.

**Why it matters.** This is the most-stared-at typographic detail on the page. A floating cap kills the field-journal seriousness instantly.

**Fix.** Add a `.drop-cap { padding-top: ~0.18-0.28rem }` and lower `line-height` to ~0.78. Test against the body x-height: the top of the cap should align with the cap-line of the body's first line, the bottom should sit on the third line's baseline (since it's a ~3-line cap at 4.4em + 1.85 leading). Validate at 480px (where it scales to 3.4em) too — at the mobile size the rounding gets ugly.

---

### 4. MAJOR — Hero is using a literally-not-Tree-House Unsplash photo and the page is built around it
**What.** `index.html:11,98` — the hero plate (`Lám. I — Patio bajo el dosel, Santa Ana`) is `photo-1542314831-068cd1dbfeeb` from Unsplash. There is no real Tree House courtyard photograph. The hotel **has** a real botanical patio — that's the entire identity — and the very first image, the one captioned as the property's flagship, is stock. Builder flagged this.

**Why it matters.** A luxury Michelin-Key hotel website opening on a stock photo, captioned as if it were the actual patio, is the kind of thing a guest can find out in five seconds. It also makes Lám. I the loudest fiction on the page.

**Fix.** Either source from `treehouseboutiquehotel.com` (the brief lists their CDN paths), or change Lám. I's caption to something honest ("Foliage study, Yucatán" or simply drop the property-specific framing). The builder flagged this for honest reason; should not ship as-is.

---

### 5. MAJOR — The "−4°C patio vs. calle" stat appears three times and is invented
**What.** Builder flagged this. The page repeats it confidently:
- `:146` Editor's Note aside: "*The canopy keeps the patio four degrees cooler than the street — verified by an obsessive guest with a thermometer, August 2024.*"
- `:178` Sanctuary drop-cap paragraph: "*At three in the afternoon (see Lám. XIV) the courtyard runs four degrees cooler than the street.*"
- `:384` El Estándar stat block: a typographic **"−4°C"** rendered at 1.8rem DM Serif as a featured stat number.

**Why it matters.** When a stat is sized as display type, it becomes a *brand promise*. Three repetitions of the same number escalate the lie. The "obsessive guest with a thermometer, August 2024" aside is charming-but-fabricated — it's the kind of detail that reads as voice but is, on a real hotel site, fraud-adjacent.

**Fix.** Either get a real number from the operator, or **soften** in all three places. "Several degrees cooler" / "noticeably cooler" / drop the stat block and put another number there (15 rooms, 1 Key, etc. — the page is already full of real numbers). Do not display-set a fabricated quantity.

---

### 6. MAJOR — The Michelin Key moment doesn't earn its size; it reads as a sidebar
**What.** The brief calls for the Michelin moment to be "typographically distinct enough to feel like a real prestige moment." Section 4 (`:202-248`) gives it:
- a 0.65fr : 1fr split with the key image left (180×180) and prose right
- an h2 sized `clamp(2.6rem, 5vw, 4rem)` — **smaller** than the Habitaciones, Diario, Mérida, and Visit h2s, which all sit at `clamp(3rem, 6vw, 5.5rem)`
- a sticky-positioned key card on a faint terracotta tint (`rgba(184,90,58,0.04)` — 4% opacity, effectively invisible against ivory)
- three "stats" — "I / 1ra / 15" — at 2.2rem terracotta DM Serif

The other sections out-size it. The "I / 1ra / 15" trio is also a typographic muddle: a Roman numeral, a Spanish ordinal abbreviation, and an Arabic numeral, mixed at the same font-size — three different number systems in one row.

**Why it matters.** This **is** the prestige beat. If the Llave section is visually smaller than "Curated Mérida" or "El Diario," the page is telling the reader the Key is a footnote.

**Fix.** Either size the Michelin h2 *up* (`clamp(3.4rem, 7vw, 6rem)`, distinct from the others) — or commit to the "small editorial moment" framing and make it deliberately quieter (smaller everything, more rule-and-folio apparatus, no big stats). Right now it's mid-sized in a way that reads as neither big nor small. For the stats: pick one number system. Three terracotta "I"s tucked into a stat row, or three Arabic numbers — not mixed.

---

### 7. MAJOR — Dark-panel text contrast is below comfortable reading on El Estándar and Visit
**What.** Both `.standard` (`:1259-1370`) and `.visit` (`:2122-2233`) sit on `--canopy: #1a2e1f` (a near-black green). Body text uses:
- `.standard-item p` → `rgba(247, 243, 235, 0.74)` ≈ effective #c9c6bd. WCAG ratio vs #1a2e1f ≈ 9.5:1 — passes.
- `.standard-stat-unit` → `rgba(247, 243, 235, 0.55)` ≈ effective #9b988f. Ratio ≈ 5.4:1 — passes large text, fails AA small.
- `.standard-deck` → `rgba(247, 243, 235, 0.65)` — italic 1.2rem display. Ratio ~ 7:1 — okay.
- `.visit-detail-mono` → `rgba(247, 243, 235, 0.5)` — 0.62rem mono caps. Effective ~ #8c8a80. Ratio ≈ 4.5:1 at 6.5pt — fails AA small.
- `.visit-card p` → `rgba(247, 243, 235, 0.82)` — fine.
- Border `rgba(247, 243, 235, 0.18)` — fine, decorative.

So a couple of the smallest typographic elements are too faded.

**Why it matters.** "Editorial" reads pleasure-reading, not eye-strain. A 0.5-opacity 0.62rem caps unit on near-black is the kind of detail that reads as "stylish" on a designer's monitor and "I can't read this" on a phone outdoors.

**Fix.** Lift `.visit-detail-mono` to opacity ≥ 0.7 (effective ~ #b9b6ac), and `.standard-stat-unit` to ≥ 0.68. Borders fine. No need to leave the palette.

---

### 8. MAJOR — Apparatus duplication in the Michelin section
**What.** The Michelin section carries simultaneously:
- the `.section-marker` slot (omitted here — there is no `01 /` style marker, the section opens with `.michelin-eyebrow` instead)
- `.michelin-eyebrow` "**03 / Apunte editorial**" (`:206`) — a section-marker by another name
- `.michelin-folio` "**Lám. V**" (`:207`)
- a separate `.michelin-rule` (terracotta hairline, `:204`)
- and then an h2 with its own `.kicker` "**Sobre**" inside

Every other section opens with a `.section-marker` ("04 / Las Habitaciones"). Here we get an eyebrow plus a folio plus a rule plus a kicker — four pieces of apparatus before the h2 lands. The other sections use one or two.

**Why it matters.** Inconsistent apparatus reads as the section being made-up-in-the-moment. The reader's eye learns the page's rules from section 01 and 02; section 03 changes the rules, then sections 04+ revert. That's the typographic equivalent of changing voice in the middle of a paragraph.

**Fix.** Either: (a) restore a standard `.section-marker` "03 / La Llave" and drop the bespoke eyebrow+folio+rule combo, or (b) commit to the bespoke apparatus as the page's treatment of "editorial sidebar moments" and use it elsewhere too. Pick a rule and follow it.

---

### 9. MAJOR — Three-element Sanctuary headline collapses left on tablet, breaks the trio
**What.** The "**A House of · Quince · habitaciones — solo adultos**" trio (`:158-160`) is a signature moment — display "Quince" centered between two small-caps lines. On the desktop grid it works:
```
sanctuary-headline { grid-template-columns: 1fr auto 1fr; align-items: end; }
```
At `≤1024px` (`:2468-2477`) it collapses to a single column, **all left-aligned, including the big word.** The right-hand small-caps "habitaciones — *solo adultos*" loses its right-text-align too. So the trio becomes a stack of three left-aligned strings:
```
A HOUSE OF
Quince
HABITACIONES — solo adultos
```
The relationship is lost — it now reads as three labels, not a trio. At 480px the big word is `clamp(5rem, 11vw, 13rem)` — at 480px that's ~5rem ≈ 80px, still big, sitting on its own line, with the small-caps tucked against the left margin. No hierarchy.

**Why it matters.** Brief literally calls this out: "*Three-element headlines (Sanctuary trio) — proportioned, mobile-friendly?*" In its current form, no.

**Fix.** On mobile, either: (a) keep the big-word centered with the small-caps still flanking — let it wrap to a 3-row grid but stay centered; (b) rebalance to `1fr` with the big-word top-of-stack and the small-caps becoming labelled flank-text below ("**Quince** — *a house of quince habitaciones · solo adultos*"); (c) make the small-caps function as eyebrows above and a caption below. Pick one but don't leave it as left-aligned strings.

---

### 10. MAJOR — Page counter shows "I" twice (hero and Editor's Note), and "Nota" is the initial label for the hero
**What.** Hero has no `data-section` attribute. The page-counter HTML initialises to "**I / Nota**" (`index.html:24-26`). When the user scrolls into section 1 (`data-section="1"`, label "Nota") the JS does its flip animation… and lands on "**I / Nota**" — identical. The reader sees no transition between the hero and the first section. Then when scrolling to section 2, the flip animates from I → II.

Also: the counter has no resting state for the hero. The hero **is** the masthead — it should arguably read "I / Portada" or similar, and the Editor's Note should be "II / Nota," shifting the sequence by one (making the page Roman I–XII). Right now the counter is just out-of-sync with what's on screen during the entire hero scroll.

**Why it matters.** The Roman page counter is one of the field-journal's signature flourishes. If it sits inert through the most-viewed scroll (the hero), and then "flips" to the same value, the flourish is announcing that it's broken.

**Fix.** Give the hero `data-section="0" data-section-label="Portada"`, render the counter as `—` or empty during hero, and have the JS observer hide the counter when hero is the dominant viewport section. Or shift the numbering so hero=I and notes=II.

---

### 11. MAJOR — "Treehouse × SoHo Galleries" namesake framing is unstable
**What.** Builder flagged this. The treehouse section says: "*El nombre vive aquí.* The Treehouse is not, in the first place, a hotel programme — it is the gallery space at the back of the patio, named for the canopy that grows through it" (`:412`). The h2 is then "**The Treehouse × SoHo Galleries**" — typographically grand. But what's actually happening is: the hotel is named **Tree House** (two words), and there exists an art-collab series **Treehouse × SoHo** (one word, same brand-house, partnered with a Mérida gallery). The page is *claiming* that the "treehouse" in the partnership name comes from a literal gallery room *at the back of the patio* — a venue that may or may not exist. That's narrative invention dressed as fact.

Also typographically: `treehouse-and` ("The") is set 0.5em italic with `vertical-align: 0.25em` — it floats up like a footnote marker. `treehouse-cross` is a `×` glyph at 0.7em moss color. `treehouse-soho` is italic moss. Three different vertical alignments and three styles in one display word. It reads as fussy.

**Why it matters.** Two problems compound. Story-wise: claiming "the name lives here" without evidence is a brand-credibility hit. Type-wise: the three-style display word ("The" superscripted, "Treehouse" plain, "×" small leaf, "SoHo Galleries" italic) doesn't compose — it reads as four labels masquerading as one phrase.

**Fix.** Story: soften the "El nombre vive aquí" claim to "a gallery rotation runs through the courtyards and corridors, curated by SoHo Galleries Mérida" — no false-etymology. Type: pick *one* italic axis ("**The** Treehouse × *SoHo Galleries*" with The and × set as inline-block at the same baseline, smaller but not floating) and drop one of the three alignment tricks.

---

### 12. MAJOR — "Leer la entrada →" links are decoration, not interaction
**What.** Builder flagged this. `.diario-read` is rendered as a span (`:515-536`), not an `<a>`. It is styled identically to a CTA — sans-caps, ochre transition on hover, arrow that grows the gap on parent hover. But it goes nowhere. The whole `.diario-entry` is `cursor: pointer` (`:1711`) which compounds the lie — the reader expects to click.

**Why it matters.** Editorial trust depends on signposts being honest. A magazine with TOC entries that don't link is broken; here the broken signpost is decorated to look more clickable than the actually-clickable elements.

**Fix.** Either (a) make these actual `<a href>` to a `/diario/...` route (even a stub), (b) drop the arrow + drop the cursor:pointer + drop the hover translation — make them read as descriptive blurbs not as TOC entries, or (c) make the entire card link to a single newsletter-signup ("**Diario** — read entries by email"). Any of the three. Not all three labels-as-links-that-aren't.

---

### 13. MINOR — Drop-cap at 480px shrinks but body line-height doesn't compensate
**What.** Mobile rule `:2783-2785`:
```
@media (max-width: 480px) {
  .drop-cap::first-letter { font-size: 3.4em; }
}
```
Good — but body `font-size: 1.06rem; line-height: 1.75` is unchanged. The cap drops to ~3.4em line-height 0.82 with margin-top 0.08em. The math now produces a cap that spans ~2.3 body lines, not 3 — which means the second line of the paragraph wraps short next to the cap, then the third line goes full-width but starts roughly at cap-bottom, producing a notched indent. Looks fine in static, looks janky in flow.

**Why it matters.** Drop caps are the typographic detail that gets photographed for portfolio. The 480px case is the one most reviewers will inspect on phone.

**Fix.** At 480px, set the cap to `font-size: 3em; line-height: 0.84; margin-top: 0.1em` and either drop body line-height to 1.7, or accept a 2-line cap and design it to. Test in DevTools at 375×667 iPhone SE.

---

### 14. MINOR — Sepia/desaturation filter is on every image and homogenises the photography
**What.** `:262-263`:
```
.editorial-img img { filter: saturate(0.86) brightness(0.99) hue-rotate(-2deg); ... }
```
Applied site-wide to every `.editorial-img` (which is, in practice, every photograph on the page). On hover it lifts to `saturate(1) brightness(1) hue-rotate(0deg)`. The intent is a paper-stock "developed-print" feel, à la Mas Girbau.

**Why it matters.** It does the Mas Girbau homage but pays a price: every photo now looks like every other photo — gallery canvases, courtyards, cenote turquoise, golden-hour linen, bougainvillea all live in the same desaturated register. The brief warns the variant must "earn its place" — the photography should provide variety across the long scroll, and the filter is flattening that variety. Especially the cenote (Lám. XX) and bugambilia (Lám. XIX) — both are color stories; both are being muted.

**Fix.** Either: (a) drop the filter, accept that not all photos will match, and lean on cropping for cohesion; (b) keep the filter but allow two override classes — `.editorial-img--vivid` for the cenote/bougainvillea/art plates that need to sing, default for context shots; (c) reduce intensity to `saturate(0.94) hue-rotate(0deg)` — barely-there warmth instead of full sepia.

---

### 15. MINOR — Sister-property echo is good but a few inheritances are too literal
**What.** Boutique V2 vs Tree House V2 — the distinction works in palette (moss-led vs ochre-led, confirmed at `:14-41`), in featured section (Michelin vs no Michelin), and in additional content (Diario, Photo Essay). Good. But:
- Page-counter (Roman, paper-grain SVG noise, reading-progress bar) is **identical** in structure between siblings.
- `.editorial-img` filter values are nearly identical (sibling `:267` is `saturate(0.92) sepia(0.1)`, Tree House is `saturate(0.86) hue-rotate(-2deg)`).
- The "**big-word** flanked by small-caps" sanctuary headline pattern is identical structurally to Boutique's sanctuary headline.

**Why it matters.** "Distinct but related" is the brief. Currently they're 80% identical mechanism / 20% palette swap. A returning visitor will recognise them as siblings — but they may also feel templated.

**Fix.** One or two of the apparatus elements should differ structurally. Suggestion: Tree House's page-counter could include a tiny botanical glyph (a leaf hairline) where Boutique's has just a slash — small distinct visual signature. Or the section markers could read "Lám. I / Nota de la Casa" using plate numerals as section numerals (collapsing two systems into one — see finding 16). Pick one place to commit to a Tree-House-specific apparatus.

---

### 16. MINOR — Two parallel numbering systems (Arabic section markers + Roman page counter)
**What.** Section markers read "**01 /** Nota de la Casa," "**02 /** El Santuario," etc. — Arabic. The fixed page counter shows the same section as **I**, **II**, etc. — Roman. Same logical entity, two glyph systems, mounted on the same page at the same time.

**Why it matters.** A field journal traditionally uses *one* numbering system per axis. Roman numerals usually mark *plates* (Lám. I–XXII here), Arabic marks *chapters/sections*. Here, plates are Roman, sections are Arabic-in-markers but also Roman-in-page-counter. The reader has to learn that "01" and "I" refer to the same section — friction, low but real.

**Fix.** Drop one. Two clean options: (a) Section markers go "Lám. I / Nota de la Casa" — borrowing the plate-naming convention. The page-counter then becomes redundant and can be killed (one less moving part, less to break in finding 10). (b) Keep both apparatus systems but make their relationship explicit: page-counter reads "01 — Nota" in Arabic, matching the marker. Then Roman is reserved for plates only. Cleaner.

---

### 17. NIT — Italic discipline is mostly good, but "italic-on-italic" creep in three places
**What.** The rule appears to be: Spanish phrases + Latin botanical names + emphasised concepts → italic moss. Mostly disciplined. Three slips:
- `:79` hero deck: "**a small hotel for grown-ups, in a barrio that still keeps its own hours.**" wrapped in `<span class="hero-deck-emph">` styled `font-style: italic` (`:556-560`). But it's not Spanish, it's not Latin, and it's not a term-of-art — it's a regular English sentence being emphasised in display italic just because. Cumulative italic in one paragraph: *casa bajo el follaje*, *Michelin Key*, and the entire deck-emph clause. Half the deck is italic.
- `:308` rooms tasting (Queen Courtyard): "**you read by green light. *Lectura de tarde.***" Italic Spanish phrase after italic English clause — fine, but the room-tasting block is already display italic 1.18rem (`:1198-1209`), so the italic-Spanish "Lectura de tarde" sits *italic-on-italic* and just bolds optically.
- `:35` masthead: "Tree House · Boutique" with `<em>·</em>` italicising a middle-dot character — has no semantic role, the dot looks the same italic or not, just creates a CSS rule that adds color and padding.

**Why it matters.** Italic in this kind of editorial design is a load-bearing convention — italic = Spanish/Latin/quotation. When it's also used for "this English sentence is the punchy one," the convention degrades to "italics = emphasis," which is what every page on the web does and what the brief is trying to escape.

**Fix.** Strip `hero-deck-emph` italic — let the English clause sit roman. Drop the `<em>` around the middle-dot in the masthead logo word. For room-tastings, let the whole block be italic *or* let the Spanish tag be italic, but not both.

---

### 18. NIT — `data-stagger` attributes on `.michelin-stats` and `.standard-grid` are not consumed by the JS
**What.** `index.html:231,371` set `data-stagger="120"` and `data-stagger="200"`. Looking at `js/main.js` — no reference to a `data-stagger` attribute anywhere. The reveal animations fire on a single threshold, no staggering. Cruft attributes left in markup.

**Why it matters.** Tiny — but it's a tell that the editorial-stagger intent was scoped and not finished. The Michelin stats and the El Estándar pillars would both benefit visibly from per-item staggered reveals (the Mas Girbau anchor has exactly this rhythm).

**Fix.** Either implement (read `data-stagger`, apply `transition-delay: var(--i) * stagger ms` to children) or remove the attributes. Implementing is ~10 lines and the visual lift is worth it.

---

## What's working

Worth saving in revision:
1. **The Diario / El Diario section** is genuinely the Tree-House-specific moment. Cuaderno numbering, the field-notes tag, the italic Spanish secondary tag, the four entries — this is the strongest piece of differentiation from Boutique V2.
2. **Italic-moss for Latin botanical labels** (`.botanical`) is well-disciplined and shows up consistently in room-meta, body copy, and image captions — when this kind of taxonomic apparatus stays consistent, it carries the field-journal voice on its own.
3. **Voices section** — gradient left-border quote marks, generous gutters between cards, italic display quotes — the rhythm is right.
4. **El Estándar pillars** on canopy ground — 01/02/03 in faint leaf-green, Spanish word in sage-pale italic, English h3 in ivory display — the three-layer label stack is exactly the kind of editorial layering this variant is supposed to do.
5. **Editorial interstitial layout** with the asymmetric three-column rows and the centered pull-quote slotted between images is well-paced and survives the mobile collapse better than most of the rest of the page.
6. **No backdrop-filter / no glassmorphism** anywhere — clean. (Verified `:grep backdrop-filter` returns empty.)
7. **Palette discipline** is largely clean. The terracotta is reserved for Michelin moments only; ochre is reserved for warm-accent CTAs; moss leads. No smuggled blues, no smuggled greys-from-elsewhere. The sage-pale on dark canopy ground is doing real work for hierarchy without leaving the palette.

---

*Findings: 18 (3 critical, 9 major, 4 minor, 2 nit). Highest-impact fix: section 1 (plate-reference mismatches) — it's a one-pass renumbering that protects the entire field-journal conceit. Sections 2 & 3 (drop caps) close behind.*
