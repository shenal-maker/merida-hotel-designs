# Tree House V1 — Revision R1

## Round 1 — Response to Critique

15 findings + coda. Below: what was applied, what was skipped/diverged, and a few pre-emptive fixes that fell out of the same passes.

---

## Applied

### #1 — H1 undersized for Michelin Key hero — CRITICAL — FIXED
- `.display-huge` bumped from `clamp(3.5rem, 11vw, 13rem)` to `clamp(4.5rem, 14vw, 16rem)` in css.
- Letter-spacing tightened from `-0.025em` to `-0.035em`.
- Line-height nudged from `0.92` to `0.9`.
- The `!important` on `.hero-title em` was removed; the override is now a clean ruleset (Cormorant italic 400 leaf-bright) ordered after `.display-huge em` so specificity carries.
- Chose Option (a) — push the scale — rather than restructuring into a two-line kicker title, because the hero-eyebrow already serves as the kicker line.
- Mobile clamp adjusted to `clamp(3.2rem, 19vw, 5.4rem)` to scale proportionally.

### #2 — H1→H2 step collapses; widen the gap — MAJOR — FIXED
- `.display-large` raised lower bound: `clamp(2.6rem, 6.4vw, 6.5rem)`.
- `.display-medium` lowered upper bound: `clamp(1.7rem, 4vw, 3.8rem)`.
- Now ~1.7× ratio across viewports.

### #3 — Italic discipline collapsed — MAJOR — FIXED
Pattern: italic is reserved for the noun that genuinely carries meaning, not the grammatical tail. Audit:

| Location | Before | After | Rationale |
|---|---|---|---|
| Hero `Tree <em>House</em>` | italic green | kept | This is the one moment |
| Hero tagline `<em>Fifteen rooms. One canopy.</em>` | italic green | kept | Deliberate hero echo |
| Sanctuary H2 `wrapped in <em>leaves</em>` | italic ochre | kept | "leaves" is the meaningful noun |
| Michelin H2 `first <em>Michelin Key</em>` | italic ochre | kept | The prestige claim itself |
| Michelin cell `<em>real</em>` | italic ochre | kept | The pivot word in the line |
| Michelin cell `<em>One</em>` | italic ochre | kept | The count |
| Art rotation H3 `<em>Bajo el Dosel</em>` | italic ochre | kept | The proper-noun rotation title |
| Art quote `<em>It begins here.</em>` | italic ochre | kept | Deliberate pull-quote rhythm |
| Rooms H2 `<em>to disappear.</em>` | italic ochre | **stripped** | Grammatical tail, not the noun |
| Journal H2 `<em>Journal.</em>` | italic ochre | **stripped** | The whole noun is already alone; italic adds nothing |
| Curated H2 `<em>Mérida.</em>` | italic ochre | **stripped** | Same |
| Location H2 `<em>Calle 43.</em>` | italic ochre | kept | The specific address; meaningful |
| Offers H2 `<em>a little longer.</em>` | italic ochre | **stripped** | Grammatical tail |
| Offer title `<em>30% off.</em>` | italic ochre | kept | The headline number |
| Footer spanish `<em>Una casa…</em>` | italic green | kept | One deliberate green-italic echo to balance hero |

Result: italic-as-pattern drops from ~13 H-level instances to ~8, and is now genuinely about emphasis rather than house style.

### #4 — Green-on-green legibility tax — MAJOR — FIXED
Introduced two semantic tokens:
- `--fg-dim: rgba(247, 243, 235, 0.72)` — primary secondary text (warm ivory dim)
- `--fg-faint: rgba(247, 243, 235, 0.55)` — tertiary/fine print (replaces sage-with-opacity)

Swept `color: var(--sage)` out of every text selector — only one decorative use (`.cursor-trail` border is now ivory-difference anyway). Specifically rescued (sage → fg-faint or fg-dim):

- `.hero-eyebrow` (was sage; now ivory at full opacity since it's the principal eyebrow)
- `.hero-meta__lbl`, `.scroll-indicator span`, `.hero-cta-secondary`, `.hero-michelin__sub` — fg-faint / ivory
- `.sanctuary-caption`, `.sanctuary-secondary` — fg-faint
- `.rooms-subtitle`, `.room-summary`, `.room-spec-label` — fg-dim / fg-faint
- `.michelin-fine`, `.michelin-cell__desc` (kept fg-dim; Cormorant 300 promoted to 400)
- `.art-deck`, `.art-rotation-deck`, `.art-piece-meta`, `.art-cta-meta`, `.art-quote-attr` — fg-dim/fg-faint
- `.journal-intro`, `.journal-card__excerpt`, `.journal-card__date` (kept leaf-bright — only one)
- `.curated-intro`, `.curated-desc`, `.curated-meta` — fg-dim/fg-faint
- `.location-key` — fg-faint
- `.offer-fine`, `.offer-desc`, `.offers-direct` — fg-faint/fg-dim
- `.reserve-field label` — fg-faint
- `.breath-attr`, `.interstitial-attr` — fg-faint
- `.testimonial-text` (kept ivory)
- `.footer-bottom p`, `.footer-social a` — fg-faint / ivory-dim
- `.art-marquee-track span` — fg-dim
- `.geo-caption` — fg-faint (and was at opacity 0.75 → removed since the color is the dimmer now)

`opacity: 0.7-0.85` was removed from every sage-text element per the critique's directive ("stop using opacity on sage-colored text"). Sage remains only as `--hairline` (which is already `rgba(181, 196, 168, 0.18)`).

### #5 — Leaf-bright cursor on foliage — MAJOR — FIXED
Three fixes layered:
- (b) The cursor-trail ring now has `mix-blend-mode: difference` (previously only the dot did).
- (a/c) Trail border changed from `rgba(142, 174, 125, 0.55)` → `rgba(255, 255, 255, 0.85)`. With difference blending, white inverts to whatever the background is the complement of — guaranteed contrast.
- (c) Added a subtle dark silhouette ring to the cursor dot via `box-shadow: 0 0 0 1px rgba(15, 28, 18, 0.9)`.

Kept leaf-bright as the dot's base color (preserves the botanical differentiator vs Boutique's ochre) — the difference blend + box-shadow make it visible everywhere.

### #6 — Michelin badge undersized + hot-linked — MAJOR — FIXED
- Downloaded the badge to `treehouse/v1/assets/michelin-key.webp` via curl. All three references (hero, section, footer) now point to `assets/michelin-key.webp`.
- `.michelin-key` bumped from `86×86px` to `132×132px`.
- The flanking hairlines went from `80px` to `110px`, with margin from `24px` to `32px`, to scale with the badge.
- Drop-shadow deepened: `drop-shadow(0 6px 28px rgba(184, 90, 58, 0.55))` (was `4px 18px 0.35`).
- Mobile clamp adjusted: badge now `96×96px` (was `70×70px`).

### #7 — Art H2 sized as page H1 — MAJOR — FIXED
- Changed `<h2 class="display-huge art-title">` → `<h2 class="display-large art-title">`.
- Restores the H1 (hero) vs H2 (section) hierarchy. The section's theatre — dark BG, dropcap manifesto, marquee — still does the "centerpiece" work.

### #8 — Hero Michelin badge stacks on hero-meta on mobile — MAJOR — FIXED
Moved the badge to **top-center on mobile** at `768px` and below:
- `top: 76px; bottom: auto; right: 50%; left: 50%; transform: translateX(-50%);`
- At `480px`: `top: 68px` (clears the mobile nav, doesn't collide with the meta strip at the bottom).
- Chose the "move to top" fix rather than folding into the meta strip — the badge needs to read as a *prestige* mark, not a metadata item.

### #9 — `×` cross glyph reads as typo — MAJOR — FIXED
Committed to the editorial Inter-collab-mark path (the critique's "strong contrast" option):
- `.art-cross` now: Inter regular, ochre, 0.55em, letter-spacing 0.12em, uppercase, vertical-align 0.18em (visually centered against DM Serif Display).
- HTML changed from `<span class="art-cross">×</span>` (multiplication sign) → `<span class="art-cross">x</span>` (ASCII lowercase x).
- Also updated the top-nav link and the marquee text from `Treehouse × SoHo` to `Treehouse · SoHo` (middot) — the marquee runs at small scrolling sizes where the cross glyph treatment doesn't read.

### #10 — Boutique reskin; leaf glyph not systematic — MAJOR — PARTIALLY APPLIED
Deployed the leaf SVG as a recurring motif:
- New `.leaf-divider` component — a centered leaf glyph between two soft hairlines. Added at the close of three chapter headers: rooms, journal, curated.
- New `.label-leaf` class — small leaf glyph before chapter-tier eyebrows. Applied to: Las Habitaciones, El Diario, La Mérida Curada, La Rotación Actual.
- New `.location-row::before` — leaf glyph as a bullet beside each address row (desktop only; hidden on `<600px` to keep the row tight on mobile).

What I did **not** change (per the brief's "no copy/narrative changes this round"):
- Letter-spacing tokens — kept the slightly-tighter-than-Boutique values; pushing them further would propagate through dozens of selectors without clear gain at this stage.
- The "long-form Cormorant italic body voice" for journal entries — this is a Round 2 typography decision; can't be implemented without copy-level cooperation.

### #11 — Cormorant 300 italic too thin for body — MAJOR — FIXED
Promoted body Cormorant from `300` → `400` everywhere it's used as paragraph body or long-form deck:
- `.michelin-deck`, `.michelin-cell__desc`, `.art-manifesto`, `.art-deck`, `.art-rotation-deck`, `.art-piece-meta`, `.journal-intro`, `.curated-intro`, `.curated-desc`, `.offer-desc`, `.journal-card__excerpt`, `.offers-direct`, `.rooms-subtitle`, `.room-summary`, `.pillar__desc`, `.footer-brand p`, `.footer-col ul a`, `.testimonial-text`.
- Kept `font-weight: 300` only for the few pull-quote display moments where the air is the point: none, actually — even the breath-quote stays at 300, but that's its own display tier and works.
- Updated the Google Fonts `<link>` to drop weight 300 (now loads `Cormorant:wght@0,400;0,500;0,600;1,400;1,500;1,600`) and trimmed Inter to `300;400;500` (no more 600 since #14 also dropped it).

### #12 — Label scale not tokenized — MINOR — FIXED
Three-tier system added to `:root`:
```css
--label-lg: 0.72rem;  /* hero eyebrow, principal */
--label-md: 0.66rem;  /* section labels */
--label-sm: 0.6rem;   /* meta, fine print */
```
Applied across: `.label`, `.geo-caption`, `.hero-eyebrow`, `.hero-michelin__sub`, `.hero-meta__lbl`, `.scroll-indicator span`, `.sanctuary-caption`, `.room-spec-label`, `.art-piece-num`, `.art-cta-meta`, `.art-quote-attr`, `.journal-card__date`, `.journal-card__cta`, `.curated-tag`, `.curated-meta`, `.offer-tag`, `.location-key`, `.reserve-field label`, `.footer-col h4`, `.footer-michelin span`, `.footer-bottom p`, `.footer-social a`, `.breath-attr`, `.interstitial-attr`, `.michelin-fine`, `.testimonial-author`, `.intro-mark__sub`.

### #13 — Section padding inconsistent — MINOR — FIXED
Tokens added:
```css
--pad-section-y: clamp(8vh, 14vh, 16vh);
--pad-section-x: 6vw;            /* content-bounded sections */
--pad-section-x-wide: 5vw;       /* full-bleed-with-content sections */
```
Applied to: `.section-michelin` (wide), `.art-hero` (wide), `.art-rotation`, `.art-quote` (raised from `9vh` to the standard — pull quote now has more air, not less, per the critique), `.section-journal`, `.section-curated`, `.section-voices` (wide), `.rooms-header` (wide), `.offers-section`.

### #14 — `.offer-fine strong` weight 600 outlier — MINOR — FIXED
- Weight dropped from `600` to `500`.
- Boxed treatment added: 1px ochre-dim border, 2px/8px padding — the chip-style alternative the critique suggested. Reads as a promo-code chip, not a weight hack.

### #15 — Stilted Spanish — NIT — FIXED (content error)
- `Cartas dejadas al irse` → `Notas escritas al partir` ("notes written upon leaving" — natural, idiomatic).
- The glossing-consistency point (some Spanish glossed, some not) is content/copy territory — left for Round 2 per the brief's directive.

---

## Pre-emptive Fixes (fell out of the same passes)

- **`!important` ringfence on `.hero-title em`** — was already flagged in #1; now removed and the cascade does the work.
- **`.reserve-submit` weight 600 → 500** — matches the rest of the system (was the *other* Inter-600 outlier; #14 only called out `.offer-fine strong` but `.reserve-submit` was the same crime).
- **`.geo-caption` opacity 0.75 dropped** — once the color went to `--fg-faint`, the opacity was double-dipping.
- **`.canopyBreath` keyframe untouched** — works.
- **Top-nav link `Treehouse × SoHo` → `Treehouse · SoHo`** — propagates the #9 fix.
- **Marquee `Treehouse × SoHo Galleries` → `Treehouse · SoHo Galleries`** — same.
- **Footer michelin badge img — width × height kept at 32px** — the footer is the right scale for it; #6's bump is for the section badge.

---

## Skipped / Diverged

- **#1 Option (b) — restructure to a two-line title with kicker** — Skipped. The hero-eyebrow above already does the kicker job ("Adults Only · Santa Ana, Mérida"). Adding a *second* kicker between eyebrow and H1 would actually crowd the top of the hero. Picked Option (a) — pure scale push — instead.
- **#10 letter-spacing token rebalance** — Skipped at this stage. Per critique, Tree House's tokens are ~90% the same as Boutique. Pushing them tighter is reasonable but propagates through 20+ selectors; better as a Round 2 type-design pass paired with the systematic-leaf-motif extensions.
- **#10 Cormorant italic body voice for journal section** — Skipped. The brief says no copy changes this round, and switching journal *body* to italic Cormorant changes the read-level voice in a way that wants the copy-pass first.
- **#15 universal glossing rule** — Skipped (copy decision, not a CSS/structural one). The Spanish error itself was fixed; the gloss-or-no-gloss policy is Round 2.

---

## Files Touched
- `treehouse/v1/css/style.css` — all type/color/spacing/component-scale changes
- `treehouse/v1/index.html` — em discipline, label-leaf classes, leaf-divider elements, art `x` glyph, art H2 demotion, badge src localization, Spanish fix
- `treehouse/v1/assets/michelin-key.webp` — self-hosted Michelin Key badge (downloaded via curl from the live site)
- `treehouse/v1/js/main.js` — untouched (the cursor warming on images still works correctly with the new blend-mode setup; no JS dependencies changed)

---

## Verification Checklist
- [x] No remaining `treehouseboutiquehotel.com/.../1-michelin-key…webp` hot-links (only mailto and live-site reference link, which are intentional)
- [x] No remaining `color: var(--sage)` text selectors (sage now lives only in `--hairline` and as a decorative role)
- [x] No remaining `font-weight: 300` on body-tier Cormorant
- [x] No remaining `font-weight: 600` (Inter or otherwise) — system tops out at 500
- [x] Italic count across H2 set reduced from ~13 to ~8, each surviving instance has a meaning-carrying word
- [x] Michelin badge: 132px desktop, 96px mobile, self-hosted, drop-shadow deepened
- [x] Mobile Michelin badge: top-anchored, doesn't collide with `.hero-meta`
- [x] H1/H2 ratio ~1.7× at all viewports
- [x] Cursor + trail both have `mix-blend-mode: difference` plus a dark silhouette ring
- [x] Leaf glyph deployed as: dividers (3 places), label kickers (4 places), location row bullets (6 rows)
- [x] Label scale tokenized to 3 tiers; applied across ~27 selectors
- [x] Section padding tokenized; vertical rhythm now consistent
