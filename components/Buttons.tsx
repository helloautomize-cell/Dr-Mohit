import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

type AnchorProps = ComponentProps<'a'> & { href: string };

function Arrow() {
  return (
    <span className="ar" aria-hidden="true">
      →
    </span>
  );
}

// The single gradient surface allowed by the design plan (Book button only).
export function BookButton({ children, href, className, ...rest }: AnchorProps & { children: ReactNode }) {
  return (
    <a href={href} className={`btn btn-book ${className ?? ''}`} {...rest}>
      {children}
      <Arrow />
    </a>
  );
}

export function BtnBrand({ children, href, className, ...rest }: AnchorProps & { children: ReactNode }) {
  return (
    <a href={href} className={`btn btn-brand ${className ?? ''}`} {...rest}>
      {children}
      <Arrow />
    </a>
  );
}

export function BtnInk({ children, href, className, ...rest }: AnchorProps & { children: ReactNode }) {
  return (
    <a href={href} className={`btn btn-ink ${className ?? ''}`} {...rest}>
      {children}
      <Arrow />
    </a>
  );
}

export function BtnLine({ children, href, className, ...rest }: AnchorProps & { children: ReactNode }) {
  return (
    <a href={href} className={`btn btn-line ${className ?? ''}`} {...rest}>
      {children}
      <Arrow />
    </a>
  );
}

export function BtnWLine({ children, href, className, ...rest }: AnchorProps & { children: ReactNode }) {
  return (
    <a href={href} className={`btn btn-wline ${className ?? ''}`} {...rest}>
      {children}
      <Arrow />
    </a>
  );
}

// Arrow link (underline, sliding arrow).
export function Lnk({ children, href, className, internal = false, ...rest }: AnchorProps & { children: ReactNode; internal?: boolean }) {
  if (internal) {
    return (
      <Link href={href} className={`lnk ${className ?? ''}`}>
        {children}
        <Arrow />
      </Link>
    );
  }
  return (
    <a href={href} className={`lnk ${className ?? ''}`} {...rest}>
      {children}
      <Arrow />
    </a>
  );
}
