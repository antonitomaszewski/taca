'use client';

import { Box, TextField, Paper, InputAdornment, Typography, List, ListItem, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useState, useEffect } from 'react';
import MapWrapper from './MapWrapper';
import { useRouter } from 'next/navigation';
import { Parish } from '../../interfaces/types';

export default function MapaPage() {
  const [search, setSearch] = useState('');
  const [parishes, setParishes] = useState<Parish[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchParishes = async () => {
      try {
        const response = await fetch('/api/parishes');
        if (!response.ok) {
          throw new Error('Failed to fetch parishes');
        }
        const data = await response.json();
        setParishes(data);
      } catch (error) {
        console.error('Error fetching parishes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParishes();
  }, []);

  // Filtrowanie parafii
  const filteredParishes = parishes.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectParish = (id: string) => {
    router.push(`/parafia/${id}`);
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
          ) : filteredParishes.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                {search ? 'Nie znaleziono parafii' : 'Brak parafii'}
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredParishes.map((parish) => (
                <ListItem
                  key={parish.id}
                  sx={{ 
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f8f9fa' }
                  }}
                  onClick={() => handleSelectParish(parish.id)}
                >
                  <LocationOnIcon sx={{ color: 'primary.main', mr: 2 }} />
                  <ListItemText
                    primary={parish.name}
                    secondary={parish.city}
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
        <MapWrapper search={search} parishes={filteredParishes} />
      </Box>
    </Box>
  );
}