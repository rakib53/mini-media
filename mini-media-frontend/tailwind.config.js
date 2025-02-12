/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#615EF0",
      },
      backgroundColor: {
        primary: "#615EF0",
      },
      fontFamily: {
        Inter: '"Inter", sans-serif',
        Asap: '"Asap", sans-serif',
      },
    },
  },
  plugins: [],
};
