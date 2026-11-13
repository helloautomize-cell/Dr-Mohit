'use client';

// Home-only motion layer (v15 upgrade), ported from home-upgrade.js into a
// React effect — NOT a global script; mounts only on the Home page.
// - .bt tiles: cursor-following glow via --mx/--my
// - .btn-brand: small magnetic follow (desktop hover pointers only, motion-safe)
// - hero photo: scroll parallax (~7% drift, scale 1.04 -> 1.00)
// - #roboStory: step nearest viewport middle gets .on; --rp drives the photo
//   zoom-out; progress bars fill through the active step
// - .wave animations (names starting with "wv"): playback rate rises with
//   scroll velocity up to 1.6x, then settles
// Reduced motion: no rAF loop; all robotic steps get .on (CSS also forces the
// static state). Panels stay click-usable via DeptPanels' own state.
import { useEffect } from 'react';

export default function HomeFx() {
  useEffect(() => {
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const disposers: (() => void)[] = [];

    // Bento cursor glow
    document.querySelectorAll<HTMLElement>('.bt').forEach((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      };
      el.addEventListener('pointermove', move);
      disposers.push(() => el.removeEventListener('pointermove', move));
    });

    // Magnetic book buttons (desktop pointer only)
    if (!RM && window.matchMedia('(hover:hover)').matches) {
      document.querySelectorAll<HTMLElement>('.btn-brand').forEach((b) => {
        b.classList.add('mag');
        const move = (e: PointerEvent) => {
          const r = b.getBoundingClientRect();
          const x = ((e.clientX - r.left - r.width / 2) / r.width) * 10;
          const y = ((e.clientY - r.top - r.height / 2) / r.height) * 8;
          b.style.transform = `translate(${x}px,${y}px)`;
        };
        const leave = () => {
          b.style.transform = '';
        };
        b.addEventListener('pointermove', move);
        b.addEventListener('pointerleave', leave);
        disposers.push(() => {
          b.removeEventListener('pointermove', move);
          b.removeEventListener('pointerleave', leave);
          b.classList.remove('mag');
          b.style.transform = '';
        });
      });
    }

    const heroImg = document.querySelector<HTMLElement>('#p-home .hero-im img');
    const rs = document.getElementById('roboStory');
    const steps = rs ? [...rs.querySelectorAll<HTMLElement>('.rs-step')] : [];
    const bars = rs ? [...rs.querySelectorAll<HTMLElement>('.rs-prog i')] : [];

    if (RM) {
      steps.forEach((s) => s.classList.add('on'));
      return () => disposers.forEach((d) => d());
    }

    const waves = () =>
      document.getAnimations
        ? document
            .getAnimations()
            .filter((a) => /^wv/.test((a as CSSAnimation).animationName ?? ''))
        : [];

    let lastY = window.scrollY;
    let vel = 0;
    let wa: Animation[] = [];
    let raf = 0;
    let wroteY = -1;
    let wroteW = -1;

    const frame = () => {
      const y = window.scrollY;
      vel = vel * 0.9 + Math.abs(y - lastY) * 0.1;
      lastY = y;
      if (!wa.length) wa = waves() as Animation[];
      const rate = 1 + Math.min(vel / 18, 0.6);
      wa.forEach((a) => {
        if (Math.abs(a.playbackRate - rate) > 0.02) a.playbackRate = rate;
      });
      // Skip DOM writes/layout reads while idle — a per-frame transform write
      // forces style+layout churn even when nothing changed.
      if (y === wroteY && window.innerWidth === wroteW) {
        raf = requestAnimationFrame(frame);
        return;
      }
      wroteY = y;
      wroteW = window.innerWidth;
      if (heroImg && y < window.innerHeight * 1.2) {
        heroImg.style.transform = `translateY(${y * 0.07}px) scale(${1.04 - Math.min(y / window.innerHeight, 1) * 0.04})`;
      }
      if (rs && steps.length && window.innerWidth > 1000) {
        const mid = window.innerHeight * 0.5;
        let act = 0;
        steps.forEach((s, i) => {
          if (s.getBoundingClientRect().top < mid) act = i;
        });
        steps.forEach((s, i) => s.classList.toggle('on', i === act));
        bars.forEach((b, i) => b.classList.toggle('on', i <= act));
        const r = rs.getBoundingClientRect();
        rs.style.setProperty('--rp', Math.max(0, Math.min(1, -r.top / (r.height - window.innerHeight))).toFixed(3));
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      disposers.forEach((d) => d());
    };
  }, []);

  return null;
}
