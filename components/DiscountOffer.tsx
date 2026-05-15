"use client";

import { useState } from "react";
import type { OfferPayload } from "@/lib/types";

export function DiscountOffer({ payload }: { payload: OfferPayload }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(payload.code);
      } else {
        const ta = document.createElement("textarea");
        ta.value = payload.code;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Silent failure; user can still read the code.
    }
  };

  return (
    <div className="rounded-2xl border border-treehouse-sand bg-treehouse-paper p-5">
      <p className="font-serif text-[13px] uppercase tracking-[0.28em] text-treehouse-olive">
        Direct booking offer
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-serif text-7xl leading-none text-treehouse-terracotta">
          {payload.discount}%
        </span>
        <span className="font-serif text-2xl text-treehouse-ink/70">off</span>
      </div>
      <p className="font-serif mt-3 text-[19px] leading-relaxed text-treehouse-ink/85">
        {payload.message}
      </p>

      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy discount code ${payload.code}`}
        className="mt-4 flex w-full items-center justify-between rounded-xl border border-treehouse-sand bg-treehouse-paper px-4 py-3 text-left transition hover:border-treehouse-olive/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-treehouse-terracotta"
      >
        <span className="font-mono text-[19px] tracking-wide text-treehouse-ink">
          {payload.code}
        </span>
        <span className="font-serif text-xs uppercase tracking-[0.24em] text-treehouse-olive">
          {copied ? "Copied" : "Copy"}
        </span>
      </button>

      <p className="font-serif mt-3 text-base text-treehouse-olive">
        Valid for {payload.expires_hours} hours
      </p>
    </div>
  );
}
