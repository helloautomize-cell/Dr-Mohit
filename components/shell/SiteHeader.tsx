'use client';

// Global shell header (phase-02 items 1-2): desktop utility bar + sticky
// header 88→68px on scroll (mobile 60px), Radix NavigationMenu Orthopaedics
// dropdown with explicit grid + Dr. Mohit card, EN/ਪੰਜਾਬੀ, BookButton.
import { useEffect, useState } from 'react';
import * as Nav from '@radix-ui/react-navigation-menu';
import Image from 'next/image';
import { Link, usePathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { SITE } from '@/lib/site-config';
import { NAV_MAIN, ORTHO_MENU, navLabel } from '@/lib/nav';
import LocaleSwitch from '@/components/LocaleSwitch';
import { BookButton } from '@/components/Buttons';

import { Logo } from '@/components/Logo';
import { useTextScale } from '@/lib/textscale';

export default function SiteHeader({ onMenu }: { onMenu: () => void }) {
  const l = useLocale() as Locale;
  const t = useTranslations('shell');
  const pathname = usePathname();
  const [sc, setSc] = useState(false);
  const { scale, bump } = useTextScale();

  useEffect(() => {
    const fn = () => setSc(window.scrollY > 8);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const current = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <>
      {/* Utility bar — desktop only (spec item 1) */}
      <div className="ubar" role="note">
        <div className="wrap ubar-in">
          <span>{t('hours', { v: SITE.hours[l] })}</span>
          <a className="ubar-phone" href={SITE.phoneMainHref}>{SITE.phoneMain}</a>
          <a className="ubar-emg" href="tel:112">{t('emergency')}</a>
          <span className="ubar-aa" role="group" aria-label={t('textsize')}>
            <button type="button" onClick={() => bump(-1)} aria-pressed={scale < 1} aria-label={`A- ${t('smaller')}`}>A-</button>
            <button type="button" onClick={() => bump(1)} aria-pressed={scale > 1} aria-label={`A+ ${t('larger')}`}>A+</button>
          </span>
        </div>
      </div>

      <header id="hdr" className={sc ? 'sc' : ''}>
        <div className="wrap hdr-in">
          <Link href="/" className="logo" aria-label={t('home')}>
            <Logo locale={l} height={sc ? 34 : 42} />
          </Link>

          <Nav.Root className="navroot" delayDuration={150}>
            <Nav.List className="main navlist" aria-label={t('main')}>
              {NAV_MAIN.map((item, i) =>
                i === 0 ? (
                  <Nav.Item key={item.href} value="ortho">
                    <Nav.Trigger
                      className={`navlink${current(item.href) ? ' cur' : ''}`}
                      aria-current={current(item.href) ? 'page' : undefined}
                    >
                      {navLabel(item.key, l)}
                      <span className="caret" aria-hidden="true" />
                    </Nav.Trigger>
                    <Nav.Content className="ddpanel">
                      {/* explicit CSS grid — Radix viewport bug workaround */}
                      <div className="ddgrid">
                        {ORTHO_MENU.map((sub) => (
                          <Nav.Link key={sub.key} asChild>
                            <Link href={sub.href} className="ddlink">
                              {navLabel(sub.key, l)}
                            </Link>
                          </Nav.Link>
                        ))}
                        <Nav.Link asChild>
                          <Link href="/doctors/" className="dddoc">
                            <Image
                              src="/images/photos/dr-mohit-gupta-desk-avatar.jpg"
                              alt=""
                              width={44}
                              height={44}
                              className="dddoc-im"
                            />
                            <span>
                              <b>Dr. Mohit Gupta</b>
                              <small>{t('orthoLead')}</small>
                            </span>
                          </Link>
                        </Nav.Link>
                      </div>
                    </Nav.Content>
                  </Nav.Item>
                ) : (
                  <Nav.Item key={item.href}>
                    <Nav.Link asChild>
                      <Link
                        href={item.href}
                        className={`navlink${current(item.href) ? ' cur' : ''}`}
                        aria-current={current(item.href) ? 'page' : undefined}
                      >
                        {navLabel(item.key, l)}
                      </Link>
                    </Nav.Link>
                  </Nav.Item>
                ),
              )}
            </Nav.List>
            <Nav.Viewport className="navviewport" />
          </Nav.Root>

          <div className="hr">
            <LocaleSwitch />
            <BookButton href="/contact/" className="btn-brand">
              {navLabel('Book appointment', l)}
            </BookButton>
            <button
              className="menu-btn"
              type="button"
              aria-label={t('openMenu')}
              onClick={onMenu}
            >
              <span />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
