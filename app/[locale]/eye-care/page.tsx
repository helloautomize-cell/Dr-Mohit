import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import { EyeCarePage } from '@/components/pages/EyeCarePage';
import { pageMeta, medicalWebPageLd } from '@/lib/seo';

const ROUTE = '/eye-care/';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta('eye-care', ROUTE, 'Complete eye care.', 'Led by Dr. Parul Gupta', locale as Locale);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as Locale;
  return (
    <>
      <EyeCarePage locale={l} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            medicalWebPageLd({
              page: 'eye-care',
              route: ROUTE,
              h1Key: 'Complete eye care.',
              ledeKey: 'Led by Dr. Parul Gupta',
              locale: l,
              reviewer: { name: 'Dr. Parul Gupta', specialty: 'Ophthalmologic' },
            }),
          ),
        }}
      />
    </>
  );
}
