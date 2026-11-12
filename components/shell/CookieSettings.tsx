'use client';

// Footer "Cookie settings" link — reopens the consent banner.
import { reopenConsent } from '@/lib/consent';
import { useTranslations } from 'next-intl';

export default function CookieSettings() {
  const t = useTranslations('shell');
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        reopenConsent();
      }}
    >
      {t('cookieSettings')}
    </a>
  );
}
