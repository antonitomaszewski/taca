'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

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
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Mapa kościołów
          </Typography>
          <Button color="inherit" href="/platnosc">Płatność</Button>
          <Button color="inherit" href="/kosciol/1">Przykładowy kościół</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3, width: '100%', maxWidth: 600 }}>
          <TextField
            fullWidth
            label="Wyszukaj kościół..."
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Box sx={{ height: 400, width: '100%' }}>
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
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
