import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper:      "#FFFFFF",
        "paper-d":  "#EEF2F8",
        ink:        "#1E2A4A",
        "ink-soft": "#5C6579",
        steel:      "#2D4A7A",
        "steel-l":  "#6B83A8",
        sello:      "#C0392B",
        "sello-l":  "#F5DEDC",
        aprobado:   "#2E7D5B",
        "aprobado-l": "#DCEEE5",
        folder:     "#0F9DA6",
        "folder-l": "#D6F0F2",
        line:       "#DDE1EA",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans:  ["var(--font-sans)"],
        mono:  ["var(--font-mono)"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(28,43,57,.06)",
        md: "0 4px 14px rgba(28,43,57,.08)",
        lg: "0 10px 32px rgba(28,43,57,.12)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

