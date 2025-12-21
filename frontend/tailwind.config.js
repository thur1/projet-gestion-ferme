/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f2fbf6',
          100: '#e4f7ed',
          200: '#c4ebd7',
          300: '#9ad9bb',
          400: '#58b88d',
          500: '#3a9f74',
          600: '#2b7f5c',
          700: '#23674b',
          800: '#1f533e',
          900: '#1b4535',
        },
        neutral: {
          25: '#fcfcfd',
          50: '#f7f7f8',
          100: '#f2f4f7',
          200: '#e4e7ec',
          300: '#d0d5dd',
          400: '#98a2b3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1d2939',
          900: '#101828',
        },
      },
      borderRadius: {
        xl: '1rem',
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(16,24,40,0.12)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}

