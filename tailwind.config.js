/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0D0F12',
          surface: '#161B22',
          card: '#1C2128',
          border: '#2D333B',
          lighter: '#22272E',
        },
        cyan: {
          glow: '#00F0FF',
          accent: '#00C8FF',
          muted: 'rgba(0, 240, 255, 0.15)',
        },
        orange: {
          fire: '#FF6B00',
          glow: '#FF8800',
          muted: 'rgba(255, 107, 0, 0.15)',
        },
        emerald: {
          neon: '#00E676',
          muted: 'rgba(0, 230, 118, 0.15)',
        },
        purple: {
          neon: '#9D4EDD',
          glow: '#7B2CBF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(0, 240, 255, 0.35), 0 0 40px rgba(0, 240, 255, 0.1)',
        'orange-glow': '0 0 20px rgba(255, 107, 0, 0.4), 0 0 40px rgba(255, 107, 0, 0.15)',
        'emerald-glow': '0 0 20px rgba(0, 230, 118, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'flame-flicker': 'flameFlicker 1.8s infinite alternate ease-in-out',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 240, 255, 0.6)' },
        },
        flameFlicker: {
          '0%': { transform: 'scale(1) rotate(-1deg)', filter: 'drop-shadow(0 0 8px #FF6B00)' },
          '50%': { transform: 'scale(1.08) rotate(1deg)', filter: 'drop-shadow(0 0 16px #FF8800)' },
          '100%': { transform: 'scale(0.96) rotate(-2deg)', filter: 'drop-shadow(0 0 12px #FF5500)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
