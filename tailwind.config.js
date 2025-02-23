/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      extend: {
          colors: {
              'blue': '#345995',
              'columbia-blue': '#b1d8ec',
              'silver': '#bababa',
              'tea-green': '#d9f2b4',
              'sea-salt': '#f7f7f7',
          }
      },
  },
  plugins: [],
}