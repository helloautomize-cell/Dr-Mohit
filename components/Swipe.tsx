'use client';

// Mobile swipe carousel (phase-08 / master 4.8): wraps a card/list container;
// below 768px it becomes a snap carousel (84% cards, peeking next), auto-
// advancing every 4.5s with loop. Pauses on touch, hover, focus and hidden
// tabs; resumes 6s after interaction; pause/play button; progress bar when
// >5 items; all motion off under prefers-reduced-motion. Desktop layout and
// initial HTML are untouched — the carousel is CSS + behaviour only.
import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { useTranslations } from 'next-intl';

type Props = {
  children: ReactNode;
  /** classes applied to the scroll track (the original grid container) */
  className?: string;
  /** slide count — drives the progress bar (shown only above 5) */
  count: number;
  /** accessible name for the carousel region */
  label: string;
  /** mark the track as a scroll-trail target (fill + lit dots effect) */
  dataTrail?: boolean;
  /** extra ref merged onto the track (e.g. PressBoard's drag wiring) */
  trackRef?: Ref<HTMLElement>;
  /** extra attributes spread onto the track element */
  trackProps?: Record<string, unknown>;
  /** track element — 'ul'/'ol' when slides are <li> */
  as?: 'div' | 'ul' | 'ol';
};

export function Swipe({ children, className = '', count, label, dataTrail, trackRef, trackProps, as: Track = 'div' }: Props) {
  const t = useTranslations('ui');
  const selfRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const manualRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [motionOk, setMotionOk] = useState(false);

  useEffect(() => {
    const el = selfRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 767px)');
    setMotionOk(!reduce.matches);
    const onReduce = () => setMotionOk(!reduce.matches);
    reduce.addEventListener('change', onReduce);

    const enabled = () =>
      mobile.matches && !reduce.matches && el.scrollWidth - el.clientWidth > 8;
    const stepPx = () => {
      const first = el.firstElementChild as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 14;
      return (first?.getBoundingClientRect().width ?? el.clientWidth * 0.84) + gap;
    };

    let timer: ReturnType<typeof setInterval> | null = null;
    let resumeT: ReturnType<typeof setTimeout> | null = null;
    let hold = false;
    let inView = true;

    const tick = () => {
      if (manualRef.current || hold || document.hidden || !inView || !enabled()) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 8) el.scrollTo({ left: 0, behavior: 'smooth' });
      else el.scrollBy({ left: stepPx(), behavior: 'smooth' });
    };
    const stop = () => { if (timer) clearInterval(timer); timer = null; };
    const start = () => { stop(); if (enabled()) timer = setInterval(tick, 4500); };
    const pauseHold = () => { hold = true; if (resumeT) clearTimeout(resumeT); resumeT = null; };
    const resumeSoon = () => {
      if (resumeT) clearTimeout(resumeT);
      resumeT = setTimeout(() => { hold = false; }, 6000);
    };
    const io = new IntersectionObserver(([e]) => { inView = !!e?.isIntersecting; }, { threshold: 0.25 });
    io.observe(el);
    const onVis = () => { if (document.hidden) stop(); else start(); };
    document.addEventListener('visibilitychange', onVis);

    const onScroll = () => {
      if (barRef.current) {
        const idx = Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / stepPx())));
        barRef.current.style.transform = `scaleX(${(idx + 1) / count})`;
      }
      // a user swipe counts as interaction: pause, resume later
      if (Math.abs(el.scrollLeft - lastLeft) > 2 && pointerDown) resumeSoon();
      lastLeft = el.scrollLeft;
    };
    let lastLeft = el.scrollLeft;
    let pointerDown = false;
    const down = () => { pointerDown = true; pauseHold(); };
    const up = () => { pointerDown = false; resumeSoon(); };

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      pauseHold();
      el.scrollBy({ left: e.key === 'ArrowRight' ? stepPx() : -stepPx(), behavior: reduce.matches ? 'auto' : 'smooth' });
      resumeSoon();
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('mouseenter', pauseHold);
    el.addEventListener('mouseleave', resumeSoon);
    el.addEventListener('focusin', pauseHold);
    el.addEventListener('focusout', resumeSoon);
    el.addEventListener('keydown', onKey);
    onScroll();
    start();
    return () => {
      stop();
      if (resumeT) clearTimeout(resumeT);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      reduce.removeEventListener('change', onReduce);
    };
  }, [count]);

  const toggle = () => {
    setPaused((p) => {
      manualRef.current = !p;
      return !p;
    });
  };

  return (
    <div className="mswipe" role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="mswipe-ctl">
        {count > 5 ? (
          <span className="mswipe-bar" aria-hidden="true"><i ref={barRef} /></span>
        ) : (
          <span aria-hidden="true" style={{ flex: 1 }} />
        )}
        {motionOk ? (
          <button
            type="button"
            className="mswipe-pp"
            aria-pressed={paused}
            aria-label={paused ? t('play') : t('pause')}
            onClick={toggle}
          >
            {paused ? (
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 3l9 5-9 5z" fill="currentColor" /></svg>
            ) : (
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 3h3v10H4zM9 3h3v10H9z" fill="currentColor" /></svg>
            )}
            <span>{paused ? t('play') : t('pause')}</span>
          </button>
        ) : null}
      </div>
      <Track
        className={`mswipe-track ${className}`}
        ref={(el: HTMLElement | null) => {
          selfRef.current = el;
          if (typeof trackRef === 'function') trackRef(el);
          else if (trackRef) trackRef.current = el;
        }}
        {...(dataTrail ? { 'data-trail': true } : {})}
        {...trackProps}
        tabIndex={0}
      >
        {children}
      </Track>
    </div>
  );
}
