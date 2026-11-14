'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { gsap, useGSAP, ANIM_OK } from './v2gsap';
import { V2Icon } from './icons';

// 10. "Families often ask" — accordion with real buttons + aria-expanded.
export function V2Faq() {
  const t = useTranslations('homeV2.faq');
  const scope = useRef<HTMLElement>(null);
  const items = t.raw('items') as { q: string; a: string }[];
  const [open, setOpen] = useState<number>(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(ANIM_OK, () => {
        gsap.from('.v2-qa', {
          y: 30,
          opacity: 0,
          stagger: 0.08,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: scope.current!.querySelector('.v2-qas'), start: 'top 85%' },
        });
      });
    },
    { scope },
  );

  return (
    <section className="v2 v2-faq" ref={scope}>
      <div className="wrap v2-faq-grid">
        <div>
          <div className="v2-eyebrow v2-mono" style={{ marginBottom: 26 }}>
            {t('eyebrow')}
          </div>
          <h2 className="v2-h2">
            {t.rich('h2', { acc: (c) => <span className="v2-acc">{c}</span> })}
          </h2>
        </div>
        <div className="v2-qas">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div className={`v2-qa${isOpen ? ' open' : ''}`} key={i}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{it.q}</span>
                  <span className="v2-pm">
                    <V2Icon name="i-plus" />
                  </span>
                </button>
                <div className="v2-ans">
                  <div>
                    <p>{it.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
