# AI booking chatbot for Treehouse — for your review

A plan for the chatbot we're building for the Treehouse website. Please read through and leave comments anywhere it's wrong, missing, or doesn't match how you want this to work. The questions at the bottom are the things I need your answers on before we can build.

---

## What we're building

A chat assistant that lives on your website. Its job:

- Make pricing clear
- Show guests the perks of booking direct (breakfast included, no OTA fees)
- Close direct bookings — including 3am sales you can't be awake for

Price-match is one of its tools, but it's not the whole job. Most visitors aren't comparing OTA prices — they're trying to decide whether Treehouse is the right place for their trip. The chatbot helps them get there.

---

## What v1 does

### 1. Answers visitor questions

Rooms, amenities, policies, location. The chatbot reads from a document you maintain — so anything you write down, it knows. Anything outside the document, it doesn't make up — it sends the guest to the front desk.

### 2. Quotes the website rate

For specific dates the guest asks about, the chatbot shows the rate from your website. Always reminds them that taxes and fees are added at checkout, so the rate isn't mistaken for the total.

### 3. Surfaces the direct-booking perks every time

- Breakfast included on direct rate
- No OTA fees on top
- Immediate confirmation

### 4. Price-match — three options for the guest

When a guest asks about matching a lower price they've seen, the chatbot gives them three choices:

- **Send a screenshot here** — the chatbot verifies it and offers a coupon if it checks out
- **Call or text the front desk** — for guests who prefer talking to a person (24/7)
- **Reach you directly** — for guests with a complex request or an existing relationship

The guest picks. The chatbot routes accordingly.

**If they pick screenshot:** chatbot checks that the OTA is Booking.com or Expedia, that the dates match, that the property is yours. If it all checks out, it generates a single-use coupon on the non-refundable rate for those dates. If anything seems off, it sends them to the front desk instead.

### 5. Booking still happens on Little Hotelier

The chatbot doesn't replace your booking system. It sends the guest to your existing booking page with the coupon code (if there is one). Payment and confirmation happen the same way they do today.

### 6. Escalation

The front desk is the default place the chatbot sends anything it can't handle (24/7 coverage). You only get pulled in when a guest specifically picks "reach you directly" inside the price-match path. The coupons you're currently texting out by hand — the chatbot handles those automatically.

---

## Mexican guests

- Your website is priced in USD; the chatbot converts to MXN at the day's exchange rate when it's helpful
- If a guest asks about a factura, the chatbot collects the request and routes it to the front desk (since the front desk issues facturas)

---

## Fraud

Your existing check-in policy is the protection — the guest's ID has to match the credit card, otherwise they pay with another card at the desk. The chatbot doesn't add anything on top.

---

## Questions I need your answers on

1. **Your Booking.com and Expedia contracts.** What do they say about offering lower direct rates on your own site? Some contracts forbid quoting lower rates publicly (which means the chatbot can offer a coupon but can't openly state a lower number in chat). Others have carve-outs.

2. **Little Hotelier discount codes.** Does Little Hotelier let me create discount codes through their software automatically? (Their support team can confirm.) If yes, the chatbot creates them on the spot. If not, you'd pre-generate a batch and the chatbot dispenses from the batch.

3. **Front desk contact channel.** When the chatbot escalates to the front desk, what should it use — SMS, WhatsApp, something else? And what's the number?

4. **Reach-you-directly channel.** When a guest picks "reach you directly" in the price-match path, what's the best way for the chatbot to hand them off to you? Same channel as front desk, or different?

5. **Languages.** Should the chatbot launch in English only, English + Spanish, or both?

6. **Minimum price difference worth matching.** Working assumption: $10 USD. If the OTA is only $3 cheaper, is it worth offering a coupon? Where's your threshold?

7. **How long the discount code stays valid.** Working assumption: 24 hours after the chatbot issues it. Does that feel right?

8. **Hotel info document.** The chatbot needs a document with rooms, amenities, policies, FAQs, local recommendations. Does one exist somewhere already, or do we need to put one together?
