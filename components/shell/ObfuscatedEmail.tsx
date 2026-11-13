'use client';

// Email kept out of source: assembled at click time. Client island — the
// footer itself stays a server component.
import { SITE } from '@/lib/site-config';

export default function ObfuscatedEmail({ label }: { label: string }) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        const [u, d] = SITE.email.split('@');
        window.location.href = `mailto:${u}@${d}`;
      }}
    >
      {label}
    </a>
  );
}
