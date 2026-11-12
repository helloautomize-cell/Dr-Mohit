'use client';

// Draggable press-clipping board with an accessible lightbox, ported from the
// approved preview. Desktop: clips drop in with a staggered fall, drag with
// rotate-on-move, click/Enter opens the lightbox. Mobile (<901px): horizontal
// scroll-snap strip, tap to zoom. Reduced motion: static layout, no entry
// animation. The lightbox is a focus-managed dialog: Esc/scrim click closes,
// focus returns to the clip.
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Swipe } from './Swipe';

export type Clip = { img: string; x: string; y: string; r: string; src: string; cap: string };

export const MEDIA_CLIPS: Clip[] = [
  { img: 'c12', x: '1%', y: '3%', r: '-4deg', src: 'Bathinda Bhaskar · 12 Mar 2024', cap: 'Robotic knee system inaugurated' },
  { img: 'c01', x: '21%', y: '5%', r: '3deg', src: 'Hindustan Times', cap: 'Robotic knee replacement, explained' },
  { img: 'c06', x: '41%', y: '2%', r: '-2deg', src: 'Bathinda Bhaskar · 27 Aug 2024', cap: 'J&J knee implant programme' },
  { img: 'c02', x: '61%', y: '6%', r: '4deg', src: 'Hindustan Times · Sep 2024', cap: 'Health Talk series' },
  { img: 'c05', x: '80%', y: '3%', r: '-3deg', src: 'Sach Kahoon · 26 Aug 2024', cap: 'Choosing a knee implant' },
  { img: 'c03', x: '10%', y: '36%', r: '3deg', src: 'Dabwali Bhaskar · 07 Sep 2024', cap: 'Medical camp at Mehta Dharamshala' },
  { img: 'c13', x: '30%', y: '34%', r: '-5deg', src: 'Hindi press · 3 Dec', cap: '237 patients checked at camp' },
  { img: 'c14', x: '51%', y: '37%', r: '2deg', src: 'Jagmarg', cap: '200 patients checked' },
  { img: 'c21', x: '71%', y: '35%', r: '-3deg', src: 'Punjabi press', cap: 'Jhuneer camp, 300 patients' },
  { img: 'c11', x: '2%', y: '67%', r: '4deg', src: 'Hindi press', cap: 'Free eye and bone camp' },
  { img: 'c15', x: '21%', y: '66%', r: '-2deg', src: 'Punjabi press', cap: '190 patients at medical camp' },
  { img: 'c20', x: '41%', y: '68%', r: '5deg', src: 'Hindi press · 25 Apr', cap: '150 students checked' },
  { img: 'c18', x: '61%', y: '65%', r: '-4deg', src: 'Hindi press', cap: 'Rajindra College eye camp' },
  { img: 'c10', x: '80%', y: '67%', r: '3deg', src: 'Hindi press', cap: 'Eyes checked for 75 patients' },
];

export const HOME_CLIPS: Clip[] = [
  { img: 'c12', x: '2%', y: '7%', r: '-5deg', src: 'Bathinda Bhaskar · 12 Mar 2024', cap: 'Robotic knee system inaugurated' },
  { img: 'c06', x: '18%', y: '40%', r: '4deg', src: 'Bathinda Bhaskar · 27 Aug 2024', cap: 'J&J knee implant programme' },
  { img: 'c02', x: '35%', y: '5%', r: '-2deg', src: 'Hindustan Times · Sep 2024', cap: 'Health Talk series' },
  { img: 'c13', x: '51%', y: '38%', r: '5deg', src: 'Hindi press · 3 Dec', cap: '237 patients checked at camp' },
  { img: 'c21', x: '67%', y: '8%', r: '-4deg', src: 'Punjabi press', cap: 'Jhuneer camp, 300 patients' },
  { img: 'c20', x: '82%', y: '42%', r: '3deg', src: 'Hindi press · 25 Apr', cap: '150 students checked' },
];

export function PressBoard({ clips, big = false, hint, label }: { clips: Clip[]; big?: boolean; hint?: string; label: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const z = useRef(10);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = openIdx === null ? null : clips[openIdx] ?? null;

  const openLb = useCallback(
    (c: Clip, el: HTMLElement) => {
      opener.current = el;
      setOpenIdx(clips.indexOf(c));
    },
    [clips],
  );

  const close = useCallback(() => {
    setOpenIdx(null);
    opener.current?.focus();
    opener.current = null;
  }, []);

  const step = useCallback(
    (d: number) => {
      setOpenIdx((i) => (i === null ? i : (i + d + clips.length) % clips.length));
    },
    [clips.length],
  );

  useEffect(() => {
    if (openIdx === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'Tab') {
        // keep focus inside the dialog
        const els = Array.from(
          document.querySelectorAll<HTMLElement>('.lb button'),
        ).filter((b) => !b.hasAttribute('hidden'));
        if (!els.length) return;
        const first = els[0]!;
        const last = els[els.length - 1]!;
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openIdx, close, step]);

  // Entry animation + drag wiring, matching the preview's layoutBoards.
  useEffect(() => {
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const board = boardRef.current;
    if (!board) return;
    const cleanups: (() => void)[] = [];
    board.querySelectorAll<HTMLElement>('.clip').forEach((el, i) => {
      let sx = 0, sy = 0, ox = 0, oy = 0, moved = false, down = false;
      const base = 'rotate(var(--r))';
      if (!RM && window.innerWidth > 900) {
        el.style.opacity = '0';
        el.style.transform = `translateY(-40px) ${base}`;
        const t = setTimeout(() => {
          el.style.transition =
            'opacity .8s, transform 1s cubic-bezier(.22,.8,.2,1), box-shadow .3s, scale .3s';
          el.style.opacity = '1';
          el.style.transform = `translate(0,0) ${base}`;
        }, 180 + i * 90);
        cleanups.push(() => clearTimeout(t));
      }
      const pd = (e: PointerEvent) => {
        if (window.innerWidth <= 900) return;
        down = true;
        moved = false;
        sx = e.clientX;
        sy = e.clientY;
        el.style.zIndex = String(++z.current);
        el.style.transition = 'box-shadow .3s, scale .3s';
        el.setPointerCapture(e.pointerId);
      };
      const pm = (e: PointerEvent) => {
        if (!down) return;
        const dx = e.clientX - sx;
        const dy = e.clientY - sy;
        if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
        el.style.transform = `translate(${ox + dx}px,${oy + dy}px) rotate(calc(var(--r) + ${dx * 0.03}deg))`;
      };
      const pu = (e: PointerEvent) => {
        if (!down) return;
        down = false;
        ox += e.clientX - sx;
        oy += e.clientY - sy;
        el.style.transition = 'transform .6s cubic-bezier(.22,.8,.2,1), box-shadow .3s, scale .3s';
        el.style.transform = `translate(${ox}px,${oy}px) ${base}`;
        if (!moved) {
          const c = clips.find((x) => `/images/press/${x.img}.jpg` === el.dataset.img) ?? null;
          if (c) openLb(c, el);
        }
      };
      const click = (e: MouseEvent) => {
        // pointer path handles mouse clicks; this covers touch-strip taps and
        // keyboard activation (detail 0 = keyboard, button fires click on Enter)
        if (window.innerWidth <= 900 || e.detail === 0) {
          const c = clips.find((x) => `/images/press/${x.img}.jpg` === el.dataset.img) ?? null;
          if (c) openLb(c, el);
        }
      };
      el.addEventListener('pointerdown', pd);
      el.addEventListener('pointermove', pm);
      el.addEventListener('pointerup', pu);
      el.addEventListener('click', click);
      cleanups.push(() => {
        el.removeEventListener('pointerdown', pd);
        el.removeEventListener('pointermove', pm);
        el.removeEventListener('pointerup', pu);
        el.removeEventListener('click', click);
      });
    });
    return () => cleanups.forEach((f) => f());
  }, [clips, openLb]);

  const boardRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Swipe
        className={`board${big ? ' big' : ''}`}
        count={clips.length}
        label={label}
        trackRef={boardRef}
        trackProps={{ 'data-board': true }}
      >
        {clips.map((c) => (
          <button
            className="clip"
            type="button"
            key={c.img + c.x + c.y}
            data-img={`/images/press/${c.img}.jpg`}
            style={{ left: c.x, top: c.y, ['--r' as string]: c.r }}
          >
            <span className="pin" aria-hidden="true" />
            <Image
              src={`/images/press/${c.img}.jpg`}
              alt=""
              width={424}
              height={460}
              style={{ width: '100%', height: '230px', objectFit: 'cover', objectPosition: 'top' }}
            />
            <small>{c.src}</small>
            <b>{c.cap}</b>
          </button>
        ))}
        <span className="hint" aria-hidden="true">
          {hint ?? 'Drag · Click to read'}
        </span>
      </Swipe>
      {open ? (
        <div
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label={open.cap}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button id="lbx" ref={closeRef} onClick={close} aria-label="Close">
            ×
          </button>
          <button
            className="lbn lbprev"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous clipping"
          >
            ‹
          </button>
          <figure className="lbfig" onClick={(e) => e.stopPropagation()}>
            <Image
              id="lbi"
              src={`/images/press/${open.img}.jpg`}
              alt={`Newspaper clipping: ${open.cap}`}
              width={900}
              height={978}
              onClick={(e) => e.stopPropagation()}
            />
            <figcaption>
              <small>{open.src}</small> {open.cap}
            </figcaption>
          </figure>
          <button
            className="lbn lbnext"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next clipping"
          >
            ›
          </button>
        </div>
      ) : null}
    </>
  );
}
