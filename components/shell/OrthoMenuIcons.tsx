// Orthopaedics dropdown glyphs — one 24x24 stroke icon per ORTHO_MENU key.
// Shared by the desktop NavigationMenu grid and the mobile accordion so both
// renders stay in step; stroke inherits currentColor (hover -> brand blue).
const S = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Ico({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

export function OrthoMenuIcon({ k }: { k: string }) {
  switch (k) {
    case 'Orthopaedics overview':
      return (
        <Ico>
          <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" {...S} />
          <path d="M12 8.5v7M8.5 12h7" {...S} />
        </Ico>
      );
    case 'Robotic knee replacement':
      return (
        <Ico>
          <rect x="9" y="9" width="6" height="6" rx="1.5" {...S} />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3" {...S} />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" />
        </Ico>
      );
    case 'Knee and hip replacement':
      return (
        <Ico>
          <path d="M10 3v6.5M14 3v7" {...S} />
          <circle cx="12" cy="13" r="3" {...S} />
          <path d="M10.5 15.5V21M13.5 15.5V21" {...S} />
        </Ico>
      );
    case 'Fractures and trauma':
      return (
        <Ico>
          <path d="M7 5l4 3-3 3 4 3-3 5M17 5l-2 3 2 3-2 3 1 5" {...S} />
          <path d="M14.5 8.5l1.5 2-2 1.5 2 2.5" {...S} />
        </Ico>
      );
    case 'Arthroscopy and sports injuries':
      return (
        <Ico>
          <circle cx="12" cy="12" r="8" {...S} />
          <path d="M12 4v4M12 16v4M4 12h4M16 12h4M7.5 7.5l2.5 2.5M14 14l2.5 2.5" {...S} />
        </Ico>
      );
    case 'Back pain clinic':
      return (
        <Ico>
          <path d="M12 3c-1.5 2 1.5 3 0 5s-1.5 3 0 5-1.5 3 0 5 1.5 1 0 3" {...S} />
          <circle cx="12" cy="7" r="1.3" fill="currentColor" />
          <circle cx="12" cy="12" r="1.3" fill="currentColor" />
          <circle cx="12" cy="17" r="1.3" fill="currentColor" />
        </Ico>
      );
    default:
      return (
        <Ico>
          <path d="M12 8.5v7M8.5 12h7" {...S} />
        </Ico>
      );
  }
}

// Treatment-row glyphs (dept panel link lists). Ortho rows reuse the menu
// glyphs above so dropdown and panel reads stay identical.
export function TxIcon({ ic }: { ic: string }) {
  switch (ic) {
    case 'Robotic knee replacement':
    case 'Knee and hip replacement':
    case 'Fractures and trauma':
    case 'Back pain clinic':
      return <OrthoMenuIcon k={ic} />;
    case 'cataract':
      return (
        <Ico>
          <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" {...S} />
          <circle cx="12" cy="12" r="3" {...S} />
          <path d="M10.5 10.5l3 3" {...S} />
        </Ico>
      );
    case 'diabetic':
      return (
        <Ico>
          <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" {...S} />
          <path d="M12 9c1 1.6 1.6 2.6 0 4-1.6-1.4-1-2.4 0-4z" {...S} />
        </Ico>
      );
    case 'glaucoma':
      return (
        <Ico>
          <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" {...S} />
          <circle cx="12" cy="12" r="3" {...S} />
          <path d="M12 9.5V12l1.5 1.5" {...S} />
        </Ico>
      );
    case 'children':
      return (
        <Ico>
          <circle cx="12" cy="8" r="3" {...S} />
          <path d="M5.5 20c1.5-3.5 4-5 6.5-5s5 1.5 6.5 5" {...S} />
          <path d="M10 8h.01M14 8h.01" {...S} />
        </Ico>
      );
    case 'depression':
      return (
        <Ico>
          <path d="M7 15a4 4 0 1 1 .6-7.9A5 5 0 0 1 17 8.5a3.5 3.5 0 0 1-.5 6.9z" {...S} />
          <path d="M12 12.5c-.8-1-2-1-2.4-.2-.4.9.4 1.8 2.4 3 2-1.2 2.4-2.1 2-3-.4-.8-1.6-.8-2 0z" fill="currentColor" />
        </Ico>
      );
    case 'deaddiction':
      return (
        <Ico>
          <path d="M10 8H8a3 3 0 0 0 0 6h2M14 8h2a3 3 0 0 1 0 6h-2" {...S} />
          <path d="M8 12h8" {...S} />
          <path d="M5 5l14 14" {...S} />
        </Ico>
      );
    case 'sleep':
      return (
        <Ico>
          <path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z" {...S} />
          <path d="M16 4l.7 1.8L18.5 6.5l-1.8.7L16 9l-.7-1.8L13.5 6.5l1.8-.7z" fill="currentColor" />
        </Ico>
      );
    case 'family':
      return (
        <Ico>
          <circle cx="8.5" cy="8" r="2.6" {...S} />
          <circle cx="15.5" cy="8" r="2.6" {...S} />
          <path d="M4 19c.8-3 2.6-4.4 4.5-4.4s3.7 1.4 4.5 4.4M11.6 15.6c1-1 2.4-1.5 3.9-1.5 1.9 0 3.7 1.4 4.5 4.4" {...S} />
        </Ico>
      );
    default:
      return (
        <Ico>
          <path d="M12 8.5v7M8.5 12h7" {...S} />
        </Ico>
      );
  }
}
