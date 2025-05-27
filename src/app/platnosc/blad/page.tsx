'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ErrorIcon from '@mui/icons-material/Error';
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';

export default function BladPage() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Pobierz szczegóły błędu z parametrów URL
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('errorDescription');
    
    if (errorDescription) {
      setErrorMessage(errorDescription);
    } else if (error) {
      // Mapowanie kodów błędów na zrozumiałe komunikaty
      const errorMessages: { [key: string]: string } = {
        'payment_cancelled': 'Płatność została anulowana przez użytkownika',
        'payment_failed': 'Płatność nie została zrealizowana',
        'insufficient_funds': 'Niewystarczające środki na koncie',
        'card_declined': 'Karta została odrzucona',
        'expired_card': 'Karta wygasła',
        'invalid_card': 'Nieprawidłowe dane karty',
        'processing_error': 'Błąd podczas przetwarzania płatności',
        'network_error': 'Błąd połączenia sieciowego',
        'timeout': 'Przekroczono limit czasu płatności',
        'unknown_error': 'Wystąpił nieznany błąd'
      };
      
      setErrorMessage(errorMessages[error] || 'Wystąpił nieoczekiwany błąd podczas przetwarzania płatności');
    } else {
      setErrorMessage('Wystąpił błąd podczas przetwarzania płatności');
    }
  }, [searchParams]);

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'black' }}>
        <Container maxWidth="lg">
          <Toolbar>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
              <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                Taca.pl
              </Typography>
            </Link>
          </Toolbar>
        </Container>
      </AppBar>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, px: 2 }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600, textAlign: 'center' }}>
          <ErrorIcon 
            sx={{ 
              fontSize: 80, 
              color: '#f44336', 
              mb: 2 
            }} 
          />
          
          <Typography variant="h4" sx={{ mb: 2, color: '#f44336', fontWeight: 'bold' }}>
            Płatność nie powiodła się
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 3, color: '#666' }}>
            Nie udało się przetworzyć Twojej płatności
          </Typography>

          <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Szczegóły błędu:
            </Typography>
            <Typography variant="body2">
              {errorMessage}
            </Typography>
          </Alert>

          <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="body2">
              <strong>Co możesz zrobić:</strong>
            </Typography>
            <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
              <li>Sprawdź dane karty i spróbuj ponownie</li>
              <li>Upewnij się, że masz wystarczające środki na koncie</li>
              <li>Spróbuj użyć innej metody płatności</li>
              <li>Skontaktuj się z nami, jeśli problem się powtarza</li>
            </ul>
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              href="/"
              variant="outlined"
              sx={{ 
                color: '#4caf50',
                borderColor: '#4caf50',
                '&:hover': { 
                  bgcolor: 'rgba(76, 175, 80, 0.04)',
                  borderColor: '#45a049'
                }
              }}
            >
              Strona główna
            </Button>
            
            <Button
              component={Link}
              href="/platnosc"
              variant="contained"
              sx={{ 
                bgcolor: '#4caf50',
                '&:hover': { bgcolor: '#45a049' }
              }}
            >
              Spróbuj ponownie
            </Button>
          </Box>

          <Box sx={{ mt: 4, p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Potrzebujesz pomocy?</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Skontaktuj się z nami pod adresem{' '}
              <Link href="mailto:kontakt@taca.pl" style={{ color: '#4caf50' }}>
                kontakt@taca.pl
              </Link>
              {' '}lub telefonicznie: +48 000 000 000
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
