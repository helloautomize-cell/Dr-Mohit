'use client';
// "Breathe slowly with the circle" (mental health) — the .bc rings animate via
// CSS; this component swaps the centre label every 5s (preview behaviour) and
// adds the spec's pause control, which freezes the rings and the label timer.
// Under prefers-reduced-motion nothing runs (CSS already stops the rings).
import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/routing';

const LABELS = {
  en: { in: 'Breathe in', out: 'Breathe out', pause: 'Pause', resume: 'Resume' },
  pa: { in: 'ਸਾਹ ਲਓ', out: 'ਸਾਹ ਛੱਡੋ', pause: 'ਰੋਕੋ', resume: 'ਜਾਰੀ ਰੱਖੋ' },
};

export function BreatheCircle({ locale }: { locale: Locale }) {
  const l = LABELS[locale];
  const [paused, setPaused] = useState(false);
  const [out, setOut] = useState(false);
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setOut((v) => !v), 5000);
    return () => clearInterval(id);
  }, [paused]);
  return (
    <div className="bc-wrap">
      <div className={`bc${paused ? ' paused' : ''}`}>
        <span id="bc-t" aria-live="polite">
          {out ? l.out : l.in}
        </span>
      </div>
      <button
        type="button"
        className="bc-pause"
        aria-pressed={paused}
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? l.resume : l.pause}
      </button>
    </div>
  );
}
