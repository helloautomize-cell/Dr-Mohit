'use client';
// "Follow the light" eye explorer (eye care) — the preview's eyesvg with four
// tappable part groups synced to the #etabs chip group and the info panel.
// Same interaction contract as KneeExplorer; the panel is aria-live.
import { useState } from 'react';
import { EYE, partText } from '@/lib/tools-data';
import type { Locale } from '@/i18n/routing';
import { RichText } from '../RichText';

type K = keyof typeof EYE;
const ORDER: K[] = ['cornea', 'lens', 'retina', 'nerve'];

export function EyeExplorer({ locale }: { locale: Locale }) {
  const [k, setK] = useState<K>('lens');
  const d = partText(EYE, k, locale);
  const pick = (key: K) => setK(key);
  const keyPick = (e: React.KeyboardEvent, key: K) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setK(key);
    }
  };
  const g = (key: K, label: string, children: React.ReactNode) => (
    <g
      className={`ep${k === key ? ' on' : ''}`}
      data-k={key}
      tabIndex={0}
      role="button"
      aria-label={label}
      onClick={() => pick(key)}
      onKeyDown={(e) => keyPick(e, key)}
    >
      {children}
    </g>
  );
  return (
    <div className="eyebox">
      <div className="rv">
        <svg className="eyesvg" viewBox="0 0 540 320" role="img" aria-label="Side view of the eye">
          <circle cx="300" cy="160" r="122" fill="#fff" stroke="#BFD3EE" strokeWidth="3" />
          {g('retina', partText(EYE, 'retina', locale)[0], <>
            <path className="hl" d="M330 46 A118 118 0 0 1 330 274" fill="none" stroke="#1E9A4B" strokeWidth="18" strokeLinecap="round" opacity=".25" />
            <path d="M330 46 A118 118 0 0 1 330 274" fill="none" stroke="#E07A6B" strokeWidth="7" strokeLinecap="round" />
            <text x="388" y="40" fontSize="14" fill="#3D4652">{partText(EYE, 'retina', locale)[0]}</text>
          </>)}
          {g('nerve', partText(EYE, 'nerve', locale)[0], <>
            <rect className="hl" x="404" y="132" width="122" height="56" rx="18" fill="#1E9A4B" opacity=".18" />
            <path d="M414 145 C450 140 480 138 520 132 L520 188 C480 182 450 180 414 175 Z" fill="#F4C9A8" stroke="#D99A6C" strokeWidth="2" />
            <text x="440" y="214" fontSize="14" fill="#3D4652">{partText(EYE, 'nerve', locale)[0]}</text>
          </>)}
          {g('cornea', partText(EYE, 'cornea', locale)[0], <>
            <path className="hl" d="M196 96 Q138 160 196 224" fill="none" stroke="#1E9A4B" strokeWidth="18" strokeLinecap="round" opacity=".25" />
            <path d="M196 96 Q138 160 196 224" fill="rgba(180,215,245,.35)" stroke="#5A8FD6" strokeWidth="3" />
            <text x="112" y="86" fontSize="14" fill="#3D4652">{partText(EYE, 'cornea', locale)[0]}</text>
          </>)}
          <path d="M202 104 L202 140 M202 180 L202 216" stroke="#1D4E9E" strokeWidth="7" strokeLinecap="round" />
          {g('lens', partText(EYE, 'lens', locale)[0], <>
            <ellipse className="hl" cx="222" cy="160" rx="28" ry="52" fill="#1E9A4B" opacity=".2" />
            <ellipse cx="222" cy="160" rx="17" ry="40" fill="#DDEBFA" stroke="#5A8FD6" strokeWidth="3" />
            <text x="204" y="262" fontSize="14" fill="#3D4652">{partText(EYE, 'lens', locale)[0]}</text>
          </>)}
          <path className="ray" d="M10 118 L170 124 L222 140 L416 160" />
          <path className="ray" d="M10 160 L416 160" style={{ animationDelay: '-.4s' }} />
          <path className="ray" d="M10 202 L170 196 L222 180 L416 160" style={{ animationDelay: '-.8s' }} />
          <circle cx="416" cy="160" r="5" fill="#F2B13A" />
        </svg>
      </div>
      <div className="einfo rv">
        <div className="etabs" id="etabs" role="group" aria-label="Part of the eye">
          {ORDER.map((key) => (
            <button
              key={key}
              type="button"
              data-k={key}
              aria-pressed={k === key}
              onClick={() => pick(key)}
            >
              {partText(EYE, key, locale)[0]}
            </button>
          ))}
        </div>
        <div aria-live="polite">
          <h3 id="e-t">{d[0]}</h3>
          <p id="e-d">{d[1]}</p>
          <div className="cond" id="e-c">
            <RichText text={d[2]} />
          </div>
        </div>
      </div>
    </div>
  );
}
