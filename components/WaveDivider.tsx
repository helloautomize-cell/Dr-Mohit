// Animated wave divider between two colour bands. `from` is the band above
// (container bg), `to` the band below (the two drifting paths). Exact preview
// paths; drift animation lives in the ported CSS (.w1/.w2).
export type Band = 'white' | 'sky' | 'mint' | 'brand' | 'navy' | 'teal';

export const BAND_HEX: Record<Band, string> = {
  white: '#FFFFFF',
  sky: '#EEF3FB',
  mint: '#EAF6EF',
  brand: '#1D4E9E',
  navy: '#0F2A55',
  teal: '#E4F3F1',
};

const W2 = 'M0 45 Q 180 75 360 45 T 720 45 T 1080 45 T 1440 45 T 1800 45 T 2160 45 T 2520 45 T 2880 45 V80 H0 Z';
const W1 = 'M0 35 Q 180 5 360 35 T 720 35 T 1080 35 T 1440 35 T 1800 35 T 2160 35 T 2520 35 T 2880 35 V80 H0 Z';

export function WaveDivider({ from, to }: { from: Band; to: Band }) {
  return (
    <div className="wave" aria-hidden="true" style={{ background: BAND_HEX[from] }}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path className="w2" fill={BAND_HEX[to]} d={W2} />
        <path className="w1" fill={BAND_HEX[to]} d={W1} />
      </svg>
    </div>
  );
}
