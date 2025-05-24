import { Box, Typography, Button, AppBar, Toolbar, Container } from "@mui/material";
import Link from "next/link";
import LoginButton from "./components/LoginButton";

export default function Home() {
  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'black' }} elevation={1}>
        <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: 1, color: '#4caf50', fontFamily: 'Montserrat, Arial, sans-serif', textTransform: 'uppercase' }}>
            Taca.pl
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button href="/rejestracja-parafii" sx={{ fontWeight: 600, color: '#4caf50', border: '1px solid #4caf50', borderRadius: 2, px: 3, '&:hover': { bgcolor: '#4caf50', color: 'white' } }}>
              Zarejestruj
            </Button>
            <LoginButton />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 900, color: '#4caf50', mb: 3, fontFamily: 'Montserrat, Arial, sans-serif' }}>
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
          size="large"
          sx={{ px: 6, py: 2, fontSize: '1.2rem', fontWeight: 600, bgcolor: '#4caf50', '&:hover': { bgcolor: '#45a049' } }}
        >
          Znajdź parafię
        </Button>
      </Container>
    </Box>
  );
}