# V3 — Brutalist Art-Forward / CRITIQUE R1
## Focus: Visual Hierarchy & Typography

---

### 1. Mono microcopy is everywhere at the same size — texture, not hierarchy. **CRITICAL**

**What:** Audit of mono usage in `css/style.css`: `.section-label` (0.55rem), `.manifesto-meta` (0.55rem), `.landing-corner` (0.55rem), `.landing-subtitle` (0.55rem), `.landing-coords` (0.55rem), `.landing-scroll-indicator` (0.55rem), `.menu-meta` / `.menu-foot` (0.55rem), `.cursor-readout` (0.55rem), `.counter-label` (0.55rem), `.space-gallery-tag` (0.55rem), `.footer-label` (0.55rem), `.footer-copyright` (0.55rem), `.exhibit-foot-label` (0.55rem), `.plate-loc` (0.55rem), `.fp-piece` (0.55rem) — and another 20+ selectors in the 0.6–0.7rem band (`.room-spec-label`, `.exhibit-eyebrow`, `.exhibit-dates`, `.review-author`, `.exp-meta`, `.exp-from`, `.offer-tag`, `.reviews-heading`, `.footer-stamp`, etc.). Virtually every non-display element on the page is mono uppercase 0.55–0.7rem, letter-spaced 0.10–0.32em.

**Why it matters:** Brutalist data UI is supposed to weaponize the contrast between *very* small mono and *very* large display. Here the small mono is so uniform — and so dense — that everything reads at the same hierarchical altitude. The catalog apparatus stops being apparatus and becomes wallpaper. A reader skimming for "what is this place" hits an unrelieved beige fog of UPPERCASE TRACKED MONO for screens at a time. Pan & Koffee V3 gets away with this density because its long-form prose breaks it up; here the only prose oases are the manifesto coda, the curatorial statement, the experience bodies — and they're surrounded by walls of mono.

**Fix:** Establish exactly 3 mono tiers and enforce them. Suggestion: `--mono-micro: 0.55rem / 0.32em` (legals, copyrights, watermark coords only — used ~5 places total); `--mono-meta: 0.7rem / 0.16em` (labels, section labels, run-of-page); `--mono-data: 0.85rem / 0.08em` (numerical specs that need to be readable at glance — room-spec-value, exhibit-dates-val, prices). Then audit and demote anything currently at 0.55rem that isn't truly marginalia. Also reduce the count of distinct mono blocks per section by ~40% — the eye should *land* on the catalog apparatus, not wade through it.

---

### 2. The "brutalist grid" is decoration, not structure. **CRITICAL**

**What:** Every section invents its own grid in isolation. `.data-grid-inner` is 3-col (`style.css:625-628`), `.exhibit-plates` is 12-col with bespoke spans (`style.css:1067-1152`), `.reviews-grid` is 12-col with rotated cards (`style.css:1442-1488`), `.space-gallery` is 12-col with bespoke spans (`style.css:1596-1651`), `.counters` is 5-col (`style.css:1517-1523`), `.experiences-grid` is 2-col, `.footer-inner` is 1/1/1/1.4. There is no shared baseline grid, no shared gutter token, no shared column count. The `.landing-grid-lines` / `.landing-grid-h1` / `.landing-grid-h2` (`html:49-51`, `style.css:304-328`) draw thirds-rule guides on the landing **that no other section honors**.

**Why it matters:** A real brutalist data-grid web reads as one architecture seen from many angles — the columns of the data cells should be the same columns as the plates and the gallery, so the eye learns the room. Here the page feels like ten different brochures stapled together. Section-to-section, the rhythm restarts. That's why despite the heavy apparatus the page doesn't *feel* systematic — it feels stylistically systematic but compositionally improvised.

**Fix:** Define a global `--grid-cols: 12; --gutter: 0;` at `:root` and have every grid section opt into either 12, 6, 4, 3, or 2 column spans on that same 12. The data grid should be 12-col with cells spanning 4. The counters should be 12-col with cells spanning either 2 or 3. Pull the landing's thirds-rule out into the page (a single 1px vertical ruler at 33%/66% drawn through the whole document via a fixed-position decorative overlay or a body::before that scrolls with content). Right now the thirds-rule on the landing is a promise the rest of the page breaks.

---

### 3. Section inversion is metronomic, not rhythmic. **MAJOR**

**What:** Background sequence going down the page: landing (ink) → manifesto (limestone) → data (ink) → collection (limestone with internal alt of ink/lime/ink/lime per room) → exhibition (ink) → experiences (limestone) → reviews (ink) → counters (limestone) → space (limestone) → footer (ink). Plus `.room-block--invert` toggles every other room (`html:189`, `237`; `style.css:714-718`). That's 9 large-scale flips in one scroll, with a sub-pattern of 4 more flips nested inside the collection.

**Why it matters:** When inversion happens every section, it stops being an event. The reader's eye recalibrates to limestone-text-on-ink, then ink-text-on-limestone, then back again, ~13 times. It's exhausting, and worse, when the exhibition (the supposed centerpiece) finally goes ink, that gesture has been used four times already and lands as just-another-section, not a designated stage. Compare to the Peter & Paul Hotel mood: dark moments are *rare* and therefore weighty.

**Fix:** Reduce dark sections to at most three across the document and give them narrative meaning: the landing (entry), the exhibition (centerpiece), the footer (sign-off). Make manifesto, data, collection, experiences, reviews, counters, space all limestone. The data grid will work on limestone if the cell hover background-image overlay is darkened. The reviews-on-ink is doing nothing dark needs to do — move it to limestone and let the rotated cards carry the moment.

---

### 4. Cormorant 300 italic against Inter 900 at display size — the thin half is fragile. **MAJOR**

**What:** `.exhibit-title-line--ital` (`style.css:924-932`) is Cormorant italic, weight 300, at `clamp(3.6rem, 13vw, 14rem)`, terracotta on ink. Same combination at `.the-space-heading` (`style.css:1572-1585`) at `clamp(4rem, 12vw, 13rem)`. The Google Fonts import (`style.css:6`) only loads Cormorant `wght@0,300;0,400;1,300;1,400` — no heavier italic weight is available.

**Why it matters:** Cormorant at weight 300 is a delicate face designed for body sizes. Stretched to 14rem (~224px) in italic on a near-black background and rendered with `text-rendering: optimizeLegibility`, the stems get hairline-thin — at viewport widths around the clamp midpoint it will visibly shimmer, and on lower-DPI displays it'll look anemic next to the Inter 900 line above it. The boldest move of the variant (Inter 900 condensed ↔ Cormorant italic) is being undermined by the thinnest weight of the serif.

**Fix:** Either (a) load Cormorant Garamond 500 italic (`1,500`) and use that for the display italic — still elegant, structurally solid at scale — or (b) switch the display italic face to Cormorant Infant or Cormorant SC italic 500, or (c) move to Playfair Display Italic 400 / GT Sectra Display, which were built for this combination. Body italic (artist names in `.artist-name`, the `<em>` inside `.exhibit-statement p`, the `.exhibit-foot-block strong`) can stay at 400 — the problem is specifically display-size italic at 300.

---

### 5. The exhibition title doesn't visibly out-rank the room names. **MAJOR**

**What:** `.exhibit-title` is `clamp(3.6rem, 13vw, 14rem)` Inter 900 (`style.css:917`). `.room-name` is `clamp(3rem, 11vw, 12rem)` Inter 900 (`style.css:744`). Same face, same weight, same condensing, the room-name's clamp midpoint is ~85% of the exhibit-title's. Both stack 3 lines via `<br>`. The 4 rooms appear *before* the exhibition in the scroll, so the reader establishes "this is the display tier" with room-name and then meets exhibit-title doing essentially the same move but only marginally bigger.

**Why it matters:** The brief explicitly asks whether the exhibition's curatorial typography feels more elevated than rooms/experiences. It does not. The exhibition's distinctive move (the Cormorant italic line) is doing the lifting that the size differential should also be doing. As built, the exhibition reads as Room №V — another catalog plate, slightly fancier.

**Fix:** Either (a) shrink room-name decisively — `clamp(2.2rem, 7vw, 7rem)` so the exhibit-title clearly outranks at every breakpoint, and lean on the №&nbsp;I / №&nbsp;II catalog numerals to carry hierarchy where the size used to; or (b) make the exhibit-title considerably bigger and looser — `clamp(5rem, 18vw, 20rem)` line-height 0.82 — and let the Cormorant line truly fill the field. Right now both moves are at "medium-loud."

---

### 6. The Inter 900 ↔ Cormorant italic mix at the exhibit title is right; the execution undersells it. **MAJOR**

**What:** `.exhibit-title-line--ital` sits below `.exhibit-title-line` on its own block-level line with only `padding-left: 0.08em` to nudge it (`style.css:923-932`). The italic line is "interior" — *lowercase, italic, terracotta* — directly below "EL JARDÍN" — *uppercase, Inter 900, limestone*. Two strong moves in series with zero kerning relationship.

**Why it matters:** The whole point of the Inter/Cormorant mix in display is that the italic *interrupts* or *converses with* the Inter — it should feel like a whispered subtitle that the Inter heading is acknowledging, not a stacked second headline. As built, they look like two unrelated H1s. The terracotta color on the italic line further breaks the relationship; it makes the italic feel like an accent label rather than continuation of the same title.

**Fix:** Three options worth prototyping: (a) tuck "interior" into negative top margin so it visually overlaps the descenders of "JARDÍN" — `margin-top: -0.2em; padding-left: 1.4em;` to make the italic feel parasitic on the Inter; (b) inline the italic — render "EL JARDÍN *interior*" on one line if it fits at large viewports, letting Cormorant 300 italic carry the final word like a serif coda; (c) drop the terracotta on the italic, render it in limestone at 75% opacity so it reads as continuation, and use terracotta only for the eyebrow VOL. III tag — that restores monochrome typography as the dominant gesture with terracotta as punctuation.

---

### 7. Manifesto color-flip on lines 3 + 6 is self-defeating on line 6. **MAJOR**

**What:** `.manifesto-line:nth-child(3)` and `:nth-child(6)` are terracotta (`style.css:554-561`). Line 3 is "NO COMPROMISE." Line 6 is "WHISPER, DON'T SHOUT." Both rendered at `clamp(1.8rem, 6vw, 5.2rem)` Inter 800 condensed all-caps with terracotta accent border-left.

**Why it matters:** Line 6 is the climactic line — and it's the loudest, brightest, most ALL-CAPS thing on the page, telling the reader to whisper. That's not knowing irony; that's the design contradicting its own copy. The brief asks if this flip is "earning its place." Line 3 earns it (the declaration "no compromise" *can* shout). Line 6 actively damages the brand voice.

**Fix:** Either (a) flip only line 3 in terracotta and render line 6 in limestone at 50% opacity with the border-left muted to a hairline — the whisper is whispered; or (b) render line 6 in Cormorant italic 400 at the same point size as the other lines, instantly de-tuning the shout while keeping the manifesto's bones intact. Option (b) is the stronger move — it earns the title "manifesto" by ending with a register shift.

---

### 8. The floorplan is content-incorrect and reads as a colored table, not a schematic. **MAJOR**

**What:** `.exhibit-floorplan` label says "GROUND FLOOR INSTALLATION MAP" (`html:386`). The six `.fp` cells include "SUITE № IV" (`html:413-416`) — but the page elsewhere establishes Suite № IV as the **Penthouse on the third floor** (`html:240, 246`: "PENT-/HOUSE/SUITE", "third floor, private terrace"). A ground-floor map cannot contain a third-floor suite. Visually, the "schematic" is a 3×2 grid of dark rectangles with letter tags (`style.css:1169-1222`), no walls drawn, no doorway indications, no scale, no compass — it's a colored data table cosplaying as a floorplan.

**Why it matters:** The catalog apparatus's credibility lives or dies on details like this. A real museum catalog's installation map has walls, doors, sight-lines, north arrows. This has padding and border-bottoms. And the moment a reader notices the penthouse on the ground floor, the whole "we are serious about this" gesture collapses.

**Fix:** Either (a) commit to drawing a real floorplan in SVG — limestone walls 2px stroke, courtyard outlined as central void, doorways as 6px gaps, plates as small numbered dots placed at correct locations, north arrow upper-right — and put it *in addition to* the data table; or (b) drop the word "schematic" and reframe the block as "INSTALLATION INDEX — BY LOCATION," removing the floorplan pretense, removing fp--courtyard's bigger span, and making it a clean 6-card grid. Also fix the ground-floor / penthouse contradiction either way: relabel as "INSTALLATION MAP — ALL FLOORS" or remove Suite IV from this view.

---

### 9. Cenote teal vanishes; the brief said it was the fourth color. **MAJOR**

**What:** `--cenote: #1f5e64` is defined at `:root` (`style.css:22`) and referenced exactly twice in the stylesheet: both inside the `@keyframes manifesto-glitch` text-shadow (`style.css:566, 567`), which fires for 200ms when a manifesto line scrolls into view. There is no other cenote in the document. Builder caveat acknowledged this; the question is whether restraint earns the cost.

**Why it matters:** Restraint without sighting is invisibility. The reader never sees cenote, so the palette reads as 2-color + accent (limestone, ink, terracotta) — and the page would lose nothing if `--cenote` were deleted entirely. The hotel name nods to a museum and Mérida's cenote landscape; the palette should at least *show up* on the page in one deliberate location.

**Fix:** Give cenote one anchor location it owns. Best candidate: the curatorial statement quotation marks / opening drop-cap, or a single horizontal hairline rule under the exhibit-title's italic line, or the `:checked`/`:focus` state for the newsletter input border at the very bottom. Pick one. Use it nowhere else. The point is to give the eye a single "oh, there's that other color" moment that grounds Mérida — without diluting the terracotta accent system.

---

### 10. The catalog labeling apparatus is inconsistent — leading dash usage is random. **MINOR**

**What:** Some inner labels begin with an em-dash, some don't. Has dash: `.exhibit-statement-label` "— CURATORIAL STATEMENT" (`html:290`), `.exhibit-roster-label` "— ARTISTS IN ROTATION / VOL. III" (`html:300`), `.floorplan-label` "— SCHEMATIC / GROUND FLOOR INSTALLATION MAP" (`html:386`), `.experiences-intro-label` "— CURATED MÉRIDA" (`html:445`), `.footer-label` "— RESERVE" / "— CONTACT" / "— INDEX" / "— DISPATCHES, QUARTERLY" (`html:633, 637, 645, 651`). No dash: `.section-label` "01 / MANIFIESTO — DECLARATION OF INTENT" (`html:82`), `.exhibit-foot-label` "PARTNERS" / "PROGRAM" / "CATALOG" (`html:423, 428, 433`), `.exhibit-eyebrow` "CURRENT EXHIBITION" (`html:267`), `.exp-meta` (no labels at all, just span pairs), `.room-spec-label` "ORIGEN" / "PERÍODO" (etc.), `.counter-label`, `.space-gallery-tag` "FIG. 01 — COURTYARD".

**Why it matters:** In a stage-set that depends on looking like a curated catalog system, the apparatus needs to be a system. Right now, an attentive reader picks up that "the dash means something" and then watches it appear and disappear without rule. It saps the catalog credibility — the same wound as the floorplan/penthouse error, smaller cut.

**Fix:** Pick one rule and apply it. Strongest convention: leading em-dash means *section-internal sub-heading*, no dash means *first-level section label*. Under that rule, `.section-label` (outer 01/02/03) stays no-dash, all internal sub-labels get the dash, and the `.exhibit-foot-label`, `.room-spec-label`, `.counter-label` should all get dashes added. Alternatively, drop the dash entirely and let the terracotta color carry the role.

---

### 11. The data cells are noisy without earning the noise. **MAJOR**

**What:** `.data-cell` (`style.css:630-698`) is a 3×3 grid where each cell shows: a tiny mono caption ("ROOMS: FIFTEEN" + small line "// 15 KEYS, NO MORE") over a hidden background image that fades in on hover. The cell-hover behavior dims all other cells to 0.55 opacity (`style.css:692`), highlights the cell's row/column via JS (`main.js:228-258`), inserts a frosted-glass backdrop behind the caption text (`style.css:677-684`), and applies an inset terracotta glow box-shadow. That's five effects per cell, every cell.

**Why it matters:** The cells contain extremely thin content (one fact per cell, mostly repeated info you've already shown: coordinates appear here AND in the landing AND in the footer; "ROOMS: FIFTEEN" is also in the manifesto and the counters). The five effects + bg image reveal feels like the design is *compensating for* the thinness. The frosted-glass backdrop on hover (`backdrop-filter: blur(8px)`) is doing exactly the glass-morphism the user has explicitly rejected — it sneaks in via hover state.

**Fix:** Reduce to one effect: row/column highlight stays (it's the brutalist data-grid signature), drop the bg image reveal entirely, drop the inset glow, drop the frosted-glass overlay on hover. The captions become legible from rest because there's no image fading in behind them. The grid then reads as a clean 9-cell spec card, like a museum entrance plaque. Also: cut duplicate facts — the 9 cells should be 9 *different* things. Currently "COORDS" (cell 3) + "ELEV" (cell 4) overlap with the landing corners (`html:58-62`) and the footer-stamp (`html:660`). Replace two cells with content that exists nowhere else: "RESTORATION ARCHITECT" / "MEDIUM (BUILDING)" / "OWNER-OCCUPIED SINCE" / "GUEST:STAFF RATIO."

---

### 12. Counter row breaks its own rhythm at "CERO" and "2023." **MINOR**

**What:** `.counters` (`html:549-575`) renders 15 / 1 / CERO / 6 / 2023. Cells 1, 2, 4 are single or double digits in terracotta Inter 900 at `clamp(3.5rem, 10vw, 9rem)`. Cell 3 is the word "CERO" rendered at the same scale (4 characters wide). Cell 5 is "2023" but rendered at `counter-number--small` (`clamp(2.4rem, 5.5vw, 4.6rem)`), roughly half size. Cell 5 also gets `.counter-cell--wide` modifier but at desktop the wide modifier doesn't change column span (`style.css:1858`).

**Why it matters:** A row of five counters that all look the same except the data inside is the move. Any variation should be deliberate — the brief asks specifically about whether labels and numbers are clear at a glance. As built, the eye trips twice: once on the wide-letter word "CERO" interrupting a digit rhythm, and again on "2023" being demonstrably smaller. "CERO" is a great brutalist gesture (the zero spelled out is more emphatic than a numeral) but it needs to be the *only* irregularity in the row. Making 2023 smaller too dilutes the gag.

**Fix:** Render 2023 at the same size as the other numerals — `clamp(3.5rem, 10vw, 9rem)` — and let it run wider naturally. The four-digit width difference is fine; the *size* should match. Or, conversely, render "CERO" at the smaller size to acknowledge it's lexical and the digits are numerical, and remove `--wide` from 2023. The current "both anomalies, equal weight" is the weakest answer.

---

### 13. The five-star glyph row in reviews is unaffordable typography. **MINOR**

**What:** `.review-stars` (`html:520`, `style.css:1490-1495`) renders `★★★★★` as five literal U+2605 BLACK STAR characters in terracotta at 0.95rem. No aria-label, no sr-only equivalent — assistive tech reads "black star black star black star black star black star."

**Why it matters:** Two problems. Typographic: five black stars is a TripAdvisor convention, exactly the opposite of "field notes transcribed from a guest ledger" — a hand-transcribed ledger doesn't have stars, it has a date and a hand. Accessibility: screen-reader users hear the meaningless glyph repeat. The brutalist art-catalog framing is broken the moment a 5-star pictogram appears.

**Fix:** Replace the star row with a mono date stamp matching the ledger metaphor — `<div class="review-stamp">№ 042 · 15 MAR 2026</div>` rendered in the existing mono micro style. If you want a quality indicator, use a single rule (e.g. a 1px terracotta hairline 60px long) rather than star pictograms. If stars must stay, add `<span class="sr-only">5 out of 5 stars</span>` and `aria-hidden="true"` on the visual.

---

### 14. Accessibility — focus-trap missing on menu overlay; tabindex on data cells does nothing. **MAJOR**

**What:** `.menu-overlay` has `role="dialog" aria-modal="true"` (`html:32`) but `main.js:11-34` only toggles its `.active` class and sets body `overflow: hidden` — there is no focus trap, no return-focus-to-trigger, no `inert` on the rest of the page. A keyboard user opening the menu can Tab out of the dialog into the page behind it while it's "modal." Separately, `.data-cell` has `tabindex="0"` on every cell (`html:121-156`) which makes them keyboard-focusable but no `aria-label`, no role, and no action — the keyboard user lands on each cell, gets the visual highlight effect, and discovers there's nothing to activate.

**Why it matters:** `aria-modal="true"` is a lie if focus isn't trapped. Screen reader users will be told they're in a modal, then quietly leak focus into navigation announcements from the page behind. The data-cell tabindex is dead weight in the tab order — 9 cells × 0 actions = 9 useless stops.

**Fix:** (a) On menu open, set `inert` on `.nav` and on every direct child of `body` except `.menu-overlay`, then focus the close button; on close, remove inert and return focus to the menu trigger. Also tab-cycle within the overlay (or rely on inert + focus-trap polyfill). (b) Remove `tabindex="0"` from `.data-cell` — make the row/column highlight a pointer-only enhancement (or, if you want keyboard parity, make the cell a `<button>` that navigates to whatever the cell's data references). (c) Audit focus-visible outline: terracotta on ink is ~3.1:1 contrast — borderline for non-text focus indicators (WCAG 1.4.11 requires 3:1). On ink backgrounds, switch focus outline to `2px solid var(--limestone)`.

---

### 15. Mobile — the condensed display type and the catalog apparatus survive; the floorplan and plate grid pancake awkwardly. **MINOR**

**What:** At 768px (`style.css:1929-1990`): `.exhibit-plates` collapses 12-col → 6-col with plates 02–05 in 3-col pairs (`style.css:1874-1880`). At 480px (`style.css:1992-2025`) plates go single-column. The floorplan at 1024px (`style.css:1888-1898`) becomes 2×3, with the special "courtyard" 2-row span (which carried visual meaning at desktop as the central void) reduced to a single cell — losing the "courtyard is the heart" gesture. Manifesto lines at 480px: `clamp(1.8rem, 6vw, 5.2rem)` → 6vw of 480 = 28.8px = ~1.8rem, with `letter-spacing: -0.025em` and `line-height: 1.05` — still legible, OK. Room name `clamp(3rem, 11vw, 12rem)` at 480px = ~3.3rem, with manual `<br>` line breaks and `letter-spacing: -0.055em` — "PENT-/HOUSE/SUITE" (`html:240`) has an explicit hyphenated break that at small sizes makes "PENT" land alone for a beat before the eye picks up the rest.

**Why it matters:** Mobile is where the brutalist gesture either holds or dissolves into a stack of cards. The exhibition centerpiece — the 12-col plate grid — at mobile becomes a 1-col image stack identical to any other "image + caption" pattern. The floorplan loses its compositional meaning. The hyphenated "PENT-HOUSE" reads as a typo on a phone.

**Fix:** (a) On mobile keep the plate grid as a 2-col mosaic with cropped, smaller plates rather than collapse to 1-col — the catalog feel is lost when each plate becomes a full-width image. (b) For the floorplan at mobile, keep the courtyard's 2-cell span — make the courtyard cell `grid-row: 1 / span 2` so the center-of-the-house gesture survives. (c) Re-line-break the room name to avoid hyphenation: "PENTHOUSE / SUITE" on two lines, or single line "PENTHOUSE SUITE" with `font-size: clamp(2.2rem, 9vw, 12rem)` to fit. Hyphenating a brand name across lines is a visual stutter on mobile.

---

### 16. Manifesto-coda Cormorant is roman, not italic — weakens the type voice. **NIT**

**What:** `.manifesto-coda p` (`style.css:577-584`) is Cormorant 400 *not italic*, 1.05–1.3rem, `color: var(--earth)`. Meanwhile every other Cormorant occurrence on the page is italic: `.exhibit-statement p` (italic via the parent class — actually no, statement p is just Cormorant 400, but `.exhibit-statement p em` is italic terracotta), `.exhibit-foot-block strong` is Cormorant italic, `.artist-name` is Cormorant italic, `.the-space-heading` is Cormorant italic 300, `.review-text` is Cormorant italic, `.exhibit-title-line--ital` is Cormorant italic, `.plate-title em` is italic. There is exactly one Cormorant block that's roman: the manifesto coda. (Actually the exhibit-statement body is also roman with italic emphasis, so two roman Cormorant blocks total.)

**Why it matters:** The page establishes "italic Cormorant = the human voice / curatorial register." The manifesto-coda is the most *voice-y* paragraph on the page ("Un refugio en el corazón de Mérida...the hush of limestone walls before sunrise"). Rendering it in roman breaks the convention at the exact spot the convention would pay off most.

**Fix:** Render `.manifesto-coda p` as Cormorant 400 *italic*, with the bilingual opening "Un refugio en el corazón de Mérida" carried in italic — that matches the curatorial-statement voice and earns the established type vocabulary. Or: keep manifesto-coda roman and switch exhibit-statement to roman too, locking in "italic = display only, roman = body voice." Pick one rule.

---

### 17. The terracotta is over-budget — used on text, borders, backgrounds, outlines, animations. **MINOR**

**What:** Quick survey of terracotta uses: `::selection` background, `.skip-link` background, focus outline, `.cursor-readout` text + border, `.menu-overlay a:hover` color, `.menu-num` color, all `.section-label` underline + the dark/exhibit variants' background, `.landing-byline` color + rule, `.landing-corner--tr` color, `.landing-coords` color, `.manifesto-line:nth-child(3,6)` color + border, the manifesto-glitch animation, `.data-cell:hover` border + glow, `.room-num` color + border, `.room-version` color, `.room-caption` border-left, `.room-cta:hover` background, the room-cta vibrate accent, `.exhibit-eyebrow` color + line, `.exhibit-title-line--ital` color, `.exhibit-dates-val` color, `.exhibit-statement p em` color, `.exhibit-statement-label`, `.exhibit-roster-label`, `.artist-num`, `.plate-num`, `.floorplan-label`, `.fp-tag` border + color, `.fp--courtyard` background tint, `.exhibit-foot-label`, `.exhibit-cta` background, `.experiences-intro-label`, `.exp-num`, `.exp-from` color + border, `.exp-card:hover` background tint, `.offer-row` border + background tint, `.offer-tag` color + border, `.reviews-heading` color, `.review-stars` color, `.review-card:hover` border, `.counter-number` color, `.counter-cell.counted` background tint, `.counter-line` background, `.the-space-heading-sub` color, `.space-gallery-tag` border-left, `.space-address-stamp` border + background tint, `.space-coords` color, `.footer-label` color, `.footer-newsletter-label` color, `.footer-newsletter button:hover` background, `.footer-stamp` color + rule, `.footer-links a::before` underline tint. Roughly 50+ touchpoints.

**Why it matters:** The brief claims terracotta is "the accent — sparingly" (`style.css:19`). 50+ uses isn't sparing. It's the page's third workhorse color alongside limestone and ink. The eye stops noticing it. When everything is the accent, nothing is. This is why the "el Jardín *interior*" italic line in terracotta doesn't punch — because by the time the reader reaches it, terracotta has already appeared 30+ times.

**Fix:** Aggressively prune. Remove terracotta from: focus outline (use limestone on dark / ink on light), `.section-label` underlines (use 1px limestone/ink hairline), `.room-num` border, `.room-version` color (use stone gray instead), all `.*-label` colors (use the existing `opacity: 0.45` mono treatment), `.counter-number` color (use ink — the size is the gesture), `.counter-line`, the `.footer-stamp` and `.footer-stamp-rule`, the entire footer-newsletter-label cursor blink (use limestone), `.space-gallery-tag` border-left, `.space-coords` color, `.space-address-stamp` tint, all the `.exp-from` / `.offer-*` color usages (use ink with `font-weight: 700`). Reserve terracotta for: the section-label--exhibit text only, the exhibit-title italic line, the exhibit-cta button background, the manifesto line 3 only, and a single hairline rule on landing. ~6 uses total, every one earned.

---

## What's working

- The `№&nbsp;I` / `№&nbsp;II` Roman numeral catalog numbering with terracotta hairline underline on the room headers (`html:167, 191, 215, 239`; `style.css:729-740`) is genuinely good catalog typography. Keep it.
- The artist roster as a Cormorant italic list with mono biographical data on the right (`html:301-308`, `style.css:1029-1064`) is the cleanest hierarchical move in the document — italic name carries the human, mono carries the metadata, and the dashed border-bottom matches old auction-catalog conventions. This is the typographic move the rest of the page should aspire to.
- The plate-caption stack (`plate-num` mono terracotta micro / `plate-title` Cormorant italic / `plate-meta` mono lowercase normal-case / `plate-loc` mono uppercase tracked) is the only place where 4 mono+serif tiers truly differentiate. The `text-transform: none` on `.plate-meta` (`style.css:1132`) is doing exactly the right thing — material descriptions read as text, not labels.
- The landing title's per-letter `transform` micro-tracking on mousemove combined with scroll-dispersion (`main.js:64-123`) is a coherent kinetic gesture that doesn't overstay its welcome — and unlike the noise-flash and the vibrate animations, it serves the brutalist art-object framing.
- The `cursor: crosshair` on landing and data-grid sections is the right haptic signal for "this is an apparatus, not a website."
