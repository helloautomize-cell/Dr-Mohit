import type { ReactNode } from 'react';

// Ported from resources/reference/new-home-icons.svg — one small component per icon.

const PATHS = {
  'i-arrow': <path d="M5 12h14M13 6l6 6-6 6" />,
  'i-ne': <path d="M7 17 17 7M8 7h9v9" />,
  'i-bone': (
    <path d="M8.6 5.4a2.4 2.4 0 1 0-3.4 3.2 2.4 2.4 0 1 0 .3 3.2l6.7 6.7a2.4 2.4 0 1 0 3.2.3 2.4 2.4 0 1 0 3.2-3.4 2.4 2.4 0 1 0-.3-3.2L11.6 5.5a2.4 2.4 0 1 0-3-.1z" />
  ),
  'i-eye': (
    <>
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 10.4a1.6 1.6 0 0 1 1.6 1.6" />
    </>
  ),
  'i-mind': (
    <>
      <path d="M9.5 21v-3H7a1.5 1.5 0 0 1-1.5-1.5V14l-2-.7 2-3.3A7 7 0 0 1 19.5 9.6c0 2.4-1 4-2.5 5.3V21" />
      <path d="M11.4 12.6c0-2.1 1.3-3.4 3.6-3.6-.1 2.3-1.4 3.6-3.6 3.6zm0 0v2" />
    </>
  ),
  'i-theatre': (
    <>
      <path d="M4 9.5h16l-2.6 4.2H6.6z" />
      <path d="M12 3.5v6M8 20h8M12 13.7V20" />
    </>
  ),
  'i-monitor': (
    <>
      <rect x="3" y="4.5" width="18" height="12.5" rx="2.2" />
      <path d="M6 11h3l1.5-3 3 6 1.5-3h3M9 20.5h6" />
    </>
  ),
  'i-drop': (
    <>
      <path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z" />
      <path d="M12 11.5v5M9.5 14h5" />
    </>
  ),
  'i-xray': (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2.4" />
      <path d="M12 6v12M9 8.5h6M8.5 11.5h7M9 14.5h6" />
    </>
  ),
  'i-flask': (
    <>
      <path d="M9 3h6M10 3v6.2L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-8.8V3" />
      <path d="M7.4 15h9.2" />
    </>
  ),
  'i-pill': (
    <>
      <path d="M10.5 20.5a5 5 0 0 1-7-7l6-6a5 5 0 0 1 7 7z" />
      <path d="M8.5 8.5l7 7" />
    </>
  ),
  'i-physio': <path d="M3 10v4M6 7.5v9M18 7.5v9M21 10v4M6 12h12" />,
  'i-bed': (
    <>
      <path d="M3 18.5V6.5M3 14h18v4.5M21 14v-2a3 3 0 0 0-3-3h-7v5" />
      <circle cx="7" cy="11" r="1.7" />
    </>
  ),
  'i-phone': (
    <path d="M5 4h4l1.6 4-2.3 1.5a11 11 0 0 0 6.2 6.2L16 13.4l4 1.6v4a2 2 0 0 1-2.2 2A16 16 0 0 1 3 6.2 2 2 0 0 1 5 4z" />
  ),
  'i-chat': (
    <>
      <path d="M20 11.5a8 8 0 0 1-11.7 7.1L4 20l1.4-4A8 8 0 1 1 20 11.5z" />
      <path d="M9 10.5h6M9 13.5h4" />
    </>
  ),
  'i-pin': (
    <>
      <path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.6" />
    </>
  ),
  'i-shield': (
    <>
      <path d="M12 3l7.5 3v5.6c0 4.4-3.1 8.2-7.5 9.4-4.4-1.2-7.5-5-7.5-9.4V6z" />
      <path d="M8.8 12.2l2.3 2.3 4.2-4.3" />
    </>
  ),
  'i-award': (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.6 13.4 7 21l5-2.6 5 2.6-1.6-7.6" />
      <path d="M12 6.5l.8 1.6 1.7.2-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.2z" />
    </>
  ),
  'i-robot': (
    <>
      <path d="M4 20h8M7 20v-3.5l4.5-4.5M11.5 12l3.5-3.5M15 8.5l1.5-4 3.5 1.5-1.5 4z" />
      <circle cx="11.5" cy="12" r="1.6" />
      <circle cx="7" cy="16.5" r="1.6" />
    </>
  ),
  'i-listen': (
    <>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4h0A2.5 2.5 0 0 1 4 13.5z" />
      <path d="M8.5 9h7M8.5 12h4.5" />
    </>
  ),
  'i-steth': (
    <>
      <path d="M6 3.5v5a4 4 0 0 0 8 0v-5" />
      <path d="M10 12.5V15a5 5 0 0 0 10 0v-1.5" />
      <circle cx="20" cy="11.5" r="2" />
    </>
  ),
  'i-plan': (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2.4" />
      <path d="M9 4V3h6v1M8.5 11l2 2 4-4M8.5 16.5h7" />
    </>
  ),
  'i-heart': (
    <>
      <path d="M12 20s-7.5-4.5-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.5-7.5 10-7.5 10z" />
      <path d="M8 12h2.5l1-2 2 4 1-2H16" />
    </>
  ),
  'i-plus': <path d="M12 5v14M5 12h14" />,
  'i-mail': (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.4" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type V2IconName = keyof typeof PATHS;

export function V2Icon({
  name,
  className,
  style,
}: {
  name: V2IconName;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className ?? 'v2-ic'}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={style}
    >
      {PATHS[name]}
    </svg>
  );
}
