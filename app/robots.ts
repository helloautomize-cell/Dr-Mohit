import type { MetadataRoute } from 'next';

// Indexing is gated on SITE_INDEXABLE (Phase 10 flips it on the production deploy).
export default function robots(): MetadataRoute.Robots {
  const indexable = process.env.SITE_INDEXABLE === 'true';
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://guptahospitalbathinda.com';
  if (!indexable) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/styleguide', '/api/'] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
