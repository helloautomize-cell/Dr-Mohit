import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import { RoboticKneePage } from '@/components/pages/RoboticKneePage';
import { pageMeta, medicalWebPageLd, breadcrumbLd, ldGraph } from '@/lib/seo';
import { crumbTrail } from '@/lib/crumbs';
import { JsonLd } from '@/components/JsonLd';

const ROUTE = '/orthopaedics/robotic-knee-replacement/';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta('robotic-knee', ROUTE, 'Robotic-assisted knee replacement.', 'Gupta Hospital uses the Johnson', locale as Locale);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as Locale;
  return (
    <>
      <RoboticKneePage locale={l} />
      <JsonLd
        data={ldGraph(
          breadcrumbLd(crumbTrail(ROUTE, l), l),
          medicalWebPageLd({
            page: 'robotic-knee',
            route: ROUTE,
            h1Key: 'Robotic-assisted knee replacement.',
            ledeKey: 'Gupta Hospital uses the Johnson',
            locale: l,
            reviewer: { name: 'Dr. Mohit Gupta', specialty: 'Orthopedic' },
          }),
        )}
      />
    </>
  );
}
