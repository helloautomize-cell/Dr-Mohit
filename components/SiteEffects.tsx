'use client';

// Ports the preview motion layer (prototype.html v4) to React:
// - .rv / .im / [data-count] reveal via IntersectionObserver (below-fold items get .pre)
// - h1/h2 word-mask split (.w > .wi, .sh on view)
// - scroll: #prog scale, [data-par] image parallax, [data-trail] fill + lit dots, [data-jflow] path draw
// - RM (prefers-reduced-motion) -> everything instant/static.
// Re-runs on route change. Rendered once in the root layout.
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let io: IntersectionObserver | null = null;
    let hio: IntersectionObserver | null = null;
    let raf = 0;

    const split = (el: Element) => {
      if (el.querySelector('.w')) return;
      let i = 0;
      const walk = (n: Node) => {
        [...n.childNodes].forEach((c) => {
          if (c.nodeType === 3) {
            const parts = (c.textContent ?? '').split(/(\s+)/);
            const f = document.createDocumentFragment();
            parts.forEach((p) => {
              if (!p) return;
              if (/^\s+$/.test(p)) {
                f.appendChild(document.createTextNode(' '));
                return;
              }
              const w = document.createElement('span');
              w.className = 'w';
              const wi = document.createElement('span');
              wi.className = 'wi';
              wi.style.setProperty('--i', String(i++));
              wi.textContent = p;
              w.appendChild(wi);
              f.appendChild(w);
            });
            c.replaceWith(f);
          } else if (c.nodeType === 1) walk(c);
        });
      };
      walk(el);
    };

    const count = (el: HTMLElement) => {
      const to = Number(el.dataset.count);
      if (Number.isNaN(to)) return;
      const t0 = performance.now();
      const f = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400);
        const e = 1 - Math.pow(1 - k, 3);
        el.textContent = String(Math.round(to * e));
        if (k < 1) requestAnimationFrame(f);
      };
      requestAnimationFrame(f);
    };

    const prepReveal = (scope: ParentNode) => {
      if (RM || !('IntersectionObserver' in window)) return;
      if (!io)
        io = new IntersectionObserver(
          (es) =>
            es.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.remove('pre');
                io!.unobserve(e.target);
                const c = e.target.querySelector('[data-count]');
                if (c) count(c as HTMLElement);
                if ((e.target as HTMLElement).dataset.count) count(e.target as HTMLElement);
              }
            }),
          { rootMargin: '0px 0px -8% 0px' },
        );
      // Read every rect first, then mutate — interleaving reads and writes
      // would force a sync layout per element on mount.
      const below: Element[] = [];
      scope.querySelectorAll('.rv,.im,[data-count]').forEach((el) => {
        if (el.getBoundingClientRect().top > window.innerHeight * 0.92) below.push(el);
      });
      below.forEach((el) => {
        el.classList.add('pre');
        io!.observe(el);
      });
    };

    const heads = (scope: ParentNode) => {
      if (RM) return;
      const hs = scope.querySelectorAll('h1,h2');
      if (!hio)
        hio = new IntersectionObserver(
          (es) =>
            es.forEach((e) => {
              if (e.isIntersecting) {
                // Split just-in-time so the mount pass never pays for it; the
                // forced reflow lets the 108% -> 0 mask transition still run.
                split(e.target);
                void (e.target as HTMLElement).offsetHeight;
                e.target.classList.add('sh');
                hio!.unobserve(e.target);
              }
            }),
          { rootMargin: '0px 0px -6% 0px' },
        );
      // Same batching: read all tops, then touch classes.
      // home-v2 headings are animated by GSAP — splitting them here would
      // double-animate.
      const list = [...hs]
        .filter((h) => !h.closest('.v2'))
        .map((h) => ({ h, top: h.getBoundingClientRect().top }));
      list.forEach(({ h, top }) => {
        h.classList.remove('sh');
        // Already in view on load: leave the text painted as-is. The h1's
        // load-in is a CSS fade (globals.css pgIn) — no post-hydration repaint.
        if (top < window.innerHeight * 0.95) return;
        hio!.observe(h);
      });
    };

    const prog = document.getElementById('prog');
    // Cached at mount — the scroll path never re-queries the DOM.
    const parEls = [...document.querySelectorAll<HTMLElement>('[data-par]')].map((el) => ({
      el,
      img: el.querySelector('img') as HTMLElement | null,
    }));
    const trailEls = [...document.querySelectorAll<HTMLElement>('[data-trail]')];
    const jflowEls = [...document.querySelectorAll('[data-jflow]')];
    const onScroll = () => {
      const H = document.documentElement.scrollHeight - window.innerHeight;
      // One read pass, one write pass — keeps every frame to a single layout.
      const parR = RM ? [] : parEls.map(({ el }) => el.getBoundingClientRect());
      const trailR = trailEls.map((t) => {
        const r = t.getBoundingClientRect();
        const kids = [...t.children].map((c) => c.getBoundingClientRect().top);
        return { r, kids };
      });
      if (prog) prog.style.transform = `scaleX(${H > 0 ? window.scrollY / H : 0})`;
      if (!RM)
        parEls.forEach(({ el, img }, i) => {
          const r = parR[i]!;
          if (r.bottom < 0 || r.top > window.innerHeight) return;
          const k = Number(el.dataset.par) || 0.08;
          const c = r.top + r.height / 2 - window.innerHeight / 2;
          if (img) img.style.transform = `translateY(${(-c * k).toFixed(1)}px)`;
        });
      trailEls.forEach((t, ti) => {
        const { r, kids } = trailR[ti]!;
        const mark = window.innerHeight * 0.6;
        let p = (mark - r.top) / r.height;
        p = Math.max(0, Math.min(1, p));
        if (RM) p = 1;
        const fill = t.querySelector<HTMLElement>('.fill');
        if (fill) fill.style.transform = `scaleY(${p})`;
        [...t.children].forEach((c, ci) => {
          if (c.classList.contains('fill')) return;
          c.classList.toggle('lit', RM || kids[ci]! + 40 < mark);
        });
      });
    };

    const jone = (jf: Element, r: DOMRect) => {
      let p = (window.innerHeight * 0.85 - r.top) / (r.height + window.innerHeight * 0.25);
      p = Math.max(0, Math.min(1, p));
      if (RM) p = 1;
      const jp = jf.querySelector<SVGPathElement>('.jp');
      if (jp) jp.style.strokeDashoffset = (1 - p).toFixed(3);
      jf.querySelectorAll('.jn').forEach((n, k) => n.classList.toggle('lit', p >= k * 0.25 + 0.1));
    };
    const jcheck = () => {
      // Read pass first (offsetParent + rect), then mutate.
      const visible = jflowEls.filter(
        (jf) => (jf as HTMLElement).offsetParent !== null || raf === 0
      );
      const rects = visible.map((jf) => jf.getBoundingClientRect());
      visible.forEach((jf, i) => jone(jf, rects[i]!));
    };

    // One rAF-gated dispatcher for all scroll work — no per-event long tasks.
    let ticking = false;
    const onScrollEvent = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        onScroll();
        jcheck();
      });
    };

    prepReveal(document);
    heads(document);
    onScroll();
    jcheck();
    window.addEventListener('scroll', onScrollEvent, { passive: true });
    window.addEventListener('resize', onScrollEvent);
    return () => {
      window.removeEventListener('scroll', onScrollEvent);
      window.removeEventListener('resize', onScrollEvent);
      io?.disconnect();
      hio?.disconnect();
      raf = -1;
    };
  }, [pathname]);

  return null;
}
