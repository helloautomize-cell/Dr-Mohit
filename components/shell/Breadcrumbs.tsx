'use client';

// Breadcrumbs on inner pages (phase-02 item 7) + BreadcrumbList JSON-LD.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { navLabel } from '@/lib/nav';

// segment -> copy key in `global` (content pages)
const SEG_LABEL: Record<string, string> = {
  'orthopaedics': 'Orthopaedics',
  'eye-care': 'Eye care',
  'mental-health': 'Mental health',
  'doctors': 'Doctors',
  'about': 'About',
  'media': 'Media',
  'contact': 'Book appointment',
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

export default function Breadcrumbs() {
  const l = useLocale() as Locale;
  const t = useTranslations('shell');
  const tLp = useTranslations('shell.lp');
  const pathname = usePathname() ?? '/';
  const segs = pathname.replace(/^\/(en|pa)(?=\/|$)/, '').split('/').filter(Boolean);

  if (segs.length === 0 || pathname.includes('styleguide')) return null;

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://guptahospitalbathinda.com';
  const items = [
    { name: t('homePage'), href: '/' },
    ...segs.map((s, i) => ({
      name: SEG_DOCTOR[s]
        ? SEG_DOCTOR[s][l === 'pa' ? 'pa' : 'en']
        : SEG_LP[s]
          ? tLp(SEG_LP[s] as 'privacy')
          : SEG_LABEL[s]
            ? navLabel(SEG_LABEL[s], l)
            : s,
      href: `/${segs.slice(0, i + 1).join('/')}/`,
    })),
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${base}${l === 'pa' ? '/pa' : ''}${it.href}`,
    })),
  };

  return (
    <>
      <nav className="bcrumb wrap" aria-label="Breadcrumb">
        <ol>
          {items.map((it, i) => (
            <li key={it.href}>
              {i < items.length - 1 ? <Link href={it.href}>{it.name}</Link> : <span>{it.name}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
