'use client';

import { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Divider, Alert, CircularProgress,
  Radio, RadioGroup, FormControlLabel, Checkbox, ToggleButton, ToggleButtonGroup,
  Slider, InputAdornment
} from '@mui/material';

interface WsparcieFormProps {
  parafiaData: {
    id: string;
    nazwa: string;
    miejscowosc: string;
    // Dodaj inne potrzebne pola jeśli są
  };
}

export default function WsparcieForm({ parafiaData }: WsparcieFormProps) {
  const [kwota, setKwota] = useState('50');
  const [wlasnaKwota, setWlasnaKwota] = useState('');
  const [metoda, setMetoda] = useState('blik');
  const [email, setEmail] = useState('');
  const [podpis, setPodpis] = useState('');
  const [ukryjPodpis, setUkryjPodpis] = useState(false);
  const [zgodaRegulamin, setZgodaRegulamin] = useState(false);
  const [zgodaMarketing, setZgodaMarketing] = useState(false);
  const [typPlatnosci, setTypPlatnosci] = useState<'jednorazowa' | 'abonamentowa'>('jednorazowa');
  const [czestotliwoscAbonamentu, setCzestotliwoscAbonamentu] = useState<'tygodniowo' | 'miesiecznie'>('miesiecznie');
  const [wsparciePlatformy, setWsparciePlatformy] = useState(5); // Domyślnie 5%
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funkcja obsługi płatności
  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Walidacja danych
      if (!email) {
        throw new Error('Email jest wymagany');
      }
      if (!email.includes('@')) {
        throw new Error('Podaj poprawny adres email');
      }
      if (suma === 0) {
        throw new Error('Kwota musi być większa od 0');
      }

      // Przygotowanie danych płatności zgodnych z API
      const paymentData = {
        parishId: parafiaData.id,
        amount: calkowitaKwota, // Łączna kwota w PLN
        donorName: podpis || undefined,
        donorEmail: email,
        message: `Wsparcie parafii ${parafiaData.nazwa} - ${typPlatnosci}${typPlatnosci === 'abonamentowa' ? ` (${czestotliwoscAbonamentu})` : ''}`,
        isAnonymous: ukryjPodpis,
        paymentMethod: metoda,
        isRecurring: typPlatnosci === 'abonamentowa',
        recurringFrequency: typPlatnosci === 'abonamentowa' ? 
          (czestotliwoscAbonamentu === 'tygodniowo' ? 'weekly' : 'monthly') : 
          undefined,
      };

      console.log('Wysyłanie danych płatności:', paymentData);

      // Wywołanie API płatności
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Wystąpił błąd podczas przetwarzania płatności');
      }

      // Przekierowanie do Przelewy24
      if (result.paymentUrl) {
        console.log('Przekierowanie na:', result.paymentUrl);
        window.location.href = result.paymentUrl;
      } else {
        throw new Error('Nie otrzymano adresu przekierowania');
      }
    } catch (err) {
      console.error('Błąd płatności:', err);
      setError(err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd');
    } finally {
      setLoading(false);
    }
  };

  const kwoty = ['10', '20', '50', '100', '200', '500', '1000'];
  const metody = [
    { value: 'blik', label: 'BLIK', icon: '/blik.png', abonamentowa: true },
    { value: 'karta', label: 'Karta', icon: '/karta.png', abonamentowa: true },
    { value: 'apple', label: 'Apple Pay', icon: '/applepay.svg', abonamentowa: true },
    { value: 'google', label: 'Google Pay', icon: '/googlepay.svg', abonamentowa: true },
    { value: 'paypal', label: 'PayPal', icon: '/paypal.svg.png', abonamentowa: true },
    { value: 'ing', label: 'Ing', icon: '/ing.svg', abonamentowa: false },
  ];

  const metodyWidoczne = metody.filter(m => typPlatnosci === 'jednorazowa' || m.abonamentowa);

  const wybranaKwota = wlasnaKwota !== '' ? wlasnaKwota : kwota;
  const suma = Number(wybranaKwota || 0);
  const kwotaWsparciaPlatformy = Math.round((suma * wsparciePlatformy / 100) * 100) / 100;
  const calkowitaKwota = suma + kwotaWsparciaPlatformy;

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Przełącznik typu płatności */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <ToggleButtonGroup
            value={typPlatnosci}
            exclusive
            onChange={(_e, value) => value && setTypPlatnosci(value)}
            aria-label="typ płatności"
            size="large"
            sx={{
              '& .MuiToggleButton-root': {
                color: '#4caf50',
                borderColor: '#4caf50',
                '&.Mui-selected': {
                  backgroundColor: '#4caf50',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#45a049',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(76, 175, 80, 0.04)',
                },
              },
            }}
          >
            <ToggleButton value="jednorazowa">Jednorazowa</ToggleButton>
            <ToggleButton value="abonamentowa">Abonamentowa</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        {/* Częstotliwość abonamentu - pokazuj tylko dla płatności abonamentowych */}
        {typPlatnosci === 'abonamentowa' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <ToggleButtonGroup
              value={czestotliwoscAbonamentu}
              exclusive
              onChange={(_e, value) => value && setCzestotliwoscAbonamentu(value)}
              aria-label="częstotliwość abonamentu"
              size="medium"
              sx={{
                '& .MuiToggleButton-root': {
                  color: '#4caf50',
                  borderColor: '#4caf50',
                  '&.Mui-selected': {
                    backgroundColor: '#4caf50',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#45a049',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(76, 175, 80, 0.04)',
                  },
                },
              }}
            >
              <ToggleButton value="tygodniowo">Co tydzień</ToggleButton>
              <ToggleButton value="miesiecznie">Co miesiąc</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}
        
        <Typography variant="h5" sx={{ mb: 2 }}>
          Wspierasz {parafiaData.nazwa}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {parafiaData.miejscowosc}
        </Typography>
        
        <Divider sx={{ marginBottom: 2 }} />
        
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Wybierz kwotę
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {kwoty.map(k => (
            <Button
              key={k}
              variant={kwota === k && wlasnaKwota === '' ? 'contained' : 'outlined'}
              onClick={() => { setKwota(k); setWlasnaKwota(''); }}
              sx={{
                color: kwota === k && wlasnaKwota === '' ? 'white' : '#4caf50',
                backgroundColor: kwota === k && wlasnaKwota === '' ? '#4caf50' : 'transparent',
                borderColor: '#4caf50',
                '&:hover': {
                  backgroundColor: kwota === k && wlasnaKwota === '' ? '#45a049' : 'rgba(76, 175, 80, 0.04)',
                },
              }}
            >
              {k} zł
            </Button>
          ))}
          <TextField
            size="small"
            placeholder="inna"
            value={wlasnaKwota}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWlasnaKwota(e.target.value.replace(/[^0-9]/g, ''))}
            InputProps={{
              endAdornment: <InputAdornment position="end">zł</InputAdornment>,
            }}
            sx={{ 
              width: 90,
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#4caf50',
                },
              },
            }}
          />
        </Box>
        
        {/* Sekcja wsparcia platformy */}
        <Divider sx={{ marginBottom: 2 }} />
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Wsparcie platformy Taca.pl (dobrowolne)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Pomóż nam rozwijać platformę i docierać do większej liczby parafii. Twoje wsparcie pozwala nam utrzymać bezpłatne usługi dla wszystkich użytkowników.
        </Typography>
        <Box sx={{ px: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2">Wsparcie platformy:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
              {wsparciePlatformy}% ({kwotaWsparciaPlatformy.toFixed(2)} zł)
            </Typography>
          </Box>
          <Slider
            value={wsparciePlatformy}
            onChange={(_e, value) => setWsparciePlatformy(value as number)}
            min={0}
            max={20}
            step={1}
            marks={[
              { value: 0, label: '0%' },
              { value: 5, label: '5%' },
              { value: 10, label: '10%' },
              { value: 15, label: '15%' },
              { value: 20, label: '20%' }
            ]}
            sx={{
              color: '#4caf50',
              '& .MuiSlider-thumb': {
                backgroundColor: '#4caf50',
              },
              '& .MuiSlider-track': {
                backgroundColor: '#4caf50',
              },
              '& .MuiSlider-rail': {
                backgroundColor: '#e0e0e0',
              },
              '& .MuiSlider-mark': {
                backgroundColor: '#bfbfbf',
              },
              '& .MuiSlider-markLabel': {
                fontSize: '0.75rem',
              },
            }}
          />
        </Box>
        
        <Divider sx={{ marginBottom: 2 }} />
        
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Wybierz metodę płatności
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 3,
            mb: 2,
            justifyItems: 'center',
          }}
        >
          {metodyWidoczne.map(m => (
            <Box key={m.value}>
              <FormControlLabel
                value={m.value}
                control={<Radio sx={{ display: 'none' }} />}
                label={
                  <Box
                    sx={{
                      border: metoda === m.value ? '2px solid #4caf50' : '2px solid #e0e0e0',
                      borderRadius: 2,
                      p: 2,
                      cursor: 'pointer',
                      background: metoda === m.value ? '#e8f5e8' : '#fff',
                      transition: 'border 0.2s, background 0.2s',
                      boxShadow: metoda === m.value ? 2 : 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 80,
                      width: 110,
                      overflow: 'hidden',
                    }}
                    onClick={() => setMetoda(m.value)}
                  >
                    <img
                      src={m.icon}
                      alt={m.label}
                      style={{
                        maxHeight: 48,
                        maxWidth: 80,
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain',
                        display: 'block',
                        margin: '0 auto',
                      }}
                    />
                  </Box>
                }
                labelPlacement="top"
                sx={{ m: 0, width: '100%' }}
                checked={metoda === m.value}
              />
            </Box>
          ))}
        </Box>
        
        <Divider sx={{ marginBottom: 2 }} />
        
        <TextField
          fullWidth
          label="E-mail"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#4caf50',
              },
            },
            '& .MuiInputLabel-root': {
              '&.Mui-focused': {
                color: '#4caf50',
              },
            },
          }}
        />
        <TextField
          fullWidth
          label="Podpis (opcjonalnie)"
          value={podpis}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPodpis(e.target.value)}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#4caf50',
              },
            },
            '& .MuiInputLabel-root': {
              '&.Mui-focused': {
                color: '#4caf50',
              },
            },
          }}
        />
        <FormControlLabel
          control={
            <Checkbox 
              checked={ukryjPodpis} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUkryjPodpis(e.target.checked)}
              sx={{
                color: '#4caf50',
                '&.Mui-checked': {
                  color: '#4caf50',
                },
              }}
            />
          }
          label="Ukryj mój podpis na liście wpłat"
          sx={{ mb: 2 }}
        />
        
        <Divider sx={{ marginBottom: 2 }} />
        
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Podsumowanie
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <span>Wsparcie parafii {typPlatnosci === 'abonamentowa' ? `(${czestotliwoscAbonamentu})` : ''}</span>
          <span>{suma.toFixed(2)} zł</span>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <span>Wsparcie platformy Taca.pl</span>
          <span>{kwotaWsparciaPlatformy.toFixed(2)} zł</span>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, mb: 2 }}>
          <span>Łączna wpłata</span>
          <span>{calkowitaKwota.toFixed(2)} zł</span>
        </Box>
        
        <FormControlLabel
          control={
            <Checkbox 
              checked={zgodaRegulamin} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setZgodaRegulamin(e.target.checked)}
              sx={{
                color: '#4caf50',
                '&.Mui-checked': {
                  color: '#4caf50',
                },
              }}
            />
          }
          label={<span>Akceptuję <a href="#" target="_blank" rel="noopener noreferrer">regulamin</a> i <a href="#" target="_blank" rel="noopener noreferrer">politykę prywatności</a>.</span>}
          sx={{ mb: 1 }}
        />
        <FormControlLabel
          control={
            <Checkbox 
              checked={zgodaMarketing} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setZgodaMarketing(e.target.checked)}
              sx={{
                color: '#4caf50',
                '&.Mui-checked': {
                  color: '#4caf50',
                },
              }}
            />
          }
          label={<span>Otrzymuj okazjonalne wiadomości marketingowe.</span>}
          sx={{ mb: 2 }}
        />
        
        {/* Wyświetlanie błędów */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={!zgodaRegulamin || suma === 0 || loading}
          onClick={handlePayment}
          sx={{ 
            py: 1.5, 
            fontSize: 18,
            bgcolor: '#4caf50',
            '&:hover': { bgcolor: '#45a049' },
            '&:disabled': {
              bgcolor: '#cccccc',
            }
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              Przetwarzanie...
            </Box>
          ) : (
            typPlatnosci === 'jednorazowa' 
              ? `Wpłać teraz ${calkowitaKwota.toFixed(2)} zł` 
              : `Ustaw abonament ${calkowitaKwota.toFixed(2)} zł ${czestotliwoscAbonamentu}`
          )}
        </Button>
        <Alert severity="info" sx={{ mt: 2 }}>
          Bezpieczne płatności online
        </Alert>
      </Paper>
    </Box>
  );
}