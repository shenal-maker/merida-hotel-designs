import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["system-ui", "sans-serif"],
      },
      colors: {
        treehouse: {
          // Deep forest-green text. Reads as charcoal on near-white background
          // but with a clear green undertone that ties the whole palette together.
          ink: "#1f3a26",
          // Near-white page background. The TreeHouse website rests on
          // crisp white with the slightest cream warmth.
          paper: "#fcfcf8",
          // Primary deep forest green. Used wherever the old palette used
          // "olive" — labels, hover states, the thinking indicator, the
          // send button. The single most visible accent color.
          olive: "#2d4a35",
          // Pale sage green. Soft accent for borders and dividers in a
          // green-dominant palette.
          sage: "#c5d6c0",
          // Mid forest green for higher-emphasis CTAs (Call button on
          // the escalation card, the percent number on the discount card,
          // focus rings). Used wherever the old palette had "terracotta"
          // — but green now, to keep the whole UI white-and-green.
          terracotta: "#4a6e54",
          // Very pale cream. Used for the user message bubble background
          // and subtle card borders. Adds a small breath of warmth so the
          // palette isn't entirely cool, without ever feeling dominant.
          sand: "#ece7d6",
        },
      },
    },
  },
  plugins: [],
};

export default config;
