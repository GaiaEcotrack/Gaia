/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        moveUpDown: 'moveUpDown 2s infinite',
      },
      keyframes: {
        moveUpDown: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
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