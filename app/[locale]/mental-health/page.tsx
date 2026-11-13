import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import { MentalHealthPage } from '@/components/pages/MentalHealthPage';
import { pageMeta, medicalWebPageLd, breadcrumbLd, ldGraph } from '@/lib/seo';
import { crumbTrail } from '@/lib/crumbs';
import { JsonLd } from '@/components/JsonLd';

const ROUTE = '/mental-health/';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta('mental-health', ROUTE, 'Mental health and de-addiction.', 'Since 2000, Dr. Amit Gupta', locale as Locale);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as Locale;
  return (
    <>
      <MentalHealthPage locale={l} />
      <JsonLd
        data={ldGraph(
          breadcrumbLd(crumbTrail(ROUTE, l), l),
          medicalWebPageLd({
            page: 'mental-health',
            route: ROUTE,
            h1Key: 'Mental health and de-addiction.',
            ledeKey: 'Since 2000, Dr. Amit Gupta',
            locale: l,
            reviewer: { name: 'Dr. Amit Gupta', specialty: 'Psychiatric' },
          }),
        )}
      />
    </>
  );
}
