'use client';

import { useRef, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { gsap, useGSAP, ANIM_OK } from './v2gsap';
import { V2Icon, type V2IconName } from './icons';
import { slot, type SlotId } from '@/lib/image-slots';
import type { Locale } from '@/i18n/routing';

// 2. Three departments — sticky stacking cards on desktop, fade-up below 860px.
const CARDS: {
  ns: 'ortho' | 'eye' | 'mind';
  cls: string;
  icon: V2IconName;
  href: string;
  links: string[];
  img: SlotId;
  focal: string;
}[] = [
  {
    ns: 'ortho',
    cls: 'v2-o',
    icon: 'i-bone',
    href: '/orthopaedics/',
    links: [
      '/orthopaedics/robotic-knee-replacement/',
      '/orthopaedics/knee-and-hip-replacement/',
      '/orthopaedics/fractures-and-trauma/',
      '/orthopaedics/arthroscopy-and-sports-injuries/',
      '/orthopaedics/back-pain-clinic/',
    ],
    img: 'ortho.kh.hero',
    focal: '62% 35%',
  },
  {
    ns: 'eye',
    cls: 'v2-e',
    icon: 'i-eye',
    href: '/eye-care/',
    links: ['/eye-care/', '/eye-care/', '/eye-care/', '/eye-care/'],
    img: 'eye.hero',
    focal: '48% 35%',
  },
  {
    ns: 'mind',
    cls: 'v2-m',
    icon: 'i-mind',
    href: '/mental-health/',
    links: ['/mental-health/', '/mental-health/', '/mental-health/', '/mental-health/'],
    img: 'mind.hero',
    focal: '48% 35%',
  },
];

export function V2Departments({ locale }: { locale: Locale }) {
  const t = useTranslations('homeV2.depts');
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Sticky stack: the card underneath scales down + dims as the next arrives.
      mm.add(`(min-width:861px) and ${ANIM_OK}`, () => {
        const cards = gsap.utils.toArray<HTMLElement>('.v2-dcard', scope.current);
        cards.forEach((c, i) => {
          const img = c.querySelector('.v2-dc-media .v2-par');
          gsap.fromTo(
            img,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: 'none',
              scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
          if (i < cards.length - 1) {
            gsap.to(c, {
              scale: 0.9 - (cards.length - 2 - i) * 0.02,
              filter: 'brightness(.8)',
              ease: 'none',
              scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 30%', scrub: true },
            });
          }
        });
      });
      mm.add(`(max-width:860px) and ${ANIM_OK}`, () => {
        gsap.utils.toArray<HTMLElement>('.v2-dcard', scope.current).forEach((c) =>
          gsap.from(c, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: c, start: 'top 88%' },
          }),
        );
      });
    },
    { scope },
  );

  return (
    <section className="v2 v2-depts" id="departments" ref={scope}>
      <div className="wrap">
        <div className="v2-depts-head">
          <h2 className="v2-h2">
            {t.rich('h2', { acc: (c) => <span className="v2-acc">{c}</span> })}
          </h2>
          <p className="v2-lede">{t('lede')}</p>
        </div>
        <div className="v2-dstack">
          {CARDS.map((card, i) => {
            const s = slot(card.img);
            const items = t.raw(`${card.ns}.items`) as string[];
            return (
              <article className={`v2-dcard ${card.cls}`} style={{ '--i': i } as CSSProperties} key={card.ns}>
                <V2Icon name={card.icon} className="v2-ic v2-wm" />
                <div className="v2-dc-left">
                  <div className="v2-dc-top">
                    <span className="v2-dc-ic">
                      <V2Icon name={card.icon} />
                    </span>
                    <span className="v2-mono" style={{ color: 'rgba(255,255,255,.7)' }}>
                      {t(`${card.ns}.label`)}
                    </span>
                  </div>
                  <h3>{t(`${card.ns}.h3`)}</h3>
                  <div className="v2-dc-doc">{t(`${card.ns}.doc`)}</div>
                  <ul className="v2-dc-list">
                    {items.map((item, k) => (
                      <li key={k}>
                        <Link href={card.links[k]!}>
                          <span>{item}</span>
                          <V2Icon name="i-ne" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="v2-dc-cta">
                    <Link className="v2-btn v2-btn-sun" href={card.href}>
                      <span>{t('see')}</span>
                      <V2Icon name="i-arrow" />
                    </Link>
                  </div>
                </div>
                <div className="v2-dc-media">
                  <div className="v2-par">
                    <Image
                      src={s.src!}
                      alt={s.alt[locale]}
                      fill
                      sizes="(max-width:860px) 92vw, 55vw"
                      style={{ objectFit: 'cover', objectPosition: card.focal }}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
