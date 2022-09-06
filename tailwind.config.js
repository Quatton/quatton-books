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
        "pageturn-front": "pageturn-front 1s ease-in-out",
        "pageturn-back": "pageturn-back 1s ease-in-out",
      },
      keyframes: {
        "pageturn-front": {
          from: {
            transform: "rotateY(0deg)",
          },
          to: {
            transform: "rotateY(180deg)",
          },
        },
        "pageturn-back": {
          from: {
            transform: "rotateY(-180deg)",
          },
          to: {
            transform: "rotateY(0deg)",
          },
        },
      },
    },
  },
  plugins: [],
};
