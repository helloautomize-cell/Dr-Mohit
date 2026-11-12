// ContentStream: walks a page's ordered {tag,en,pa} string stream (the copy
// source of truth) and emits grouped sections — h2 opens a new section,
// h3+following text becomes cards, li runs become check lists, span/text
// clusters become chips, dt/dd become definition rows. All copy lands in
// initial HTML (phase-03 item 4).
import Link from 'next/link';
import type { Locale } from '@/i18n/routing';
import { section, type CopyEntry } from '@/lib/copy';
import { RichText } from '@/components/RichText';
import { ConfirmChip } from '@/components/Confirm';

type Block =
  | { kind: 'p'; text: string }
  | { kind: 'card'; title: string; body: string[] }
  | { kind: 'chips'; items: string[] }
  | { kind: 'list'; items: string[] }
  | { kind: 'cta'; label: string }
  | { kind: 'defs'; rows: { t: string; d: string }[] }
  | { kind: 'note'; text: string };

interface Section {
  h2: string | null; // null = hero-zone content before first h2
  h2en?: string; // English source text, for injectAfter matching
  eyebrow?: string;
  blocks: Block[];
}

const CONFIRM_MARK = /\[CONFIRM[^\]]*\]/;

function group(src: CopyEntry[], l: Locale, ledeText?: string): Section[] {
  const secs: Section[] = [{ h2: null, blocks: [] }];
  let chips: string[] = [];
  let lis: string[] = [];

  const flush = () => {
    const cur = secs.at(-1);
    if (!cur) return;
    if (chips.length) { cur.blocks.push({ kind: 'chips', items: chips }); chips = []; }
    if (lis.length) { cur.blocks.push({ kind: 'list', items: lis }); lis = []; }
  };

  const loc = (e: CopyEntry) => (l === 'pa' ? e.pa : e.en);
  let i = 0;
  // The page scaffold already renders the breadcrumb (first 'a' + 'span' pair),
  // the h1 and the lede — skip exactly those, keep the rest of the hero zone.
  const skipIdx = new Set<number>();
  if (src[0]?.tag === 'a') skipIdx.add(0);
  if (src[1]?.tag === 'span') skipIdx.add(1);
  let seenH1 = false;
  while (i < src.length) {
    if (skipIdx.has(i)) { i++; continue; }
    const s = src[i]!;
    const v = loc(s);
    switch (s.tag) {
      case 'h1':
        flush();
        // First h1 is rendered by the page hero; a later one stays as lead text.
        if (seenH1) secs.at(-1)!.blocks.push({ kind: 'p', text: `**${v}**` });
        seenH1 = true;
        break;
      case 'h2': {
        // A lone short label right before an h2 is that section's eyebrow —
        // keep it with the new section, not the previous one.
        const lone = chips.length === 1 && (chips[0]?.length ?? 99) < 44 ? chips[0]! : null;
        if (lone) chips = [];
        flush();
        secs.push({ h2: v, h2en: s.en, eyebrow: lone ?? undefined, blocks: [] });
        break;
      }
      case 'h3': {
        flush();
        const body: string[] = [];
        let j = i + 1;
        while (j < src.length && !['h1', 'h2', 'h3'].includes(src[j]!.tag)) {
          if (['p', 'small', 'text', 'b', 'li', 'span', 'div', 'figcaption', 'dd'].includes(src[j]!.tag)) {
            body.push(loc(src[j]!));
          }
          j++;
        }
        secs.at(-1)!.blocks.push({ kind: 'card', title: v, body });
        i = j - 1;
        break;
      }
      case 'p':
        flush();
        if (v !== ledeText) secs.at(-1)!.blocks.push({ kind: 'p', text: v });
        break;
      case 'b': flush(); secs.at(-1)!.blocks.push({ kind: 'p', text: `<b>${v}</b>` }); break;
      case 'small': case 'figcaption': flush(); secs.at(-1)!.blocks.push({ kind: 'note', text: v }); break;
      case 'li': lis.push(v); break;
      case 'span': case 'text': case 'div': chips.push(v); break;
      case 'button': case 'a': flush(); secs.at(-1)!.blocks.push({ kind: 'cta', label: v }); break;
      case 'dt': {
        flush();
        const d = src[i + 1]?.tag === 'dd' ? loc(src[++i]!) : '';
        secs.at(-1)!.blocks.push({ kind: 'defs', rows: [{ t: v, d }] });
        break;
      }
      default: flush(); secs.at(-1)!.blocks.push({ kind: 'p', text: v });
    }
    i++;
  }
  flush();
  return secs;
}

// Band flavour per page + section index (prototype colouring; white default).
const BANDS: Record<string, Record<number, string>> = {
  home: { 2: 'sky', 4: 'brand', 8: 'mint', 12: 'navy' },
  orthopaedics: { 3: 'mint' },
  'eye-care': { 4: 'sky' },
  'mental-health': { 3: 'navy' },
};

export function ContentStream({
  page,
  locale: l,
  ledeText,
  injectAfter,
}: {
  page: string;
  locale: Locale;
  /** The lede string the hero already renders — skipped in the stream. */
  ledeText?: string;
  /** Render a node right after the section whose h2 contains this string. */
  injectAfter?: { h2: string; node: React.ReactNode };
}) {
  const secs = group(section(page, l), l, ledeText);
  const bands = BANDS[page] ?? {};
  return (
    <div className="cstream">
      {secs.map((sec, si) => {
        if (sec.h2 === null && sec.blocks.length === 0) return null;
        const band = sec.h2 === null ? 'hero-zone' : (bands[si] ? ` band-${bands[si]}` : '');
        const inj = injectAfter && sec.h2en?.includes(injectAfter.h2) ? injectAfter.node : null;
        return (
          <section className={`csec${band}`} key={si}>
            <div className="wrap" style={{ paddingBlock: sec.h2 ? '44px 24px' : 0 }}>
              {sec.eyebrow && (
                <p className="label" style={{ marginBottom: 12 }}>
                  <RichText text={sec.eyebrow} />
                </p>
              )}
              {sec.h2 && (
                <h2 className="h2" style={{ marginBottom: 22 }}>
                  <RichText text={sec.h2} />
                </h2>
              )}
              <div className="cbody">{sec.blocks.map((b, i) => render(b, i))}</div>
              {inj}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function render(b: Block, i: number): React.ReactNode {
  switch (b.kind) {
    case 'p':
      return <p className="body-p" key={i}><RichText text={b.text} /></p>;
    case 'card':
      return (
        <div className="ccard" key={i}>
          <h3 className="h3"><RichText text={b.title} /></h3>
          {b.body.map((t, j) => (
            <p key={j} className="body-p"><RichText text={t} /></p>
          ))}
        </div>
      );
    case 'chips':
      return (
        <div className="chips" key={i}>
          {b.items.map((t, j) => {
            const confirm = CONFIRM_MARK.test(t);
            return (
              <span key={j} className="chip">
                <RichText text={t.replace(CONFIRM_MARK, '')} />
                {confirm && <ConfirmChip />}
              </span>
            );
          })}
        </div>
      );
    case 'list':
      return (
        <ul className="cklist" key={i}>
          {b.items.map((t, j) => (
            <li key={j}><RichText text={t} /></li>
          ))}
        </ul>
      );
    case 'cta':
      return (
        <Link key={i} className="btn btn-line" href="/contact/">
          <RichText text={b.label} />
        </Link>
      );
    case 'defs':
      return (
        <dl className="defs" key={i}>
          {b.rows.map((r, j) => (
            <div key={j} className="defrow">
              <dt><RichText text={r.t} /></dt>
              {r.d ? <dd><RichText text={r.d} /></dd> : null}
            </div>
          ))}
        </dl>
      );
    case 'note':
      return <p key={i} className="note muted"><RichText text={b.text} /></p>;
  }
}
