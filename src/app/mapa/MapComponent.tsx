// src/app/mapa/MapComponent.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Poprawka domyślnego markera Leaflet (Next.js SSR)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/globe.svg', // Możesz podmienić na własną ikonę
  iconUrl: '/globe.svg',
  shadowUrl: '',
});

interface Parafia {
  id: string;
  nazwa: string;
  miejscowosc: string;
  lat: number;
  lng: number;
}

interface MapComponentProps {
  search: string;
  parafie: Parafia[];
}

export default function MapComponent({ search, parafie }: MapComponentProps) {
  const router = useRouter();

  return (
    <MapContainer center={[52.2297, 21.0122]} zoom={6} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {parafie.map(parafia => (
        <Marker key={parafia.id} position={[parafia.lat, parafia.lng]}>
          <Popup>
            <b>{parafia.nazwa}</b><br />{parafia.miejscowosc}
            <br />
            <button
              style={{marginTop:8, padding:'6px 16px', background:'#1976d2', color:'#fff', border:'none', borderRadius:4, cursor:'pointer'}}
              onClick={() => router.push(`/kosciol/${parafia.id}`)}
            >
              Wybierz
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}