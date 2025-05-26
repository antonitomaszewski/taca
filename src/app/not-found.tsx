/**
 * Globalny komponent Not Found - obsługuje wszystkie niepoprawne adresy URL
 * Wyświetla się dla adresów typu: a/b/c/d, nieprawdilowa-strona, itp.
 * W Next.js 13+ App Router ten plik automatycznie obsługuje wszystkie 404 błędy
 */

import Link from 'next/link';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  AppBar, 
  Toolbar 
} from '@mui/material';
import { Home as HomeIcon, Map as MapIcon } from '@mui/icons-material';

export default function NotFound() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 2 }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ px: 0 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                flexGrow: 1, 
                fontWeight: 600, 
                color: '#4caf50',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              component="a"
              href="/"
            >
              Taca.pl
            </Typography>
            <Button
              variant="outlined"
              sx={{
                color: '#4caf50',
                borderColor: '#4caf50',
                '&:hover': {
                  bgcolor: '#4caf50',
                  color: 'white',
                },
              }}
              href="/mapa"
            >
              Znajdź parafię
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 404 Content */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Box>
          {/* Duża liczba 404 */}
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '4rem', md: '6rem' }, 
              fontWeight: 'bold', 
              color: '#2e7d32', 
              mb: 2 
            }}
          >
            404
          </Typography>
          
          {/* Główny komunikat */}
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 3, 
              color: '#666',
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Strona nie została znaleziona
          </Typography>
          
          {/* Szczegółowy opis */}
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4, 
              color: '#666',
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}
          >
            Sprawdź czy adres URL jest poprawny lub wybierz jedną z poniższych opcji.
          </Typography>
          
          {/* Przyciski nawigacyjne */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center'
          }}>
            <Button 
              component={Link}
              href="/"
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              sx={{ 
                bgcolor: '#2e7d32',
                '&:hover': { bgcolor: '#1b5e20' },
                minWidth: { xs: '200px', sm: 'auto' }
              }}
            >
              Strona główna
            </Button>
            
            <Button 
              component={Link}
              href="/mapa"
              variant="outlined"
              size="large"
              startIcon={<MapIcon />}
              sx={{
                color: '#4caf50',
                borderColor: '#4caf50',
                '&:hover': {
                  bgcolor: '#4caf50',
                  color: 'white',
                },
                minWidth: { xs: '200px', sm: 'auto' }
              }}
            >
              Znajdź parafię
            </Button>
          </Box>
          
          {/* Dodatkowe linki pomocnicze */}
          <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="body2" sx={{ color: '#999', mb: 2 }}>
              Lub przejdź do:
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Button 
                component={Link}
                href="/rejestracja-parafii"
                variant="text"
                size="small"
                sx={{ color: '#4caf50' }}
              >
                Zarejestruj parafię
              </Button>
              <Button 
                component={Link}
                href="/edycja-parafii"
                variant="text"
                size="small"
                sx={{ color: '#4caf50' }}
              >
                Edycja parafii
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
