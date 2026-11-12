import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { LegalDoc, legalMeta } from '@/components/LegalDoc';
import type { Metadata } from 'next';

export const metadata: Metadata = legalMeta;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <LegalDoc slug="appointment-cancellation-and-refund" locale={locale as Locale} />;
}
