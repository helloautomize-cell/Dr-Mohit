import type { MetadataRoute } from 'next';

// Styleguide, thank-you and legal pages are intentionally excluded (legal
// pages carry noindex). Every entry ships xhtml:link hreflang alternates for
// en + pa + x-default so both locales index as a pair.
const ROUTES: { path: string; priority: number }[] = [
  { path: '', priority: 1 },
  { path: '/orthopaedics', priority: 0.9 },
  { path: '/eye-care', priority: 0.9 },
  { path: '/mental-health', priority: 0.9 },
  { path: '/orthopaedics/robotic-knee-replacement', priority: 0.8 },
  { path: '/orthopaedics/knee-and-hip-replacement', priority: 0.8 },
  { path: '/orthopaedics/fractures-and-trauma', priority: 0.8 },
  { path: '/orthopaedics/arthroscopy-and-sports-injuries', priority: 0.8 },
  { path: '/orthopaedics/back-pain-clinic', priority: 0.8 },
  { path: '/doctors', priority: 0.8 },
  { path: '/doctors/dr-mohit-gupta', priority: 0.7 },
  { path: '/doctors/dr-parul-gupta', priority: 0.7 },
  { path: '/doctors/dr-amit-gupta', priority: 0.7 },
  { path: '/about', priority: 0.6 },
  { path: '/media', priority: 0.5 },
  { path: '/contact', priority: 0.8 },
  { path: '/plan-your-visit', priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://guptahospitalbathinda.com').replace(
    /\/$/,
    '',
  );
  const out: MetadataRoute.Sitemap = [];
  for (const { path, priority } of ROUTES) {
    const en = `${base}${path}/`;
    const pa = `${base}/pa${path}/`;
    out.push({
      url: en,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority,
      alternates: { languages: { en, pa, 'x-default': en } },
    });
    out.push({
      url: pa,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority,
      alternates: { languages: { en, pa, 'x-default': en } },
    });
  }
  return out;
}
