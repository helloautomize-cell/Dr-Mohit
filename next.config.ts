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
  experimental: {
    // Root 404 lives outside [locale]; it renders its own <html>/<body>.
    globalNotFound: true,
  },
  productionBrowserSourceMaps: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 160, 256, 384, 512],
  },
  // trailingSlash 308-redirects the extensionless metadata routes
  // (/opengraph-image → /opengraph-image/) which then 404 — serve them at the
  // slash path too so the emitted og:image URL always resolves.
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/opengraph-image/', destination: '/opengraph-image' },
        { source: '/twitter-image/', destination: '/twitter-image' },
      ],
    };
  },
  // Old-site URLs folded into the new orthopaedics structure (v14 kit).
  async redirects() {
    const kneeHip = '/orthopaedics/knee-and-hip-replacement/';
    return [
      { source: '/total-knee-replacement/', destination: kneeHip, permanent: true },
      { source: '/partial-knee-replacement/', destination: kneeHip, permanent: true },
      { source: '/hip-joint-replacement/', destination: kneeHip, permanent: true },
      { source: '/knee-joint-replacement/', destination: kneeHip, permanent: true },
      { source: '/orthopaedics-and-trauma-center/', destination: '/orthopaedics/fractures-and-trauma/', permanent: true },
      { source: '/arthroscopic-surgery-and-sports-injury-services/', destination: '/orthopaedics/arthroscopy-and-sports-injuries/', permanent: true },
    ];
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
