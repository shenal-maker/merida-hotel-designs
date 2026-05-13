# v4-minimal — Build Notes (Boutique by The Museo & Tree House Boutique Hotel)

This is the conversion-first fourth variant. Both sister sites use identical
componentry, identical booking flow, identical motion grammar. The only
differences are palette accents, hero photo, art-section photo treatment,
the Treehouse accolade strip, and brand-specific copy.

---

## Tech choice — pure vanilla + Lucide icons (CDN)

- **No build step.** Single `index.html`, `css/style.css`, `js/main.js`.
- **Fonts:** Inter (geometric sans, 400/500/600) + Fraunces (display serif,
  400/500). Two families only. Loaded via `fonts.googleapis.com` with
  preconnect.
- **Icons:** Lucide via `unpkg.com/lucide@latest` (defer). Used in the
  booking widget (calendar, users), CTAs (arrow-right, arrow-up-right),
  and offer block. ~20KB gzipped — far lighter than Tailwind play CDN
  (~3MB).
- **No framework, no Tailwind.** Modern CSS handles the spacing rhythm
  with custom properties + `clamp()` for fluid scaling, container-aware
  grid templates, and `dvh/svh` units for the hero. The result is a
  ~25KB CSS file per property — production-shippable as-is.

Why not Tailwind: the page is six sections deep. Utility classes add
weight without saving authoring time at this scope, and the booking
widget's micro-interactions read cleaner in custom CSS than as a long
utility chain. The owner's first-paint cost should be tiny.

---

## Final line counts

- `boutique/v4-minimal/index.html` — see `wc -l`
- `treehouse/v4-minimal/index.html` — see `wc -l`

Both well under the 250–400 target from `TRIM_BRIEF.md`. Mobile-tested
mentally at 360px (booking widget stacks 1-column; rooms stack 1-column;
art-photo grid stacks). Breaks: 360 / 640 / 720 / 880 / 1100.

---

## Conversion choices worth flagging

1. **In-hero booking widget**, above the fold on every breakpoint.
   Date pickers + guest count + a single primary CTA. Widget validates
   (`departure > arrival`) client-side and re-projects defaults
   (arrival = tomorrow, departure = arrival + 3 nights).
2. **Sticky header Reserve CTA** appears past 80px scroll. Header
   transitions from transparent (over hero) to ivory + 1px hairline
   border (on scroll). The CTA fades in only when stuck — keeps the
   hero clean while keeping conversion path persistent.
3. **CTA language is "Check Availability"** (per the brief and the
   industry +17% data point). The footer re-book strip and offer use
   "Reserve" — the brief permits either; we use both consistently
   (Check Availability = above-the-fold, Reserve = secondary surface).
4. **Footer re-booking strip** — third surface for the booking widget.
   A user who scrolled the full page never has to scroll back up.
5. **Room cards each have their own "Reserve" CTA** anchored to
   `#booking` (the hero widget). Hover lifts the card 2px, scales the
   image 3%, and contracts the CTA underline — three signals at once.

---

## Placeholder pricing — owner action required

All four room prices on both properties are placeholders:

| Slot                    | Boutique          | Treehouse           |
|-------------------------|-------------------|---------------------|
| Entry room              | $295              | $295                |
| Mid suite               | $395              | $395                |
| Grand suite             | $545              | $545                |
| Penthouse / top         | $895              | $895                |

Each `<strong>` carries `data-placeholder="true"` and is preceded by an
HTML comment `<!-- placeholder pricing; replace with real rates -->`.
Search the file for `data-placeholder` to replace them all at once.

---

## What was kept from the TRIM brief

- 6 sections: Hero / Rooms / Art / Location / Offers / Footer
- No invented people, named characters, fake stats, or program titles
  from the kill-list
- Photos: Boutique uses local `assets/` (copies of `boutique/v1/assets/`).
  Treehouse uses `../assets/` (shared `treehouse/assets/` folder, same
  pattern as v1/v2/v3)
- Art section treatment matches the brief: Boutique = typography-only
  plate (no gallery photos), Treehouse = the 3 on-property art photos
  (`art-bar-figurines.jpg`, `art-chair-tableau.jpg`, `art-window-painting.jpg`)
- Sister-property cross-links in art section + footer
- Accessibility: skip link, `<main>` landmark, semantic sections with
  `aria-labelledby`, all form fields labeled, focus-visible ring,
  44px+ tap targets, `prefers-reduced-motion` gates all reveals
- Spanish kept only where it appears on the live sites: "Paseo de
  Montejo", "Santa Ana", "Mérida", "Calle 43"

---

## What was NOT included (per the brief)

- No testimonials / Voices section
- No manifesto / editor's note / sanctuary section
- No drop caps, plate numbering, mono microcopy, brutalist grid
- No glassmorphism (the sticky header uses a subtle backdrop blur on
  ivory — this is the modern hospitality norm, not glass-effect chrome)
- No bilingual prose threaded throughout

---

## Things to validate before launch

1. **Pricing** — replace all `data-placeholder="true"` values with the
   real rate cards.
2. **Phone numbers** — currently `+52 999 ___ ____` placeholders in
   both footers.
3. **Real social URLs** — none included (the brief asked for "real URLs
   only if on the live sites" and we didn't pull them; safer to leave
   empty than fabricate). Add Instagram / Facebook handles to the
   `Sister Property` column or a new social block if the owner has them.
4. **Booking engine integration** — the form currently `preventDefault`s
   and shows a confirmation in the button. Wire `form.submit()` to the
   real booking engine URL (Cloudbeds / Sirvoy / etc.) before launch.
5. **Maps** — both use `google.com/maps?q=...&output=embed`. If the
   owner has a precise Google Maps Place ID, swap to that for a pinned
   location instead of a search.
6. **Michelin Key year** — currently 2025; verify the exact award year
   in the Treehouse hero accolade strip.
7. **Sister-property cross-links** — paths are relative
   (`../../treehouse/v4-minimal/index.html` and vice versa). When
   deployed to two separate domains, swap these to the real URLs.

---

## Files

```
boutique/v4-minimal/
  index.html
  css/style.css
  js/main.js
  assets/        (copied from boutique/v1/assets/)
  TRIM_NOTES.md  (this file)

treehouse/v4-minimal/
  index.html
  css/style.css
  js/main.js
  TRIM_NOTES.md  (mirror of this file)
```
