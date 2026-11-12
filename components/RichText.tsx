import type { ReactNode } from 'react';

// Renders the small markup subset used in site-content.en-pa.json
// (<span class="em|em-g">, <b>, <i>, entities) as React nodes, never raw HTML.
const TAG_RE = /<(span|b|i|small)(?:\s+class="(em|em-g|tag)")?>([\s\S]*?)<\/\1>/;

function decode(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

export function rich(text: string, keyBase = 0): ReactNode {
  const m = TAG_RE.exec(text);
  if (!m) return decode(text);
  const tag = m[1] ?? '';
  const cls = m[2];
  const inner = m[3] ?? '';
  const before = text.slice(0, m.index);
  const after = text.slice(m.index + m[0].length);
  const node =
    tag === 'b' ? (
      <b key={m.index}>{rich(inner, 1)}</b>
    ) : tag === 'i' ? (
      <i key={m.index}>{rich(inner, 1)}</i>
    ) : tag === 'small' ? (
      <small key={m.index}>{rich(inner, 1)}</small>
    ) : (
      <span key={m.index} className={cls}>
        {rich(inner, 1)}
      </span>
    );
  return (
    <>
      {before ? decode(before) : null}
      {node}
      {after ? rich(after, keyBase + 2) : null}
    </>
  );
}

export function RichText({ text }: { text: string }) {
  return <>{rich(text)}</>;
}

/** Plain-text form (metadata, aria labels). */
export function plain(text: string): string {
  return decode(text.replace(/<[^>]+>/g, ''));
}
