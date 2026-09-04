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
          DEFAULT: '#16a34a',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        foodieGreen: {
          DEFAULT: '#22c55e',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        cream: {
          50: '#ffffff',
          100: '#fafcf9',
          200: '#f2f7f1',
          300: '#e5efe3',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        telugu: ['"Noto Sans Telugu"', '"Gautami"', 'sans-serif'],
      },
      boxShadow: {
        'foodie': '0 20px 40px -15px rgba(22, 163, 74, 0.12)',
        'foodie-card': '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        'green-glow': '0 10px 30px -5px rgba(22, 163, 74, 0.4)',
        'green-glow-lg': '0 20px 45px -10px rgba(22, 163, 74, 0.45)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-in-out',
        'slide-up': 'slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        'pop-out': 'popOutSpring 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'pop-out-bloom': 'popOutBloom 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'pop-out-down': 'popOutDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'view-transition': 'viewTransition 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'float-slow-reverse': 'floatSlowReverse 9s ease-in-out infinite',
      },
      keyframes: {
        popOutSpring: {
          '0%': { opacity: '0', transform: 'scale(0.5) translateY(32px)' },
          '70%': { opacity: '1', transform: 'scale(1.06) translateY(-4px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        popOutBloom: {
          '0%': { opacity: '0', transform: 'scale(0.3) rotate(-15deg)' },
          '75%': { opacity: '1', transform: 'scale(1.06) rotate(2deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        popOutDown: {
          '0%': { opacity: '0', transform: 'translateY(-100%) scale(0.95)' },
          '75%': { opacity: '1', transform: 'translateY(4px) scale(1.01)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        viewTransition: {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(3deg)' },
        },
        floatSlowReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(14px) rotate(-3deg)' },
        }
      }
    },
  },
  plugins: [],
}
