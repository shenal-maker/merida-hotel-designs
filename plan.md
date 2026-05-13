# Direct-Booking AI Chatbot — Plan v0.2

For Treehouse Boutique Hotel. Drafted 2026-05-13.

---

## Executive summary

Treehouse Boutique Hotel ships a 24/7 booking concierge that turns any website visitor — not just OTA shoppers — into a direct booker. The chatbot answers guest questions, quotes live rates from Little Hotelier, surfaces direct-booking perks (breakfast, no OTA fees), handles verified price-match requests on non-refundable rates, captures leads with WhatsApp/email follow-up, routes facturas to the front desk, and escalates anything complex to the 24/7-staffed front desk. The same backend exposes an MCP server so the hotel is bookable from ChatGPT/Claude/Perplexity. Built multi-tenant from day one to scale to other boutique hotels.

---

## Problem statement

**For the visitor:** ~81% of hotel website visitors abandon without booking (HiJiffy industry data). Most don't know what booking direct buys them. Pricing isn't transparent — taxes and fees stack at checkout, eroding trust. Comparing to OTAs adds friction. Mexican guests want MXN and facturas; the site doesn't serve them natively.

**For the owner:** She can't be awake at 3am to convert browsers. Front desk has 24/7 coverage but isn't on the website. When guests do request price matches by email or text, she manually verifies screenshots and generates coupons — and every match either pays 40% OTA commission or costs hours of OTA-rate adjustment.

## Goals (v1)

1. Convert any website visitor into a direct booker (not just OTA shoppers)
2. Surface direct-booking perks reflexively (breakfast, no fees, immediate confirmation)
3. Handle verified price-match requests within parity-contract safe limits
4. Serve Mexican guests natively (MXN proactive quoting, factura routing, WhatsApp)
5. Give the owner OTA-undercut intelligence as a side effect
6. Build multi-tenant SaaS from day 1 (same codebase serves hotel #2 via config)

## Non-goals (v1)

- Post-booking refunds or rate adjustments after a booking is made
- Voice / phone channel
- Mandarin (v1.1 — segment is real but UX needs its own design)
- Self-serve onboarding for new hotels (high-touch for first ~5 tenants)
- Group bookings of 3+ rooms (escalate to front desk with structured handoff)
- Replacing Little Hotelier's booking engine — we link to it for v1

---

## Users and jobs-to-be-done

| User | Job |
|---|---|
| **Visitor — info-seeker** | Decide whether this hotel is right for me without leaving the chat |
| **Visitor — price shopper** | Find out if I can do better than OTA, and if not, understand why direct is better anyway |
| **Visitor — returning guest** | Be remembered; book the same suite I had last time without re-typing |
| **Visitor — Mexican local** | Get a rate in MXN with factura option, ideally over WhatsApp |
| **Owner** | Convert 3am browsers without being awake; see weekly OTA-undercut intel |
| **Front desk** | Take handoffs from the bot with full context; resolve and book |
| **External AI agent** (over MCP) | Discover and book Treehouse on behalf of its user |

---

## Success metrics

**North-star:** *Direct-booking conversion rate from chat-engaged sessions* — target ≥ 8% in 90 days (industry baseline for AI chat is 6–12%; Asksuite claims 30% lift; we set 8% as conservative).

**Counter-metrics (guardrails — must not regress):**
- Owner override rate on auto-generated coupons (signal of bot misjudgment) < 5%
- Customer-flagged "bot was unhelpful" rate < 10%
- Cost per conversation < $0.50 (LLM + OCR + FX API combined)

**Supporting funnel events** (every event logged with `tenant_id`, `session_id`, `timestamp`):
- `widget_loaded` → `chat_opened` → `first_message_sent` → `intent_detected` → `availability_quoted` → `coupon_issued` (if applicable) → `booking_link_clicked` → `booking_confirmed` (via LH webhook)
- Escalation events: `escalated_to_front_desk` (reason tagged)
- Abandonment events: `lead_captured`, `follow_up_sent`, `recovered_booking`

**Owner-facing daily digest:** conversations, bookings attributed to chat, top 3 dropout questions, requested-but-unavailable dates, OTA undercut log, escalation list.

---

## Bot's job, in order of priority

1. Convert any website visitor to a direct booker
2. Handle price-match when asked — one tool among several
3. Route Mexican guests' factura needs to front desk
4. Escalate edge cases to 24/7 front desk via WhatsApp

> *Why this order:* most visitors aren't comparing OTA prices — they need pricing clarity and a reason to book direct. Price-match is a closer for the subset that is comparing.

---

## User journeys (v1 must support all)

### J1 — Cold visitor, "just looking"
Lands on site, opens chat, asks about rooms / amenities / location. Bot answers from hotel knowledge base, asks "any specific dates in mind?" If yes → quote flow. If no → soft capture: "want me to email you a few date options?"

### J2 — Date-specific shopper
"How much for July 4–6, two adults?" → bot calls LH for live availability + rate → quotes "from $X/night (incl. breakfast) → $Y total with taxes/fees for your dates. 2 treehouses left." Offers booking link. If guest hesitates, bot offers WhatsApp follow-up.

### J3 — Price shopper with OTA screenshot
See **Price-match flow** below.

### J4 — Returning guest
On email entry, bot queries LH for prior stays. If found → "Welcome back, Mr. García. Last time you stayed in the Coral Suite — same one?" Surfaces remembered preferences.

### J5 — Mexican local
Bot detects browser locale or asks "¿Necesita factura?" early. Quotes MXN at day's FX rate. Routes factura collection (RFC, fiscal regime, CFDI use code, fiscal address) to front desk via WhatsApp with structured payload.

### J6 — Group / special occasion
"3 rooms for my parents' anniversary, connecting if possible" → bot collects basics (dates, occupancy, occasion) and hands to front desk via WhatsApp. Does NOT attempt to quote.

### J7 — Abandoned cart
Guest got a quote, asked about cancellation, said "let me check with my partner." Bot offers email/WhatsApp follow-up. 4h later: gentle nudge. 24h later: "your dates are still open, breakfast included if you book by tomorrow." (Up to 2 nudges, then quiet.)

### J8 — Exit-intent
On desktop mouse-leave or mobile scroll-back, bot proactively opens: *"Wait — anything I can answer about the treehouses?"*

### J9 — Bot stumped
Unrecognized intent, complex policy question, complaint, accessibility need → escalate to front desk with full conversation context via WhatsApp.

---

## Direct-booking pitch the bot always surfaces

- **Breakfast included** on direct rate (vs OTA: not)
- **No OTA fees** stacked on top
- **Immediate confirmation; direct line for changes**
- **Total price (incl. tax & fees) shown before checkout** — no surprises

> *Why these:* breakfast is the concrete differentiator. Surprise fees at checkout are a top abandonment cause — front-loading totals removes that friction.

---

## Conversion tactics built into the bot

These are non-AI tactics borrowed from Triptease / Hotelchamp / The Hotels Network, baked into chat:

| Tactic | When | Source |
|---|---|---|
| **Live availability + total price** | Whenever guest asks about dates | Removes #1 abandonment cause |
| **Authentic scarcity** ("2 treehouses left for your dates") | Quote step, only when truly low | Hotelchamp 36% lift |
| **Social proof** ("3 guests from Mexico City booked this week") | Mid-conversation, naturally | Nielsen 92% peer trust |
| **Comparison panel** (Direct vs Booking.com side-by-side) | When OTA intent detected | Triptease 12% look-to-book lift |
| **Exit-intent prompt** | Mouse-leave / scroll-back | Reaches the 81% who would otherwise leave |
| **Lead capture for non-converters** | After 2 turns with no commitment | Enables follow-up loop |
| **Trust badges** ("Secured by Stripe, no hidden fees") | At booking-link step | Reduces risk aversion |

---

## Price-match flow

1. Guest shares OTA screenshot in chat (must show specific dates)
2. **Validate (in order):** OTA is Booking.com or Expedia / dates are valid and future / property name matches Treehouse / OCR confidence ≥ 90% on all fields / total price extracted / currency normalized to USD at day's FX (snapshot the rate, source, timestamp on the screenshot record) / differential ≥ $10 USD
3. **Bot reply (parity-safe phrasing):** *"For your dates, I can apply a private coupon that brings our non-refundable rate to $X. That includes breakfast and avoids OTA fees. Want me to send your personal booking link?"*
4. On accept → generate coupon: exact dates, non-refundable rate only, single-use, 24h expiry, tied to guest email
5. On low confidence / off-property / fishy → *"Let me get the front desk, they're 24/7 — I'll WhatsApp them now with your details."*

> *Why parity-safe phrasing:* Booking.com and Expedia parity contracts forbid publicly offering a lower rate on the hotel's own channel. Coupon-gated *private* rates delivered via a personalized link are the industry-standard workaround. Avoid stating the discounted rate in chat as a public quote.

> *Why Booking + Expedia only:* those are the OTAs the owner controls. She can also lower the OTA rates directly in the backend rather than match every screenshot.

> *Why non-refundable rates only:* structurally cheaper in LH; owner prefers them (no cancellation risk); refundable rates already have a 1-night non-refundable deposit anyway.

> *Why specific dates required:* OTA rates change daily; without dates there's nothing to verify.

---

## Mexican-guest handling

- **Detect** browser locale, IP geo, or language → flag as MX context
- **Proactive MXN quote**: "$X USD ≈ $Y MXN at today's rate" using exchangerate.host
- **Snapshot FX rate** on the conversation record (source URL + timestamp) for auditable replay
- **Factura collection**: bot asks *"¿Necesita factura?"* If yes → collects RFC, fiscal regime, CFDI use code, and fiscal address in-chat, then hands to front desk via WhatsApp with structured payload (don't make front desk ask for it twice)
- **Channel preference**: WhatsApp is primary in Mexico (71–93% open rates); SMS is the gringo fallback

---

## WhatsApp + lead capture + abandoned-cart recovery

- **Lead capture:** at the point a guest hesitates ("let me think about it" / "I'll check with my partner") or shows exit-intent, bot offers to continue on WhatsApp or email
- **Follow-up sequence:**
  - +4h: "Still thinking about July 4–6? Happy to hold the rate."
  - +24h: "Your dates are still open — breakfast included if you book by tomorrow."
  - Stop after 2 nudges. Tag conversation `recovered` or `lost` based on subsequent action.
- **Channel rule:** WhatsApp for Mexican / LATAM guests, email for everyone else. Detect via locale/language.

---

## Upsell logic

Surface during booking flow or on confirmation:
- Breakfast upgrade (e.g. private terrace breakfast)
- Sunset dinner package
- Spa treatment
- Airport transfer

Per-hotel upsell catalog lives in tenant config. Bot offers max 1 upsell per session to avoid pushiness — luxury voice ≠ used-car-salesman.

---

## OTA price-monitoring loop (owner side effect)

Bot logs every screenshot with: OCR'd OTA, room, dates, OTA price (with currency + FX snapshot), Treehouse direct rate at that moment, differential, outcome. Weekly digest to owner shows where Booking/Expedia are systematically undercutting → she fixes at the source via OTA backend access, not match-by-match.

---

## Owner stays out of the loop

- Bot handles inside rules (incl. 3am sales)
- Edge cases → front desk via WhatsApp (operator-console handoff, NOT bouncing the guest to SMS)
- Owner gets daily digest, not live alerts. Sections: conversations, bookings via chat, top dropout questions, requested-but-unavailable dates, OTA undercut report, escalations list.

---

## Coupon mechanism

- Date-range single-use codes (matches existing LH coupon model)
- 24h expiry from issuance
- Tied to specific dates + non-refundable rate + guest email
- Idempotency key per `(conversation_id, screenshot_id)` to prevent double-issue on LLM retry
- Coupon record created in `pending` status before LH call; reconciliation job for `pending > 5min`

> *Why match the existing model:* the hotel already uses date-range coupons for travel-agent commissions; same code-tracking model keeps accounting clean.

---

## AI quality bar (non-functional requirements)

| Metric | Target | Failure handling |
|---|---|---|
| Hallucination rate (fabricated amenities, fake policies) on eval set | < 2% | Hard guardrail: bot can only state facts present in tenant knowledge base |
| Tool-call accuracy (correct tool, correct params) on eval set | ≥ 95% | Failed tool call → "let me check with the front desk" |
| First-response latency p50 / p95 | < 2s / < 5s | Streaming response; ack within 500ms |
| Escalation false-negative rate (cases that should have escalated but didn't) | < 3% | Owner review of all `bot_resolved` cases in week 1 |
| Cost per conversation | < $0.50 | Cache aggressive on tenant knowledge base; truncate context |
| OCR field-extraction accuracy on real screenshots | ≥ 90% per field | Below threshold → escalate |

---

## Eval set + test categories

50-100 hand-labeled conversations to start. Categorize failures:

- **F1:** Missed escalation (complex / abusive / off-scope)
- **F2:** Fabricated rate (quoted something not in PMS)
- **F3:** Fabricated amenity / policy
- **F4:** Wrong currency (quoted USD when guest is in MX context)
- **F5:** Parity violation (publicly quoted matched rate)
- **F6:** Failed price-match validation (false positive or false negative)
- **F7:** Bad upsell (offered something not in catalog / wrong timing)
- **F8:** Tone mismatch (too transactional for luxury / too floral)
- **F9:** Prompt injection success (screenshot OCR text contained "ignore previous instructions...")

Each failure type gets at least 5 examples in the eval set.

---

## Tools the bot uses

| Tool | Purpose | Inputs | Failure mode |
|---|---|---|---|
| `lh.check_availability` | Live room availability | dates, room type, occupancy | LH down → "let me check with front desk" |
| `lh.get_rate` | Live rate for dates | dates, room type, rate plan | LH down → defer to front desk |
| `lh.create_coupon` | Generate single-use code | amount, dates, rate plan, email | If API unsupported → use pre-generated pool |
| `ocr.extract_screenshot` | OCR OTA screenshot | image | Confidence < 90% → escalate |
| `fx.get_rate` | USD↔MXN at day's rate | currency pair, date | Cached daily; on failure use last-good |
| `wa.send_handoff` | Send structured handoff to front desk WhatsApp | conversation context, payload | Retry 3x then SMS fallback |
| `db.lookup_guest` | Returning-guest recognition | email | No match → first-time flow |

Hard rules: the bot *cannot* take actions outside this tool set. No "match_competitor_price" tool exists — the LLM cannot do what it cannot call.

---

## Guardrails and safety

- **Never quote a rate not returned by `lh.get_rate`** — prevents fabrication
- **Never reference amenities/policies not in tenant knowledge base** — prevents fabrication
- **Never state a matched-rate amount publicly in chat** — parity compliance (always say "private rate via your personal link")
- **Profanity / abuse / mental-health off-ramp** — polite shutdown, escalation, log
- **Prompt injection defense** — screenshot OCR text and user messages are *untrusted*; never executed as instructions
- **PII redaction** — credit card numbers, full IDs masked in logs

---

## Tenant config schema

```json
{
  "tenant_id": "treehouse-tulum",
  "name": "Treehouse Boutique Hotel",
  "domain": "treehouseboutiquehotel.com",
  "brand_voice": {
    "tone": "warm, lightly poetic, knows the area — a friend not a salesperson",
    "examples": ["..."],
    "do_not": ["aggressive upsell", "fake urgency", "consultant-speak"]
  },
  "languages": ["en", "es"],
  "locale": {
    "primary_currency": "USD",
    "alt_currency": "MXN",
    "fx_source": "exchangerate.host",
    "region": "MX"
  },
  "pms": {
    "provider": "little_hotelier",
    "credentials_secret_id": "vault/lh/treehouse",
    "property_id": "..."
  },
  "price_match": {
    "enabled": true,
    "allowed_otas": ["booking.com", "expedia"],
    "min_differential_usd": 10,
    "rate_eligibility": "non_refundable_only",
    "coupon_expiry_hours": 24,
    "parity_mode": "coupon_gated_private",
    "max_per_email_per_30d": 5
  },
  "escalation": {
    "channel": "whatsapp",
    "number_secret_id": "vault/wa/treehouse",
    "fallback_channel": "sms"
  },
  "features": {
    "factura": true,
    "mxn_proactive_quote": true,
    "abandoned_cart_recovery": true,
    "exit_intent": true,
    "social_proof": true,
    "comparison_panel": true,
    "mcp_agent_surface": false
  },
  "upsell_catalog": ["breakfast_upgrade", "sunset_dinner", "spa_package", "airport_transfer"],
  "knowledge_base_id": "kb_treehouse_v1",
  "privacy": {
    "conversation_retention_days": 90,
    "screenshot_retention_days": 30,
    "aviso_de_privacidad_url": "..."
  }
}
```

---

## Architecture

- **Frontend:** chat widget (`<script>` embed on hotel site, iframe-based)
- **Backend:** Next.js on Vercel
- **LLM:** Anthropic via Vercel AI SDK
- **DB:** Postgres (Neon) with row-level security keyed on `tenant_id`
  - Tables: `tenants`, `conversations`, `messages`, `screenshots` (with OCR + FX snapshot + perceptual hash), `coupons` (append-only event log), `guests`, `bookings`, `events` (funnel)
- **Secrets:** per-tenant encrypted credentials in a vault (column-encryption w/ KMS-managed keys)
- **Observability:** Langfuse or Helicone for LLM traces; structured logs to Vercel; conversation-replay UI for debugging
- **PMS adapter pattern:** `PMSAdapter` interface — `little_hotelier.ts` is one implementation; Cloudbeds/Mews/Opera added behind the same interface
- **MCP server** at `/mcp` — same backend exposed as Model Context Protocol so ChatGPT / Claude / Perplexity can discover and book the hotel. Tenant-scoped: each tenant is a separate MCP namespace.

---

## Business model and tenant onboarding

**Pricing hypothesis (v1, to validate):** $99/mo base per hotel + $5 per direct booking attributed to chat. Transparent published pricing — contrasts with Triptease / HiJiffy "contact sales."

**Onboarding for tenants 1–5: high-touch concierge.** Adele on-site or remote-paired with the GM for ~1 week to: pull amenities/policies/photos into the knowledge base, configure brand voice, integrate LH, set up WhatsApp, run an eval pass. Time-to-live target: 5 business days.

**Tenants 6+:** productize the onboarding into a self-serve flow with a 30-minute setup call. Don't do this earlier — solo founders fail when they self-serve too soon.

> *Why this model:* Asksuite (~$199/mo + 3-5% commission), HiJiffy and Triptease (quote-only) all screen out solo boutique operators. The $99/mo + per-booking wedge undercuts sustainably for a solo builder while the high-touch onboarding wins trust in a relationship industry.

---

## Legal and compliance

- **OTA rate-parity contracts:** Booking.com and Expedia parity clauses generally forbid the hotel from publicly offering a lower rate on its own channel. Coupon-gated private rates delivered via personalized link are the industry workaround. Bot must NEVER state a matched-rate amount publicly. Get a one-page legal review of the actual Treehouse contracts before launch. **P0.**
- **Mexican privacy law (LFPDPPP):** post an `aviso de privacidad` link at chat-open. Define retention windows (conversations 90d, screenshots 30d, then deleted). Provide a DSR/erasure endpoint. **P0.**
- **GDPR (EU guests):** same retention + erasure obligations; standard SCC if data crosses to US.
- **CFDI / factura:** v1 collects fiscal data and hands to front desk; doesn't issue. Document this as a deliberate v1 simplification.

---

## Differentiation — what this product owns

1. **Mexico-native, Spanish-first, WhatsApp-default.** Asksuite / HiJiffy / Canary all speak "50+ languages" but their Spanish is translated and their default channel is web. None handle CFDI as a first-class concept. None proactively quote in MXN.
2. **MCP / agentic-commerce surface from day 1.** Same backend, second product surface. Booking.com and Expedia are shipping ChatGPT integrations Q2 2026; boutique hotels without an MCP surface will be invisible to agentic search. No hotel-chatbot product offers this to boutiques at solo-builder pricing.
3. **OTA-undercut intelligence as a productized side effect.** Every screenshot is competitive intel. Triptease has rate-parity tooling but it's enterprise-priced. Sell the intelligence as the moat, the chatbot as the gateway.
4. **Built for owner-operators, transparent pricing.** $99/mo + per-booking attribution beats Asksuite's $199/mo + 3-5% commission, undercuts Triptease and HiJiffy's quote-only walls.
5. **Brand-voice as a first-class config primitive.** Other chatbots are functional; Maison.cx is the only one positioning on boutique-luxury voice — and they're US-centric. Treehouse's voice (warm, sun-bleached, knows the area) is configured per-tenant.

---

## Competitive landscape (brief)

Leaders: **Asksuite** (LATAM stronghold, ~$199/mo+commission), **HiJiffy** (130 languages, EU), **Canary AI** (Agent Studio platform), **Quicktext** (Velma, structured FAQ), **Whistle by Cloudbeds** (free with Cloudbeds only). Boutique-luxury niche: **Maison.cx** (the closest direct competitor, US-centric). Direct-booking conversion specialists (non-AI to steal from): **Triptease**, **Hotelchamp**, **The Hotels Network**. Infrastructure / agentic: **Agentic Hospitality / TravelOS** (MCP + ChatGPT app, B2B infra, not a chat widget).

---

## MoSCoW

**Must have (v1):**
- Live availability + rate quoting in chat
- Direct-booking pitch reflexively surfaced
- Price-match flow (parity-compliant)
- Mexican-guest handling (MXN, factura routing, WhatsApp)
- Lead capture + email/WhatsApp follow-up
- Total-price transparency before booking link
- Front desk WhatsApp escalation
- Owner daily digest
- Tenant config schema
- Privacy compliance (aviso, retention, erasure)
- Eval set (50+ examples) + observability

**Should have (v1 or fast-follow):**
- Returning-guest recognition (via LH lookup)
- Authentic scarcity ("2 left for your dates")
- Social proof injection
- Exit-intent prompt
- Comparison panel (Direct vs OTA side-by-side)
- Abandoned-cart recovery sequence
- Upsell catalog

**Could have (v1.1+):**
- MCP server live (currently in architecture but not v1 milestone)
- A/B test infrastructure
- Returning-guest preference memory
- Mandarin Chinese support
- Voice channel

**Won't have (v1):**
- Group bookings of 3+ rooms (escalate)
- Post-booking refunds or rate adjustments
- Replacing LH booking engine (we link to it)
- Self-serve hotel onboarding
- Direct payment capture in chat (booking page handles it)

---

## Open items

1. **Confirm with owner: Booking/Expedia parity contract terms.** Strict or with carve-outs? Affects all price-match language.
2. **Little Hotelier coupon API.** Ask LH support — if yes, bot creates codes live; if no, owner pre-generates a date-range pool weekly.
3. **Front desk WhatsApp business account.** Set up with Twilio or Meta Cloud API.
4. **FX source.** exchangerate.host candidate; verify uptime SLA.
5. **Aviso de privacidad** — owner has one? Otherwise, draft one. P0 legal.
6. **Brand voice examples.** 5–10 real exchanges in Treehouse's voice for the eval set + system prompt.
7. **Knowledge base content.** Pull amenities, policies, FAQs, local recommendations into one structured doc. NOT scraped from website.

---

## Glossary

- **PMS:** Property Management System (Little Hotelier = Treehouse's PMS)
- **OTA:** Online Travel Agency (Booking.com, Expedia, Hotels.com, etc.)
- **CFDI / factura:** Mexican fiscal invoice required for business expense deduction
- **RevPAR:** Revenue per available room
- **ADR:** Average daily rate
- **Rate parity:** OTA contract clause requiring the hotel to publish equal-or-higher rates on its own site
- **MCP:** Model Context Protocol — open spec from Anthropic for connecting AI agents to data sources
- **RLS:** Row-level security (Postgres)
- **LFPDPPP:** Mexican federal data privacy law

---

*Plan v0.2 — supersedes v0.1. Major changes: broadened scope to all visitors (not just OTA shoppers), added cold-visitor flows, success metrics with numbers, AI quality bar, tool spec, tenant config schema, legal/compliance section, differentiation analysis, MoSCoW with "Won't have," and business model placeholder.*
