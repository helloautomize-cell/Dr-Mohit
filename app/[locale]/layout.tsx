import type { Metadata } from 'next';
import { Geist, Geist_Mono, Noto_Sans_Gurmukhi } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, localeToHtmlLang, type Locale } from '@/i18n/routing';
import SiteEffects from '@/components/SiteEffects';
import Shell from '@/components/shell/Shell';
import { AnalyticsGate } from '@/components/shell/AnalyticsGate';
import { SITE_INDEXABLE } from '@/lib/site-config';
import { CONSENT_DEFAULT_SNIPPET } from '@/lib/analytics';
import '../globals.css';

// Self-hosted via next/font; only Geist (the body face) is preloaded.
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  preload: false,
});
const gurmukhi = Noto_Sans_Gurmukhi({
  subsets: ['gurmukhi', 'latin'],
  variable: '--font-pa',
  preload: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://guptahospitalbathinda.com',
  ),
  title: {
    default: 'Gupta Hospital Bathinda',
    template: '%s · Gupta Hospital',
  },
  description:
    'Bone, eye and mental health care for Bathinda. One family of doctors on Power House Road since 1980.',
  // Until launch approval every host is noindex (phase-02 item 9).
  ...(SITE_INDEXABLE ? {} : { robots: { index: false, follow: false } }),
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={localeToHtmlLang[locale as Locale]}
      className={`${geist.variable} ${geistMono.variable} ${gurmukhi.variable}`}
    >
      <body>
        {/* GA4 Consent Mode v2 defaults: all storage denied until the cookie
            banner grants analytics_storage. No network requests. */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SNIPPET }} />
        <NextIntlClientProvider>
          <div id="prog" aria-hidden="true" />
          <Shell>{children}</Shell>
          <SiteEffects />
          <AnalyticsGate />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
