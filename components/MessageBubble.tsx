"use client";

import type { UIMessage } from "ai";
import type { OfferPayload, EscalationPayload } from "@/lib/types";
import { DiscountOffer } from "@/components/DiscountOffer";
import { EscalationCard } from "@/components/EscalationCard";

type MarkerName = "OFFER" | "ESCALATE_DESK" | "ESCALATE_OWNER";

type Segment =
  | { kind: "text"; text: string }
  | { kind: "offer"; payload: OfferPayload }
  | { kind: "escalation"; payload: EscalationPayload };

const MARKER_RE = /\[\[(OFFER|ESCALATE_DESK|ESCALATE_OWNER)\s+([^\]]+)\]\]/g;
const KV_RE = /(\w+)=(?:"([^"]*)"|(\S+))/g;

function parseKeyValues(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  let match: RegExpExecArray | null;
  KV_RE.lastIndex = 0;
  while ((match = KV_RE.exec(body)) !== null) {
    const key = match[1];
    const value = match[2] !== undefined ? match[2] : match[3] ?? "";
    out[key] = value;
  }
  return out;
}

function buildSegment(name: MarkerName, body: string): Segment | null {
  const kv = parseKeyValues(body);

  if (name === "OFFER") {
    const discount = Number(kv.discount);
    const expires = Number(kv.expires_hours);
    if (!kv.code || !kv.message || Number.isNaN(discount) || Number.isNaN(expires)) {
      return null;
    }
    return {
      kind: "offer",
      payload: {
        discount,
        code: kv.code,
        expires_hours: expires,
        message: kv.message,
      },
    };
  }

  if (!kv.reason || !kv.summary || !kv.phone) {
    return null;
  }
  return {
    kind: "escalation",
    payload: {
      kind: name === "ESCALATE_DESK" ? "desk" : "owner",
      reason: kv.reason,
      summary: kv.summary,
      phone: kv.phone,
    },
  };
}

function parseAssistantText(raw: string): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  MARKER_RE.lastIndex = 0;

  while ((match = MARKER_RE.exec(raw)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    if (start > cursor) {
      const text = raw.slice(cursor, start);
      if (text.length > 0) segments.push({ kind: "text", text });
    }
    const seg = buildSegment(match[1] as MarkerName, match[2]);
    if (seg) segments.push(seg);
    cursor = end;
  }

  let tail = raw.slice(cursor);

  const openIdx = tail.lastIndexOf("[[");
  if (openIdx !== -1) {
    const afterOpen = tail.slice(openIdx);
    if (!afterOpen.includes("]]")) {
      tail = tail.slice(0, openIdx);
    }
  }

  if (tail.length > 0) segments.push({ kind: "text", text: tail });

  return segments;
}

function TextSegment({ text }: { text: string }) {
  const cleaned = text.replace(/^\n+|\n+$/g, "");
  if (cleaned.length === 0) return null;
  return (
    <p className="font-serif text-[20px] leading-relaxed text-treehouse-ink whitespace-pre-wrap">
      {cleaned}
    </p>
  );
}

export function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = (message.parts ?? [])
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");

  if (isUser) {
    if (text.length === 0) return null;
    return (
      <div className="mb-4 flex justify-end">
        <div className="max-w-[80%] rounded-2xl bg-treehouse-sand/60 px-4 py-2.5">
          <p className="font-serif text-[20px] leading-relaxed text-treehouse-ink whitespace-pre-wrap">
            {text}
          </p>
        </div>
      </div>
    );
  }

  const segments = parseAssistantText(text);
  if (segments.length === 0) return null;

  return (
    <div className="mb-5 space-y-3">
      {segments.map((seg, i) => {
        if (seg.kind === "text") {
          return <TextSegment key={i} text={seg.text} />;
        }
        if (seg.kind === "offer") {
          return <DiscountOffer key={i} payload={seg.payload} />;
        }
        return <EscalationCard key={i} payload={seg.payload} />;
      })}
    </div>
  );
}
