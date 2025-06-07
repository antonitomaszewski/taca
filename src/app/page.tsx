"use client";
import { Box, Typography, Button, Container } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import LoginButton from "./components/LoginButton";
import { TacaAppBar, TacaButton } from "@/components/ui";

export default function Home() {
  const { status } = useSession();

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      {/* AppBar */}
      <TacaAppBar 
        rightContent={
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Ukryj przycisk rejestracji dla zalogowanych użytkowników - tylko pokazuj gdy status jest sprawdzony */}
            {status !== "loading" && status === "unauthenticated" && (
              <TacaButton 
                variant="outlined"
                href="/rejestracja-parafii"
              >
                Zarejestruj
              </TacaButton>
            )}
            <LoginButton />
          </Box>
        }
      />

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