// Typed access to resources/content/site-content.en-pa.json (the copy source of
// truth). Entries are ordered {tag,en,pa} items per page section. Look up by the
// English string (or its prefix) so markup stays searchable; throws on misses in
// dev so a content drift is caught at build time, never silently.
import raw from '../resources/content/site-content.en-pa.json';
import orthoRaw from '../resources/content/ortho-subpages.en-pa.json';
import type { Locale } from '../i18n/routing';

type CopyEntry = { tag: string; en: string; pa: string };
type Section = { title?: string; strings?: CopyEntry[] } | CopyEntry[];

const content = raw as unknown as Record<string, Section>;

// Orthopaedics sub-pages (v14 kit). Same {en,pa} entries but keyed by route
// path and without tags; merged under the route key so copy() works unchanged.
// The overview "Explore by treatment" section gets the short alias
// 'ortho-explore' for readability in page components.
const ortho = orthoRaw as unknown as Record<string, { en: string; pa: string }[] | string>;
for (const [k, v] of Object.entries(ortho)) {
  if (!Array.isArray(v)) continue; // skip _note
  const key = k.includes('Explore by treatment') ? 'ortho-explore' : k;
  content[key] = v.map((e) => ({ tag: 'x', ...e })) as CopyEntry[];
}

/** Page keys for the ortho sub-pages content file. */
export const ORTHO_SUBPAGES = {
  kneeHip: '/orthopaedics/knee-and-hip-replacement/',
  fractures: '/orthopaedics/fractures-and-trauma/',
  sports: '/orthopaedics/arthroscopy-and-sports-injuries/',
  backPain: '/orthopaedics/back-pain-clinic/',
  explore: 'ortho-explore',
} as const;

// Strings in the JSON use HTML entities (&amp; etc.). Plain JSX render paths
// show them literally, so decode here; markup strings still go through
// RichText which decodes again harmlessly. &lt;/&gt; stay encoded so they can
// never form fake tags.
const decode = (s: string) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');

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
  return decode(locale === 'pa' ? e.pa : e.en);
}

/** All localized strings for a page section, in authored order. */
export function section(page: string, locale: Locale): CopyEntry[] {
  void locale;
  return strings(page).map((e) => ({ ...e, en: decode(e.en), pa: decode(e.pa) }));
}

export function pageTitle(page: string): string | undefined {
  const sec = content[page];
  return !Array.isArray(sec) ? sec?.title : undefined;
}

/** Exact-match label across all ortho-subpages strings (nav + breadcrumbs). */
export function orthoLabel(en: string, locale: Locale): string | undefined {
  for (const list of Object.values(ortho)) {
    if (!Array.isArray(list)) continue;
    const hit = list.find((e) => e.en === en);
    if (hit) return decode(locale === 'pa' ? hit.pa : hit.en);
  }
  return undefined;
}

export type { CopyEntry };
