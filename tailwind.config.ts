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
          muted:        '#8C7B6E',
          gold:         '#C9A96E',
        },
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
