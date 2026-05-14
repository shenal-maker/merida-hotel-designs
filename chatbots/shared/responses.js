/* Shared response engine for all 4 chatbot patterns.
   Scripted intent matching only — no LLM call.
   Facts sourced from TRIM_BRIEF.md "What's TRUE" section. */
(function () {
  "use strict";

  var INTENTS = [
    { name: "rooms",      kws: ["room", "rooms", "suite", "suites", "stay", "book", "reserve", "habitacion", "habitación"] },
    { name: "prices",     kws: ["price", "prices", "cost", "rate", "rates", "how much", "from", "precio"] },
    { name: "dates",      kws: ["date", "dates", "available", "availability", "when", "calendar"] },
    { name: "art",        kws: ["art", "gallery", "soho", "treehouse", "tree house", "exhibition", "arte"] },
    { name: "michelin",   kws: ["michelin", "key", "award", "accolade", "travellers", "travelers choice"] },
    { name: "location",   kws: ["where", "location", "address", "map", "direccion", "dirección", "neighborhood", "santa ana", "montejo"] },
    { name: "food",       kws: ["food", "restaurant", "dinner", "breakfast", "menu", "eat", "comida", "cocina"] },
    { name: "anniversary",kws: ["anniversary", "honeymoon", "luna de miel", "romantic", "wedding"] },
    { name: "children",   kws: ["child", "children", "kid", "kids", "family", "familia", "baby"] },
    { name: "transfer",   kws: ["transfer", "airport", "mid", "pickup", "shuttle", "aeropuerto", "traslado"] }
  ];

  function matchIntent(query) {
    if (!query) return "default";
    var q = String(query).toLowerCase();
    for (var i = 0; i < INTENTS.length; i++) {
      var kws = INTENTS[i].kws;
      for (var j = 0; j < kws.length; j++) {
        if (q.indexOf(kws[j]) !== -1) return INTENTS[i].name;
      }
    }
    return "default";
  }

  // Hotel-specific response payloads. Each intent has { boutique, treehouse }.
  // Each payload: { text, suggestions: [2-3 chips] }
  var RESPONSES = {
    rooms: {
      boutique: {
        text: "The house has fifteen rooms across four types — Deluxe Boutique Room, Deluxe Boutique Suite, Grand Boutique Suite, and the Penthouse Suite. Rates begin at $295. Each one sits inside the same restored building, steps from Palacio Cantón.",
        suggestions: ["What's the Penthouse like?", "Tell me about offers", "Where exactly are you?"]
      },
      treehouse: {
        text: "Fifteen rooms, adults-only, arranged around the courtyard and its canopy. Rates begin at $325. The Michelin guide gave the house its first Key in Mérida in 2025 — the rooms are what earned it.",
        suggestions: ["What's the art program?", "Tell me about the 5-night offer", "Is it really adults-only?"]
      }
    },

    prices: {
      boutique: {
        text: "Rates start at $295 per night. Stay six nights or longer and you fall into the Resident's Allocation — complimentary airport transfer on arrival and a small surprise from the house. June through August, the summer rate is 20% off.",
        suggestions: ["What rooms are available?", "Tell me about the transfer", "Show me the dates"]
      },
      treehouse: {
        text: "Rates start at $325 per night. Five nights or longer brings the rate down by 30% — the house is built for slower stays.",
        suggestions: ["What rooms are available?", "Where are you exactly?", "Tell me about the art"]
      }
    },

    dates: {
      boutique: {
        text: "Live availability lives in the booking widget above. The date pickers are ready for you there.",
        suggestions: ["Tell me about the rooms", "What are the rates?", "How do I get there?"]
      },
      treehouse: {
        text: "Live availability lives in the booking widget above. The date pickers are ready for you there.",
        suggestions: ["Tell me about the rooms", "What are the rates?", "Is the 5-night offer always on?"]
      }
    },

    art: {
      boutique: {
        text: "The art program lives at our sister property, Tree House — a curated rotation in partnership with SoHo Galleries here in Mérida. Guests stay inside the exhibition. If you'd like to see it, the Tree House is a short walk away in Santa Ana.",
        suggestions: ["Tell me about Tree House", "Where is Santa Ana?", "Show me the rooms"]
      },
      treehouse: {
        text: "Tree House is the namesake venue for a curated program with SoHo Galleries here in Mérida. Works rotate; guests live inside the exhibition rather than visit it.",
        suggestions: ["Tell me about the rooms", "What's the Michelin Key?", "Where are you exactly?"]
      }
    },

    michelin: {
      boutique: {
        text: "The Michelin Key belongs to our sister property, Tree House — Mérida's first, awarded in 2025. The Boutique sits in the same family but isn't part of the guide.",
        suggestions: ["Tell me about Tree House", "Show me the rooms here", "Where are you exactly?"]
      },
      treehouse: {
        text: "Tree House holds the first Michelin Key in Mérida, awarded in 2025. We also carry a Travellers' Choice. It's a fifteen-room adults-only house — the scale is part of the answer.",
        suggestions: ["Tell me about the rooms", "What's the art program?", "Where exactly are you?"]
      }
    },

    location: {
      boutique: {
        text: "Paseo de Montejo, steps from Palacio Cantón, fifteen minutes from MID. The historic center sits at the door — restaurants, walks, and the cathedral are all on foot.",
        suggestions: ["What's nearby?", "Tell me about the transfer", "Show me the rooms"]
      },
      treehouse: {
        text: "Santa Ana neighborhood, Calle 43 × 58 y 60, #489. Fifteen minutes from MID. The plaza and its market are around the corner; Paseo de Montejo is a short walk.",
        suggestions: ["Tell me about the transfer", "What's nearby?", "Show me the rooms"]
      }
    },

    food: {
      boutique: {
        text: "We're not a restaurant — Mérida is. The Paseo de Montejo blocks have most of what you'd want for dinner, and the concierge can point you. Ask about a specific kind of meal and we'll narrow it.",
        suggestions: ["What's on Paseo de Montejo?", "Tell me about the rooms", "How do I get there?"]
      },
      treehouse: {
        text: "We're not a restaurant — Mérida is. Santa Ana's plaza and market are a block away, and the concierge can suggest what to walk to. Ask about a specific kind of meal and we'll narrow it.",
        suggestions: ["What's around Santa Ana?", "Tell me about the rooms", "What's the art program?"]
      }
    },

    anniversary: {
      boutique: {
        text: "Yes — there's a Honeymoon Package, and the house handles the small things quietly. Tell us the dates and the occasion when you reserve, and we'll prepare the room.",
        suggestions: ["What rooms suit two?", "Tell me about the rates", "How long should we stay?"]
      },
      treehouse: {
        text: "We're adults-only and the property is built for it — there isn't a formal honeymoon package because the whole house already reads that way. Tell us the occasion when you reserve and we'll prepare quietly.",
        suggestions: ["What rooms suit two?", "Tell me about the 5-night offer", "What's the art program?"]
      }
    },

    children: {
      boutique: {
        text: "Yes — the Boutique welcomes families. Tell us ages and we'll set the room up accordingly.",
        suggestions: ["What rooms fit a family?", "Tell me about the rates", "How do I get there?"]
      },
      treehouse: {
        text: "Tree House is adults-only. If you're traveling with children, our sister property, the Boutique by The Museo on Paseo de Montejo, is family-friendly.",
        suggestions: ["Tell me about the Boutique", "What rooms suit two?", "Where are you exactly?"]
      }
    },

    transfer: {
      boutique: {
        text: "MID is fifteen minutes away. Six nights or longer and the arrival transfer is on the house — part of the Resident's Allocation. Shorter stays, we can arrange one for you.",
        suggestions: ["Tell me about the 6-night offer", "Show me the rooms", "What rates apply?"]
      },
      treehouse: {
        text: "MID is fifteen minutes away. We can arrange your transfer — share your flight details when you reserve.",
        suggestions: ["Show me the rooms", "Tell me about the 5-night offer", "Where are you exactly?"]
      }
    },

    "default": {
      boutique: {
        text: "I'm a demo of a chat experience — not a live concierge yet. Tell me what you'd actually want to ask a hotel like this, and we'll use it to decide what to build next.",
        suggestions: ["Tell me about the rooms", "What are the rates?", "Where are you exactly?"]
      },
      treehouse: {
        text: "I'm a demo of a chat experience — not a live concierge yet. Tell me what you'd actually want to ask a hotel like this, and we'll use it to decide what to build next.",
        suggestions: ["Tell me about the rooms", "What's the art program?", "Where are you exactly?"]
      }
    }
  };

  var WELCOME = {
    boutique: "Bienvenida. This is a demo of a chat experience for the Boutique by The Museo — fifteen rooms on Paseo de Montejo. Ask about rooms, rates, or the house itself.",
    treehouse: "Bienvenida. This is a demo of a chat experience for Tree House — fifteen rooms in Santa Ana, adults-only, Mérida's first Michelin Key. Ask about rooms, rates, or the art."
  };

  function pickHotel(hotel) {
    return hotel === "treehouse" ? "treehouse" : "boutique";
  }

  function match(hotel, query) {
    var h = pickHotel(hotel);
    var intent = matchIntent(query);
    var bucket = RESPONSES[intent] || RESPONSES["default"];
    var payload = bucket[h] || bucket.boutique;
    return {
      text: payload.text,
      suggestions: payload.suggestions.slice(),
      intent: intent
    };
  }

  function welcome(hotel) {
    var h = pickHotel(hotel);
    return WELCOME[h];
  }

  window.ChatbotResponses = {
    match: match,
    welcome: welcome,
    intents: INTENTS.map(function (i) { return i.name; }).concat(["default"])
  };
})();
