'use client';
// "Arthroscopy & sports injuries" joint tabs (orthopaedics) — ARIA tablist with
// roving selection: arrow keys move between tabs, Enter/Space picks, panels
// toggle hidden. All panel copy is SSR'd; medical term lists stay English in
// both locales exactly as the approved preview ships them.
import { useRef, useState } from 'react';
import { copy } from '@/lib/copy';
import type { Locale } from '@/i18n/routing';
import { ImageSlot } from '../ImageSlot';

type K = 'shoulder' | 'knee' | 'elbow' | 'spine';

const PANELS: { k: K; see: string[]; treat: string[] }[] = [
  {
    k: 'shoulder',
    see: [
      'Frozen shoulder',
      'Rotator cuff tear',
      'Shoulder instability',
      'Labral tear',
      'Impingement',
      'AC joint injury',
      'Biceps tendon injury',
      'Bursitis',
      'Tendonitis',
    ],
    treat: [
      'Rotator cuff repair',
      'Labral repair',
      'Shoulder stabilisation',
      'Subacromial decompression',
      'Biceps tenodesis',
      'Release for a stiff shoulder',
    ],
  },
  {
    k: 'knee',
    see: [
      'ACL tear',
      'PCL tear',
      'Meniscus tear',
      'Collateral ligament sprain',
      'Kneecap pain',
      'Patellar tendonitis',
      'Chondromalacia',
      'Knee instability',
      'Osteochondritis dissecans',
    ],
    treat: [
      'ACL reconstruction',
      'Meniscus repair or trimming',
      'Kneecap realignment',
      'Cartilage procedures',
    ],
  },
  {
    k: 'elbow',
    see: ['Tennis elbow', 'Golfer’s elbow', 'Elbow sprains'],
    treat: ['Most elbow pain settles with physiotherapy, bracing and activity changes first'],
  },
  {
    k: 'spine',
    see: [
      'Lower back pain',
      'Disc bulge',
      'Sciatica',
      'Neck pain',
      'Whiplash',
      'Postural pain',
      'Sacroiliac joint pain',
      'Thoracic outlet syndrome',
    ],
    treat: [
      'Back pain clinic with non-surgical care first',
      'Posture correction and core strengthening',
    ],
  },
];

const PHYSIO_CHIPS = [
  'Gait training',
  'Joint mobilisation',
  'Kinesio taping',
  'Balance training',
  'Postural correction',
  'Myofascial release',
  'Muscle energy techniques',
  'PNF stretching',
  'Running re-education',
  'Functional training',
  'Therapeutic exercise',
];

export function JTabs({ locale }: { locale: Locale }) {
  const c = (en: string) => copy('orthopaedics', en, locale);
  const tabs: { k: K; label: string }[] = [
    { k: 'shoulder', label: c('Shoulder') },
    { k: 'knee', label: c('Knee') },
    { k: 'elbow', label: c('Elbow') },
    { k: 'spine', label: c('Back &amp; neck') },
  ];
  const [sel, setSel] = useState<K>('shoulder');
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (i: number) => {
    const n = tabs.length;
    const j = ((i % n) + n) % n;
    refs.current[j]?.focus();
    setSel(tabs[j]!.k);
  };
  return (
    <div className="jtabs">
      <div className="jt" role="tablist">
        {tabs.map((t, i) => (
          <button
            key={t.k}
            type="button"
            role="tab"
            data-k={t.k}
            aria-selected={sel === t.k}
            aria-controls={`jpan-${t.k}`}
            id={`jtab-${t.k}`}
            tabIndex={sel === t.k ? 0 : -1}
            ref={(el) => {
              refs.current[i] = el;
            }}
            onClick={() => setSel(t.k)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') move(i + 1);
              else if (e.key === 'ArrowLeft') move(i - 1);
              else if (e.key === 'Home') move(0);
              else if (e.key === 'End') move(tabs.length - 1);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {PANELS.map((p) => (
        <div
          key={p.k}
          className="jpan"
          data-k={p.k}
          role="tabpanel"
          id={`jpan-${p.k}`}
          aria-labelledby={`jtab-${p.k}`}
          hidden={sel !== p.k}
        >
          <div>
            <h3>{c('What we see')}</h3>
            <div className="chips">
              {p.see.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
          <div>
            <h3>{c('How it can be treated')}</h3>
            <ul>
              {p.treat.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <ImageSlot
            id="ortho.sports"
            locale={locale}
            className="rv"
            caption={c('Back to the game: sports rehab session')}
          />
        </div>
      ))}
      <div className="physio rv">
        <div>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{c('Physiotherapy methods used')}</h3>
          <p className="muted" style={{ marginTop: 8, fontSize: '.95rem' }}>
            {c('Rehab is planned for each person')}
          </p>
        </div>
        <div className="chips">
          {PHYSIO_CHIPS.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
