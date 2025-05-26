"use client";
import React, { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  TextField,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  FormHelperText
} from '@mui/material';
import { 
  LocationOn as LocationOnIcon,
  PhotoCamera as PhotoCameraIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  CloudUpload as CloudUploadIcon,
  AccountBalance as AccountBalanceIcon,
  Link as LinkIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// Ładowanie komponentu mapy dynamicznie (bez SSR)
const EditMapComponent = dynamic(() => import('./EditMapComponent'), {
  ssr: false,
  loading: () => <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
});

export default function EdycjaParafii() {
  // Definicje pól z tooltipami, walidacją i flagami wymaganych pól
  const FIELD_DEFINITIONS = {
    nazwa: {
      label: "Nazwa parafii",
      placeholder: "np. Parafia św. Marii Magdaleny",
      tooltip: "Pełna oficjalna nazwa parafii wraz z wezwaniem",
      required: true,
      validate: (value: string) => {
        if (!value.trim()) return "Nazwa parafii jest wymagana";
        if (value.length < 3) return "Nazwa musi mieć co najmniej 3 znaki";
        return "";
      }
    },
    miejscowosc: {
      label: "Miejscowość",
      placeholder: "np. Wrocław",
      tooltip: "Miasto lub miejscowość, w której znajduje się parafia",
      required: true,
      validate: (value: string) => {
        if (!value.trim()) return "Miejscowość jest wymagana";
        return "";
      }
    },
    adres: {
      label: "Adres",
      placeholder: "ul. Szewska 10, 50-139",
      tooltip: "Pełny adres parafii z ulicą, numerem i kodem pocztowym",
      required: false,
      validate: (value: string) => {
        // Adres jest opcjonalny, ale jeśli podany to sprawdzamy format
        return "";
      }
    },
    telefon: {
      label: "Telefon",
      placeholder: "+48 71 344 23 75 lub 600 800 900",
      tooltip: "Numer telefonu do parafii - może być stacjonarny z kierunkowym (+48...) lub komórkowy (bez kierunkowego)",
      required: false,
      validate: (value: string) => {
        if (value) {
          const cleanValue = value.replace(/\s/g, '');
          // Sprawdź stacjonarny z kierunkowym: +48 + 2-3 cyfry + 7 cyfr = 12-13 cyfr total
          const landlinePattern = /^\+48\d{9,10}$/;
          // Sprawdź komórkowy: 9 cyfr (666666666)
          const mobilePattern = /^\d{9}$/;
          
          if (!landlinePattern.test(cleanValue) && !mobilePattern.test(cleanValue)) {
            return "Nieprawidłowy format telefonu (użyj: +48 71 344 23 75 lub 666 666 666)";
          }
        }
        return "";
      }
    },
    email: {
      label: "Email",
      placeholder: "kontakt@parafia.pl",
      tooltip: "Adres email do kontaktu z parafią",
      required: false,
      validate: (value: string) => {
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Nieprawidłowy format adresu email";
        }
        return "";
      }
    },
    strona: {
      label: "Strona internetowa",
      placeholder: "www.parafia.pl",
      tooltip: "Oficjalna strona internetowa parafii",
      required: false,
      validate: (value: string) => {
        if (value && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value)) {
          return "Nieprawidłowy format strony internetowej";
        }
        return "";
      }
    },
    proboszcz: {
      label: "Proboszcz",
      placeholder: "ks. Jan Kowalski",
      tooltip: "Imię i nazwisko proboszcza parafii",
      required: false,
      validate: () => ""
    },
    kontoBank: {
      label: "Numer konta bankowego",
      placeholder: "12 3456 7890 1234 5678 9012 3456",
      tooltip: "26-cyfrowy numer konta bankowego na które będą wpłacane dotacje",
      required: false,
      validate: (value: string) => {
        if (value) {
          const cleanValue = value.replace(/\s/g, '');
          if (!/^\d{26}$/.test(cleanValue)) {
            return "Numer konta musi składać się z 26 cyfr";
          }
        }
        return "";
      }
    },
    uniqueSlug: {
      label: "Unikalny adres strony",
      placeholder: "parafia-sw-marii-wroclaw",
      tooltip: "Przyjazny adres URL dla Twojej parafii (tylko małe litery, cyfry i myślniki)",
      required: false,
      validate: (value: string) => {
        if (value && !/^[a-z0-9-]+$/.test(value)) {
          return "Adres może zawierać tylko małe litery, cyfry i myślniki";
        }
        if (value && value.length < 3) {
          return "Adres musi mieć co najmniej 3 znaki";
        }
        return "";
      }
    },
    celKwota: {
      label: "Kwota potrzebna (PLN)",
      placeholder: "50000",
      tooltip: "Kwota pieniędzy potrzebna na realizację celu parafii",
      required: false,
      validate: (value: string) => {
        if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
          return "Kwota musi być liczbą większą od 0";
        }
        return "";
      }
    }
  } as const;

  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [parishId, setParishId] = useState("");
  
  // Stany walidacji - przechowują błędy dla każdego pola
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  // Stany touched - które pola użytkownik już dotknął
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  
  // Debounced geocoding - żeby nie wysyłać zbyt wielu requestów
  const [geocodingTimeout, setGeocodingTimeout] = useState<NodeJS.Timeout | null>(null);
  
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
    kontoBank: "",
    uniqueSlug: "",
    celKwota: "",
    celOpis: "",
    latitude: null as number | null,
    longitude: null as number | null
  });

  // Sprawdź uwierzytelnienie i załaduj dane parafii
  useEffect(() => {
    if (status === "loading") return; // Czekaj na sprawdzenie sesji
    
    if (status === "unauthenticated") {
      router.push("/"); // Przekieruj do strony głównej z loginem
      return;
    }
    
    if (session?.user?.parishId) {
      loadParishData(session.user.parishId);
      setParishId(session.user.parishId);
    } else {
      setError("Nie masz przypisanej parafii do edycji");
      setLoading(false);
    }
  }, [session, status, router]);

  // Cleanup timeout przy odmontowaniu komponentu
  useEffect(() => {
    return () => {
      if (geocodingTimeout) {
        clearTimeout(geocodingTimeout);
      }
    };
  }, [geocodingTimeout]);

  const loadParishData = async (parishId: string) => {
    try {
      const response = await fetch(`/api/parishes/${parishId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Nie udało się załadować danych parafii");
      }
      
      console.log('🔍 FRONTEND DEBUG - Received data:', data);
      
      // API zwraca dane bezpośrednio w data, nie w data.parish
      setFormData({
        nazwa: data.nazwa || data.name || "",
        miejscowosc: data.miejscowosc || data.city || "",
        adres: data.adres || data.address || "",
        telefon: data.telefon || data.phone || "",
        email: data.email || "",
        strona: data.strona || data.website || "",
        proboszcz: data.proboszcz || data.pastor || "",
        opis: data.opis || data.description || "",
        photoUrl: data.photoUrl || "",
        celKwota: data.cel ? data.cel.toString() : "",
        celOpis: data.celOpis || "",
        kontoBank: data.kontoBank || data.bankAccount || "", // lub odpowiednia wartość
        uniqueSlug: data.uniqueSlug || "", // lub odpowiednia wartość
        latitude: data.latitude || null,
        longitude: data.longitude || null
      });
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "Wystąpił błąd podczas ładowania danych");
    } finally {
      setLoading(false);
    }
  };

  // Funkcja formatowania numeru konta bankowego
  const formatBankAccount = (value: string) => {
    // Usuń wszystkie spacje i nieistniejące znaki
    const digitsOnly = value.replace(/[^\d]/g, '');
    
    // Ogranicz do 26 cyfr
    const limited = digitsOnly.slice(0, 26);
    
    // Formatuj w grupach: XX XXXX XXXX XXXX XXXX XXXX XXXX
    let formatted = '';
    for (let i = 0; i < limited.length; i++) {
      if (i === 2 || (i > 2 && (i - 2) % 4 === 0)) {
        formatted += ' ';
      }
      formatted += limited[i];
    }
    
    return formatted;
  };

  // Funkcja walidacji w czasie rzeczywistym
  const validateField = (field: string, value: string) => {
    const fieldDef = FIELD_DEFINITIONS[field as keyof typeof FIELD_DEFINITIONS];
    if (fieldDef?.validate) {
      return fieldDef.validate(value);
    }
    return "";
  };

  const [isGeocoding, setIsGeocoding] = useState(false);

  const geocodeAddress = async (city: string, address: string) => {
    if (!city.trim()) return; // Miejscowość jest wymagana do geokodowania
    
    setIsGeocoding(true);
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
        
        // Aktualizuj współrzędne tylko jeśli są różne od aktualnych
        setFormData(prev => {
          if (prev.latitude !== lat || prev.longitude !== lng) {
            return {
              ...prev,
              latitude: lat,
              longitude: lng
            };
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    
    // Specjalne formatowanie dla numeru konta bankowego
    if (field === 'kontoBank') {
      value = formatBankAccount(value);
    }
    
    // Aktualizuj dane formularza
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Oznacz pole jako dotknięte
    setTouchedFields(prev => ({
      ...prev,
      [field]: true
    }));
    
    // Waliduj pole jeśli zostało dotknięte
    const error = validateField(field, value);
    setFieldErrors(prev => ({
      ...prev,
      [field]: error
    }));

    // Geokodowanie dla pól adresowych (z debouncing)
    if (field === 'miejscowosc' || field === 'adres') {
      // Wyczyść poprzedni timeout
      if (geocodingTimeout) {
        clearTimeout(geocodingTimeout);
      }
      
      // Ustaw nowy timeout - geokoduj po 1 sekundzie od ostatniej zmiany
      const newTimeout = setTimeout(() => {
        const currentCity = field === 'miejscowosc' ? value : formData.miejscowosc;
        const currentAddress = field === 'adres' ? value : formData.adres;
        geocodeAddress(currentCity, currentAddress);
      }, 1000);
      
      setGeocodingTimeout(newTimeout);
    }
  };

  // Funkcja sprawdzająca, czy pole ma błąd
  const hasError = (field: string) => {
    return touchedFields[field] && fieldErrors[field] !== "";
  };

  // Funkcja pobierająca komunikat błędu
  const getErrorMessage = (field: string) => {
    return touchedFields[field] ? fieldErrors[field] : "";
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

  const handleLocationChange = async (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));

    // Reverse geocoding - uzyskaj adres z współrzędnych
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=pl`
      );
      const data = await response.json();
      
      if (data && data.address) {
        const address = data.address;
        
        // Buduj adres ulicy z numerem domu
        let streetAddress = '';
        if (address.house_number && address.road) {
          streetAddress = `${address.road} ${address.house_number}`;
        } else if (address.road) {
          streetAddress = address.road;
        }
        
        // Dodaj kod pocztowy jeśli dostępny
        if (address.postcode) {
          streetAddress += `, ${address.postcode}`;
        }
        
        // Aktualizuj pola adresowe jeśli są puste lub użytkownik je wyczyścił
        setFormData(prev => ({
          ...prev,
          miejscowosc: address.city || address.town || address.village || prev.miejscowosc,
          adres: streetAddress || prev.adres
        }));
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  const handleSave = async () => {
    // Walidacja wszystkich pól przed zapisem
    const errors: Record<string, string> = {};
    
    console.log('🔍 VALIDATION DEBUG - Sprawdzanie pól:');
    Object.keys(FIELD_DEFINITIONS).forEach(field => {
      const value = String(formData[field as keyof typeof formData] || "");
      const error = validateField(field, value);
      console.log(`Pole "${field}": wartość="${value}", błąd="${error}"`);
      if (error) {
        errors[field] = error;
      }
    });
    
    // Sprawdź czy są wymagane pola niezapełnione
    Object.keys(FIELD_DEFINITIONS).forEach(field => {
      const fieldDef = FIELD_DEFINITIONS[field as keyof typeof FIELD_DEFINITIONS];
      const rawValue = formData[field as keyof typeof formData];
      const value = typeof rawValue === 'string' ? rawValue.trim() : String(rawValue || "");
      console.log(`Pole wymagane "${field}": required=${fieldDef.required}, wartość="${value}"`);
      if (fieldDef.required && !value) {
        errors[field] = `${fieldDef.label} jest wymagane`;
        console.log(`❌ Błąd dla wymaganego pola "${field}": ${errors[field]}`);
      }
    });
    
    console.log('🔍 VALIDATION DEBUG - Wszystkie błędy:', errors);
    
    // Jeśli są błędy, pokaż je i zatrzymaj zapis
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setTouchedFields(Object.keys(errors).reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {} as Record<string, boolean>));
      
      // Stwórz bardziej szczegółowy komunikat błędu
      const errorMessages = Object.entries(errors).map(([field, message]) => {
        const fieldDef = FIELD_DEFINITIONS[field as keyof typeof FIELD_DEFINITIONS];
        return `• ${fieldDef?.label || field}: ${message}`;
      });
      
      setError(`Proszę poprawić następujące błędy:\n${errorMessages.join('\n')}`);
      
      // Przewiń do góry strony, żeby użytkownik zobaczył komunikat błędu
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      return;
    }
    
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/parishes/${parishId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas zapisywania');
      }

      setSuccess("Profil parafii został pomyślnie zapisany!");
      
      // Przewiń do góry strony, żeby użytkownik zobaczył komunikat o sukcesie
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ px: 0 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                flexGrow: 1, 
                fontWeight: 600, 
                color: '#4caf50',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              component="a"
              href="/"
            >
              Taca.pl
            </Typography>
            
            {/* Przycisk do strony parafii - tylko jeśli mamy parishId */}
            {parishId && (
              <Button
                variant="outlined"
                color="success"
                href={`/parafia/${parishId}`}
                sx={{
                  borderColor: '#4caf50',
                  color: '#4caf50',
                  '&:hover': {
                    borderColor: '#2e7d32',
                    backgroundColor: '#e8f5e8'
                  }
                }}
              >
                Przejdź do Twojej parafii
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', color: '#2e7d32', fontWeight: 'bold', mb: 4 }}>
          Edytuj profil parafii
        </Typography>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress color="success" />
          </Box>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Box>
              {error.split('\n').map((line, index) => (
                <Typography key={index} variant="body2" sx={{ mb: index === 0 ? 1 : 0 }}>
                  {line}
                </Typography>
              ))}
            </Box>
          </Alert>
        )}

        {/* Success Message */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Form Content */}
        {!loading && (
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
                {/* Nazwa parafii */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Nazwa parafii {FIELD_DEFINITIONS.nazwa.required && <span style={{ color: 'red' }}>*</span>}
                    </Typography>
                    <Tooltip title={FIELD_DEFINITIONS.nazwa.tooltip} arrow>
                      <IconButton size="small" sx={{ p: 0.5 }}>
                        <InfoIcon sx={{ fontSize: 16, color: '#666' }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <TextField
                    fullWidth
                    value={formData.nazwa}
                    onChange={handleChange('nazwa')}
                    placeholder={FIELD_DEFINITIONS.nazwa.placeholder}
                    variant="outlined"
                    error={hasError('nazwa')}
                    helperText={getErrorMessage('nazwa')}
                    sx={{
                      '& input:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 1000px white inset !important',
                        WebkitTextFillColor: '#000 !important',
                      }
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* Miejscowość */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Miejscowość {FIELD_DEFINITIONS.miejscowosc.required && <span style={{ color: 'red' }}>*</span>}
                      </Typography>
                      <Tooltip title={FIELD_DEFINITIONS.miejscowosc.tooltip} arrow>
                        <IconButton size="small" sx={{ p: 0.5 }}>
                          <InfoIcon sx={{ fontSize: 16, color: '#666' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <TextField
                      fullWidth
                      value={formData.miejscowosc}
                      onChange={handleChange('miejscowosc')}
                      placeholder={FIELD_DEFINITIONS.miejscowosc.placeholder}
                      variant="outlined"
                      error={hasError('miejscowosc')}
                      helperText={getErrorMessage('miejscowosc')}
                      sx={{
                        '& input:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 1000px white inset !important',
                          WebkitTextFillColor: '#000 !important',
                        }
                      }}
                    />
                  </Box>
                  
                  {/* Adres */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Adres {FIELD_DEFINITIONS.adres.required && <span style={{ color: 'red' }}>*</span>}
                      </Typography>
                      <Tooltip title={FIELD_DEFINITIONS.adres.tooltip} arrow>
                        <IconButton size="small" sx={{ p: 0.5 }}>
                          <InfoIcon sx={{ fontSize: 16, color: '#666' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <TextField
                      fullWidth
                      value={formData.adres}
                      onChange={handleChange('adres')}
                      placeholder={FIELD_DEFINITIONS.adres.placeholder}
                      variant="outlined"
                      error={hasError('adres')}
                      helperText={getErrorMessage('adres')}
                      sx={{
                        '& input:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 1000px white inset !important',
                          WebkitTextFillColor: '#000 !important',
                        }
                      }}
                    />
                  </Box>
                </Box>

                {/* Interactive Map for Location */}
                <Box sx={{ mt: 3 }}>
                  <EditMapComponent
                    latitude={formData.latitude || undefined}
                    longitude={formData.longitude || undefined}
                    onLocationChange={handleLocationChange}
                    currentAddress={formData.miejscowosc && formData.adres ? `${formData.adres}, ${formData.miejscowosc}` : formData.miejscowosc}
                  />
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', fontStyle: 'italic' }}>
                    💡 Wskazówka: Wpisz adres w polach powyżej, a mapa automatycznie pokaże lokalizację. Możesz też kliknąć na mapie aby ustawić dokładną pozycję.
                    {isGeocoding && (
                      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', ml: 1 }}>
                        <CircularProgress size={12} sx={{ mr: 0.5 }} />
                        Szukam lokalizacji...
                      </Box>
                    )}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* Telefon */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Telefon {FIELD_DEFINITIONS.telefon.required && <span style={{ color: 'red' }}>*</span>}
                      </Typography>
                      <Tooltip title={FIELD_DEFINITIONS.telefon.tooltip} arrow>
                        <IconButton size="small" sx={{ p: 0.5 }}>
                          <InfoIcon sx={{ fontSize: 16, color: '#666' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <TextField
                      fullWidth
                      value={formData.telefon}
                      onChange={handleChange('telefon')}
                      placeholder={FIELD_DEFINITIONS.telefon.placeholder}
                      variant="outlined"
                      error={hasError('telefon')}
                      helperText={getErrorMessage('telefon')}
                      sx={{
                        '& input:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 1000px white inset !important',
                          WebkitTextFillColor: '#000 !important',
                        }
                      }}
                    />
                  </Box>
                  
                  {/* Email */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Email {FIELD_DEFINITIONS.email.required && <span style={{ color: 'red' }}>*</span>}
                      </Typography>
                      <Tooltip title={FIELD_DEFINITIONS.email.tooltip} arrow>
                        <IconButton size="small" sx={{ p: 0.5 }}>
                          <InfoIcon sx={{ fontSize: 16, color: '#666' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <TextField
                      fullWidth
                      value={formData.email}
                      onChange={handleChange('email')}
                      placeholder={FIELD_DEFINITIONS.email.placeholder}
                      variant="outlined"
                      error={hasError('email')}
                      helperText={getErrorMessage('email')}
                      sx={{
                        '& input:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 1000px white inset !important',
                          WebkitTextFillColor: '#000 !important',
                        }
                      }}
                    />
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* Strona internetowa */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Strona internetowa {FIELD_DEFINITIONS.strona.required && <span style={{ color: 'red' }}>*</span>}
                      </Typography>
                      <Tooltip title={FIELD_DEFINITIONS.strona.tooltip} arrow>
                        <IconButton size="small" sx={{ p: 0.5 }}>
                          <InfoIcon sx={{ fontSize: 16, color: '#666' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <TextField
                      fullWidth
                      value={formData.strona}
                      onChange={handleChange('strona')}
                      placeholder={FIELD_DEFINITIONS.strona.placeholder}
                      variant="outlined"
                      error={hasError('strona')}
                      helperText={getErrorMessage('strona')}
                      sx={{
                        '& input:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 1000px white inset !important',
                          WebkitTextFillColor: '#000 !important',
                        }
                      }}
                    />
                  </Box>
                  
                  {/* Proboszcz */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Proboszcz {FIELD_DEFINITIONS.proboszcz.required && <span style={{ color: 'red' }}>*</span>}
                      </Typography>
                      <Tooltip title={FIELD_DEFINITIONS.proboszcz.tooltip} arrow>
                        <IconButton size="small" sx={{ p: 0.5 }}>
                          <InfoIcon sx={{ fontSize: 16, color: '#666' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <TextField
                      fullWidth
                      value={formData.proboszcz}
                      onChange={handleChange('proboszcz')}
                      placeholder={FIELD_DEFINITIONS.proboszcz.placeholder}
                      variant="outlined"
                      error={hasError('proboszcz')}
                      helperText={getErrorMessage('proboszcz')}
                      sx={{
                        '& input:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 1000px white inset !important',
                          WebkitTextFillColor: '#000 !important',
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Section 2: Bank Account & Unique URL */}
          <Card sx={{ bgcolor: '#e8f5e8', border: '2px solid #4caf50' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AccountBalanceIcon sx={{ fontSize: 32, color: '#2e7d32', mr: 2 }} />
                <Typography variant="h5" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                  🏦 Konto bankowe i adres strony
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Numer konta bankowego */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Numer konta bankowego {FIELD_DEFINITIONS.kontoBank.required && <span style={{ color: 'red' }}>*</span>}
                    </Typography>
                    <Tooltip title={FIELD_DEFINITIONS.kontoBank.tooltip} arrow>
                      <IconButton size="small" sx={{ p: 0.5 }}>
                        <InfoIcon sx={{ fontSize: 16, color: '#666' }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <TextField
                    fullWidth
                    value={formData.kontoBank}
                    onChange={handleChange('kontoBank')}
                    placeholder={FIELD_DEFINITIONS.kontoBank.placeholder}
                    variant="outlined"
                    error={hasError('kontoBank')}
                    helperText={getErrorMessage('kontoBank') || "Wprowadź numer konta na które będą wpłacane dotacje"}
                    sx={{
                      '& .MuiInputBase-input': {
                        fontFamily: 'monospace',
                        fontSize: '1rem'
                      },
                      '& input:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 1000px white inset !important',
                        WebkitTextFillColor: '#000 !important',
                      }
                    }}
                  />
                </Box>
                
                {/* Unikalny adres strony */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <LinkIcon sx={{ fontSize: 24, color: '#2e7d32', mt: 4.5 }} />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Unikalny adres strony {FIELD_DEFINITIONS.uniqueSlug.required && <span style={{ color: 'red' }}>*</span>}
                      </Typography>
                      <Tooltip title={FIELD_DEFINITIONS.uniqueSlug.tooltip} arrow>
                        <IconButton size="small" sx={{ p: 0.5 }}>
                          <InfoIcon sx={{ fontSize: 16, color: '#666' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <TextField
                      fullWidth
                      value={formData.uniqueSlug}
                      onChange={handleChange('uniqueSlug')}
                      placeholder={FIELD_DEFINITIONS.uniqueSlug.placeholder}
                      variant="outlined"
                      error={hasError('uniqueSlug')}
                      helperText={getErrorMessage('uniqueSlug') || "Unikalny identyfikator dla Twojej parafii w adresie URL"}
                      InputProps={{
                        startAdornment: (
                          <Typography variant="body2" sx={{ color: '#666', mr: 1 }}>
                            taca.pl/
                          </Typography>
                        ),
                      }}
                      sx={{
                        '& input:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 1000px white inset !important',
                          WebkitTextFillColor: '#000 !important',
                        }
                      }}
                    />
                  </Box>
                </Box>
                
                <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
                  💡 Podanie numeru konta i unikalnego adresu pomoże darczyńcom łatwiej znaleźć i wesprzeć Twoją parafię
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Section 3: Photo Upload */}
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

          {/* Section 4: Description */}
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
                  },
                  '& textarea:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 1000px #fafafa inset !important',
                    WebkitTextFillColor: '#000 !important',
                  }
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                Im więcej napiszesz o swojej parafii, tym łatwiej będzie ludziom się z nią związać i wesprzeć.
              </Typography>
            </CardContent>
          </Card>

          {/* Section 5: Fundraising */}
          <Card sx={{ bgcolor: '#fff3e0', border: '2px solid #ff9800' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <MoneyIcon sx={{ fontSize: 32, color: '#f57c00', mr: 2 }} />
                <Typography variant="h5" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                  💰 Stwórz zbiórkę
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Kwota potrzebna */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Kwota potrzebna (PLN) {FIELD_DEFINITIONS.celKwota.required && <span style={{ color: 'red' }}>*</span>}
                    </Typography>
                    <Tooltip title={FIELD_DEFINITIONS.celKwota.tooltip} arrow>
                      <IconButton size="small" sx={{ p: 0.5 }}>
                        <InfoIcon sx={{ fontSize: 16, color: '#666' }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <TextField
                    fullWidth
                    value={formData.celKwota}
                    onChange={handleChange('celKwota')}
                    placeholder={FIELD_DEFINITIONS.celKwota.placeholder}
                    variant="outlined"
                    type="number"
                    error={hasError('celKwota')}
                    helperText={getErrorMessage('celKwota') || "Podaj kwotę, którą chcesz zebrać na cel parafii"}
                    sx={{
                      '& input:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 1000px white inset !important',
                        WebkitTextFillColor: '#000 !important',
                      }
                    }}
                  />
                </Box>
                
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
                    },
                    '& textarea:-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 1000px #fafafa inset !important',
                      WebkitTextFillColor: '#000 !important',
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
              disabled={saving}
              sx={{ 
                bgcolor: '#2e7d32',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { bgcolor: '#1b5e20' },
                '&:disabled': { bgcolor: '#cccccc' }
              }}
            >
              {saving ? 'Zapisywanie...' : 'Zapisz profil parafii'}
            </Button>
          </Box>
        </Box>
        )}
      </Container>
    </Box>
  );
}
