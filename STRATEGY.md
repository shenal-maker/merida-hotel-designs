# Strategy — two threads to come back to

Captured 2026-05-14 from a planning conversation with Adele. These are not committed designs — they're frames to think against as we build Tree House V1 creative-mode and the broader chatbot booking play.

---

## Thread 1 — Scroll storytelling, optimized for hotel shoppers

### The structure: "Decision Scroll"

The front page does all the conversion work. The immersive "walk-in" moment lives at the end, gated behind a click. This serves three different visitors at once.

#### Three visitors to serve simultaneously
- **(a) Within-hotel shopper** — already on the page, deciding King vs Penthouse. Needs rooms + prices + specs visible at a glance.
- **(b) Sister-property shopper** — landed on the wrong sibling. Needs a redirect signal that doesn't feel like upselling.
- **(c) Competitor shopper** — Booking.com is open in another tab. Needs an instant differentiator and trust signals above the fold.

A single front-page funnel serves all three:
- (c) is solved above the fold (Michelin Key + one-line positioning + photo) — beats Booking.com's text-blob in 2 seconds.
- (a) is solved by the rooms section being legible without clicks.
- (b) is solved by the sister-property handoff card placed between rooms and reserve. Not at the top (cannibalizes), not at the bottom (missed).

#### The chapter sequence
1. **Hero** — instant brand mark + Michelin Key (T) / "Steps from Palacio Cantón" (B). Wins (c) on impact.
2. **Why us, one line** — "Adults-only sanctuary wrapped in canopy" / "Family-friendly hacienda restored room by room." Answers "is this for me?"
3. **The rooms** — 4 cards, every fact visible (price, capacity, m², view). Solves (a).
4. **What sets us apart** — Michelin Key, Treehouse × SoHo Galleries, awards. The (c) differentiator section.
5. **Cross-promote** — "Traveling with kids? Our sister property has connecting suites." Handles (b). Frame as honest qualifier, not upsell.
6. **Trust strip** — TripAdvisor + Travellers' Choice + one or two real quotes. Light. (Decision pending where this lives.)
7. **Reserve** — booking widget pinned, dates + guests.
8. **Walk inside →** — the click-to-enter immersive moment. THE END of the funnel.

Total scroll budget: ~50 seconds. Vertical chapter-dot rail on the right (Persepolis-style) lets fast shoppers teleport to chapter 3 or 7.

### Why walk-in at the end (not the middle)

Casual visitors don't pay the 30–80MB splat download cost — it's gated behind a click. Only genuinely interested visitors opt in. The walk-in becomes the *memorable moment* that brings them back, not a barrier to conversion.

### The walk-in's mechanism — three options

| Option | Pros | Cons |
|---|---|---|
| **Modal takeover** (lean toward this) | Lightweight, doesn't break page routing, easy to A/B, splat lazy-loads only on click | Less shareable than a URL |
| **Dedicated route** `/walk-in` | Bookmark-able, URL is shareable, fully cinematic | More engineering, breaks the single-page flow |
| **Locked in-page section** | Persepolis-style commitment to the scroll | Risk: visitors scroll past by accident, feel trapped |

### Open questions for this thread
1. The exact placement of the trust strip (under hero passive vs. integrated into "what sets us apart" vs. chip in the booking widget).
2. Does chapter 5 (sister-property handoff) lose more bookings than it captures? Worth A/B testing.
3. Is the dot rail Persepolis-style (numbered) or just dots? Numbered teaches the funnel; dots are quieter.

---

## Thread 2 — Chatbot as agentic commerce, not as UX experiment

### The reframe

The chatbot is not a UI flourish on the hotel website. It's the **core product** — agentic commerce booking infrastructure for boutique independent hotels. Tree House and Boutique are the testbed. The deliverable is a chatbot that books directly, bypasses Booking.com's 15–18% commission, and proves the model for other hotels.

Target stack: **OpenAI Apps SDK** (or direct API) + **Stripe agentic commerce primitives** (announced late 2025) + **Little Hotelier PMS** (Lulú already uses it).

### What an agentic-commerce booking chatbot actually has to do

The 4 chatbot UIs we already built do step 1 only. They're scripted, no LLM, no API connections, no payment. Stage props.

To be real:

| Step | What it needs |
|---|---|
| 1. Natural-language conversation | LLM (Anthropic or OpenAI) with structured tools |
| 2. Real availability | Little Hotelier API integration |
| 3. Real prices | PMS-driven, not placeholder |
| 4. Guest info capture | Name, email, special requests, preferences |
| 5. Payment processing | Stripe agentic commerce (token-scoped purchase sessions) |
| 6. Reservation creation | Little Hotelier write API + confirmation email |
| 7. Edge cases | Modifications, cancellations, "what's included" |

**Estimated MVP build:** 3–5 days of focused work to wire all of this into ONE of the existing 4 chatbot UIs. Backend hosting on Vercel or Cloudflare Workers.

### How chatbot relates to scroll storytelling

They're not competing — they answer different questions:
- **Scroll** = "is this a yes?" → emotional commitment
- **Chatbot** = "ok, book it" → transactional execution

The walk-in at the end becomes the natural pivot from one to the other: scroll → walk-in → "want to make this real?" → chatbot opens.

### Three product designs for the Lulú launch

| Option | What it means | Risk |
|---|---|---|
| **A — Chatbot replaces booking UI entirely** | No date picker. Type to book. | Cuts visitors who prefer clicking |
| **B — Chatbot parallel to widget, A/B tracked** (lean toward this for launch) | Both available, log which converts | Slightly more complex, but generates the data we need |
| **C — Chatbot as the end of the funnel, post-walk-in** | Most narrative-coherent. But mandatory chatbot booking. | If visitor skips to the bottom and doesn't trust chatbots, dead end |

Recommendation: **B for the Tree House launch.** Data collection mode. Once we have evidence chatbot converts better, the broader product (the agentic commerce SaaS) commits to A or C.

### Strategic questions to ground

1. **OpenAI Apps SDK vs. direct API?** Apps SDK = every ChatGPT user can book by typing into ChatGPT directly. Direct API = full UX control. Different product shapes. The Apps SDK story is the bigger market.
2. **Wedge customer beyond Lulú.** Boutique independents (15–30 rooms) on Little Hotelier seems right — ~50K globally, decent ACV ($200–500/mo), Booking.com commission savings makes ROI obvious. **Worth grounding the market size.**
3. **PMS horizontal expansion.** Little Hotelier first because Lulú uses it. Then Cloudbeds, Mews, SiteMinder, RoomRaccoon. Or stay vertically deep on Little Hotelier customers and own that segment first?
4. **Pricing.** $200–500/mo per hotel is my guess. Worth grounding against what Cloudbeds plugins charge.
5. **Trust & safety layer.** A booking agent that takes real money has real liability. PCI compliance, payment security, jailbreak resistance, fallback for ambiguous queries (price disputes, complaints).

### What unlocks the broader product

Once Lulú's chatbot ships and we have one month of data showing it converts:
- Pitch to 2–3 more boutique hoteliers on Little Hotelier in Mexico City / Oaxaca / CDMX
- White-label the chatbot — same code, different brand and PMS credentials
- Open the OpenAI Apps SDK submission

---

## Next concrete step

Start with **PlayCanvas engine** for the walk-in experience. Clone it to a sister folder, explore the gsplat examples, find the simplest path to embed a splat in an iframe on the existing static site. Don't commit to Next.js yet — keep the hotel site repo intact.

When Lulú gets test footage of the courtyard, run the foliage test (per `reference_gaussian_splatting.md`). If the ficus crown looks good, commit to splats; if not, fall back to layered-image parallax for the same scroll-driven effect.

Parallel track: scope the chatbot MVP build (Anthropic + Little Hotelier + Stripe) so when the design direction is signed off, we can ship the real booking agent quickly.
