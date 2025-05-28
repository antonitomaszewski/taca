"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  AppBar,
  Toolbar,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import Link from "next/link";
import LoginButton from "../components/LoginButton";

export default function UstawieniaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Stan formularza
  const [formData, setFormData] = useState({
    imieNazwisko: '',
    email: '',
    telefon: '',
    noweHaslo: '',
    powtorzNoweHaslo: ''
  });

  // Przekieruj niezalogowanych użytkowników
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Załaduj dane użytkownika
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        imieNazwisko: session.user.name || '',
        email: session.user.email || '',
        telefon: '', // TODO: Dodać telefon do sesji jeśli będzie potrzebny
      }));
    }
  }, [session]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Wyczyść komunikaty przy zmianie
    if (error) setError('');
    if (message) setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Walidacja
    if (!formData.imieNazwisko.trim()) {
      setError('Imię i nazwisko są wymagane');
      return;
    }

    if (!formData.email.trim()) {
      setError('Adres email jest wymagany');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Niepoprawny format adresu email');
      return;
    }

    // Walidacja hasła (jeśli użytkownik chce je zmienić)
    if (formData.noweHaslo || formData.powtorzNoweHaslo) {
      if (formData.noweHaslo.length < 6) {
        setError('Nowe hasło musi mieć co najmniej 6 znaków');
        return;
      }

      if (formData.noweHaslo !== formData.powtorzNoweHaslo) {
        setError('Hasła nie są identyczne');
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imieNazwisko: formData.imieNazwisko,
          email: formData.email,
          telefon: formData.telefon || null,
          noweHaslo: formData.noweHaslo || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas aktualizacji');
      }

      setMessage('Dane zostały pomyślnie zaktualizowane');
      
      // Wyczyść pola hasła
      setFormData(prev => ({
        ...prev,
        noweHaslo: '',
        powtorzNoweHaslo: ''
      }));

      // Opcjonalnie: odśwież sesję jeśli zmieniły się podstawowe dane
      if (formData.email !== session?.user?.email || formData.imieNazwisko !== session?.user?.name) {
        window.location.reload();
      }

    } catch (error) {
      console.error('Błąd aktualizacji profilu:', error);
      setError(error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd');
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === "unauthenticated") {
    return null; // Przekierowanie już się dzieje w useEffect
  }

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
            <LoginButton />
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50', mb: 1 }}>
            Ustawienia konta
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            Zarządzaj swoimi danymi osobowymi i ustawieniami bezpieczeństwa
          </Typography>

          {/* Komunikaty */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {message && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Dane podstawowe */}
            <Typography variant="h6" sx={{ mb: 2, color: '#4caf50' }}>
              Dane podstawowe
            </Typography>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Imię i nazwisko"
                value={formData.imieNazwisko}
                onChange={handleInputChange('imieNazwisko')}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Adres email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Telefon (opcjonalnie)"
                value={formData.telefon}
                onChange={handleInputChange('telefon')}
                sx={{ mb: 2 }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Zmiana hasła */}
            <Typography variant="h6" sx={{ mb: 2, color: '#4caf50' }}>
              Zmiana hasła
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              Pozostaw puste, jeśli nie chcesz zmieniać hasła
            </Typography>

            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                label="Nowe hasło"
                type="password"
                value={formData.noweHaslo}
                onChange={handleInputChange('noweHaslo')}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Powtórz nowe hasło"
                type="password"
                value={formData.powtorzNoweHaslo}
                onChange={handleInputChange('powtorzNoweHaslo')}
                sx={{ mb: 2 }}
              />
            </Box>

            {/* Przyciski */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => router.back()}
                sx={{ 
                  borderColor: '#4caf50', 
                  color: '#4caf50',
                  '&:hover': { borderColor: '#45a049', bgcolor: 'rgba(76, 175, 80, 0.04)' }
                }}
              >
                Anuluj
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: '#4caf50',
                  '&:hover': { bgcolor: '#45a049' },
                  '&:disabled': { bgcolor: '#ccc' }
                }}
              >
                {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
