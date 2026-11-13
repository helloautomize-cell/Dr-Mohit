'use client';

// Full-screen mobile menu sheet (phase-02 item 3): white sheet, accordion
// groups collapsed, 48px rows, fixed footer with Book + Call + hours line,
// language switch. Esc / close button to dismiss.
import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { SITE } from '@/lib/site-config';
import { NAV_MAIN, ORTHO_MENU, navLabel } from '@/lib/nav';
import LocaleSwitch from '@/components/LocaleSwitch';
import { OrthoMenuIcon } from '@/components/shell/OrthoMenuIcons';

import { Logo } from '@/components/Logo';
import { BookButton } from '@/components/Buttons';

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const l = useLocale() as Locale;
  const t = useTranslations('shell');

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={t('menu')}>
      <div className="top">
        <Link href="/" className="logo" onClick={onClose}>
          <Logo locale={l} height={38} />
        </Link>
        <button className="x" type="button" aria-label={t('closeMenu')} onClick={onClose}>
          ×
        </button>
      </div>
      <nav aria-label={t('mobileNav')} className="mnav">
        <Link href="/" onClick={onClose} className="mrow">
          {t('homePage')}
        </Link>
        {/* Orthopaedics group as accordion */}
        <details className="mgrp">
          <summary className="mrow">{navLabel('Orthopaedics', l)}</summary>
          <div className="msub">
            {ORTHO_MENU.map((s) => (
              <Link key={s.key} href={s.href} onClick={onClose} className="mrow sub">
                <span className="ddic" aria-hidden="true">
                  <OrthoMenuIcon k={s.key} />
                </span>
                {navLabel(s.key, l)}
              </Link>
            ))}
          </div>
        </details>
        {NAV_MAIN.slice(1).map((item) => (
          <Link key={item.href} href={item.href} onClick={onClose} className="mrow">
            {navLabel(item.key, l)}
          </Link>
        ))}
        <Link href="/contact/" onClick={onClose} className="mrow">
          {navLabel('Book appointment', l)}
        </Link>
      </nav>
      <div className="mfoot">
        <LocaleSwitch />
        <div className="mfoot-btns">
          <BookButton href="/contact/" onClick={onClose}>
            {navLabel('Book appointment', l)}
          </BookButton>
          <a className="btn btn-line" href={SITE.phoneMainHref}>
            {t('call')}
          </a>
        </div>
        <span className="mfoot-hours">
          {SITE.hours[l]}
        </span>
      </div>
    </div>
  );
}
