// Shared types between the API route and the UI components.
// The bot emits structured UI actions as inline markers in its assistant text;
// the UI parses those markers and renders cards from the payloads below.

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
