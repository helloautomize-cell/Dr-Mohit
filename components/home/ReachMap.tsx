// "Coming from out of town" — the animated reach map (flowing dashed lines,
// pulsing hub rings) plus the four travel tips and the WhatsApp reports CTA.
// Ported 1:1 from the approved preview; the map is decorative (aria-hidden) and
// the tip icons are the preview's inline line icons.
import { copy } from '@/lib/copy';
import type { Locale } from '@/i18n/routing';
import { SITE } from '@/lib/site-config';
import { Swipe } from '../Swipe';

const TOWNS: { x: number; y: number; en: string; anchor: 'start' | 'end'; cls?: string }[] = [
  { x: 432, y: 276, en: 'Mansa', anchor: 'start' },
  { x: 468, y: 183, en: 'Barnala', anchor: 'start' },
  { x: 377, y: 77, en: 'Moga', anchor: 'start' },
  { x: 278, y: 113, en: 'Faridkot', anchor: 'end' },
  { x: 221, y: 161, en: 'Sri Muktsar Sahib', anchor: 'end' },
  { x: 103, y: 178, en: 'Fazilka', anchor: 'end' },
  { x: 538, y: 214, en: 'Sangrur', anchor: 'start' },
  { x: 343, y: 387, en: 'Sirsa', anchor: 'start', cls: 'h' },
  { x: 175, y: 375, en: 'Hanumangarh', anchor: 'end', cls: 'r' },
  { x: 67, y: 298, en: 'Sri Ganganagar', anchor: 'end', cls: 'r' },
];

const FLOWS: { d: string; cls?: string }[] = [
  { d: 'M432 276 Q368 269 324 224' },
  { d: 'M468 183 Q403 229 324 224' },
  { d: 'M377 77 Q377 160 324 224' },
  { d: 'M278 113 Q321 160 324 224' },
  { d: 'M221 161 Q284 174 324 224' },
  { d: 'M103 178 Q222 161 324 224' },
  { d: 'M538 214 Q433 257 324 224' },
  { d: 'M343 387 Q304 309 324 224', cls: 'h' },
  { d: 'M175 375 Q222 272 324 224', cls: 'r' },
  { d: 'M67 298 Q182 215 324 224', cls: 'r' },
];

const TIP_ICONS = [
  <svg key="a" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" />
    <path d="M9 9.5c.5 2.5 2.5 4.5 5 5l1.2-1.2 2 1-1 1.8c-4 .3-8.6-4.3-8.3-8.3L9.7 6.8l1 2z" />
  </svg>,
  <svg key="b" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 3h7l5 5v13H7z" />
    <path d="M14 3v5h5M10 13h6M10 17h4" />
  </svg>,
  <svg key="d" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M3 10h18M7 15h4" />
  </svg>,
  <svg key="e" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
  </svg>,
];

export function ReachMap({ locale }: { locale: Locale }) {
  const c = (en: string) => copy('home', en, locale);
  const tips = [
    { b: c('Send reports on WhatsApp first'), s: c('The team can tell you which doctor to see') },
    { b: c('Bring every old report'), s: c('X-rays, scans, prescriptions and the medicines you take now') },
    { b: c('Carry your Ayushman card'), s: c('If you have one, along with Aadhaar') },
    { b: c('Ask for an early slot'), s: c('If you are travelling far, book ahead') },
  ];
  return (
    <div className="reach">
      <div className="rv">
        <svg className="rmap" viewBox="0 0 600 420" aria-hidden="true">
          <text className="st" x="250" y="40">
            {c('PUNJAB')}
          </text>
          <text className="st" x="420" y="410">
            {c('HARYANA')}
          </text>
          <text className="st" x="30" y="410">
            {c('RAJASTHAN')}
          </text>
          {FLOWS.map((f, i) => (
            <path key={i} className={`fl${f.cls ? ` ${f.cls}` : ''}`} d={f.d} />
          ))}
          {TOWNS.map((t) => (
            <g key={t.en} className={`tw${t.cls ? ` ${t.cls}` : ''}`}>
              <circle cx={t.x} cy={t.y} r="5" />
              <text
                x={t.anchor === 'start' ? t.x + 10 : t.x - 10}
                y={t.y + 4}
                textAnchor={t.anchor}
              >
                {c(t.en)}
              </text>
            </g>
          ))}
          <circle className="ring" cx="324" cy="224" r="10" />
          <circle className="ring b" cx="324" cy="224" r="10" />
          <circle className="hub" cx="324" cy="224" r="9" />
          <text className="hubt" x="324" y="254" textAnchor="middle">
            {c('Bathinda')}
          </text>
        </svg>
        <div className="rkey">
          <span>
            <i />
            <span>{c('Punjab')}</span>
          </span>
          <span className="h">
            <i />
            <span>{c('Haryana')}</span>
          </span>
          <span className="r">
            <i />
            <span>{c('Rajasthan')}</span>
          </span>
          <span>{c('Example towns, not to scale.')}</span>
        </div>
      </div>
      <div className="rv">
        <h3 style={{ fontSize: '1.3rem' }}>{c('Before a long trip')}</h3>
        <Swipe as="ul" className="tips" count={tips.length} label={c('Before a long trip')}>
          {tips.map((t, i) => (
            <li key={t.b}>
              <span className="ci">{TIP_ICONS[i]}</span>
              <div>
                <b>{t.b}</b>
                <span>{t.s}</span>
              </div>
            </li>
          ))}
        </Swipe>
        <div style={{ marginTop: 24 }}>
          <a
            className="btn btn-brand"
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener"
          >
            <span>{c('Send reports on WhatsApp')}</span>
            <span className="ar">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
