/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // Palette principale (design system)
        primary: {
          50: 'oklch(0.97 0.02 145)',
          100: 'oklch(0.94 0.04 145)',
          200: 'oklch(0.87 0.08 145)',
          300: 'oklch(0.78 0.12 145)',
          400: 'oklch(0.67 0.16 145)',
          500: 'oklch(0.56 0.18 145)',  // #2E8B57
          600: 'oklch(0.48 0.16 145)',
          700: 'oklch(0.39 0.14 145)',
          800: 'oklch(0.31 0.11 145)',
          900: 'oklch(0.24 0.08 145)',
        },
        secondary: {
          50: 'oklch(0.97 0.03 65)',
          100: 'oklch(0.93 0.06 65)',
          200: 'oklch(0.86 0.12 65)',
          300: 'oklch(0.78 0.16 65)',
          400: 'oklch(0.70 0.18 65)',
          500: 'oklch(0.65 0.16 65)',  // #FFB74D
          600: 'oklch(0.58 0.14 65)',
          700: 'oklch(0.49 0.12 65)',
          800: 'oklch(0.40 0.10 65)',
          900: 'oklch(0.32 0.08 65)',
        },
        neutral: {
          50: 'oklch(0.99 0 0)',
          100: 'oklch(0.97 0 0)',
          200: 'oklch(0.93 0 0)',
          300: 'oklch(0.87 0 0)',
          400: 'oklch(0.73 0 0)',
          500: 'oklch(0.58 0 0)',
          600: 'oklch(0.46 0 0)',
          700: 'oklch(0.36 0 0)',
          800: 'oklch(0.25 0 0)',
          900: 'oklch(0.15 0 0)',
        },
        // Semantic colors
        success: 'oklch(0.56 0.18 145)',
        warning: 'oklch(0.70 0.18 65)',
        danger: 'oklch(0.58 0.22 27)',
        info: 'oklch(0.60 0.12 230)',
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.25' }],     // 12px
        sm: ['0.875rem', { lineHeight: '1.375' }],   // 14px
        base: ['1rem', { lineHeight: '1.5' }],       // 16px
        lg: ['1.125rem', { lineHeight: '1.5' }],     // 18px
        xl: ['1.25rem', { lineHeight: '1.5' }],      // 20px
        '2xl': ['1.5rem', { lineHeight: '1.375' }],  // 24px
        '3xl': ['1.875rem', { lineHeight: '1.25' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '1.25' }],  // 36px
        '5xl': ['3rem', { lineHeight: '1' }],        // 48px
      },
      spacing: {
        0: '0',
        1: '0.25rem',   // 4px
        2: '0.5rem',    // 8px
        3: '0.75rem',   // 12px
        4: '1rem',      // 16px
        5: '1.25rem',   // 20px
        6: '1.5rem',    // 24px
        8: '2rem',      // 32px
        10: '2.5rem',   // 40px
        12: '3rem',     // 48px
        16: '4rem',     // 64px
        20: '5rem',     // 80px
        24: '6rem',     // 96px
      },
      borderRadius: {
        none: '0',
        sm: '0.25rem',   // 4px
        base: '0.5rem',  // 8px
        md: '0.75rem',   // 12px
        lg: '1rem',      // 16px
        xl: '1.5rem',    // 24px
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      minHeight: {
        touch: '44px',
        button: '48px',
        input: '48px',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
      },
    },
  },
  plugins: [],
}
