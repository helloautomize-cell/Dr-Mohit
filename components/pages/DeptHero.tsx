// Department page hero — the preview's .ph.ph-c: breadcrumb column (the global
// shell already renders breadcrumbs), h1 + lede, per-page CTAs and the doctor/
// system photo on the right. Ortho wraps its image in .hero-wrap for the
// decorative blobs; the other three pages use a bare .im frame.
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { copy } from '@/lib/copy';
import { bookingHref, type BookingContext } from '@/lib/booking-context';
import { slot, type SlotId } from '@/lib/image-slots';
import type { Locale } from '@/i18n/routing';
import { RichText } from '../RichText';
import { ImageSlot } from '../ImageSlot';
import { SITE } from '@/lib/site-config';
import type { ReactNode } from 'react';

export function DeptHero({
  page,
  locale,
  h1Key,
  ledeKey,
  image,
  align = 'center',
  wrapped = false,
  fitViewport = false,
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
  fitViewport?: boolean;
  imStyle?: React.CSSProperties;
  ctas?: ReactNode;
  extra?: ReactNode;
}) {
  const c = (en: string) => copy(page, en, locale);
  const s = slot(image);
  const img = s.src ? (
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
  ) : (
    // Photo not supplied yet — the .aimg placeholder carries the slot code
    // and alt text exactly like the preview's data-img frame.
    <ImageSlot id={image} locale={locale} className="rv" caption={locale === 'pa' ? s.alt.pa : s.alt.en} />
  );
  return (
    <section className={`ph ph-c${fitViewport ? ' dept-hero-fit' : ''}`}>
      <div className="wrap g12" style={{ alignItems: align }}>
        <div className="c-7">
          <h1>
            <RichText text={c(h1Key)} />
          </h1>
          <p className="lede">{c(ledeKey)}</p>
          {extra}
          {ctas ? <div className="ctas">{ctas}</div> : null}
        </div>
        <div className="c-5">{wrapped ? <div className="hero-wrap">{img}</div> : img}</div>
      </div>
    </section>
  );
}

export function DeptBookCta({ page, locale, label, dept, doctor }: { page: string; locale: Locale; label: string; dept: string; doctor?: BookingContext['doctor'] }) {
  return (
    <Link className="btn btn-brand" href={bookingHref({ dept, doctor })} locale={locale}>
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
