'use client';
// "Inside the knee" explorer (orthopaedics) — the preview's kneesvg with five
// tappable part groups synced to the #ktabs chip group and the info panel.
// Ported from drawKnee(); the panel is aria-live so selection changes announce.
import { useState } from 'react';
import { KNEE, partText } from '@/lib/tools-data';
import type { Locale } from '@/i18n/routing';
import { copy } from '@/lib/copy';
import { RichText } from '../RichText';

type K = keyof typeof KNEE;
const ORDER: K[] = ['cartilage', 'meniscus', 'acl', 'side', 'bone'];

export function KneeExplorer({ locale }: { locale: Locale }) {
  const c = (en: string) => copy('orthopaedics', en, locale);
  const [k, setK] = useState<K>('cartilage');
  const d = partText(KNEE, k, locale);
  const pick = (key: K) => setK(key);
  const keyPick = (e: React.KeyboardEvent, key: K) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setK(key);
    }
  };
  return (
    <div className="eyebox">
      <div className="rv">
        <svg className="kneesvg" viewBox="0 0 520 430" role="group" aria-label="Front view of the knee">
          <g
            className={`ep${k === 'bone' ? ' on' : ''}`}
            data-k="bone"
            tabIndex={0}
            role="button"
            onClick={() => pick('bone')}
            onKeyDown={(e) => keyPick(e, 'bone')}
          >
            <path
              className="hl"
              d="M220 0 L300 0 L304 150 C340 160 352 200 330 220 C310 232 284 214 260 216 C236 214 210 232 190 220 C168 200 180 160 216 150 Z M184 268 C214 256 306 256 336 268 L330 292 L314 304 L308 430 L212 430 L206 304 L190 292 Z"
              fill="none"
              stroke="#1E9A4B"
              strokeWidth="16"
              opacity=".25"
            />
            <path
              className="kb"
              d="M220 0 L300 0 L304 150 C340 160 352 200 330 220 C310 232 284 214 260 216 C236 214 210 232 190 220 C168 200 180 160 216 150 Z"
            />
            <path
              className="kb"
              d="M184 268 C214 256 306 256 336 268 L330 292 L314 304 L308 430 L212 430 L206 304 L190 292 Z"
            />
            <path className="kb" d="M346 304 C350 292 364 292 368 304 L362 430 L350 430 Z" />
            <text x="318" y="60">
              {c('Thigh bone')}
            </text>
            <text x="160" y="380" textAnchor="end">
              {c('Shin bone')}
            </text>
          </g>
          <g
            className={`ep${k === 'cartilage' ? ' on' : ''}`}
            data-k="cartilage"
            tabIndex={0}
            role="button"
            aria-label={partText(KNEE, 'cartilage', locale)[0]}
            onClick={() => pick('cartilage')}
            onKeyDown={(e) => keyPick(e, 'cartilage')}
          >
            <path
              className="hl"
              d="M192 218 C212 230 236 214 260 218 C284 214 308 230 328 218 M190 266 C220 256 300 256 330 266"
              fill="none"
              stroke="#1E9A4B"
              strokeWidth="22"
              strokeLinecap="round"
              opacity=".25"
            />
            <path
              d="M192 218 C212 230 236 214 260 218 C284 214 308 230 328 218"
              fill="none"
              stroke="#1E9A4B"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path
              d="M190 266 C220 256 300 256 330 266"
              fill="none"
              stroke="#1E9A4B"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <text x="20" y="214">
              {c('Cartilage')}
            </text>
            <path d="M100 210 H184" stroke="#3D4652" strokeWidth="1.2" />
          </g>
          <g
            className={`ep${k === 'meniscus' ? ' on' : ''}`}
            data-k="meniscus"
            tabIndex={0}
            role="button"
            aria-label={partText(KNEE, 'meniscus', locale)[0]}
            onClick={() => pick('meniscus')}
            onKeyDown={(e) => keyPick(e, 'meniscus')}
          >
            <path
              className="hl"
              d="M184 242 H336"
              stroke="#1E9A4B"
              strokeWidth="26"
              strokeLinecap="round"
              opacity=".22"
            />
            <path
              d="M190 248 C198 234 234 232 250 242 C236 246 210 248 190 254Z"
              fill="#7FB2F5"
              stroke="#3E7BD1"
              strokeWidth="2"
            />
            <path
              d="M330 248 C322 234 286 232 270 242 C284 246 310 248 330 254Z"
              fill="#7FB2F5"
              stroke="#3E7BD1"
              strokeWidth="2"
            />
            <text x="20" y="252">
              {c('Meniscus')}
            </text>
            <path d="M104 248 H186" stroke="#3D4652" strokeWidth="1.2" />
          </g>
          <g
            className={`ep${k === 'acl' ? ' on' : ''}`}
            data-k="acl"
            tabIndex={0}
            role="button"
            aria-label={partText(KNEE, 'acl', locale)[0]}
            onClick={() => pick('acl')}
            onKeyDown={(e) => keyPick(e, 'acl')}
          >
            <path
              className="hl"
              d="M248 220 L280 266"
              stroke="#1E9A4B"
              strokeWidth="22"
              strokeLinecap="round"
              opacity=".25"
            />
            <path d="M248 222 L278 264" stroke="#D0574A" strokeWidth="8" strokeLinecap="round" />
            <path d="M274 222 L246 262" stroke="#E9A79C" strokeWidth="6" strokeLinecap="round" />
            <text x="400" y="214">
              {c('ACL')}
            </text>
            <path d="M396 210 H282 L270 236" fill="none" stroke="#3D4652" strokeWidth="1.2" />
          </g>
          <g
            className={`ep${k === 'side' ? ' on' : ''}`}
            data-k="side"
            tabIndex={0}
            role="button"
            aria-label={partText(KNEE, 'side', locale)[0]}
            onClick={() => pick('side')}
            onKeyDown={(e) => keyPick(e, 'side')}
          >
            <path
              className="hl"
              d="M180 180 L190 304 M340 180 L352 304"
              stroke="#1E9A4B"
              strokeWidth="22"
              strokeLinecap="round"
              opacity=".25"
            />
            <path d="M180 182 L190 302" stroke="#1D4E9E" strokeWidth="8" strokeLinecap="round" />
            <path d="M340 182 L354 300" stroke="#1D4E9E" strokeWidth="8" strokeLinecap="round" />
            <text x="400" y="290">
              {c('Side ligaments')}
            </text>
            <path d="M396 286 H356" stroke="#3D4652" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
      <div className="einfo rv">
        <div className="etabs" id="ktabs" role="group" aria-label="Part of the knee">
          {ORDER.map((key) => (
            <button
              key={key}
              type="button"
              data-k={key}
              aria-pressed={k === key}
              onClick={() => pick(key)}
            >
              {partText(KNEE, key, locale)[0]}
            </button>
          ))}
        </div>
        <div aria-live="polite">
          <h3 id="k-t">{d[0]}</h3>
          <p id="k-d">{d[1]}</p>
          <div className="cond" id="k-c">
            <RichText text={d[2]} />
          </div>
        </div>
      </div>
    </div>
  );
}
