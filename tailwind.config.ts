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
        // Univers du Zen — palette naturelle chaude
        zen: {
          beige:      '#F5EFE6', // fond principal
          cream:      '#FAF7F2', // fond secondaire
          sand:       '#E8DDD0', // bordures douces
          terracotta: '#C4714A', // CTA principal
          'terra-dark': '#A85A35', // hover CTA
          sage:       '#7A9E7E', // accent nature
          'sage-dark':'#5C7F60', // hover sage
          bark:       '#3B2A1F', // texte principal
          muted:      '#8C7B6E', // texte secondaire
          gold:       '#C9A96E', // fidélité/VIP
        },
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans:  ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
