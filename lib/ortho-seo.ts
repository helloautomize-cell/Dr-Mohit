// SEO helpers for the four orthopaedics sub-pages (v14 kit): generateMetadata
// fields and the MedicalWebPage JSON-LD (BreadcrumbList is emitted by the
// shell Breadcrumbs component). Thin wrappers over lib/seo so the route files
// keep their shorter call signatures. No AggregateRating — hospital review
// schema is intentionally omitted site-wide.
import type { Metadata } from 'next';
import type { Locale } from '@/i18n/routing';
import { pageMeta, medicalWebPageLd } from './seo';

/** Route page metadata: localized h1 title + lede description. */
export function orthoMeta(page: string, route: string, h1Key: string, ledeKey: string, locale: Locale): Metadata {
  return pageMeta(page, route, h1Key, ledeKey, locale);
}

/** MedicalWebPage JSON-LD for one orthopaedics sub-page. */
export function orthoMedicalWebPageLd(page: string, route: string, h1Key: string, ledeKey: string, locale: Locale) {
  return medicalWebPageLd({
    page,
    route,
    h1Key,
    ledeKey,
    locale,
    reviewer: { name: 'Dr. Mohit Gupta', specialty: 'Orthopedic' },
  });
}
