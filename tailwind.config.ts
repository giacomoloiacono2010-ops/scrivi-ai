import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        "bg-card": "var(--bg-card)",
        foreground: "var(--ink)",
        "ink-secondary": "var(--ink-secondary)",
        "ink-muted": "var(--ink-muted)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          light: "var(--accent-light)",
        },
        border: {
          DEFAULT: "var(--border)",
          hover: "var(--border-hover)",
        },
        sidebar: "var(--sidebar-bg)",
        warning: {
          bg: "var(--warning-bg)",
          border: "var(--warning-border)",
          text: "var(--warning-text)",
        },
        error: {
          bg: "var(--error-bg)",
          text: "var(--error-text)",
        },
        success: "var(--success)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
fontSize: {
  h1: ["26px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "-0.02em" }],
  h2: ["20px", { lineHeight: "1.3", fontWeight: "600" }],
  body: ["14px", { lineHeight: "1.65" }],
  label: ["13px", { fontWeight: "500" }],
  hint: ["12px", { lineHeight: "1.4" }],
  badge: ["11px", { lineHeight: "1.4" }],
},
      borderRadius: {
        DEFAULT: "6px",
        card: "10px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
export default config;