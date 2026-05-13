# Direct-Booking AI Chatbot — Plan v0.3

For Treehouse Boutique Hotel. Drafted 2026-05-13. PMS: Little Hotelier.

---

## Goal

Make pricing clear. Surface the perks of booking direct. Incentivize direct bookings — including 3am sales the owner can't be awake to close. Price-match is one tool among several.

---

## What v1 does

### 1. Answers visitor questions from a knowledge base
Rooms, amenities, policies, location. Source-of-truth: a written doc maintained by the hotel.

### 2. Quotes the website rate
The bot surfaces the rate already shown on the hotel's website for the dates the guest specifies. Always notes "taxes and fees added at checkout" so the rate isn't mistaken for the total.

### 3. Surfaces direct-booking perks every time
- Breakfast included on direct rate (OTAs don't include it)
- No OTA fees on top
- Immediate confirmation

### 4. Price-match path

When a guest asks about matching a lower price they've seen, the bot offers options:

- **Send a screenshot here** — bot validates it and issues a coupon if it checks out
- **Call or text the front desk** — for guests who prefer talking to a person (24/7)
- **Reach the owner directly** — for guests with complex requests or an existing relationship

The guest picks. The bot routes accordingly.

**Screenshot path** (when chosen):

1. Guest shares OTA screenshot in chat with specific dates
2. Validate: OTA is Booking.com or Expedia / dates valid / property matches Treehouse
3. Bot offers a coupon on the non-refundable rate for those exact dates
4. On accept → generate coupon (date-range, single-use)
5. On validation failure → escalate to front desk

> *Why Booking + Expedia only:* the owner has backend access to both and can lower OTA rates directly rather than paying 40% commission match-by-match. The screenshots also feed her a log of where OTAs are undercutting.

> *Why non-refundable rates only:* they're already cheaper in LH; the owner prefers them; refundable rates already have a 1-night non-refundable deposit.

> *Why screenshots require specific dates:* OTA rates change daily — nothing to verify against without dates.

### 5. Booking happens on LH's existing booking page
Bot does not replace the booking engine. Bot sends the guest to LH's booking page with the coupon code (if applicable). Payment and confirmation happen there.

### 6. Escalation
Default escalation goes to the front desk (24/7 coverage). The owner is offered as a routing option only inside the price-match path (Section 4) for guests who specifically ask to reach her. Coupons are currently texted out manually; the bot replaces that loop.

---

## Mexican-guest handling

- Website is priced in USD; Mexican clients usually pay MXN at the day's exchange rate — bot converts and shows MXN when relevant
- Factura requests → bot collects and routes to front desk (front desk issues facturas)

---

## Fraud guardrails: light

The hotel's check-in policy already controls fraud — ID must match the credit card on the booking, or pay with a different card at the desk. Bot is not the fraud layer.

---

## Architecture (high level)

- Chat widget embedded on the hotel's website via a script tag
- Backend integrates with Little Hotelier for coupon generation (API if available, otherwise a pre-generated coupon pool)
- Rate quoting uses the rate published on the hotel's website (no live PMS lookup in v1)
- Per-hotel config so the same codebase can serve other hotels later
- Booking happens on LH's existing booking page — we link to it

---

## Open items the owner needs to answer

1. **Booking.com / Expedia parity contract terms** — strict, or with carve-outs? Affects how the bot is allowed to phrase a price-match offer.
2. **Little Hotelier coupon API** — does it exist? If yes, bot creates codes live. If not, owner pre-generates a date-range pool.
3. **Front desk escalation channel** — SMS, WhatsApp, or other? What's the number?
4. **Owner-direct routing** — what's the channel and contact for the "reach the owner directly" option in the price-match path?
5. **Languages at launch** — English only, English + Spanish, both?
6. **Minimum price differential for a match to be worth offering.** Working assumption: $10 USD.
7. **Coupon expiry duration after issue.** Working assumption: 24h.
8. **Source of truth for hotel info (amenities, policies, FAQs)** — written doc maintained by the hotel.

---

## Ideas to entertain (NOT in v1)

- Replacing Little Hotelier's booking engine
- WhatsApp as a primary guest channel
- Abandoned-cart recovery / follow-up sequences
- Exit-intent prompts
- Social proof / scarcity messaging in chat
- Comparison panels (Direct vs OTA side-by-side)
- Upsell catalog (breakfast upgrade, spa, transfers, etc.)
- Returning-guest recognition (lookup against LH prior stays)
- MCP server exposing the hotel to ChatGPT / Claude / Perplexity
- Mandarin support
- Multi-tenant onboarding flow for hotel #2+
- Business model / pricing
- Success metrics & evaluation harness
- Group-booking flow (3+ rooms)
