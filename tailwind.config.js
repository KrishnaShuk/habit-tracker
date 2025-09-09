/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-lexend)', 'sans-serif'],
      },
      colors: {
        // --- THIS IS THE ONLY LINE TO CHANGE ---
        primary: '#22C55E', // Was '#FF90E8' (pink), now is vibrant green
        // ------------------------------------
        foreground: '#111111',
        background: '#FFFFFF',
        muted: '#A1A1A1',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'md': '0.25rem',
        'lg': '0.5rem',
        'full': '9999px',
      },
      borderWidth: {
        DEFAULT: '2px',
        '0': '0',
        '2': '2px',
        '4': '4px',
      },
      boxShadow: {
        'solid': '4px 4px 0px #111111',
      },
    },
  },
  plugins: [],
};