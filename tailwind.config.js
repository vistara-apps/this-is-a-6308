/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(240 90% 50%)',
        accent: 'hsl(30 95% 55%)',
        bg: 'hsl(230 15% 98%)',
        surface: 'hsl(0 0% 100%)',
        'text-primary': 'hsl(230 15% 25%)',
        'text-secondary': 'hsl(230 15% 45%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 12px hsla(230, 15%, 25%, 0.08)',
      },
    },
  },
  plugins: [],
}