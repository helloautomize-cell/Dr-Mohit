'use client';

// Click-to-load Google Maps facade: renders a static placeholder until the
// user asks for the map, so no third-party request fires on page load.
import { useState } from 'react';
import { SITE } from '@/lib/site-config';
import { LIcon } from './icons';

export function MapFacade({ showLabel, title }: { showLabel: string; title: string }) {
  const [load, setLoad] = useState(false);
  if (load) {
    return (
      <iframe
        className="mapbox"
        title={title}
        src={`https://www.google.com/maps?q=${encodeURIComponent(
          'Gupta Hospital Power House Road Bathinda Punjab 151001',
        )}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }
  return (
    <button type="button" className="mapbox mapbtn" data-track="map_load" onClick={() => setLoad(true)}>
      <LIcon name="pin" />
      <span>{showLabel}</span>
      <small>{SITE.mapsUrl.replace('https://', '')}</small>
    </button>
  );
}
