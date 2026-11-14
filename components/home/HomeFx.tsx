'use client';

// Home-only motion layer (v15 upgrade), ported from home-upgrade.js into a
// React effect — NOT a global script; mounts only on the Home page.
// - .btn-brand: small magnetic follow (desktop hover pointers only, motion-safe)
// - hero photo: scroll parallax (~7% drift, scale 1.04 -> 1.00)
// - .wave animations (names starting with "wv"): playback rate rises with
//   scroll velocity up to 1.6x, then settles
// Reduced motion: no rAF loop; magnetic buttons stay put.
import { useEffect } from 'react';

export default function HomeFx() {
  useEffect(() => {
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const disposers: (() => void)[] = [];

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

    if (RM) {
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
