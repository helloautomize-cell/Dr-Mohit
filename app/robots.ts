import type { MetadataRoute } from 'next';

// Indexing is gated on SITE_INDEXABLE (Phase 10 flips it on the production deploy).
// When live, AI crawlers are explicitly allowed so the site is retrievable by
// answer engines (ChatGPT, Perplexity, Claude, Gemini, Apple Intelligence) —
// the content is patient-facing public health information meant to be cited.
const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Amazonbot',
  'Meta-ExternalAgent',
  'cohere-ai',
  'AI2Bot',
];

export default function robots(): MetadataRoute.Robots {
  const indexable = process.env.SITE_INDEXABLE === 'true';
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://guptahospitalbathinda.com';
  if (!indexable) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/styleguide', '/api/'] },
      { userAgent: AI_BOTS, allow: '/', disallow: ['/styleguide', '/api/'] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
