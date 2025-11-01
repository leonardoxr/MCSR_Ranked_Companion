const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React 19 features
  experimental: {
    reactCompiler: false, // Disable for now as React 19 is RC
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'crafatar.com',
        pathname: '/avatars/**',
      },
      {
        protocol: 'https',
        hostname: 'crafatar.com',
        pathname: '/renders/**',
      },
      {
        protocol: 'https',
        hostname: 'crafatar.com',
        pathname: '/skins/**',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Output standalone for Docker/Tauri
  output: 'standalone',

  // Disable x-powered-by header
  poweredByHeader: false,

  // Strict mode
  reactStrictMode: true,

  // Environment variables validation
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
  },
};

module.exports = withNextIntl(nextConfig);
