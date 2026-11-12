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
      scope.querySelectorAll('.rv,.im,[data-count]').forEach((el) => {
        if (el.getBoundingClientRect().top > window.innerHeight * 0.92) {
          el.classList.add('pre');
          io!.observe(el);
        }
      });
    };

    const heads = (scope: ParentNode) => {
      const hs = scope.querySelectorAll('h1,h2');
      if (RM) return;
      if (!hio)
        hio = new IntersectionObserver(
          (es) =>
            es.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add('sh');
                hio!.unobserve(e.target);
              }
            }),
          { rootMargin: '0px 0px -6% 0px' },
        );
      hs.forEach((h) => {
        split(h);
        h.classList.remove('sh');
        if (h.getBoundingClientRect().top < window.innerHeight * 0.95) {
          requestAnimationFrame(() => requestAnimationFrame(() => h.classList.add('sh')));
        } else hio!.observe(h);
      });
    };

    const prog = document.getElementById('prog');
    const onScroll = () => {
      const H = document.documentElement.scrollHeight - window.innerHeight;
      if (prog) prog.style.transform = `scaleX(${H > 0 ? window.scrollY / H : 0})`;
      if (!RM)
        document.querySelectorAll<HTMLElement>('[data-par]').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) return;
          const k = Number(el.dataset.par) || 0.08;
          const c = r.top + r.height / 2 - window.innerHeight / 2;
          const img = el.querySelector('img');
          if (img) (img as HTMLElement).style.transform = `translateY(${(-c * k).toFixed(1)}px)`;
        });
      document.querySelectorAll<HTMLElement>('[data-trail]').forEach((t) => {
        const r = t.getBoundingClientRect();
        const mark = window.innerHeight * 0.6;
        let p = (mark - r.top) / r.height;
        p = Math.max(0, Math.min(1, p));
        if (RM) p = 1;
        const fill = t.querySelector<HTMLElement>('.fill');
        if (fill) fill.style.transform = `scaleY(${p})`;
        [...t.children].forEach((c) => {
          if (c.classList.contains('fill')) return;
          const cr = c.getBoundingClientRect();
          c.classList.toggle('lit', RM || cr.top + 40 < mark);
        });
      });
    };

    const jone = (jf: Element) => {
      const r = jf.getBoundingClientRect();
      let p = (window.innerHeight * 0.85 - r.top) / (r.height + window.innerHeight * 0.25);
      p = Math.max(0, Math.min(1, p));
      if (RM) p = 1;
      const jp = jf.querySelector<SVGPathElement>('.jp');
      if (jp) jp.style.strokeDashoffset = (1 - p).toFixed(3);
      jf.querySelectorAll('.jn').forEach((n, k) => n.classList.toggle('lit', p >= k * 0.25 + 0.1));
    };
    const jcheck = () =>
      document.querySelectorAll('[data-jflow]').forEach((jf) => {
        if ((jf as HTMLElement).offsetParent !== null || raf === 0) jone(jf);
      });

    prepReveal(document);
    heads(document);
    onScroll();
    jcheck();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('scroll', jcheck, { passive: true });
    window.addEventListener('resize', jcheck);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('scroll', jcheck);
      window.removeEventListener('resize', jcheck);
      io?.disconnect();
      hio?.disconnect();
      raf = -1;
    };
  }, [pathname]);

  return null;
}
