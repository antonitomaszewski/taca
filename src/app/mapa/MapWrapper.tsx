// src/app/mapa/MapWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Parish } from '../../interfaces/types';

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

interface MapWrapperProps {
  search: string;
  parishes: Parish[];
}

export default function MapWrapper({ search, parishes }: MapWrapperProps) {
  return (
    <MapComponent search={search} parishes={parishes} />
  );
}