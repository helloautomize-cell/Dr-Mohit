// A- / A+ text-size switch (phase-02 item 1): scales html font-size between
// 0.9x and 1.2x, persisted in localStorage.
'use client';

import { useSyncExternalStore } from 'react';

const KEY = 'gh_textscale_v1';
let scale = 1;
let hydrated = false;
const listeners = new Set<() => void>();
const SNAPSHOT = () => scale;

function hydrate() {
  if (hydrated) return;
  hydrated = true;
  try {
    const v = parseFloat(localStorage.getItem(KEY) ?? '1');
    if (v >= 0.9 && v <= 1.2) scale = v;
  } catch { /* default */ }
  apply();
}

function apply() {
  if (typeof document !== 'undefined') {
    document.documentElement.style.fontSize = `${(scale * 100).toFixed(0)}%`;
  }
}

export function useTextScale() {
  const v = useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => (hydrate(), SNAPSHOT()),
    () => 1,
  );
  return {
    scale: v,
    bump(dir: number) {
      scale = Math.min(1.2, Math.max(0.9, Math.round((scale + dir * 0.1) * 100) / 100));
      try {
        localStorage.setItem(KEY, String(scale));
      } catch { /* ignore */ }
      apply();
      listeners.forEach((fn) => fn());
    },
  };
}
