'use client';

// Mobile action bar (phase-02 item 4): Book Now / Call Now (number sheet) /
// WhatsApp below 1024px; gradient surface at 92% under glass; hidden while
// typing in a form and on the thank-you page; shows after 360px scroll.
// Desktop: floating WhatsApp circle.
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import Link from 'next/link';
import type { Locale } from '@/i18n/routing';
import { SITE } from '@/lib/site-config';
import { whatsappUrl } from '@/lib/whatsapp';

export default function ActionBar() {
  const l = useLocale() as Locale;
  const t = useTranslations('shell');
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [typing, setTyping] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [title, setTitle] = useState('Gupta Hospital');
  const thankYou = pathname.includes('thank-you');

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 360);
    const onFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement;
      if (el.matches('input,textarea,select,[contenteditable]')) setTyping(true);
    };
    const onBlur = () => setTyping(false);
    onScroll();
    setTitle(document.title || 'Gupta Hospital');
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('focusin', onFocus);
    document.addEventListener('focusout', onBlur);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('focusout', onBlur);
    };
  }, []);

  const hidden = !show || typing || thankYou;

  return (
    <>
      {/* mobile bar */}
      <div className={`mbar2${hidden ? '' : ' show'}`} role="toolbar" aria-label={t('quickActions')}>
        <Link href="/contact/" className="b">
          {t('bookNow')}
        </Link>
        <button type="button" onClick={() => setSheet(true)}>
          {t('callNow')}
        </button>
        <a href={whatsappUrl(title, l)} target="_blank" rel="noopener">
          WhatsApp
        </a>
      </div>

      {/* call sheet */}
      {sheet && (
        <div className="csheet-bg" onClick={() => setSheet(false)}>
          <div className="csheet" role="dialog" aria-label={t('callNow')} onClick={(e) => e.stopPropagation()}>
            <a className="csheet-row" href={SITE.phoneMainHref}>
              <b>{SITE.phoneMain}</b>
              <span>{t('appointments')}</span>
            </a>
            <a className="csheet-row" href={SITE.phoneEyeHref}>
              <b>{SITE.phoneEye}</b>
              <span>{t('eyeDept')}</span>
            </a>
            <button className="csheet-cancel" type="button" onClick={() => setSheet(false)}>
              {t('cancel')}
            </button>
          </div>
        </div>
      )}

      {/* desktop floating WhatsApp */}
      <a
        className="wafab"
        href={whatsappUrl(title, l)}
        target="_blank"
        rel="noopener"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.1 2.2-.2 3.7a11 11 0 0 0 4.3 4c.6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z" />
        </svg>
      </a>
    </>
  );
}
