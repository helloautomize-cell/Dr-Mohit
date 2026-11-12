'use client';

// Consent-gated analytics mount (phase-07 item 4). Nothing loads until the
// user accepts analytics in the cookie banner; a delegated click listener
// maps tel:/wa.me//contact/maps links + [data-track] elements to the spec'd
// GA4 events. Renders nothing.
import { useEffect } from 'react';
import { useConsent } from '@/lib/consent';
import { enableAnalytics, trackEvent, eventForHref, GA_ID } from '@/lib/analytics';

export function AnalyticsGate() {
  const consent = useConsent();

  useEffect(() => {
    if (consent.analytics) enableAnalytics();
  }, [consent.analytics]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.('a,[data-track]') as HTMLElement | null;
      if (!el) return;
      const explicit = el.dataset.track;
      const name = explicit ?? eventForHref((el as HTMLAnchorElement).href ?? el.getAttribute('href'));
      if (!name) return;
      trackEvent(name as Parameters<typeof trackEvent>[0], {
        page_path: location.pathname,
        link_text: (el.textContent ?? '').trim().slice(0, 60),
      });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}

/** Fires generate_lead once on mount (thank-you?type=appointment). */
export function LeadBeacon({ formType }: { formType: string }) {
  useEffect(() => {
    trackEvent('generate_lead', { form_type: formType });
  }, [formType]);
  return null;
}

export { GA_ID };
