'use client';

// Breadcrumbs on inner pages (phase-02 item 7). The trail is shared with the
// BreadcrumbList JSON-LD each page emits server-side (lib/crumbTrail +
// lib/seo breadcrumbLd), so labels can never drift between UI and schema.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { crumbTrail } from '@/lib/crumbs';

export default function Breadcrumbs() {
  const l = useLocale() as Locale;
  const pathname = usePathname() ?? '/';
  const segs = pathname.replace(/^\/(en|pa)(?=\/|$)/, '').split('/').filter(Boolean);

  if (segs.length === 0 || pathname.includes('styleguide')) return null;

  const items = crumbTrail(pathname, l);

  return (
    <nav className="bcrumb wrap" aria-label="Breadcrumb">
      <ol>
        {items.map((it, i) => (
          <li key={it.href}>
            {i < items.length - 1 ? <Link href={it.href}>{it.name}</Link> : <span>{it.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
