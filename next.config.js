const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");
const { withPlaiceholder } = require("@plaiceholder/next");
const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en", "th", "ja"],
    defaultLocale: "en",
    localeDetection: false,
  },
  trailingSlash: true,
  reactStrictMode: true,
  concurrentFeatures: true,
  images: {
    domains: ["images.unsplash.com", "firebasestorage.googleapis.com"],
  },
  env: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
  },
};

const pwaPlugin = withPWA({
  pwa: {
    dest: "public",
    runtimeCaching,
  },
});

const plaiceholderPlugin = withPlaiceholder();

module.exports = withPlugins(
  [pwaPlugin, plaiceholderPlugin, [withBundleAnalyzer]],
  nextConfig
);
