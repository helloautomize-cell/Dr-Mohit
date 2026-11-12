// Central SEO helpers (phase 9): locale-aware canonical/hreflang alternates,
// JSON-LD builders (Hospital, WebSite, Physician, MedicalWebPage, FAQPage,
// ItemList) and per-route generateMetadata helpers. Facts come from
// site-config (verified only); anything unconfirmed stays out of schema.
import type { Metadata } from 'next';
import { copy } from './copy';
import type { Locale } from '@/i18n/routing';
import { SITE } from './site-config';

export const SITE_BASE = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://guptahospitalbathinda.com'
).replace(/\/$/, '');

export const stripTags = (s: string) => s.replace(/<[^>]+>/g, '');

/** Canonical + hreflang pair for a route. Each locale self-canonicalizes and
    English is the x-default so unprefixed SERPs land on English. */
export function alternates(route: string, locale: Locale) {
  return {
    canonical: locale === 'pa' ? `/pa${route}` : route,
    languages: { en: route, pa: `/pa${route}`, 'x-default': route },
  };
}

/** Route metadata: localized h1 title + lede description + alternates. */
export function pageMeta(
  page: string,
  route: string,
  h1Key: string,
  ledeKey: string,
  locale: Locale,
): Metadata {
  return {
    title: stripTags(copy(page, h1Key, locale)),
    description: stripTags(copy(page, ledeKey, locale)),
    alternates: alternates(route, locale),
  };
}

const address = {
  '@type': 'PostalAddress' as const,
  streetAddress: 'Power House Road',
  addressLocality: 'Bathinda',
  addressRegion: 'Punjab',
  postalCode: '151001',
  addressCountry: 'IN',
};

/** Sitewide Hospital entity — emitted once in the root layout. No
    aggregateRating (hospital review schema is intentionally omitted
    site-wide). `geo` is omitted until the exact pin is confirmed; `hasMap`
    carries the listing URL instead. */
export function hospitalLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hospital',
    '@id': `${SITE_BASE}/#hospital`,
    name: `${SITE.name}, ${SITE.city}`,
    alternateName: 'Gupta Hospital Bathinda',
    url: SITE_BASE,
    logo: `${SITE_BASE}/images/brand/logo-2x.png`,
    image: `${SITE_BASE}/images/brand/logo-2x.png`,
    description: stripTags(
      `${SITE.tagline} One family of doctors on Power House Road since ${SITE.founded}.`,
    ),
    telephone: SITE.phoneMain,
    email: SITE.email,
    address,
    hasMap: SITE.mapsUrl,
    foundingDate: String(SITE.founded),
    founder: { '@type': 'Person', name: 'Dr. Amrit Gupta' },
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'HFR ID',
      value: SITE.hfrId,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    medicalSpecialty: ['Orthopedic', 'Ophthalmologic', 'Psychiatric'],
    availableService: [
      { '@type': 'MedicalProcedure', name: 'Robotic-assisted knee replacement' },
      { '@type': 'MedicalProcedure', name: 'Knee and hip replacement' },
      { '@type': 'MedicalProcedure', name: 'Fracture and trauma care' },
      {
        '@type': 'MedicalProcedure',
        name: 'Arthroscopy and sports injury treatment',
      },
      { '@type': 'MedicalTherapy', name: 'Back pain clinic' },
      { '@type': 'MedicalProcedure', name: 'Cataract surgery (phacoemulsification)' },
      { '@type': 'MedicalTherapy', name: 'Psychiatry and de-addiction treatment' },
    ],
    areaServed: SITE.serviceTowns.map((t) => ({
      '@type': 'City',
      name: t,
    })),
    sameAs: [SITE.social.youtube, SITE.social.instagram, SITE.social.facebook],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SITE.phoneMain,
        contactType: 'appointments',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi', 'Punjabi'],
      },
      {
        '@type': 'ContactPoint',
        telephone: SITE.phoneEye,
        contactType: 'customer support',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi', 'Punjabi'],
      },
    ],
  };
}

/** WebSite entity — emitted on the home page. */
export function websiteLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_BASE}/#website`,
    name: `${SITE.name} ${SITE.city}`,
    url: `${SITE_BASE}${locale === 'pa' ? '/pa' : ''}/`,
    inLanguage: locale === 'pa' ? 'pa-IN' : 'en-IN',
    publisher: { '@id': `${SITE_BASE}/#hospital` },
  };
}

/** Physician JSON-LD for a doctor profile page. `credentials` are the
    confirmed qualification strings only (unconfirmed ones stay as
    [CONFIRM] chips in the UI, never in schema). */
export function physicianLd({
  name,
  dept,
  route,
  image,
  credentials,
  award,
}: {
  name: string;
  dept: string;
  route: string;
  image: string;
  credentials: string[];
  award?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name,
    medicalSpecialty: dept,
    url: `${SITE_BASE}${route}`,
    image,
    worksFor: { '@id': `${SITE_BASE}/#hospital` },
    availableLanguage: ['English', 'Hindi', 'Punjabi'],
    hasCredential: credentials.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c,
    })),
    ...(award ? { award } : {}),
  };
}

/** MedicalWebPage for a department/treatment page. `reviewer` is the
    specialist who leads that department. */
export function medicalWebPageLd({
  page,
  route,
  h1Key,
  ledeKey,
  locale,
  reviewer,
  speakable = true,
}: {
  page: string;
  route: string;
  h1Key: string;
  ledeKey: string;
  locale: Locale;
  reviewer: { name: string; specialty: string };
  speakable?: boolean;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: stripTags(copy(page, h1Key, locale)),
    description: stripTags(copy(page, ledeKey, locale)),
    url: `${SITE_BASE}${locale === 'pa' ? '/pa' : ''}${route}`,
    inLanguage: locale === 'pa' ? 'pa-IN' : 'en-IN',
    isPartOf: { '@id': `${SITE_BASE}/#website` },
    about: { '@id': `${SITE_BASE}/#hospital` },
    reviewedBy: {
      '@type': 'Physician',
      name: reviewer.name,
      medicalSpecialty: reviewer.specialty,
      worksFor: { '@id': `${SITE_BASE}/#hospital` },
    },
    ...(speakable
      ? {
          speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['.ph h1', '.ph .lede', '.hero h1', '.hero .lede'],
          },
        }
      : {}),
  };
}

/** FAQPage JSON-LD mirroring exactly the visible accordion items. */
export function faqLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: stripTags(q),
      acceptedAnswer: { '@type': 'Answer', text: stripTags(a) },
    })),
  };
}

/** ItemList JSON-LD (e.g. the three doctors on /doctors/). */
export function itemListLd(
  items: { name: string; url: string; position?: number }[],
  name: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: it.position ?? i + 1,
      name: it.name,
      url: it.url.startsWith('http') ? it.url : `${SITE_BASE}${it.url}`,
    })),
  };
}
