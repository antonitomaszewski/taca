import { Box, Typography, Button, AppBar, Toolbar, Container } from "@mui/material";
import Link from "next/link";
import LoginButton from "./components/LoginButton";

export default function Home() {
  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      {/* AppBar */}
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: 1, color: 'white', fontFamily: 'Montserrat, Arial, sans-serif', textTransform: 'uppercase' }}>
            Taca.pl
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" href="/rejestracja-parafii" sx={{ fontWeight: 600, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2, px: 3, ':hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}>
              Zarejestruj
            </Button>
            <LoginButton />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 900, color: 'primary.main', mb: 3, fontFamily: 'Montserrat, Arial, sans-serif' }}>
          Taca.pl
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
          Wspieraj swoją parafię
        </Typography>
        <Typography variant="h6" sx={{ mb: 6, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
          Nowoczesna platforma do płatności na parafię – szybko, bezpiecznie, online. 
          Dołącz do społeczności wspierających lokalne parafie!
        </Typography>
        
        <Button
          component={Link}
          href="/mapa"
          variant="contained"
          color="primary"
          size="large"
          sx={{ px: 6, py: 2, fontSize: '1.2rem', fontWeight: 600 }}
        >
          Znajdź parafię
        </Button>
      </Container>
    </Box>
  );
}