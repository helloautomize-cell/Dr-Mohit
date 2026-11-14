'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { gsap, useGSAP, ANIM_OK } from './v2gsap';
import { slot } from '@/lib/image-slots';
import type { Locale } from '@/i18n/routing';

// 1. "Who we are" — words scrub from 14% to full opacity on scroll.
export function V2Statement({ locale }: { locale: Locale }) {
  const t = useTranslations('homeV2.stmt');
  const scope = useRef<HTMLElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const founder = slot('about.founder');

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(ANIM_OK, () => {
        const words = pRef.current!.querySelectorAll('.v2-sw');
        gsap.fromTo(
          words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: { trigger: pRef.current, start: 'top 82%', end: 'bottom 45%', scrub: true },
          },
        );
      });
    },
    { scope },
  );

  return (
    <section className="v2 v2-stmt" ref={scope}>
      <div className="wrap v2-stmt-row">
        <div className="v2-eyebrow v2-mono">{t('eyebrow')}</div>
        <div>
          <p className="v2-stmt-p" ref={pRef}>
            {t('p')
              .split(' ')
              .map((w, i) => (
                <span className="v2-sw" key={i}>
                  {w}{' '}
                </span>
              ))}
          </p>
          <div className="v2-stmt-sig">
            <Image
              src={founder.src!}
              alt={founder.alt[locale]}
              width={112}
              height={112}
              sizes="56px"
            />
            <span>{t('sig')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
