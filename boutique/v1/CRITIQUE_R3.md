# CRITIQUE — R3 (Motion / Interactions / Polish / A11y / Edge Cases)
**Subject:** V1 Cinematic Immersive — Boutique by The Museo
**Focus:** Anything that moves, anything keyboard/SR users touch, anything that breaks at edges. Typography and copy are deliberately untouched (R1 + R2 handled those).

---

## 1. CRITICAL — `body { overflow: hidden }` is hard-coded inline; no-JS = page is unscrollable

- **What:** `index.html:23` — `<body style="overflow: hidden;">`. The intro overlay sequence in `main.js:21` clears it after `introHoldTime` (1200ms / 200ms reduced). If the JS file fails to load, throws on parse, or is blocked by an ad blocker / strict CSP, the entire page is locked at the hero.
- **Why it matters:** Progressive enhancement, P0. A luxury hotel page should remain *readable* even when the cinematic intro can't run. Right now, JS disabled = users see one screen and a cursor they can't control.
- **Fix:** Move the lock to a class that is opt-in by JS:
  ```html
  <body class="intro-locked">  <!-- no inline style -->
  ```
  ```css
  .intro-locked { overflow: hidden; }
  ```
  And in JS, add the class on load (so no-JS never gets it) and remove it in the dissolve handler. Bonus: wrap the intro overlay in a `<noscript>` style override that hides it entirely when JS is off.

---

## 2. CRITICAL — Cursor disappears over the hero (z-index inversion)

- **What:** `css/style.css:137` cursor is `z-index: 10000`. `css/style.css:489` `.hero-content { z-index: 100000 }`. Same for `.scroll-indicator { z-index: 100000 }` (line 639). The custom cursor is *under* the hero text, CTA buttons, and meta strip. Combined with `mix-blend-mode: difference`, the cursor renders behind opaque copy and looks like it has been swallowed.
- **Why it matters:** The custom cursor is the signature interaction of a Cinematic Immersive direction. Losing it over the most-trafficked area of the page (where the magnetic CTA lives) makes the whole motion system look broken.
- **Fix:** Drop hero/scroll-indicator z-indexes back to a sane band (e.g. `z-index: 5` / `z-index: 6` — they only need to stack above `.hero-overlay` at z-index 1 and `.hero-bg` at z-index 0). Keep cursor at `10000` so it floats above everything except the intro overlay (`99999`) and grain (`9997` — also under cursor, correct).

---

## 3. CRITICAL — Touch-laptop / iPad-with-trackpad orphans the cursor

- **What:** `css/style.css:68` sets `body { cursor: none }` globally. The mobile reset at `css/style.css:2042` re-enables `cursor: auto` only at `max-width: 768px`. The JS hides the custom cursor unless `(pointer: fine)` is true (`main.js:9`, `main.js:39`). An iPad in landscape (1024px+ width, `pointer: coarse`) hits **neither** branch — body still has `cursor: none`, JS won't show the custom cursor → user has no cursor at all, on either form of input.
- **Why it matters:** Real device gap. Affects iPad Pro, Surface in tablet mode, large Android tablets, touch-screen laptops with finger-only input.
- **Fix:** Gate the global `cursor: none` on a media query, not the inverse:
  ```css
  @media (pointer: fine) and (hover: hover) {
    body { cursor: none; }
    /* and move all `cursor: none` declarations under this same query */
  }
  ```
  This is the canonical pattern — only hide cursor where we know a fine pointer with hover exists.

---

## 4. CRITICAL — Hot-linked image URLs from boutiquebythemuseo.com

- **What:** ~14 image URLs in `index.html` (hero, sanctuary, breath, all four rooms, location, photo strip, voices, offers) point at `https://boutiquebythemuseo.com/wp-content/uploads/...`. Flagged as an open risk in the brief.
- **Why it matters:** The source WP install can change slugs, rotate uploads, block hot-linking via Referer policy, or just go down — any of which silently breaks the demo. Already-CRITICAL because there is no fallback / placeholder.
- **Fix:** Mirror the photography into `/v1/img/` (or a CDN bucket) and reference local paths. Until then, at minimum add `onerror="this.style.opacity=0; this.parentElement.style.background='var(--ink-soft)'"` or a `<picture>` with a tiny SVG placeholder fallback so a 404 doesn't render a broken-image icon over the cinematic dark theme.

---

## 5. MAJOR — Room cards are not keyboard-operable

- **What:** `index.html:170, 206, 242, 278` — `<article class="room-card" data-expandable>`. `main.js:285` attaches a click handler that toggles `.expanded`. No `tabindex`, no `role="button"`, no `keydown` handler. Reveal-on-hover means desktop keyboard users only see the summary + image, never the spec table or the reserve CTA.
- **Why it matters:** The room specs (size, bed, outlook) are decision-critical content. Hiding them behind a hover-only / touch-only gate excludes keyboard-only users (motor-impaired, screen reader, power users).
- **Fix:** The inner `<a href="#footer">Reserve N° 01 →</a>` is already focusable. Tie the expanded state to `:focus-within` so tabbing into the card opens the specs:
  ```css
  .room-card:hover .room-specs,
  .room-card:focus-within .room-specs,
  .room-card.expanded .room-specs { max-height: 240px; opacity: 1; }
  ```
  And mirror the same for `.room-card-overlay` and `.room-card-cta`. Drop the article click handler or convert each card into a proper disclosure (`<button aria-expanded>` wrapping the summary).

---

## 6. MAJOR — Decorative `aria-hidden` is hiding real content from screen readers

- **What:** `index.html:150` `<section class="section-breath" aria-hidden="true">` and `index.html:580` `<section class="section-interstitial" aria-hidden="true">`. Both sections contain prose pull-quotes that are part of the brand voice ("Some houses ask to be admired…" and "Un refugio en el corazón de cal."). The `aria-hidden` removes them entirely from the accessibility tree.
- **Why it matters:** Screen-reader users get a structurally choppy experience — they hear the Sanctuary section, then silence, then Rooms. The pull-quotes are doing real narrative work; the background image is decorative, not the quote.
- **Fix:** Move `aria-hidden` to only the `.breath-bg` / `.interstitial-bg` image wrappers (or just `alt=""` is already enough — drop the `aria-hidden` on the section element). Keep the surrounding `<section>` exposed.

---

## 7. MAJOR — Auto-rotating testimonials are not pausable, not announced, not focus-aware

- **What:** `main.js:270-282` starts a 6 s `setInterval` rotation. It clears only on dot click. There's no `pause on hover`, no `pause on focus-within`, no `aria-live` region, and the testimonial container has no `role="group"` / `aria-roledescription="carousel"`.
- **Why it matters:** WCAG 2.2.2 (Pause/Stop/Hide): any content that auto-updates for more than 5 s must be pausable. 6 s × 5 testimonials = 30 s loop. Also, sighted users mid-read get text yanked out from under them; screen-reader users hear nothing change.
- **Fix:**
  ```js
  const voices = document.querySelector('.section-voices');
  voices.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
  voices.addEventListener('focusin',   () => clearInterval(testimonialInterval));
  voices.addEventListener('mouseleave',() => testimonialInterval = setInterval(nextTestimonial, 6000));
  voices.addEventListener('focusout',  () => testimonialInterval = setInterval(nextTestimonial, 6000));
  ```
  Add `aria-live="polite"` to the testimonial container and `aria-roledescription="carousel"` to `.section-voices`. Also: add prev/next buttons (or arrow-key handling on the dots) for keyboard navigation.

---

## 8. MAJOR — Reserve form "success" message is silent to screen readers

- **What:** `main.js:319-334`. Submit handler swaps button text from "Write the house" → "Enquiry sent" via `submit.textContent = …`. No `aria-live` region, no role="status", no announcement.
- **Why it matters:** A blind user submits the form and gets no confirmation. The button text change alone is not announced because focus stays on the same node and `aria-live` polite is needed for non-focused content updates. Also: the form silently `preventDefault`s — there's no honest "this is decorative" affordance either.
- **Fix:** Add a sibling status element:
  ```html
  <p class="reserve-status" role="status" aria-live="polite"></p>
  ```
  Populate it with "Enquiry received — we will write back from the house." on submit. Bonus: add a short helper line under the form ("This is a preview. Real enquiries: reservations@…") so the demo doesn't quietly swallow a real attempted booking.

---

## 9. MAJOR — Marquee + photo strip never pause; no `prefers-reduced-motion` pause-on-hover

- **What:** `.art-marquee-track` and `.photo-strip-track` run infinite `linear` animations (`css/style.css:1186`, `css/style.css:1472`). Reduced-motion override correctly stops them entirely (`css/style.css:2005`). But for everyone else, there is **no `:hover` pause**, no touch-swipe support, no way to actually read a marquee item.
- **Why it matters:** WCAG 2.2.2 again — content that animates continuously for more than 5 s without a pause control is a violation. Also a UX gap: when a user wants to read "Cur. Treehouse / 2026" they can't.
- **Fix:**
  ```css
  .art-marquee:hover .art-marquee-track,
  .section-photo-strip:hover .photo-strip-track { animation-play-state: paused; }
  ```
  Plus a visually-hidden pause button per marquee for keyboard users, or wrap the whole pair in a single `<button class="motion-toggle">` somewhere on the page that toggles a `.motion-paused` class on `<body>`.

---

## 10. MAJOR — Smooth scroll runs twice (CSS + JS) and ignores fixed-nav offset

- **What:** `css/style.css:57` `html { scroll-behavior: smooth }` AND `main.js:307-317` calls `target.scrollIntoView({ behavior: 'smooth' })` on every in-page anchor. Both fire; the CSS handler is harmless but redundant. Worse, `.top-nav` is fixed at the top (~28px padding tall, 80px ish), so `scrollIntoView` lands the section title flush under the nav, partly occluded.
- **Why it matters:** When the user clicks "The Sanctuary" in the top nav, the eyebrow label gets covered by the nav background; reads as a layout bug.
- **Fix:** Drop the JS smooth-scroll call (CSS handles it) and add `scroll-margin-top` to all section targets:
  ```css
  [data-section], #rooms { scroll-margin-top: 90px; }
  @media (max-width: 768px) { [data-section], #rooms { scroll-margin-top: 64px; } }
  ```

---

## 11. MAJOR — `#hero` is the first nav target but the skip-link routes to `#sanctuary`

- **What:** `index.html:26` skip link → `#sanctuary`, bypassing the hero entirely. The hero contains the brand mark, tagline, primary "Reserve a key" CTA, and the only place where the keys/year/Palacio meta strip appears.
- **Why it matters:** Skip-link convention is "skip *past the navigation, into main content*." Sending users straight to section 2 means SR/keyboard users miss the hero CTA and the brand mark. They also miss the page H1 (`.hero-title`).
- **Fix:** Either: (a) re-target the skip link to `#hero` (the most likely main-content start since there's no nav above the hero), or (b) wrap the hero + everything below in `<main id="main">` and target that. Option (b) is the bigger fix (see Finding 14).

---

## 12. MINOR — Reduced-motion path still runs cursor-trail rAF loop and magnetic-button physics

- **What:** `main.js:49-56` starts `animateTrail()` unconditionally on `isFinePointer`. The trail eases toward the cursor (`* 0.12`) — that's smooth motion. Magnetic buttons at `main.js:83-98` are correctly gated on `!prefersReducedMotion`, but the cursor trail is not.
- **Why it matters:** "Reduce motion" users still see a circle elastically chasing their pointer.
- **Fix:** Either skip the trail entirely under reduced motion, or snap it (set `trailX = cursorX; trailY = cursorY` and skip the easing). Same one-liner gate as the magnetic buttons.

---

## 13. MINOR — Intro overlay isn't `aria-hidden` and traps the tab on slow networks

- **What:** `index.html:29` `<div class="intro-overlay" id="introOverlay">` sits at `z-index: 99999` with `pointer-events: none`. The intro-mark inside is `<span>`-only (no focusable content), but the overlay covers the page during the 1.2 s hold. Screen readers will read "Boutique Museo" and then potentially read the hero content underneath since the overlay is non-modal.
- **Why it matters:** On slow connections where the JS doesn't run for several seconds (intro never dissolves), the body still has `overflow: hidden` (Finding 1), and the overlay just sits there — but the hero text behind it is still in the a11y tree, so SR users hear the page they cannot scroll.
- **Fix:** Add `aria-hidden="true"` to the intro overlay (it's decorative). Pair with Finding 1's no-JS fix so the overlay is removed via `<noscript>` CSS.

---

## 14. MINOR — Missing `<main>` landmark; rooms-header is outside the rooms section

- **What:** No `<main>` element anywhere in the document. Also `index.html:162-166` `.rooms-header` is a sibling `<div>` *outside* `.section-rooms`, but `id="rooms"` is on the header div — so the section that has `data-section="rooms"` for scroll-spy has no `id`. The nav-dot click for "rooms" lands on the header div, which is correct visually but means the section itself is anonymously identified.
- **Why it matters:** Two minor things, one fix: (a) screen reader users get no "main content" landmark; (b) the header/section split means `#rooms` and `[data-section="rooms"]` are different elements — fragile if anyone refactors the scroll-spy to use `id` directly.
- **Fix:** Wrap the body of the page in `<main id="main">…</main>` (just before `</body>` close it). Move `id="rooms"` onto `.section-rooms` and let `.rooms-header` be a child of the section. The nav-dot scroll target stays the same.

---

## 15. MINOR — Hero title char animation re-flows once the serif font loads

- **What:** `initHeroTitle()` runs immediately on script execution (`main.js:16`), before `DM Serif Display` necessarily finishes loading. The per-char spans get their delays applied (`0.1 + i*0.05`s) and start animating in a fallback `serif`. When the webfont swaps, characters reflow / re-kern mid-animation.
- **Why it matters:** Visible glyph shift during the most cinematic moment of the page. The whole title trembles for one frame.
- **Fix:** Gate the split on font readiness:
  ```js
  if (document.fonts) {
    document.fonts.load('1em "DM Serif Display"').then(initHeroTitle);
  } else {
    initHeroTitle();
  }
  ```
  Or, simpler: delay the call to inside the `setTimeout(introHoldTime)` block — by 1.2 s the font is essentially always ready.

---

## 16. MINOR — Magnetic pull applied to the secondary text-link CTA

- **What:** `main.js:84` `'.magnetic-btn, .hero-cta a, .reserve-submit, .location-cta a'`. The selector `.hero-cta a` picks up *both* the primary "Reserve a key" button and the "Begin" `.hero-cta-secondary` text-with-underline link. The magnetic pull on a borderless underline link looks like the link is sliding around for no reason.
- **Why it matters:** Magnetic micro-motion is reserved (in the design language) for *buttons* — interactive surfaces with visible bounds. Applying it to a text link breaks the metaphor.
- **Fix:** Tighten the selector: `'.magnetic-btn, .hero-cta a:not(.hero-cta-secondary), .reserve-submit, .location-cta a'`.

---

## 17. MINOR — Parallax + per-frame transform with a `transition: transform 0.1s linear` fight each other

- **What:** `css/style.css:685` `.sanctuary-image-wrap img { transition: transform 0.1s linear, filter 0.6s ease }`. `main.js:228-240` sets `transform: translateY(...)` on every scroll frame. Each frame: new value queued, 100 ms transition starts, next frame interrupts. Net effect: slight lag between scroll position and image translate, especially on fast scroll.
- **Why it matters:** Perceived jank — the image feels like it's trying to catch up to the scroll. Also wastes paint cycles. Same pattern on `.location-image-wrap img` (line 1383) and `.art-hero-bg img` (line 1088).
- **Fix:** Remove the `transform` from the transition list — let the JS drive transform directly with no easing, and keep the filter transition:
  ```css
  .sanctuary-image-wrap img { transition: filter 0.6s ease; }
  ```
  Add `will-change: transform` on the same selector so the browser composites correctly. Apply the same change to the other two parallax targets.

---

## 18. MINOR — Photo-strip duplicate items still announce alt text

- **What:** `index.html:497-510` first 5 photo-strip items have meaningful `alt` text; `index.html:512-526` duplicate copies use `alt=""`. Good — except the section itself has `aria-label="House photography"` which sets up SR users to expect content, then they hear five named images that scroll past (the marquee isn't paused for SRs).
- **Why it matters:** The photos are decorative atmosphere, not informational. Naming them invites SR users to engage with content that has no real semantics.
- **Fix:** Either remove the `aria-label` on `.section-photo-strip` and `alt=""` all ten items (treat as purely decorative), or keep the alt text but add `aria-roledescription="image gallery"` and a pause button. The decorative-only path is simpler and matches intent.

---

## 19. NIT — Anchor `<a href="#">` on social icons scrolls the page to top

- **What:** `index.html:692-693` `<a href="#" aria-label="Instagram">IG</a>` and same for FB. With `href="#"`, clicking scrolls to top of page. The smooth-scroll handler at `main.js:307` short-circuits on `targetId === '#' || .length < 2`, so it `return`s — but the *default browser behavior* (scroll to top) still fires because `preventDefault` is only called inside the `if (target)` branch.
- **Why it matters:** Footer click silently scrolls user back to the hero. Surprising.
- **Fix:** In the anchor handler:
  ```js
  if (targetId === '#' || targetId.length < 2) { e.preventDefault(); return; }
  ```
  Better: give the social links real `href`s (`https://instagram.com/...`) or replace with `<button type="button">` if they're placeholders.

---

## 20. NIT — Unused / orphan: `.cursor-trail` and grain overlay both sit at very high z-indexes

- **What:** Grain overlay `z-index: 9997`, cursor trail `9999`, cursor `10000`, top-nav `8000`, nav-dots `9000`, scroll-to-top `8000`. The grain is at `mix-blend-mode: overlay` — visually fine — but it overlays the cursor trail mathematically (it's below 9999 so the trail blends with grain). Mostly harmless; flagging because once Finding 2 lowers other z-indexes, this stacking will be more visible.
- **Why it matters:** Edge case: if you ever animate the grain or want a deterministic compositing order, the current stack is brittle.
- **Fix:** Establish a z-index scale at the top of `:root`:
  ```css
  --z-bg: 0; --z-content: 5; --z-nav: 100; --z-fixed-ui: 1000;
  --z-grain: 9000; --z-cursor: 9500; --z-overlay: 9999;
  ```
  Replace numeric z-indexes with these tokens.

---

## 21. NIT — `scroll-line` and other decorative animations re-trigger after reduced-motion override

- **What:** The reduced-motion block at `css/style.css:1997` sets all animation/transition durations to `0.01ms !important`. Then individually overrides `.scroll-line { animation: none }` and removes marquee animations. But the hero per-char animation, `fadeUp` keyframes, etc. all run in `0.01ms`, which means everything in the hero pops on simultaneously without the per-char stagger. That's correct under reduced-motion intent, but it means **all** copy appears with no transition — including the meta strip and scroll-indicator, even though "fadeUp" with a 2.3 s delay was supposed to gate them. The 0.01ms duration removes the visual reveal but the *delay* remains.
- **Why it matters:** With reduced motion, the hero scroll indicator, meta strip, tagline, etc. would appear after their original delays — so users wait 2.3 s for the scroll cue, but it then appears instantly (no fade). That's a worse UX than instant-on.
- **Fix:** Add to the reduced-motion block:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-delay: 0s !important; transition-delay: 0s !important; }
    .hero-eyebrow, .hero-tagline, .hero-cta, .hero-meta, .scroll-indicator { opacity: 1; animation: none; }
    .hero-title .char { opacity: 1; transform: none; }
  }
  ```

---

## What's working (coda)

- **Color contrast after R1 fix** verified: `--fg-faint` at 0.55 alpha on ink ≈ 5.5:1; ochre on ink ≈ 6.6:1. AA-clean for both. The `--ochre-readable` variant is the right call.
- **`prefers-reduced-motion` global stripper** is correctly placed and catches marquees + reveals + scroll-line.
- **rAF-coalesced scroll handler** (`onScroll` + `ticking` flag, `main.js:348-362`) is the right pattern.
- **Preload hero image + font-display: swap** in Google Fonts URL — both correct.
- **`color-scheme: dark`** on form inputs (`css/style.css:1794`) handles the date picker chrome correctly in Chrome / Edge.
- **Skip link styling** (`css/style.css:115-126`) is visible on focus, well-contrasted, lands at the top.
- **Semantic `<article>` per room card** — correct choice (each room is independently meaningful content).
- **Magnetic button clamping** (`pullX = Math.max(-6, Math.min(6, …))`) prevents runaway motion — good engineering.

---

## Suggested fix priority

| Priority | Finding | Effort |
|---|---|---|
| Block ship | 1, 2, 3, 4 | M / S / S / M |
| Before launch | 5, 6, 7, 8, 9, 10, 11 | M each |
| Polish pass | 12 – 18 | S each |
| Backlog | 19 – 21 | S each |

Round 3 is the last round. Findings 1–4 (no-JS lock, cursor z-index, touch-laptop cursor, hot-linked images) are the four that *will* show up in a QA pass on real devices and are worth fixing tonight.
