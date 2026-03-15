/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          DEFAULT: "#06f988",
          dark: "#04c56d",
          light: "#4aff9e",
        },
        surface: {
          DEFAULT: "#0a0c0b",
          1: "#111413",
          2: "#1a1c1b",
          3: "#242927",
          4: "#2e3330",
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 4s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        float: "float 3s ease-in-out infinite",
        "progress-bar": "progress-bar 2s ease-out forwards",
        glow: "glow 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-slow": {
          "0%,100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%,100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(3deg)" },
        },
        "progress-bar": {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width)" },
        },
        glow: {
          "0%,100%": { boxShadow: "0 0 20px rgba(6,249,136,0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(6,249,136,0.5)" },
        },
      },
      backgroundImage: {
        "dot-pattern":
          "radial-gradient(circle at 1px 1px, rgba(6,249,136,0.15) 1px, transparent 0)",
        "grid-pattern":
          "linear-gradient(rgba(6,249,136,0.05) 1px, transparent 1px), linear-gradient(to right, rgba(6,249,136,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-sm": "24px 24px",
        "dot-md": "40px 40px",
        "grid-md": "40px 40px",
      },
    },
  },
  plugins: [],
};
