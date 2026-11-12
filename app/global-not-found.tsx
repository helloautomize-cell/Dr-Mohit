// Root-level 404 (outside [locale] tree): minimal branded fallback.
import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en-IN">
      <body style={{ fontFamily: 'system-ui, sans-serif', display: 'grid', placeItems: 'center', minHeight: '100vh', margin: 0 }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontWeight: 300 }}>Page not found</h1>
          <p style={{ color: '#6A7380' }}>Gupta Hospital, Bathinda</p>
          <Link href="/" style={{ color: '#1D4E9E' }}>Back to home</Link>
        </div>
      </body>
    </html>
  );
}
