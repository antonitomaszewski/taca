// src/app/mapa/MapWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Dynamiczny import komponentu mapy z wyłączonym SSR
const MapComponent = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => (
    <Box 
      sx={{ 
        height: 400, 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#f0f0f0',
        borderRadius: 1
      }}
    >
      <Typography>Ładowanie mapy...</Typography>
    </Box>
  )
});

interface Parafia {
  id: string;
  nazwa: string;
  miejscowosc: string;
  lat: number;
  lng: number;
}

interface MapWrapperProps {
  search: string;
  parafie: Parafia[];
}

export default function MapWrapper({ search, parafie }: MapWrapperProps) {
  return <MapComponent search={search} parafie={parafie} />;
}