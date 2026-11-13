// Breadcrumb trail shared by the nav UI (components/shell/Breadcrumbs.tsx) and
// by each page's JSON-LD @graph (lib/seo breadcrumbLd). Segment labels resolve
// through the same sources the UI already used: global copy for content pages,
// doctor names for doctor leaf routes, messages/*.json for legal pages and the
// "Home" root label.
import type { Locale } from '@/i18n/routing';
import { navLabel } from './nav';
import en from '../messages/en.json';
import pa from '../messages/pa.json';

// segment -> copy key in `global` (content pages)
const SEG_LABEL: Record<string, string> = {
  orthopaedics: 'Orthopaedics',
  'eye-care': 'Eye care',
  'mental-health': 'Mental health',
  doctors: 'Doctors',
  about: 'About',
  media: 'Media',
  contact: 'Book appointment',
  'robotic-knee': 'Robotic knee',
  'robotic-knee-replacement': 'Robotic knee',
  'knee-and-hip-replacement': 'Knee and hip replacement',
  'fractures-and-trauma': 'Fractures and trauma',
  'arthroscopy-and-sports-injuries': 'Arthroscopy and sports injuries',
  'back-pain-clinic': 'Back pain clinic',
  'plan-your-visit': 'Plan your visit',
};

// doctor leaf segments -> display names (locale-aware)
const SEG_DOCTOR: Record<string, { en: string; pa: string }> = {
  'dr-mohit-gupta': { en: 'Dr. Mohit Gupta', pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ' },
  'dr-parul-gupta': { en: 'Dr. Parul Gupta', pa: 'ਡਾ. ਪਾਰੁਲ ਗੁਪਤਾ' },
  'dr-amit-gupta': { en: 'Dr. Amit Gupta', pa: 'ਡਾ. ਅਮਿਤ ਗੁਪਤਾ' },
};

// segment -> key under shell.lp in messages/*.json (legal + utility pages)
const SEG_LP: Record<string, string> = {
  'privacy-policy': 'privacy',
  'terms-of-use': 'terms',
  'medical-disclaimer': 'disclaimer',
  'editorial-and-medical-review-policy': 'editorial',
  'patient-rights-and-responsibilities': 'rights',
  'appointment-cancellation-and-refund': 'cancelRefund',
  'accessibility-statement': 'access',
};

const MSG: Record<Locale, typeof en> = { en, pa };

function msg(l: Locale, path: string): string {
  let node: unknown = MSG[l];
  for (const k of path.split('.')) node = (node as Record<string, unknown>)?.[k];
  return typeof node === 'string' ? node : path;
}

export interface Crumb {
  name: string;
  href: string;
}

/** Breadcrumb items for a pathname like "/orthopaedics/knee-and-hip-replacement/"
    or "/pa/about/". Root is the localized "Home" label; inner segments resolve
    through doctor names, legal labels, then content copy. */
export function crumbTrail(pathname: string, l: Locale): Crumb[] {
  const segs = pathname.replace(/^\/(en|pa)(?=\/|$)/, '').split('/').filter(Boolean);
  return [
    { name: msg(l, 'shell.homePage'), href: '/' },
    ...segs.map((s, i) => ({
      name: SEG_DOCTOR[s]
        ? SEG_DOCTOR[s][l === 'pa' ? 'pa' : 'en']
        : SEG_LP[s]
          ? msg(l, `shell.lp.${SEG_LP[s]}`)
          : SEG_LABEL[s]
            ? navLabel(SEG_LABEL[s], l)
            : s,
      href: `/${segs.slice(0, i + 1).join('/')}/`,
    })),
  ];
}
