// Ports resources/docs/prototype-styles.css into app/globals.css:
// Tailwind v4 import + @theme tokens + design-plan :root tokens (with legacy aliases),
// then the preview stylesheet verbatim (its own :root blocks stripped, fonts via next/font).
import { readFileSync, writeFileSync } from 'node:fs';

const src = readFileSync('resources/docs/prototype-styles.css', 'utf8');
// strip the two :root blocks (token values are re-declared below with plan names + aliases)
const body = src
  .replace(/\/\* Layout:[\s\S]*?color-scheme:light;\s*\}\n/, '')
  .replace(/:root\{--mint:[^}]*\}\n?/, '');

const header = `@import "tailwindcss";

/* Design tokens (design-development-plan section 1). Legacy preview names are
   aliases so the ported preview CSS keeps working unchanged. */
:root{
  --brand-500:#1D4E9E; --brand-700:#153C7C; --brand-100:#DCE7F7; --brand-50:#EEF3FB;
  --leaf-500:#1E9A4B; --leaf-100:#D3EEDC; --mint-50:#EAF6EF;
  --navy-900:#0F2A55; --teal-500:#0A8A80; --teal-50:#E4F3F1;
  --ink:#0D1520; --ink-600:#3D4652; --mute:#6A7380; --line:#E3E6EA;
  --bg:#FFFFFF; --bg-2:#F4F5F6; --bg-3:#ECEEF0;
  --night:#0D1520; --night-2:#16202E;
  --emergency:#C62828;
  --grad-brand:linear-gradient(90deg,#1D4E9E,#0A8A80); /* Book button + mobile bar only */
  --ease:cubic-bezier(.22,.8,.2,1);
  --radius-card:22px; --radius-lg:24px; --radius-pill:999px;
  --brand:var(--brand-500); --brand-ink:var(--brand-700); --leaf:var(--leaf-500);
  --sky:var(--brand-50); --mint:var(--mint-50); --navy:var(--navy-900);
  --teal:var(--teal-500); --brand-soft:var(--brand-100); --leaf-soft:var(--leaf-100);
  --f:var(--font-geist),"Helvetica Neue",Arial,system-ui,sans-serif;
  --f-mono:var(--font-geist-mono),ui-monospace,Menlo,monospace;
  --f-pa:var(--font-pa),"Noto Sans Gurmukhi","Geist",sans-serif;
  color-scheme:light;
}

@theme inline {
  --color-brand-500: var(--brand-500); --color-brand-700: var(--brand-700);
  --color-brand-100: var(--brand-100); --color-brand-50: var(--brand-50);
  --color-leaf-500: var(--leaf-500); --color-leaf-100: var(--leaf-100);
  --color-mint-50: var(--mint-50);
  --color-navy-900: var(--navy-900);
  --color-teal-500: var(--teal-500); --color-teal-50: var(--teal-50);
  --color-ink: var(--ink); --color-ink-600: var(--ink-600);
  --color-mute: var(--mute); --color-line: var(--line);
  --color-emergency: var(--emergency);
  --font-sans: var(--f); --font-mono: var(--f-mono); --font-pa: var(--f-pa);
  --ease-smooth: var(--ease);
  --radius-card: var(--radius-card); --radius-lg: var(--radius-lg);
  --radius-pill: var(--radius-pill);
}
`;

const additions = `
/* ---- Phase 1 additions (plan-required, not in preview css) ---- */
/* Book button: the one allowed gradient surface, plus mobile action bar */
.btn-book{background:var(--grad-brand);color:#fff}
.btn-book:hover{filter:brightness(1.06)}
@media (prefers-reduced-motion:reduce){.btn-book{transition:none}}

/* Styleguide-only helpers (.sg-*) */
.sg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:14px}
.sg-swatch{border:1px solid var(--line);border-radius:14px;overflow:hidden;background:#fff}
.sg-swatch .sw{height:64px}
.sg-swatch .inf{padding:10px 12px;font-family:var(--f-mono);font-size:.72rem;line-height:1.5}
.sg-swatch .inf b{display:block;font-weight:500}
.sg-table{width:100%;border-collapse:collapse;font-size:.85rem}
.sg-table th,.sg-table td{padding:10px 14px;border-bottom:1px solid var(--line);text-align:left}
.sg-table th{font-family:var(--f-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);font-weight:500}
.sg-table td.pass{color:var(--leaf);font-weight:500}
.sg-table td.fail{color:var(--emergency);font-weight:500}
.sg-chip{display:inline-block;padding:3px 10px;border-radius:999px;background:var(--bg-2);font-family:var(--f-mono);font-size:.72rem;color:var(--ink-2);margin:2px 4px 2px 0}
.sg-frame{width:390px;max-width:100%;border:1px solid var(--line);border-radius:28px;overflow:hidden;position:relative;margin:0 auto;background:#fff}
.sg-frame .frame-body{height:520px;position:relative;overflow:hidden}
.sg-frame .mbar{position:absolute;left:0;right:0;bottom:0}
.sg-note{font-size:.8rem;color:var(--mute);margin-top:10px}
.sg-spec{font-family:var(--f-mono);font-size:.72rem;color:var(--mute);margin-top:8px}
.sg-type div{padding:14px 0;border-bottom:1px solid var(--line)}
.sg-type .tag{font-family:var(--f-mono);font-size:.7rem;color:var(--mute);display:block;margin-bottom:4px}
`;

writeFileSync('app/globals.css', header + body + additions);
console.log('wrote app/globals.css (' + (header + body + additions).split('\n').length + ' lines)');
