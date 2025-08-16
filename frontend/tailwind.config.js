/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#C82FFF',
        'neon-blue': '#00F0FF',
        'cyber-navy': '#0A0F2A',
        'cyber-white': '#FFFFFF',
        'cyber-gray': '#1A1F3A',
        'cyber-dark': '#050814',
      },
      fontFamily: {
        'cyber': ['Orbitron', 'monospace'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite alternate',
        'glow': 'glow 1.5s ease-in-out infinite alternate',
        'flicker': 'flicker 0.15s infinite linear',
      },
      keyframes: {
        'neon-pulse': {
          '0%': { 
            textShadow: '0 0 5px #C82FFF, 0 0 10px #C82FFF, 0 0 15px #C82FFF',
            boxShadow: '0 0 5px #C82FFF'
          },
          '100%': { 
            textShadow: '0 0 10px #C82FFF, 0 0 20px #C82FFF, 0 0 30px #C82FFF',
            boxShadow: '0 0 10px #C82FFF, 0 0 20px #C82FFF'
          }
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px #00F0FF, 0 0 10px #00F0FF' },
          '100%': { boxShadow: '0 0 10px #00F0FF, 0 0 20px #00F0FF, 0 0 30px #00F0FF' }
        },
        'flicker': {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: 1 },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: 0.4 }
        }
      }
    },
  },
  plugins: [],
};