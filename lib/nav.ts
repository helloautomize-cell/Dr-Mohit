import type { Locale } from '@/i18n/routing';
import { copy } from '@/lib/copy';

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
  { key: 'Knee and hip replacement', href: '/orthopaedics/' },
  { key: 'Fractures and trauma', href: '/orthopaedics/' },
  { key: 'Arthroscopy and sports injuries', href: '/orthopaedics/' },
  { key: 'Back pain clinic', href: '/orthopaedics/' },
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

/** Resolve a chrome label through copy with a safe fallback. */
export function navLabel(key: string, l: Locale): string {
  try {
    return copy('global', key, l);
  } catch {
    return key;
  }
}
