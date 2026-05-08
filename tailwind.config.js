/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#761C2A',
          light: '#942537',
        },
        secondary: {
          DEFAULT: '#F0E1B9',
          light: '#F9F4E5',
        },
        accent: {
          DEFAULT: '#4A0E17',
        },
        bg: {
          DEFAULT: '#FFFFFF',
          soft: '#F8FAFC',
        },
        text: {
          DEFAULT: '#0F172A',
          muted: '#64748B',
        },
        border: '#E2E8F0',
      },
      fontFamily: {
        baloo: ['"Baloo 2"', 'cursive'],
        inter: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1.5rem',
        screens: {
          sm: '100%',
          md: '100%',
          lg: '1024px',
          xl: '1280px',
        },
      },
    },
  },
  plugins: [],
}
