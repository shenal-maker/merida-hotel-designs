# V2 Editorial Magazine — Revision R1

Round 1 fixes applied to `index.html`, `css/style.css`, `js/main.js` against
`CRITIQUE_R1.md`. Keeping the variant in its editorial-magazine voice — the
apparatus (markers, plate numbers, draw-lines, spine) is preserved, but the
*system* now actually works as a system.

## Findings applied

### 1. Section numbering aligned — MAJOR — applied
- Hero is now `data-cover="true"` (no longer in the numbered sequence; it's the cover).
- `data-section` renumbered on every section: 2→1, 3→2, 4→3, 5→4, 6→5, 7→6, 8→7, 9→8, 10→9.
- Visible `01 /`–`09 /` markers in body now agree with the JS-driven page-counter.

### 2. Hero "by The Museo" italic-on-italic — MAJOR — applied
- Replaced `<em>by</em>` with `<span class="hero-by">by</span>`.
- `.hero-by` is now small-caps Inter (500-weight, 0.24em tracking, stone), sitting like a printed by-line ligature — closer to Mas Girbau than the previous decorative ochre swatch.
- `.line-3` stays italic and carries the slant on its own.

### 3. Drop cap fixed + introduced rhythmically — MAJOR — applied
- Tuned `.drop-cap::first-letter` to `font-size: 3.6em; line-height: 0.78; margin-top: 0.12em; padding-right: 0.08em;` and added `.drop-cap { padding-top: 0.25rem; }`.
- Added drop caps to two more openings: the second Sanctuary body paragraph ("The house dates to the late nineteenth century…") and the Treehouse deck ("Vivir dentro de la exposición…"). Three drop caps now create rhythm rather than ornament.

### 4. El Estándar dark-panel contrast — MAJOR — applied
- `.standard-deck` opacity 0.65 → 0.82 (passes AA on `--ink`).
- `.standard-stat-unit` swapped `var(--stone)` for `rgba(250, 246, 238, 0.6)` (desaturated ivory on ink, AA-safe).
- Same fix on `.visit-detail-mono` for the Visit panel (also `--ink` ground).

### 5. Sanctuary three-element headline at tablet — MAJOR — applied
- Tablet breakpoint (`max-width: 1024px`) now centres the headline as a stacked triplet (`text-align: center` with `gap: 0.6rem`) instead of collapsing to left-aligned source order. The big word stays the centred middle beat — readable as a single sentence, not three labels.

### 6. Plate referencing made real — MAJOR — applied
- Embedded `<em class="plate-ref">` references in body copy:
  - Editor's Note → "a corridor of which is shown opposite, in *Plate II*."
  - Sanctuary → "the shade of the central patio at three in the afternoon (see *Plate XIV*)".
  - Treehouse deck → "throughout the house, the corridors, the suites, the courtyard (see *Plates X–XIII*)".
  - Curated Mérida → "Two cenotes the buses do not know (one of them in *Plate XIX*)".
  - Photo Essay → new intro paragraph naming *Plate XVI*, *Plate XVIII*, *Plate XXI*.
- `.plate-ref` rule styles them as italic ochre-deep with 0.01em tracking — consistent with the Spanish-italics treatment elsewhere on the page.

### 7. Ochre triage — MAJOR — applied
Chosen rule: **ochre = magazine apparatus + brand-as-italic via `--ochre-deep`.**
**Demoted to `--stone` (or `--ink`):**
- focus rings → `outline: 2px solid var(--ink); outline-offset: 4px;`
- `.hero-meta-sep`, `.masthead-logo-dot`, `.signature-mark`, `.hero-scroll-hint`
- `.treehouse-title .treehouse-and` (the "The"), `.treehouse-cross` (× glyph)
- `.cite-sep`, `.page-counter-sep`, `.page-counter-label`, `.colophon-masthead-sep`
- `.colophon-social a:hover` → `--ink`
- `.colophon-section a::after` (footer nav underline) → `--stone`
- `.sanctuary-headline .small-caps em` → `--ochre-deep` (italic-accent role)

**Kept as `--ochre`** (apparatus / primary brand affordance):
- `.section-marker`, `.draw-line`, `.aside-eyebrow`, `.merida-tag`, `.merida-num`, `.room-meta`, `.plate-tag`, `.treehouse-fullbleed-num`, `.treehouse-coda-eyebrow`, `.visit-eyebrow`, `.colophon-publication`, `.colophon-section h4` — these are the editorial spine.
- `.visit-cta` background, `.hero-cta:hover`, `.newsletter-btn:hover`, `.room-cta--filled::before`, `.voices-scroll-bar` — primary conversion affordances.

### 8. Font-weight payload trimmed — MAJOR — applied
- Pruned Google Fonts URL: Cormorant `0,400;0,500;1,400;1,500` (was six roman + four italic), Inter `400;500;600` (was four). DM Serif Display unchanged.
- Did **not** refactor body copy to Cormorant 300 (the critique's "better" option) — that's a substantive type-set change Round 2 should make alongside any copy revision, not a side-effect of this pass.

### 9. DM Serif Display sizing pulled back — MAJOR — applied
- `.hero-title .line-2`: `clamp(5rem, 13vw, 14rem)` → `clamp(4.5rem, 11vw, 10.5rem)`; letter-spacing −0.025em → −0.015em.
- `.sanctuary-headline .big-word`: `clamp(5rem, 11vw, 13rem)` → `clamp(4.5rem, 10vw, 10.5rem)`; letter-spacing −0.03em → −0.015em.
- Treehouse `×` is now a real `&#215;` glyph in roman DM Serif at 0.7em, baseline-aligned, stone-coloured — no longer reads as a typo'd italic.

### 10. Hero line-1 retracked — MAJOR — applied
- `.line-1` letter-spacing 0.32em → 0.22em (matches `.section-marker`).
- Copy trimmed from "A Quiet Quarterly — A Hotel of Fifteen Rooms" to "A Quiet Quarterly · Edición No. 1" — the giant "Fifteen" downstream carries the rooms count.

### 11. Page-counter de-chromed (no glassmorphism) — MAJOR — applied
- Removed the `background: rgba(...)` chip + `backdrop-filter: blur(6px)` entirely.
- Numerals now sit naked in the bottom-right margin.
- JS adds a `data-tone="dark"` switch on the page-counter when the current section is Estándar or Visitar — numerals shift to a desaturated ivory over the `--ink` grounds.
- Hero (cover) → `data-hidden="true"` while >50% visible, so the counter never reads "I / Nota" while the reader is still on the cover.
- Also removed the masthead's `backdrop-filter: blur(10px)` — same no-glassmorphism rule. Masthead is now solid `--ivory` / `--limestone` when scrolled.

### 12. Treehouse pretitle removed — MAJOR — applied
- Dropped the `<span class="treehouse-pretitle">A Feature — in collaboration with</span>` element + CSS. The Treehouse hierarchy is now: marker → title → deck → credits — three layers, not four. The marker is the sole kicker.

### 13. Voices giant decorative quote — MINOR — applied (removed entirely)
- Stripped `.voice-card::before` (the 7rem ochre opening curly-quote). The italic Cormorant `.voice-quote` already reads as a pull-quote. No overlap-during-scroll, no orphaned opening-without-closing.

### 14. Sepia filter on all images — MINOR — applied
- `.editorial-img img` filter `saturate(0.88) sepia(0.04) brightness(0.99)` → `saturate(0.95) brightness(0.98)`. Hover restores to 1/1. `@media (hover: none)` keeps a near-neutral filter (saturate 0.96) so touch devices don't get stuck in desaturation.

### 15. Colophon nav underline alignment — MINOR — applied
- `.colophon-section p, .colophon-section a` `line-height: 2` → `1.55` (with `margin-bottom: 0.35rem` for breathing room).
- `.colophon-section a::after` `bottom: 0.35rem` → `0.05rem` and re-coloured `--ochre` → `--stone` (apparatus carve from finding #7). Hover rule sits flush under descender.

### 16. Page-counter Roman numerals — NIT — applied
- JS now converts `data-section` numbers to Roman via a small lookup map. Sections read `I / Nota`, `II / Santuario`, … `IX / Visitar` — consistent with Plate I–XXI and MMXXVI. One numeral system across the page.

## What I did *not* change

- **Did not refactor Cormorant body to weight 300.** Finding #8 suggested it; pruning the font URL achieves the file-size half of the critique, and a 300-weight body-set change deserves a deliberate design pass with copy review.
- **Did not add a closing-quote glyph at the figcaption.** Finding #13 offered two fixes; I took the "remove the giant decorative quote entirely" path. Adding a tiny closing quote would re-introduce graphic-quote chrome the critique was suspicious of.
- **Did not move `.hero-cta:hover`, `.newsletter-btn:hover`, `.room-cta--filled::before`, `.visit-cta`, `.voices-scroll-bar` off ochre.** These read as primary brand affordances rather than ambient ochre noise, and downgrading them would weaken the conversion path. Triage rule applied is "ochre as apparatus + primary CTA," not "ochre as anywhere I felt like it."
- **Did not restructure the photo essay grid or trim the Plate XXI count.** Finding #6 offered "embed references OR trim count"; references are embedded.
- **Did not change copy beyond the hero line-1 trim, the new Plate references, and the new photo-essay intro sentence.** Per brief, narrative voice is Round 2's domain. The new sentences are written in the existing register (italic Spanish phrases, mdash separators, plate citations).
