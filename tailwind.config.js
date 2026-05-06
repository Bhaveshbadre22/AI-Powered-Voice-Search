/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition:  '400px 0' },
        },
        'pulse-ring': {
          '0%':   { transform: 'scale(1)',   opacity: '0.6' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
        'bar-bounce': {
          '0%, 100%': { height: '6px' },
          '50%':      { height: '18px' },
        },
        'slide-progress': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
      },
      animation: {
        'fade-up':        'fade-up 0.4s ease forwards',
        shimmer:          'shimmer 1.4s infinite linear',
        'pulse-ring':     'pulse-ring 1.2s ease-out infinite',
        'bar-bounce':     'bar-bounce 0.6s ease-in-out infinite',
        'slide-progress': 'slide-progress 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
