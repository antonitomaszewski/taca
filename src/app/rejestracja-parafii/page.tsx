"use client";
import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import Link from "next/link";
import CheckIcon from '@mui/icons-material/Check';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SecurityIcon from '@mui/icons-material/Security';
import SupportIcon from '@mui/icons-material/Support';
import CloudIcon from '@mui/icons-material/Cloud';

export default function RejestracjaParafii() {
  const [formData, setFormData] = useState({
    nazwaParafii: "",
    imieNazwisko: "",
    email: "",
    telefon: "",
    haslo: "",
    powtorzHaslo: "",
    akceptacjaRegulaminu: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    }));
    // Wyczyść błąd gdy użytkownik zaczyna pisać
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.akceptacjaRegulaminu) {
      setError("Musisz zaakceptować regulamin");
      return;
    }
    
    if (formData.haslo !== formData.powtorzHaslo) {
      setError("Hasła nie są identyczne");
      return;
    }

    if (formData.haslo.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas rejestracji');
      }

      // Rejestracja udana - przekieruj do edycji parafii
      alert('Rejestracja przebiegła pomyślnie! Teraz możesz uzupełnić szczegóły swojej parafii.');
      window.location.href = "/edycja-parafii";
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 2 }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ px: 0 }}>
            <Typography 
              component={Link}
              href="/"
              variant="h6" 
              sx={{ 
                flexGrow: 1, 
                fontWeight: 600, 
                color: '#4caf50',
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': { opacity: 0.8 }
              }}
            >
              Taca.pl
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Left Column - Form */}
          <Box sx={{ flex: { xs: 1, md: 2 } }}>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50', mb: 1 }}>
                Rejestracja parafii
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                Dołącz do nowoczesnej platformy płatności dla parafii
              </Typography>

              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    label="Nazwa parafii"
                    value={formData.nazwaParafii}
                    onChange={handleChange('nazwaParafii')}
                    required
                    fullWidth
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                    }}
                  />

                  <TextField
                    label="Imię i nazwisko proboszcza/administratora"
                    value={formData.imieNazwisko}
                    onChange={handleChange('imieNazwisko')}
                    required
                    fullWidth
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                    }}
                  />

                  <TextField
                    label="Adres email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    required
                    fullWidth
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                    }}
                  />

                  <TextField
                    label="Numer telefonu"
                    value={formData.telefon}
                    onChange={handleChange('telefon')}
                    required
                    fullWidth
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                    }}
                  />

                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        label="Hasło"
                        type="password"
                        value={formData.haslo}
                        onChange={handleChange('haslo')}
                        required
                        fullWidth
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                          },
                          '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        label="Powtórz hasło"
                        type="password"
                        value={formData.powtorzHaslo}
                        onChange={handleChange('powtorzHaslo')}
                        required
                        fullWidth
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                          },
                          '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                        }}
                      />
                    </Box>
                  </Box>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.akceptacjaRegulaminu}
                        onChange={handleChange('akceptacjaRegulaminu')}
                        sx={{
                          color: '#4caf50',
                          '&.Mui-checked': { color: '#4caf50' },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        Akceptuję{' '}
                        <Typography 
                          component="a" 
                          href="/regulamin" 
                          sx={{ 
                            color: '#4caf50', 
                            textDecoration: 'underline',
                            '&:hover': { color: '#45a049' }
                          }}
                        >
                          regulamin serwisu
                        </Typography>
                        {' '}oraz{' '}
                        <Typography 
                          component="a" 
                          href="/polityka-prywatnosci" 
                          sx={{ 
                            color: '#4caf50', 
                            textDecoration: 'underline',
                            '&:hover': { color: '#45a049' }
                          }}
                        >
                          politykę prywatności
                        </Typography>
                      </Typography>
                    }
                  />

                  {error && (
                    <Box sx={{ 
                      bgcolor: '#ffebee', 
                      border: '1px solid #f44336',
                      borderRadius: 1,
                      p: 2,
                      mt: 2
                    }}>
                      <Typography color="error" variant="body2">
                        {error}
                      </Typography>
                    </Box>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                    sx={{
                      bgcolor: '#4caf50',
                      '&:hover': { bgcolor: '#45a049' },
                      '&:disabled': { bgcolor: '#cccccc' },
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      mt: 2
                    }}
                  >
                    {loading ? 'Rejestruję...' : 'Zarejestruj parafię'}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Box>

          {/* Right Column - Benefits */}
          <Box sx={{ flex: 1, minWidth: { md: '300px' } }}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              {/* Why Taca.pl Section */}
              <Card elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50', mb: 2 }}>
                    Dlaczego Taca.pl?
                  </Typography>
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 35 }}>
                        <CheckIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Bezpieczne płatności online" 
                        primaryTypographyProps={{ fontSize: '0.9rem' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 35 }}>
                        <CheckIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Automatyczne przelewy" 
                        primaryTypographyProps={{ fontSize: '0.9rem' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 35 }}>
                        <CheckIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Panel zarządzania" 
                        primaryTypographyProps={{ fontSize: '0.9rem' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 35 }}>
                        <CheckIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Raporty i analityka" 
                        primaryTypographyProps={{ fontSize: '0.9rem' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 35 }}>
                        <CheckIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Wsparcie techniczne" 
                        primaryTypographyProps={{ fontSize: '0.9rem' }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>

              {/* Features Section */}
              <Card elevation={2} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50', mb: 2 }}>
                    Funkcjonalności
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <PersonIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                      <Typography variant="body2">Profile parafian</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <PaymentIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                      <Typography variant="body2">Płatności kartą i BLIK</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <AnalyticsIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                      <Typography variant="body2">Statystyki wpłat</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <SecurityIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                      <Typography variant="body2">Bezpieczeństwo danych</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CloudIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                      <Typography variant="body2">Kopie zapasowe</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <SupportIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                      <Typography variant="body2">Wsparcie 24/7</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
