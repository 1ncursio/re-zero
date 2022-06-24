const { i18n } = require('./next-i18next.config');
const withImages = require('next-images');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
    disableStaticImages: true,
  },
  i18n,
};

module.exports = withImages(nextConfig);
