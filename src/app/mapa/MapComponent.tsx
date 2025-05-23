// src/app/mapa/MapComponent.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Poprawka domyślnego markera Leaflet (Next.js SSR)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/globe.svg', // Możesz podmienić na własną ikonę
  iconUrl: '/globe.svg',
  shadowUrl: '',
});

interface Kosciol {
  id: string;
  nazwa: string;
  miejscowosc: string;
  lat: number;
  lng: number;
}

interface MapComponentProps {
  search: string;
}

export default function MapComponent({ search }: MapComponentProps) {
  const [koscioly, setKoscioly] = useState<Kosciol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/koscioly')
      .then(res => res.json())
      .then(data => {
        setKoscioly(data);
        setLoading(false);
      });
  }, []);

  // Filtrowanie kościołów po nazwie lub miejscowości
  const filtered = koscioly.filter(k =>
    k.nazwa.toLowerCase().includes(search.toLowerCase()) ||
    k.miejscowosc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MapContainer center={[52.2297, 21.0122]} zoom={6} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {!loading && filtered.map(kosciol => (
        <Marker key={kosciol.id} position={[kosciol.lat, kosciol.lng]}>
          <Popup>
            <b>{kosciol.nazwa}</b><br />{kosciol.miejscowosc}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}