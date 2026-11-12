import type { ReactNode } from 'react';
import { RichText } from './RichText';

// Eyebrow label (mono, uppercase, with the green-dot treatment handled in CSS? -
// preview uses plain .label text; keep as-is).
export function Label({ children }: { children: ReactNode }) {
  return <span className="label">{children}</span>;
}

export function LabelText({ text }: { text: string }) {
  return (
    <span className="label">
      <RichText text={text} />
    </span>
  );
}

// Copy strings may contain <span class="em"> markup; use these to render it.
export function H1({ text, className }: { text: string; className?: string }) {
  return (
    <h1 className={className}>
      <RichText text={text} />
    </h1>
  );
}

export function H2({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  return (
    <h2 className={className} style={style}>
      <RichText text={text} />
    </h2>
  );
}

export function H3({ text }: { text: string }) {
  return (
    <h3>
      <RichText text={text} />
    </h3>
  );
}

export function P({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  return (
    <p className={className} style={style}>
      <RichText text={text} />
    </p>
  );
}

export function Lede({ text, className }: { text: string; className?: string }) {
  return (
    <p className={`lede ${className ?? ''}`}>
      <RichText text={text} />
    </p>
  );
}

// Count-up number. SSR renders the final value; SiteEffects animates 0->n when
// it scrolls into view (below-fold only).
export function CountUp({ n, className }: { n: number; className?: string }) {
  return (
    <b data-count={n} className={className}>
      {n}
    </b>
  );
}
