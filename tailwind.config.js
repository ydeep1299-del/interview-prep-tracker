/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f0f1ff',
          100: '#e2e4ff',
          200: '#c9ccff',
          300: '#a7acff',
          400: '#8287fc',
          500: '#6366f1',
          600: '#5254e7',
          700: '#4644cc',
          800: '#3a39a6',
          900: '#323183',
        },
        slate: {
          850: '#141422',
          950: '#0c0c18',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.25s ease',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-right': 'slideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: 'translateY(14px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
        slideRight: { from: { opacity: 0, transform: 'translateX(-10px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};
