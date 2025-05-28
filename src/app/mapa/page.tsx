'use client';

import { Box, TextField, Paper, InputAdornment, Typography, List, ListItem, ListItemText, AppBar, Toolbar, Button, Container } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import MapWrapper from './MapWrapper';
import { useRouter } from 'next/navigation';
import { Parish } from '../../interfaces/types';
import LoginButton from '../components/LoginButton';

export default function MapaPage() {
  const [search, setSearch] = useState('');
  const [parishes, setParishes] = useState<Parish[]>([]);
  const [loading, setLoading] = useState(true);
  const { status } = useSession();
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

  const handleSelectParish = (parish: Parish) => {
    // Użyj slug-a jeśli dostępny, w przeciwnym razie fallback na ID
    if (parish.uniqueSlug) {
      router.push(`/${parish.uniqueSlug}`);
    } else {
      router.push(`/parafia/${parish.id}`);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      {/* AppBar - taki sam jak na stronie głównej */}
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'black' }} elevation={1}>
        <Container maxWidth="lg">
          <Toolbar sx={{ px: 0 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                flexGrow: 1, 
                fontWeight: 800, 
                letterSpacing: 1, 
                color: '#4caf50', 
                fontFamily: 'Montserrat, Arial, sans-serif', 
                textTransform: 'uppercase',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              component="a"
              href="/"
            >
              Taca.pl
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Ukryj przycisk rejestracji dla zalogowanych użytkowników - tylko pokazuj gdy status jest sprawdzony */}
              {status !== "loading" && status === "unauthenticated" && (
                <Button 
                  href="/rejestracja-parafii" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#4caf50', 
                    border: '1px solid #4caf50', 
                    borderRadius: 2, 
                    px: 3, 
                    '&:hover': { bgcolor: '#4caf50', color: 'white' } 
                  }}
                >
                  Zarejestruj
                </Button>
              )}
              <LoginButton />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Główna zawartość mapy */}
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', bgcolor: '#f5f5f5' }}>
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
                  onClick={() => handleSelectParish(parish)}
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
    </Box>
  );
}