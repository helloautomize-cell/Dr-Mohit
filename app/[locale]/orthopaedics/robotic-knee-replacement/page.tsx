import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import { RoboticKneePage } from '@/components/pages/RoboticKneePage';
import { pageMeta, medicalWebPageLd } from '@/lib/seo';

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            medicalWebPageLd({
              page: 'robotic-knee',
              route: ROUTE,
              h1Key: 'Robotic-assisted knee replacement.',
              ledeKey: 'Gupta Hospital uses the Johnson',
              locale: l,
              reviewer: { name: 'Dr. Mohit Gupta', specialty: 'Orthopedic' },
            }),
          ),
        }}
      />
    </>
  );
}
