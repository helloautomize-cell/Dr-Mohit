import Image from 'next/image';
import { slot, type SlotId } from '@/lib/image-slots';
import type { Locale } from '@/i18n/routing';

// One photo per slot. When the slot has no file yet, renders the preview's
// dotted .aimg placeholder labelled with the planned filename.
export function ImageSlot({
  id,
  locale,
  className,
  caption,
  priority = false,
  fill = false,
}: {
  id: SlotId;
  locale: Locale;
  className?: string;
  caption?: string;
  priority?: boolean;
  fill?: boolean;
}) {
  const s = slot(id);
  const alt = locale === 'pa' ? s.alt.pa : s.alt.en;

  if (!s.src) {
    return (
      <div
        className={`aimg ${className ?? ''}`}
        style={s.ratio ? { ['--ar' as string]: s.ratio } : undefined}
        {...(caption ? { role: 'img', 'aria-label': caption } : {})}
      >
        <span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="10" r="1.6" />
            <path d="M3 17l5-4 4 3 4-4 5 5" />
          </svg>
          {s.note ? <code>{s.note}</code> : 'photo slot'}
          {caption ? <small>{caption}</small> : null}
        </span>
      </div>
    );
  }

  const img = fill ? (
    <Image
      src={s.src}
      alt={alt}
      fill
      sizes={s.sizes ?? '(max-width:900px) 92vw, 44vw'}
      style={{ objectFit: 'cover', objectPosition: s.focal }}
      priority={priority}
    />
  ) : (
    <Image
      src={s.src}
      alt={alt}
      width={1600}
      height={900}
      sizes={s.sizes ?? '(max-width:900px) 92vw, 44vw'}
      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: s.focal }}
      priority={priority}
    />
  );

  if (caption !== undefined) {
    return (
      <figure className={`rimg rv ${className ?? ''}`} style={{ margin: 0, ...(s.ratio ? { ['--ar' as string]: s.ratio } : {}) }}>
        {img}
        <figcaption>{caption}</figcaption>
      </figure>
    );
  }
  return (
    <div
      className={`im ${className ?? ''}`}
      style={
        fill
          ? undefined
          : s.ratio
            ? { aspectRatio: s.ratio, borderRadius: '24px' }
            : { borderRadius: '24px' }
      }
    >
      {img}
    </div>
  );
}
