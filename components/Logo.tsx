import Image from 'next/image';
import type { Locale } from '@/i18n/routing';

// Real hospital logo (trimmed master produced by scripts/process-images.mjs).
export function Logo({ locale, height = 42 }: { locale: Locale; height?: number }) {
  const alt = locale === 'pa' ? 'ਗੁਪਤਾ ਹਸਪਤਾਲ ਬਠਿੰਡਾ' : 'Gupta Hospital Bathinda';
  return (
    <Image
      src="/images/brand/logo.png"
      alt={alt}
      width={1600}
      height={580}
      style={{ height, width: 'auto', display: 'block' }}
      priority
    />
  );
}
