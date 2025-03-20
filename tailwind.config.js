/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      extend: {
          colors: {
              'primary': '#111827',

              'button-primary': '#1D97D8',
          },
          fontFamily: {
              'martian-mono': ['Martian mono', 'serif'],
              'righteous': ['Righteous', 'serif'],
              'inter': ['Inter', 'serif'],
          },
          screens: {
              'xl-custom': '1200px',
          },
      },
  },
  plugins: [],
}