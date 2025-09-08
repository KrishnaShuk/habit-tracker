/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Add other directories if you have them
  ],
  theme: {
    // We are extending, but for this overhaul, it's cleaner to define directly.
    // If you need other default values, use extend: { ... }
    extend: {
      fontFamily: {
        // The 'sans' key is the default sans-serif font family in Tailwind
        // The layout.js file handles loading the font, this is a fallback
        sans: ['var(--font-lexend)', 'sans-serif'],
      },
      colors: {
        // Gumroad's Signature Pink/Magenta Accent
        primary: '#FF90E8',
        // The "black" is a very dark gray for a softer feel
        foreground: '#111111',
        // The "white" background
        background: '#FFFFFF',
        // A subtle gray for secondary text or disabled states
        muted: '#A1A1A1',
      },
      borderRadius: {
        // Gumroad uses very sharp corners. We'll default to none.
        'none': '0',
        'sm': '0.125rem',
        'md': '0.25rem', // A slight radius for specific elements if needed
        'lg': '0.5rem',
        'full': '9999px',
      },
      borderWidth: {
        DEFAULT: '2px', // Default border width
        '0': '0',
        '2': '2px',
        '4': '4px',
      },
      boxShadow: {
        // A solid, sharp shadow like Gumroad's buttons
        'solid': '4px 4px 0px #111111',
      },
    },
  },
  plugins: [],
};