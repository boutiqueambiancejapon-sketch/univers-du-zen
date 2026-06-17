import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zen: {
          beige:        '#F5EFE6',
          cream:        '#FAF7F2',
          sand:         '#E8DDD0',
          terracotta:   '#C4714A',
          'terra-dark': '#A85A35',
          sage:         '#7A9E7E',
          'sage-dark':  '#5C7F60',
          bark:         '#3B2A1F',
          muted:        '#675A4E',
          gold:         '#A8842E',
        },
      },
      fontSize: {
        xs:   ['0.8125rem', { lineHeight: '1.15rem' }], // 13px (au lieu de 12)
        sm:   ['0.9375rem', { lineHeight: '1.45rem' }], // 15px (au lieu de 14)
        base: ['1.0625rem', { lineHeight: '1.75rem' }], // 17px (au lieu de 16)
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans:  ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
