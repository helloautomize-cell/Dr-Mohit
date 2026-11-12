'use client';

// Site footer (phase-02 item 5): preview fgrid + hours stacked rows with
// icons, obfuscated email, Get directions, Legal column (7 pages), "Cookie
// settings" link, © line with education disclaimer.
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { SITE } from '@/lib/site-config';
import { NAV_MAIN, LEGAL_PAGES, navLabel } from '@/lib/nav';
import { copy } from '@/lib/copy';
import { Logo } from '@/components/Logo';

import CookieSettings from '@/components/shell/CookieSettings';

export default function SiteFooter() {
  const l = useLocale() as Locale;
  const t = useTranslations('shell');

  const legalLabels: Record<string, string> = {
    'privacy-policy': t('lp.privacy'),
    'terms-of-use': t('lp.terms'),
    'medical-disclaimer': t('lp.disclaimer'),
    'editorial-and-medical-review-policy': t('lp.editorial'),
    'patient-rights-and-responsibilities': t('lp.rights'),
    'appointment-cancellation-and-refund': t('lp.cancelRefund'),
    'accessibility-statement': t('lp.access'),
  };

  const cols = [
    {
      h: copy('global', 'Departments', l),
      links: NAV_MAIN.slice(0, 4).map((n) => ({ href: n.href, label: navLabel(n.key, l) })),
    },
    {
      h: copy('global', 'Hospital', l),
      links: [
        ...NAV_MAIN.slice(4).map((n) => ({ href: n.href, label: navLabel(n.key, l) })),
        { href: '/contact/', label: t('contact') },
      ],
    },
    {
      h: t('legal'),
      links: LEGAL_PAGES.map((n) => {
        const slug = n.href.split('/')[1] ?? '';
        return { href: n.href, label: legalLabels[slug] ?? n.key };
      }),
    },
  ];

  return (
    <footer>
      <div className="wrap">
        <div className="fgrid">
          <div className="fbrand">
            <Link href="/" className="logo" aria-label="Gupta Hospital">
              <Logo locale={l} height={44} />
            </Link>
            <p className="muted faddr">{copy('global', 'Power House Road', l)}</p>
            <p className="fpa">ਗੁਪਤਾ ਹਸਪਤਾਲ</p>
            <div className="fhours">
              <div className="fhour"><span aria-hidden="true">🕘</span><span>{SITE.hours[l]}</span></div>
              <div className="fhour">
                <span aria-hidden="true">📞</span>
                <a href={SITE.phoneMainHref}>{SITE.phoneMain}</a>
              </div>
              <div className="fhour">
                <span aria-hidden="true">✉️</span>
                <ObfuscatedEmail label={t('email')} />
              </div>
              <div className="fhour">
                <span aria-hidden="true">📍</span>
                <a href={SITE.mapsUrl} target="_blank" rel="noopener">{t('directions')}</a>
              </div>
            </div>
          </div>
          {cols.map((c) => (
            <div className="fcol" key={c.h}>
              <h4>{c.h}</h4>
              {c.links.map((lk) => (
                <Link key={lk.href + lk.label} href={lk.href}>
                  {lk.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="legal">
          <span>© 2026 Gupta Hospital, Bathinda · <CookieSettings /></span>
          <span>{copy('global', 'General information only', l)}</span>
        </div>
      </div>
    </footer>
  );
}

// Email kept out of source: assembled at click time.
function ObfuscatedEmail({ label }: { label: string }) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        const [u, d] = SITE.email.split('@');
        window.location.href = `mailto:${u}@${d}`;
      }}
    >
      {label}
    </a>
  );
}
