/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // "Warm Trust" palette — locked in the ReMind design system.
        teal: { DEFAULT: '#0F5257', dark: '#0B3E42', light: '#17707A' },
        amber: { DEFAULT: '#E8A33D', dark: '#C98826', light: '#F0B860' },
        offwhite: '#FAF8F3',
        charcoal: '#1B2E2E',
        sage: { DEFAULT: '#3E7C59', light: '#EAF3EC' },
        alert: { DEFAULT: '#D98E3E', light: '#FBF0DF' },
        rose: { DEFAULT: '#B23A48', light: '#FBEAEC' }
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif']
      },
      borderRadius: {
        sm: '12px',
        md: '16px',
        lg: '24px'
      },
      spacing: {
        unit: '8px'
      },
      boxShadow: {
        soft: '0 8px 24px -8px rgba(15, 82, 87, 0.18)',
        card: '0 4px 16px -4px rgba(27, 46, 46, 0.10)'
      },
      keyframes: {
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' }
        }
      },
      animation: {
        'rise-in': 'riseIn 0.5s ease-out both',
        'pulse-soft': 'pulseSoft 0.6s ease-in-out'
      }
    }
  },
  plugins: []
}
