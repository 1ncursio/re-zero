const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['via.placeholder.com', 'lh3.googleusercontent.com', 'localhost', 'images.unsplash.com'],
    },
    // i18n,
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
};

module.exports = nextConfig;