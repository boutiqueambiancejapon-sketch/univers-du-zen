import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep heavy server-only packages out of the client bundle
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.aiku.io' },
      { protocol: 'https', hostname: '*.aiku.io' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default withNextIntl(nextConfig);
