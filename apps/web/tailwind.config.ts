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
        dark: {
          950: "#000000", // Pure pitch black
          900: "#040604", // Obsidian deep
          850: "#080c08", // Cyber surface
          800: "#0d140d", // Card surface
          700: "#131f13", // Hover surface
          600: "#1a2c1a", // Deep border
          500: "#274227", // Medium border
          400: "#4e774e", // Subtle text
          300: "#86a686", // Secondary text
          200: "#c2d6c2", // High contrast text
          100: "#f0faf0", // Crisp pure white-green
        },
        cyber: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#10b981", // Emerald base
          600: "#059669",
          neon: "#00ff66", // High-voltage Matrix neon
          matrix: "#00e575",
          dim: "#003b17",
        },
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          400: "#4ade80",
          500: "#10b981",
          600: "#00e575",
          700: "#00ff66",
        },
      },
      boxShadow: {
        'neon-sm': '0 0 10px rgba(0, 255, 102, 0.25)',
        'neon-md': '0 0 20px rgba(0, 255, 102, 0.4)',
        'neon-lg': '0 0 35px rgba(0, 255, 102, 0.55)',
        'neon-border': '0 0 0 1px rgba(0, 255, 102, 0.35)',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
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
