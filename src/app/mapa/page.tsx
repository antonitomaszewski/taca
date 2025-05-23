// src/app/mapa/page.tsx
'use client';

import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import MapWrapper from './MapWrapper';

export default function MapaPage() {
  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Mapa kościołów
          </Typography>
          <Button color="inherit" href="/platnosc">Płatność</Button>
          <Button color="inherit" href="/kosciol/1">Przykładowy kościół</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3, width: '100%', maxWidth: 600 }}>
          <TextField
            fullWidth
            label="Wyszukaj kościół..."
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Box sx={{ height: 400, width: '100%' }}>
            <MapWrapper />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}