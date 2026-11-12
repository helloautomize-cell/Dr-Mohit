import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'pa'],
  defaultLocale: 'en',
  // English stays unprefixed (/), Punjabi gets /pa/.
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];

export const localeToHtmlLang: Record<Locale, string> = {
  en: 'en-IN',
  pa: 'pa-IN',
};
