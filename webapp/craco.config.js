// craco.config.js
module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  babel: {
    plugins: ['macros'],
    presets: ['@emotion/babel-preset-css-prop'],
  },
};