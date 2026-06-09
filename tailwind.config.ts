import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mint: "#12FF80",
        "mint-hover": "#0A9200",
        ink: "#1A1A1A",
        muted: "#8A8F98",
        "light-bg": "#F5F5F5",
        "card-border": "#E8E8E8",
        link: "#0550AE",
        "mint-soft": "#DEF6E9",
      },
      fontFamily: {
        sans: ["var(--font-primary)"],
      },
      maxWidth: {
        container: "1440px",
      },
      boxShadow: {
        button: "rgba(0,0,0,0.06) 0px 4px 4px 0px",
      },
      borderRadius: {
        card: "20px",
      },
    },
  },
  plugins: [],
};

export default config;
