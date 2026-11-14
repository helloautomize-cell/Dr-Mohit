'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { gsap, useGSAP, ANIM_OK } from './v2gsap';
import { V2Icon } from './icons';
import { SITE } from '@/lib/site-config';

// Visit us — navy closing section with a weekly hours chart. The hospital is
// open 24 hours every day: each day renders one full leaf-green bar across a
// 12 am to 12 am axis, today's row highlighted with a white "now" line.
// Ranges are kept as data so OPD hours can be added later as a second colour.
const AXIS_START = 0;
const AXIS_END = 24;
const HOURS: [number, number][][] = Array.from({ length: 7 }, () => [[0, 24]]);

export function V2Visit() {
  const t = useTranslations('home.visit');
  const scope = useRef<HTMLElement>(null);
  const days = t.raw('days') as string[];
  const axis = t.raw('axis') as string[];
  // Computed client-side only so server markup stays identical across timezones.
  const [now, setNow] = useState<{ day: number; hour: number } | null>(null);

  useEffect(() => {
    const d = new Date();
    setNow({ day: (d.getDay() + 6) % 7, hour: d.getHours() + d.getMinutes() / 60 });
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(ANIM_OK, () => {
        const rows = gsap.utils.toArray<HTMLElement>('.v2-hr', scope.current);
        const segs = gsap.utils.toArray<HTMLElement>('.v2-hr-s', scope.current);
        gsap
          .timeline({ scrollTrigger: { trigger: '.v2-hours', start: 'top 80%', once: true } })
          .from(rows, { x: -30, opacity: 0, stagger: 0.07, duration: 0.7, ease: 'expo.out' })
          .from(segs, { scaleX: 0, stagger: 0.06, duration: 1, ease: 'expo.out' }, 0.2);
      });
    },
    { scope },
  );

  return (
    <section className="v2 v2-vs" id="visit" ref={scope}>
      <div className="wrap v2-vs-grid">
        <div>
          <div className="v2-eyebrow v2-mono">{t('eyebrow')}</div>
          <h2 className="v2-h2">
            {t('h2a')}
            <br />
            <span className="v2-acc">{t('h2b')}</span>
          </h2>
          <p className="v2-vs-sum">{t('sum')}</p>
          <div className="v2-status open">
            <i aria-hidden="true" />
            <span>{t('status')}</span>
          </div>
          <div className="v2-ctas">
            <a className="v2-btn v2-btn-green" href={SITE.whatsapp} target="_blank" rel="noopener">
              <span>{t('book')}</span>
              <V2Icon name="i-arrow" />
            </a>
            <a className="v2-btn v2-btn-ghost" href={SITE.mapsUrl} target="_blank" rel="noopener">
              <V2Icon name="i-pin" />
              <span>{t('dir')}</span>
            </a>
          </div>
          <div className="v2-addr">
            <div>
              <small>{t('addrL')}</small>
              <a href={SITE.mapsUrl} target="_blank" rel="noopener">
                {SITE.address}
              </a>
            </div>
            <div>
              <small>{t('apptL')}</small>
              <a href={SITE.phoneMainHref}>{SITE.phoneMain}</a>
            </div>
          </div>
        </div>
        <div>
          <ul className="v2-hours">
            {days.map((d, i) => {
              const isToday = now?.day === i;
              return (
                <li className={isToday ? 'v2-hr today' : 'v2-hr'} key={d}>
                  <span className="v2-hr-d">{d}</span>
                  <span className="v2-hr-t">
                    {HOURS[i]!.map((p, pi) => (
                      <span
                        className="v2-hr-s"
                        key={pi}
                        style={{
                          left: `${((p[0] - AXIS_START) / (AXIS_END - AXIS_START)) * 100}%`,
                          width: `${((p[1] - p[0]) / (AXIS_END - AXIS_START)) * 100}%`,
                        }}
                      />
                    ))}
                    {isToday ? <span className="v2-hr-now" style={{ left: `${((now.hour - AXIS_START) / (AXIS_END - AXIS_START)) * 100}%` }} /> : null}
                  </span>
                  <span className="v2-hr-h">{t('hoursLabel')}</span>
                </li>
              );
            })}
          </ul>
          <div className="v2-axis" aria-hidden="true">
            <span />
            <div>
              {axis.map((a, i) => (
                <span key={i}>{a}</span>
              ))}
            </div>
            <span />
          </div>
          <div className="v2-legend">
            <span>
              <i />
              <span>{t('legendEm')}</span>
            </span>
            <span>
              <b className="v2-nowk" />
              <span>{t('legendNow')}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
