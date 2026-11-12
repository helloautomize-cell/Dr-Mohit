import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import { OrthopaedicsPage } from '@/components/pages/OrthopaedicsPage';
import { pageMeta, medicalWebPageLd } from '@/lib/seo';

const ROUTE = '/orthopaedics/';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta('orthopaedics', ROUTE, 'Bones, joints', 'The department that began as an orthopaedic clinic', locale as Locale);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as Locale;
  return (
    <>
      <OrthopaedicsPage locale={l} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            medicalWebPageLd({
              page: 'orthopaedics',
              route: ROUTE,
              h1Key: 'Bones, joints',
              ledeKey: 'The department that began as an orthopaedic clinic',
              locale: l,
              reviewer: { name: 'Dr. Mohit Gupta', specialty: 'Orthopedic' },
            }),
          ),
        }}
      />
    </>
  );
}
