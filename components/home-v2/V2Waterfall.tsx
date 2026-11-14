'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { gsap, ScrollTrigger, useGSAP, ANIM_OK } from './v2gsap';
import { V2Icon, type V2IconName } from './icons';
import { slot, type SlotId } from '@/lib/image-slots';
import type { Locale } from '@/i18n/routing';

// 5. "Under one roof" — endless photo columns, middle flows opposite,
// speed follows scroll velocity, pauses off-screen.
const COLS: { img: SlotId; w?: boolean; cap: number }[][] = [
  [
    { img: 'ortho.sp.scope', cap: 0 },
    { img: 'eye.children', w: true, cap: 1 },
    { img: 'ortho.bp.physio', cap: 2 },
    { img: 'mind.first-session', w: true, cap: 3 },
  ],
  [
    { img: 'eye.cataract-day', w: true, cap: 4 },
    { img: 'ortho.sports', cap: 5 },
    { img: 'ortho.fr.xray', w: true, cap: 6 },
    { img: 'ortho.recovery', cap: 7 },
  ],
  [
    { img: 'eye.exam', cap: 8 },
    { img: 'ortho.fr.hero', w: true, cap: 9 },
    { img: 'mind.family', cap: 10 },
    { img: 'ortho.exam', w: true, cap: 11 },
  ],
];

const FAC_ICONS: V2IconName[] = [
  'i-theatre',
  'i-monitor',
  'i-drop',
  'i-xray',
  'i-flask',
  'i-pill',
  'i-physio',
  'i-bed',
];

export function V2Waterfall({ locale }: { locale: Locale }) {
  const t = useTranslations('homeV2.waterfall');
  const scope = useRef<HTMLElement>(null);
  const caps = t.raw('caps') as string[];
  const fac = t.raw('fac') as string[];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(ANIM_OK, () => {
        const tracks = gsap.utils.toArray<HTMLElement>('.v2-wf-track', scope.current);
        const cols = tracks.map((tr, i) => {
          const down = i % 2 === 1;
          return gsap.fromTo(
            tr,
            { yPercent: down ? -50 : 0 },
            { yPercent: down ? 0 : -50, duration: 46 + i * 8, ease: 'none', repeat: -1 },
          );
        });
        const boost = { v: 1 };
        ScrollTrigger.create({
          trigger: scope.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (s) => {
            const v = Math.min(Math.abs(s.getVelocity()) / 300, 6);
            gsap.to(boost, {
              v: 1 + v,
              duration: 0.2,
              overwrite: true,
              onUpdate: () => cols.forEach((c) => c.timeScale(boost.v)),
              onComplete: () => {
                gsap.to(boost, {
                  v: 1,
                  duration: 1.4,
                  ease: 'power2.out',
                  onUpdate: () => cols.forEach((c) => c.timeScale(boost.v)),
                });
              },
            });
          },
          onToggle: (s) => cols.forEach((c) => (s.isActive ? c.play() : c.pause())),
        });
        gsap.from('.v2-fac > div', {
          y: 30,
          opacity: 0,
          stagger: 0.06,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.v2-fac', start: 'top 85%' },
        });
      });
    },
    { scope },
  );

  return (
    <section className="v2 v2-wf" ref={scope}>
      <div className="wrap v2-wf-grid">
        <div>
          <div className="v2-eyebrow v2-mono" style={{ marginBottom: 26 }}>
            {t('eyebrow')}
          </div>
          <h2 className="v2-h2">
            {t.rich('h2', { acc: (c) => <span className="v2-acc">{c}</span> })}
          </h2>
          <p className="v2-lede" style={{ marginTop: 24 }}>
            {t('lede')}
          </p>
          <div className="v2-fac">
            {fac.map((f, i) => (
              <div key={i}>
                <span className="v2-fi">
                  <V2Icon name={FAC_ICONS[i]!} />
                </span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="v2-wf-cols" aria-label={t('colsLabel')}>
          {COLS.map((col, ci) => (
            <div className="v2-wf-col" key={ci}>
              <div className="v2-wf-track">
                {[...col, ...col].map((fig, fi) => {
                  const s = slot(fig.img);
                  const dup = fi >= col.length;
                  return (
                    <figure className={fig.w ? 'v2-ww' : undefined} aria-hidden={dup || undefined} key={fi}>
                      <Image
                        src={s.src!}
                        alt={dup ? '' : s.alt[locale]}
                        fill
                        sizes="(max-width:640px) 45vw, (max-width:1023px) 30vw, 21vw"
                        style={{ objectFit: 'cover', objectPosition: s.focal }}
                      />
                      <figcaption>{caps[fig.cap]}</figcaption>
                    </figure>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
