/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        ink: '#09090b',
        panel: '#111113',
        line: '#242429',
        accent: '#a78bfa'
      },
      boxShadow: {
        glow: '0 0 40px rgba(167,139,250,.12)'
      }
    }
  },
  plugins: []
};
