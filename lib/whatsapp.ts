import type { Locale } from '@/i18n/routing';
import { SITE } from '@/lib/site-config';

// WhatsApp deep-link builder. The mobile action bar sends a page-based
// message in the page language (phase-02 item 4).
export function whatsappUrl(pageTitle: string, locale: Locale): string {
  const msg =
    locale === 'pa'
      ? `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਗੁਪਤਾ ਹਸਪਤਾਲ, "${pageTitle}" ਪੰਨੇ ਬਾਰੇ ਪੁੱਛਣਾ ਹੈ:`
      : `Hello Gupta Hospital, I have a question about the "${pageTitle}" page:`;
  return `${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
}

// Treatment-card links on /orthopaedics/ ask about a specific treatment with
// Dr. Mohit — same message text in both locales, as in the approved preview.
export function whatsappAsk(topic: string): string {
  return `${SITE.whatsapp}?text=${encodeURIComponent(
    `Hello Gupta Hospital, I would like to ask about ${topic} with Dr. Mohit Gupta.`,
  )}`;
}
