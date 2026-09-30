import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Design tokens. A flat, color-blocked system: white canvas, #FBFBFB surfaces,
 * a dark green-black band, hairline borders, no shadows. Display type is a
 * serif; body/interface is Archivo. Disburs keeps its own accent family —
 * mint on dark, deep green on light — and its near-black green ink.
 */
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0E1A14",
        "ink-deep": "#08110D",
        "ink-soft": "#111D17",
        canvas: "#FFFFFF",
        subtle: "#FBFBFB",
        cream: "#FBF7F0",
        paper: "#FAFAF7",
        surface: "#FFFFFF",
        line: "#E5E7E3",
        muted: "#5B6B62",
        faint: "#8FA398",
        mint: "#12FF80",
        accent: "#07751A",
        "accent-soft": "#E6F6EC",
        // kept for the waitlist modal / legacy pages
        "mint-hover": "#0A9200",
        "light-bg": "#F5F5F5",
        "card-border": "#E8E8E8",
        link: "#0550AE",
        "mint-soft": "#DEF6E9",
        // shadcn/ui semantic tokens, defined as CSS variables in globals.css and
        // mapped onto the Disburs palette (primary = mint, ring = accent, …).
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        "muted-token": { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        "accent-token": { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
      },
      fontFamily: {
        sans: ["var(--font-primary)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },
      maxWidth: {
        container: "1376px",
      },
      borderRadius: {
        card: "24px",
        tile: "40px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [animate],
};

export default config;
