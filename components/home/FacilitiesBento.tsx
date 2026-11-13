'use client';
// Facilities bento (v15 upgrade) — replaces the old photo trio + card strip on
// Home only. Four-photo crossfade viewer (autoplay while in view, pause on
// hover, tabs jump) beside a grid of glass tiles. Hovering/focusing the OT,
// X-ray or Physio tile switches the viewer to its photo. Reduced motion: no
// autoplay or zoom, tabs still work.
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { slot } from '@/lib/image-slots';
import { Icon, type IconName } from '@/components/icons';
import { RichText } from '../RichText';
import type { Locale } from '@/i18n/routing';

const D = 5000;
const IM_SLOTS = ['ortho.sp.scope', 'eye.cataract-day', 'ortho.fr.xray', 'ortho.bp.physio'];
// The mobile viewer crops each landscape photo into a tall 4/4.6 frame, so the
// subject needs its own horizontal focal — same slot, different center.
const MFOCAL = ['32% 45%', '40% 45%', '64% 45%', '55% 50%'];

function Cam() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function FacilitiesBento() {
  const t = useTranslations('home.fac');
  const locale = useLocale() as Locale;
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0); // re-keys the progress bar so it restarts
  const pausedRef = useRef(false);
  const curRef = useRef(0);
  const rmRef = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  curRef.current = cur;

  const setPause = useCallback((v: boolean) => {
    pausedRef.current = v;
    setPaused(v);
  }, []);
  const show = useCallback((i: number) => {
    setCur(i);
    setTick((n) => n + 1);
  }, []);

  useEffect(() => {
    rmRef.current = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = root.current;
    if (!el || rmRef.current) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const play = () => {
      stop();
      timer = setInterval(() => {
        if (!pausedRef.current) show((curRef.current + 1) % IM_SLOTS.length);
      }, D);
    };
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => (e.isIntersecting ? play() : stop())),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ims = IM_SLOTS.map((id) => slot(id));
  const tiles: { icon: IconName; h: string; p: string; showI?: number; wide?: boolean; see?: boolean }[] = [
    { icon: 'ot', h: t('t1h'), p: t('t1p'), showI: 0, wide: true, see: true },
    { icon: 'icu', h: t('t2h'), p: t('t2p') },
    { icon: 'blood', h: t('t3h'), p: t('t3p') },
    { icon: 'xray', h: t('t4h'), p: t('t4p'), showI: 2 },
    { icon: 'lab', h: t('t5h'), p: t('t5p') },
    { icon: 'pill', h: t('t6h'), p: t('t6p') },
    { icon: 'physio', h: t('t7h'), p: t('t7p'), showI: 3 },
  ];
  const glow = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <section className="sec fac-band fb-sec">
      <div className="wrap">
        <div className="fb-top rv">
          <div>
            <span className="label">{t('label')}</span>
            <h2 style={{ marginTop: 18 }}>
              <RichText text={t.raw('h2') as string} />
            </h2>
          </div>
          <p className="lede">{t('lede')}</p>
        </div>
        <div className={`fb${paused ? ' paused' : ''}`} id="facBento" ref={root}>
          <div
            className="fb-view rv"
            id="fbView"
            onMouseEnter={() => setPause(true)}
            onMouseLeave={() => setPause(false)}
          >
            <div className="fb-ims">
              {ims.map((im, i) => (
                <Image
                  key={i}
                  src={im.src!}
                  alt={im.alt[locale]}
                  fill
                  sizes="(max-width:1000px) 100vw, 50vw"
                  loading="lazy"
                  className={i === cur ? 'on' : ''}
                  style={
                    {
                      objectFit: 'cover',
                      '--foc': im.focal ?? '50% 50%',
                      '--mfoc': MFOCAL[i],
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
            <div className="fb-cap">
              <span className="fb-cam">
                <Cam />
                <b>{t('inside')}</b>
              </span>
              <div className="fb-tabs" role="group" aria-label={t('photosAria')}>
                {[0, 1, 2, 3].map((i) => (
                  <button
                    type="button"
                    key={i}
                    className={`fb-tab${i === cur ? ' on' : ''}`}
                    aria-pressed={i === cur}
                    onClick={() => show(i)}
                  >
                    <span>{t(`tab${i}`)}</span>
                    <i key={i === cur ? tick : -1} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {tiles.map((f, k) => {
            const showProps =
              f.showI === undefined
                ? {}
                : {
                    onMouseEnter: () => {
                      show(f.showI!);
                      setPause(true);
                    },
                    onFocus: () => {
                      show(f.showI!);
                      setPause(true);
                    },
                    onMouseLeave: () => setPause(false),
                    onBlur: () => setPause(false),
                    onClick: () => {
                      show(f.showI!);
                      setPause(true);
                    },
                  };
            return (
              <div
                className={`fb-t rv${f.wide ? ' fb-ot fb-wide' : ''}`}
                tabIndex={0}
                key={f.h}
                style={{ ['--k' as string]: k } as React.CSSProperties}
                onPointerMove={glow}
                {...showProps}
              >
                <span className="fb-ic">
                  <Icon name={f.icon} />
                </span>
                <h3>{f.h}</h3>
                <p>{f.p}</p>
                {f.see && (
                  <span className="fb-see">
                    <Cam />
                    <span>{t('see')}</span>
                  </span>
                )}
              </div>
            );
          })}

          <div
            className="fb-t fb-light rv"
            tabIndex={0}
            style={{ ['--k' as string]: tiles.length } as React.CSSProperties}
            onPointerMove={glow}
          >
            <span className="fb-ic">
              <Icon name="bed" />
            </span>
            <h3>{t('t8h')}</h3>
            <p>{t('t8p')}</p>
          </div>

          <a
            className="fb-t fb-cta rv"
            href="https://wa.me/919878752241?text=Hello%20Gupta%20Hospital%2C%20I%20would%20like%20to%20check%20if%20a%20test%20is%20done%20at%20the%20hospital."
            target="_blank"
            rel="noopener"
            style={{ ['--k' as string]: tiles.length + 1 } as React.CSSProperties}
            onPointerMove={glow}
          >
            <h3>{t('ctaH')}</h3>
            <p>{t('ctaP')}</p>
            <span className="fb-go">{t('ctaGo')}</span>
            <span className="fb-arr" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
