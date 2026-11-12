// Typed access to resources/content/site-content.en-pa.json (the copy source of
// truth). Entries are ordered {tag,en,pa} items per page section. Look up by the
// English string (or its prefix) so markup stays searchable; throws on misses in
// dev so a content drift is caught at build time, never silently.
import raw from '../resources/content/site-content.en-pa.json';
import type { Locale } from '../i18n/routing';

type CopyEntry = { tag: string; en: string; pa: string };
type Section = { title?: string; strings?: CopyEntry[] } | CopyEntry[];

const content = raw as unknown as Record<string, Section>;

function strings(page: string): CopyEntry[] {
  const sec = content[page];
  if (!sec) throw new Error(`copy: no section "${page}"`);
  return Array.isArray(sec) ? sec : (sec.strings ?? []);
}

/** Find a copy entry by page + exact or prefix match on the English string. */
export function entry(page: string, en: string): CopyEntry {
  const list = strings(page);
  const strip = (s: string) => s.replace(/<[^>]+>/g, '');
  const loose = (s: string) => strip(s).replace(/^[^\p{L}\p{N}]+/u, '');
  const hit =
    list.find((e) => e.en === en) ??
    list.find((e) => e.en.startsWith(en)) ??
    list.find((e) => en.startsWith(e.en)) ??
    list.find((e) => strip(e.en) === en || strip(e.en).startsWith(en)) ??
    list.find((e) => loose(e.en) === en || loose(e.en).startsWith(en));
  if (!hit) throw new Error(`copy: "${en.slice(0, 60)}" not found in "${page}"`);
  return hit;
}

/** Localized copy for a page + English key. */
export function copy(page: string, en: string, locale: Locale): string {
  const e = entry(page, en);
  return locale === 'pa' ? e.pa : e.en;
}

/** All localized strings for a page section, in authored order. */
export function section(page: string, locale: Locale): CopyEntry[] {
  return strings(page).map((e) => (locale === 'pa' ? { ...e, en: e.en, pa: e.pa } : e));
}

export function pageTitle(page: string): string | undefined {
  const sec = content[page];
  return !Array.isArray(sec) ? sec?.title : undefined;
}

export type { CopyEntry };
