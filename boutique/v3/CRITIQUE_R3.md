# CRITIQUE — V3 / Round 3 (Motion, Interaction, Polish, A11y, Edge Cases)

Subject: `Boutique by The Museo` — Brutalist Art-Forward variant.
Reviewer scope: motion, micro-interaction, performance, accessibility, edge cases.
Posture: adversarial — what is weak, where it leaks. R1 + R2 issues are not re-litigated; this is the polish round.

Findings are numbered, severity-tagged, and ordered roughly by user impact. 14 findings + a "what's working" coda.

---

## 1. CRITICAL — No `<main>` landmark; skip-link target is also wrong

**What.** `index.html` has zero `<main>` element. The skip link (`<a href="#manifesto" class="skip-link">`) jumps over the entire landing hero — which contains the H1 "BOUTIQUE BY THE MUSEO" — straight to `#manifesto`. Screen-reader users on assistive jumps then never reach the landing identity at all, and there is no `role="main"` for landmark navigation.

**Why it matters.** WCAG 2.1 / 1.3.1 + 2.4.1. Landmark navigation (`D` in NVDA, rotor in VoiceOver) is dead. Skip-link target also bypasses the page's primary heading, which is the only place the brand is announced as a heading-equivalent (it's an `aria-label` on `<h1>`).

**Fix.** Wrap from `<section class="landing">` through `<section class="the-space">` in `<main id="main">` and retarget the skip link to `#main`. The hero stays inside `<main>`, the landmark exists, the skip link doesn't accidentally skip the brand.

```html
<a href="#main" class="skip-link">Skip to content</a>
...
<main id="main">
  <section class="landing"> ... </section>
  ...
  <section class="the-space"> ... </section>
</main>
<footer class="footer"> ... </footer>
```

---

## 2. CRITICAL — `<html lang="en">` is wrong for the Spanish review and whisper line

**What.** `index.html:2` declares `lang="en"`. But:
- The C.D. / CDMX review (`index.html:532`) is pure Spanish: *"Un refugio, en el sentido literal. La casa se queda del lado silencioso."*
- The whisper line (`index.html:95`) is bilingual fragments — fine to leave in `en` context, but the manifesto coda is also in Spanish (`Un refugio en el corazón de Mérida...`).
- Several headers are Spanish (`MANIFIESTO`, `LA COLECCIÓN`, etc.) — those are arguably loanwords in this context, but the C.D. review is not.

A screen reader voice will pronounce *"La casa se queda del lado silencioso"* with English phonemes — it sounds nonsensical.

**Why it matters.** WCAG 3.1.2 (Language of Parts). R2 added Spanish content without language markup. This is the regression R2 introduced.

**Fix.** Mark the Spanish review and the Spanish portion of the coda:

```html
<div class="review-text" lang="es">"Un refugio, en el sentido literal. La casa se queda del lado silencioso."</div>
...
<div class="manifesto-coda">
  <p><span lang="es">Un refugio en el corazón de Mérida.</span> A restored casona steps from Palacio Cantón...</p>
</div>
```

Also consider `lang="es"` on the whisper line (`"coffee at six. limestone, before the light."` is mixed — actually English; leave it). And the section labels (`MANIFIESTO`, `LA COLECCIÓN`, `LA EXPOSICIÓN`, `MÉRIDA CURADA`, `NOTAS DE CAMPO`, `ÍNDICE`, `EL ESPACIO`, `ESPECIFICACIONES`) — wrap each in `<span lang="es">` so the SR doesn't read "MANY-FYESS-TOH".

---

## 3. CRITICAL — Letter dispersion + counter init cause FOUC / CLS on landing

**What.**
- `js/main.js:275` — counters explicitly `textContent = '0'` only after JS runs. The HTML defaults already say `0` so that's a no-op, but `2023` counter starts at `0` and grows — fine.
- The real issue: `.landing-title .letter` has `transition: transform 0.15s steps(3)` (`css/style.css:398`). On first paint, the inline `style.transform` set by the scroll handler may run *before* the page has scrolled, producing a one-frame jitter at the top.
- Worse: if a user lands deep-linked to `#manifesto`, the scroll handler fires `scrollY >> 0` *before* the letters have rendered at their natural position, so they appear pre-dispersed and faded — but the IntersectionObserver for manifesto-line glitch may also have already fired (the user sees the second half of an animation they never saw the first half of).

**Why it matters.** First impression. Brutalist sites can't afford the "did something break?" microsecond.

**Fix.** Gate the scroll handler on `landing.getBoundingClientRect().bottom > 0` (so it only runs while landing is in or above viewport), and on first call short-circuit if `scrollY` is non-trivial at load — snap to dispersed state without animating:

```js
// inside scroll handler initialization
const initialScroll = window.scrollY;
if (initialScroll > landing.offsetHeight) {
  // already past landing — set final state without transition
  letters.forEach((letter, i) => {
    letter.style.transition = 'none';
    letter.style.opacity = 0;
  });
}
```

Also add `opacity: 1` baseline to `.landing-title .letter` so the natural state is explicit (currently it inherits — first paint may briefly show no opacity if the JS opacity-setting fires too early).

---

## 4. MAJOR — `data-cell` row/col highlight has no keyboard equivalent; cells are not focusable

**What.** `js/main.js:298–316` binds `mouseenter`/`mouseleave` on `.data-cell` to highlight its row + column. R1 correctly removed `tabindex` from the cells (they're informational, not interactive). But that means a keyboard user **never sees the row/col highlight** — and worse, on touch (no `mouseenter` fires reliably), neither do mobile users. This is a sighted-pointer-only interaction posing as a feature.

**Why it matters.** Either it's worth doing for everyone, or it's decoration that shouldn't exist. Right now it splits users.

**Fix.** Two options:

(a) Remove the JS row/col highlight entirely; let the simple `:hover` already in CSS (`.data-cell:hover { background: ... }`, `css/style.css:726`) be the entire interaction. Drop `mouseenter` handlers and the `getGridCols()` heuristic (which is fragile — see #5).

(b) Keep it, but trigger on `focus`/`focusin` too, and add `tabindex="0"` plus `aria-label` synthesized from the cell content (`"Rooms: fifteen, 15 keys no more"`). Choose (a) — it's a brutalist site; the row/col grid is already legible without the assist.

---

## 5. MAJOR — `getGridCols()` heuristic is fragile and runs per hover

**What.** `js/main.js:284–296`:
```js
const cols = style.gridTemplateColumns.split(' ').filter(Boolean).length;
const cellsPerRow = Math.max(1, Math.round(cols / 4));
// Fallback: count cells that are on the same row by offsetTop
```

This:
1. Runs `getComputedStyle` + `offsetTop` reads on every `mouseenter` — layout thrash.
2. Splits `grid-template-columns` by space, but at 1024px the computed value is `repeat(6, 1fr)` resolved to 6 widths, at desktop 12, at mobile 1 — the `/4` heuristic only matches desktop. The `offsetTop` fallback covers the cases the heuristic misses, but the heuristic still computes for nothing.
3. At single-column mobile, every cell shares `offsetTop` with the first only if `offsetTop` is identical — but they stack, so `firstTop` matches only `cells[0]`. `countSameTop === 1`, so `cols = 1`, all cells highlight as one "row" — visually correct, but conceptually wrong (the row/col concept doesn't apply at 1-col).

**Why it matters.** Brittle layout reads + redundant compute per hover.

**Fix.** Cache `cellsPerRow` on `resize` (debounced) with a ResizeObserver on `gridInner`, not on each hover. Better: combine with #4 and delete the whole subsystem.

---

## 6. MAJOR — `CERO` counter animates 0→0 with no visible motion (R2 note confirmed)

**What.** `index.html:552`: `<div class="counter-number" data-target="0">0</div>`. With no `data-text` override, the animation loop in `js/main.js:226–262` runs the easing for 1700ms producing `Math.floor(0 * progress)` = `0` every frame. The counter visually does *nothing* — but `.counter-cell` still gets the `.counted` class via the MutationObserver, and the small line under it draws. So this cell *appears* to animate (line draws) but the number is dead.

R2 reviser flagged this — fix wasn't shipped.

**Why it matters.** Dead motion on the cell most likely to draw the eye (the zero / "independent" claim). The whole counter section is a beat in the editorial rhythm, and one of five beats is silent.

**Fix.** Option A — add a brief flicker / colon-replace:
```html
<div class="counter-number" data-target="0" data-text="0">0</div>
```
And in `animateCounter`, when `data-text === '0'`, run a 500ms scramble that flickers through `["8","3","0","5","0"]` then settles. Or:

Option B — pure CSS pulse on `.counter-cell.counted` (where `data-target="0"`):
```css
.counter-cell.counted .counter-number {
  animation: zero-flicker 0.6s steps(6) 0.2s;
}
@keyframes zero-flicker {
  0%, 100% { opacity: 1; }
  20% { opacity: 0.3; }
  40% { opacity: 1; }
  60% { opacity: 0.5; }
  80% { opacity: 1; }
}
```

Either way, the zero needs *some* arrival motion.

---

## 7. MAJOR — Focus state on dark sections may fail contrast on terracotta-adjacent surfaces

**What.** `css/style.css:127–141` adds a `.menu-overlay a:focus-visible { outline: 2px solid var(--limestone); }` rule for dark surfaces. Good. But:
- `.exhibit-cta` (terracotta `#b85a3a` background, limestone text) — when focused, the inherited rule on the exhibition section (`.exhibition a:focus-visible`) sets a limestone outline. Limestone (`#f2ece0`) on terracotta (`#b85a3a`) — contrast ratio ~3.0:1. WCAG 2.4.11 (focus appearance, 2.2) wants 3:1 minimum *against adjacent colors* — this is marginal. Worse, the `outline-offset: 2px` puts the outline 2px outside the terracotta button, which sits on `--ink` — fine there. So actually focus *is* visible. Marginal pass.
- More concerning: `.room-cta:hover` swaps to `background: var(--ink)` (`css/style.css:868`) — so on hover-and-focus, the button is ink-on-limestone with a 2px **ink** outline (the default `a:focus-visible` rule at line 119). Ink outline on ink button — invisible focus.

**Why it matters.** Sequential `:focus` + `:hover` (very common on keyboard nav with mouse cursor parked) hides the focus ring on every room CTA.

**Fix.**
```css
.room-cta:hover:focus-visible,
.room-cta:focus-visible:hover {
  outline-color: var(--limestone);
}
```
Or more cleanly: always use limestone outline on `.room-cta:focus-visible` since the resting state is ink-bordered already (the outline at 2px offset stays outside the border either way):
```css
.room-cta:focus-visible {
  outline: 2px solid var(--terracotta);
  outline-offset: 4px;
}
```
Terracotta on limestone = 4.3:1 — passes. Terracotta on ink = 5.1:1 — passes. Use terracotta for the CTA family.

---

## 8. MAJOR — `mix-blend-mode: difference` on `.nav` over the menu overlay creates compositor cost + readability flicker

**What.** `css/style.css:191`: `.nav { ... mix-blend-mode: difference; }`. As the user scrolls, the nav inverts against every section's background. When the menu overlay opens (`z-index: 999`, the nav is `z-index: 1000`), the nav sits *above* the dark overlay and inverts against ink — rendering as near-limestone, which is fine. But:
- The blend mode forces a compositor layer the entire scroll length.
- During the scroll dispersion animation on the landing, the nav is computing difference against the moving letters underneath — extra paint per frame on a path many users will hit.

**Why it matters.** Mobile Safari especially: `mix-blend-mode` plus heavy `filter:` chains on landing-bg (`contrast(1.05) saturate(0.85)`) plus per-letter transforms = sluggish scroll.

**Fix.** Two changes:
1. Drop `mix-blend-mode: difference` on `.nav` and instead toggle a `.nav--dark` class via IntersectionObserver as sections enter the viewport (you're already running observers on every section for the noise flash — add a 1-line class swap).
2. When the menu is open, the inverted nav text is redundant — `.menu-overlay.active ~ .nav` could `mix-blend-mode: normal` to spare the GPU.

Actually simplest: ship #1 and delete the blend mode entirely.

---

## 9. MAJOR — `section-noise` flash fires on tiny intersection slivers; runs for nine sections; mobile = constant flickering

**What.** `js/main.js:202–212`:
```js
if (entry.isIntersecting && entry.intersectionRatio > 0.05 && entry.intersectionRatio < 0.3) {
  noiseEl.classList.add('flash');
  ...
}
```
Threshold list is `[0.05, 0.1, 0.2]`. Observer runs against **every `<section>`** (`querySelectorAll('section')` — 8 of them). On mobile where viewports are short, a section enters the 5–30% window and triggers the flash *as the user scrolls back and forth* (no `unobserve`, no debounce). Net result on a fast scroll: the screen flashes the noise overlay 3–6 times in rapid succession.

The noise overlay is `position: fixed; inset: 0; z-index: 9998; mix-blend-mode: multiply` — fullscreen overlay with blend mode. Each flash forces a fullscreen composite.

**Why it matters.** Performance + visual disturbance + accessibility (vestibular sensitivity — `prefers-reduced-motion` guards the listener attachment, fine, but for everyone else it's noisy).

**Fix.**
- Add cooldown: track `lastFlashAt`; refuse re-fire within 800ms.
- Reduce to one or two threshold tripwires per section (use `rootMargin` to define a precise entry line rather than ratio range).
- Or simplify to a one-time flash per section: `noiseObserver.unobserve(entry.target)` after firing.

```js
let lastFlash = 0;
const noiseObserver = new IntersectionObserver((entries) => {
  const now = performance.now();
  entries.forEach(entry => {
    if (entry.isIntersecting && now - lastFlash > 800) {
      noiseEl.classList.add('flash');
      lastFlash = now;
      setTimeout(() => noiseEl.classList.remove('flash'), 150);
      noiseObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });
```

---

## 10. MAJOR — Manifesto whisper line at long copy breaks at narrow viewports

**What.** R2 lengthened the whisper line from a short whisper to `"coffee at six. limestone, before the light."` (`index.html:95`). At `clamp(1.4rem, 4vw, 3.4rem)` Cormorant italic, on a 320px viewport: ~24px font size, ~21ch line — the phrase is ~44 characters, so it wraps over two lines. That's fine. But:
- `.manifesto-line--whisper` retains `line-height: 1.1`, so two-line wrap squashes descenders into ascenders. *coffee* + *limestone* both have descenders (f, g) that collide.
- The `border-left` on the whisper line is set at `padding-left: 1.4rem` (`css/style.css:611`) — non-matching to the other lines' `padding-left: 1.2rem`. At small screens the whisper visibly steps right of the others — looks like a typo, not a deliberate inset.

**Why it matters.** R2 typeset regression at mobile, which is where most readers will see it.

**Fix.**
```css
.manifesto-line--whisper {
  line-height: 1.25;          /* breathe with descenders */
  padding-left: 1.2rem;       /* align with other lines */
  max-width: 22ch;            /* force balanced wrap */
}
@media (max-width: 768px) {
  .manifesto-line--whisper { font-size: clamp(1.2rem, 5vw, 2rem); }
}
```

---

## 11. MAJOR — Hot-linked Boutique image URLs are a fragility/perf footgun

**What.** Multiple `<img>` and `background-image` references point at `https://boutiquebythemuseo.com/wp-content/uploads/...` (landing-bg, manifesto strip, all 4 room images, space gallery, preload). If the third-party site:
- Changes its WP media filenames → 404 → landing-bg shows ink only (acceptable degradation), but room/space images vanish.
- Adds hotlink protection → all images blocked, every room is a broken-image icon.
- Resizes/recompresses → unannounced bandwidth changes.

Per the task brief, V1/V2 R3 fixes downloaded local copies; V3 should match.

**Why it matters.** Production fragility. Also CLS — none of these `<img>` have `width`/`height` or `aspect-ratio` declared (see #12).

**Fix.** Download all `boutiquebythemuseo.com` and `unsplash.com` images to `v3/img/`, rewrite paths. Same script the V1/V2 round used. Add `width="1600" height="1067"` (or appropriate intrinsics) on each `<img>` to lock aspect ratio.

---

## 12. MAJOR — Images lack `width`/`height`/`aspect-ratio` → CLS on every room block + plate grid

**What.** Every `<img>` in the catalog (room images, plate images, space gallery) has no intrinsic dimensions set. The `.room-image-wrap` is `height: 78vh` (`css/style.css:791`) with `min-height: 380px` — so the *wrapper* reserves space, fine. But:
- `.plate-img-wrap` has `min-height: 36vh` — works.
- `.manifesto-strip img` has `height: 100%; width: auto` — width is unknown until the image loads, so the strip's `width: max-content` grows asynchronously after each load completes. The marquee animation (`stripScroll 30s linear`) calculates `translateX(-50%)` from the *current* `max-content` width. If images load mid-animation, the loop seam will jump.

**Why it matters.** CLS during initial load (visible) and the marquee jump (subtle but professionally distracting).

**Fix.** Add explicit aspect on each `<img>` via `width` / `height` attributes, and serve them at a known size:
```html
<img src="..." width="683" height="1024" alt="..." loading="lazy">
```
For the manifesto strip specifically, set `.manifesto-strip__track img { width: 28vw; }` so total track width is deterministic before images load.

---

## 13. MINOR — `aria-controls` missing on menu toggle; `aria-expanded` works but the link is incomplete

**What.** `index.html:28` — `<button class="nav-menu-btn" aria-label="Open menu" aria-expanded="false">INDEX</button>`. It has `aria-expanded` but no `aria-controls="..."` pointing at the menu overlay. The menu overlay has no `id`. Screen reader can't programmatically associate the trigger with the dialog it controls.

Also: `aria-label="Open menu"` is on a button that *also* has visible text "INDEX". Screen readers will read "Open menu" and ignore "INDEX" — confusing if the user is reading the page and looking for the visible word. Either drop the `aria-label` (let "INDEX" speak for itself) or change it to enrich, not replace.

**Why it matters.** WAI-ARIA disclosure pattern; SR users miss the "INDEX" labeling.

**Fix.**
```html
<button class="nav-menu-btn" aria-expanded="false" aria-controls="site-index">INDEX</button>
...
<div class="menu-overlay" id="site-index" role="dialog" aria-modal="true" aria-label="Site index">
```

Also: the menu close button's `aria-label="Close menu"` is fine, but the visible text "CLOSE" gets overridden — same issue. Drop it.

---

## 14. MINOR — Newsletter form has no real submit handler; placeholder typing animation continues after user types

**What.**
- `index.html:641`: `<form class="footer-newsletter" onsubmit="event.preventDefault();">` — the form swallows submit silently. A user enters their email, presses Enter, nothing happens. No success state, no error, no toast.
- `js/main.js:329–351`: the placeholder typing animation runs on first IntersectionObserver hit on `.footer`. If the user has already focused the input or started typing before the observer fires (fast-scroll to footer), `newsletterInput.placeholder` is being mutated *while* the user types — the placeholder visibly changes character-by-character in the background. Not a crash, but a polish leak.
- No `name=` attribute on the input — even if a real action existed, the value would have no field name in form submission.
- Mobile keyboard: `type="email"` is good (gets the @ key on iOS). But there's no `autocomplete="email"` or `inputmode="email"` — minor convenience loss.

**Why it matters.** Footer signup is the actual conversion surface here. Right now it's decorative-only.

**Fix.**
```html
<input type="email" name="email" autocomplete="email"
       inputmode="email"
       placeholder="ENTER EMAIL"
       aria-label="Email for quarterly dispatches" required>
```
And in JS — gate the placeholder typer on `document.activeElement !== newsletterInput && !newsletterInput.value`. On submit, fake a success state visually:
```js
form.addEventListener('submit', (e) => {
  e.preventDefault();
  form.classList.add('enrolled');
  // show "ENROLLED — N° 0143" stamp
});
```

---

## 15. NIT — Stale comment, duplicate selector, unused JS handler

- `css/style.css:600` comment reads `Line 6 — "WHISPER, DON'T SHOUT"` but R2 rewrote line 6 to `"coffee at six. limestone, before the light."`. Stale.
- `css/style.css:1648`: `.counter-number--small { font-size: clamp(3.5rem, 10vw, 9rem); }` is identical to `.counter-number`. The class does nothing. Either delete it from CSS + HTML or actually differentiate (the `2023` year cell could afford a tighter scale to read as a date, not a count).
- `js/main.js:354–366`: the gallery clip-path reveal observer toggles `revealed` on intersect AND removes it on un-intersect. Every other observer on the page is one-shot. This one causes the gallery to re-animate every time the user scrolls past — fine for the first reveal, slightly fussy on scroll-back. Set `unobserve` after first trigger.
- Skip link `top: -100%` (`css/style.css:105`) — `-100%` of an `absolute`-positioned element relative to its containing block is fine, but `-200px` or `top: -3rem` is more conventional and predictable across edge cases.
- `.nav` z-index 1000, `.menu-overlay` z-index 999 — when the menu opens, the nav (with `mix-blend-mode: difference`) sits on top of the overlay. The close button is inside the overlay at z-index 999, but the INDEX button at z-index 1000 is still clickable through the overlay (since `pointer-events: all` is set on the overlay only when active). Open menu, click INDEX again — `openMenu()` re-runs, sets `lastFocused` to the close button (because focus moved there), re-applies `inert`. Doesn't break, but it's a doubled-event path. Either disable `.nav-menu-btn` when overlay is open or `z-index` the overlay above the nav.

---

## What's working (do not regress)

- **Focus trap in menu overlay** — `openMenu`/`closeMenu` correctly capture `lastFocused`, apply `inert` to siblings, restore focus on close, handle Esc, cycle Tab in both directions. The R1 reviser nailed this; it's textbook.
- **`prefers-reduced-motion` coverage** — gates cursor readout, letter dispersion, manifesto glitch, noise flash, newsletter typing animation. The CSS `@media (prefers-reduced-motion)` block at line 2153 also nukes manifesto opacity-translate and the strip marquee. Comprehensive.
- **`(hover: none)` killing the cursor readout** at line 176 — correct, lightweight, no JS guard needed.
- **`will-change: transform` on `.letter`** + rAF-throttled `mousemove` — animation infra is correct.
- **Plate captions** stay readable on the ink background; the contrast lift R1 did has held through R2.
- **Reduced-motion override for review card rotation** — `prefers-reduced-motion` block also catches `*::before, *::after` transitions; review cards rest in their rotated state but don't animate on hover. Acceptable.
- **Counter line-draw + `.counted` background tint** — sequenced via MutationObserver on the line, no race conditions, no flicker.

---

## Prioritization summary

| # | Severity | Effort | Order |
|---|----------|--------|-------|
| 1 | CRITICAL | XS | 1st — pure markup |
| 2 | CRITICAL | XS | 2nd — pure markup |
| 11 | MAJOR | M | 3rd — depends on file system; pairs with #12 |
| 12 | MAJOR | S | 4th — pairs with #11 |
| 3 | CRITICAL | S | 5th — landing init guard |
| 6 | MAJOR | XS | 6th — single CSS animation |
| 9 | MAJOR | S | 7th — observer rewrite |
| 7 | MAJOR | XS | 8th — focus CSS |
| 10 | MAJOR | XS | 9th — CSS tweak |
| 8 | MAJOR | M | 10th — only if perf-testing reveals jank |
| 4 + 5 | MAJOR | S | 11th — delete the row/col system |
| 13 | MINOR | XS | 12th |
| 14 | MINOR | S | 13th |
| 15 | NIT | XS | 14th — cleanup pass |

Land #1, #2, #6, #7, #10, #13 in a single 30-min sweep. The image localization (#11/#12) is the biggest single item.
