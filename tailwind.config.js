/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          450: '#22d3ee',
          455: '#06b6d4',
          500: '#0891b2', // Professional Ocean Cyan/Teal accent
          600: '#0e7490',
          700: '#155e75',
        },
        accent: {
          orange: "#0891b2",
          orangeHover: "#0e7490",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
