import type { Locale } from '@/i18n/routing';
import NAV_LABELS from './nav-labels.json';

// Single source of truth for all navigation structure (header, mobile menu,
// footer columns, breadcrumbs, legal pages). Copy resolves through lib/copy
// (site-content.en-pa.json) for page strings and messages/*.json for chrome.

export interface NavItem {
  /** copy lookup key in `global` page (exact English source string) */
  key: string;
  /** path under the locale root, e.g. "/orthopaedics/" */
  href: string;
}

export const NAV_MAIN: NavItem[] = [
  { key: 'Orthopaedics', href: '/orthopaedics/' },
  { key: 'Eye care', href: '/eye-care/' },
  { key: 'Mental health', href: '/mental-health/' },
  { key: 'Doctors', href: '/doctors/' },
  { key: 'About', href: '/about/' },
  { key: 'Media', href: '/media/' },
];

// Orthopaedics dropdown entries (compact grid, spec phase-02 item 2).
export const ORTHO_MENU: NavItem[] = [
  { key: 'Orthopaedics overview', href: '/orthopaedics/' },
  { key: 'Robotic knee replacement', href: '/orthopaedics/robotic-knee-replacement/' },
  { key: 'Knee and hip replacement', href: '/orthopaedics/knee-and-hip-replacement/' },
  { key: 'Fractures and trauma', href: '/orthopaedics/fractures-and-trauma/' },
  { key: 'Arthroscopy and sports injuries', href: '/orthopaedics/arthroscopy-and-sports-injuries/' },
  { key: 'Back pain clinic', href: '/orthopaedics/back-pain-clinic/' },
];

export const LEGAL_PAGES: NavItem[] = [
  { key: 'Privacy policy', href: '/privacy-policy/' },
  { key: 'Terms of use', href: '/terms-of-use/' },
  { key: 'Medical disclaimer', href: '/medical-disclaimer/' },
  { key: 'Editorial & medical review', href: '/editorial-and-medical-review-policy/' },
  { key: 'Patient rights', href: '/patient-rights-and-responsibilities/' },
  { key: 'Cancellation & refund', href: '/appointment-cancellation-and-refund/' },
  { key: 'Accessibility', href: '/accessibility-statement/' },
];

/** Breadcrumb: path segment -> page key in the content JSON. */
const SEGMENT_PAGE: Record<string, string> = {
  'orthopaedics': 'orthopaedics',
  'robotic-knee': 'robotic-knee',
  'eye-care': 'eye-care',
  'mental-health': 'mental-health',
  'doctors': 'doctors',
  'about': 'about',
  'media': 'media',
  'contact': 'contact',
  'styleguide': 'styleguide',
  'thank-you': 'thank-you',
  'legal': 'legal',
};

export function pageForSegment(seg: string): string | undefined {
  return SEGMENT_PAGE[seg];
}

/** Resolve a chrome label from the build-generated map (gen-nav-labels.mjs).
    Client-safe: no content-JSON import, so nav chrome never bundles copy(). */
export function navLabel(key: string, l: Locale): string {
  const hit = (NAV_LABELS as Record<string, Record<string, string>>)[l]?.[key];
  if (!hit && process.env.NODE_ENV !== 'production') {
    console.warn(`navLabel: "${key}" not in lib/nav-labels.json — add it in scripts/gen-nav-labels.mjs`);
  }
  return hit ?? key;
}
