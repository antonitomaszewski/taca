'use client';

import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

export default function PlatnoscPage() {
  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Płatność
          </Typography>
          <Button color="inherit" href="/mapa">Mapa</Button>
          <Button color="inherit" href="/kosciol/1">Przykładowy kościół</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: 500 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Formularz płatności
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Tu pojawi się formularz płatności.
          </Typography>
          <Button variant="contained" color="primary" disabled>
            Zapłać (wkrótce)
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
