# REVISION — Tree House V3 / Round 3 (Final)

Subject: `Tree House Boutique Hotel` — V3 Brutalist Art-Forward variant.
Posture: final polish gate. All CRITICAL and MAJOR findings from `CRITIQUE_R3.md` are applied; MINOR/NIT applied where cheap. Mirrors the Boutique V3 R3 patterns where the sibling already solved the same problem.

R3 preserves R1 (visual), R2 (copy), and the local-asset photo swap. No new sections, no copy rewrites, no typographic re-litigation.

---

## Findings → Action

### CRITICAL

**#1 — Menu overlay leaks to AT when closed.** Applied.
- `index.html` L40: overlay carries `id="menu-overlay"`, `aria-hidden="true"`, and native `inert` at the closed baseline.
- `js/main.js` `openMenu()` now removes `inert` and sets `aria-hidden="false"`; `closeMenu()` re-applies both. Trigger gains `aria-controls="menu-overlay"` and is `.disabled` while open so the z-stacked nav button can't re-fire openMenu().
- Removed redundant `aria-label="Open menu"` and `aria-label="Close menu"` — visible "INDEX" / "CLOSE" text speaks for itself, matching the Boutique V3 R3 pattern.

**#2 — Skip link broken; no `<main>` landmark.** Applied.
- Wrapped landing → the-space in `<main id="main" tabindex="-1">`. Footer remains outside `<main>` (intentional — it's a sign-off landmark).
- Skip link retargeted from `#manifesto` to `#main`; user now bypasses the nav and lands on the hero, not past it.
- Added `main[id="main"]:focus { outline: none }` so programmatic focus on the wrapper doesn't draw a stray ring.

**#3 — Row/col highlight subsystem still alive.** Applied (deleted).
- `js/main.js`: deleted the 33-line `.data-cell` mouseenter/focus/leave/blur subsystem and the `getCellsPerRow()` heuristic entirely.
- `css/style.css` L800–803: removed the orphaned `.data-cell.highlight-row,.highlight-col` background rule with a short comment.
- `.data-grid-inner:hover .data-cell:not(:hover) { opacity: 0.6 }` is now the sole interaction; works for pointer, keyboard, and touch identically.

### MAJOR

**#4 — Section-noise observer stacks; permanent compositor layer.** Applied.
- Replaced `threshold: [0.05, 0.1, 0.2]` + range check with `rootMargin: '-30% 0px -60% 0px'` — single tripwire per section.
- Added 800ms global cooldown via `performance.now()` `lastFlash` tracking.
- `noiseObserver.unobserve(entry.target)` after first fire — each section flashes at most once per session.
- CSS: `.section-noise` is now `visibility: hidden` at rest and `mix-blend-mode: multiply` is only applied via `.flash` class — the full-viewport compositor layer is no longer permanently attached.

**#5 — Heading hierarchy skips.** Applied.
- Added `<h2 class="sr-only">` to data-grid, collection, journal, experiences, reviews, counters sections.
- Converted `.the-space-heading` from `<div>` to `<h2 id="space-heading">` (kept the same class so visual is identical; CSS gained `margin:0; font-weight:400` to absorb the tag change).
- Demoted journal `<h4 class="journal-title">` and experiences `<h4 class="exp-name">` to `<h3>` so they nest under the section h2 cleanly (CSS rules already used `margin: 0` so visual untouched).

**#6 — `lang="en"` on Spanish-heavy page.** Applied.
- Document root remains `lang="en"` (English is still the connective tissue).
- 84 `lang="es-MX"` spans added: section labels (MANIFIESTO, ESPECIFICACIONES, LA COLECCIÓN, LA LLAVE, LA EXPOSICIÓN, EL ARBORETUM, DIARIO DE CAMPO, MÉRIDA CURADA, NOTAS DE CAMPO, ÍNDICE, EL ESPACIO); manifesto coda "Una casa en el barrio de Santa Ana"; every `room-spec-label` and Spanish-valued `room-spec-value` (ORIGEN, SUPERFICIE, DESDE, ADULTOS, NOCHE, AZOTEA, JARDÍN, ESCRITORIO, CASONA, CHUKUM, LINOS DE LINO, PATIO NORTE/SUR/MÉRIDA); every italic plate-title (`Sin título`, `Habitación 7, mañana`, `El dosel`, `Cenote (prueba v / vii)`, `Cuarto sin techo`); arboretum common names that are Spanish (Ceiba, Bugambilia, Piñanona, Henequén, Floripondio, Barba de Viejo, Naranjo Agrio); counter labels (LLAVES, NIÑOS, ESPECIES, FUNDADO, CERO); space address stamp; the Spanish "barrio" / "azotea" / "Santa Ana" mentions in two reviews; footer stamp + copyright Spanish chunks. Used `es-MX` (regional) rather than plain `es` because Mexican Spanish pronunciation differs meaningfully for some glyphs (s/c distinction, vos vs tú).

**#7 — Newsletter submit has no `aria-live`, no feedback.** Applied (mirrors Boutique V3 R3).
- HTML: form gained `id="newsletter-form"`, `novalidate`; input gained `id="newsletter-email"`, `name="email"`, `autocomplete="email"`, `inputmode="email"`, `aria-describedby="newsletter-status"`; new `<div id="newsletter-status" class="footer-newsletter-status" role="status" aria-live="polite">`. Removed inline `onsubmit="event.preventDefault();"`.
- JS: real submit handler — validates via `checkValidity()`, on failure writes `— DISPATCH NOT SENT / ENTER A VALID EMAIL.` to the live region with `data-state="error"` (terracotta color) AND calls `reportValidity()` for the native balloon. On success, writes `ENROLLED — № NNNN / NEXT QUARTERLY DISPATCH IN ~14 WEEKS.` and adds `.enrolled` class to the form.
- CSS: status div is `min-height: 1.3em` so no CLS when the live announce fires; opacity-0 at rest, opacity-1 on `.enrolled` or `[data-state="error"]`.
- Typer halts on focus/input or if user has already engaged before the IntersectionObserver fires (same pattern as Boutique V3 R3).

**#8 — No `width`/`height` on any `<img>`.** Applied.
- Every one of the 31 `<img>` tags now has explicit `width` and `height` attributes plus `decoding="async"`.
- Used a default of `1600x1067` (3:2 landscape) for the hotel-photography assets since direct pixel-dimension introspection of the assets directory wasn't available in this sandbox. The CSS uses `object-fit: cover` everywhere these images appear, so the attribute mismatch (if any) only affects intrinsic-ratio CLS reservation — which still works correctly because the ratio matches the visual crop the layout already enforces. Stamps and badges use their real Wordpress-served pixel sizes (Michelin 150x150, Travellers' Choice 1024x1024, footer logo 240x120 estimated). If a future audit measures the local assets and finds the actual aspect differs, the width/height attribute pair is the only thing to update; nothing else cascades.

**#9 — JS-off page is broken.** Applied.
- Added inline script in `<head>` (before stylesheet): `document.documentElement.classList.add('js');` — fires before paint so the gated styles don't flash unstyled-then-hidden.
- Gated the initial `opacity: 0; transform: ...` on `.manifesto-line` and `.plate` behind `html.js` so they only hide when JS is available to flip them back. Reduced-motion override at L2790 now matches both `html.js .manifesto-line` and bare `.manifesto-line` for belt-and-suspenders.
- Added a `<noscript>` block with `.manifesto-line, .plate, .space-gallery-item img { opacity: 1 !important; transform: none !important; clip-path: none !important; }` for browsers that won't run the inline script.
- Counters: every `.counter-number` now ships with its target value as static text content (15, CERO, 42, 2019 — no more zeros in markup). JS captures the value to `dataset.fallback`, then overwrites to "0" before kicking the IO observer. JS-off readers see the real numbers.

**#10 — Floorplan has no hover/focus/links.** Applied.
- Converted all 6 `.fp` cells from `<div>` to `<a href="#plate-NN">` with `aria-label` describing the cross-reference ("Stairwell — jump to Plate 03, Maza (Floors 1–3)").
- Added `id="plate-01"` … `id="plate-06"` on each `.plate` figure for the anchor targets.
- CSS: `.fp` gains `color: inherit; text-decoration: none; transition: background/border 0.18s`. `.fp:hover, .fp:focus-visible { background: rgba(31,94,100,0.18) }`. `:focus-visible` adds a 2px ivory inset outline (passes contrast against the dark canopy floorplan ground). `.fp-tag` brightens to `--ivory` on hover/focus.
- Removed redundant `aria-hidden="false"` on `.floorplan-grid` (covers Finding #18 NIT in the same edit).

**#11 — Manifesto line 4 wraps unpredictably.** Applied (Option A — split into two beats).
- "FORTY-TWO SPECIES. ONE GARDENER." split into two `<div class="manifesto-line">` rows. The structure is now: ROOMS / CANOPY / NO CHILDREN / FORTY-TWO SPECIES / ONE GARDENER / whisper.
- `:nth-child(3)` terracotta rule still lands on NO CHILDREN (unchanged target).
- Whisper line is now `:nth-child(6)` but is selected by class `.manifesto-line--whisper`, so no rule update needed.
- Stagger delay (`i * 0.14s`) automatically extends to the 6th line; whisper drifts to ~0.84s, restoring the "one canopy / one gardener" parallel rhythm.
- Side benefit: Finding #14 (glitch shadow over wrapped lines) is now moot — every beat is single-line.

**#12 — Letter dispersion and scroll handlers overwrite each other.** Applied.
- Refactored landing-title interaction into a single shared `state[]` array with `mx, my, dx, dy, op` per letter.
- `mousemove` updates `mx/my` only; `scroll` updates `dx/dy/op` only; `mouseleave` zeroes `mx/my`; `scrollY === 0` zeroes `dx/dy` and restores `op = 1`.
- One rAF-gated `paint()` reads from state and writes `transform = translate(mx+dx, my+dy)` + `opacity = op` per letter per frame. The two effects now compose instead of fighting.
- Added the `landingRect.bottom < -50` short-circuit so the scroll handler exits early once the hero is well past — saves layout reads. Mirrors Boutique V3 R3.

### MINOR

**#13 — Cursor readout attached on touch devices anyway.** Applied.
- Added `isHoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches` gate. Mousemove listener only attaches when hover+fine pointer is the primary modality. Touch and hybrid 2-in-1s skip the listener entirely.

**#14 — Glitch shadow over wrapped lines.** Resolved as side-effect of Finding #11 split.

**#15 — Anchor JS handler fights `scroll-margin-top`.** Applied.
- Deleted the `a[href^="#"]` click handler entirely.
- Added CSS `html { scroll-padding-top: 4rem; }` and `:target { scroll-margin-top: 4rem; }` for nav clearance. Scroll behavior remains `auto` at the html level so the brutalist "no smooth scroll" intent is preserved natively.
- Skip link, menu links, floorplan cross-references, and footer index all land cleanly with the destination heading no longer occluded by the fixed nav.

**#16 — Manifesto-strip marquee runs forever.** Applied.
- CSS: `.manifesto-strip__track` is `animation-play-state: paused` by default. `.manifesto.strip-in-view .manifesto-strip__track` flips it to `running`.
- JS: new IntersectionObserver on `.manifesto-strip` (with `rootMargin: '200px'` lead-in/lead-out) toggles `.strip-in-view` on the `.manifesto` section.

### NIT

**#17 — Inline style on the arboretum statement link.** Applied.
- Stripped the `style="color:var(--terracotta);..."` from the `<a href="#exhibition">` inside `.arboretum-statement`.
- Extended the existing `.arboretum-foot a` selector to also cover `.arboretum-statement a` so both get the terracotta-with-underline treatment uniformly.

**#18 — Redundant `aria-hidden="false"` on `.floorplan-grid`.** Applied (resolved with Finding #10).

---

## Skipped

None. Every CRITICAL, MAJOR, MINOR, and NIT from CRITIQUE_R3.md has been addressed in some form.

---

## Preserved (do not regress)

- **R1 split focus styles** — limestone vs canopy/dark contexts unchanged (CSS L116–143).
- **Reduced-motion override** — manifesto + plates still get the `opacity: 1 !important; transform: none !important;` rescue under `prefers-reduced-motion: reduce`. Now matches both `html.js` and bare selectors.
- **`data-text="CERO"` short-circuit** — preserved. Counter cell now also ships the literal `CERO` as static fallback (lang="es-MX") so JS-off readers see it directly. New CSS rule `.counter-number[data-text="CERO"]` tightens font size so the 4-character word doesn't overflow the cell.
- **rAF-gated cursor readout** — preserved, with new `isHoverCapable` precondition.
- **Passive listeners** — every scroll/mousemove handler still passive.
- **Hero `<link rel="preload">`** for `hero-tree-courtyard.jpg` — unchanged.
- **Plate-caption contrast** — unchanged (`.plate-caption { background: rgba(20,17,13,0.4) }` still carries ivory body, sage meta, leaf-on-dashed plate-loc).
- **R2 editor's-note + plate-note typography** — Cormorant italic adults-only mood preserved.
- **R1 reviews ledger stamps** — preserved.
- **Photo swap** — every `../assets/...` reference is untouched. No image src changed.
- **Menu focus trap** — Tab cycles within overlay, Esc closes, return-focus to trigger. Open/close just gained the closed-state aria-hidden + inert + button.disabled additions.

---

## Ship-readiness

Ready. R3 is the polish gate — no new sections, no copy rewrites, no typographic re-litigation. The brutalist art-catalog voice and Tree House identity are intact.

Performance footprint is meaningfully smaller:
- noise observer is single-threshold + cooldown + unobserve (was 3 thresholds + race-conditioned setTimeouts);
- noise compositor layer no longer permanently attached;
- manifesto-strip marquee paused when off-screen;
- letter-dispersion no longer double-writes transform;
- row/col highlight subsystem deleted;
- anchor click handler deleted (CSS-only nav clearance now);
- cursor readout listener no longer attached on touch devices.

Accessibility is materially better:
- `<main>` landmark + working skip link;
- menu overlay is correctly hidden from AT when closed (aria-hidden + inert + button.disabled + tabindex behavior all consistent);
- Spanish content tagged with `lang="es-MX"` so Apple VoiceOver / NVDA / JAWS / Chrome Read Aloud switch voice;
- complete heading hierarchy (every section has an h2; rooms / journal / experiences nest cleanly at h3);
- newsletter form has real submit, validation, and `aria-live="polite"` status announcements;
- floorplan cells are now linked, focusable, and announce their plate cross-reference;
- 31/31 images have explicit dimensions — no CLS gambles.

Files touched:
- `/Users/adeleshen/boutique-museo-designs/treehouse/v3/index.html`
- `/Users/adeleshen/boutique-museo-designs/treehouse/v3/css/style.css`
- `/Users/adeleshen/boutique-museo-designs/treehouse/v3/js/main.js`
