/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: '#0F5257',
        amber: '#E8A33D',
        offwhite: '#FAF8F3',
        charcoal: '#1B2E2E',
        sage: '#3E7C59',
        alertamber: '#D98E3E',
        rose: '#B23A48',

        'teal-dark': '#6FC2BC',
        'amber-dark': '#F0B15C',
        'bg-dark': '#0E211F',
        'surface-dark': '#16302D',
        'text-dark': '#F3EFE6',
        'sage-dark': '#7BC79A',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Atkinson Hyperlegible', 'sans-serif'],
      },
      minHeight: { touch: '56px' },
      minWidth: { touch: '56px' },
      keyframes: {
        ringPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.05)', opacity: '0.45' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
