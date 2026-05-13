# V1 — Cinematic Immersive · Round 1 Critique
**Focus: Visual Hierarchy & Typography only**

---

### 1. Hero title's italic "by" is *too small and too low*, sabotaging the centerpiece word — **MAJOR**
- **What:** `.hero-title em { font-size: 0.7em; vertical-align: 0.06em; }` (style.css:462–464). "Boutique *by* The Museo" — the italic "by" is shrunk to 70% and pushed off the optical baseline. At the upper clamp (`13rem`), the eye reads "Boutique ___ The Museo" with a faint smudge between them. The italic is supposed to be the gesture; instead it looks like a runt subscript.
- **Why it matters:** A luxury hotel hero title is the single most expensive piece of typography on the page. The italic conjunction should *carry* the brand voice, not apologize for existing. Pan & Koffee-style "by" treatments work when the italic is roughly the same cap-height as the romans — not 70%.
- **Fix:** Raise `font-size` to `0.82em–0.88em`, drop the `vertical-align` shim entirely (let it sit on the baseline), and add `letter-spacing: 0` on the em. Consider tightening `margin: 0 0.05em` so it kerns into the neighbors instead of floating.

---

### 2. Two display serifs (DM Serif Display + Cormorant italic) are doing almost the same job — pairing is muddy — **MAJOR**
- **What:** Both faces are used as display. DM Serif Display for the romans, Cormorant italic for the italics, *and* Cormorant non-italic for body emphasis (e.g. `.location-val`, `.footer-col ul a`, `.offers-direct`, `.room-summary`, `.curated-intro`, `.rooms-subtitle`, `.art-deck`, `.art-manifesto`, `.art-rotation-deck`). Cormorant is therefore appearing in: display italics, body italics, body roman, footer link list, location values, reservation form inputs. That's six different jobs.
- **Why it matters:** A reader can't tell whether Cormorant is "the italic accent" or "the body serif" or "the second display face." The pairing loses semantic crispness — every italic stops feeling special. DM Serif Display has a distinctive high-contrast Didone flavor; Cormorant is a quieter old-style. Side-by-side at display size they don't *contrast*, they *clash gently* (different x-heights, different stress angles).
- **Fix:** Pick one role for Cormorant. Recommend: Cormorant Italic for display-italic accents ONLY (the "by", the "em" in headlines, the pull-quotes), and use Inter for all body roles currently set in Cormorant (location-val, footer links, room-summary, etc.). If you want a body serif, swap to EB Garamond which is in the brief's allowed list and pairs harder with DM Serif Display.

---

### 3. `display-medium` is doing too much work across too many contexts — hierarchy collapses — **MAJOR**
- **What:** `.display-medium` clamps `1.7rem – 4rem` (style.css:365) and is reused for: H2 Sanctuary headline, H3 room card titles (4 of them), H3 art-rotation title, H2 location headline, H2 offers headline, and the interstitial pull-quote (a `<p>`). Six different hierarchical levels share one class.
- **Why it matters:** When the same size/weight runs across H2s, H3s, *and* a pull quote, the reader loses the sense of "what's a section heading vs. what's a room-card title vs. what's a quote." The site's vertical rhythm flattens — every "big serif" feels equivalently weighted. A luxury hotel needs three distinct serif tiers, not one elastic one.
- **Fix:** Split into `.display-medium` (H2 — keep `2.4rem–4rem`), `.display-small` (H3 / room titles — `1.4rem–2rem`, already overridden at style.css:843–847 but inconsistently), and a dedicated `.pull-quote` class for the interstitial that uses italic Cormorant and pushes to `2.4rem–3.2rem` so it actually feels like a quote, not a heading.

---

### 4. Hero `.display-huge` clamp peaks at 13rem and creates a runaway oversize at >1400px — **MAJOR**
- **What:** `.display-huge { font-size: clamp(3.5rem, 11vw, 13rem); }` (style.css:339). At 1920px viewport, `11vw = 211px ≈ 13.2rem` — pegged to the cap. At 2560px ultrawide it's still capped at 13rem (208px) but the *line-height: 0.92* + descenders push the title into the `.hero-eyebrow` above it and crowds the meta strip below (bottom: 110px). On a 1280px laptop, `11vw = 140px ≈ 8.75rem`, which is the sweet spot — but the clamp ceiling means anything wider than ~1900px stops scaling, breaking proportionality.
- **Why it matters:** Cinematic hotel heroes live or die at the 1920–2560px range (the actual viewport of the buyer's MacBook). At those sizes, the title visually crowds the surrounding micro-typography because the SCALE between H1 and eyebrow gets larger, not the typographic SYSTEM scaling together.
- **Fix:** Either raise the ceiling to `16rem` (~256px) and re-balance the eyebrow + meta proportionally with their own clamps, OR lower the floor `vw` to `9.5vw` and raise the ceiling so the scaling curve is more linear. Also verify the title actually clears `.hero-meta` at `bottom: 110px` — at 13rem with two lines wrapping on a narrow desktop, they collide.

---

### 5. The `--ochre` accent (#c69960) has borderline contrast on `--ink-deep` for small-tier UI text — **MAJOR (accessibility/legibility)**
- **What:** `--ochre: #c69960` on `--ink: #1a1410` measures roughly 5.4:1 — fine for body. But the *same* ochre is used at 0.62rem for `.label` (style.css:381–388), at 0.55rem for `.hero-meta__lbl` (style.css:568) — wait, that one uses `--fg-faint` (rgba 250,246,238,0.35) which is ~3.0:1, FAILING AA for small text. Same for `.room-spec-label` at 0.55rem in `--ochre-dim` (rgba 198,153,96,0.5) → ~2.1:1 against `--ink`, well under AA. `.testimonial-author` is fine. `.art-cta-meta` uses `--fg-faint` at 0.7rem letter-spaced 0.2em — borderline.
- **Why it matters:** These tiny labels are everywhere — they're the connective tissue of the luxury voice ("N° 01 · Habitación", "Sleeps · Two"). If they're hard to read, the whole atmospheric layer goes mushy. And `--ochre-dim` at 50% opacity on dark backgrounds is the classic "we made it look pretty in design but it's unreadable on a real screen" failure.
- **Fix:** Audit every use of `--fg-faint` and `--ochre-dim` for text under 0.85rem. Either raise opacity to 0.65+ (gets `--fg-faint` to ~4.5:1) or lift the base color. Specifically: `.hero-meta__lbl`, `.room-spec-label`, `.art-cta-meta`, `.footer-bottom p`, `.footer-brand p` all need a pass.

---

### 6. Letter-spacing values are inconsistent across the "label/eyebrow" family — same role, five different settings — **MINOR**
- **What:** Eyebrows / labels / micro-uppercase appear with these letter-spacings:
  - `.label` → 0.34em (style.css:384)
  - `.hero-eyebrow` → 0.45em (style.css:448)
  - `.top-nav .nav-links a` → 0.22em
  - `.hero-cta a` → 0.28em
  - `.location-cta a` → 0.26em
  - `.reserve-submit` → 0.26em
  - `.curated-tag` → 0.28em
  - `.offer-tag` → 0.3em
  - `.voices-label` → 0.32em
  - `.testimonial-author` → 0.32em
  - `.footer-col h4` → 0.3em
  - `.hero-meta__lbl` → 0.32em
  - `.room-spec-label` → 0.24em
  - `.art-cta-meta` → 0.2em
  - `.art-quote-attr` → 0.32em
  - `.offer-fine` → 0.18em
  - `.scroll-indicator span` → 0.34em
- **Why it matters:** The eye reads consistent tracking as "this is a system." Sixteen settings between 0.18em and 0.45em reads as "the designer was eyeballing it." Luxury sites get this from a 3-tier scale (e.g. 0.2em / 0.28em / 0.34em) tied to font-size.
- **Fix:** Define three letter-spacing tokens (`--ls-tight: 0.2em` for buttons, `--ls-mid: 0.28em` for tags, `--ls-wide: 0.34em` for the rarefied eyebrows) and replace the one-off values. The hero-eyebrow at 0.45em is the most egregious — it's wider than anything else and just looks airy-by-mistake.

---

### 7. Body copy line-height of 1.8 is too loose at the small clamp end — **MINOR**
- **What:** `.body-large { line-height: 1.8; font-size: clamp(0.98rem, 1.05vw, 1.18rem); }` (style.css:373–379). At the floor (0.98rem ≈ 15.7px), 1.8 line-height = 28.2px between baselines. For a sans-serif body that's a fairly loose magazine setting. Combined with `font-weight: 300` (which Inter renders as borderline thin on dark backgrounds) the body looks airy/floaty rather than confident.
- **Why it matters:** Luxury copy needs gravitas. Too-light + too-loose reads as "wellness PDF," not "fifteen-room hacienda." The hush is supposed to be quiet, not whispering.
- **Fix:** Drop to `line-height: 1.65–1.7` and lift `font-weight: 400`. Inter 300 on dark backgrounds also subpixel-renders thinner than the designer probably saw in dev; 400 with `-webkit-font-smoothing: antialiased` (already on) is the safer call.

---

### 8. The `--ochre` italic-em rule is applied globally — even where it doesn't belong — **MINOR**
- **What:** `em { font-family: 'Cormorant'; font-style: italic; color: var(--ochre); }` is global (style.css:82–87). That means every `<em>` anywhere on the page renders gold. Most uses are intentional (`<em>by</em>`, `<em>kept small</em>`), but it also catches `<em>Calor Lento</em>` (rotation title), `<em>a little longer.</em>` (offer headline), `<em>SoHo Galleries</em>` (art manifesto), `<em>This one is the second kind.</em>` (breath quote — which then gets `display: block; margin-top: 0.5rem` from `.breath-quote em` which is a different override), and `<em>Un refugio. Una casa. Quince llaves.</em>` (footer-spanish, which is already styled italic + ochre, so the em adds nothing).
- **Why it matters:** When ochre italic is the *only* highlight gesture, it loses weight by overuse. The breath quote has its second sentence promoted to a hard line break — that's a structural decision smuggled into a typographic rule. Things that should be a subtle inflection (the artist name "SoHo Galleries" in running prose) get the same visual weight as the hero CTA.
- **Fix:** Make the global `em` rule restrained — italic + a *slight* color shift (e.g. `--ivory` with `font-style: italic`) for inline body emphasis. Reserve the gold ochre treatment for display tier only via `.display-huge em, .display-large em, .display-medium em` (which is already defined). Remove `display: block` from `.breath-quote em` — that's structural, not typographic; if the second sentence wants its own line, mark it up with a separate element.

---

### 9. Art collab section's `.art-title` is loud, but the typographic *system* of the section doesn't feel distinct from elsewhere — **MAJOR**
- **What:** The brief says the art collab "must feel substantive, not bolted on — it is the differentiator." Yet typographically the section reuses: `.label` (same as everywhere), `.display-huge` (same as hero), `.art-deck` (Cormorant italic — same family as `.rooms-subtitle`, `.curated-intro`, `.art-rotation-deck`), and `.art-manifesto` (Cormorant 400 — same family as `.location-val`, `.footer links`, `.room-summary`). The only typographic thing that's "art-section-specific" is `.dropcap` and `.art-marquee-track`. The marquee is genuinely distinctive; the dropcap is fine. Everything else is the house style.
- **Why it matters:** A "gallery's own site" feel comes from typographic *register shift* — different baseline grid, different leading, sometimes a different secondary face. Right now the art section is just "the same section, but with a marquee."
- **Fix:** Either (a) introduce a left-aligned, looser-leading manifesto block with a wider measure and a true small-caps lockup for the artist credits, or (b) swap `.art-piece-title` from DM Serif Display (already used heavily) to a small-caps Inter treatment so the credit feels like a gallery wall label rather than another mini-headline. Also: the artist meta uses Cormorant italic (`.art-piece-meta`, style.css:1197–1203) — galleries set this in roman with em-dash + year, not italic. Reset to Inter 400, slightly tracked.

---

### 10. Three monospace fonts referenced but no `<link>` to load them — silent fallback to Courier — **MINOR**
- **What:** `font-family: 'JetBrains Mono', 'Courier New', monospace;` appears in `.geo-caption` (style.css:675), `.art-piece-num` (1185), `.offer-fine strong` (1652). The Google Fonts `<link>` in `index.html:15` loads DM Serif Display, Cormorant, Inter — NOT JetBrains Mono. The result: these elements render in Courier New, which is the un-luxurious fallback ("default 1995 monospace").
- **Why it matters:** The geo-coordinates ("20°58'N · 89°37'W") and the rotation numbering are exactly the kind of "instrument panel" detail luxury sites use to feel knowing. Courier kills the effect — the spacing, the slab serifs, the weight all clash with the warm serif system.
- **Fix:** Add `JetBrains+Mono:wght@400;500` to the font link, OR remove monospace from these elements and set them in Inter with `font-variant-numeric: tabular-nums; letter-spacing: 0.08em` — that delivers the "data-tag" register without the third typeface.

---

### 11. `.intro-mark` uses `letter-spacing: 0.4em` on a DM Serif Display set — display-serif letterspacing at that level kerns ugly — **MINOR**
- **What:** `.intro-mark { font-family: 'DM Serif Display'; font-size: clamp(1rem, 1.8vw, 1.4rem); letter-spacing: 0.4em; text-transform: uppercase; }` (style.css:230–235). DM Serif Display has heavy contrast strokes and tight default kerning designed for display sizes. Forcing it to ALL CAPS at 1–1.4rem with 0.4em tracking detaches every letter — at this size you see individual high-contrast forms drift apart. Looks like a small-caps render of a display face that wasn't built for it.
- **Why it matters:** The intro overlay is the first thing the viewer sees. If "BOUTIQUE · MUSEO" reads as wobbly spaced caps rather than a confident wordmark, the rest of the brand starts under-trust.
- **Fix:** Either swap the intro mark to Inter 500 (a sans built for caps tracking) at the same size + spacing, or keep DM Serif Display but drop letter-spacing to 0.16em–0.22em and raise size to ~1.6rem. The animation already pulls from 0.6em to 0.4em — which means the resting state is its tightest, which is still too loose.

---

### 12. The `--terracotta` color appears in the progress-bar gradient and the cursor — but nowhere typographically — palette discipline drift — **NIT**
- **What:** Brief palette includes terracotta as "use sparingly as accent." V1 introduces it only in: `.progress-bar` gradient (style.css:150), and dynamically swapped to the cursor on image hover (main.js:74). It never lands in typography or any static element a user can really see (the progress bar is 2px tall). So we have ochre doing 100% of the type accent work and terracotta hidden in chrome.
- **Why it matters:** The palette ends up monochromatic-warm — ochre everywhere, no second warmth. Headlines, italics, labels, buttons, dividers, em accents all use the same ochre. The page lacks a second accent register.
- **Fix:** Either commit to ochre-only and remove terracotta entirely (clean palette), or give terracotta one typographic role — e.g. price/offer codes (`<strong>VERANO26</strong>` currently uses ochre-faint background; could be terracotta), or the underlines under hovered links, or the testimonial author dashes. Smuggling it into a progress bar is the worst of both worlds: it's in the palette without being part of the system.

---

### 13. Mobile clamp for `.testimonial-text` drops to 1.2rem but kills the italic display weight — **NIT**
- **What:** `.testimonial-text { font-family: 'DM Serif Display'; font-style: italic; font-size: clamp(1.3rem, 2.4vw, 2.2rem); }` then `@media (max-width: 480px) { .testimonial-text { font-size: 1.2rem; } }` (style.css:2072). At 1.2rem in italic DM Serif Display, the italic is a slanted upright (DM Serif Display has no true italic — Google Fonts serves a synthesized oblique). It looks fine at 2rem; at 1.2rem the slant looks crude and the high-contrast strokes get scratchy.
- **Why it matters:** Mobile is where most luxury hotel research actually happens (people on phones evening-scrolling). The testimonial slider is one of the few "soft sell" moments; if it renders crude, trust dips.
- **Fix:** Set `.testimonial-text` to Cormorant Italic on mobile (true italic, designed for body sizes) and keep DM Serif Display for desktop where the high contrast reads as elegant. Conditional via media query is fine. Also: the clamp already covers down to 1.3rem — the 480px override to 1.2rem is just 0.1rem; consider deleting the override and letting the clamp do the work.

---

### 14. `.section-photo-strip` introduces a sepia/saturate filter inconsistent with the rest of the imagery treatment — **NIT** *(this is borderline visual, not strictly typography, but it affects the typographic atmosphere around it)*
- **What:** Photo treatments use slightly different `filter` recipes throughout:
  - hero-bg: `brightness(0.85) saturate(0.95) sepia(0.06)`
  - sanctuary-image-wrap img: `sepia(0.08) saturate(0.9)`
  - breath-bg: `sepia(0.1) saturate(0.85) brightness(0.7)`
  - art-hero-bg: `brightness(0.4) saturate(0.85) sepia(0.04)`
  - photo-strip: `saturate(0.82) sepia(0.06) brightness(0.92)`
  - art-piece-img: `sepia(0.05) saturate(0.9)`
- **Why it matters:** This isn't typography per se — but caption tags ("N° 01 · La Casa") rendered over these slightly different photo washes will sit on slightly different tonal beds. The system feels eyeballed.
- **Fix:** Pick three filter "presets" tied to context (hero / panel / detail) and apply them as CSS custom properties so they stay consistent. Frees the typography to land on a predictable ground.

---

### 15. `.footer-col ul a` is Cormorant serif at 1rem — collides with the "labels are sans" pattern the rest of the site uses — **MINOR**
- **What:** `.footer-col ul a { font-family: 'Cormorant', serif; font-size: 1rem; color: var(--fg-dim); }` (style.css:1780–1786). Footer link lists are typically in the same UI typeface as nav. The top-nav uses Inter (`.top-nav .nav-links a`) at 0.7rem uppercase. Now the footer breaks that and runs the same nav items ("The Sanctuary", "Rooms", "Honeymoon") in Cormorant serif at body size, mixed case.
- **Why it matters:** The same link can appear in two completely different typographic registers depending on whether it's in the top nav or the footer — and the reader has no semantic reason for the shift. It reads as decorative inconsistency.
- **Fix:** Run footer link lists in Inter 400, 0.78–0.85rem, normal case OR uppercase tracked (matching the nav). Save Cormorant for the footer's brand paragraph and the Spanish coda line — those should keep their serif gravitas.

---

## What's working (optional)
- The progress bar gradient (`terracotta → ochre → cenote`) is restrained and uses three palette tokens — small detail done well.
- `.label` system has consistent ochre + uppercase + Inter 500, and the size (0.62rem) reads as deliberate rather than tiny.
- The marquee in the art section (`.art-marquee-track` in DM Serif italic with bullet dots) is a genuinely strong typographic moment — it actually feels gallery-coded rather than hotel-coded, which is what the brief wants. Keep it.
- Hero meta strip (15 / 1909 / 21°N) is a clean numeric tier and the typography (`.hero-meta__num` in DM Serif at 1.15rem) is well-judged for the scale.
