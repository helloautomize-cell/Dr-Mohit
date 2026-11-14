'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, useGSAP, ANIM_OK } from './v2gsap';

// Page-level effects for the merged home page: one Lenis smooth-scroll
// instance connected to ScrollTrigger, v2 button fill origin, in-page anchor
// scrolling, the shared v2 heading rise, and the post-load refresh. Scoped to
// #p-home since the v2 sections now sit interleaved with the kept originals.
export function V2Fx() {
  useGSAP(() => {
    const root = document.getElementById('p-home');
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add(ANIM_OK, () => {
      const lenis = new Lenis({ lerp: 0.09 });
      const onScroll = () => ScrollTrigger.update();
      lenis.on('scroll', onScroll);
      const raf = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      // In-page anchors (#departments/#doctors/#story) scroll through Lenis.
      const anchors = [...root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
      const onClick = (e: Event) => {
        const a = e.currentTarget as HTMLAnchorElement;
        const href = a.getAttribute('href')!;
        if (href.length < 2) return;
        const target = root.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target as HTMLElement, { offset: -20, duration: 1.4 });
        }
      };
      anchors.forEach((a) => a.addEventListener('click', onClick));

      // Shared heading rise (rb-intro + cta h2 have their own tweens).
      root.querySelectorAll<HTMLElement>('.v2-h2').forEach((h) => {
        if (h.closest('.v2-rb-intro')) return;
        gsap.from(h, {
          y: 60,
          opacity: 0,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: h, start: 'top 88%' },
        });
      });

      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener('load', onLoad);

      return () => {
        window.removeEventListener('load', onLoad);
        anchors.forEach((a) => a.removeEventListener('click', onClick));
        gsap.ticker.remove(raf);
        lenis.off('scroll', onScroll);
        lenis.destroy();
      };
    });
  });

  // Button fill origin — pure hover micro-interaction, motion-safe by nature.
  useEffect(() => {
    const root = document.getElementById('p-home');
    if (!root) return;
    const btns = [...root.querySelectorAll<HTMLElement>('.v2-btn')];
    const set = (e: Event) => {
      const b = e.currentTarget as HTMLElement;
      const r = b.getBoundingClientRect();
      const pe = e as PointerEvent;
      b.style.setProperty('--x', pe.clientX - r.left + 'px');
      b.style.setProperty('--y', pe.clientY - r.top + 'px');
    };
    btns.forEach((b) => b.addEventListener('pointerenter', set));
    return () => btns.forEach((b) => b.removeEventListener('pointerenter', set));
  }, []);

  return null;
}
