'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import Link from 'next/link';

// Poprawka domyślnego markera Leaflet (Next.js SSR)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/globe.svg', // Możesz podmienić na własną ikonę
  iconUrl: '/globe.svg',
  shadowUrl: '',
});

export default function MapaPage() {
  useEffect(() => {
    // Fix for map rendering in Next.js
    if (typeof window !== 'undefined') {
      import('leaflet');
    }
  }, []);

  return (
    <main>
      <h1>Mapa kościołów</h1>
      <nav>
        <Link href="/platnosc">Płatność</Link> |{' '}
        <Link href="/kosciol/1">Przykładowy kościół</Link>
      </nav>
      <div style={{ margin: '1em 0' }}>
        <input type="text" placeholder="Wyszukaj kościół..." style={{ width: 300, padding: 8 }} />
      </div>
      <div style={{ height: '400px', width: '100%', maxWidth: 600 }}>
        <MapContainer center={[52.2297, 21.0122]} zoom={6} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[52.2297, 21.0122]}>
            <Popup>
              Przykładowy kościół<br />Warszawa
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </main>
  );
}
