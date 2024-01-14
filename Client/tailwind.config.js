/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F37B7B',
        secondary: '#74C7ED',
        vara: '#00ffc3',
      },
      fontFamily: {
        'sans': ['Roboto', 'sans-serif'],
      },
      screens: {
        '2xl': '1400px',
      },
    },
  },
  plugins: [],
}