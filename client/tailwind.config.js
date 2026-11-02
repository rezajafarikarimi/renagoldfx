/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050607',
        panel: '#090B0E',
        card: '#0B0D10',
        gold: {
          DEFAULT: '#E8B64E',
          light: '#FFD777',
          dark: '#99702C',
        },
        mute: '#B8B8B8',
        up: '#20C77A',
        down: '#F04452',
      },
      fontFamily: {
        sans: ['Inter', 'Vazirmatn', 'system-ui', 'sans-serif'],
        fa: ['Vazirmatn', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 30px 70px -40px rgba(0,0,0,.95), inset 0 1px 0 rgba(255,255,255,.035)',
        gold: '0 18px 44px -24px rgba(232,182,78,.55)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(-50%,0,0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translate3d(0,14px,0)' },
          '100%': { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '.45' },
          '50%': { opacity: '.85' },
        },
      },
      animation: {
        marquee: 'marquee 46s linear infinite',
        'fade-up': 'fadeUp .7s cubic-bezier(.2,.7,.2,1) both',
        'glow-pulse': 'glowPulse 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
