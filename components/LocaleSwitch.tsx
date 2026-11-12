'use client';

// Language switch that keeps the current path (/styleguide <-> /pa/styleguide).
import { Link, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

export default function LocaleSwitch() {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <div className="lang" role="group" aria-label="Language">
      <Link href={pathname} locale="en" aria-current={locale === 'en' ? 'true' : undefined}>
        EN
      </Link>
      <Link
        href={pathname}
        locale="pa"
        className="pa"
        aria-current={locale === 'pa' ? 'true' : undefined}
      >
        ਪੰਜਾਬੀ
      </Link>
    </div>
  );
}
