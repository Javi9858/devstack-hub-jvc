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
          DEFAULT: '#a52a2a', // Using the modern brown/red brand color seen in past conversations for premium feel
          hover: '#8b2222',
        },
        background: '#0f111a',
        surface: '#1e2130',
        text: '#f8f9fa',
        textMuted: '#9ca3af'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
