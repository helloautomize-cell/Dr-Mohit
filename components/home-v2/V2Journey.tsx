'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap, useGSAP, ANIM_OK } from './v2gsap';
import { V2Icon, type V2IconName } from './icons';

// 6. "From your first call to feeling better" — 4 steps bounce in,
// joined by a flowing dashed line on desktop. No numeric labels.
const ICONS: V2IconName[] = ['i-phone', 'i-listen', 'i-plan', 'i-heart'];
const STREAM_D = 'M40 20 C 200 -4 340 44 500 20 S 800 -4 960 20 S 1140 40 1200 20';

export function V2Journey() {
  const t = useTranslations('homeV2.journey');
  const scope = useRef<HTMLElement>(null);
  const steps = t.raw('steps') as { h3: string; p: string }[];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(ANIM_OK, () => {
        gsap.from('.v2-jstep', {
          y: -90,
          opacity: 0,
          duration: 1.3,
          ease: 'bounce.out',
          stagger: 0.22,
          scrollTrigger: { trigger: scope.current!.querySelector('.v2-jr-steps'), start: 'top 78%' },
        });
        gsap.from('.v2-jr-stream', {
          clipPath: 'inset(0 100% 0 0)',
          duration: 2,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: scope.current!.querySelector('.v2-jr-steps'), start: 'top 78%' },
        });
      });
    },
    { scope },
  );

  return (
    <section className="v2 v2-jr" ref={scope}>
      <div className="wrap">
        <div className="v2-bento-head" style={{ marginBottom: 0 }}>
          <h2 className="v2-h2">
            {t.rich('h2', { acc: (c) => <span className="v2-acc">{c}</span> })}
          </h2>
          <p className="v2-lede">{t('lede')}</p>
        </div>
        <div className="v2-jr-steps">
          <svg className="v2-jr-stream" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
            <path d={STREAM_D} strokeOpacity=".15" />
            <path className="flow" d={STREAM_D} />
          </svg>
          {steps.map((s, i) => (
            <div className="v2-jstep" key={i}>
              <span className="v2-jstep-ic">
                <V2Icon name={ICONS[i]!} />
              </span>
              <h3>{s.h3}</h3>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
