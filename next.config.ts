import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// SITE_INDEXABLE defaults to false: preview/staging deploys stay noindexed until Phase 10.
const indexable = process.env.SITE_INDEXABLE === 'true';

const nextConfig: NextConfig = {
  // Optional isolated distDir: lets a second dev server run alongside another
  // agent's dev/build without the two processes clobbering the same .next dir.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  // QA escape hatch: skip type/lint blocking ONLY for an explicitly requested
  // isolated verification build (e.g. while another in-flight phase has
  // type errors in its own files). Real builds keep full checks.
  ...(process.env.NEXT_SKIP_TYPECHECK === '1'
    ? { typescript: { ignoreBuildErrors: true }, eslint: { ignoreDuringBuilds: true } }
    : {}),
  trailingSlash: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 160, 256, 384, 512],
  },
  async headers() {
    if (indexable) return [];
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
