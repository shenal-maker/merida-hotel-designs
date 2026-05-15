// Server-side notification module. Forwards escalation summaries to the front
// desk by SMS via Twilio. Silent on errors — a failed SMS should never break
// the chat stream.

import twilio from "twilio";
import type { EscalationKind } from "./types";

const ESCALATE_RE = /\[\[(ESCALATE_DESK|ESCALATE_OWNER)\s+([^\]]+)\]\]/g;
const KV_RE = /(\w+)=(?:"([^"]*)"|(\S+))/g;

interface ParsedEscalation {
  kind: EscalationKind;
  reason: string;
  summary: string;
  phone: string;
}

function parseKv(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  let match: RegExpExecArray | null;
  KV_RE.lastIndex = 0;
  while ((match = KV_RE.exec(body)) !== null) {
    const value = match[2] !== undefined ? match[2] : match[3] ?? "";
    out[match[1]] = value;
  }
  return out;
}

export function extractEscalations(text: string): ParsedEscalation[] {
  const found: ParsedEscalation[] = [];
  let match: RegExpExecArray | null;
  ESCALATE_RE.lastIndex = 0;
  while ((match = ESCALATE_RE.exec(text)) !== null) {
    const kv = parseKv(match[2]);
    if (!kv.reason || !kv.summary || !kv.phone) continue;
    found.push({
      kind: match[1] === "ESCALATE_OWNER" ? "owner" : "desk",
      reason: kv.reason,
      summary: kv.summary,
      phone: kv.phone,
    });
  }
  return found;
}

function formatSmsBody(e: ParsedEscalation): string {
  const route = e.kind === "owner" ? "Treehouse chat → owner" : "Treehouse chat → desk";
  return `${route} [${e.reason}]\n${e.summary}`;
}

let cachedClient: ReturnType<typeof twilio> | null = null;

function getClient(): ReturnType<typeof twilio> | null {
  if (cachedClient) return cachedClient;
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  cachedClient = twilio(sid, token);
  return cachedClient;
}

/**
 * Send escalation summaries from the assistant's final message text to the
 * front desk by SMS. Idempotency is not handled here; the system prompt
 * constrains the bot to emit at most one escalation marker per thread.
 */
export async function forwardEscalations(assistantText: string): Promise<void> {
  const escalations = extractEscalations(assistantText);
  if (escalations.length === 0) return;

  const client = getClient();
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!client || !fromNumber) {
    // Credentials not set; log the summary so it isn't lost during local dev.
    for (const e of escalations) {
      console.warn(
        `[notify] Twilio not configured — escalation captured only in logs: ${e.kind} / ${e.reason}`
      );
      console.warn(`[notify] summary: ${e.summary}`);
    }
    return;
  }

  await Promise.all(
    escalations.map(async (e) => {
      try {
        const message = await client.messages.create({
          body: formatSmsBody(e),
          from: fromNumber,
          to: e.phone,
        });
        console.log(`[notify] sent ${e.kind} SMS (sid ${message.sid})`);
      } catch (err) {
        const name = err instanceof Error ? err.name : "unknown";
        console.error(`[notify] SMS send failed for ${e.kind}/${e.reason}: ${name}`);
      }
    })
  );
}
