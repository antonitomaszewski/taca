'use client';

import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';

export default function PlatnoscPage() {
  const [kwota, setKwota] = useState('50');
  const [wlasnaKwota, setWlasnaKwota] = useState('');
  const [metoda, setMetoda] = useState('blik');
  const [email, setEmail] = useState('');
  const [podpis, setPodpis] = useState('');
  const [ukryjPodpis, setUkryjPodpis] = useState(false);
  const [zgodaRegulamin, setZgodaRegulamin] = useState(false);
  const [zgodaMarketing, setZgodaMarketing] = useState(false);

  const kwoty = ['10', '20', '50', '100', '200', '500', '1000'];
  const metody = [
    { value: 'blik', label: 'BLIK', icon: '/blik.png' },
    { value: 'karta', label: 'Karta', icon: '/karta.png' },
    { value: 'apple', label: 'Apple Pay', icon: '/applepay.svg' },
    { value: 'google', label: 'Google Pay', icon: '/googlepay.svg' },
    { value: 'paypal', label: 'PayPal', icon: '/paypal.svg.png' },
    // { value: 'przelew', label: 'Przelew', icon: '/przelew.svg' },
  ];

  const wybranaKwota = wlasnaKwota !== '' ? wlasnaKwota : kwota;
  const suma = Number(wybranaKwota || 0);

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Płatność
          </Typography>
          <Button color="inherit" href="/mapa">Mapa</Button>
          <Button color="inherit" href="/kosciol/1">Przykładowy kościół</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: 500 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Wspierasz parafię
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
              sx={{ width: 90 }}
            />
          </Box>
          <Divider sx={{ marginBottom: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Wybierz metodę płatności
          </Typography>
          <RadioGroup
            row
            value={metoda}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMetoda(e.target.value)}
            sx={{ mb: 2 }}
          >
            {metody.map(m => (
              <FormControlLabel
                key={m.value}
                value={m.value}
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <img src={m.icon} alt={m.label} style={{ height: 24, width: 'auto' }} />
                    {m.label}
                  </Box>
                }
              />
            ))}
          </RadioGroup>
          <Divider sx={{ marginBottom: 2 }} />
          <TextField
            fullWidth
            label="E-mail"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Podpis (opcjonalnie)"
            value={podpis}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPodpis(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={<Checkbox checked={ukryjPodpis} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUkryjPodpis(e.target.checked)} />}
            label="Ukryj mój podpis na liście wpłat"
            sx={{ mb: 2 }}
          />
          <Divider sx={{ marginBottom: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Podsumowanie
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <span>Wsparcie parafii</span>
            <span>{suma} zł</span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <span>Wsparcie platformy</span>
            <span>0 zł</span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, mb: 2 }}>
            <span>Łączna wpłata</span>
            <span>{suma} zł</span>
          </Box>
          <FormControlLabel
            control={<Checkbox checked={zgodaRegulamin} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setZgodaRegulamin(e.target.checked)} />}
            label={<span>Akceptuję <a href="#" target="_blank" rel="noopener noreferrer">regulamin</a> i <a href="#" target="_blank" rel="noopener noreferrer">politykę prywatności</a>.</span>}
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            control={<Checkbox checked={zgodaMarketing} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setZgodaMarketing(e.target.checked)} />}
            label={<span>Otrzymuj okazjonalne wiadomości marketingowe.</span>}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={!zgodaRegulamin || suma === 0}
            sx={{ py: 1.5, fontSize: 18 }}
          >
            Wpłać teraz
          </Button>
          <Alert severity="info" sx={{ mt: 2 }}>
            Bezpieczne płatności online
          </Alert>
        </Paper>
      </Box>
    </Box>
  );
}
