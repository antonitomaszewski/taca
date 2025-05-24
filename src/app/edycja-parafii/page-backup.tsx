"use client";
import React, { useState } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Paper, 
  Box, 
  Container,
  TextField,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import { 
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
  PhotoCamera as PhotoCameraIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import Link from 'next/link';

export default function EdycjaParafii() {
  const [formData, setFormData] = useState({
    nazwa: "Parafia św. Marii Magdaleny",
    miejscowosc: "Wrocław",
    adres: "ul. Szewska 10, 50-139 Wrocław",
    telefon: "+48 71 344 23 75",
    email: "kontakt@swmaria.wroclaw.pl",
    strona: "www.swmaria.wroclaw.pl",
    proboszcz: "ks. Jan Kowalski",
    rozkladMszy: "Niedz: 8:00, 10:00, 12:00, 18:00",
    opis: "Parafia św. Marii Magdaleny we Wrocławiu to jedna z najstarszych parafii w mieście. Od wieków służy mieszkańcom centrum miasta, organizując życie religijne i społeczne. Nasz kościół jest zabytkiem architektury gotyckiej.",
    photoUrl: "/katedra_wroclaw.jpg",
    zebrane: 15000,
    cel: 50000,
    wspierajacy: 45,
    cele: [
      {
        id: 1,
        tytul: "Remont dachu",
        opis: "Pilny remont przeciekającego dachu kościoła",
        kwotaCel: 30000,
        kwotaZebrana: 12000,
        aktywny: true
      },
      {
        id: 2,
        tytul: "Nowe organy",
        opis: "Zakup nowych organów do liturgii",
        kwotaCel: 20000,
        kwotaZebrana: 3000,
        aktywny: true
      }
    ],
    ostatnieWsparcia: [
      { nazwa: "Anna K.", kwota: 100, czas: "2 dni temu" },
      { nazwa: "Piotr M.", kwota: 250, czas: "3 dni temu" },
      { nazwa: "Maria W.", kwota: 50, czas: "1 tydzień temu" }
    ]
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleCelChange = (index: number, field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCele = [...formData.cele];
    newCele[index] = {
      ...newCele[index],
      [field]: field.includes('kwota') ? parseInt(e.target.value) || 0 : e.target.value
    };
    setFormData(prev => ({ ...prev, cele: newCele }));
  };

  const addCel = () => {
    const newCel = {
      id: Date.now(),
      tytul: "Nowy cel",
      opis: "Opis nowego celu",
      kwotaCel: 10000,
      kwotaZebrana: 0,
      aktywny: true
    };
    setFormData(prev => ({ ...prev, cele: [...prev.cele, newCel] }));
  };

  const deleteCel = (index: number) => {
    const newCele = formData.cele.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, cele: newCele }));
  };

  const handleSubmit = () => {
    console.log("Zapisywanie danych parafii:", formData);
    alert("Dane parafii zostały zapisane! (demo)");
  };

  // Wyliczenia postępu i kwot
  const postep = (formData.zebrane / formData.cel) * 100;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
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
            <Button 
              variant="outlined"
              sx={{ 
                mr: 2,
                fontWeight: 500,
                borderColor: '#4caf50',
                color: '#4caf50',
                '&:hover': { 
                  borderColor: '#45a049',
                  color: '#45a049'
                }
              }}
            >
              Anuluj
            </Button>
            <Button 
              variant="contained"
              onClick={handleSubmit}
              sx={{ 
                fontWeight: 500,
                bgcolor: '#4caf50',
                color: 'white',
                '&:hover': { bgcolor: '#45a049' }
              }}
            >
              Zapisz zmiany
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 4, pb: 2 }}>
        <Box sx={{ 
          position: 'relative', 
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: 4,
          mb: 4,
          border: '2px dashed #ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          '&:hover': {
            borderColor: '#4caf50',
            bgcolor: 'rgba(76, 175, 80, 0.05)'
          }
        }}>
          <Image
            src={formData.photoUrl}
            alt={formData.nazwa}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
              display: 'flex',
              alignItems: 'end',
              p: 4,
            }}
          >
            <Box sx={{ width: '100%' }}>
              <TextField
                value={formData.nazwa}
                onChange={handleChange('nazwa')}
                variant="filled"
                fullWidth
                sx={{
                  mb: 2,
                  '& .MuiFilledInput-root': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' },
                    '&.Mui-focused': { bgcolor: 'white' }
                  },
                  '& .MuiInputLabel-root': { color: '#333' },
                  '& .MuiFilledInput-input': { 
                    fontSize: '2rem', 
                    fontWeight: 700,
                    color: '#333'
                  }
                }}
                label="Nazwa parafii"
              />
              <TextField
                value={formData.miejscowosc}
                onChange={handleChange('miejscowosc')}
                variant="filled"
                fullWidth
                sx={{
                  '& .MuiFilledInput-root': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' },
                    '&.Mui-focused': { bgcolor: 'white' }
                  },
                  '& .MuiInputLabel-root': { color: '#333' },
                  '& .MuiFilledInput-input': { 
                    fontSize: '1.25rem',
                    color: '#333'
                  }
                }}
                label="Miejscowość"
                InputProps={{
                  startAdornment: <LocationOnIcon sx={{ mr: 1, color: '#333' }} />
                }}
              />
            </Box>
          </Box>
          
          {/* Photo Upload Button */}
          <IconButton
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'rgba(76, 175, 80, 0.9)',
              color: 'white',
              '&:hover': { bgcolor: '#4caf50' }
            }}
          >
            <PhotoCamera />
          </IconButton>
        </Box>
      </Container>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6 }}>
          {/* Left Column - Main Info */}
          <Box sx={{ flex: { xs: 1, md: 2 } }}>
            {/* Progress Section */}
            <Paper sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                Postęp zbiórki
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  Zebrano
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {postep.toFixed(1)}%
                </Typography>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={Math.min(postep, 100)}
                sx={{
                  height: 16,
                  borderRadius: 8,
                  mb: 3,
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: postep >= 100 ? '#4caf50' : '#2196f3',
                    borderRadius: 8,
                  },
                }}
              />
              
              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <TextField
                    value={formData.zebrane}
                    onChange={(e) => setFormData(prev => ({ ...prev, zebrane: parseInt(e.target.value) || 0 }))}
                    type="number"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1, width: '120px' }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    zebrano (zł)
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <TextField
                    value={formData.cel}
                    onChange={(e) => setFormData(prev => ({ ...prev, cel: parseInt(e.target.value) || 0 }))}
                    type="number"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1, width: '120px' }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    cel (zł)
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <TextField
                    value={formData.wspierajacy}
                    onChange={(e) => setFormData(prev => ({ ...prev, wspierajacy: parseInt(e.target.value) || 0 }))}
                    type="number"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1, width: '120px' }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    wspierających
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  disabled
                  sx={{
                    bgcolor: '#e0e0e0',
                    color: '#999',
                    py: 2,
                    px: 6,
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    borderRadius: 3,
                  }}
                >
                  Wesprzyj parafię (podgląd)
                </Button>
              </Box>
            </Paper>

            {/* Description */}
            <Paper sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
                O parafii
              </Typography>
              <TextField
                value={formData.opis}
                onChange={handleChange('opis')}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                placeholder="Opisz swoją parafię..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                }}
              />
            </Paper>

            {/* Goals */}
            <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  Cele zbiórki
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addCel}
                  variant="outlined"
                  sx={{
                    borderColor: '#4caf50',
                    color: '#4caf50',
                    '&:hover': { borderColor: '#45a049', color: '#45a049' }
                  }}
                >
                  Dodaj cel
                </Button>
              </Box>
              
              {formData.cele.map((cel, index) => {
                const celPostep = cel.kwotaCel > 0 ? (cel.kwotaZebrana / cel.kwotaCel) * 100 : 0;
                return (
                  <Box key={cel.id} sx={{ mb: 4, pb: 4, borderBottom: '1px solid #e0e0e0', '&:last-child': { border: 'none', mb: 0, pb: 0 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flex: 1, mr: 2 }}>
                        <TextField
                          value={cel.tytul}
                          onChange={handleCelChange(index, 'tytul')}
                          variant="outlined"
                          fullWidth
                          size="small"
                          sx={{ mb: 2 }}
                          placeholder="Tytuł celu"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip
                          label={cel.aktywny ? 'Aktywny' : 'Zakończony'}
                          color={cel.aktywny ? 'success' : 'default'}
                          size="small"
                          onClick={() => {
                            const newCele = [...formData.cele];
                            newCele[index].aktywny = !newCele[index].aktywny;
                            setFormData(prev => ({ ...prev, cele: newCele }));
                          }}
                          sx={{ cursor: 'pointer' }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => deleteCel(index)}
                          sx={{ color: '#f44336' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <TextField
                      value={cel.opis}
                      onChange={handleCelChange(index, 'opis')}
                      multiline
                      rows={2}
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{ mb: 3 }}
                      placeholder="Opis celu"
                    />
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          value={cel.kwotaZebrana}
                          onChange={handleCelChange(index, 'kwotaZebrana')}
                          type="number"
                          variant="outlined"
                          size="small"
                          fullWidth
                          label="Zebrano (zł)"
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          value={cel.kwotaCel}
                          onChange={handleCelChange(index, 'kwotaCel')}
                          type="number"
                          variant="outlined"
                          size="small"
                          fullWidth
                          label="Cel (zł)"
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2">
                        {cel.kwotaZebrana.toLocaleString()} zł / {cel.kwotaCel.toLocaleString()} zł
                      </Typography>
                      <Typography variant="body2">
                        {celPostep.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(celPostep, 100)}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        bgcolor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: cel.aktywny ? '#4caf50' : '#9e9e9e',
                          borderRadius: 6,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Paper>
          </Box>

          {/* Right Column - Sidebar */}
          <Box sx={{ flex: { xs: 1, md: 1 }, maxWidth: { md: 400 } }}>
            {/* Contact Info */}
            <Paper sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Kontakt
              </Typography>
              <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0, py: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
                    <LocationOnIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 28 }} />
                    <Typography variant="body2" color="text.secondary">Adres</Typography>
                  </Box>
                  <TextField
                    value={formData.adres}
                    onChange={handleChange('adres')}
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiline
                    rows={2}
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0, py: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
                    <PhoneIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 28 }} />
                    <Typography variant="body2" color="text.secondary">Telefon</Typography>
                  </Box>
                  <TextField
                    value={formData.telefon}
                    onChange={handleChange('telefon')}
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="+48 xxx xxx xxx"
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0, py: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
                    <EmailIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 28 }} />
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                  </Box>
                  <TextField
                    value={formData.email}
                    onChange={handleChange('email')}
                    variant="outlined"
                    size="small"
                    fullWidth
                    type="email"
                    placeholder="email@parafia.pl"
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0, py: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
                    <LanguageIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 28 }} />
                    <Typography variant="body2" color="text.secondary">Strona www</Typography>
                  </Box>
                  <TextField
                    value={formData.strona}
                    onChange={handleChange('strona')}
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="www.parafia.pl"
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0, py: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
                    <PersonIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 28 }} />
                    <Typography variant="body2" color="text.secondary">Proboszcz</Typography>
                  </Box>
                  <TextField
                    value={formData.proboszcz}
                    onChange={handleChange('proboszcz')}
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="ks. Jan Kowalski"
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0, py: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
                    <AccessTimeIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 28 }} />
                    <Typography variant="body2" color="text.secondary">Rozkład mszy</Typography>
                  </Box>
                  <TextField
                    value={formData.rozkladMszy}
                    onChange={handleChange('rozkladMszy')}
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Niedz: 8:00, 10:00, 12:00"
                  />
                </ListItem>
              </List>
            </Paper>

            {/* Recent Donations Preview */}
            <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Ostatnie wpłaty (podgląd)
              </Typography>
              <List sx={{ p: 0 }}>
                {formData.ostatnieWsparcia.map((wsparcie, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 2 }}>
                    <Avatar sx={{ mr: 3, width: 40, height: 40, bgcolor: '#e3f2fd' }}>
                      {wsparcie.nazwa.charAt(0).toUpperCase()}
                    </Avatar>
                    <ListItemText
                      primary={wsparcie.nazwa}
                      secondary={`${wsparcie.kwota} zł • ${wsparcie.czas}`}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Ta sekcja będzie automatycznie aktualizowana po otrzymaniu wpłat.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
