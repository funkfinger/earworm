/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#4e342e",
        text: "#ddd2a7",
        highlight: "#ef798a",
        "accent-a": "#727d71",
        "accent-b": "#586f7c",
      },
      fontFamily: {
        playpen: ["var(--font-playpen-sans)"],
      },
      animation: {
        wiggle: "wiggle 2.5s infinite",
        bounce: "bounce 0.5s",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
