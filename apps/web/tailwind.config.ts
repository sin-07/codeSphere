import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: "#050806", // Deepest space black
          900: "#080d0a", // Panel background
          850: "#0c120e", // Card surface
          800: "#111813", // Hover card surface
          700: "#18221a", // Deep active
          600: "#223025", // Soft border
          500: "#324838", // Medium border
          400: "#607d68", // Subtle text
          300: "#91a897", // Secondary text
          200: "#c7d8cb", // Primary body text
          100: "#f0f7f2", // Crisp white
        },
        dark: {
          950: "#050806",
          900: "#080d0a",
          850: "#0c120e",
          800: "#111813",
          700: "#18221a",
          600: "#223025",
          500: "#324838",
          400: "#607d68",
          300: "#91a897",
          200: "#c7d8cb",
          100: "#f0f7f2",
        },
        emerald: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981", // Linear emerald primary
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        cyber: {
          neon: "#10b981",
          matrix: "#34d399",
          glow: "rgba(16, 185, 129, 0.2)",
        },
      },
      boxShadow: {
        'emerald-sm': '0 0 15px rgba(16, 185, 129, 0.15)',
        'emerald-md': '0 0 25px rgba(16, 185, 129, 0.22)',
        'emerald-lg': '0 0 45px rgba(16, 185, 129, 0.3)',
        'card-glow': '0 0 0 1px rgba(16, 185, 129, 0.15), 0 8px 24px -4px rgba(0, 0, 0, 0.6)',
        'card-hover': '0 0 0 1px rgba(16, 185, 129, 0.35), 0 12px 32px -4px rgba(16, 185, 129, 0.15)',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'laser-sweep': 'sweep 2.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
export default config;
