/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        'system': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'os-dark': '#0d1117',
        'os-darker': '#010409',
        'os-light': '#161b22',
        'os-lighter': '#21262d',
        'os-border': '#30363d',
        'os-accent': '#58a6ff',
        'os-accent-hover': '#79c0ff',
        'os-success': '#3fb950',
        'os-warning': '#d29922',
        'os-error': '#f85149',
        'os-text': '#f0f6fc',
        'os-text-muted': '#8b949e',
        'os-text-subtle': '#6e7681',
      },
      backdropBlur: {
        'os': '12px',
      },
      animation: {
        'boot': 'boot 2s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'terminal-cursor': 'terminalCursor 1s infinite',
      },
      keyframes: {
        boot: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSoft: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #58a6ff, 0 0 10px #58a6ff, 0 0 15px #58a6ff' },
          '100%': { boxShadow: '0 0 10px #58a6ff, 0 0 20px #58a6ff, 0 0 30px #58a6ff' },
        },
        terminalCursor: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
