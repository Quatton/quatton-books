/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

module.exports = withPWA({
  pwa: {
    dest: "public",
    runtimeCaching,
  },
  i18n: {
    locales: ["en", "th", "ja"],
    defaultLocale: "en",
    localDetection: false,
  },
  trailingSlash: true,
  reactStrictMode: true,
  concurrentFeatures: true,
});
