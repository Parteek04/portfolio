/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        darkBg: "#030712", // Slate 950
        darkCard: "rgba(17, 24, 39, 0.7)", // Zinc/Slate transparent card
        accentPrimary: {
          DEFAULT: "#6366f1", // Indigo 500
          hover: "#4f46e5"
        },
        accentSecondary: {
          DEFAULT: "#a855f7", // Purple 500
          hover: "#9333ea"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"]
      },
      animation: {
        "blob": "blob 7s infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "grid-flow": "grid-flow 20s linear infinite"
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.95)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      backdropBlur: {
        xs: "2px",
      }
    },
  },
  plugins: [],
}
