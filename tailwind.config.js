/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A1628',
        paper: '#FAFAF7',
        rule: '#1A2942',
        cyan_med: '#00B8D4',
        mute: '#6B7785',
        surface: '#F0F2F5',
        glass: 'rgba(10, 22, 40, 0.04)',
      },
      fontFamily: {
        display: ['"Fraunces"', '"Noto Serif SC"', 'serif'],
        sans: ['"Geist"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        wider2: '0.18em',
      },
      fontSize: {
        'display-xl': ['clamp(3.2rem, 8vw, 8rem)', { lineHeight: '0.92', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(2.4rem, 5vw, 4.5rem)', { lineHeight: '1.0', letterSpacing: '-0.03em' }],
      },
      animation: {
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'rule-grow': 'ruleGrow 1.2s cubic-bezier(0.22, 1, 0.36, 1) both',
        'caret': 'caret 1.1s steps(1) infinite',
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ruleGrow: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        caret: {
          '0%, 50%': { opacity: '1' },
          '50.01%, 100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
