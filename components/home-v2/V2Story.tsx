'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { gsap, ScrollTrigger, useGSAP, ANIM_OK } from './v2gsap';
import { slot } from '@/lib/image-slots';
import type { Locale } from '@/i18n/routing';

// 8. "Our story" — sticky family photo + timeline whose line fills on scroll.
export function V2Story({ locale }: { locale: Locale }) {
  const t = useTranslations('homeV2.story');
  const scope = useRef<HTMLElement>(null);
  const items = t.raw('items') as { yr: string; h3: string; p: string }[];
  const legacy = slot('about.legacy');

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(ANIM_OK, () => {
        gsap.to('.v2-tl-fill', {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: scope.current!.querySelector('.v2-tl'),
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: true,
          },
        });
        gsap.utils.toArray<HTMLElement>('.v2-ti', scope.current).forEach((ti) =>
          ScrollTrigger.create({
            trigger: ti,
            start: 'top 68%',
            onEnter: () => ti.classList.add('on'),
            onLeaveBack: () => ti.classList.remove('on'),
          }),
        );
      });
      mm.add(`(min-width:1024px) and ${ANIM_OK}`, () => {
        gsap.fromTo(
          scope.current!.querySelector('.v2-story-fig img'),
          { scale: 1.2 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: scope.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
    },
    { scope },
  );

  return (
    <section className="v2 v2-story" id="story" ref={scope}>
      <div className="wrap v2-story-grid">
        <figure className="v2-story-fig">
          <Image
            src={legacy.src!}
            alt={legacy.alt[locale]}
            fill
            sizes="(max-width:1023px) 92vw, 46vw"
            style={{ objectFit: 'cover', objectPosition: '50% 38%' }}
          />
          <figcaption>{t('fig')}</figcaption>
        </figure>
        <div>
          <div className="v2-eyebrow v2-mono" style={{ marginBottom: 26 }}>
            {t('eyebrow')}
          </div>
          <h2 className="v2-h2">
            {t.rich('h2', { acc: (c) => <span className="v2-acc">{c}</span> })}
          </h2>
          <div className="v2-tl">
            <span className="v2-tl-fill" />
            {items.map((it, i) => (
              <div className="v2-ti" key={i}>
                <div className="v2-yr">{it.yr}</div>
                <h3>{it.h3}</h3>
                <p>{it.p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
