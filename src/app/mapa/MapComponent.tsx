// src/app/mapa/MapComponent.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Parish } from '../../interfaces/types';

// Poprawka domyślnego markera Leaflet (Next.js SSR)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/map-marker-2.svg',
  iconUrl: '/map-marker-2.svg',
  shadowUrl: '',
});

interface MapComponentProps {
  search: string;
  parishes: Parish[];
}

export default function MapComponent({ search, parishes }: MapComponentProps) {
  const router = useRouter();

  return (
    <MapContainer center={[51.1079, 17.0385]} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {parishes.map(parish => (
        <Marker key={parish.id} position={[parish.latitude, parish.longitude]}>
          <Popup>
            <b>{parish.name}</b><br />{parish.city}
            <br />
            <button
              style={{marginTop:8, padding:'6px 16px', background:'#1976d2', color:'#fff', border:'none', borderRadius:4, cursor:'pointer'}}
              onClick={() => router.push(`/kosciol/${parish.id}`)}
            >
              Wybierz
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}