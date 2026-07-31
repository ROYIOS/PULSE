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
        paper:      "#F1F2ED",
        "paper-d":  "#E7E9E1",
        ink:        "#1C2B39",
        "ink-soft": "#3B4B5C",
        steel:      "#34506B",
        "steel-l":  "#5A7896",
        sello:      "#B23A2E",
        "sello-l":  "#E8D3CF",
        aprobado:   "#2F6B4F",
        "aprobado-l": "#D6E6DC",
        folder:     "#C9A227",
        "folder-l": "#F3E7C1",
        line:       "#D7D9D2",
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

