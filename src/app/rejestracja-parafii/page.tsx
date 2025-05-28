/**
 * Główny widok rejestracji z dwoma opcjami:
 * 1. Konto parafianina - jednoetapowa rejestracja
 * 2. Konto parafii - dwuetapowa rejestracja (dane użytkownika + dane parafii)
 */
"use client";
import React, { useState, useRef } from "react";
import { signIn } from "next-auth/react";
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
  // Ref do przewijania na górę
  const formRef = useRef<HTMLDivElement>(null);
  
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
    identyfikatorParafii: "",
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
    numerKonta: "",
    zdjecieParafii: null as File | null,
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Funkcja przewijania na górę strony
  const scrollToTop = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Wyczyść komunikaty przy zmianie danych
  const clearMessages = () => {
    setErrors({});
    setSuccessMessage('');
  };

  // Obsługa zmian w formularzach
  const handleUserDataChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserFormData(prev => ({
      ...prev,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    }));
    
    // Wyczyść komunikaty gdy użytkownik zaczyna pisać
    if (errors[field] || errors.general || successMessage) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        delete newErrors.general;
        return newErrors;
      });
      setSuccessMessage('');
    }
  };

  const handleParishDataChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setParishFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Wyczyść komunikaty gdy użytkownik zaczyna pisać
    if (errors[field] || errors.general || successMessage) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        delete newErrors.general;
        return newErrors;
      });
      setSuccessMessage('');
    }

    // Geokodowanie dla pól adresowych (z debouncing)
    if (field === 'miastoParafii' || field === 'adresParafii') {
      // Wyczyść poprzedni timeout
      if (geocodingTimeout) {
        clearTimeout(geocodingTimeout);
      }
      
      // Ustaw nowy timeout - geokoduj po 1 sekundzie od ostatniej zmiany
      const newTimeout = setTimeout(() => {
        const currentCity = field === 'miastoParafii' ? e.target.value : parishFormData.miastoParafii;
        const currentAddress = field === 'adresParafii' ? e.target.value : parishFormData.adresParafii;
        geocodeAddress(currentCity, currentAddress);
      }, 1000);
      
      setGeocodingTimeout(newTimeout);
    }
  };

  const handleParishFileChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setParishFormData(prev => ({
      ...prev,
      [field]: file
    }));
    // Wyczyść błąd gdy użytkownik wybiera plik
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Obsługa zmiany lokalizacji na mapie
  const handleLocationChange = (lat: number, lng: number) => {
    setParishFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  // Automatyczne geokodowanie przy zmianie adresu
  const [geocodingTimeout, setGeocodingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Funkcja geokodowania adresu
  const geocodeAddress = async (city: string, address: string) => {
    if (!city.trim()) return;

    try {
      // Buduj zapytanie adresowe
      let searchQuery = city.trim();
      if (address.trim()) {
        searchQuery = `${address.trim()}, ${city.trim()}`;
      }
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&countrycodes=pl`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        
        handleLocationChange(lat, lng);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  // Walidacja danych użytkownika
  const validateUserData = (): boolean => {
    clearMessages();
    const newErrors: Record<string, string> = {};

    if (!userFormData.imieNazwisko.trim()) {
      newErrors.imieNazwisko = "Imię i nazwisko są wymagane";
    } else if (userFormData.imieNazwisko.trim().length < 2) {
      newErrors.imieNazwisko = "Imię i nazwisko musi mieć co najmniej 2 znaki";
    }

    if (!userFormData.email.trim()) {
      newErrors.email = "Adres email jest wymagany";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userFormData.email)) {
      newErrors.email = "Niepoprawny format adresu email (przykład: jan@example.com)";
    }

    if (!userFormData.telefon.trim()) {
      newErrors.telefon = "Numer telefonu jest wymagany";
    } else if (!/^[+]?[0-9\s-()]{9,15}$/.test(userFormData.telefon.trim())) {
      newErrors.telefon = "Niepoprawny format numeru telefonu (9-15 cyfr)";
    }

    if (!userFormData.haslo) {
      newErrors.haslo = "Hasło jest wymagane";
    } else if (userFormData.haslo.length < 8) {
      newErrors.haslo = "Hasło musi mieć co najmniej 8 znaków";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(userFormData.haslo)) {
      newErrors.haslo = "Hasło musi zawierać małą literę, wielką literę i cyfrę";
    }

    if (!userFormData.powtorzHaslo) {
      newErrors.powtorzHaslo = "Powtórzenie hasła jest wymagane";
    } else if (userFormData.haslo !== userFormData.powtorzHaslo) {
      newErrors.powtorzHaslo = "Hasła nie są identyczne";
    }

    if (!userFormData.akceptacjaRegulaminu) {
      newErrors.akceptacjaRegulaminu = "Musisz zaakceptować regulamin, aby kontynuować";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      scrollToTop();
    }
    
    return Object.keys(newErrors).length === 0;
  };

  // Walidacja danych parafii
  const validateParishData = (): boolean => {
    clearMessages();
    const newErrors: Record<string, string> = {};

    if (!parishFormData.identyfikatorParafii.trim()) {
      newErrors.identyfikatorParafii = "Identyfikator parafii jest wymagany";
    } else if (parishFormData.identyfikatorParafii.length < 3) {
      newErrors.identyfikatorParafii = "Identyfikator musi mieć co najmniej 3 znaki";
    } else if (!/^[a-z0-9-]+$/.test(parishFormData.identyfikatorParafii)) {
      newErrors.identyfikatorParafii = "Identyfikator może zawierać tylko małe litery, cyfry i myślniki (przykład: sw-marcin-wroclaw)";
    }

    if (!parishFormData.nazwaParafii.trim()) {
      newErrors.nazwaParafii = "Nazwa parafii jest wymagana";
    } else if (parishFormData.nazwaParafii.trim().length < 5) {
      newErrors.nazwaParafii = "Nazwa parafii musi mieć co najmniej 5 znaków";
    }

    if (!parishFormData.proboszczParafii.trim()) {
      newErrors.proboszczParafii = "Imię i nazwisko proboszcza jest wymagane";
    }

    if (!parishFormData.adresParafii.trim()) {
      newErrors.adresParafii = "Adres parafii jest wymagany";
    }

    if (!parishFormData.miastoParafii.trim()) {
      newErrors.miastoParafii = "Miasto jest wymagane";
    }

    if (!parishFormData.kodPocztowyParafii.trim()) {
      newErrors.kodPocztowyParafii = "Kod pocztowy jest wymagany";
    } else if (!/^\d{2}-\d{3}$/.test(parishFormData.kodPocztowyParafii)) {
      newErrors.kodPocztowyParafii = "Niepoprawny format kodu pocztowego (przykład: 50-123)";
    }

    if (!parishFormData.numerKonta.trim()) {
      newErrors.numerKonta = "Numer konta bankowego jest wymagany";
    } else if (!/^\d{26}$/.test(parishFormData.numerKonta.replace(/\s/g, ''))) {
      newErrors.numerKonta = "Numer konta musi zawierać dokładnie 26 cyfr (przykład: 12 3456 7890 1234 5678 9012 3456)";
    }

    if (!parishFormData.zdjecieParafii) {
      newErrors.zdjecieParafii = "Zdjęcie parafii jest wymagane";
    } else {
      const file = parishFormData.zdjecieParafii;
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      
      if (file.size > maxSize) {
        newErrors.zdjecieParafii = "Zdjęcie nie może być większe niż 5MB";
      } else if (!allowedTypes.includes(file.type)) {
        newErrors.zdjecieParafii = "Dozwolone formaty: JPG, PNG, WebP";
      }
    }

    if (parishFormData.emailParafii && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parishFormData.emailParafii)) {
      newErrors.emailParafii = "Niepoprawny format adresu email parafii";
    }

    if (parishFormData.telefonParafii && !/^[+]?[0-9\s-()]{9,15}$/.test(parishFormData.telefonParafii)) {
      newErrors.telefonParafii = "Niepoprawny format numeru telefonu parafii";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      scrollToTop();
    }
    
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
    clearMessages();
    scrollToTop();
    
    try {
      setSuccessMessage('Przetwarzamy Twoją rejestrację...');
      
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

      // Auto-logowanie po udanej rejestracji
      if (data.autoLogin) {
        setSuccessMessage('Rejestracja zakończona pomyślnie! Przekierowujemy Cię do strony głównej...');
        
        const signInResult = await signIn('credentials', {
          email: data.autoLogin.email,
          password: data.autoLogin.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          setTimeout(() => {
            window.location.href = "/"; // Przekierowanie na stronę główną
          }, 2000);
        } else {
          setSuccessMessage('Rejestracja zakończona pomyślnie! Przekierowujemy Cię do strony logowania...');
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
      } else {
        setSuccessMessage('Rejestracja zakończona pomyślnie! Przekierowujemy Cię do strony logowania...');
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
      
    } catch (error) {
      console.error('❌ Błąd rejestracji parafianina:', error);
      setErrors({ general: error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd' });
      scrollToTop();
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
    clearMessages();
    scrollToTop();
    
    try {
      setSuccessMessage('Przetwarzamy rejestrację parafii...');
      
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

      // Auto-logowanie po udanej rejestracji
      if (data.autoLogin) {
        setSuccessMessage('Rejestracja parafii zakończona pomyślnie! Przekierowujemy Cię do panelu zarządzania...');
        
        const signInResult = await signIn('credentials', {
          email: data.autoLogin.email,
          password: data.autoLogin.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          setTimeout(() => {
            window.location.href = `/edycja-parafii/${data.parish?.identyfikatorParafii || 'profil'}`; // Przekierowanie do edycji parafii
          }, 2000);
        } else {
          setSuccessMessage('Rejestracja zakończona pomyślnie! Przekierowujemy Cię do strony logowania...');
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
      } else {
        setSuccessMessage('Rejestracja zakończona pomyślnie! Przekierowujemy Cię do panelu zarządzania...');
        setTimeout(() => {
          window.location.href = "/edycja-parafii";
        }, 2000);
      }
      
    } catch (error) {
      console.error('❌ Błąd rejestracji proboszcza:', error);
      setErrors({ general: error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd' });
      scrollToTop();
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
          onFileChange={handleParishFileChange}
          onLocationChange={handleLocationChange}
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
            <Paper ref={formRef} elevation={2} sx={{ p: 4, borderRadius: 3 }}>
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

              {/* Wyświetlenie komunikatu sukcesu */}
              {successMessage && (
                <Box sx={{ mb: 3, p: 2, bgcolor: '#e8f5e8', borderRadius: 1, border: '1px solid #4caf50' }}>
                  <Typography sx={{ color: '#2e7d32' }} variant="body2">
                    {successMessage}
                  </Typography>
                </Box>
              )}

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
