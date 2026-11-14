'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { gsap, useGSAP, ANIM_OK } from './v2gsap';
import { V2Icon, type V2IconName } from './icons';

// Horizontal on roomy, motion-enabled screens; otherwise keep every card in normal flow.
const CARDS: { icon: V2IconName; img: string; focal: string; chips: string[] }[] = [
  {
    icon: 'i-robot',
    img: '/images/photos/dm-4-mohit-velys.jpg',
    focal: '50% 30%',
    chips: [
      '/orthopaedics/knee-and-hip-replacement/',
      '/orthopaedics/knee-and-hip-replacement/',
      '/orthopaedics/robotic-knee-replacement/',
      '/orthopaedics/knee-and-hip-replacement/',
    ],
  },
  { icon: 'i-bone', img: '/images/photos/FR-1.jpg', focal: '50% 40%', chips: ['/orthopaedics/fractures-and-trauma/', '/orthopaedics/fractures-and-trauma/', '/orthopaedics/fractures-and-trauma/', '/orthopaedics/fractures-and-trauma/'] },
  { icon: 'i-physio', img: '/images/photos/SP-1.jpg', focal: '55% 40%', chips: ['/orthopaedics/arthroscopy-and-sports-injuries/', '/orthopaedics/arthroscopy-and-sports-injuries/', '/orthopaedics/arthroscopy-and-sports-injuries/', '/orthopaedics/arthroscopy-and-sports-injuries/'] },
  { icon: 'i-heart', img: '/images/photos/BP-1.jpg', focal: '45% 35%', chips: ['/orthopaedics/back-pain-clinic/', '/orthopaedics/back-pain-clinic/', '/orthopaedics/back-pain-clinic/', '/orthopaedics/back-pain-clinic/'] },
  { icon: 'i-eye', img: '/images/photos/eye-cataract-day-surgery.jpg', focal: '40% 45%', chips: ['/eye-care/', '/eye-care/', '/eye-care/', '/eye-care/'] },
  { icon: 'i-mind', img: '/images/photos/mind-hero-counselling.jpg', focal: '60% 40%', chips: ['/mental-health/', '/mental-health/', '/mental-health/', '/mental-health/', '/mental-health/'] },
];

type CardCopy = { h3a: string; h3b: string; p: string; alt: string; chips: string[] };

export function V2Treatments() {
  const t = useTranslations('home.treatments');
  const scope = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLElement>(null);
  const cards = t.raw('cards') as CardCopy[];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(min-width:1024px) and (min-height:600px) and ${ANIM_OK}`, () => {
        const section = scope.current!;
        const track = trackRef.current!;
        const pin = section.querySelector<HTMLElement>('.v2-tr-pin')!;
        const cardElements = gsap.utils.toArray<HTMLElement>('.v2-tc', section);
        section.dataset.pinned = 'true';

        // Never pin content that is taller than the available space (for example at large text sizes).
        if (pin.scrollHeight > pin.clientHeight + 1 || cardElements.some((card) => card.scrollHeight > card.clientHeight + 1)) {
          delete section.dataset.pinned;
          return;
        }

        const dist = () => Math.max(0, track.scrollWidth - section.clientWidth);
        const tw = gsap.fromTo(track, { x: 0 }, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: () => `top ${getComputedStyle(section).getPropertyValue('--tr-header').trim()}`,
            end: () => '+=' + dist() * 1.1,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (s) => gsap.set(progRef.current, { scaleX: s.progress }),
          },
        });
        cardElements.forEach((c, i) => {
          if (i > 0)
            gsap.fromTo(
              c,
              { rotate: 3, scale: 0.9, opacity: 0.35 },
              { rotate: 0, scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: tw, start: 'left 100%', end: 'left 45%', scrub: true } },
            );
          gsap.fromTo(
            c.querySelector('.v2-tc-m img')!,
            { xPercent: -6 },
            { xPercent: 6, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } },
          );
          gsap.fromTo(
            c.querySelectorAll('.v2-chips a'),
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: tw, start: 'left 80%', end: 'left 40%', scrub: true } },
          );
        });
        return () => {
          delete section.dataset.pinned;
        };
      });
      mm.add(`(max-width:1023px) and ${ANIM_OK}`, () => {
        gsap.utils.toArray<HTMLElement>('.v2-tc', scope.current).forEach((c) =>
          gsap.from(c, { y: 70, scale: 0.95, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 88%' } }),
        );
      });
    },
    { scope },
  );

  return (
    <section className="v2 v2-tr" id="treatments" ref={scope}>
      <div className="v2-tr-pin">
        <div className="wrap v2-tr-head">
          <div>
            <div className="v2-eyebrow v2-mono">{t('eyebrow')}</div>
            <h2 className="v2-h2">{t.rich('h2', { acc: (c) => <span className="v2-acc">{c}</span> })}</h2>
          </div>
          <p className="v2-lede">{t('lede')}</p>
        </div>
        <div className="v2-tr-track" ref={trackRef}>
          {CARDS.map((card, i) => {
            const m = cards[i]!;
            return (
              <article className="v2-tc" key={i}>
                <div className="v2-tc-l">
                  <span className="v2-tc-ic">
                    <V2Icon name={card.icon} />
                  </span>
                  <h3>
                    {m.h3a}
                    <span className="v2-soft">{m.h3b}</span>
                  </h3>
                  <p>{m.p}</p>
                  <div className="v2-chips">
                    {m.chips.map((chip, ci) => (
                      <Link href={card.chips[ci]!} key={ci}>
                        {chip}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="v2-tc-m">
                  <Image src={card.img} alt={m.alt} fill sizes="(max-width:760px) 92vw, 40vw" style={{ objectFit: 'cover', objectPosition: card.focal }} />
                </div>
              </article>
            );
          })}
        </div>
        <div className="wrap v2-tr-foot">
          <div className="v2-tr-prog" aria-hidden="true">
            <i ref={progRef} />
          </div>
          <span className="v2-tr-hint">
            <V2Icon name="i-arrow" style={{ width: 18, height: 18 }} />
            <span>{t('hint')}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
