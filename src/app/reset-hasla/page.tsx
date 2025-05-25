"use client";
import React, { useState } from "react";
import { 
  Container, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert,
  CircularProgress 
} from '@mui/material';
import { useRouter } from "next/navigation";

export default function ResetHasla() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Proszę podać adres email");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Jeśli podany adres email istnieje w naszej bazie, wysłaliśmy instrukcje resetowania hasła.");
      } else {
        setError(data.error || "Wystąpił błąd podczas wysyłania instrukcji");
      }
    } catch (error) {
      setError("Wystąpił błąd podczas wysyłania instrukcji");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card sx={{ p: 4 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
            Resetowanie hasła
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
            Podaj adres email powiązany z Twoim kontem, a wyślemy Ci instrukcje resetowania hasła.
          </Typography>

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

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Adres email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{ mb: 3 }}
              autoFocus
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mb: 2,
                bgcolor: '#4caf50',
                '&:hover': { bgcolor: '#45a049' },
                py: 1.5
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Wyślij instrukcje'}
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => router.push('/')}
              sx={{ color: '#4caf50' }}
            >
              Powrót do strony głównej
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
