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
        // Main color palette from README
        background: "#4e342e", // Brown background
        text: "#ddd2a7", // Light yellow text
        highlight: "#ef798a", // Pink highlight
        "accent-a": "#727d71", // Muted green accent
        "accent-b": "#586f7c", // Blue-gray accent

        // Extended palette for various states
        "highlight-hover": "#f08c9c",
        "highlight-active": "#d86a7a",
        "accent-a-hover": "#828e80",
        "accent-a-active": "#636d61",
        "accent-b-hover": "#69808c",
        "accent-b-active": "#4a5e6a",

        // Utility colors
        success: "#4caf50",
        warning: "#ff9800",
        error: "#f44336",
        info: "#2196f3",
      },
      fontFamily: {
        playpen: ["Playpen Sans", "cursive"],
      },
      animation: {
        "bounce-short": "bounce 0.5s ease-in-out 2",
        wiggle: "wiggle 1s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      borderRadius: {
        blob: "60% 40% 50% 50% / 40% 50% 50% 60%",
      },
      boxShadow: {
        cute: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "cute-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
