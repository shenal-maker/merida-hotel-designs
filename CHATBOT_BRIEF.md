# Chatbot Patterns Brief — 4 launchers, 4 panels, 1 shared response engine

Each variant gets a chatbot in the register of its design. **The launcher itself must look designed** — not a generic Intercom bubble. Reference real-world examples; don't invent generic SaaS chrome.

All 4 are **scripted** (no real LLM call). Knowledge base is a small JSON keyed by intent. The point is the *style*, so Lulú + customers can compare patterns.

---

## Shared response engine (build once, used by all 4)

File: `/Users/adeleshen/boutique-museo-designs/chatbots/shared/responses.js`

A single module that takes a `(hotel, query)` and returns a scripted response. Hotel is either `"boutique"` or `"treehouse"`. Query is the user's text. Match on keywords:

- "room|suite|stay|book" → list 4 rooms with prices and short description
- "price|cost|rate|how much" → price range from $295 (Boutique) or $325 (Treehouse) + Resident's Allocation / 5-nights offer
- "date|available|when" → "Live availability lives in the booking widget above. Date pickers are ready for you there."
- "art|gallery|soho|treehouse" → one sentence about Treehouse × SoHo Galleries; Tree House framed as namesake venue
- "michelin|key|award" → Tree House response only ("First Michelin Key in Mérida, 2025"); Boutique deflects to sister property
- "where|location|address|map" → Boutique: "Paseo de Montejo, steps from Palacio Cantón, 15 min from MID." Treehouse: "Santa Ana, Calle 43 × 58 y 60, #489."
- "food|restaurant|dinner|breakfast" → "We're not a restaurant, but Mérida is. Ask about Santa Ana / Paseo de Montejo." (truthful — neither hotel publishes F&B menus on their live sites)
- "anniversary|honeymoon" → Boutique: Honeymoon Package available. Treehouse: adults-only, no formal honeymoon package but the property is built for it.
- "children|kids" → Boutique: family-friendly. Treehouse: adults-only.
- "transfer|airport" → 15 min from MID; Boutique: 6+ nights = complimentary transfer. Treehouse: arrangeable.
- Default → "I'm a demo of a chat experience. Tell me what you'd actually want to ask a hotel concierge — we're collecting feedback on what to build next."

Each response is **2–4 sentences max**, ends with a CTA suggestion or one follow-up question. Tone: warm, calm, not chipper. Never "Great question!" / "I'd love to help!" / generic SaaS.

After 3 user messages OR a 30-second idle, surface a small **feedback prompt**: "How does this chat experience feel? [Useful / Just OK / Not for me]" — logs to localStorage under `chatbot-feedback-{variant-id}`.

---

## Launcher A — "Concierge" pill (V1 Cinematic)

**Reference real-world:** Soho House membership widgets, Aman "talk to a host," Hôtel de Crillon's concierge button. **Look at:**
- https://www.aman.com/ — footer "talk to us" treatments
- https://www.sohohouse.com/ — premium pill buttons
- https://www.thelargo.com/ — your existing anchor

**Button design:**
- Pill, 44px tall × auto width, ivory/cream fill on canopy/ink background
- Label: `· Concierge` (DM Serif Display 14px, small leading dot in ochre)
- Border: 1px ochre hairline
- Shadow: `0 1px 0 rgba(0,0,0,0.3), 0 12px 32px rgba(0,0,0,0.4)`
- Position: fixed, bottom-right, 24px from edges
- Entry: fade up from `translateY(20px)` over 800ms cubic-bezier(0.16,1,0.3,1), delayed 2400ms after page load
- Hover: hairline goes from `--ochre-dim` to `--ochre`, dot pulses (1.6s cycle)
- Active: subtle scale 0.97

**Panel design (opens on click):**
- Slides up from button into a 380px × 540px panel
- Same canopy/ink background, ochre hairline frame, no rounded corners on panel (8px on launcher only)
- Header: `Concierge` in Cormorant italic, ochre underline, small × close top-right
- Messages: bot replies in Cormorant 1.05rem ivory; user messages in Inter caps tracked 0.05em, terracotta accent
- Slow character-by-character typing animation on bot reply (30ms/char)
- Input at bottom: borderless, 1px ochre hairline above, placeholder "Ask the house..."
- Send button: serif "Send" link, no chrome
- Feedback prompt at conversation end appears as a quiet 1px hairline-bordered card inline in the message stream

**Used on:** `boutique/v1/`, `treehouse/v1/`

---

## Launcher B — Inline "Ask the editor" column (V2 Editorial)

**Reference real-world:**
- Sierra.ai — embedded conversational hero
- Frank.com — slow conversational reveal
- Magazine "ask the columnist" Q&A spreads (New Yorker, NYT magazine)

**No corner bubble.** This one lives *in the page* as a section between Hero and Rooms.

**Section design:**
- Full-width section, ivory/paper bg, 80vh on desktop / auto on mobile, generous margins
- Heading: `Ask the editor` in DM Serif Display 4rem, with a small Cormorant italic overline: `Cuaderno · Open hours`
- 1px ochre hairline below heading drawing left-to-right on reveal (use existing `.editorial-sweep`)
- Below: a big magazine input — single-line Cormorant Garamond 1.6rem text input with a blinking ochre cursor, no border at top/sides, single 1px ink hairline at bottom (like a printed line)
- Placeholder: "Type something the editor should know — your dates, your reason for coming, a question..."
- Below input: a row of small-caps Inter chips with suggested prompts: `When can I visit?` · `Tell me about the rooms` · `What's the art program?` · `Penthouse Suite`
- On submit / chip click: response appears below as an editorial paragraph in Cormorant 1.15rem, prefixed by a small bracketed marginalia tag `[ The editor ]` in ochre small-caps
- Typing animation: word-by-word reveal (not char-by-char), 80ms per word
- Up to 4 turns visible at once; older messages compress into a small "View earlier" link

**No persistent button — but** add a small nav link `Ask the editor →` in masthead that scrolls smoothly to this section.

**Used on:** `boutique/v2/`, `treehouse/v2/`

---

## Launcher C — "[ / ASK ]" mono key (V3 Brutalist)

**Reference real-world:**
- Linear (linear.app) — `⌘K` command palette
- Raycast (raycast.com) — keyboard-driven launcher
- Anthropic console (console.anthropic.com) — minimal terminal aesthetic

**Button design (one of two entry points):**
- Visible button in the top nav, replacing the standard menu order: `[ / ASK ]` rendered in JetBrains Mono caps 11px, tracked 0.15em
- Terracotta `#b85a3a` text on limestone, no fill, 1px terracotta hairline forming the brackets visually (use ascii bracket chars `[` `]` if cleaner, otherwise CSS)
- Hover: snap-flip, NO transition — fill becomes terracotta, text becomes limestone, instant
- Active state: brief 80ms `transform: translateY(1px)` then snap back
- Also triggered by pressing `/` key anywhere on the page

**Command bar (opens on click or `/`):**
- Top-center modal, 640px wide, 1px terracotta hairline frame, limestone bg, ink text
- No fade-in — appears in 80ms snap (matches `.brutalist-snap`)
- Top of modal: a mono hint `[ TYPE A COMMAND OR QUESTION ]`
- Input: full-width, JetBrains Mono 18px, ink text, no border, single 1px terracotta hairline below
- Below input: a list of slash commands shown as a mono table:
  ```
  /rooms        → THE COLLECTION
  /art          → TREEHOUSE × SOHO
  /location     → MÉRIDA, MX
  /offers       → ALLOCATIONS
  /availability → DATE PICKER
  ```
- As user types, list filters live
- Pressing Enter on a slash command jumps to that section (smooth-scroll-with-margin); pressing Enter on a free-text question returns a response below the input in mono terminal style:
  ```
  > ARE PETS ALLOWED?
  
  NO. ADULTS-ONLY POLICY.
  REFERENCE: HOUSE RULES.
  ```
- Esc closes; backdrop click closes; bottom-right shows mono hint `[ ESC TO CLOSE ]`

**Used on:** `boutique/v3/`, `treehouse/v3/`

---

## Launcher D — Standard chat widget (V4 Minimal)

**Reference real-world:**
- Intercom default (intercom.com)
- Drift (drift.com)
- Crisp (crisp.chat)
- Linear's customer support widget (linear.app)
- Specifically: try to feel like a *better* version of these (cleaner geometry, less noise)

**Button design:**
- Pill, 48px tall, ~120px wide (label-bearing not just icon)
- Ink fill, ivory text, ochre 4px right-edge accent bar OR a small ochre dot
- Label: "Help" in Inter 14px medium, paired with a Lucide `message-circle` icon (16px) on the left
- Position: fixed, bottom-right, 24px from edges
- Entry: appears at 1500ms after load, slides up from `translateY(16px)` over 400ms ease-out
- Notification dot top-right (8px terracotta circle) — present from arrival, disappears once opened
- Auto-message after 8s: a small ochre-bordered card slides up *above* the button: "👋 Looking for the perfect room?" with a tiny × to dismiss
- Hover: lifts 2px, shadow deepens

**Panel design:**
- 380px × 600px panel slides up from button, rounded 12px corners
- Header: hotel name + small avatar circle (hotel logo silhouette) + "Online · usually replies in seconds"
- Body: standard threaded chat, light bg, user messages right-aligned ochre-tinted, bot messages left-aligned cream-bg
- Bot avatar shown on each bot message
- Quick action chips above input: `See rooms` · `Check availability` · `Ask about Mérida`
- Input at bottom with placeholder "Send a message...", send button is an arrow-up icon (Lucide)
- Subtle "Powered by [hotel name]" footer in Inter 11px

**Used on:** `boutique/v4-minimal/`, `treehouse/v4-minimal/`

---

## Shared behaviors

- All 4 dispatchers respect `prefers-reduced-motion` (no animations, instant open)
- All 4 close on Esc
- All 4 trap focus when open (Tab cycles within panel/modal)
- All 4 restore focus to the launcher on close
- All 4 log feedback to `localStorage` with keys `chatbot-{a|b|c|d}-feedback`, surfaceable later via a small `?feedback=1` query param that opens a viewer
- All 4 mention "demo" clearly in the welcome message
- `lang="es-MX"` where Spanish appears

## Implementation structure

```
chatbots/
├── shared/
│   ├── responses.js   (the knowledge base + intent matcher)
│   └── feedback.js    (localStorage helpers + view-feedback URL handler)
├── a-concierge/
│   ├── concierge.js   (self-contained, takes data-hotel attr)
│   └── concierge.css
├── b-editor/
│   ├── editor.js
│   └── editor.css
├── c-command/
│   ├── command.js
│   └── command.css
└── d-widget/
    ├── widget.js
    └── widget.css
```

Each variant's `index.html` includes the appropriate pair via:

```html
<script src="../../chatbots/shared/responses.js" defer></script>
<script src="../../chatbots/shared/feedback.js" defer></script>
<link rel="stylesheet" href="../../chatbots/a-concierge/concierge.css">
<script src="../../chatbots/a-concierge/concierge.js" defer data-hotel="boutique"></script>
```

The launcher self-mounts at `DOMContentLoaded` reading its `data-hotel` attribute.

## Don't

- Don't use canned chatbot copy ("How can I help you today!" — never)
- Don't auto-pop the panel (button only)
- Don't use the default Intercom blue. Use the variant's existing palette only.
- Don't add new external dependencies — vanilla JS + already-loaded fonts only. (V4 has Lucide; reuse it.)
- Don't break the page if `responses.js` 404s — fail silently with no launcher visible.
