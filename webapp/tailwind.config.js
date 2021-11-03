/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      transitionTimingFunction: {
        'out-back': 'cubic-bezier(0.12, 0.65, 0.32, 1.15)',
      },
      boxShadow: {
        DEFAULT: 'rgba(120, 120, 120, 0.4) 0px 5px 20px',
        10: '0 0 10px -3px rgba(0, 0, 0, 0.1), 0 0px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        gray: colors.trueGray,
        blueGray: colors.blueGray,
        red: colors.red,
        blue: colors.blue,
        emerald: colors.emerald,
        yellow: colors.yellow,
        sky: colors.sky,
        cyan: colors.cyan,
        white: colors.white,
        black: colors.black,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
