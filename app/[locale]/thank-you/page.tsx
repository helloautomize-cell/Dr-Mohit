// Thank-you landing after a successful appointment request (phase-07 item 3):
// noindex, shows the IST confirmation time and the emergency line.
import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { SITE } from '@/lib/site-config';
import { LeadBeacon } from '@/components/shell/AnalyticsGate';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; ts?: string }>;
}) {
  const { locale } = await params;
  const { type, ts } = await searchParams;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'shell.ty' });

  const ms = Number(ts);
  const when = Number.isFinite(ms) && ms > 0
    ? new Date(ms).toLocaleString(locale === 'pa' ? 'pa-IN' : 'en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : null;

  return (
    <div className="nf">
      {type === 'appointment' ? <LeadBeacon formType="appointment" /> : null}
      <div>
        <h1>{t('title')}</h1>
        {when ? (
          <p className="muted" style={{ marginTop: 10 }}>
            {t('received', { time: when })}
          </p>
        ) : null}
        <p className="muted" style={{ marginTop: 14 }}>
          {t('body')}
        </p>
        <p className="muted" style={{ marginTop: 8 }}>
          {t('emergency', { phone: SITE.phoneMain })}
        </p>
        <p style={{ marginTop: 26 }}>
          <Link className="lnk" href={locale === 'pa' ? '/pa/' : '/'}>
            <span>{t('back')}</span>
            <span className="ar">→</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
