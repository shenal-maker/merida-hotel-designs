// The bot's source of truth, inlined as a TypeScript constant so the value
// is included in the function bundle when Next.js deploys to Vercel.
// Previously this was read from `knowledge.md` via fs.readFileSync, which
// works in `next dev` but fails on Vercel serverless because the .md file
// is not bundled with the function.
//
// When `knowledge.md` is edited, this file must be re-synced. Long term a
// build script should automate this; for v0 the convention is: edit
// knowledge.md, then mirror the content into the template literal below.

export const KNOWLEDGE_BASE: string = `# TreeHouse Boutique Hotel — Knowledge Base

Source: treehouseboutiquehotel.com, extracted 2026-05-15. All copy below is verbatim from the public website. This is the chatbot's source of truth.

---

## Hotel basics

**Name:** TreeHouse Boutique Hotel

**Address:** Calle 43 x 58 y 60 #489, Santa Ana, Mérida, México 97000

**Phones:**
- Front desk (call, landline): +52 (999) 931 8351
- Front desk (WhatsApp): +52 (999) 268 1456
- USA: +1 (619) 398 7156
- Reservations line: +52 (999) 931 8352

**Email:** reservations@treehouseboutiquehotel.com

**Social:**
- Facebook: facebook.com/treehouseboutiquemeridayucatan
- Instagram: @treehouseluxuryhotel
- TripAdvisor: Hotel review page
- LinkedIn: The TreeHouse Boutique Hotel

---

## Positioning & awards

"The TreeHouse is the first Michelin Key-rated hotel in Mérida, Yucatán. Nestled in the heart of Mérida's historic Santa Ana neighborhood, the TreeHouse Boutique Hotel offers an adults-only sanctuary where colonial charm meets contemporary comfort."

"Its 15 meticulously designed rooms are surrounded by lush greenery, creating a serene oasis that provides a naturally cool microclimate—even during Yucatán's warmest days."

"Whether you're seeking a peaceful retreat or an immersive cultural experience, the TreeHouse is your perfect home away from home in Mérida."

**Recognition:**
- Michelin Key Hotel — First in Mérida, Yucatán (2025)
- 1 Michelin Key (2025)
- TripAdvisor Travelers' Choice 2025 — Best of the Best

**Current promotion:** "Stay Longer, Save More – Get 30% Off When You Book 5+ Nights!"

---

## Rooms

The hotel has 15 rooms total, all adults-only, all double occupancy (2 guests max per room).

### The King Retreat

"Located on the second floor, the King Retreat offers a spacious and serene escape. Each room features a plush king bed and access to either a private or shared balcony overlooking the pool and courtyard, creating a peaceful setting to unwind."

- Bed: King
- Sleeps: Two
- View: Pool and courtyard
- In-room: King bed, Peacock Alley linens, air conditioning, WiFi, flat-screen television, private or shared balcony

### The Queen Retreat

"With most Queen Retreat Rooms situated on the first floor, guests enjoy serene views of the tropical gardens, lush trees, and the tranquil pool at the heart of the courtyard. These thoughtfully placed rooms offer a peaceful connection to the property's natural surroundings, creating a relaxing and refreshing retreat for your stay."

- Bed: Queen
- Sleeps: Two
- View: Tropical gardens, trees, pool
- In-room: Queen bed, Peacock Alley linens, air conditioning, WiFi, flat-screen television
- Note: "Please contact us directly for our wheelchair accessible room."

### The Petite Room (also referenced as "Queen Luxe Petite Room")

"Comfortably tucked away on the second floor, the Queen Luxe Petite Room offers an intimate boutique experience. Featuring a deluxe queen bed and a bathroom illuminated by skylights, this thoughtfully designed retreat blends charm with comfort."

- Bed: Queen
- Sleeps: Two
- In-room: Queen bed, Peacock Alley linens, air conditioning, WiFi, flat-screen television, skylit bathroom

---

## Guest services

**Concierge:** "Stop by Reception for information regarding destinations, events and things to do."

**Wake-Up Call Service:** "Reception will gladly wake you up as needed. Please let us know what time is you desired call time."

**Linen Change:** "Linens are changed every third day. Need a different service schedule? Let us know."

**Laundry & Ironing:** Available through Reception. Same-day service requires notification by 10:00 AM.

**Luggage Storage:** Available after checkout; notify front desk.

**Airport Transfers:** Hotel coordinates transfers; guest must provide flight information and details.

**Restaurant Reservations:** Staff makes reservations and provides recommendations at front desk.

**Tours:** "For information regarding tours we offer, please stop by reception."

**Massage:** "For information regarding tours we offer, please stop by reception."

---

## Amenities

**Coffee Service:** Coffee is brewed fresh and served daily from 8:00 until 10:00 AM. Coffee is also available before 8 AM upon request. The hotel's coffee and bread come from its café down the street, Pan & Kof.feé.

**Breakfast Service:** A full breakfast is served daily from 8:00 until 10:00 AM on the terrace. The menu rotates and uses fresh ingredients. Coffee is brewed, and the bread is baked down the street at the hotel's café Pan & Kof.feé. A full breakfast is included for all direct bookings. If booked through a third party, breakfast may be included depending on the terms of the reservation.

**Bar (Roots):** Open to guests staying at the hotel from 12:00 PM to 10:00 PM. Roots is a full-service bar. Outside alcohol is not permitted on the property.

**Wi-Fi:** "Wi-Fi is available for all guests."

**Street Parking:** "Street parking is available outside the hotel."

**Gym:** No. Yoga mats provided upon request.

**Air conditioning:** All rooms have air conditioning.

**TVs:** All rooms have a TV.

**Hot water:** All rooms feature hot and cold water.

---

## Policies

### Check-in & check-out

- Check-In: 03:00 PM
- Check-Out: 11:00 AM
- Late checkout available for additional fee based on availability; inquire at Reception.

### Cancellation & refund

"A one-night non-refundable deposit is charged at the moment of booking."

- "Cancellations more than 14 days before arrival: No fee beyond the one-night non-refundable deposit."
- "Cancellations within 14 days of arrival: The entire stay will be charged and is 100% non-refundable."
- "December 15-January 15 reservations are 100% non-refundable, regardless of notice."
- "In case of no-show or early departure, the total price of the reservation will be charged."

### Deposit & payment

"We charge a one night non-refundable deposit for all reservations."

"For the full reservation amount at the time the cancelation period expires (two weeks prior to your arrival date)."

Accepted: "Visa, Mastercard and bank transfers" (American Express not accepted)

"Credit card needs to be placed on file for any incidental charges during Check-In."

### Age

"Our hotel is for adults only (18+)."

### Occupancy

"Each room accommodates single or double occupancy. No more than two individuals per room are allowed."

A solo traveler can book a room for single occupancy. A couple can book a room for double occupancy. Three or more guests need a second room, or the family-friendly sister property Boutique by the Museo.

### Pets

"Pets are not allowed."

### Smoking

"The TreeHouse is a non-smoking property. All rooms are non-smoking."

"In case of smoking in the room or on the property, a penalty of $100 USD will be charged per day."

### ID

"Formal Legal ID is required at check-in, preferably a passport."

### Damages

"Guests are responsible for any damage or loss they cause to the property. Guests will be charged for applicable cleaning or replacement fees in the case of irreparable damage."

### Registration & occupancy

"All guests must be registered with the front desk. Only authorized guests may occupy guest rooms."

"Rooms may not be occupied by non-registered guests without prior management approval."

"The use of hotel rooms and common areas are for registered guests only."

### Enforcement

"We reserve the right to deny entry to any individuals who refuse to respect the hotel policies."

---

## FAQs (verbatim)

**Q: Do you offer parking services?**
A: We have street parking available outside of the hotel.

**Q: Does the hotel have hot water?**
A: All of our rooms feature hot and cold water.

**Q: Is breakfast included?**
A: A full breakfast is included for all direct bookings. If you booked through a third party, breakfast may be included depending on the terms of your reservation.

**Q: What's included in breakfast?**
A: A full breakfast with a rotating menu of items made using fresh ingredients. Coffee is brewed, and bread is baked down the street at our café Pan & Kof.feé. Specific dishes vary day to day. (Detailed menu options will be listed on the hotel page on the website.)

**Q: What time is breakfast served?**
A: Breakfast is served from 8 AM to 10 AM on the outside terrace.

**Q: Does the hotel have morning coffee service?**
A: Coffee is available before 8 AM upon request.

**Q: Do you offer a day pass?**
A: We do not offer day passes at the moment. The team is happy to help you make a reservation if that's something you'd like.

**Q: What is the alcohol policy? Can I bring my own drinks?**
A: Beverages are available at Roots, the on-site bar, open to guests staying in the hotel from 12:00 PM to 10:00 PM. Outside alcohol is not permitted, as Roots is a full-service bar.

**Q: Does the hotel have air conditioner?**
A: Yes, all the rooms have air conditioner.

**Q: Does the hotel accept children?**
A: No, all of our guests must be 18 years old or above.

**Q: Does the hotel have TV's?**
A: Yes, all the rooms have a TV.

**Q: Does the hotel have a gym?**
A: No. We provide yoga mats upon request.

**Q: Are there any rooms that can accommodate more than 2 people?**
A: No, all of our rooms have one bed and are for double occupancy (2 people per room).

---

## Sister property — Boutique by the Museo (operator-confirmed, not on the public website)

The TreeHouse has a sister property called **Boutique by the Museo** at https://boutiquebythemuseo.com.

Where The TreeHouse is adults-only luxury, Boutique by the Museo is family-friendly. Families visiting Mérida love it. When a guest asks about bringing children, a third or fourth guest, or anything that runs into The TreeHouse's adults-only / two-guests-per-room policy, recommend Boutique by the Museo as the natural alternative. Mention that families love going there.

---

## Direct booking perks (operator-confirmed, not on the public website)

Guests who book direct through the website (and not through Booking.com, Expedia, or other OTAs) receive:

- A full breakfast every morning (8:00 to 10:00 AM on the terrace), with a rotating menu, brewed coffee, and bread from the hotel's café Pan & Kof.feé
- A complimentary beverage every evening at the Roots bar (open 12:00 PM to 10:00 PM)

These perks are not extended to OTA bookings. When discussing price differences with OTAs, surface these perks as part of the value of booking direct.

A 10% direct-booking discount is currently available under code THDIRECT. Excluded dates: December 20 through January 31. The discount is intended for new direct bookings within the 24-hour window after it is offered.

---

## Exclusive offers (verbatim)

**Group Deals:** "For groups larger than 10 people, please contact Reception for a group discount."

**Last Minute March Deal!:** "Please contact Reception for more information." Valid for stays during the month of March in 2026.

**Summer Special:** "Please contact Reception for more information." Valid for stays between June 1st – August 1st, 2026.

---

## Internal page references (for bot routing)

- Homepage: treehouseboutiquehotel.com
- Rooms: treehouseboutiquehotel.com/rooms/
- Gallery: treehouseboutiquehotel.com/gallery/
- Guest Services: treehouseboutiquehotel.com/guest-services/
- Exclusive Offers: treehouseboutiquehotel.com/exclusive-offers/
- Contact: treehouseboutiquehotel.com/contact/
- Journal: treehouseboutiquehotel.com/journal/
- FAQs: treehouseboutiquehotel.com/faqs/
- Policies: treehouseboutiquehotel.com/policies/
- Direct booking: direct-book.com/properties/treehouseboutiquehoteldirect
- Michelin Guide listing: guide.michelin.com/en/hotels-stays/merida/treehouse-boutique-hotel-11989
`;
