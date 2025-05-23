// src/app/kosciol/[id]/page.tsx
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

interface KosciolPageProps {
  params: Promise<{ id: string }>;
}

// Mockowe dane - zastąp prawdziwym API
async function getKosciolData(id: string) {
  // Symulacja opóźnienia API
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    id: id,
    nazwa: "Parafia św. Jana Chrzciciela",
    miejscowosc: "Warszawa, Mokotów",
    opis: "Parafia św. Jana Chrzciciela to wspólnota wiernych działająca od 1923 roku. Nasz kościół służy lokalnej społeczności, organizując msze święte, katechezę dla dzieci i młodzieży oraz działalność charytatywną.",
    photoUrl: "/globe.svg", // Zastąp prawdziwym zdjęciem
    zebrane: 18500,
    cel: 50000,
    wspierajacy: 127,
    pozostalo: 21, // dni
    cele: [
      {
        id: 1,
        tytul: "Remont dachu kościoła",
        opis: "Pilnie potrzebujemy remontu dachu, który przecieka podczas deszczu. Koszty obejmują wymianę pokrycia dachowego i renowację więźby.",
        kwotaCel: 35000,
        kwotaZebrana: 12300,
        aktywny: true
      },
      {
        id: 2,
        tytul: "Nowe organy dla parafii",
        opis: "Chcemy zakupić nowe organy, które wzbogacą liturgię i pozwolą na organizację koncertów muzyki sakralnej.",
        kwotaCel: 25000,
        kwotaZebrana: 6200,
        aktywny: true
      },
      {
        id: 3,
        tytul: "Remont sali parafialnej",
        opis: "Modernizacja sali używanej do spotkań parafialnych, katechez i wydarzeń społecznych.",
        kwotaCel: 15000,
        kwotaZebrana: 0,
        aktywny: false
      }
    ],
    ostatnieWsparcia: [
      { nazwa: "Anna K.", kwota: 200, czas: "2 godziny temu" },
      { nazwa: "Marek W.", kwota: 150, czas: "4 godziny temu" },
      { nazwa: "Jadwiga S.", kwota: 100, czas: "6 godzin temu" },
      { nazwa: "Piotr M.", kwota: 300, czas: "1 dzień temu" }
    ]
  };
}

export default async function KosciolPage({ params }: KosciolPageProps) {
  const { id } = await params;
  
  try {
    const kosciol = await getKosciolData(id);
    const postep = (kosciol.zebrane / kosciol.cel) * 100;
    const pozostalaKwota = kosciol.cel - kosciol.zebrane;

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
                <Box sx={{ position: 'relative', height: 300 }}>
                  <Image
                    src={kosciol.photoUrl}
                    alt={kosciol.nazwa}
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
                      {kosciol.nazwa}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      {kosciol.miejscowosc}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Postęp zbiórki */}
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {kosciol.zebrane.toLocaleString()} zł
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
                    Cel: {kosciol.cel.toLocaleString()} zł
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
                      {kosciol.wspierajacy}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      wspierających
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {kosciol.pozostalo}
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
                  {kosciol.opis}
                </Typography>
              </Paper>

              {/* Cele zbiórek */}
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Cele zbiórek
                </Typography>
                {kosciol.cele.map((cel) => {
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
              Nie można załadować danych kościoła
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