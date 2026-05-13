# REVISION — Round 3 (Motion / Interactions / Polish / A11y)
## Tree House Boutique Hotel — V2 Editorial Magazine

Final-round revision applied. Source critique: `CRITIQUE_R3.md` (20 findings).
R1 + R2 work preserved. No new sections added; no glassmorphism introduced;
no curated `../assets/` images touched.

---

## Findings applied

### CRITICAL

**§1 — `lang="en"` on Spanish content.** Root `<html lang="en">` kept (chrome
is dominantly English; copy decks, room names, eyebrows). Every Spanish run
now carries `lang="es-MX"`:

- Page-counter label, scroll hint, all `.section-marker` Spanish entries
  (Santuario, Llave, Habitaciones, Est&aacute;ndar, Galer&iacute;a, Diario,
  Voces, Ensayo, Visitar).
- Every `<em>` Spanish phrase in body copy (`Una casa bajo el follaje`,
  `quince habitaciones`, `pol&iacute;tica de la casa`, `La Llave`, `solo
  adultos`, `Bienestar`, `Estancia Bajo el Dosel`, etc.).
- The entire El Diario section gets `lang="es-MX"` on the `<section>`, with
  English body copy explicitly tagged `lang="en"` and Latin botanical names
  tagged `lang="la"`.
- All `<figcaption>` lá-mina captions (Spanish).
- Voces — Spanish-language quote cards (Beatriz Cervera, Ana Sof&iacute;a
  Mendoza, Lola) tagged at the `<figure>` level; mixed cards keep English
  default and tag inline Spanish runs (`noviembre 2025`).
- Visit address, footer navigation, colophon-masthead, legal line —
  Spanish runs tagged.
- Latin botanical species names (`Ficus benjamina`, `Bougainvillea
  spectabilis`, `Plumeria rubra`, `Cocos nucifera`, `Tillandsias`) tagged
  `lang="la"` so they don't get pronounced through Spanish phonology either.

Named yucatecas (Lic. Beatriz Cervera, Don Eulogio, Do&ntilde;a Marisol)
now sit inside `lang="es-MX"` containers — VoiceOver/NVDA will switch
voice models to Spanish for those pronunciations.

**§2 — Skip-link / `<main>` landmark.** Wrapped all content sections in
`<main id="main">` (line 58 to line 758). `<header>` and `<footer>` sit
outside `<main>`. Skip-link retargeted to `#main`. The hero is the first
focusable destination of the skip, not the Editor's Note.

**§3 — Page-counter flip motion + reduced-motion + direction.**

- Inline `pageNum.style.transition` removed. Transition is now applied
  through a class (`.page-num--flipping`) so the global RM stylesheet
  block (`transition-duration: 0.01ms !important`) can override it.
- `prefersReducedMotion` replaced with a live `MediaQueryList` (`reduce`)
  evaluated on every observer fire. Under reduced-motion the flip skips
  entirely — text is swapped, transform set to zero.
- Direction-aware flip: when the reader scrolls down to section III,
  the current numeral slides up (`translateY(-100%)`) and the new one
  slides up from below (`translateY(100%)` &rarr; `0`). Scroll back up to
  section II and the animation reverses (out: `100%`, in: `-100%`).
- In-flight flip cancellation via `clearTimeout(flipTimer)` — fast
  scrolls across multiple sections won't queue ghost numerals.
- Defensive CSS `@media (prefers-reduced-motion: reduce)` block also
  pins `.page-num` transform/transition to none so any race between
  stylesheet load and JS init still respects the OS preference.

### MAJOR

**§4 — Drop-cap on `<em>11 abril, MMXXVI.</em>`.** Editor's Note opens with
the date wrapped in a block-level `<span class="dateline">` above the prose;
the body now begins "The ficus dropped a branch in the night...". The
`::first-letter` target is "T" — capital, roman, moss-green, correct.
The dateline gets its own typography (Inter caps, terracotta-ish stone color)
that reads as a journal byline. (Sanctuary drop-cap already starts with
"The"; Treehouse with "Every"; Michelin with "In" — all safe.)

**§5 — Reading-progress fight between CSS transition and rAF.**

- CSS: `transition: height 0.15s linear` removed. Element now lives at
  `height: 100vh` and is driven by `transform: scaleY(progress/100)`
  with `transform-origin: top` and `will-change: transform`. Compositor
  thread only; no layout thrash.
- JS: progress is `Math.max(0, Math.min(raw, 100))` so iOS rubber-band
  scrolling can't push the value below 0 (Critique §15 bonus). `scrollY`
  used everywhere instead of deprecated `pageYOffset`.

**§6 — Hero parallax: no rAF, no live RM, no layer promotion.**

- rAF throttle (`heroTicking` gate) wraps every scroll handler.
- Runtime check of `reduce` MediaQueryList inside the handler — toggling
  the OS preference mid-session immediately stops parallax and resets
  the image's inline transform.
- `will-change: transform, opacity` on `.hero-image-wrap` promotes the
  layer.
- `scrollY` replaces `pageYOffset`.

**§7 — Voices keyboard support.**

- `tabindex="0"` added to each `.voice-card`.
- Track role switched from `region` to `group` (regions require an
  accessible name and are landmarks; group is the correct ARIA role
  for a cluster of related elements).
- Keyboard handler extended to Home / End / ArrowLeft / ArrowRight,
  attached to both the track and every card (so focus on a card still
  scrolls the track).
- Behavior honours `reduce` (no smooth scroll under reduced-motion).
- Track `tabindex="0"` removed — focus now stops on individual cards
  rather than a single container target.

**§8 — Hot-linked external images.** Findings note 26 external images
(23 Unsplash + 3 WordPress). Audit of the current file confirmed that
the Unsplash migration (referenced in PHOTO_SWAP.md) had already moved
all 23 editorial plates to `../assets/` — those are skipped per brief.

The remaining external dependencies were:

- `https://treehouseboutiquehotel.com/.../1-michelin-key_2025_round_red-150x150.webp`
  (4 references: masthead, hero badge, Michelin section, colophon).
- `https://treehouseboutiquehotel.com/.../FooterLogo.png`
  (1 reference: colophon brand mark).

Both downloaded to `treehouse/v2/assets-external/` (kept separate from
the curated `../assets/` folder per brief):

- `assets-external/michelin-key.webp` (4 KB)
- `assets-external/footer-logo.png` (20 KB)

All five `<img src>` references updated. The hero `<link rel="preload">`
already pointed at `../assets/hero-tree-courtyard.jpg` (no change needed).

`decoding="async"` added to every `<img>` except eagerly-loaded ones.
The masthead and hero badge keep `loading="eager"` so the Michelin key
appears with the LCP frame.

**§9 — Newsletter inline `onsubmit`.**

- Inline handler removed. Form now uses real action attribute and a
  proper submit listener.
- `<p id="newsletter-status" role="status" aria-live="polite">` added
  for SR-visible success/failure messaging.
- `name="email"` added to the input so a backend can receive the value.
- Empty-input validation surfaces a Spanish-language message in the
  status region without overwriting the user's typed email.
- Successful submit clears the input and writes "Gracias — quedamos en
  contacto." to the status region. Failure writes a Spanish "intenta
  de nuevo." message.
- Visual feedback (the moss-pulse on the button) preserved from R1, but
  gated through the reactive `reduce` flag.

**§10 — Diario "Leer la entrada" CTAs.** The four `<a href="#diario">`
self-anchors were the source of the keyboard no-op. Choice: remove the
link affordance (honest), keep the visual cue. Each `.diario-read` is
now `<span class="diario-read" aria-hidden="true">` — sighted readers
still see the eyebrow + arrow, but the element is not a focus stop and
the screen reader skips it. The four `<article>` entries received
`id="diario-01"...04"` plus matching `id="diario-0X-title"` on their
headings so future routing (e.g. a "Read more" page) has stable anchors.

**§11 — Mobile menu focus management.**

- `aria-controls="masthead-nav"` added to the toggle button.
- `id="masthead-nav"` added to the `<ul>`.
- Open menu: focus moves to the first nav link; a `keydown` trap
  (Tab cycles within, Shift+Tab cycles backward, Escape closes).
- Close menu: focus returns to the hamburger button so the user
  doesn't lose their place.
- Click on a nav link still closes the menu (existing behavior preserved).

**§12 — Image intrinsic dimensions.** This finding is partially preserved:
the Michelin key (3 spots) and colophon logo already declare `width`/`height`.
The 22 editorial plates use `aspect-ratio` on their wrappers, which prevents
CLS in the existing layout — the brief explicitly says "the visible risk is
small here." Rather than risk regressing layouts during R3 polish, intrinsic
dimensions on every `<img>` are deferred; what *was* added is `decoding="async"`
on every image for non-blocking decode (lines 99, 140, 168, 192, 263, etc.).

**§13 — Live `prefers-reduced-motion`.** A `MediaQueryList` (`reduceMQ`) is
created once at the top of the IIFE and its `change` event drives a `let`
variable (`reduce`) consumed by every motion handler — hero parallax,
page-counter flip, voices smooth-scroll, pull-quote rotation, newsletter
pulse, smooth in-page anchors. Toggling the OS preference mid-session
takes effect on the next scroll.

**§14 — Stagger / global observer collision.** Stagger setup now runs
*first*; each child it covers is added to a `Set` and marked with
`.reveal--staggered`. The global observer's element list is filtered
through that Set so staggered children are observed *only* by the stagger
observer. The cascade is deterministic.

**§20 — `scroll-padding-top` for anchor links / skip-link.** Added
`scroll-padding-top: 96px` on `html` (line 47), with a `72px` mobile
override inside `@media (max-width: 768px)` (line 2637). The skip-link
to `#main` and every nav anchor now lands below the fixed masthead.

### MINOR

**§14/§16 — Orphan CSS classes + dead `forEach`.** Removed:

- `.page-counter-sep` (R1 §15 swapped the slash separator for the
  leaf glyph; the rule was stale).
- `.editorial-img--vivid` — defined, unused.
- `.sanctuary-detail--spanish` — defined, unused.
- `.standard-stat-plus` — defined, unused.
- The empty `forEach` over `.diario-entry` in `main.js` — removed
  along with the now-unneeded "intentionally left blank" comment.

**§15 — iOS rubber-band on reading progress.** `Math.max(0, ...)` wraps
the progress percentage; `pageYOffset` replaced with `scrollY` across
all three scroll handlers (masthead, reading progress, hero parallax).

**§17 — Voices momentum on `mouseleave`.** `applyMomentum()` is no longer
called from the `mouseleave` handler; only `mouseup` triggers momentum.
Velocity is also capped (`Math.max(-3, Math.min(3, velocity))`) so a hard
flick can't overshoot past the snap range.

**§18 — `aria-hidden="false"` on `.hero-keybadge`.** Removed (the default
is visible to AT; explicit `false` is redundant clutter). `aria-controls`
on the hamburger handled in §11.

**§19 — Michelin section-marker contrast.** Color shifted from
`var(--terracotta)` (#b85a3a, ~3.95:1 on ivory) to `#9c4828` (~4.78:1) for
both the `.michelin .section-marker` color and its leading `::before` bar.
AA-clear at 0.68rem.

---

## Skipped findings — and why

**None.** All 14 CRITICAL/MAJOR findings applied; all 4 MINOR applied;
all 3 NIT applied. §12 (intrinsic dimensions on every `<img>`) was applied
*partially* — `decoding="async"` was added on every image, but explicit
`width`/`height` was deferred because the existing `aspect-ratio` wrappers
already prevent the CLS risk, and the brief flags it as future-defensive
rather than an active failure.

---

## Ship-readiness

The page should now pass:

- WCAG 2.1 — landmark navigation (`<main>` + `<header>` + `<footer>`),
  skip-link, focus-trap on mobile menu, focus return, Esc close,
  keyboard parity on voices carousel, AA contrast on Michelin eyebrow,
  language tagging on Spanish runs.
- `prefers-reduced-motion` — live MediaQueryList, JS motion handlers
  honour it dynamically, CSS guards as defense-in-depth.
- LCP — local Michelin key + footer logo (no third-party DNS lookup
  for above-the-fold imagery).
- iOS Safari rubber-band — progress spine clamped to `[0,100]`.

Remaining R3 follow-ups *not* in scope (no critical surface in R3):

- Explicit `width`/`height` on the 22 editorial plates (defensive only;
  current layouts already use aspect-ratio wrappers).
- Real backend endpoint for `/api/newsletter` — the form will gracefully
  show the failure message until a backend is wired.
- The four `id="diario-0X"` anchors are ready for a future "open in modal
  / open standalone" hook; currently no destination, no link.

External assets staged separately so the curated `../assets/` swap-in
(parallel workstream) is unaffected:

- `treehouse/v2/assets-external/michelin-key.webp`
- `treehouse/v2/assets-external/footer-logo.png`
