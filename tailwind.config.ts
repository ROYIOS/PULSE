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
        navy:     "#0A1628",
        blue:     "#1A3A6B",
        cyan:     "#00B4D8",
        "cyan-l": "#CAF0F8",
        teal:     "#0F6E56",
        coral:    "#D85A30",
        slate:    "#4A6080",
        muted:    "#8BA3BF",
        bg:       "#F4F8FB",
        border:   "#D8E6F0",
      },
      fontFamily: {
        sans:  ["var(--font-geist-sans)"],
        mono:  ["var(--font-geist-mono)"],
        serif: ["Georgia", "serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        sm: "0 1px 4px rgba(10,22,40,.06)",
        md: "0 4px 16px rgba(10,22,40,.09)",
        lg: "0 12px 40px rgba(10,22,40,.14)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
