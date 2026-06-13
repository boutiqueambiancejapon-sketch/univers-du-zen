import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.aw-dropship.eu' },
      { protocol: 'https', hostname: '*.aw-dropship.eu' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
    ],
  },
};

export default withNextIntl(nextConfig);
