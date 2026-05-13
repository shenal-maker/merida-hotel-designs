# REVISION — R3 (Motion / Interactions / Polish / A11y / Edge Cases)
**Subject:** V1 Cinematic Immersive — Boutique by The Museo
**Round:** 3 (final)
**Source critique:** `CRITIQUE_R3.md` — 4 CRITICAL, 17 MAJOR/MINOR/NIT

---

## CRITICAL — all 4 applied

### 1. No-JS lock removed
- Removed inline `<body style="overflow: hidden;">`.
- JS now adds `body.intro-locked { overflow: hidden }` at script start, removes it when the overlay dissolves.
- Added `<noscript>` style block in `<head>` that hides the intro overlay entirely when JS is off, plus restores `overflow: auto`, native cursor, and forces all `.reveal` / `.hero-*` opacity-0 animations to `opacity: 1` — every section is reachable and readable without JS.
- Net: page works at three states — JS on (cinematic), JS slow (intro overlay holds briefly, then dissolves), JS off (immediate, static, fully scrollable).

### 2. Cursor z-index inversion fixed
- `.cursor` raised to `z-index: 999999`, `.cursor-trail` to `999998` (above grain at 9997 and intro overlay at 99999).
- `.hero-content` dropped from `100000` → `5`. `.scroll-indicator` dropped from `100000` → `6`. Stacks above `.hero-overlay` (z-1) and `.hero-bg` (z-0) — correct stacking band per critique's recommendation.
- `mix-blend-mode: difference` cursor now floats correctly above hero text and primary CTA.

### 3. Touch-laptop / iPad cursor orphan fixed
- `body { cursor: none }` removed as a global declaration and re-scoped:
  ```css
  @media (pointer: fine) and (hover: hover) {
    body { cursor: none; }
  }
  ```
- JS reads `(pointer: fine)` and `(hover: hover)` and, if either is false, adds `body.coarse-pointer` which forces `cursor: auto` (and `pointer` on interactives) with `!important`, plus hides the custom cursor elements entirely.
- Covers iPad landscape (1024+ width, coarse pointer), Surface in tablet mode, touchscreen laptops, and any future hybrid surface.

### 4. Hot-linked images mirrored locally
- All 11 unique `boutiquebythemuseo.com` URLs downloaded to `/v1/assets/`:
  - `hero.jpg` (228 KB) — hero + voices background
  - `sanctuary-corridor.jpg` (137 KB) — Sanctuary panel
  - `breath.jpg` (220 KB) — Breath pull-quote bg
  - `room-deluxe.webp` (342 KB) — Room 01
  - `room-suite.jpg` (148 KB) — Room 02 + offers bg
  - `room-grand.jpg` (233 KB) — Room 03
  - `room-penthouse.jpg` (813 KB) — Room 04
  - `location.png` (88 KB) — Location panel
  - `photo-1.png` / `photo-2.png` / `photo-3.png` — photo strip
- HTML references all updated to `assets/...` paths. `<link rel="preload">` also updated.
- Three remaining `images.unsplash.com` URLs in the Art section get `onerror` fallbacks that swap to a gradient placeholder (decision: Unsplash is a CDN with documented uptime; downloading them would more than double the demo's disk footprint without proportionate risk reduction).

---

## MAJOR / MINOR — applied

| # | Finding | Resolution |
|---|---|---|
| 5 | Room cards not keyboard-operable | Added `:focus-within` selectors to `.room-card-bg img`, `.room-card-overlay`, `.room-specs`, `.room-card-cta` — tabbing into the inner Reserve link now opens the spec table identically to hover. Click handler kept for touch. |
| 6 | `aria-hidden` on `.section-breath` + `.section-interstitial` hides real prose | Removed `aria-hidden="true"` from both `<section>` elements. Moved the attribute onto the decorative `.breath-bg` / `.interstitial-bg` image wrappers instead. Restructured each block as `<blockquote>...<cite>` for proper semantics. Added `aria-label` on the sections so SR users get a section label. |
| 7 | Auto-rotating testimonials not pausable / not announced | Carousel now: pauses on `mouseenter` + `focusin` on `.section-voices`; resumes on leave; gets prev / next arrow buttons (`.testimonial-arrow`); supports left/right arrow keys on dots (tablist convention with `aria-selected`); `voices-content` is `aria-live="polite"` + `aria-atomic="true"`; section is `aria-roledescription="carousel"`. |
| 8 | Reserve form success silent to SR | Added `<p class="reserve-status" role="status" aria-live="polite">` sibling. JS populates it with "Enquiry received — we will write back from the house." on submit. Also added a `.reserve-helper` line below the form so users know it's a preview — won't quietly swallow a real booking attempt. |
| 9 | Marquee + photo strip never pause | Added `.art-marquee:hover .art-marquee-track { animation-play-state: paused }` and the same for `.section-photo-strip:hover .photo-strip-track`. Also added `:focus-within` variants. `prefers-reduced-motion` already kills the animation entirely (was correct in R2). |
| 10 | Smooth scroll runs twice + ignores fixed-nav offset | Removed JS `scrollIntoView` from the in-page anchor handler — CSS `scroll-behavior: smooth` handles it. Added `scroll-margin-top: 96px` (64px mobile) to `[data-section]`, `#rooms`, and `#main`. Nav-dot clicks still use JS `scrollIntoView` (they need to work even when target lacks an `id`-based anchor), but now respect the same offset. |
| 11 | Skip link bypasses hero | Skip link retargeted from `#sanctuary` → `#main` (the new `<main>` landmark wrapping everything from hero down). Users now land at the page H1. |
| 12 | Reduced-motion still runs cursor trail | Trail animation `rAF` loop is now gated on `!prefersReducedMotion`. Under reduced motion the trail snaps directly to cursor position with no easing. Magnetic buttons were already gated. |
| 13 | Intro overlay not `aria-hidden` | Added `aria-hidden="true"` to `#introOverlay`, `.grain-overlay`, `.cursor`, `.cursor-trail`, `.progress-bar`, and the decorative `aria-hidden="true"` `.scroll-indicator`. |
| 14 | No `<main>` landmark; `#rooms` on wrong element | Wrapped page content in `<main id="main">`. Restructured rooms into `<section class="section-rooms-wrap" id="rooms" data-section="rooms">` with `.rooms-header` and `.section-rooms` (the grid) as children. Skip-link and `#rooms` anchor now both land on a semantically correct element. |
| 15 | Hero char-split runs before serif loads | `initHeroTitle()` now gated on `document.fonts.load('1em "DM Serif Display"').then(initHeroTitle)` with fallback. No mid-animation glyph reflow. |
| 16 | Magnetic pull applied to secondary text link | Selector tightened to `.magnetic-btn, .hero-cta a:not(.hero-cta-secondary), .reserve-submit, .location-cta a`. The borderless underline link no longer slides. |
| 17 | Parallax fighting `transition: transform 0.1s linear` | Removed `transform` from the transition list on `.sanctuary-image-wrap img`, `.art-hero-bg img`, `.location-image-wrap img`. Added `will-change: transform` on the same three. JS now drives transforms directly with no easing fight; filter transitions preserved. |
| 18 | Photo strip alt text invites SR engagement on decorative content | Section now `aria-hidden="true"` (decorative atmosphere). All photo-strip item `alt=""` was already in place; removed `aria-label="House photography"` from the section. |
| 19 | Social `<a href="#">` scrolls to top | Replaced with real `https://instagram.com/` + `https://facebook.com/` `target="_blank" rel="noopener"` anchors. Anchor handler also now `preventDefault`s any remaining `#` / single-char hrefs. |
| 20 | Z-index scale not tokenized | Decision: deferred. The cursor / overlay band is now correctly ordered (cursor 999999 > intro 99999 > grain 9997 > nav-dots 9000 > top-nav 8000). Tokenizing was a polish suggestion; doing it now would touch dozens of selectors without changing observable behavior. Flagged in backlog. |
| 21 | Reduced-motion strips durations but not delays | Added `animation-delay: 0s !important; transition-delay: 0s !important;` to the reduced-motion `*` rule. Also explicitly: `.hero-eyebrow`, `.hero-tagline`, `.hero-cta`, `.hero-meta`, `.scroll-indicator` `opacity: 1`, `animation: none`; `.hero-title .char` `opacity: 1`, `transform: none`. Origin-divider and accent-line forced to their visible state. No more delayed-then-instant-appear UX glitch. |

---

## Skipped / deferred

- **Finding 20** (tokenize z-index scale) — cosmetic refactor only; deferred. The bug it would have prevented (cursor below hero text) is solved by the explicit z-index lift in Finding 2.
- **`role="button" + aria-expanded"` on room cards** — the critique suggested either `:focus-within` or proper disclosure pattern. Picked `:focus-within` (Finding 5) since the inner `<a href="#footer">` is already focusable and announceable; converting the article to a `<button>` would break the article's semantic value and complicate the click-vs-link interaction. Documented trade-off.
- **Unsplash images** in art section — not downloaded locally; gradient `onerror` fallback added. Different risk profile than WordPress upload URLs (CDN vs. mutable WP slugs).

---

## Now ship-ready

- **No-JS path:** every section reachable, all text visible, all hero animations resolved to their final state, intro overlay never shown. Cursor stays native.
- **Touch/coarse-pointer path:** native cursor restored on iPad landscape, Surface tablet mode, touch laptops. Verified path: `(pointer: fine) and (hover: hover)` gates the custom cursor in CSS; JS double-checks and adds `.coarse-pointer` to body for the not-fine-or-not-hover case.
- **Keyboard path:** skip-link → `<main>`; tab through hero CTAs → into Sanctuary reveals → into room cards (focusing inner Reserve link expands the card via `:focus-within`) → through curated cards → into the art section CTA + figures → location + maps → through testimonial controls with arrow keys → into reserve form → through footer columns + social links.
- **Screen-reader path:** `<main>` landmark; pull-quote sections (breath, interstitial) now have `<blockquote><cite>` structure and `aria-label`; carousel is announced via `aria-live="polite"` with `aria-roledescription="carousel"`; form success spoken via `role="status"`; marquees and photo strip stay decorative (`aria-hidden`).
- **Reduced-motion path:** scroll-behavior auto; all delays zeroed; hero hits final state instantly; trail snaps without easing; carousel does not auto-rotate (already correct from R2 baseline); marquees + photo strip frozen.
- **Hot-link path:** 11 local assets, no external WordPress dependency for the photography. Three Unsplash references retain `onerror` gradient fallback.

---

## File changes

- `index.html` — overflow lock removed; `<noscript>` injected; `<main>` wrapper; rooms restructured; intro/grain/cursor `aria-hidden`; skip-link retargeted; section-breath / section-interstitial restructured to blockquote/cite; voices section restructured (arrows + aria-live + roledescription); reserve-status + reserve-helper added; photo-strip aria-hidden; social links given real `href`s; all WP-uploads URLs replaced with `assets/...`.
- `css/style.css` — body cursor scoped under `@media (pointer: fine) and (hover: hover)`; `body.coarse-pointer` override added; `body.intro-locked` class added; cursor / cursor-trail z-index lifted; hero-content / scroll-indicator z-index dropped; parallax `transition: transform` removed; `:focus-within` paths added to room cards; marquee + photo-strip hover-pause; reduced-motion block expanded (delays zeroed, hero forced to final state); `.testimonial-controls` + arrow styles added; `.reserve-status` + `.reserve-helper` styles added; `scroll-margin-top` tokens for nav-offset; redundant mobile cursor reset cleaned up.
- `js/main.js` — JS-only `intro-locked` class lock; coarse-pointer class detection; cursor + magnetic gates require `isFinePointer && hasHover`; `initHeroTitle` gated on `document.fonts.load`; magnetic selector excludes `.hero-cta-secondary`; carousel rewritten with pause-on-hover / pause-on-focus / prev / next / arrow-key dots / aria-selected state; in-page anchor handler no longer JS-scrolls (CSS handles smoothness + offset) but does `preventDefault` on bare `#`; reservation form populates `.reserve-status`; reduced-motion gates cursor-trail rAF loop.
- `assets/` — 11 new local image files (~2.5 MB total).
