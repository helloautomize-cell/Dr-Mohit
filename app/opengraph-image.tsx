// Generated OpenGraph card (1200x630) — flat brand styling, no photo assets.
// Served at /opengraph-image and picked up by every page's og:image unless a
// route adds its own.
import { ImageResponse } from 'next/og';

export const alt = 'Gupta Hospital Bathinda: bone, eye and mental health care';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#EEF3FB',
          padding: 64,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: '#1D4E9E',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            G
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 34, fontWeight: 800, color: '#0F2A55', letterSpacing: 1 }}>
              GUPTA HOSPITAL
            </span>
            <span style={{ fontSize: 20, color: '#3D4652', letterSpacing: 4 }}>
              BATHINDA · SINCE 1980
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <span style={{ fontSize: 64, fontWeight: 800, color: '#0D1520', lineHeight: 1.05, maxWidth: 900 }}>
            Bone, eye and mental health care.
          </span>
          <span style={{ fontSize: 28, color: '#3D4652', maxWidth: 860 }}>
            One family of doctors on Power House Road for over four decades.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 14 }}>
            {['Orthopaedics', 'Eye care', 'Mental health'].map((d) => (
              <span
                key={d}
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#0F2A55',
                  background: '#fff',
                  border: '2px solid #C7D4EA',
                  borderRadius: 999,
                  padding: '10px 24px',
                }}
              >
                {d}
              </span>
            ))}
          </div>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#1D4E9E' }}>
            +91 98787 52241
          </span>
        </div>
      </div>
    ),
    size,
  );
}
