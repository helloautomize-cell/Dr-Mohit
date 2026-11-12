'use client';

// Branded 404 linking to the three departments (phase-02 item 7).
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { navLabel } from '@/lib/nav';
import { Logo } from '@/components/Logo';

export default function LocaleNotFound() {
  const l = useLocale() as Locale;
  const t = useTranslations('shell.nf');
  return (
    <div className="nf">
      <div>
        <Logo locale={l} height={52} />
        <h1 style={{ marginTop: 24 }}>{t('title')}</h1>
        <p className="muted">{t('body')}</p>
        <div className="nf-links">
          <Link className="btn btn-brand" href="/orthopaedics/">
            {navLabel('Orthopaedics', l)}
          </Link>
          <Link className="btn btn-line" href="/eye-care/">
            {navLabel('Eye care', l)}
          </Link>
          <Link className="btn btn-line" href="/mental-health/">
            {navLabel('Mental health', l)}
          </Link>
        </div>
        <div style={{ marginTop: 32 }}>
          <Link href="/" style={{ color: 'var(--brand)' }}>
            {t('back')}
          </Link>
        </div>
      </div>
    </div>
  );
}
