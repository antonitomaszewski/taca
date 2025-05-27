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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import { useEffect, useState } from 'react';

interface PaymentDetails {
  amount: number;
  transactionId: string;
  email: string;
  client: string;
  description: string;
  status: string;
}

export default function SukcesPage() {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('sessionId');

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!sessionId) {
        setError('Brak identyfikatora sesji płatności');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/payments?sessionId=${sessionId}`, {
          method: 'GET',
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Nie udało się pobrać szczegółów płatności');
        }

        setPaymentDetails(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania danych');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [sessionId]);

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
          {loading ? (
            <Box>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Sprawdzamy status płatności...
              </Typography>
            </Box>
          ) : error ? (
            <Box>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
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
          ) : (
            <Box>
              <CheckCircleIcon 
                sx={{ 
                  fontSize: 80, 
                  color: '#4caf50', 
                  mb: 2 
                }} 
              />
              
              <Typography variant="h4" sx={{ mb: 2, color: '#4caf50', fontWeight: 'bold' }}>
                Płatność zakończona sukcesem!
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 3, color: '#666' }}>
                Dziękujemy za wsparcie parafii
              </Typography>

              {paymentDetails && (
                <Box sx={{ textAlign: 'left', mb: 3 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Szczegóły płatności
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" color="text.secondary">
                      Kwota:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {(paymentDetails.amount / 100).toFixed(2)} zł
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" color="text.secondary">
                      ID transakcji:
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                      {paymentDetails.transactionId}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" color="text.secondary">
                      Email:
                    </Typography>
                    <Typography variant="body1">
                      {paymentDetails.email}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" color="text.secondary">
                      Podpis:
                    </Typography>
                    <Typography variant="body1">
                      {paymentDetails.client}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" color="text.secondary">
                      Opis:
                    </Typography>
                    <Typography variant="body1">
                      {paymentDetails.description}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
                <Typography variant="body2">
                  Potwierdzenie płatności zostało wysłane na Twój adres email. 
                  Jeśli nie otrzymasz wiadomości w ciągu kilku minut, sprawdź folder spam.
                </Typography>
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
                  Kolejna wpłata
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
