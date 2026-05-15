"use client";

import type { EscalationPayload } from "@/lib/types";

function formatPhone(raw: string): string {
  const trimmed = raw.trim();
  const mx = trimmed.match(/^\+?52(\d{3})(\d{3})(\d{4})$/);
  if (mx) {
    return `+52 ${mx[1]} ${mx[2]} ${mx[3]}`;
  }
  return trimmed;
}

export function EscalationCard({ payload }: { payload: EscalationPayload }) {
  const title =
    payload.kind === "owner"
      ? "Speak with the owner"
      : "Speak with the front desk";
  const pretty = formatPhone(payload.phone);
  const rawTel = payload.phone.replace(/\s+/g, "");

  return (
    <div className="rounded-2xl border border-treehouse-sand bg-treehouse-paper p-5">
      <p className="font-serif text-[13px] uppercase tracking-[0.28em] text-treehouse-olive">
        Concierge handoff
      </p>
      <h3 className="font-serif mt-2 text-2xl text-treehouse-ink">
        {title}
      </h3>
      <p className="font-serif mt-1 text-[19px] text-treehouse-ink/80">
        {pretty}
      </p>
      <p className="font-serif mt-3 text-lg text-treehouse-ink/65">
        The team will have your conversation ready when you reach out.
      </p>
      <div className="mt-4 flex gap-2">
        <a
          href={`tel:${rawTel}`}
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-treehouse-terracotta px-4 py-2 font-serif text-[19px] text-treehouse-paper transition hover:bg-treehouse-terracotta/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-treehouse-ink"
        >
          Call
        </a>
        <a
          href={`sms:${rawTel}`}
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-treehouse-olive/60 px-4 py-2 font-serif text-[19px] text-treehouse-olive transition hover:bg-treehouse-olive/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-treehouse-terracotta"
        >
          Message
        </a>
      </div>
    </div>
  );
}
