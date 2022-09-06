/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bistre: "#3E2612",
        camel: "#C79669",
        hunter: "#205C2B",
      },
      animation: {
        "pageturn-front": "pageturn-front 1s ease-in-out forwards",
        "pageturn-back": "pageturn-back 1s ease-in-out forwards",
      },
      keyframes: {
        "pageturn-front": {
          "0%": {
            transform: "rotateY(0deg)",
            zIndex: "51",
            display: "block",
          },
          "100%": {
            transform: "rotateY(180deg)",
            zIndex: "50",
            display: "none",
          },
        },
        "pageturn-back": {
          "100%": {
            transform: "rotateY(180deg)",
            zIndex: "50",
            display: "block",
          },
          "0%": {
            transform: "rotateY(0deg)",
            zIndex: "51",
            display: "none",
          },
        },
      },
    },
  },
  plugins: [],
};
