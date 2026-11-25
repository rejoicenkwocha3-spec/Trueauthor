import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#155EEF', royal: '#2864DC', navy: '#102A43', coral: '#FF654F', bg: '#F5F8FC', text: '#263449' },
      },
      fontFamily: { sans: ['var(--font-inter)', 'system-ui', 'sans-serif'], display: ['var(--font-manrope)', 'var(--font-inter)', 'sans-serif'] },
      boxShadow: { card: '0 1px 2px rgba(16,42,67,.06), 0 8px 24px rgba(16,42,67,.06)' },
    },
  },
  plugins: [],
};
export default config;
