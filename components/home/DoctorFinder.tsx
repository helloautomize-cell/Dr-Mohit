'use client';

// "Find the right doctor" body-map finder, ported from the preview: hotspots on
// a body figure (mouse hover, touch, Enter/Space), a chip picker on mobile, the
// result card with swap animation, and the dashed leader line on desktop.
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n/routing';
import {
  DOCS,
  FD,
  FINDER_ORDER,
  HOTSPOTS,
  areaLabels,
  type AreaKey,
} from '@/lib/finder-data';
import { bookingHref } from '@/lib/booking-context';

export function DoctorFinder({ locale }: { locale: Locale }) {
  const [k, setK] = useState<AreaKey>('knee');
  const [out, setOut] = useState(false);
  const finderRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const leaderRef = useRef<SVGSVGElement>(null);
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);

  const RM = useCallback(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const leader = useCallback(() => {
    const f = finderRef.current;
    const lp = leaderRef.current;
    const card = cardRef.current;
    if (!f || !lp || !card || window.innerWidth <= 900) return;
    const h = f.querySelector<HTMLElement>('.hs.on .dot');
    if (!h) return;
    const fr = f.getBoundingClientRect();
    const hr = h.getBoundingClientRect();
    const cr = card.getBoundingClientRect();
    const x1 = hr.left + hr.width / 2 - fr.left + 12;
    const y1 = hr.top + hr.height / 2 - fr.top;
    const x2 = cr.left - fr.left;
    const y2 = Math.min(Math.max(y1, cr.top - fr.top + 40), cr.bottom - fr.top - 40);
    lp.setAttribute('viewBox', `0 0 ${fr.width} ${fr.height}`);
    lp.setAttribute('width', String(fr.width));
    lp.setAttribute('height', String(fr.height));
    const mx = (x1 + x2) / 2;
    lp.querySelector('path')?.setAttribute('d', `M${x1} ${y1} C${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`);
    const c = lp.querySelector('circle');
    if (c) {
      c.setAttribute('cx', String(x2));
      c.setAttribute('cy', String(y2));
    }
  }, []);

  const draw = useCallback(
    (next: AreaKey, anim: boolean) => {
      if (pending.current) clearTimeout(pending.current);
      if (anim && !RM()) {
        setOut(true);
        pending.current = setTimeout(() => {
          setK(next);
          setOut(false);
          requestAnimationFrame(leader);
        }, 260);
      } else {
        setK(next);
        requestAnimationFrame(leader);
      }
    },
    [RM, leader],
  );

  useEffect(() => {
    const t = setTimeout(leader, 400);
    const onResize = () => leader();
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', onResize);
      if (pending.current) clearTimeout(pending.current);
    };
  }, [leader]);

  const area = FD[k];
  const labels = areaLabels(k, locale);
  const doc = DOCS[area.doc];
  const fine =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  return (
    <>
      <div className="fpick" role="group" aria-label={locale === 'pa' ? 'ਸਰੀਰ ਦਾ ਹਿੱਸਾ' : 'Body area'}>
        {FINDER_ORDER.map((x) => (
          <button
            type="button"
            key={x}
            aria-pressed={x === k}
            onClick={() => draw(x, true)}
          >
            {areaLabels(x, locale)[0]}
          </button>
        ))}
      </div>
      <div className="finder" ref={finderRef}>
        <div className="fig rv">
          <svg viewBox="0 0 240 470" role="img" aria-label={locale === 'pa' ? 'ਸਰੀਰ ਨਕਸ਼ਾ' : 'Body map'}>
            <circle className="bd" cx="120" cy="54" r="32" />
            <rect className="bd" x="84" y="98" width="72" height="134" rx="30" />
            <polyline className="lm" points="84,116 62,192 54,264" strokeWidth="22" />
            <polyline className="lm" points="156,116 178,192 186,264" strokeWidth="22" />
            <polyline className="lm" points="104,214 98,330 96,440" strokeWidth="27" />
            <polyline className="lm" points="136,214 142,330 144,440" strokeWidth="27" />
            {HOTSPOTS.map((h) => (
              <g
                key={h.k}
                className={`hs${h.cls ? ` ${h.cls}` : ''}${h.k === k ? ' on' : ''}`}
                data-k={h.k}
                tabIndex={0}
                role="button"
                aria-label={areaLabels(h.k, locale)[0]}
                onClick={() => draw(h.k, true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    draw(h.k, true);
                  }
                }}
                onPointerOver={fine ? () => h.k !== k && draw(h.k, true) : undefined}
              >
                <circle className="ring" cx={h.cx} cy={h.cy} r={h.ring} />
                <circle className="dot" cx={h.cx} cy={h.cy} r={h.dot} />
              </g>
            ))}
          </svg>
        </div>
        <div
          className={`fcard rv${out ? ' out' : ''}`}
          ref={cardRef}
          aria-live="polite"
          style={{ ['--fc' as string]: area.c }}
        >
          <div className="swap">
            <div className="top">
              <div className="av">
                <Image src={doc.img} alt={doc.n[locale]} width={84} height={84} />
              </div>
              <div>
                <small>{locale === 'pa' ? 'ਤੁਸੀਂ ਮਿਲੋਗੇ' : 'You would see'}</small>
                <h3>{doc.n[locale]}</h3>
                <div className="dept">{doc.d[locale]}</div>
              </div>
            </div>
            <div className="area">{labels[0]}</div>
            <ul>
              {labels.slice(1).map((li) => (
                <li key={li}>{li}</li>
              ))}
            </ul>
            <div className="acts">
              <Link className="btn btn-brand" href={bookingHref({ doctor: area.doc, dept: area.dept, reason: labels[0] })}>
                <span>
                  {locale === 'pa' ? `${doc.f.pa} ਨਾਲ ਬੁੱਕ ਕਰੋ` : `Book with ${doc.f.en}`}
                </span>
                <span className="ar">→</span>
              </Link>
              <Link className="lnk" href={area.more}>
                <span>{locale === 'pa' ? 'ਇਸ ਵਿਭਾਗ ਬਾਰੇ' : 'About this department'}</span>
                <span className="ar">→</span>
              </Link>
            </div>
          </div>
        </div>
        <svg id="leader" ref={leaderRef} aria-hidden="true">
          <path d="" />
          <circle r="4" cx="-10" cy="-10" />
        </svg>
      </div>
    </>
  );
}
