"use client";

import { Box, Typography, Button, AppBar, Toolbar, Container, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Link as MuiLink } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [haslo, setHaslo] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: 1, color: 'white' }}>
            taca.online
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" href="/dodaj-kosciol" sx={{ fontWeight: 600, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2, px: 3, ':hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}>
              Zarejestruj Kościół
            </Button>
            <Button color="inherit" sx={{ fontWeight: 600, bgcolor: 'white', color: 'primary.main', borderRadius: 2, px: 3, boxShadow: 1, ':hover': { bgcolor: '#f0f2f5' } }} onClick={handleOpen}>
              Zaloguj
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: 8, display: 'flex', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
        {/* Lewa kolumna (hasło, logo) */}
        <Box sx={{ flex: 1, pr: { md: 8 }, display: { xs: 'none', md: 'block' } }}>
          <Typography variant="h2" sx={{ fontWeight: 800, color: 'primary.main', mb: 2, letterSpacing: -1 }}>
            Wesprzyj swoją parafię
          </Typography>
          <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4, fontWeight: 400 }}>
            Nowoczesna platforma do płatności na parafię – szybko, bezpiecznie, online.
          </Typography>
          <Image src="/globe.svg" alt="Logo taca" width={120} height={120} style={{ marginBottom: 16 }} />
        </Box>
        {/* Prawa kolumna (panel logowania/rejestracji) */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            maxWidth: 400,
            mx: 'auto',
            width: '100%',
            minWidth: { xs: 'unset', md: 350 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'primary.main', textAlign: 'center' }}>
            Zaloguj się do taca.online
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            href="/mapa"
            sx={{ px: 5, py: 1.5, fontSize: '1.1rem', mb: 2, width: '100%' }}
          >
            Przeglądaj parafie
          </Button>
          <Box sx={{ width: '100%' }}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              href="/dodaj-kosciol"
              sx={{ px: 4, width: '100%' }}
            >
              Zarejestruj Kościół
            </Button>
          </Box>
          <Box sx={{ width: '100%', mt: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={handleOpen}
              sx={{ px: 4, width: '100%' }}
            >
              Zaloguj się
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
            Nie masz konta?{' '}
            <MuiLink href="/rejestracja" color="primary" underline="hover">
              Zarejestruj się
            </MuiLink>
          </Typography>
        </Paper>
      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Zaloguj się</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="E-mail"
            type="email"
            fullWidth
            value={email}
            onChange={e => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Hasło"
            type="password"
            fullWidth
            value={haslo}
            onChange={e => setHaslo(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Box sx={{ width: '100%', textAlign: 'right', mb: 2 }}>
            <MuiLink href="/reset-hasla" color="primary" underline="hover" sx={{ fontSize: 14 }}>
              Nie pamiętasz hasła?
            </MuiLink>
          </Box>
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', gap: 1, alignItems: 'stretch', px: 3, pb: 3 }}>
          <Button variant="contained" color="primary" fullWidth sx={{ mb: 1 }} onClick={handleClose}>
            Zaloguj
          </Button>
          <Button variant="outlined" color="primary" fullWidth href="/rejestracja">
            Utwórz konto
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}