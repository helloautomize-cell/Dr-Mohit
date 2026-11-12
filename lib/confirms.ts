// [CONFIRM] system (phase-03 item 2): values the hospital must confirm.
// Development shows a yellow chip; production hides it. launch-check fails
// while any open items remain.
import type { Locale } from '@/i18n/routing';

export interface ConfirmItem {
  id: string;
  note: string;
}

// Seeded from resources/docs/facts-and-compliance.md "Still to confirm".
export const CONFIRMS: ConfirmItem[] = [

  { id: 'parul-degrees', note: 'Dr. Parul Gupta degree list (MBBS, MS unconfirmed)' },
  { id: 'amit-md', note: 'Dr. Amit Gupta MD Psychiatry credential' },
  { id: 'domain', note: 'Final domain name' },

  { id: 'mohit-years', note: 'Dr. Mohit Gupta experience phrasing (year count vs over a decade)' },

  { id: 'legal-text', note: 'All legal page wording (hospital legal review)' },
  { id: 'pa-legal-translation', note: 'Punjabi legal text pending translation review' },
  { id: 'privacy-contact', note: 'Privacy contact / grievance officer name and email (DPDP Rules 2025)' },
  { id: 'refund-terms', note: 'Whether any advance payment is taken and its refund terms' },

  // Orthopaedics sub-pages (v14 kit).
  { id: 'spine-procedures', note: 'Which spine procedures are offered at the hospital (back pain clinic)' },

];

/** Chip marker text rendered after a confirmed-pending value. */
export function confirmText(l: Locale): string {
  return l === 'pa' ? '[ਪੁਸ਼ਟੀ ਬਾਕੀ]' : '[CONFIRM]';
}
