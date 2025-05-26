'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { LocationOn as LocationOnIcon, Search as SearchIcon } from '@mui/icons-material';

// Poprawka domyślnego markera Leaflet (Next.js SSR)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/map-marker-2.svg',
  iconUrl: '/map-marker-2.svg',
  shadowUrl: '',
});

interface EditMapComponentProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
  currentAddress?: string; // Dodaj prop dla aktualnego adresu
}

// Komponent do obsługi kliknięć na mapie
function LocationMarker({ position, onLocationChange }: {
  position: [number, number] | null;
  onLocationChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <Typography variant="body2">
          <strong>Lokalizacja kościoła</strong><br />
          Współrzędne: {position[0].toFixed(6)}, {position[1].toFixed(6)}<br />
          <em style={{ fontSize: '0.85em', color: '#666' }}>
            To jest fizyczna lokalizacja kościoła na mapie
          </em>
        </Typography>
      </Popup>
    </Marker>
  );
}

export default function EditMapComponent({ latitude, longitude, onLocationChange, currentAddress }: EditMapComponentProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    latitude && longitude ? [latitude, longitude] : null
  );
  const [searchAddress, setSearchAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Wrocław jako domyślny środek mapy
  const defaultCenter: [number, number] = [51.1079, 17.0385];

  useEffect(() => {
    if (latitude && longitude) {
      setPosition([latitude, longitude]);
    }
  }, [latitude, longitude]);

  // Synchronizuj pole wyszukiwania z przekazanym adresem
  useEffect(() => {
    if (currentAddress && currentAddress !== searchAddress) {
      setSearchAddress(currentAddress);
    }
  }, [currentAddress]);

  const handleLocationChange = (lat: number, lng: number) => {
    const newPosition: [number, number] = [lat, lng];
    setPosition(newPosition);
    onLocationChange(lat, lng);
  };

  const searchLocation = async () => {
    if (!searchAddress.trim()) {
      setSearchError('Wprowadź adres do wyszukania');
      return;
    }

    setIsSearching(true);
    setSearchError('');

    try {
      // Używamy Nominatim API (OpenStreetMap) do geokodowania
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&limit=1&countrycodes=pl`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        handleLocationChange(lat, lng);
        setSearchError('');
      } else {
        setSearchError('Nie znaleziono lokalizacji. Spróbuj bardziej szczegółowego adresu.');
      }
    } catch (error) {
      setSearchError('Błąd podczas wyszukiwania lokalizacji');
      console.error('Geocoding error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchLocation();
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocationOnIcon color="primary" />
        Lokalizacja parafii
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        Wpisz adres parafii powyżej, aby automatycznie znaleźć lokalizację na mapie. 
        Następnie możesz precyzyjnie dostosować znacznik, klikając na mapie w dokładnym miejscu kościoła.
      </Typography>

      {/* Wyszukiwanie adresu */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Wprowadź adres (np. ul. Szewska 10, Wrocław)"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          onKeyPress={handleSearchKeyPress}
          disabled={isSearching}
        />
        <Button
          variant="outlined"
          onClick={searchLocation}
          disabled={isSearching || !searchAddress.trim()}
          startIcon={<SearchIcon />}
          sx={{ minWidth: 'auto', px: 2 }}
        >
          {isSearching ? 'Szukam...' : 'Szukaj'}
        </Button>
      </Box>

      {searchError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {searchError}
        </Alert>
      )}

      {/* Współrzędne */}
      {position && (
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Wybrana lokalizacja: {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </Typography>
      )}

      {/* Mapa */}
      <Box sx={{ height: 400, width: '100%', border: '1px solid #ddd', borderRadius: 1 }}>
        <MapContainer 
          center={position || defaultCenter} 
          zoom={position ? 16 : 13} 
          style={{ height: '100%', width: '100%' }}
          key={position ? `${position[0]}-${position[1]}` : 'default'}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            position={position} 
            onLocationChange={handleLocationChange}
          />
        </MapContainer>
      </Box>

      <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
        Wskazówka: Kliknij na mapie aby precyzyjnie oznaczyć lokalizację kościoła (nie zmieni to wpisanego adresu parafii)
      </Typography>
    </Box>
  );
}
