/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
const colors = require('tailwindcss/colors');

module.exports = {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            width: {
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
                '2xl': '1536px',
            },
            transitionTimingFunction: {
                'out-back': 'cubic-bezier(0.12, 0.65, 0.32, 1.15)',
            },
            boxShadow: {
                DEFAULT: 'rgba(120, 120, 120, 0.4) 0px 5px 20px',
                10: '0 0 10px -3px rgba(0, 0, 0, 0.1), 0 0px 6px -2px rgba(0, 0, 0, 0.05)',
                20: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            },
            zIndex: {
                '-10': '-10',
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
            screens: {
                '2xl': { max: '1535px' },
                xl: { max: '1279px' },
                lg: { max: '1023px' },
                md: { max: '767px' },
                sm: { max: '639px' },
            },
            animation: {
                'ping-once': 'ping 0.3s cubic-bezier(0, 0, 0.2, 1);',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/line-clamp')],
};