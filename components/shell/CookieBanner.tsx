'use client';

// Cookie banner (phase-02 item 6): glass card bottom-left above the mobile
// action bar; Essential vs Analytics; Accept / Decline / Settings.
import { useState } from 'react';
import { useConsent, setConsent } from '@/lib/consent';
import { useTranslations } from 'next-intl';

export default function CookieBanner() {
  const c = useConsent();
  const t = useTranslations('shell');
  const [open, setOpen] = useState(false);

  if (c.decided) return null;

  return (
    <div className="cb" role="dialog" aria-label={t('cookieTitle')} aria-live="polite">
      <div className="cb-card">
        <b>{t('cookieTitle')}</b>
        <p>{t('cookieBody')}</p>
        {open && (
          <div className="cb-opts">
            <label>
              <input type="checkbox" checked disabled /> {t('cookieEssential')}
            </label>
            <label>
              <input type="checkbox" id="cb-an" /> {t('cookieAnalytics')}
            </label>
          </div>
        )}
        <div className="cb-btns">
          <button type="button" className="cb-acc" onClick={() => setConsent(true)}>
            {t('acceptAll')}
          </button>
          <button
            type="button"
            onClick={() => {
              if (open) {
                const el = document.getElementById('cb-an') as HTMLInputElement | null;
                setConsent(el?.checked === true);
              } else setConsent(false);
            }}
          >
            {open ? t('saveChoice') : t('decline')}
          </button>
          {!open && (
            <button type="button" onClick={() => setOpen(true)}>
              {t('settings')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
