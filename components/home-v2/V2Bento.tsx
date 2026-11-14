'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { gsap, ScrollTrigger, useGSAP, ANIM_OK } from './v2gsap';
import { V2Icon } from './icons';
import { slot } from '@/lib/image-slots';
import { SITE } from '@/lib/site-config';
import type { Locale } from '@/i18n/routing';

// 3. "Four decades, one address" — 6-tile bento; tiles assemble on scroll.
const SCATTER: [number, number, number][] = [
  [-120, 80, -6],
  [140, 60, 5],
  [-80, 140, 4],
  [0, 160, -3],
  [160, 120, 6],
  [-140, 160, -5],
  [60, 180, 3],
];

export function V2Bento({ locale }: { locale: Locale }) {
  const t = useTranslations('homeV2.bento');
  const scope = useRef<HTMLElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const years = new Date().getFullYear() - 1980;
  const founder = slot('about.founder');
  const plan = slot('robotic.plan');

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(min-width:900px) and ${ANIM_OK}`, () => {
        gsap.utils.toArray<HTMLElement>('.v2-bx', scope.current).forEach((b, i) => {
          const [x, y, r] = SCATTER[i % SCATTER.length]!;
          gsap.fromTo(
            b,
            { x, y, rotate: r, scale: 0.86, opacity: 0 },
            {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: scope.current!.querySelector('.v2-bento'),
                start: 'top 95%',
                end: 'top 30%',
                scrub: 1,
              },
            },
          );
        });
      });
      mm.add(`(max-width:899px) and ${ANIM_OK}`, () => {
        gsap.utils.toArray<HTMLElement>('.v2-bx', scope.current).forEach((b) =>
          gsap.from(b, {
            y: 50,
            opacity: 0,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: { trigger: b, start: 'top 92%' },
          }),
        );
      });
      // Years count-up — computed from the founding year, never hardcoded.
      mm.add(ANIM_OK, () => {
        ScrollTrigger.create({
          trigger: numRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            const el = numRef.current!;
            const t0 = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - t0) / 1600);
              el.textContent = String(Math.round(years * (1 - Math.pow(1 - p, 4))));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          },
        });
      });
    },
    { scope },
  );

  return (
    <section className="v2 v2-bento-sec" ref={scope}>
      <div className="wrap">
        <div className="v2-bento-head">
          <h2 className="v2-h2">
            {t.rich('h2', { acc: (c) => <span className="v2-acc">{c}</span> })}
          </h2>
          <p className="v2-lede">{t('lede')}</p>
        </div>
        <div className="v2-bento">
          <div className="v2-bx v2-b1">
            <div className="v2-bl">
              <div className="v2-mono" style={{ color: 'rgba(255,255,255,.55)' }}>
                {t('b1label')}
              </div>
              <div>
                <div className="v2-big v2-num" ref={numRef}>
                  {years}
                </div>
                <h3>{t('b1h3')}</h3>
                <p>{t('b1p')}</p>
              </div>
            </div>
            <figure>
              <Image
                src={founder.src!}
                alt={founder.alt[locale]}
                width={380}
                height={472}
                sizes="(max-width:640px) 0px, 190px"
                style={{ width: 190, height: 236 }}
              />
              <figcaption>{t('b1fig')}</figcaption>
            </figure>
          </div>
          <Link className="v2-bx v2-b2" href="/orthopaedics/robotic-knee-replacement/">
            <Image
              src={plan.src!}
              alt={plan.alt[locale]}
              fill
              sizes="(max-width:1100px) 92vw, 60vw"
              style={{ objectFit: 'cover', objectPosition: '45% 40%' }}
            />
            <span className="v2-pan">
              <span>
                <span className="v2-mono v2-tag">{t('b2tag')}</span>
                <h3 style={{ marginTop: 8 }}>{t('b2h3')}</h3>
                <p>{t('b2p')}</p>
              </span>
              <span className="v2-circ">
                <V2Icon name="i-arrow" />
              </span>
            </span>
          </Link>
          <div className="v2-bx v2-b3">
            <span className="v2-bxi">
              <V2Icon name="i-shield" />
            </span>
            <h3>{t('b3h3')}</h3>
            <p>{t('b3p')}</p>
          </div>
          <div className="v2-bx v2-b4">
            <span className="v2-bxi">
              <V2Icon name="i-award" />
            </span>
            <h3>{t('b4h3')}</h3>
            <p>{t('b4p')}</p>
          </div>
          <div className="v2-bx v2-b5">
            <svg className="v2-map" viewBox="0 0 300 220" aria-hidden="true">
              <path
                className="st"
                d="M20 30 C 90 10 170 20 270 40 L 280 110 C 210 120 150 110 120 130 L 60 190 C 40 150 20 100 20 30Z"
              />
              <text x="200" y="30">PUNJAB</text>
              <text x="214" y="150">HARYANA</text>
              <text x="24" y="210">RAJASTHAN</text>
              <path className="arc" d="M150 120 Q 120 70 90 52" />
              <path className="arc" d="M150 120 Q 200 80 236 70" />
              <path className="arc" d="M150 120 Q 200 140 232 128" />
              <path className="arc" d="M150 120 Q 100 150 66 176" />
              <path className="arc" d="M150 120 Q 160 160 190 186" />
              <path className="arc" d="M150 120 Q 90 110 40 96" />
              <circle className="town" cx="90" cy="52" r="4" />
              <circle className="town" cx="236" cy="70" r="4" />
              <circle className="town" cx="232" cy="128" r="4" />
              <circle className="town" cx="66" cy="176" r="4" />
              <circle className="town" cx="190" cy="186" r="4" />
              <circle className="town" cx="40" cy="96" r="4" />
              <circle className="pulse" cx="150" cy="120" r="10" />
              <circle className="home" cx="150" cy="120" r="7" />
            </svg>
            <h3>{t('b5h3')}</h3>
            <p>{t('b5p')}</p>
          </div>
          <div className="v2-bx v2-b6">
            <div className="v2-dots3">
              <i style={{ background: 'var(--brand)' }}>
                <V2Icon name="i-bone" />
              </i>
              <i style={{ background: 'var(--leaf)' }}>
                <V2Icon name="i-eye" />
              </i>
              <i style={{ background: 'var(--teal)' }}>
                <V2Icon name="i-mind" />
              </i>
            </div>
            <h3 style={{ marginTop: 22 }}>{t('b6h3')}</h3>
            <p>{t('b6p')}</p>
          </div>
          <a className="v2-bx v2-b7" href={SITE.whatsapp} target="_blank" rel="noopener">
            <span className="v2-bxi">
              <V2Icon name="i-chat" />
            </span>
            <span className="v2-circ">
              <V2Icon name="i-ne" />
            </span>
            <h3>{t('b7h3')}</h3>
            <p>{t('b7p')}</p>
          </a>
        </div>
      </div>
    </section>
  );
}
