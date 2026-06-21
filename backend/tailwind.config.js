/** @type {import('tailwindcss').Config} */
// Tailwind CSS v3 configuration file.
// Defines design tokens such as colors, typography, and content sources for template extraction.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ERP Professional Themes: Slate primary, Indigo accents, Emerald success, Amber warnings, Rose critical
        brand: {
          50: '#f5f7fa',
          100: '#e4e8f0',
          200: '#c8d1e0',
          300: '#9fb0cb',
          400: '#6f8ab2',
          500: '#4f6c99',
          600: '#3e547c',
          700: '#324464',
          800: '#2c3a54',
          900: '#253046',
          950: '#19202f',
        },
        primary: {
          DEFAULT: '#3e547c', // Slate blue professional accent
          light: '#eff6ff',
          dark: '#1e293b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
