'use client';
// "Bend the knee and watch the balance" demo (robotic knee page, navy .jr-sec
// band). Ports drawBal(): the tibia group rotates about the knee point, the
// camera ray follows a tibial marker, the inner/outer gap bars diverge in the
// "before" state and stay equal "after". Verdict line is aria-live.
import { useState } from 'react';
import { copy } from '@/lib/copy';
import type { Locale } from '@/i18n/routing';

const VERDICT = {
  en: {
    off: 'The two sides are uneven. The surgeon adjusts the plan before any bone is cut.',
    on: 'Both sides stay even through the bend.',
  },
  pa: {
    off: 'ਦੋਵੇਂ ਪਾਸੇ ਬਰਾਬਰ ਨਹੀਂ ਹਨ। ਸਰਜਨ ਯੋਜਨਾ ਨੂੰ ਠੀਕ ਕਰਦਾ ਹੈ।',
    on: 'ਦੋਵੇਂ ਪਾਸੇ ਹਰ ਕੋਣ ਤੇ ਬਰਾਬਰ ਹਨ।',
  },
};

export function BalanceDemo({ locale }: { locale: Locale }) {
  const c = (en: string) => copy('robotic-knee', en, locale);
  const [angle, setAngle] = useState(0);
  const [after, setAfter] = useState(false);
  const rad = (angle * Math.PI) / 180;
  const s = Math.sin(rad);
  const gi = after ? 64 : 64 + 24 * s;
  const go = after ? 64 : 64 - 26 * s + (angle < 20 ? 8 : 0);
  const off = Math.abs(gi - go) > 8;
  // Marker position after rotating (302,304) about the knee pivot (237,240).
  const tx = 302 - 237;
  const ty = 304 - 240;
  const mx = 237 + tx * Math.cos(rad) - ty * Math.sin(rad);
  const my = 240 + tx * Math.sin(rad) + ty * Math.cos(rad);
  const v = VERDICT[locale];
  return (
    <div className="bal">
      <div className="rv">
        <svg className="balsvg" viewBox="0 0 560 420" aria-hidden="true">
          <g className="cam">
            <rect x="456" y="18" width="84" height="34" rx="8" />
            <circle cx="480" cy="35" r="8" />
            <circle cx="516" cy="35" r="8" />
            <text x="456" y="72">
              {c('Camera')}
            </text>
          </g>
          <line className="ray" x1="480" y1="43" x2="312" y2="96" strokeDasharray="5 6" />
          <line className="ray" x1="516" y1="43" x2={mx.toFixed(1)} y2={my.toFixed(1)} strokeDasharray="5 6" />
          <path
            className="kb"
            d="M212 0 H262 V176 C290 182 300 214 284 232 C268 246 246 238 237 238 C226 238 206 246 190 232 C174 214 184 182 212 176 Z"
          />
          <g>
            <path d="M262 96 H300" stroke="#7FD3A0" strokeWidth="3" />
            <circle className="mk" cx="304" cy="88" r="6" />
            <circle className="mk" cx="318" cy="100" r="6" />
            <circle className="mk" cx="304" cy="110" r="6" />
          </g>
          <g transform={`rotate(${angle} 237 240)`}>
            <rect className="kb" x="196" y="246" width="82" height="18" rx="7" />
            <path className="kb" d="M212 264 H262 L258 420 H216 Z" />
            <path d="M260 300 H298" stroke="#7FD3A0" strokeWidth="3" />
            <circle className="mk" cx="302" cy="292" r="6" />
            <circle className="mk" cx="316" cy="304" r="6" />
            <circle className="mk" cx="302" cy="314" r="6" />
          </g>
          <text x="20" y="40">
            {angle}°
          </text>
        </svg>
      </div>
      <div className="balpanel rv">
        <div className="seg" role="group" aria-label="Balance state">
          <button type="button" aria-pressed={!after} onClick={() => setAfter(false)}>
            {c('Before balancing')}
          </button>
          <button type="button" aria-pressed={after} onClick={() => setAfter(true)}>
            {c('After balancing')}
          </button>
        </div>
        <div className="gap">
          <span>
            <b>{c('Inner side')}</b>
          </span>
          <i>
            <b className={off ? 'off' : undefined} style={{ width: `${gi}%` }} />
          </i>
        </div>
        <div className="gap">
          <span>
            <b>{c('Outer side')}</b>
          </span>
          <i>
            <b className={off ? 'off' : undefined} style={{ width: `${go}%` }} />
          </i>
        </div>
        <label htmlFor="bang">{c('Bend the knee')}</label>
        <input
          type="range"
          id="bang"
          min={0}
          max={110}
          value={angle}
          onChange={(e) => setAngle(+e.target.value)}
        />
        <p className="verdict" aria-live="polite">
          {off ? v.off : v.on}
        </p>
      </div>
    </div>
  );
}
