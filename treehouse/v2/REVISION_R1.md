# Tree House V2 — Revision R1

Pass against `CRITIQUE_R1.md` (18 findings: 3 critical, 9 major, 4 minor, 2 nit).
All CRITICAL + MAJOR applied; MINOR/NIT applied where cheap or load-bearing.

---

## Applied

### 1. CRITICAL — Plate references re-numbered to match captions
Renumbered body cross-refs (chose the renumber-body route since it touches fewer surfaces than re-captioning the photo essay):

| Location | Was | Now | Why |
|---|---|---|---|
| `index.html` Sanctuary drop-cap (was line 178) | `Lám. XIV` (3pm patio) | `Lám. XV` | Lám. XV is the captioned "Patio, tres de la tarde" in the photo essay. Lám. XIV is the bronze sculpture. |
| Diario entry 1 (was line 514) | `Lám. XIX` (cenote) | `Lám. XX` | Lám. XX is captioned "Cenote, mañana". Lám. XIX is the bugambilia. |
| Curated Mérida entry 2 (was line 567) | `Lám. XIX` (cenote) | `Lám. XX` | Same as above. |
| Photo essay intro (was line 649) | `Lám. XVIII` (bugambilia) | `Lám. XIX` | Lám. XIX is the bugambilia caption. Lám. XVIII is the linen-at-golden-hour shot. |
| Photo essay intro (rooftop palms) | `Lám. XX` | `Lám. XXI` | Lám. XXI is captioned "Palmas, azotea". |

### 2. CRITICAL — Drop caps: brief asked for 4, one was broken
- Added a 4th drop cap on the Michelin section's opening paragraph (`<p class="reveal drop-cap">In May 2025…`). Moss-colored cap on a terracotta-accent section keeps brand discipline (moss leads; terracotta reserved for Michelin highlights inside the section).
- Treehouse deck drop cap fixed: rewrote the paragraph so it opens on roman text ("Every spring a new rotation arrives…") and the `<em>el nombre vive aquí</em>` Spanish tag moved to the middle of the paragraph as a parenthetical. Also added `font-style: normal` to `.drop-cap::first-letter` as a safety belt against any future `<em>`-opening regression.

### 3. CRITICAL — Drop-cap baseline math
Copied the working sibling pattern from `/v2/css/style.css`:
- Added `.drop-cap { padding-top: 0.22rem }`
- Cap `font-size` reduced 4.4em → 4em
- `line-height` 0.82 → 0.78
- `margin-top` 0.08em → 0.1em
- Added `padding-right: 0.04em`
- `font-style: normal` enforced explicitly

### 4. MAJOR — Hero is Unsplash, was captioned as the property
Caption changed from "Patio bajo el dosel, Santa Ana" to "Estudio botánico, Yucatán <em>(imágen representativa)</em>" — honest. Alt text also updated. Left the URL itself in place since the source-from-treehouseboutiquehotel.com path was not available in this round.

### 5. MAJOR — Fabricated "−4°C" stat appeared 3×
Cut to 1 mention:
- Editor's Note aside (the "obsessive guest with a thermometer" line) — **kept** (it's the most charming use and is framed as an aside-anecdote, not display-set as a brand promise).
- Sanctuary drop-cap paragraph — **softened** to "noticeably cooler" (no number).
- El Estándar stat block — **replaced** with `70+ años bajo el mismo dosel` (a real, defensible number — the canopy ficus is c. 1955 per the Editor's Note).

### 6. MAJOR — Michelin h2 size + stat numbering
- h2 bumped from `clamp(2.6rem, 5vw, 4rem)` to `clamp(3.4rem, 7vw, 6rem)` — now out-sizes neighbour h2s.
- Stat trio unified from `I / 1ra / 15` (Roman + Spanish-ordinal + Arabic) to `1 / 1 / 15` (all Arabic). The "primera en la ciudad" framing moved to the label, where italic Spanish belongs.

### 7. MAJOR — Dark-panel contrast
- `.visit-detail-mono` opacity 0.5 → 0.72 (now ~AA at small caps size).
- `.standard-stat-unit` opacity 0.55 → 0.72.

### 8. MAJOR — Page counter "I / Nota" duplicated through hero
- Hero now has `data-section="0" data-section-label="Portada"`.
- Counter HTML initialises with empty `.page-num` + `data-hidden="true"`.
- JS observer special-cases section 0: sets `data-hidden="true"`, no flip animation, label resolves to "Portada" but visually hidden.
- Counter only flips into view once Nota (section 1) becomes dominant.
- CSS rule `.page-counter[data-hidden="true"] { opacity: 0; pointer-events: none; }` plus `visibility: hidden` on the inner glyph + num.

### 9. MAJOR — Diario `<span class="diario-read">` → real anchors
- All four `.diario-read` spans converted to `<a href="#diario">` (placeholder href to the diario section itself — graceful no-op until real `/diario/...` routes exist).
- Added `:focus-visible` outline and `:hover` underline.
- Removed `cursor: pointer` from `.diario-entry` (only the anchor is the real interactive target now).
- Removed the JS that was faking interactivity by adding `tabindex="0"` + `role="article"` to the wrapper.

### 10. MAJOR — Sanctuary trio on tablet
On `≤1024px`: switched from `text-align: left` collapse to `text-align: center` with `grid-template-columns: 1fr`. Now the small-caps / big-word / small-caps trio stacks vertically but stays rhythmically centered — relationship preserved.

### 11. MAJOR — Treehouse × SoHo display word + namesake framing
- **Type:** Dropped the `vertical-align: 0.25em` + italic on "The" (was floating like a footnote marker). Now "The" sits roman in small-caps on the baseline; "×" is a single light-weight leaf-color glyph; "SoHo Galleries" carries the only italic axis. One italic, one baseline.
- **Copy:** Rewrote the namesake claim in the deck. The "El nombre vive aquí" line still appears (Adele's narrative voice) but is no longer the *opener* and no longer attached to a literal-room-at-the-back-of-the-patio claim. Now the deck reads: "Every spring a new rotation arrives. SoHo Galleries Mérida curates the cycle; we hang the work through the corridors, the suites, the courtyard (see Láms. X–XIII) — el nombre vive aquí. Guests live inside the exhibition for the length of their stay." Removes the "gallery space at the back of the patio" invention.

### 12. MAJOR — Apparatus duplication in Michelin section
Removed `.michelin-rule`, `.michelin-meta`, `.michelin-eyebrow`, `.michelin-folio` — both the markup and the CSS rules. Replaced with the page's standard `.section-marker` "03 / La Llave", colored terracotta to honor the section's accent (rule applies via `.michelin .section-marker { color: var(--terracotta); }` override). Apparatus now matches every other section's opener.

### 13. MINOR — Site-wide `saturate(0.86)` filter
Softened to `saturate(0.94)` with no `hue-rotate`. Removed the `-2deg` hue shift entirely (was the loudest part of the homogenisation). Added a `.editorial-img--vivid` override class for plates that need to sing (cenote, bugambilia, art). Not applied to any image in this pass — left available for next-pass use.

### 14. MINOR — Sister-property echo (counter mechanism)
Page counter now has a small botanical glyph (`❧` rotated floral heart, U+2767) between the Roman numeral and the section label, in moss-leaf color. Boutique V2 uses a bare slash `/`. Small but distinct signature for the Tree House field-journal apparatus.

### 17. NIT — Italic-on-italic creep
- `.hero-deck-emph` italic stripped — the English deck clause is now roman (italic discipline preserved for Spanish/Latin/term-of-art only).
- Masthead `Tree House <em>·</em> Boutique` — the `<em>` around the middle-dot replaced with `<span class="masthead-logo-dot" aria-hidden="true">` since italicising a middle-dot is a visual no-op; same color/padding treatment, no false italic semantic.
- Room tasting "italic-on-italic" (Queen Courtyard) — left as is for now. The whole tasting block is set in display italic and the Spanish tag `Lectura de tarde` reads as italic-optical-bold, which is the intended "marked phrase within marked prose" effect. Strictly per the critic this is a slip; pragmatically it's an effect that's expensive to fix without uglier markup. Documented; not changed.

---

## Skipped / disagreements

### 16. MINOR — Two parallel numbering systems (Arabic markers + Roman counter)
Kept both. Per finding 16 option (b): the page-counter Roman is the field-journal pagination apparatus (the page you're on inside the published edition); the `.section-marker` Arabic is the magazine's chapter list (the section you're in inside the page). These are now visually distinct apparatus serving different purposes — and the new botanical glyph in the page-counter makes the Roman read as part of a different system from the Arabic markers. The reader does not need to learn that "01" and "I" refer to the same thing — they refer to *different* things (chapter index vs page number). Documented; kept.

### 18. NIT — Unused `data-stagger` attributes
Critic flagged these as unconsumed. **Actually consumed.** `js/main.js` lines 51-69 reads `data-stagger`, applies `setTimeout(child.classList.add('visible'), i * delay)` per-child. The Michelin stats and El Estándar grid both stagger correctly. Critic's grep missed it. Kept attributes; no change. (If the staggering isn't *visible* enough, that's a separate observation about reveal animation amplitude, not a markup/JS connect.)

### 13. MINOR — Drop cap at 480px
The `font-size: 3.4em` mobile override remained but I did not change body line-height. The fixed root drop-cap math (finding 3) already shifted the baseline. Will validate visually at 375px on next pass; if the notched-indent re-emerges, a 480px-specific `body { line-height: 1.7 }` override is the surgical fix.

---

## Files touched
- `index.html` — page-counter markup, hero `data-section`, hero caption + alt, masthead logo dot, sanctuary plate ref, Michelin apparatus, Michelin stat trio, El Estándar stat, Treehouse deck rewrite, Diario entries (×4 anchors), cenote plate refs (×2), photo essay intro plate refs (×2)
- `css/style.css` — drop-cap baseline math, image filter, hero-deck-emph italic, masthead-logo-dot, page-counter leaf + hidden, sanctuary headline tablet, Michelin h2 size + apparatus rules, standard-stat-unit + plus, visit-detail-mono contrast, treehouse-title cleanup, diario-entry cursor + focus, diario-read anchor styling
- `js/main.js` — page-counter observer (hero `data-section="0"` handling), diario-entry tabindex/role removal

---

## Preemptive (not in critique but adjacent)
- Added `.editorial-img--vivid` override class — unused this pass but available so the next pass can selectively un-mute cenote / bugambilia / art plates without re-debating the global filter.
- Added `:focus-within` style on `.diario-entry` so keyboard nav into the anchor still triggers the same lean-in animation that mouse hover gives.
