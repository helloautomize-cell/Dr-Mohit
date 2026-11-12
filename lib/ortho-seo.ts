// SEO helpers for the four orthopaedics sub-pages (v14 kit): generateMetadata
// fields and the MedicalWebPage JSON-LD (BreadcrumbList is emitted by the
// shell Breadcrumbs component). No AggregateRating — hospital review schema
// is intentionally omitted site-wide.
import type { Metadata } from 'next';
import { copy } from './copy';
import type { Locale } from '@/i18n/routing';
import { SITE } from './site-config';

const strip = (s: string) => s.replace(/<[^>]+>/g, '');

/** Route page metadata: localized h1 title + lede description. */
export function orthoMeta(page: string, route: string, h1Key: string, ledeKey: string, locale: Locale): Metadata {
  const title = strip(copy(page, h1Key, locale));
  const description = strip(copy(page, ledeKey, locale));
  return {
    title,
    description,
    alternates: {
      canonical: `${route}`,
      languages: { en: route, pa: `/pa${route}` },
    },
  };
}

/** MedicalWebPage JSON-LD for one orthopaedics sub-page. */
export function orthoMedicalWebPageLd(page: string, route: string, h1Key: string, ledeKey: string, locale: Locale) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://guptahospitalbathinda.com';
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: strip(copy(page, h1Key, locale)),
    description: strip(copy(page, ledeKey, locale)),
    url: `${base}${locale === 'pa' ? '/pa' : ''}${route}`,
    inLanguage: locale === 'pa' ? 'pa-IN' : 'en-IN',
    isPartOf: { '@type': 'WebSite', name: SITE.name, url: base },
    reviewedBy: {
      '@type': 'Physician',
      name: 'Dr. Mohit Gupta',
      medicalSpecialty: 'Orthopedic',
      worksFor: { '@type': 'Hospital', name: SITE.name, address: SITE.address },
    },
  };
}
