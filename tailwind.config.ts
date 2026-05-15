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
          // Dark green-tinted charcoal for body text.
          ink: "#1c2a20",
          // Warm ivory background — the cream the TreeHouse site rests on.
          paper: "#f4ede0",
          // Deep forest green — primary brand accent.
          // Used wherever the old palette used olive: headings, labels,
          // hover, the Writing indicator, the send button.
          olive: "#1f3a26",
          // Mid-sage green for softer accents and dividers.
          sage: "#8a9a82",
          // Warm clay (not orange) — the secondary accent for CTAs and
          // the percent number on the discount card. Pops against the
          // green palette without fighting it. Replaces the older
          // terracotta-orange under the same class name.
          terracotta: "#a07a55",
          // Warm sand neutral for the user message bubble and card borders.
          sand: "#dfd3bb",
        },
      },
    },
  },
  plugins: [],
};

export default config;
