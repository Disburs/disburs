import type { Config } from "tailwindcss";

/**
 * Design tokens. Semantic names, not raw hex in components.
 *
 * Palette: a deep green-black "ink" for dark surfaces and headings, a warm
 * off-white "paper" for light sections, and ONE accent family — mint is
 * luminous on dark surfaces (14:1), and `accent` is the deeper green that
 * stays readable on light surfaces (5.9:1). Brand continuity without neon.
 */
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0E1A14",
        "ink-deep": "#08110D",
        "ink-soft": "#111D17",
        paper: "#FAFAF7",
        surface: "#FFFFFF",
        line: "#E7ECE8",
        "line-dark": "rgba(255,255,255,0.10)",
        muted: "#5B6B62",
        faint: "#8FA398",
        mint: "#12FF80",
        "mint-dim": "#0AC765",
        accent: "#07751A",
        "accent-soft": "#E6F6EC",
        // kept for the waitlist modal / legacy pages
        "mint-hover": "#0A9200",
        "light-bg": "#F5F5F5",
        "card-border": "#E8E8E8",
        link: "#0550AE",
        "mint-soft": "#DEF6E9",
      },
      fontFamily: {
        sans: ["var(--font-primary)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },
      maxWidth: {
        container: "1200px",
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        button: "rgba(0,0,0,0.06) 0px 4px 4px 0px",
        card: "0 1px 2px rgba(14,26,20,0.04), 0 12px 32px -16px rgba(14,26,20,0.16)",
        "card-lg": "0 2px 4px rgba(14,26,20,0.04), 0 32px 64px -24px rgba(14,26,20,0.28)",
        glow: "0 0 0 1px rgba(18,255,128,0.18), 0 24px 60px -20px rgba(18,255,128,0.35)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
