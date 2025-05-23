import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

interface KosciolPageProps {
  params: { id: string };
}

export default async function KosciolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Kościół #{id}
          </Typography>
          <Button color="inherit" href="/mapa">Mapa</Button>
          <Button color="inherit" href="/platnosc">Płatność</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: 500 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Szczegóły kościoła #{id}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Tu pojawią się szczegóły kościoła, opis, zdjęcia, cele zbiórek.
          </Typography>
          <Button variant="contained" color="primary" href="/platnosc">
            Wesprzyj
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
