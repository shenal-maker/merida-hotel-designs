"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { MessageBubble } from "@/components/MessageBubble";

const GREETING =
  "Welcome to The TreeHouse. I can help with rooms, bookings, or anything about your stay. Would you prefer English or Spanish?\n\nLe damos la bienvenida a The TreeHouse. Puedo ayudarle con habitaciones, reservas, o cualquier consulta sobre su estancia. ¿Prefiere inglés o español?";

const INITIAL_MESSAGES: UIMessage[] = [
  {
    id: "treehouse-greeting",
    role: "assistant",
    parts: [{ type: "text", text: GREETING }],
  },
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    messages: INITIAL_MESSAGES,
  });

  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, status, open]);

  const onPanelKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const root = panelRef.current;
    if (!root) return;
    const focusables = root.querySelectorAll<HTMLElement>(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const list = Array.from(focusables).filter(
      (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1
    );
    if (list.length === 0) return;
    const first = list[0];
    const last = list[list.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isBusy) return;
    setInput("");
    void sendMessage({ text });
  };

  const showWriting = useMemo(() => {
    if (!isBusy) return false;
    const last = messages[messages.length - 1];
    if (!last) return true;
    if (last.role === "user") return true;
    const hasText = last.parts?.some(
      (p) => p.type === "text" && typeof p.text === "string" && p.text.length > 0
    );
    return !hasText;
  }, [isBusy, messages]);

  return (
    <>
      <button
        type="button"
        aria-label="Open concierge chat"
        onClick={() => setOpen(true)}
        className={
          "fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full " +
          "bg-treehouse-ink text-treehouse-paper shadow-[0_10px_30px_-12px_rgba(26,24,21,0.45)] " +
          "transition hover:bg-treehouse-olive focus:outline-none focus-visible:ring-2 " +
          "focus-visible:ring-treehouse-terracotta focus-visible:ring-offset-2 " +
          "focus-visible:ring-offset-treehouse-paper " +
          (open ? "pointer-events-none opacity-0" : "opacity-100")
        }
      >
        <ChatGlyph />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Concierge chat"
          onKeyDown={onPanelKeyDown}
          className={
            "fixed z-[70] flex flex-col bg-treehouse-paper text-treehouse-ink " +
            "shadow-[0_30px_80px_-30px_rgba(26,24,21,0.45)] " +
            "inset-0 sm:inset-auto sm:bottom-6 sm:right-6 " +
            "sm:h-[680px] sm:w-[460px] sm:rounded-2xl " +
            "border border-treehouse-sand/70"
          }
        >
          <header className="flex items-center justify-between px-5 py-4">
            <div className="font-serif">
              <p className="text-[13px] uppercase tracking-[0.32em] text-treehouse-olive">
                Concierge
              </p>
              <p className="mt-1 text-2xl text-treehouse-ink">
                The TreeHouse
              </p>
            </div>
            <button
              type="button"
              aria-label="Close concierge chat"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-treehouse-ink/70 transition hover:bg-treehouse-sand/40 hover:text-treehouse-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-treehouse-terracotta"
            >
              <CloseGlyph />
            </button>
          </header>

          <div className="h-px w-full bg-treehouse-sand/70" />

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-5 py-5"
          >
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}

            {showWriting && (
              <p className="mt-3 font-serif text-lg italic text-treehouse-olive animate-pulse">
                thinking...
              </p>
            )}

            {error && (
              <p className="mt-3 font-serif text-lg text-treehouse-terracotta">
                Something went wrong. Please try again.
              </p>
            )}
          </div>

          <div className="h-px w-full bg-treehouse-sand/70" />

          <form onSubmit={onSubmit} className="px-4 py-3">
            <div className="flex items-center gap-2 rounded-xl border border-treehouse-sand/70 bg-treehouse-paper px-3 py-2 focus-within:border-treehouse-olive/60">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your stay"
                aria-label="Message the concierge"
                className="flex-1 bg-transparent font-serif text-[20px] text-treehouse-ink placeholder:text-treehouse-ink/40 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isBusy || input.trim().length === 0}
                aria-label="Send message"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-treehouse-ink text-treehouse-paper transition hover:bg-treehouse-olive disabled:cursor-not-allowed disabled:bg-treehouse-sand disabled:text-treehouse-ink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-treehouse-terracotta"
              >
                <SendGlyph />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function ChatGlyph() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
    </svg>
  );
}

function CloseGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function SendGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12l14-7-5 16-3-7-6-2z" />
    </svg>
  );
}
