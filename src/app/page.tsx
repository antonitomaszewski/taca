"use client";

import { useState } from "react";
import { Box, Typography, Button, AppBar, Toolbar, Container, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Link as MuiLink, InputAdornment, IconButton, Modal, Grid, Card, CardMedia, CardContent } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import MapIcon from '@mui/icons-material/Map';
import Image from "next/image";
import Link from "next/link";

const kosciolyDemo = [
  { nazwa: "Katedra Wrocławska", img: "/katedra_wroclaw.jpg" },
  { nazwa: "Parafia św. Anny", img: "/globe.svg" },
  { nazwa: "Parafia św. Jana", img: "/globe.svg" },
];

export default function Home() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [haslo, setHaslo] = useState('');
  const [mapOpen, setMapOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      const btn = document.getElementById('login-btn');
      if (btn) (btn as HTMLButtonElement).blur();
    }, 0);
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      {/* AppBar bez zmian */}
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: 1, color: 'white', fontFamily: 'Montserrat, Arial, sans-serif', textTransform: 'uppercase' }}>
            
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" href="/nowa-parafia" sx={{ fontWeight: 600, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2, px: 3, ':hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}>
              Zarejestruj Kościół
            </Button>
            <Button
              id="login-btn"
              color="inherit"
              sx={{ fontWeight: 600, bgcolor: 'white', color: 'primary.main', borderRadius: 2, px: 3, boxShadow: 1, ':hover': { bgcolor: '#f0f2f5' } }}
              onClick={handleOpen}
            >
              Zaloguj
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Główna sekcja hero */}
      <Container maxWidth="lg" sx={{ py: 8, minHeight: 500 }}>
        <Grid container spacing={6} alignItems="center" justifyContent="center">
          {/* Lewa kolumna */}
          <Grid>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h2" sx={{ fontWeight: 900, color: 'primary.main', mb: 2, fontFamily: 'Montserrat, Arial, sans-serif', letterSpacing: -2 }}>
                Taca.pl
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Wspieraj swoją parafię
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary', maxWidth: 420 }}>
                Nowoczesna platforma do płatności na parafię – szybko, bezpiecznie, online. Dołącz do społeczności wspierających lokalne parafie!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                href="/dodaj-kosciol"
                sx={{ px: 5, py: 1.5, fontSize: '1.1rem', mb: 2 }}
              >
                Zarejestruj Parafię
              </Button>
              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  href="/pytania"
                  sx={{ px: 4, mt: 2 }}
                >
                  Zobacz jak to działa
                </Button>
              </Box>
            </Box>
          </Grid>
          {/* Prawa kolumna - zdjęcia parafii */}
          <Grid>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-end' }, gap: 2 }}>
              {kosciolyDemo.map((k, i) => (
                <Card key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2, boxShadow: 2, minWidth: 320, maxWidth: 360 }}>
                  <CardMedia>
                    <Image src={k.img} alt={k.nazwa} width={80} height={80} style={{ borderRadius: 8, margin: 8 }} />
                  </CardMedia>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{k.nazwa}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
      {/* Sekcja: Zobacz parafie, które do nas dołączyły */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Zobacz parafie, które do nas dołączyły
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, justifyContent: 'center', alignItems: 'center' }}>
          <TextField
            placeholder="Znajdź Twoją parafię"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ minWidth: 260, maxWidth: 340 }}
          />
          <Button
            variant="outlined"
            color="primary"
            startIcon={<MapIcon />}
            onClick={() => setMapOpen(true)}
            sx={{ minWidth: 180 }}
          >
            Znajdź na mapie
          </Button>
        </Box>
      </Container>
      {/* Popup z mapą */}
      <Modal open={mapOpen} onClose={() => setMapOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 3, minWidth: 320, minHeight: 400 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Mapa parafii (demo)</Typography>
          <Box sx={{ width: 320, height: 320, bgcolor: '#e0e0e0', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Tu można wstawić komponent mapy lub placeholder */}
            <Typography variant="body2" color="text.secondary">Mapa parafii – wkrótce</Typography>
          </Box>
          <Button variant="outlined" color="primary" sx={{ mt: 3 }} onClick={() => setMapOpen(false)} fullWidth>
            Zamknij
          </Button>
        </Box>
      </Modal>
      {/* Dialog logowania bez zmian */}
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