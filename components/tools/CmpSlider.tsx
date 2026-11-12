'use client';
// Split-view comparison slider — the preview's .cmp/.cmp2 pattern: two stacked
// layers, the top one clipped by the --x custom property driven by the range
// input (mouse, touch and keyboard via the native input).
import { useState, type ReactNode } from 'react';

export function CmpSlider({
  layerA,
  layerB,
  leftTag,
  rightTag,
  ariaLabel,
  className = 'cmp rv',
  id,
}: {
  layerA: ReactNode;
  layerB: ReactNode;
  leftTag: string;
  rightTag: string;
  ariaLabel: string;
  className?: string;
  id?: string;
}) {
  const [x, setX] = useState(50);
  return (
    <div className={className} id={id} style={{ ['--x' as string]: `${x}%` }}>
      {layerA}
      {layerB}
      <span className="bar" />
      <span className="knob">↔</span>
      <span className="tg l">{leftTag}</span>
      <span className="tg r">{rightTag}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={x}
        aria-label={ariaLabel}
        onChange={(e) => setX(Number(e.target.value))}
      />
    </div>
  );
}
