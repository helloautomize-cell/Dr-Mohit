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
    // Trim shared chunk bytes: rewrite barrel imports to direct subpaths.
    optimizePackageImports: ['@radix-ui/react-navigation-menu', 'next-intl'],
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
  // Old-site 301s live in middleware.ts (true 301 status; redirects() here
  // would emit 308). Map: resources/reference/old-site/_page-sitemap.xml.
  async headers() {
    // Baseline hardening on every deploy, previews included.
    const headers = [
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    ];
    if (!indexable) {
      headers.push({ key: 'X-Robots-Tag', value: 'noindex, nofollow' });
    } else {
      // Production-only CSP. script-src keeps 'unsafe-inline' — Next's inline
      // bootstrap, the consent-default snippet and dynamic gtag/turnstile
      // loaders can't carry a nonce without custom plumbing.
      headers.push({
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data:",
          "font-src 'self'",
          "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://challenges.cloudflare.com",
          "frame-src https://www.google.com https://maps.google.com https://challenges.cloudflare.com",
          "worker-src 'self' blob:",
          "form-action 'self'",
          "base-uri 'self'",
          "object-src 'none'",
          "frame-ancestors 'self'",
        ].join('; '),
      });
    }
    return [{ source: '/:path*', headers }];
  },
};

export default withNextIntl(nextConfig);
