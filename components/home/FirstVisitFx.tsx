'use client';

// Scroll-sync for the first-visit sticky stage: the step nearest to the 55%
// viewport line becomes active on desktop; on mobile each step lights up as it
// passes 80%. Ported 1:1 from the preview's v5 check().
import { useEffect } from 'react';

export function FirstVisitFx() {
  useEffect(() => {
    const root = document.querySelector('.fv');
    if (!root) return;
    const steps = [...root.querySelectorAll<HTMLElement>('.fv-step')];
    const tabs = [...root.querySelectorAll<HTMLElement>('.fv-tabs span')];
    const bar = root.querySelector<HTMLElement>('.fv-tabs i');
    const stage = [...root.querySelectorAll<HTMLElement>('.fv-arts > .art')];
    let cur = -1;

    const set = (i: number) => {
      if (i === cur) return;
      cur = i;
      steps.forEach((s, k) => s.classList.toggle('on', k === i));
      stage.forEach((s, k) => s.classList.toggle('on', k === i));
      tabs.forEach((t, k) => t.classList.toggle('on', k === i));
      if (bar) bar.style.transform = `translateX(${i * 100}%)`;
    };

    const check = () => {
      const mid = window.innerHeight * 0.55;
      let best = 0;
      let bd = 1e9;
      steps.forEach((s, k) => {
        const r = s.getBoundingClientRect();
        const c =
          window.innerWidth <= 900 ? r.top + Math.min(r.height, 400) / 2 : r.top + r.height / 2;
        const d = Math.abs(c - mid);
        if (d < bd) {
          bd = d;
          best = k;
        }
      });
      if (window.innerWidth <= 900) {
        steps.forEach((s) => {
          if (s.getBoundingClientRect().top < window.innerHeight * 0.8) s.classList.add('on');
        });
      } else set(best);
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  return null;
}
