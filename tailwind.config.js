/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      extend: {
          colors: {
              background: "var(--background)",
              bgSecondary: "var(--bgSecondary)",
              bluePrimary: "var(--bluePrimary)",
              blueSecondary: "var(--blueSecondary)",
              darkBg: "var(--dark-background)",
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