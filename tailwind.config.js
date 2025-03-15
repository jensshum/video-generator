/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          800: '#1f1f1f',
          900: '#141414',
        },
      },
    },
  },
  plugins: [],
};