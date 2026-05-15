# Integration Contract — Treehouse Booking Bot v0

This file is the interface spec for the three parallel build agents. Each agent owns specific files and must respect this contract so the pieces fit together at merge.

## Stack

- Next.js 15 App Router, TypeScript, Tailwind CSS
- AI SDK v5 (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/react`)
- Model: `claude-sonnet-4-6` (warm, concise, tone-sensitive)
- Anthropic API key: read from `process.env.ANTHROPIC_API_KEY`
- Knowledge base: import `KNOWLEDGE_BASE` from `@/lib/knowledge`

## File ownership

| File | Owner |
|------|-------|
| `lib/system-prompt.ts` | Agent A |
| `plan-bot-logic.md` | Agent A |
| `components/ChatWidget.tsx` | Agent B |
| `components/MessageBubble.tsx` | Agent B |
| `components/EscalationCard.tsx` | Agent B |
| `components/DiscountOffer.tsx` | Agent B |
| `app/api/chat/route.ts` | Agent C |
| `app/page.tsx` | Agent C |
| Any new chat-related styles in `app/globals.css` | Agent C |

## Interfaces

### Backend → LLM

`app/api/chat/route.ts` accepts:

```ts
POST /api/chat
Body: { messages: UIMessage[] }
```

Streams responses using `streamText` from `ai`. Passes the system prompt from `buildSystemPrompt()` and `KNOWLEDGE_BASE`. Uses the Anthropic provider's cache control to cache the system prompt across requests.

### LLM → UI: structured response protocol

The bot communicates UI actions through **inline markers in the assistant message text**. The UI parses these markers out of the streamed text and renders them as cards.

Three marker formats, each on its own line:

```
[[OFFER discount=8 code=TH-DIRECT-8 expires_hours=24 message="An 8% direct booking discount, good for the next 24 hours."]]

[[ESCALATE_DESK reason="screenshot_review" summary="Guest sent Booking.com screenshot for July 4-7, requesting price match" phone="+529999318351"]]

[[ESCALATE_OWNER reason="group_booking" summary="Guest asking about 12-person wedding party in March" phone="+529999318351"]]
```

The UI renders each marker as a card immediately after the paragraph it sits in. The marker line itself should not appear as raw text.

Quoted values use double quotes. Unquoted values are bare strings or numbers. Spaces are allowed inside quoted values.

### Bot persona / tone

Defined by Agent A in `lib/system-prompt.ts`. **Tone is non-negotiable: warm concierge voice, no AI tells, no em-dashes, no "I'd be happy to" tropes, no exclamation overuse, refer to the hotel as "The Treehouse."** The prompt enforces these constraints explicitly.

### Bilingual

The bot greets in English by default but asks the guest's language preference once on first turn ("Would you prefer English or Spanish?") and continues in the chosen language for the rest of the session.

## Shared types (Agent C writes these, Agents A & B import)

```ts
// lib/types.ts — Agent C creates if needed
export type EscalationKind = "desk" | "owner";
export interface OfferPayload {
  discount: number;
  code: string;
  expires_hours: number;
  message: string;
}
export interface EscalationPayload {
  kind: EscalationKind;
  reason: string;
  summary: string;
  phone: string;
}
```

## Environment

- `ANTHROPIC_API_KEY` is required at runtime. Configured in `.env.local` (not committed).
- The knowledge base lives at `knowledge.md` in the project root and is loaded by `lib/knowledge.ts`.

## What v0 is NOT building

- Screenshot OCR / vision verification (deferred — human review path)
- Real LH coupon API integration (deferred — pre-generated codes for now)
- Real WhatsApp/SMS handoff (deferred — phone link only)
- Authentication or rate limiting (deferred)
- Conversation persistence across page reloads (deferred)
- Production deployment (deferred — local `npm run dev` first)
