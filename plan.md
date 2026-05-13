# Direct-Booking AI Chatbot — Plan v0.1

For Treehouse Boutique Hotel. Drafted 2026-05-13.

## Context

A chat widget on the hotel's website that converts any visitor into a direct booker. Price-match is one tool among several. Built as a multi-tenant SaaS so the same codebase can serve other boutique hotels later.

> *Why a chatbot at all:* the owner wants spur-of-the-moment conversions captured even when she's not awake. A 3am visitor today closes the tab; with a bot, they book.

## Bot's job, in order of priority

1. Convert any website visitor to a direct booker (not just OTA shoppers)
2. Handle price-match when asked — one tool among several
3. Escalate edge cases to 24/7 front desk text line

> *Why this order:* most visitors aren't actively comparing OTA prices — they just need pricing clarity and a reason to book direct. Price-match is a closer for the subset that is comparing, not the lead feature.

## Direct-booking pitch the bot always surfaces

- **Breakfast included** on direct rate (vs. OTA: not)
- **No OTA fees** stacked on top
- **Immediate confirmation; direct line for changes**

> *Why these specifically:* breakfast is the concrete, easy-to-explain differentiator vs. OTAs. Taxes & fees still get added at checkout — the bot should always note this so the rate quoted isn't mistaken for the total.

## Price-match flow

1. Guest shares OTA screenshot in chat (must show specific dates)
2. Validate: Booking.com or Expedia only / dates valid / property name matches / differential ≥ $10
3. Bot replies: *"I can match $X for those dates on our non-refundable rate — already cheaper than the refundable rate, AND breakfast is included. Want me to send the booking link?"*
4. On accept → generate coupon: exact dates, non-refundable rate only, single-use, 24h expiry
5. On low OCR confidence / off-property / weird → *"Let me get the front desk, they're 24/7 — text [number]"*

> *Why Booking + Expedia only:* those are the two OTAs the owner has backend control over. She can lower rates there directly to fix the source of undercutting rather than losing 40% commission match-by-match.

> *Why non-refundable rates only:* structurally cheaper in LH already, and the owner prefers them — guests on a week-long stay often don't commit, so locking the booking is the goal. Refundable rates already have a 1-night non-refundable deposit; the non-refundable rate just extends that policy to the full stay.

> *Why screenshots require specific dates:* OTA rates change daily; without dates, there's nothing to verify against.

## Side effect: OTA price-monitoring loop

Bot logs every screenshot. Owner gets a weekly digest of where Booking/Expedia are undercutting. She uses her backend access on those platforms to fix the source rather than paying 40% commission match-by-match.

> *Why this matters:* the price-match feature is also free market intelligence. Every screenshot tells the owner where OTAs are bleeding her margin so she can fix it at the source.

## Mexican-guest handling

- **MXN quoted at day's FX rate** (exchangerate.host or similar)
- **Factura/invoice routing**: bot asks *"¿Necesita factura?"* → routes to front desk if yes
- **Multilingual**: English, Spanish (Mandarin later)

> *Why MXN at day's rate:* the website is priced in USD, but Mexican clients typically pay in MXN converted at the day's exchange rate. The bot has to match that mental model.

> *Why factura routing:* Mexican locals require CFDI tax invoices for business expenses. The owner currently handles facturas manually; the bot's job is to route the request, not generate the document.

> *Currency note for verification:* Expedia shows guests the currency they're registered in. A screenshot from a Mexican guest will likely be in MXN. Bot must convert to USD before applying the $10 differential check.

## Owner stays out of the loop

- Bot handles inside rules (incl. 3am sales)
- Edge cases → front desk text line (24/7 staffed)
- Owner gets daily digest; no live alerts

> *Why front desk, not owner:* the front desk has 24/7 coverage; the owner does not. The current ad-hoc flow already routes urgent guest messages to the owner's personal text, which doesn't scale. Replace with the front desk text-line.

## Coupon mechanism

- Date-range single-use codes (matches the existing LH coupon model)
- 24h expiry from issuance
- Tied to specific dates and to the non-refundable rate

> *Why match the existing model:* the hotel already uses date-range coupons for travel-agent commissions — the bot's coupons fit the same pattern, so accounting and code-tracking don't break. Travel agents only earn commission when their code is used; same logic applies here.

## Fraud guardrails: light

- OCR confidence check
- Rate limit per email (max 5 requests / 30d)
- Light heuristics (OTA UI present, recent timestamp)

> *Why light:* the hotel's check-in policy already controls fraud — guests must present an ID matching the credit card on the booking, or pay with a different card at the desk. The bot doesn't need to be the fraud layer.

## v1 scope boundaries

- Pre-booking only (no post-booking refund matches)
- Booking.com + Expedia only
- Non-refundable rates only for matching
- One coupon per guest per stay
- 24h coupon expiry

## Architecture

- Frontend: chat widget (`<script>` embed on hotel site)
- Backend: Next.js on Vercel
- LLM: Anthropic via Vercel AI SDK
- DB: Postgres (Neon) for hotels, bookings, conversations, screenshots
- PMS adapter: Little Hotelier first; multi-tenant (other PMSs added later)
- MCP server exposed at `/mcp` for external AI agents

> *Why multi-tenant from day one:* same codebase serves the next hotel as a config change, not a fork. Price-match policy, brand voice, PMS credentials all live in per-hotel config.

> *Why an MCP server:* same backend exposed to external AI agents (ChatGPT, Claude, Perplexity, etc.) so the hotel is bookable from where guests actually search now. That's the agentic-commerce surface — same data layer, second product surface.

## Open items

1. Little Hotelier coupon API — does it exist? Ask LH support. If yes → bot creates codes live. If no → owner pre-generates a date-range pool weekly.
2. FX rate source for MXN ↔ USD (exchangerate.host candidate)
3. Front desk text number for escalation
4. Cross-verification with OTAs — skip in v1 (trust OCR + owner spot-check)
