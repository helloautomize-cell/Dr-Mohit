// Consent-gated analytics (phase-07 item 4). GA4 loads ONLY after the user
// accepts analytics in the cookie banner; Consent Mode v2 defaults to denied
// for every storage type (ad signals stay denied even after opt-in).
// No PII or health data ever leaves: event params are whitelisted keys and
// page paths are stripped of query strings (utm_* params may be sent by the
// page itself via gtag config, never by us).
// Shared module: the consent-default snippet is imported by the server
// layout, the rest runs client-side only (everything guards on window).

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

/** Consent Mode v2 default — emitted inline in <body> before anything loads. */
export const CONSENT_DEFAULT_SNIPPET = [
  'window.dataLayer=window.dataLayer||[];',
  'function gtag(){window.dataLayer.push(arguments);}',
  'window.gtag=window.gtag||gtag;',
  "gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});",
].join('');

let loading = false;
let loaded = false;
const queue: [EventName, Record<string, string | number | boolean>][] = [];

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(args);
}

/** Load gtag.js once consent is granted. Safe to call repeatedly. */
export function enableAnalytics() {
  if (loaded || loading || !GA_ID || typeof window === 'undefined') return;
  loading = true;
  const s = document.createElement('script');
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  s.async = true;
  s.onload = () => {
    loaded = true;
    window.gtag = window.gtag ?? gtag;
    gtag('js', new Date());
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('config', GA_ID, {
      anonymize_ip: true,
      send_page_view: true,
      // never carry query strings except utm_* attribution
      page_location: location.origin + location.pathname,
    });
    queue.splice(0).forEach(([n, p]) => trackEvent(n, p));
  };
  document.head.appendChild(s);
}

export function analyticsReady(): boolean {
  return loaded;
}

type EventName =
  | 'book_click'
  | 'call_click'
  | 'whatsapp_click'
  | 'directions_click'
  | 'map_load'
  | 'video_play'
  | 'generate_lead';

const ALLOWED = new Set(['form_type', 'link_text', 'page_path', 'value', 'currency']);

function cleanParams(p: Record<string, string | number | boolean>) {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(p)) {
    if (!ALLOWED.has(k)) continue;
    if (k === 'page_path') {
      out[k] = String(v).split('?')[0]?.split('#')[0] ?? '';
    } else {
      out[k] = v;
    }
  }
  return out;
}

/** Fire a GA4 event if consented; queue briefly if gtag is still loading. */
export function trackEvent(name: EventName, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  const p = cleanParams(params);
  if (!loaded) {
    if (loading) queue.push([name, p]);
    return;
  }
  gtag('event', name, p);
}

/** Map a clicked anchor to the spec'd event name, or null. */
export function eventForHref(href: string | null): EventName | null {
  if (!href) return null;
  if (href.startsWith('tel:')) return 'call_click';
  if (href.includes('wa.me') || href.includes('whatsapp')) return 'whatsapp_click';
  if (href.includes('maps.google') || href.includes('google.com/maps') || href.includes('goo.gl/maps')) return 'directions_click';
  if (href.includes('/contact')) return 'book_click';
  return null;
}
