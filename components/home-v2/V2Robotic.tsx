'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { gsap, useGSAP, ANIM_OK } from './v2gsap';
import { V2Icon } from './icons';
import { slot } from '@/lib/image-slots';
import type { Locale } from '@/i18n/routing';

// 4. Robotic knee — pinned horizontal scroll on >=1024px, vertical stack below.
export function V2Robotic({ locale }: { locale: Locale }) {
  const t = useTranslations('homeV2.robotic');
  const scope = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLElement>(null);
  const velys = slot('robotic.velys');

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(min-width:1024px) and ${ANIM_OK}`, () => {
        const track = trackRef.current!;
        const dist = () => track.scrollWidth - window.innerWidth;
        const tw = gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: scope.current,
            start: 'top top',
            end: () => '+=' + dist(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (s) => gsap.set(progRef.current, { scaleX: s.progress }),
          },
        });
        const stOf = (p: Element) => p.closest('.v2-rb-p') as Element;
        gsap.utils.toArray<SVGGeometryElement>('.v2-ill .draw', scope.current).forEach((p) => {
          const L = p.getTotalLength ? p.getTotalLength() : 400;
          gsap.fromTo(
            p,
            { strokeDasharray: L, strokeDashoffset: L },
            {
              strokeDashoffset: 0,
              ease: 'none',
              scrollTrigger: { trigger: stOf(p), containerAnimation: tw, start: 'left 85%', end: 'left 35%', scrub: true },
            },
          );
        });
        gsap.utils.toArray<SVGCircleElement>('.v2-ill .pt', scope.current).forEach((p) =>
          gsap.from(p, {
            scale: 0,
            transformOrigin: '50% 50%',
            ease: 'back.out(3)',
            scrollTrigger: { trigger: stOf(p), containerAnimation: tw, start: 'left 55%', end: 'left 35%', scrub: true },
          }),
        );
        const g1 = scope.current!.querySelector('.v2-ill .g1')!;
        const g2 = scope.current!.querySelector('.v2-ill .g2')!;
        gsap.fromTo(
          g1,
          { scaleY: 0.55 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: stOf(g1), containerAnimation: tw, start: 'left 70%', end: 'left 25%', scrub: true },
          },
        );
        gsap.fromTo(
          g2,
          { scaleY: 1.3 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: stOf(g2), containerAnimation: tw, start: 'left 70%', end: 'left 25%', scrub: true },
          },
        );
      });
      mm.add(`(max-width:1023px) and ${ANIM_OK}`, () => {
        gsap.utils.toArray<SVGGeometryElement>('.v2-ill .draw', scope.current).forEach((p) => {
          const L = p.getTotalLength ? p.getTotalLength() : 400;
          gsap.fromTo(
            p,
            { strokeDasharray: L, strokeDashoffset: L },
            {
              strokeDashoffset: 0,
              duration: 1.6,
              ease: 'power2.out',
              scrollTrigger: { trigger: p, start: 'top 85%' },
            },
          );
        });
        gsap.utils.toArray<HTMLElement>('.v2-rb-p', scope.current).forEach((p) =>
          gsap.from(p, {
            y: 50,
            opacity: 0,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: { trigger: p, start: 'top 90%' },
          }),
        );
      });
    },
    { scope },
  );

  return (
    <section className="v2 v2-rb" id="v2-robotic" ref={scope}>
      <div className="v2-rb-inner">
        <div className="v2-rb-track" ref={trackRef}>
          <div className="v2-rb-p v2-rb-intro">
            <div className="v2-eyebrow v2-mono">{t('eyebrow')}</div>
            <h2 className="v2-h2">
              {t.rich('h2', { acc: (c) => <span className="v2-acc">{c}</span> })}
            </h2>
            <p className="v2-lede">{t('lede')}</p>
          </div>
          <div className="v2-rb-p v2-rb-img">
            <Image
              src={velys.src!}
              alt={velys.alt[locale]}
              fill
              sizes="(max-width:1023px) 92vw, 46vw"
              style={{ objectFit: 'cover' }}
            />
            <span className="v2-cap">{t('cap')}</span>
          </div>
          <div className="v2-rb-p">
            <svg className="v2-ill" viewBox="0 0 320 220" aria-hidden="true">
              <path className="soft" d="M120 10 C 120 70 108 84 110 100 C 112 118 208 118 210 100 C 212 84 200 70 200 10" />
              <path className="soft" d="M112 128 C 116 150 126 170 128 214 M208 128 C 204 150 194 170 192 214" />
              <path className="draw" d="M120 10 C 120 70 108 84 110 100 C 112 118 208 118 210 100 C 212 84 200 70 200 10" />
              <path className="draw" d="M112 128 C 116 150 126 170 128 214 M208 128 C 204 150 194 170 192 214" />
              <circle className="pt" cx="114" cy="78" r="4.5" />
              <circle className="pt" cx="160" cy="112" r="4.5" />
              <circle className="pt" cx="206" cy="78" r="4.5" />
              <circle className="pt" cx="118" cy="146" r="4.5" />
              <circle className="pt" cx="202" cy="146" r="4.5" />
              <text x="232" y="82">3D MAP</text>
            </svg>
            <span className="v2-tag">
              <V2Icon name="i-xray" />
              <span>{t('c1tag')}</span>
            </span>
            <h3>{t('c1h3')}</h3>
            <p>{t('c1p')}</p>
          </div>
          <div className="v2-rb-p">
            <svg className="v2-ill" viewBox="0 0 320 220" aria-hidden="true">
              <path className="soft" d="M70 40 H 250 M70 180 H 250" />
              <rect className="draw gapbar g1" x="104" y="80" width="34" height="66" rx="6" />
              <rect className="draw gapbar g2" x="182" y="80" width="34" height="66" rx="6" />
              <path className="draw" d="M100 160 H 142 M178 160 H 220" />
              <text x="96" y="200">MEDIAL</text>
              <text x="176" y="200">LATERAL</text>
            </svg>
            <span className="v2-tag">
              <V2Icon name="i-physio" />
              <span>{t('c2tag')}</span>
            </span>
            <h3>{t('c2h3')}</h3>
            <p>{t('c2p')}</p>
          </div>
          <div className="v2-rb-p">
            <svg className="v2-ill" viewBox="0 0 320 220" aria-hidden="true">
              <rect className="soft" x="90" y="70" width="140" height="110" rx="10" />
              <path className="draw" d="M70 132 L 250 112" />
              <path className="draw" d="M200 117 A 40 40 0 0 0 196 96" />
              <circle className="pt" cx="70" cy="132" r="5" />
              <text x="214" y="92">0.0°</text>
            </svg>
            <span className="v2-tag">
              <V2Icon name="i-robot" />
              <span>{t('c3tag')}</span>
            </span>
            <h3>{t('c3h3')}</h3>
            <p>{t('c3p')}</p>
          </div>
          <div className="v2-rb-p v2-rb-end">
            <V2Icon name="i-robot" style={{ width: 44, height: 44 }} />
            <div>
              <h3>{t('endH3')}</h3>
              <p style={{ margin: '14px 0 26px' }}>{t('endP')}</p>
              <Link className="v2-btn v2-btn-ink" href="/contact/">
                <span>{t('endBtn')}</span>
                <V2Icon name="i-arrow" />
              </Link>
            </div>
          </div>
        </div>
        <div className="v2-rb-prog" aria-hidden="true">
          <i ref={progRef} />
        </div>
      </div>
    </section>
  );
}
