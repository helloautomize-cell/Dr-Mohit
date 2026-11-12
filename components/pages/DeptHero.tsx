// Department page hero — the preview's .ph.ph-c: breadcrumb column (the global
// shell already renders breadcrumbs), h1 + lede, per-page CTAs and the doctor/
// system photo on the right. Ortho wraps its image in .hero-wrap for the
// decorative blobs; the other three pages use a bare .im frame.
import Image from 'next/image';
import Link from 'next/link';
import { copy } from '@/lib/copy';
import { slot, type SlotId } from '@/lib/image-slots';
import type { Locale } from '@/i18n/routing';
import { RichText } from '../RichText';
import { SITE } from '@/lib/site-config';
import type { ReactNode } from 'react';

export function DeptHero({
  page,
  locale,
  h1Key,
  ledeKey,
  image,
  align = 'end',
  wrapped = false,
  imStyle,
  ctas,
  extra,
}: {
  page: string;
  locale: Locale;
  h1Key: string;
  ledeKey: string;
  image: SlotId;
  align?: 'center' | 'end';
  wrapped?: boolean;
  imStyle?: React.CSSProperties;
  ctas?: ReactNode;
  extra?: ReactNode;
}) {
  const c = (en: string) => copy(page, en, locale);
  const s = slot(image);
  const img = (
    <div className="im" style={{ aspectRatio: s.ratio, ...imStyle }}>
      <Image
        src={s.src!}
        alt={locale === 'pa' ? s.alt.pa : s.alt.en}
        width={1200}
        height={1290}
        priority
        sizes={s.sizes ?? '(max-width:900px) 92vw, 42vw'}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: s.focal }}
      />
    </div>
  );
  return (
    <section className="ph ph-c">
      <div className="wrap g12" style={{ alignItems: align }}>
        <div className="c-7">
          <h1>
            <RichText text={c(h1Key)} />
          </h1>
          <p className="lede">{c(ledeKey)}</p>
          {extra}
          {ctas ? <div className="ctas" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 36 }}>{ctas}</div> : null}
        </div>
        <div className="c-5">{wrapped ? <div className="hero-wrap">{img}</div> : img}</div>
      </div>
    </section>
  );
}

export function DeptBookCta({ page, locale, label, dept }: { page: string; locale: Locale; label: string; dept: string }) {
  return (
    <Link className="btn btn-brand" href={`/contact/?dept=${encodeURIComponent(dept)}`}>
      <span>{copy(page, label, locale)}</span>
      <span className="ar">→</span>
    </Link>
  );
}

export function DeptPhoneCta({ href = SITE.phoneMainHref, children }: { href?: string; children?: ReactNode }) {
  return (
    <a className="btn btn-line" style={{ background: '#fff', boxShadow: 'none' }} href={href}>
      {children ?? SITE.phoneMain}
    </a>
  );
}
