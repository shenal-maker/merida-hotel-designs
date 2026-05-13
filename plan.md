# Direct-Booking AI Chatbot — Plan v0.1

For Treehouse Boutique Hotel. Drafted 2026-05-13.

## Context

A chat widget on the hotel's website that converts OTA shoppers into direct bookers. Price-match is one tool in a broader direct-booking concierge. Built as a multi-tenant SaaS so the same codebase can serve other boutique hotels later.

## Bot's job, in order of priority

1. Convert OTA shoppers to direct bookers
2. Handle price-match when asked — one tool, not the lead
3. Escalate edge cases to 24/7 front desk text line

## Direct-booking pitch the bot always surfaces

- Breakfast included on direct rate (vs. OTA: not)
- No OTA fees stacked on top
- Immediate confirmation; direct line for changes

Price-match is a closer, not the opener.

## Price-match flow

1. Guest shares OTA screenshot in chat
2. Validate: Booking.com or Expedia only / dates valid / property name matches / differential ≥ $10
3. Bot replies: *"I can match $X for those dates on our non-refundable rate — already cheaper than the refundable rate, AND breakfast is included. Want me to send the booking link?"*
4. On accept → generate coupon: exact dates, non-refundable rate only, single-use, 24h expiry
5. On low OCR confidence / off-property / weird → *"Let me get the front desk, they're 24/7 — text [number]"*

The match forces non-refundable. That's the owner's preferred outcome already (no cancellation risk, rate is already structurally lower).

## Side effect: OTA price-monitoring loop

Bot logs every screenshot. Owner gets a weekly digest of where Booking/Expedia are undercutting. She uses her backend access on those platforms to fix the source rather than paying 40% commission match-by-match.

## Mexican-guest handling

- MXN detected → quote at day's FX rate (exchangerate.host or similar)
- Bot asks "¿Necesita factura?" → routes to front desk if yes
- Multilingual: English, Spanish (Mandarin later)

## Owner stays out of the loop

- Bot handles inside rules (incl. 3am sales)
- Edge cases → front desk text line
- Owner gets daily digest; no live alerts

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

## Open items

1. Little Hotelier coupon API — does it exist? Ask LH support.
2. FX rate source for MXN ↔ USD
3. Front desk text number for escalation
4. Cross-verification with OTAs — skip in v1 (trust OCR + owner spot-check)
