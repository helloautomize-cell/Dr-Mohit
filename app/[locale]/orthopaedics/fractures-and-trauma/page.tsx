import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import { ORTHO_SUBPAGES } from '@/lib/copy';
import { orthoMeta, orthoMedicalWebPageLd } from '@/lib/ortho-seo';
import { breadcrumbLd, ldGraph } from '@/lib/seo';
import { crumbTrail } from '@/lib/crumbs';
import { JsonLd } from '@/components/JsonLd';
import { FracturesPage } from '@/components/pages/FracturesPage';

const ROUTE = '/orthopaedics/fractures-and-trauma/';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return orthoMeta(ORTHO_SUBPAGES.fractures, ROUTE, 'Broken bones, set right', 'From a child’s wrist', locale as Locale);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as Locale;
  return (
    <>
      <FracturesPage locale={l} />
      <JsonLd
        data={ldGraph(
          breadcrumbLd(crumbTrail(ROUTE, l), l),
          orthoMedicalWebPageLd(ORTHO_SUBPAGES.fractures, ROUTE, 'Broken bones, set right', 'From a child’s wrist', l),
        )}
      />
    </>
  );
}
