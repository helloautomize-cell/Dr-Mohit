'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { gsap, ScrollTrigger, useGSAP, ANIM_OK } from './v2gsap';
import { V2Icon, type V2IconName } from './icons';
import { SITE } from '@/lib/site-config';

// Home hero — three doctor panels (tablist) that auto-advance every 6s, pause
// on hover, and open on hover (mouse), click/tap or arrow keys. Ported from
// resources/reference/hero-sections.html + .js.
const PANELS: { key: 'mohit' | 'parul' | 'amit'; icon: V2IconName; img: string; focal: string; href: string }[] = [
  { key: 'mohit', icon: 'i-bone', img: '/images/hero/doctor-mohit-portrait.jpg', focal: '50% 30%', href: '/orthopaedics/' },
  { key: 'parul', icon: 'i-eye', img: '/images/hero/doctor-parul-portrait.jpg', focal: '50% 30%', href: '/eye-care/' },
  { key: 'amit', icon: 'i-mind', img: '/images/hero/doctor-amit-portrait.jpg', focal: '50% 30%', href: '/mental-health/' },
];

const YEARS = new Date().getFullYear() - 1980;
const AUTO_MS = 6000;

type PanelCopy = { vt: string; dept: string; name: string; role: string; aria: string; alt: string };

export function V2Hero() {
  const t = useTranslations('home.hero');
  const scope = useRef<HTMLElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const yrRef = useRef<HTMLElement>(null);
  const factsRef = useRef<HTMLDivElement>(null);
  const [cur, setCur] = useState(0);
  const [cycle, setCycle] = useState(0); // bumps to restart the progress bar
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  const open = (i: number) => {
    setCur(i);
    setCycle((c) => c + 1);
  };
  const pause = (v: boolean) => {
    pausedRef.current = v;
    setPaused(v);
  };

  // Auto-advance only when motion is allowed (reduced motion: no cycling).
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(ANIM_OK, () => {
      const id = setInterval(() => {
        if (!pausedRef.current) {
          setCur((c) => (c + 1) % PANELS.length);
          setCycle((c) => c + 1);
        }
      }, AUTO_MS);
      return () => clearInterval(id);
    });
    return () => mm.revert();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(ANIM_OK, () => {
        gsap.from('.v2-hxw .v2-w', { yPercent: 115, rotate: 5, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.06, delay: 0.1 });
        gsap.from('.v2-hfade', { y: 36, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: 0.45 });
        gsap.fromTo(
          '.v2-hp',
          { clipPath: 'inset(100% 0% 0% 0% round 28px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.4, ease: 'expo.inOut', stagger: 0.14, delay: 0.2, clearProps: 'clipPath' },
        );
        gsap.to('.v2-hp img', {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: { trigger: scope.current, start: 'top top', end: 'bottom top', scrub: true },
        });
        const el = yrRef.current!;
        ScrollTrigger.create({
          trigger: factsRef.current,
          start: 'top 95%',
          once: true,
          onEnter: () => {
            const end = +el.textContent!;
            const o = { v: 0 };
            gsap.to(o, {
              v: end,
              duration: 1.6,
              ease: 'power3.out',
              onUpdate: () => {
                el.textContent = String(Math.round(o.v));
              },
            });
          },
        });
      });
    },
    { scope },
  );

  const onKey = (i: number) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open(i);
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const n = e.key === 'ArrowRight' ? (i + 1) % PANELS.length : (i + PANELS.length - 1) % PANELS.length;
      open(n);
      panelsRef.current[n]?.focus();
    }
  };

  return (
    <section className="v2 v2-hx" ref={scope}>
      <div className="wrap v2-hx-grid">
        <div
          className={paused ? 'v2-hx-panels paused' : 'v2-hx-panels'}
          role="tablist"
          aria-label={t('panelsAria')}
          onMouseEnter={() => pause(true)}
          onMouseLeave={(e) => pause(e.currentTarget.contains(document.activeElement))}
          onFocusCapture={() => pause(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) pause(e.currentTarget.matches(':hover'));
          }}
        >
          {PANELS.map((p, i) => {
            const m = t.raw(`panels.${p.key}`) as PanelCopy;
            const on = i === cur;
            return (
              <div
                key={p.key}
                ref={(el) => {
                  panelsRef.current[i] = el;
                }}
                className={on ? 'v2-hp on' : 'v2-hp'}
                tabIndex={on ? 0 : -1}
                role="tab"
                aria-label={m.name}
                aria-selected={on}
                onClick={(e) => {
                  if (!on) {
                    e.preventDefault();
                    open(i);
                  }
                }}
                onKeyDown={onKey(i)}
                onMouseEnter={() => {
                  if (window.matchMedia('(hover:hover)').matches) open(i);
                }}
              >
                <div className="v2-hp-media">
                  <Image
                    src={p.img}
                    alt={m.alt}
                    fill
                    // Account for the image height under object-fit: cover, not just the narrow panel width.
                    sizes="(max-width:640px) 360px, (max-width:1023px) 480px, 640px"
                    quality={90}
                    style={{ objectFit: 'cover', objectPosition: p.focal }}
                    priority={i === 0}
                  />
                </div>
                <span className="v2-hp-bar" aria-hidden="true">
                  <i key={on ? `c${cycle}` : 'off'} />
                </span>
                <span className="v2-hp-vt">{m.vt}</span>
                <div className="v2-hp-cap">
                  <div>
                    <small>
                      <V2Icon name={p.icon} />
                      <span>{m.dept}</span>
                    </small>
                    <b>{m.name}</b>
                    <span>{m.role}</span>
                  </div>
                  <Link href={p.href} aria-label={m.aria} tabIndex={on ? 0 : -1} onClick={(e) => e.stopPropagation()}>
                    <V2Icon name="i-arrow" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <div className="v2-hx-copy">
          <div className="v2-eyebrow v2-mono v2-hfade">{t('eyebrow')}</div>
          <h1 className="v2-hxw">
            {(['l1', 'l2', 'l3'] as const).map((k, li) => (
              <span className="v2-ln" key={k}>
                {t(`h1.${k}`)
                  .split(' ')
                  .map((w, wi) => (
                    <Fragment key={wi}>
                      <span className={li === 2 ? 'v2-w v2-acc' : 'v2-w'}>{w}</span>{' '}
                    </Fragment>
                  ))}
              </span>
            ))}
          </h1>
          <p className="v2-lede v2-hfade">{t('lede')}</p>
          <div className="v2-ctas v2-hfade">
            <Link className="v2-btn v2-btn-ink" href="#visit">
              <span>{t('book')}</span>
              <V2Icon name="i-arrow" />
            </Link>
            <a className="v2-btn v2-btn-line" href={SITE.whatsapp} target="_blank" rel="noopener">
              <V2Icon name="i-chat" />
              {t('wa')}
            </a>
          </div>
          <div className="v2-facts v2-hfade" ref={factsRef}>
            <div>
              <b ref={yrRef}>{YEARS}</b>
              <span>{t('factYears')}</span>
            </div>
            <div>
              <b>PM-JAY</b>
              <span>{t('factPmjay')}</span>
            </div>
            <div>
              <b>2025</b>
              <span>{t('factAward')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
