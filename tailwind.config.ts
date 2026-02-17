import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layout/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: ['no-scrollbar'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      xl: '1280px',

      smOnly: { max: '767.98px' },
      smOnly340: { max: '339.98px' },
      smOnly420: { max: '419.98px' },
      mdOnly: { min: '768px', max: '1279.98px' },
    },

    container: {
      center: true,
      padding: {
        DEFAULT: '8px',
        sm: '8px',
        md: '42px',
        xl: '32px',
      },
    },
    extend: {
      fontFamily: {
        nunito: ['var(--font-nunito)'],
        geologica: ['var(--font-geologica)'],
        lora: ['var(--font-lora)'],
      },

      colors: {
        lightBg: '#FFFFFF',
        darkBg: '#101340',
        // darkBg: '#000',
        mediumBg: '#E5EEF6',
        darkBlueBg: '#0045CB',
        accent: '#00EA90',
        redApple: '#FF3B30',
        saleBg: '#fff6a1',

        primaryText: '#FFFFFF',
        secondaryText: '#101340',
        darkBlueText: '#0045CB',

        red: '#FF0000',
        redTransparent: 'rgba(255, 148, 148, 0.2)',
        darkRed: '#ba0202',
        error: '#FF0000',

        //
        greyText: '#8E8E93',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        custom: '2px 5px 15px rgba(0, 69, 203, 0.5)',
        customLight: '2px 5px 15px rgba(0, 69, 203, 0.2)',
        customTop: '0 -4px 6px -4px rgba(0, 69, 203, 0.2)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
