import Link from 'next/link';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  AppBar, 
  Toolbar 
} from '@mui/material';

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
          <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', color: '#2e7d32', mb: 2 }}>
            404
          </Typography>
          <Typography variant="h4" sx={{ mb: 3, color: '#666' }}>
            Parafia nie została znaleziona
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
            Sprawdź czy adres jest poprawny lub wróć do strony głównej.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              component={Link}
              href="/"
              variant="contained"
              size="large"
              sx={{ 
                bgcolor: '#2e7d32',
                '&:hover': { bgcolor: '#1b5e20' }
              }}
            >
              Wróć do strony głównej
            </Button>
            <Button 
              component={Link}
              href="/mapa"
              variant="outlined"
              size="large"
              sx={{
                color: '#4caf50',
                borderColor: '#4caf50',
                '&:hover': {
                  bgcolor: '#4caf50',
                  color: 'white',
                },
              }}
            >
              Znajdź parafię
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
