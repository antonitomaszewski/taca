"use client";
import React, { useState } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  TextField,
  Card,
  CardContent
} from '@mui/material';
import { 
  LocationOn as LocationOnIcon,
  PhotoCamera as PhotoCameraIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import Link from 'next/link';

export default function EdycjaParafii() {
  const [formData, setFormData] = useState({
    nazwa: "",
    miejscowosc: "",
    adres: "",
    telefon: "",
    email: "",
    strona: "",
    proboszcz: "",
    opis: "",
    photoUrl: "",
    celKwota: "",
    celOpis: ""
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          photoUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          photoUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Walidacja podstawowych pól
    if (!formData.nazwa || !formData.miejscowosc) {
      alert("Proszę wypełnić przynajmniej nazwę parafii i miejscowość.");
      return;
    }
    
    // Symulacja zapisywania danych
    console.log("Zapisano dane:", formData);
    alert("Profil parafii został pomyślnie zapisany!");
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ px: 0 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#2e7d32', fontWeight: 'bold' }}>
              TACA
            </Typography>
            <Link href="/" passHref>
              <Button sx={{ color: '#2e7d32', mr: 2 }}>Strona główna</Button>
            </Link>
            <Button variant="contained" sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}>
              Zaloguj się
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', color: '#2e7d32', fontWeight: 'bold', mb: 4 }}>
          Edytuj profil parafii
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Section 1: Basic Information */}
          <Card sx={{ bgcolor: '#e8f5e8', border: '2px solid #4caf50' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocationOnIcon sx={{ fontSize: 32, color: '#2e7d32', mr: 2 }} />
                <Typography variant="h5" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                  📍 Podstawowe informacje
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Nazwa parafii"
                  value={formData.nazwa}
                  onChange={handleChange('nazwa')}
                  placeholder="np. Parafia św. Marii Magdaleny"
                  variant="outlined"
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Miejscowość"
                    value={formData.miejscowosc}
                    onChange={handleChange('miejscowosc')}
                    placeholder="np. Wrocław"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Adres"
                    value={formData.adres}
                    onChange={handleChange('adres')}
                    placeholder="ul. Szewska 10, 50-139"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Telefon"
                    value={formData.telefon}
                    onChange={handleChange('telefon')}
                    placeholder="+48 71 344 23 75"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    placeholder="kontakt@parafia.pl"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Strona internetowa"
                    value={formData.strona}
                    onChange={handleChange('strona')}
                    placeholder="www.parafia.pl"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Proboszcz"
                    value={formData.proboszcz}
                    onChange={handleChange('proboszcz')}
                    placeholder="ks. Jan Kowalski"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Section 2: Photo Upload */}
          <Card sx={{ bgcolor: '#e3f2fd', border: '2px solid #2196f3' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PhotoCameraIcon sx={{ fontSize: 32, color: '#1976d2', mr: 2 }} />
                <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                  📸 Dodaj zdjęcie
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  border: '2px dashed #2196f3',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  bgcolor: '#f8fbff',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f0f8ff' },
                  position: 'relative'
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {formData.photoUrl ? (
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <img 
                      src={formData.photoUrl} 
                      alt="Podgląd zdjęcia parafii" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '200px', 
                        borderRadius: '8px',
                        objectFit: 'cover'
                      }} 
                    />
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => setFormData(prev => ({ ...prev, photoUrl: "" }))}
                      sx={{ mt: 1 }}
                    >
                      Usuń zdjęcie
                    </Button>
                  </Box>
                ) : (
                  <>
                    <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>
                      Kliknij lub przeciągnij zdjęcie tutaj
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Dodaj główne zdjęcie parafii (kościół, wnętrze, fasada)
                    </Typography>
                  </>
                )}
                <Button 
                  variant="contained" 
                  sx={{ mt: 2, bgcolor: '#1976d2' }}
                  component="label"
                >
                  {formData.photoUrl ? 'Zmień zdjęcie' : 'Wybierz plik'}
                  <input 
                    type="file" 
                    hidden 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Section 3: Description */}
          <Card sx={{ bgcolor: '#f3e5f5', border: '2px solid #9c27b0' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <DescriptionIcon sx={{ fontSize: 32, color: '#7b1fa2', mr: 2 }} />
                <Typography variant="h5" sx={{ color: '#7b1fa2', fontWeight: 'bold' }}>
                  ✍️ Opisz swoją parafię
                </Typography>
              </Box>
              
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Historia i opis parafii"
                value={formData.opis}
                onChange={handleChange('opis')}
                placeholder="Opowiedz o historii parafii, wspólnocie, ważnych wydarzeniach i tym, co czyni ją wyjątkową..."
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#fafafa'
                  }
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                Im więcej napiszesz o swojej parafii, tym łatwiej będzie ludziom się z nią związać i wesprzeć.
              </Typography>
            </CardContent>
          </Card>

          {/* Section 4: Fundraising */}
          <Card sx={{ bgcolor: '#fff3e0', border: '2px solid #ff9800' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <MoneyIcon sx={{ fontSize: 32, color: '#f57c00', mr: 2 }} />
                <Typography variant="h5" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                  💰 Stwórz zbiórkę
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Kwota potrzebna (PLN)"
                  value={formData.celKwota}
                  onChange={handleChange('celKwota')}
                  placeholder="np. 50000"
                  variant="outlined"
                  type="number"
                  helperText="Podaj kwotę, którą chcesz zebrać na cel parafii"
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Na co potrzebne są pieniądze?"
                  value={formData.celOpis}
                  onChange={handleChange('celOpis')}
                  placeholder="Opisz dokładnie, na co będą przeznaczone zebrane środki (remont, wyposażenie, działalność charytatywna itp.)"
                  variant="outlined"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#fafafa'
                    }
                  }}
                />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Szczegółowy opis pomoże darczyńcom zrozumieć, jak ważne jest ich wsparcie.
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleSave}
              sx={{ 
                bgcolor: '#2e7d32',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { bgcolor: '#1b5e20' }
              }}
            >
              Zapisz profil parafii
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
