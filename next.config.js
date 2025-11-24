/** @type {import('next').NextConfig} */
const isTauriBuild = process.env.TAURI_BUILD === 'true';

const nextConfig = {
  // Enable React 19 features
  experimental: {
    reactCompiler: false, // Disable for now as React 19 is RC
  },

  // Image optimization
  images: {
    // For Tauri static export, we need unoptimized images
    unoptimized: isTauriBuild,
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
      {
        protocol: 'https',
        hostname: 'avatars.cloudhaven.gg',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Output configuration
  // For Tauri: use static export (no Node.js runtime needed)
  // For web: use standalone (includes Node.js server)
  ...(isTauriBuild ? { output: 'export' } : { output: 'standalone' }),
  
  // Tauri specific configuration
  basePath: '',
  trailingSlash: isTauriBuild,

  // Disable x-powered-by header
  poweredByHeader: false,

  // Strict mode
  reactStrictMode: true,

  // Environment variables validation
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
  },
};

module.exports = nextConfig;
