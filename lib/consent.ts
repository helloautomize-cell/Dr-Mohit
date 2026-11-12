// Cookie consent store (phase-02 item 6): Essential always on, Analytics
// opt-in. Backed by localStorage; useSyncExternalStore requires getSnapshot
// to return a CACHED reference (stable identity between emits).
'use client';

import { useSyncExternalStore } from 'react';

export type ConsentState = {
  analytics: boolean;
  /** null until the user has decided */
  decided: boolean;
};

const KEY = 'gh_consent_v1';
const SERVER_SNAPSHOT: ConsentState = { analytics: false, decided: false };
let cached: ConsentState = SERVER_SNAPSHOT;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate(): ConsentState {
  if (hydrated) return cached;
  hydrated = true;
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(KEY) : null;
    if (raw) cached = JSON.parse(raw) as ConsentState;
  } catch {
    /* corrupted value -> defaults */
  }
  return cached;
}

function emit() {
  listeners.forEach((fn) => fn());
}

export function setConsent(analytics: boolean) {
  cached = { analytics, decided: true };
  try {
    localStorage.setItem(KEY, JSON.stringify(cached));
    // Cookie mirror for server-side/edge consent checks (GA Consent Mode v2 later).
    document.cookie = `gh_consent=${analytics ? 'analytics' : 'essential'};path=/;max-age=31536000;SameSite=Lax`;
  } catch {
    /* storage denied -> session-only consent */
  }
  emit();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// IMPORTANT: getSnapshot must return a stable cached object, not a new literal
// per call, or useSyncExternalStore loops forever.
export function useConsent(): ConsentState {
  return useSyncExternalStore(subscribe, hydrate, () => SERVER_SNAPSHOT);
}

/** Open the banner again (footer "Cookie settings" link). */
export function reopenConsent() {
  cached = { ...cached, decided: false };
  emit();
}
