/**
 * Główny widok rejestracji z dwoma opcjami:
 * 1. Konto parafianina - jednoetapowa rejestracja
 * 2. Konto parafii - dwuetapowa rejestracja (dane użytkownika + dane parafii)
 */
"use client";
import React, { useState } from "react";
import {
  Container,
  Paper,
  Button,
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
  Divider,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import Link from "next/link";
import CheckIcon from '@mui/icons-material/Check';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SecurityIcon from '@mui/icons-material/Security';
import SupportIcon from '@mui/icons-material/Support';
import CloudIcon from '@mui/icons-material/Cloud';
import AccountTypeSelection from '@/components/AccountTypeSelection';
import UserDataForm from '@/components/UserDataForm';
import ParishDataForm from '@/components/ParishDataForm';
import { 
  ACCOUNT_TYPES, 
  AccountType, 
  REGISTRATION_STEPS 
} from '@/constants/accountTypes';

export default function RejestracjaParafii() {
  // Stan wyboru typu konta
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType | null>(null);
  
  // Stan kroków rejestracji
  const [currentStep, setCurrentStep] = useState(0);
  
  // Stan danych użytkownika (pierwszy etap)
  const [userFormData, setUserFormData] = useState({
    imieNazwisko: "",
    email: "",
    telefon: "",
    haslo: "",
    powtorzHaslo: "",
    akceptacjaRegulaminu: false
  });

  // Stan danych parafii (drugi etap - tylko dla proboszczów)
  const [parishFormData, setParishFormData] = useState({
    nazwaParafii: "",
    adresParafii: "",
    miastoParafii: "",
    kodPocztowyParafii: "",
    telefonParafii: "",
    emailParafii: "",
    stronkaParafii: "",
    opisParafii: "",
    proboszczParafii: "",
    godzinyMsz: "",
    numerKonta: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Obsługa zmian w formularzach
  const handleUserDataChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserFormData(prev => ({
      ...prev,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    }));
    // Wyczyść błąd gdy użytkownik zaczyna pisać
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleParishDataChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setParishFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Wyczyść błąd gdy użytkownik zaczyna pisać
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Walidacja danych użytkownika
  const validateUserData = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!userFormData.imieNazwisko.trim()) {
      newErrors.imieNazwisko = "Imię i nazwisko są wymagane";
    }

    if (!userFormData.email.trim()) {
      newErrors.email = "Adres email jest wymagany";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userFormData.email)) {
      newErrors.email = "Niepoprawny format adresu email";
    }

    if (!userFormData.haslo) {
      newErrors.haslo = "Hasło jest wymagane";
    } else if (userFormData.haslo.length < 6) {
      newErrors.haslo = "Hasło musi mieć co najmniej 6 znaków";
    }

    if (userFormData.haslo !== userFormData.powtorzHaslo) {
      newErrors.powtorzHaslo = "Hasła nie są identyczne";
    }

    if (!userFormData.akceptacjaRegulaminu) {
      newErrors.akceptacjaRegulaminu = "Musisz zaakceptować regulamin";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Walidacja danych parafii
  const validateParishData = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!parishFormData.nazwaParafii.trim()) {
      newErrors.nazwaParafii = "Nazwa parafii jest wymagana";
    }

    if (!parishFormData.adresParafii.trim()) {
      newErrors.adresParafii = "Adres parafii jest wymagany";
    }

    if (!parishFormData.miastoParafii.trim()) {
      newErrors.miastoParafii = "Miasto jest wymagane";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Przejście do następnego kroku
  const handleNextStep = () => {
    if (currentStep === 0 && !validateUserData()) {
      return;
    }

    if (selectedAccountType === ACCOUNT_TYPES.PARISHIONER) {
      // Dla parafianina - od razu wyślij rejestrację
      handleSubmitParishioner();
    } else {
      // Dla proboszcza - przejdź do następnego kroku
      setCurrentStep(1);
    }
  };

  // Powrót do poprzedniego kroku
  const handlePrevStep = () => {
    setCurrentStep(0);
  };

  // Rejestracja parafianina
  const handleSubmitParishioner = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountType: ACCOUNT_TYPES.PARISHIONER,
          userData: userFormData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas rejestracji');
      }

      alert('Rejestracja przebiegła pomyślnie! Możesz się teraz zalogować.');
      window.location.href = "/login";
      
    } catch (error) {
      console.error('❌ Błąd rejestracji parafianina:', error);
      setErrors({ general: error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd' });
    } finally {
      setLoading(false);
    }
  };

  // Rejestracja proboszcza z parafią
  const handleSubmitParishAdmin = async () => {
    if (!validateParishData()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountType: ACCOUNT_TYPES.PARISH_ADMIN,
          userData: userFormData,
          parishData: parishFormData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas rejestracji');
      }

      alert('Rejestracja przebiegła pomyślnie! Możesz teraz edytować szczegóły swojej parafii.');
      window.location.href = "/edycja-parafii";
      
    } catch (error) {
      console.error('❌ Błąd rejestracji proboszcza:', error);
      setErrors({ general: error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd' });
    } finally {
      setLoading(false);
    }
  };

  // Renderowanie formularza w zależności od etapu
  const renderFormContent = () => {
    if (!selectedAccountType) {
      return (
        <AccountTypeSelection
          selectedType={selectedAccountType}
          onTypeChange={setSelectedAccountType}
        />
      );
    }

    if (currentStep === 0) {
      return (
        <UserDataForm
          accountType={selectedAccountType}
          formData={userFormData}
          onChange={handleUserDataChange}
          errors={errors}
        />
      );
    }

    if (currentStep === 1 && selectedAccountType === ACCOUNT_TYPES.PARISH_ADMIN) {
      return (
        <ParishDataForm
          formData={parishFormData}
          onChange={handleParishDataChange}
          errors={errors}
        />
      );
    }

    return null;
  };

  // Renderowanie przycisków nawigacji
  const renderNavigationButtons = () => {
    if (!selectedAccountType) {
      return null;
    }

    const isLastStep = selectedAccountType === ACCOUNT_TYPES.PARISHIONER || 
                      (selectedAccountType === ACCOUNT_TYPES.PARISH_ADMIN && currentStep === 1);

    return (
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={() => {
            if (currentStep > 0) {
              handlePrevStep();
            } else {
              setSelectedAccountType(null);
              setCurrentStep(0);
            }
          }}
          sx={{ 
            borderColor: '#4caf50', 
            color: '#4caf50',
            '&:hover': { borderColor: '#45a049', bgcolor: 'rgba(76, 175, 80, 0.04)' }
          }}
        >
          {currentStep > 0 ? 'Poprzedni krok' : 'Zmień typ konta'}
        </Button>

        <Button
          variant="contained"
          onClick={isLastStep ? 
            (selectedAccountType === ACCOUNT_TYPES.PARISHIONER ? handleSubmitParishioner : handleSubmitParishAdmin) : 
            handleNextStep
          }
          disabled={loading}
          sx={{
            bgcolor: '#4caf50',
            '&:hover': { bgcolor: '#45a049' },
            '&:disabled': { bgcolor: '#ccc' }
          }}
        >
          {loading ? 'Rejestruję...' : (isLastStep ? 'Zarejestruj się' : 'Dalej')}
        </Button>
      </Box>
    );
  };

  // Renderowanie steppera dla proboszczów
  const renderStepper = () => {
    if (!selectedAccountType || selectedAccountType === ACCOUNT_TYPES.PARISHIONER) {
      return null;
    }

    const steps = ['Twoje dane', 'Dane parafii'];

    return (
      <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    );
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
                Rejestracja
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                {selectedAccountType ? 
                  (selectedAccountType === ACCOUNT_TYPES.PARISHIONER ? 
                    'Stwórz konto parafianina, aby wspierać parafie' :
                    'Stwórz konto parafii i zarządzaj wpłatami'
                  ) :
                  'Wybierz typ konta, aby rozpocząć rejestrację'
                }
              </Typography>

              {/* Stepper dla proboszczów */}
              {renderStepper()}

              {/* Wyświetlenie błędów globalnych */}
              {errors.general && (
                <Box sx={{ mb: 3, p: 2, bgcolor: '#ffebee', borderRadius: 1, border: '1px solid #ffcdd2' }}>
                  <Typography color="error" variant="body2">
                    {errors.general}
                  </Typography>
                </Box>
              )}

              {/* Zawartość formularza */}
              {renderFormContent()}

              {/* Przyciski nawigacji */}
              {renderNavigationButtons()}
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
