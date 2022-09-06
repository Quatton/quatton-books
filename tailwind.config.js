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
    },
  },
  plugins: [],
};
