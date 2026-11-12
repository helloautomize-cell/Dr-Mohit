'use client';
// "Check yourself" symptom picker (orthopaedics) — six toggle chips, a meter
// filling n/6, the three-state guidance text and a check-up CTA that appears
// once anything is selected. Ported from drawSym(); result text is aria-live.
import { useState } from 'react';
import { copy } from '@/lib/copy';
import { SYM_TEXTS } from '@/lib/tools-data';
import { bookingHref } from '@/lib/booking-context';
import type { Locale } from '@/i18n/routing';
import Link from 'next/link';

const ICONS = [
  <svg key="a" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 20h5v-4h4v-4h4V8h5" />
  </svg>,
  <svg key="b" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="13" r="4" />
    <path d="M12 3v3M4.9 6.9l2 2M19.1 6.9l-2 2M3 13h2M19 13h2M3 20h18" />
  </svg>,
  <svg key="d" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
  </svg>,
  <svg key="e" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 3v7l-3 3 3 8M15 3v7l3 3-3 8" />
    <path d="M4 12l3-1M20 12l-3-1" />
  </svg>,
  <svg key="f" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
  </svg>,
  <svg key="g" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
  </svg>,
];

export function SymptomCheck({ locale }: { locale: Locale }) {
  const c = (en: string) => copy('orthopaedics', en, locale);
  const symptoms = [
    c('Pain on the stairs'),
    c('Stiff in the morning'),
    c('Swelling'),
    c('The knee gives way'),
    c('Pain at night'),
    c('Pain after a fall or injury'),
  ];
  const [on, setOn] = useState<boolean[]>(Array(6).fill(false));
  const n = on.filter(Boolean).length;
  const text = SYM_TEXTS[locale][n === 0 ? 0 : n < 3 ? 1 : 2];
  const toggle = (i: number) =>
    setOn((s) => s.map((v, j) => (j === i ? !v : v)));
  return (
    <>
      <div className="sym" id="sym">
        {symptoms.map((s, i) => (
          <button
            key={s}
            type="button"
            aria-pressed={on[i]}
            onClick={() => toggle(i)}
          >
            {ICONS[i]}
            <span>{s}</span>
          </button>
        ))}
      </div>
      <div className="symres" id="symres">
        <div className="meter">
          <i
            id="symbar"
            style={{
              width: `${(n / 6) * 100}%`,
              background: n >= 3 ? 'var(--brand)' : 'var(--leaf)',
            }}
          />
        </div>
        <p id="symtxt" aria-live="polite">
          {text}
        </p>
        <Link
          className="btn btn-brand"
          href={bookingHref({ dept: 'Orthopaedics' })}
          id="symbtn"
          hidden={n === 0}
        >
          <span>{c('Book a check-up')}</span>
          <span className="ar">→</span>
        </Link>
      </div>
    </>
  );
}
