# Tree House V1 — Cinematic Immersive
## Round 1 Critique · Visual Hierarchy & Typography

Reviewing `treehouse/v1/index.html` + `css/style.css` (and `js/main.js` where relevant) against the shared Tree House brief and the already-revised Boutique V1 sibling at `/Users/adeleshen/boutique-museo-designs/v1/`.

15 findings. Most of this is good, disciplined work — the issues are concentrated in three places: H1↔H2 step, italic discipline, and the green-on-green legibility tax this dark-canopy palette has been quietly paying.

---

### 1. CRITICAL — H1 "Tree House" is too small to carry a Michelin-Key hero

**What.** `.display-huge` clamps at `clamp(3.5rem, 11vw, 13rem)` (css:443). The actual rendered word is just `Tree House` — two short words, hero centered, max-width 1100px. At desktop the vw track caps around ~11rem effective (≈176px), but on the dominant ~1440-wide laptop screen `11vw ≈ 158px` — comfortably *smaller than the sibling Boutique V1* whose `.display-huge` runs `clamp(3.5rem, 10vw, 15rem)` and renders a multi-word "Boutique by The Museo" headline (css:368). Boutique gets to look big with three words; Tree House has *two short words* and the same vw rate. The result on screen is a hero that doesn't dominate — it just sits there.

Compounded by:
- `line-height: 0.92` (css:445) is correct, but with only 2 words the title becomes a small island in the layout. There's no second display line doing work.
- The `<em>House</em>` in `--leaf-bright` (css:604, `!important`) is the same size as `Tree` — the green never *competes*, it just sits beside the ivory.
- The hero tagline below caps at `1.45rem` (css:620). Spread between H1 and tagline is fine numerically, but visually the hero reads "label / smallish title / small tagline / smaller buttons" — four medium-quiet tiers stacked.

**Why it matters.** A "first Michelin Key in the city" hero needs to feel inevitable on landing. The brief's voice line "Where the courtyard breathes. Fifteen rooms. One canopy." is doing the heavy lifting — but the H1 above it is undersized for the room it has. The Michelin badge in the corner (44px image) ends up being roughly the same visual weight as one letter of the title, which is *exactly backwards* for a property whose first asset is the prestige.

**Fix.** Two options. (a) Push `.display-huge` to `clamp(4.5rem, 14vw, 16rem)` and tighten `letter-spacing` to `-0.035em` — let two short words actually occupy the hero. (b) Restructure to a two-line title: small kicker "An adults-only house in Santa Ana" above a big `Tree House` — gives `.display-huge` a second line of negative space to feel imperial against. Either way, ditch the `!important` on `.hero-title em` (css:604) and define the override cleanly.

---

### 2. MAJOR — H1 → H2 gap is too small; type scale collapses in the middle

**What.** Compare the four display tiers (css:441–476):
- `.display-huge`:   `clamp(3.5rem, 11vw, 13rem)` → max ~208px
- `.display-large`:  `clamp(2rem, 6vw, 6.5rem)` → max ~104px
- `.display-medium`: `clamp(1.75rem, 4.4vw, 4.2rem)` → max ~67px
- `.display-small`:  `clamp(1.4rem, 2.5vw, 2.4rem)` → max ~38px

The desktop ratios are ~2:1, ~1.5:1, ~1.75:1 — okay on paper. But the **fluid lower bounds** are `3.5 / 2 / 1.75 / 1.4` — the gap between `display-large` and `display-medium` is only `0.25rem` (2→1.75). On any 1100–1300px screen those two tiers are nearly indistinguishable. `.display-large` is used for "Four ways to disappear", "The Journal.", "Curated Mérida." (lines 230, 473, 524). `.display-medium` is used for the Sanctuary, Michelin, Location, Offers headlines (lines 144, 185, 669, 720). Those should read as *different tiers*. They don't, at most desktop widths.

**Why it matters.** Section headlines collapse into one undifferentiated middle tier. The "rooms / journal / curated" group (display-large) should feel like *the chapter dividers* relative to the named-section headlines. Right now they don't.

**Fix.** Widen the gap. Recommend:
- `.display-large`: `clamp(2.6rem, 6.4vw, 6.5rem)` (lower bound up)
- `.display-medium`: `clamp(1.7rem, 4vw, 3.8rem)` (upper bound down)
This gives a real ~1.7× ratio at every viewport. Also: `.display-small` at 1.4rem min is dangerously close to `body-large` at 1.18rem max — it's still a serif vs sans, so the family difference helps, but on Cormorant fall back it'll look like a paragraph break, not a heading.

---

### 3. MAJOR — Italic usage isn't disciplined; it's *frequent*

**What.** The `em` treatment is defined as Cormorant italic ochre at display tiers (css:97–110) plus leaf-bright italic for hero tagline & footer-spanish (css:113–119). That's the system. Now count *actual* italicized phrases in the HTML:

- H1 `Tree <em>House</em>` (114) — leaf-green italic
- Hero tagline `<em>Fifteen rooms. One canopy.</em>` (113) — leaf-green italic
- Sanctuary H2 `wrapped in <em>leaves</em>` (144) — ochre italic
- Breath quote `<em>This one keeps you from the noise.</em>` (222) — ochre italic
- Michelin H2 `first <em>Michelin Key</em>` (185) — ochre italic
- Michelin cells: `<em>real</em>`, `<em>One</em>` (194, 204) — ochre italic
- Art H2: no em, but `<span class="art-cross">×</span>` is italic Cormorant green (css:1337)
- Art rotation H3 `<em>Bajo el Dosel</em>` (418) — ochre italic
- Art manifesto `<em>SoHo Galleries</em>` (395) — ochre italic
- Art quote `<em>It begins here.</em>` (464) — ochre italic
- Rooms H2 `<em>to disappear.</em>` (230) — ochre italic
- Journal H2 `<em>Journal.</em>` (473) — ochre italic
- Curated H2 `<em>Mérida.</em>` (524) — ochre italic
- Location H2 `<em>Calle 43.</em>` (669) — ochre italic
- Offers H2 `<em>a little longer.</em>` (720) — ochre italic
- Offer title `<em>30% off.</em>` (726) — ochre italic
- Footer spanish `<em>Una casa bajo el dosel…</em>` (779) — leaf-green italic
- Plus every testimonial body and breath quote is italic Cormorant (no `<em>` but italic at the type-style level)

Every H2 except one has an italic kicker at the end. **Italic stops being emphasis when every section title uses it.** It becomes the house style for "the last 2–3 words of a serif headline" — predictable, which is the opposite of italic's job. By section 6 the reader stops noticing.

**Why it matters.** The brief calls for "cinematic + botanical" — restraint is the point. The Boutique V1 sibling uses the same em pattern (you can see `.display-*` em rules at css:101–110, near-identical), so the *pattern* isn't new; it's that Tree House has *more headlines per page* and uses the trick on nearly all of them. The botanical green italic at hero "House" should be the one moment that makes a reader stop. By the time they get to "Curated <em>Mérida.</em>" it's wallpaper.

**Fix.** Pick a rule and stick to it. Suggestion:
- Reserve `<em>` for *one* word per H2 that genuinely carries meaning (the noun, not the prepositional phrase). Drop italic on "to disappear.", "a little longer.", "Calle 43." — these are grammatical tails, not the emphasis.
- Use the leaf-green italic only at the hero + once more as a deliberate echo (footer-spanish is fine). Right now it's two places + the testimonial author + breath quote in a different color — fine, but rule it.
- Decision criterion: ask "if italic disappeared from this phrase, would the meaning change?" If no, drop it.

---

### 4. MAJOR — Green-on-green legibility tax (sage on canopy)

**What.** The base background is `--canopy: #1a2e1f` and `--canopy-deep: #0f1c12`. The "secondary text" everywhere is `--sage: #b5c4a8` — and it's used for an enormous amount of UI:
- `.hero-eyebrow` (css:589)
- `.hero-cta-secondary` "Walk under the leaves →" (css:673)
- `.hero-meta__lbl` "Rooms / Adults Only / Yucatán" (css:767)
- `.scroll-indicator span` (css:795) — already at opacity 0.7
- `.rooms-subtitle` (css:1135)
- `.journal-intro`, `.curated-intro` (css:1593, 1700)
- `.curated-meta`, `.offer-fine`, `.art-cta-meta`, `.art-quote-attr`, `.michelin-fine` — every fine-print line
- `.sanctuary-secondary` paragraph (css:869) at opacity 0.85
- All `.testimonial-text` (uses ivory) — but author label is `--leaf-bright`, the *brighter* green

Sage on canopy is roughly a 6.5:1 contrast — passes AA but reads *grey-green*. Layer on `opacity: 0.7–0.85` (the .scroll-indicator, .sanctuary-secondary, .art-quote-attr) and you're down near 4.5:1 — barely passing on big sizes, failing on the small caps eyebrow at `0.6–0.7rem`. The smallest labels (`.hero-meta__lbl` at 0.6rem, `.scroll-indicator` at 0.58rem) are sage with a tracking that makes the strokes very thin.

**Why it matters.** This is meant to be a *cinematic immersive* dark site that earns its dark mode. Instead, the dark mode is masking that the secondary type is the same hue as the background — it never quite separates, especially in saturation-heavy regions. The grain overlay (css:191–201) at `opacity 0.035` is fine, but it's not helping legibility.

**Fix.**
- Stop using `opacity` on sage-colored text. If you want a dimmer step, change the color to a *neutral warm* like `rgba(247, 243, 235, 0.55)` (ivory at 55%) — same dimming, but the hue contrast is preserved.
- Reserve `--sage` for **non-text** decorative roles (hairlines, dividers, icon strokes) and let secondary text be ivory-dim. The brief lists `--bark` and `--ivory` as warm anchors — body should be warm, not green-grey.
- Specifically rescue: `.hero-meta__lbl`, `.scroll-indicator span`, `.geo-caption`, `.art-quote-attr` — these are the smallest, dimmest items.

---

### 5. MAJOR — `leaf-bright` cursor on greenery imagery is a contrast trap

**What.** `.cursor` (css:138–151) is `--leaf-bright (#8eae7d)` 10px dot with `mix-blend-mode: difference` and the trail is a 40px ring at `rgba(142, 174, 125, 0.55)`. Most hero / room / art / interstitial backgrounds are *foliage at 60–90% brightness*. Difference blend mode flips the green dot toward magenta over green imagery — which *works* visually, but the *trail ring* doesn't have difference blending; it's a translucent green ring sitting on green foliage. On the canopy-tinted dark sections the ring is invisible.

The builder already flagged this. Two things make it worse than they noted:
1. The trail ring is *the only feedback the user has* that the magnetic-btn / nav-dot is hover-active (the dot's blend mode hides its position behind images).
2. Body has `cursor: none` (css:69) — so if the leaf-cursor disappears against foliage, the user has *no* cursor at all.

**Why it matters.** This is the cinematic differentiator vs Boutique's ochre cursor — and on the property whose entire identity is *greenery*, the cursor color is the worst possible choice over imagery.

**Fix.** Three options, pick one:
- (a) Switch cursor to `--ivory` or `--ochre-warm` — preserves contrast against foliage. Lose the "leaf-green cursor" gimmick.
- (b) Keep leaf-bright but give the *trail ring* `mix-blend-mode: difference` too — currently only the inner dot has it (css:148).
- (c) Add a subtle dark stroke/ring around the cursor dot so it always has a silhouette against any background (`box-shadow: 0 0 0 1px rgba(15,28,18,0.9)`).
The brief differentiation argument ("distinct from Boutique's ochre") doesn't survive contact with the foliage imagery the brief itself prescribes.

---

### 6. MAJOR — Michelin section: the badge is small for the prestige claim

**What.** `.michelin-key` is set to `width: 86px; height: 86px;` (css:976–980). It sits centered between two 80px hairlines (css:973–974). The H2 below it (`.display-medium`) is *bigger* than the badge itself. Combined with a sweeping radial overlay at 70–95% canopy darkness (css:944–948), the actual Michelin Key image is the *smallest* element in the section.

The section eyebrow uses `--terracotta` (css:986) — the only place terracotta is allowed to peek through. Good thought. But the actual badge gets diminished by the H2.

**Why it matters.** This is the single most important prestige asset the property has. It is *also* the moment the brief says must "feel earned, not pasted-on" (BRIEF.md:148). The headline saying "The first Michelin Key in Mérida" is doing the talking; the badge is a footnote.

Note also: the badge is hot-linked from the live site (`treehouseboutiquehotel.com/wp-content/.../...webp`) — builder flagged this. If it 404s, the entire prestige section is a hole. This image **must** be downloaded into `treehouse/v1/img/` and referenced locally. Currently the same hot-link appears 3 times: hero badge (HTML:103), section badge (HTML:182), footer (HTML:781).

**Fix.**
- Bump `.michelin-key` to `width: 120–140px` and let the H2 sit *under* it as the supporting claim. Make the badge the literal first thing the eye lands on.
- Local-host the badge image. Today.
- Consider adding a subtle terracotta glow / drop-shadow ring (you have `filter: drop-shadow(0 4px 18px rgba(184, 90, 58, 0.35))` — that's fine but small; deepen and widen it).

---

### 7. MAJOR — `.display-huge` used twice; second use (Art section) is wrong size for context

**What.** `.display-huge` is applied to (a) the hero H1 (HTML:112) and (b) the Art Collab H2 `Treehouse × SoHo Galleries` (HTML:391). The Art H2 is *also* a longer string (~24 chars vs `Tree House`'s 9). At the same vw rate it'll spill across the column or wrap at desktop widths. The `.art-hero` is `max-width: 900px` (css:1327) — `Treehouse × SoHo Galleries` at 11vw on a 1440px screen is ~158px tall; the line will need to wrap.

There's also a hierarchy crime here: a *section H2* using the same type tier as the *page H1* flattens the document outline. The brief frames the Art collab as "centerpiece" (BRIEF.md:38) — yes, but "centerpiece of section 5" not "co-equal with the hotel's name".

**Why it matters.** Page-level H1 and section-level H2 should be visually distinguishable. They aren't here. And on mobile the long string will wrap to 2–3 lines at the same enormous size, which looks like a bug.

**Fix.** Move the Art title to `.display-large`. The visual *theatre* of the section (the deep-dark background, the dropcap manifesto, the marquee) is already doing the "this is a major moment" work — the title doesn't need to also be page-H1-sized.

---

### 8. MAJOR — Hero Michelin badge mobile fix lands ON TOP of hero-meta

**What.** Builder flagged this. Looking at css:2562–2598 (mobile Michelin), the rule is:
```
.hero-michelin { top: auto; bottom: 28vh; right: 50%; transform: translateX(50%); }
```
And `.hero-meta` is positioned at `bottom: 110px` from css:734. On a 600–700px-tall mobile hero (`min-height: 600px` at css:2577), `28vh` of a 600px hero is 168px from bottom — but `100vh = the full screen` so `28vh` is computed off the *viewport*, not the section. On a 700px-tall viewport that's 196px from bottom — and hero-meta sits at 110px from bottom. The badge **stacks on top of the meta strip** at most mobile heights.

At `max-width: 480px` (css:2594), bottom is pulled to `24vh` — same issue, slightly higher.

**Why it matters.** Both elements occupy the lower-center of the hero on mobile. They overlap. The Michelin badge is the prestige claim; it must not be illegible.

**Fix.** Either:
- Move the badge to the *top* on mobile (`top: 80px; bottom: auto;`) — it lived there at the 1100px breakpoint already.
- Or restructure: on mobile, fold the badge into the meta strip as a fourth item — "Michelin Key · 2025" — and remove the floating badge entirely.

---

### 9. MAJOR — Art H2 cross character `×` is in Cormorant italic green at 0.85em; reads as an arithmetic typo

**What.** `.art-cross` (css:1337–1344) is `font-family: Cormorant; font-style: italic; font-weight: 300; color: leaf-bright; font-size: 0.85em`. In context it's `Treehouse × SoHo Galleries`. The `×` is *smaller and italic and green* against the DM-Serif-Display ivory siblings.

**Why it matters.** A multiplication sign (or x-as-collab marker) in editorial design is usually treated as either matching weight or *slightly* heavier — same family, kerned. Making it Cormorant italic and 85% size makes it look like a hand-set italic "x" — but next to DM Serif Display the family change reads accidental rather than intentional. Set it in Inter, ironically, and you'd get the editorial collab-mark feel.

This is the *only* place in the design where you change family inside a single H2 across three glyphs. It draws the wrong kind of attention.

**Fix.** Either match the parent family (DM Serif Display, same color, 100% size) or commit to a strong contrast (Inter, 0.8em, ochre, slight letter-spacing). The current middle path is the worst option.

---

### 10. MAJOR — Sister-property echo is too literal; reads as Boutique reskin

**What.** Compare the type system:

| Token / pattern | Boutique V1 | Tree House V1 |
|---|---|---|
| `--ls-tight` | 0.2em | 0.18em |
| `--ls-mid` | 0.28em | 0.26em |
| `--ls-wide` | 0.34em | 0.34em |
| H1 clamp | 3.5–10vw–15rem | 3.5–11vw–13rem |
| H2-large clamp | 2.4–5.5vw–6rem | 2–6vw–6.5rem |
| H2-med clamp | 2–3.6vw–3.8rem | 1.75–4.4vw–4.2rem |
| H3-small clamp | 1.35–1.9vw–2rem | 1.4–2.5vw–2.4rem |
| Font stack | DM Serif Display + Cormorant + Inter | DM Serif Display + Cormorant + Inter |
| em treatment | Cormorant ochre italic | Cormorant ochre italic |
| body | Inter 300 | Inter 300/400 |
| nav-dot, progress bar, grain overlay | all present | all present, same selectors |

The brief says "related but distinct" (BRIEF.md:23). What's actually distinct?
- Background is canopy-green (vs Boutique's ink) ✓
- Cursor is leaf-bright (vs Boutique's ochre) ✓ (though see Finding #5)
- Tagline italic shifted to leaf-green ✓
- Has a Michelin section, Journal, +30% offer instead of +6n airport transfer ✓ (content, not design)

What is *not* distinct:
- Type scale (basically identical clamp values, slightly retuned)
- Eyebrow pattern, label color, nav structure
- Hairline/divider treatment
- Reveal animation classes
- Section structure (sanctuary→rooms→art→journal→voices→location→footer mirrors Boutique nearly 1:1)

**Why it matters.** A returning visitor should think "ah, the sister property." Right now they'd think "ah, the green skin of Boutique." The botanical identity is doing *all* the differentiation work via the green wash and the leaf SVG — which itself appears only in the logo and intro overlay (HTML:33, 76).

**Fix.** Where to push:
- Use the leaf SVG **as a systematic motif** — between sections (as a divider), as bullets/list markers (`location-row::before`?), at the start of pull quotes. Right now it's a logo glyph, nothing more.
- Vary the type pattern: e.g., Tree House could have a botanical *italic-Cormorant body voice* for one named section (e.g., journal entries) while Boutique stays ink-Inter. Give the typography itself a botanical flavor, not just the color.
- Letter-spacing tokens are 90% the same. Make Tree House's tokens slightly tighter and use Cormorant Italic for *running text in long-form sections* (journal/manifesto/sanctuary) — that's the "field-journal" botanical voice the V2 brief reaches for, but V1 could echo it lightly.

---

### 11. MAJOR — Italic Cormorant 300 used for body copy is *too* light against canopy

**What.** Cormorant at weight 300 is set for:
- `.michelin-deck` italic 300 (css:1000–1001) on dark
- `.michelin-cell__desc` body 300 on dark (css:1041) — Inter not Cormorant, fine
- `.art-manifesto` Cormorant 300 (css:1374)
- `.art-deck` Cormorant 300 italic (css:1352)
- `.art-rotation-deck` Cormorant 300 italic (css:1445)
- `.journal-intro`, `.curated-intro` Cormorant 300 italic (css:1594, 1701)
- `.testimonial-text` Cormorant 300 italic at 1.3–2.1rem (css:1907)
- `.offer-desc`, `.curated-desc`, `.footer-brand p` Cormorant 300 (css:2189, 1769, 2330)
- `.location-val` Cormorant 400 (css:2082) — better
- `.offers-direct` Cormorant italic (css:2280)
- `.footer-col ul a` Cormorant 400 (css:2381) — better

Cormorant 300 italic on a dark canopy at 0.95–1rem is *thin*. The hairlines disappear, the in-strokes drop below display threshold. This is roughly half the type on the page, by surface area.

**Why it matters.** The cinematic feel works *because* of contrast. Cormorant 300 italic ivory on canopy reads ghostly at small sizes — beautiful in a single pull quote (the breath section, the interstitial), exhausting across 4–5 sections of body text.

**Fix.** Promote body Cormorant from 300 → 400 (regular) everywhere it's used as paragraph body or long-form deck. Keep 300 italic for *display* pull-quotes only (`.breath-quote`, `.pull-quote`, `.art-quote-text`, one `.testimonial-text`). The font's already loaded — `Cormorant:wght@0,400` is in the stylesheet link at HTML:15. Use it.

---

### 12. MINOR — Eyebrow / label system has three slightly different sizes that don't index

**What.** Eyebrows / kickers / labels — there's no consistent scale:
- `.label`: 0.66rem (css:488) — main pattern
- `.hero-eyebrow`: 0.7rem with border-top/bottom (css:586, 593–595) — *only* place borders are used
- `.geo-caption`: 0.68rem (css:498)
- `.hero-michelin__sub`: 0.62rem (css:723)
- `.hero-meta__lbl`: 0.6rem (css:764)
- `.scroll-indicator span`: 0.58rem (css:792)
- `.sanctuary-caption`: 0.62rem (css:842)
- `.art-piece-num`: 0.6rem (css:1491)
- `.footer-col h4`: 0.64rem (css:2363)
- `.footer-bottom p`: 0.7rem (css:2413)
- `.curated-tag`, `.offer-tag`: 0.62rem (css:1751, 2170)

That's 7 distinct values between 0.58 and 0.7rem. Most are sage or leaf-bright. They blur together as one tier with no rhythm.

**Why it matters.** A label system should pick 2–3 tiers (e.g., "principal eyebrow 0.72rem / section label 0.66rem / fine print 0.6rem") and stick to it. Right now every selector picked its own pixel value, which means there's no actual scale — just twelve "smallish things".

**Fix.** Define:
```css
--label-lg: 0.72rem;  /* hero eyebrow, principal */
--label-md: 0.66rem;  /* section labels */
--label-sm: 0.6rem;   /* meta, fine print */
```
Apply through the page. Same for letter-spacing — `--ls-tight/mid/wide` is defined but `--ls-mid` is used for both "section labels" and "section captions" and "input labels" — no semantic differentiation.

---

### 13. MINOR — Section padding rhythm is inconsistent

**What.** Vertical padding across sections:
- `.section-michelin`: `14vh 5vw` (css:925)
- `.art-hero`: `14vh 5vw` (css:1302)
- `.art-rotation`: `12vh 6vw` (css:1424)
- `.art-quote`: `9vh 6vw` (css:1545)
- `.section-journal`: `14vh 6vw` (css:1573)
- `.section-curated`: `14vh 6vw` (css:1680)
- `.rooms-header`: `14vh 5vw 5vh` (css:1123)
- `.offers-section`: `14vh 6vw` (css:2112)
- `.footer`: `6vh 6vw 4vh` (css:2293)
- `.section-voices`: `14vh 5vw` (css:1835)

Horizontal padding flips between `5vw` and `6vw` with no apparent logic. Vertical mostly stays at `14vh` (good!), then drops to `12vh` and `9vh` for the art subsections — but `art-quote` at 9vh is *less* breathing room than `journal` at 14vh, despite the quote being the more contemplative moment.

**Why it matters.** Cinematic = rhythm. The site has the bones of a rhythm (mostly 14vh) but breaks it for no clear reason at three points.

**Fix.** Pick `5vw` for full-bleed-with-content sections and `6vw` for content-bounded sections; commit. Set `.art-quote` to `12vh 6vw` minimum — a pull quote needs *more* breathing room than a card grid, not less.

---

### 14. MINOR — `.offer-fine strong` uses `font-weight: 600` on ochre — out of system

**What.** css:2204–2207 sets `.offer-fine strong` (the `CANOPY30` code) to ochre at weight 600 with letter-spacing 0.15em. Inter 600 is used *once* for `.reserve-submit` (css:2267). Everywhere else, max weight is 500. The promo code styling looks like a different design system briefly intruded.

**Why it matters.** Tree House's UI tier is Inter 300/400/500. Introducing 600 for one badge-y string breaks the discipline — and the code is short enough (`CANOPY30`) that 500 caps + tracking would carry it.

**Fix.** Change to `font-weight: 500`, keep tracking. Or even better: wrap it in a small chip-style box (ochre 1px border, 2px 8px padding) — that's a visual treatment, not a weight hack.

---

### 15. NIT — Spanish phrases are charming but inconsistently glossed

**What.** Spanish labels in use:
- `El Refugio Botánico` (sanctuary eyebrow) — not glossed
- `La Llave Michelin` — not glossed
- `Las Habitaciones` (rooms eyebrow) — not glossed
- `La Rotación Actual` — not glossed
- `Bajo el Dosel` — glossed in-line as "Under the Canopy"
- `El Diario` — not glossed (but "The Journal" headline below makes it obvious)
- `La Mérida Curada` — not glossed
- `Las Voces — Cartas dejadas al irse` — not glossed (literally "letters left on departure")
- `El Sitio` — not glossed
- `Las Ofertas` — not glossed
- `Una casa bajo el dosel. Quince llaves. Sólo adultos.` — not glossed (footer)
- `Una casa que respira hojas.` / "— A house that breathes leaves." — *glossed* (interstitial)

This is fine — leaning into Spanish is brief-aligned ("Bilingual: lean *more* into Spanish than Boutique" BRIEF.md:137). But two phrases earn an English gloss (interstitial, art-rotation) while the others don't — and `Las Voces — Cartas dejadas al irse` is the *most* poetic Spanish on the page, ungglossed, while the simpler ones get translated.

Also: idiom check — builder flagged this. `Cartas dejadas al irse` is grammatical but mildly stilted; native speakers might say `Cartas que dejan al partir` or `Notas dejadas al irse`. `La Mérida Curada` is fine but reads as a coinage. None of this is wrong, just worth a native-speaker pass.

**Why it matters.** Minor — the eyebrows act as decorative all-caps so most readers won't be lost. But the inconsistency in glossing is the kind of thing a copy editor notices.

**Fix.** Decide a rule: either *all* Spanish phrases get an English gloss (in the section's body copy or as a subtitle), or *none* do (and trust the reader). Currently it's split arbitrarily. Recommendation: gloss the *body-tier* phrases (`Una casa…`, `Cartas dejadas…`) and leave the *label-tier* phrases (`Las Habitaciones`, `El Sitio`) unglossed — they're effectively chapter markers.

---

## What's working (coda)

To be clear — there's a lot to like here:
- **Color system is well-thought**: canopy / ivory / leaf-bright / ochre / terracotta is a cohesive palette and the use of terracotta as a *reserved* Michelin-only accent (only at `.michelin-eyebrow` and the badge filter) is exactly right.
- **Hairline-warm vs hairline split** (sage-derived for sections, ochre-derived for Michelin) is subtle and correct.
- **`canopyBreath` animation** on the tint overlay (css:216) is the kind of detail this category wins on.
- **Hero meta strip** (15 / 18+ / 21°N) is a strong, restrained editorial flourish — the kind of thing the Largo anchor does well.
- **Sanctuary pillar trio with Roman numerals** (HTML:154–168) is a sharper editorial gesture than the simple "three feature cards" most boutique sites use.
- **No-front-desk copy** ("There is a person who already knows your flight…", HTML:150) is the strongest single line on the page. Worth surfacing more.
- **Art rotation has a `figcaption` with proper `<figure>` semantics** (HTML:422–454) — accessible and editorially correct.
- **Reduced-motion media query** is present and thorough (css:2485–2499).

The bones are right. The work in R2 is mostly *editing* — pull back italic, fix the H1/H2 step, give the Michelin badge its size, and decide what makes this *not* just Boutique-in-green.
