import { anthropic } from "@ai-sdk/anthropic";
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { buildSystemPrompt } from "@/lib/system-prompt";
import { forwardEscalations } from "@/lib/notify";

// We read knowledge.md from disk inside lib/knowledge.ts, so this route must
// run on the Node.js runtime, not the Edge runtime.
export const runtime = "nodejs";

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "Server is missing ANTHROPIC_API_KEY. Set it in .env.local and restart the dev server.",
      }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  let body: { messages: UIMessage[] };
  try {
    body = (await req.json()) as { messages: UIMessage[] };
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body." }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  const { messages } = body;
  if (!Array.isArray(messages)) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid 'messages' array." }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  try {
    const result = streamText({
      model: anthropic("claude-sonnet-4-6"),
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(),
          providerOptions: {
            anthropic: {
              cacheControl: { type: "ephemeral" },
            },
          },
        },
        ...convertToModelMessages(messages),
      ],
      onError({ error }) {
        console.error("[chat] stream error:", error instanceof Error ? error.name : "unknown");
      },
      onFinish({ text }) {
        // Side-effect: forward any escalation markers in the final assistant
        // message to the front desk by SMS. Awaited inside a fire-and-forget
        // wrapper so a slow Twilio call cannot delay the stream response.
        void forwardEscalations(text).catch((err) => {
          console.error(
            "[chat] forwardEscalations failed:",
            err instanceof Error ? err.name : "unknown"
          );
        });
      },
    });

    return result.toUIMessageStreamResponse({
      onError: () => "The concierge is briefly unavailable. Please try again.",
    });
  } catch (err) {
    const code =
      err instanceof Error && err.name ? err.name : "UpstreamError";
    return new Response(
      JSON.stringify({
        error: "The concierge is briefly unavailable. Please try again.",
        code,
      }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  }
}
