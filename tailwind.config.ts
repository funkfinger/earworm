import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-playpen)"],
        playpen: ["var(--font-playpen)"],
      },
      colors: {
        // Theme colors
        primary: {
          DEFAULT: "#4e342e", // Brown background
          foreground: "#ddd2a7", // Light yellow text
        },
        secondary: {
          DEFAULT: "#ef798a", // Pink highlight
          hover: "#f08c9c",
          active: "#d86a7a",
        },
        accent: {
          a: {
            DEFAULT: "#727d71", // Muted green accent
            hover: "#828e80",
            active: "#636d61",
          },
          b: {
            DEFAULT: "#586f7c", // Blue-gray accent
            hover: "#69808c",
            active: "#4a5e6a",
          },
        },
        // UI colors
        background: "#4e342e",
        foreground: "#ddd2a7",
        muted: {
          DEFAULT: "#727d71",
          foreground: "#ddd2a7",
        },
        border: "#ef798a",
        input: "#586f7c",
        ring: "#ef798a",
        // Utility colors
        success: "#4caf50",
        warning: "#ff9800",
        error: "#f44336",
        info: "#2196f3",
      },
      animation: {
        "bounce-short": "bounce 0.5s ease-in-out 2",
        wiggle: "wiggle 1s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      borderRadius: {
        blob: "60% 40% 50% 50% / 40% 50% 50% 60%",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        cute: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "cute-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [animate],
};

export default config;
