// src/app/mapa/MapComponent.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Poprawka domyślnego markera Leaflet (Next.js SSR)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/globe.svg', // Możesz podmienić na własną ikonę
  iconUrl: '/globe.svg',
  shadowUrl: '',
});

export default function MapComponent() {
  return (
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
  );
}