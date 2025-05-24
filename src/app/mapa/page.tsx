'use client';

import { Box, TextField, Paper, InputAdornment, Typography, List, ListItem, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useState, useEffect } from 'react';
import MapWrapper from './MapWrapper';
import { useRouter } from 'next/navigation';

interface Parafia {
  id: string;
  nazwa: string;
  miejscowosc: string;
  lat: number;
  lng: number;
}

export default function MapaPage() {
  const [search, setSearch] = useState('');
  const [parafie, setParafie] = useState<Parafia[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Pobierz prawdziwe dane z API
    const fetchParafie = async () => {
      try {
        const response = await fetch('/api/koscioly');
        if (!response.ok) {
          throw new Error('Failed to fetch parishes');
        }
        const data = await response.json();
        
        // Mapuj dane z API na format używany przez mapę
        const mappedParafie: Parafia[] = data.map((parish: any) => ({
          id: parish.id,
          nazwa: parish.nazwa,
          miejscowosc: parish.miejscowosc,
          lat: parish.lat,
          lng: parish.lng
        }));
        
        setParafie(mappedParafie);
      } catch (error) {
        console.error('Error fetching parishes:', error);
        // Fallback do mockowych danych w przypadku błędu
        const mockParafie: Parafia[] = [
          { id: '1', nazwa: 'Parafia Katedralna', miejscowosc: 'Wrocław', lat: 51.1079, lng: 17.0385 },
          { id: '2', nazwa: 'Parafia św. Anny', miejscowosc: 'Kraków', lat: 50.0647, lng: 19.9450 },
          { id: '3', nazwa: 'Parafia św. Jana', miejscowosc: 'Warszawa', lat: 52.2297, lng: 21.0122 },
        ];
        setParafie(mockParafie);
      } finally {
        setLoading(false);
      }
    };

    fetchParafie();
  }, []);

  // Filtrowanie parafii
  const filteredParafie = parafie.filter(p =>
    p.nazwa.toLowerCase().includes(search.toLowerCase()) ||
    p.miejscowosc.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectParafia = (id: string) => {
    router.push(`/kosciol/${id}`);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Panel wyszukiwania - lewa strona */}
      <Paper 
        sx={{ 
          width: { xs: '100%', md: 400 }, 
          height: '100%', 
          borderRadius: 0, 
          display: 'flex', 
          flexDirection: 'column',
          boxShadow: 2
        }}
      >
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Znajdź parafię
          </Typography>
          <TextField
            fullWidth
            placeholder="Wyszukaj parafię lub miejscowość..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            variant="outlined"
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'white'
              }
            }}
          />
        </Box>

        {/* Lista wyników */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">Ładowanie parafii...</Typography>
            </Box>
          ) : filteredParafie.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                {search ? 'Nie znaleziono parafii' : 'Brak parafii'}
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredParafie.map((parafia) => (
                <ListItem
                  key={parafia.id}
                  sx={{ 
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f8f9fa' }
                  }}
                  onClick={() => handleSelectParafia(parafia.id)}
                >
                  <LocationOnIcon sx={{ color: 'primary.main', mr: 2 }} />
                  <ListItemText
                    primary={parafia.nazwa}
                    secondary={parafia.miejscowosc}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Paper>

      {/* Mapa - prawa strona */}
      <Box sx={{ flex: 1, position: 'relative', display: { xs: 'none', md: 'block' } }}>
        <MapWrapper search={search} parafie={filteredParafie} />
      </Box>
    </Box>
  );
}