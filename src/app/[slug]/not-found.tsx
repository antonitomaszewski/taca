import Link from 'next/link';
import { Box, Container, Typography, Button } from '@mui/material';

export default function NotFound() {
  return (
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
      </Box>
    </Container>
  );
}
