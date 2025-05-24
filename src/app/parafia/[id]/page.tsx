// src/app/parafia/[id]/page.tsx
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Image from 'next/image';

interface ParafiaPageProps {
  params: Promise<{ id: string }>;
}

// Prawdziwy API call
async function getParafiaData(id: string) {
  try {
    // W SSR używamy bezwzględnego URL do API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/parishes/${id}`, {
      cache: 'no-store', // Zawsze pobieraj świeże dane
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Jeśli API zwraca błąd, rzuć wyjątek
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Mapuj dane z API na format używany w komponencie
    return {
      id: data.id,
      nazwa: data.nazwa || 'Nieznana parafia',
      miejscowosc: data.miejscowosc || 'Nieznana lokalizacja',
      opis: data.opis || 'Brak opisu parafii.',
      photoUrl: data.photoUrl || `/kosciol-${id}.jpg`, // Użyj zdjęcia z API lub domyślnego
      zebrane: data.zebrane || 0,
      cel: data.cel || 10000,
      wspierajacy: data.wspierajacy || 0,
      pozostalo: data.pozostalo || 0,
      cele: data.cele?.map((cel: any) => ({
        id: cel.id,
        tytul: cel.tytul || 'Brak tytułu',
        opis: cel.opis || 'Brak opisu',
        kwotaCel: cel.kwotaCel || 0,
        kwotaZebrana: cel.kwotaZebrana || 0,
        aktywny: cel.aktywny !== false // domyślnie true jeśli nie określono
      })) || [],
      ostatnieWsparcia: data.ostatnieWsparcia?.map((wsparcie: any) => ({
        nazwa: wsparcie.nazwa || 'Anonim',
        kwota: wsparcie.kwota || 0,
        czas: wsparcie.czas || 'Nieznany czas'
      })) || []
    };
  } catch (error) {
    console.error('Błąd podczas pobierania danych parafii:', error);
    
    // W przypadku błędu API, zwróć dane domyślne lub rzuć wyjątek
    throw new Error(`Nie można pobrać danych dla parafii o ID: ${id}`);
  }
}

export default async function ParafiaPage({ params }: ParafiaPageProps) {
  const { id } = await params;
  
  try {
    const parafia = await getParafiaData(id);

    // Wyliczenia postępu i kwot
    const postep = (parafia.zebrane / parafia.cel) * 100;
    const pozostalaKwota = parafia.cel - parafia.zebrane;

    return (
      <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Wsparcie Parafii
            </Typography>
            <Button color="inherit" href="/mapa">Mapa</Button>
            <Button color="inherit" href="/platnosc">Płatność</Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={4}>
            {/* Główna sekcja */}
            <Grid>
              <Paper elevation={2} sx={{ mb: 3, overflow: 'hidden' }}>
                <Box sx={{ position: 'relative', height: 400 }}>
                  <Image
                    src={parafia.photoUrl}
                    alt={parafia.nazwa}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    color: 'white',
                    p: 3
                  }}>
                    <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
                      {parafia.nazwa}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      {parafia.miejscowosc}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Postęp zbiórki */}
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {parafia.zebrane.toLocaleString()} zł
                  </Typography>
                  <Chip 
                    label={`${Math.round(postep)}% celu`} 
                    color="primary" 
                    size="small"
                  />
                </Box>
                
                <LinearProgress 
                  variant="determinate" 
                  value={postep} 
                  sx={{ height: 12, borderRadius: 6, mb: 2 }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cel: {parafia.cel.toLocaleString()} zł
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pozostało: {pozostalaKwota.toLocaleString()} zł
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button 
                    variant="contained" 
                    size="large" 
                    sx={{ flex: 1, py: 1.5, fontSize: '1.1rem' }}
                    href="/platnosc"
                  >
                    Wesprzyj teraz
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    sx={{ px: 3 }}
                  >
                    Udostępnij
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: 4, textAlign: 'center' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {parafia.wspierajacy}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      wspierających
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {parafia.pozostalo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      dni pozostało
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Opis */}
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  O parafii
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  {parafia.opis}
                </Typography>
              </Paper>

              {/* Cele zbiórek */}
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Cele zbiórek
                </Typography>
                {parafia.cele.map((cel: any) => {
                  const celPostep = (cel.kwotaZebrana / cel.kwotaCel) * 100;
                  return (
                    <Card key={cel.id} sx={{ mb: 2, border: cel.aktywny ? '2px solid #1976d2' : '1px solid #e0e0e0' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                            {cel.tytul}
                          </Typography>
                          {cel.aktywny && (
                            <Chip label="Aktywne" color="primary" size="small" />
                          )}
                        </Box>
                        
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                          {cel.opis}
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {cel.kwotaZebrana.toLocaleString()} zł
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              z {cel.kwotaCel.toLocaleString()} zł
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={celPostep} 
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );

  } catch (error) {
    return (
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Błąd ładowania
            </Typography>
            <Button color="inherit" href="/mapa">Mapa</Button>
            <Button color="inherit" href="/platnosc">Płatność</Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
          <Paper elevation={3} sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mb: 2 }} color="error">
              Nie można załadować danych parafii
            </Typography>
            <Button variant="contained" color="primary" href="/mapa">
              Wróć do mapy
            </Button>
          </Paper>
        </Box>
      </Box>
    );
  }
}

// Dodaj Container component jeśli nie masz
function Container({ children, maxWidth, sx }: any) {
  return (
    <Box sx={{ 
      maxWidth: maxWidth === 'lg' ? 1200 : 800, 
      mx: 'auto', 
      px: { xs: 2, sm: 3 },
      ...sx 
    }}>
      {children}
    </Box>
  );
}