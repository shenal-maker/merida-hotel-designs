# Conversion Polish Brief — V1 / V2 / V3 (shared)

The artistic variants (Cinematic / Editorial / Brutalist) look distinct but don't make booking *legible*. Owner can't tell what room is what or what it costs. Fix that without flattening the visual character.

V4 Minimal already solved this with a generic booking widget. V1/V2/V3 need the **same conversion clarity** translated into each variant's voice.

---

## What every variant needs

1. **A booking widget in the hero** (arrival date · departure date · guests · Reserve CTA). NOT a generic component — styled to the variant's register.
2. **Visible price on every room card.** Placeholder USD, flagged `data-placeholder="true"`.
3. **Visible specs on every room card.** Sleeps · m² · view, in a register matching the variant.
4. **Sticky Reserve in the header** that scrolls users to the booking widget. (Already present from R3 — verify it points at `#booking`.)
5. **Each room's Reserve CTA jumps to `#booking` and prefills the room.** Use a `data-room` attribute + small JS handler that scrolls to the widget and sets the guest count + a hidden `room` field to the chosen room type.
6. **Date input behavior**: arrival defaults to tomorrow; departure defaults to arrival + 3 nights; departure auto-shifts forward if arrival changes past it; both inputs have `min` clamps. Same JS pattern V4 uses — port it.

## Placeholder pricing (use these — flag as placeholder)

**Boutique by The Museo** (USD/night, from):
- Deluxe Boutique Room — $295
- Deluxe Boutique Suite — $395
- Grand Boutique Suite — $545
- Penthouse Suite — $895

**Tree House Boutique Hotel** (USD/night, from):
- King Garden Room — $325
- Queen Courtyard Suite — $425
- Grand Foliage Suite — $595
- Penthouse Canopy — $950

Every price element gets `data-placeholder="true"` + an HTML comment so the owner can find-and-replace.

## Placeholder specs (use these — invent plausible numbers)

Both hotels use the same template:
- Deluxe Room / King Garden — Sleeps 2 · 32 m² · Garden view
- Deluxe Suite / Queen Courtyard — Sleeps 4 · 48 m² · Courtyard view
- Grand Suite / Grand Foliage — Sleeps 6 · 72 m² · Courtyard + garden view
- Penthouse — Sleeps 6 · 95 m² · Private terrace

Mark each specs container `data-placeholder="true"` too.

---

## Per-variant booking widget translation

### V1 Cinematic — booking widget reads as a brass plate

Visual: a horizontal strip on a translucent ivory/cream card sitting over the hero image (or directly under the hero CTAs). Slight box shadow, 8px corners, ochre hairline border. Three fields + button arranged in a row at desktop, stacked on mobile.

- Field labels in tiny uppercase Inter (`label tier`)
- Date inputs use the variant's existing serif body face
- Reserve button uses the existing `cinematic-rise` hover (scale + ochre glow)
- The widget itself gets the `.cinematic-rise` reveal class

Hero layout: wordmark + tagline + (optional secondary CTA) → booking widget below them, above the scroll indicator.

### V2 Editorial — booking widget reads as a "reservation card" tear-out

Visual: a paper card that looks slightly like a library checkout slip or boarding pass. Cream paper background, single 1px ochre hairline frame, generous internal padding, small-caps Inter for field labels, Cormorant Garamond serif for the headline ("Reservar / Reserve"). Pinned below the hero deck or to the right of it.

- Labels in small-caps `lang="es-MX"`: "Llegada · Arrival" / "Salida · Departure" / "Huéspedes · Guests"
- Inputs use the existing editorial paper-stock palette
- Reserve button uses the `editorial-sweep` underline-print L→R hover
- The card itself reveals via the `editorial-sweep` clip-path on first view
- Optional flourish: a small italic Cormorant date in the corner ("Edición · MMXXVI") — but cut if it gets cute

### V3 Brutalist — booking widget reads as a data row

Visual: a 4-column 12-col grid strip. Each cell is a data-cell in the same register as the rest of the page: mono micro labels, ink-on-limestone (or limestone-on-canopy if it sits over a dark section), 1px hairlines. NO rounded corners. NO shadows. NO icons.

- Cell 1: `ARRIVAL → [date]`
- Cell 2: `DEPARTURE → [date]`
- Cell 3: `GUESTS → [stepper]`
- Cell 4: `[ ENTER → ]` (full terracotta button, snap hover, mono caps)

The widget itself uses the `brutalist-snap` reveal — appears as a hard cut, 40ms stagger across the 4 cells, NO fade.

Place under the hero coordinate readout / above the manifesto strip if one remains.

---

## Per-variant room card adjustments

### V1 Cinematic
- Existing room card structure; add **price + specs** below room name, above the existing description.
- Price: `From <span data-placeholder="true">$295</span> / night` — tight Inter caps, ochre accent on dollar amount
- Specs: a 3-cell row of icon-less small-caps: `Sleeps 2 · 32 m² · Garden`
- Reserve CTA per card: `Reserve this room →` (or keep the existing "Reserve a key under the canopy" for Tree House if you adopted it — but make sure it scrolls to `#booking` and sets `room` to this card)

### V2 Editorial
- Room cards already read as plates/cards; add **price + specs** as editorial captions
- Price: italic Cormorant serif: `<em>From <span data-placeholder="true">$295</span> per night</em>`
- Specs: small-caps captions: `2 huéspedes · 32 m² · vista al jardín`
- Reserve CTA: keep the existing button but ensure it jumps to `#booking` + prefills

### V3 Brutalist
- Room cards already use mono spec tables; add **price as a top-right stamp**: `$295 / NT — FROM` in mono data tier
- Add an **explicit specs row** in mono micro tier: `OCC.2 / 32M² / VIEW.GARDEN`
- Reserve CTA: `[ ENTER → ]` terracotta block button, snap hover

---

## What NOT to do

- Don't add a new section — booking widget lives in the hero, pricing/specs live in existing room cards.
- Don't undo any de-fictionalization. The kill-list still applies.
- Don't shared a generic widget across variants — each variant must read as itself.
- Don't add icons unless the variant already uses them (V3 brutalist doesn't; V1 cinematic doesn't either; V2 editorial doesn't — none of V1/V2/V3 should adopt Lucide icons, those are V4's vocabulary).
- Don't break motion fingerprints. The booking widget gets the variant's reveal class.
- Don't break R3 accessibility work. The widget needs proper labels, `lang="es-MX"` where applicable, focus-visible states, mobile tap-targets ≥44px.
- Don't reintroduce "Book Now". Reserve / Check Availability / ENTER per variant.

## Cross-variant minimum

Each variant must, after this pass, answer in <5 seconds:
1. **What rooms can I book here?** (4 named rooms, each visible above the fold within the rooms section)
2. **What does each cost?** (price-from on every card)
3. **How big / who fits?** (sleeps + m² + view on every card)
4. **How do I book?** (booking widget in hero + sticky Reserve + per-card Reserve)

If a reasonable visitor can't answer those four in a fast scroll, the variant didn't ship correctly.
