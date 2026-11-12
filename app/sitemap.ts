import type { MetadataRoute } from 'next';

// Styleguide is intentionally excluded. Route list grows with each phase.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://guptahospitalbathinda.com').replace(
    /\/$/,
    '',
  );
  const routes = ['', '/orthopaedics', '/orthopaedics/robotic-knee-replacement', '/orthopaedics/knee-and-hip-replacement', '/orthopaedics/fractures-and-trauma', '/orthopaedics/arthroscopy-and-sports-injuries', '/orthopaedics/back-pain-clinic', '/eye-care', '/mental-health', '/doctors', '/doctors/dr-mohit-gupta', '/doctors/dr-parul-gupta', '/doctors/dr-amit-gupta', '/about', '/media', '/contact', '/plan-your-visit', '/privacy-policy', '/terms-of-use', '/medical-disclaimer', '/editorial-and-medical-review-policy', '/patient-rights-and-responsibilities', '/appointment-cancellation-and-refund', '/accessibility-statement'];
  const out: MetadataRoute.Sitemap = [];
  for (const r of routes) {
    out.push({ url: `${base}${r}/`, lastModified: new Date() });
    out.push({ url: `${base}/pa${r}/`, lastModified: new Date() });
  }
  return out;
}
