'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { gsap, useGSAP, ANIM_OK } from './v2gsap';
import { V2Icon } from './icons';

// Inside the hospital — theatre photo starts full-screen on desktop and
// shrinks into its centre grid slot while the four side tiles slide in.
// Ported from resources/reference/hero-sections.html + .js.
const TILES: { cls: string; img: string; cap: 'building' | 'theatre' | 'reception' | 'corridor' | 'daycare'; focal?: string }[] = [
  { cls: 'v2-l1', img: '/images/photos/building-front.jpg', cap: 'building' },
  { cls: 'v2-c', img: '/images/photos/operation-theatre.jpg', cap: 'theatre', focal: '50% 50%' },
  { cls: 'v2-r1', img: '/images/photos/reception.jpg', cap: 'reception', focal: '50% 30%' },
  { cls: 'v2-l2', img: '/images/photos/opd-corridor.jpg', cap: 'corridor' },
  { cls: 'v2-r2', img: '/images/photos/day-care.jpg', cap: 'daycare' },
];

export function V2Inside() {
  const t = useTranslations('home.inside');
  const scope = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const centreRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(min-width:1024px) and ${ANIM_OK}`, () => {
        const c = centreRef.current!;
        // Scale/offsets that make the centre tile cover the viewport; computed
        // on refresh so resizes and pin spacing stay correct.
        const geo = () => {
          const prev = c.style.transform;
          c.style.transform = 'none';
          const r = c.getBoundingClientRect();
          c.style.transform = prev;
          const stage = stageRef.current!.getBoundingClientRect();
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const s = Math.max(vw / r.width, vh / r.height);
          const cx = r.left + r.width / 2;
          const cy = r.top - stage.top + r.height / 2;
          return { s, dx: vw / 2 - cx, dy: vh / 2 - cy };
        };
        const tl = gsap.timeline({
          scrollTrigger: { trigger: scope.current, start: 'top top', end: '+=130%', pin: stageRef.current, scrub: 1, invalidateOnRefresh: true },
        });
        tl.fromTo(
          c,
          { scale: () => geo().s, x: () => geo().dx, y: () => geo().dy, borderRadius: 0 },
          { scale: 1, x: 0, y: 0, borderRadius: 26, ease: 'power2.inOut', duration: 1 },
        )
          .fromTo('.v2-in-head', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5 }, 0.45)
          .fromTo('.v2-it.v2-l1, .v2-it.v2-l2', { xPercent: -40, opacity: 0 }, { xPercent: 0, opacity: 1, stagger: 0.08, duration: 0.55, ease: 'power2.out' }, 0.4)
          .fromTo('.v2-it.v2-r1, .v2-it.v2-r2', { xPercent: 40, opacity: 0 }, { xPercent: 0, opacity: 1, stagger: 0.08, duration: 0.55, ease: 'power2.out' }, 0.4)
          .fromTo('.v2-in-note', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.8)
          .to({}, { duration: 0.25 });
      });
      mm.add(`(max-width:1023px) and ${ANIM_OK}`, () => {
        gsap.utils.toArray<HTMLElement>('.v2-it', scope.current).forEach((f) =>
          gsap.from(f, { y: 50, scale: 0.94, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: f, start: 'top 90%' } }),
        );
      });
    },
    { scope },
  );

  return (
    <section className="v2 v2-in" id="inside" ref={scope}>
      <div className="wrap v2-in-stage" ref={stageRef}>
        <div className="v2-in-head">
          <div>
            <div className="v2-eyebrow v2-mono">{t('eyebrow')}</div>
            <h2 className="v2-h2">{t.rich('h2', { acc: (c) => <span className="v2-acc">{c}</span> })}</h2>
          </div>
          <p className="v2-lede">{t('lede')}</p>
        </div>
        <div className="v2-in-grid">
          {TILES.map((tile) => (
            <figure className={`v2-it ${tile.cls}`} key={tile.cap} ref={tile.cls === 'v2-c' ? centreRef : undefined}>
              <Image
                src={tile.img}
                alt={t(`alts.${tile.cap}`)}
                fill
                sizes={tile.cls === 'v2-c' ? '(max-width:1023px) 100vw, 52vw' : '(max-width:1023px) 50vw, 32vw'}
                style={tile.focal ? { objectPosition: tile.focal } : undefined}
              />
              <figcaption>{t(`caps.${tile.cap}`)}</figcaption>
            </figure>
          ))}
        </div>
        <p className="v2-in-note">
          <V2Icon name="i-pin" style={{ width: 18, height: 18 }} />
          <span>{t('note')}</span>
        </p>
      </div>
    </section>
  );
}
