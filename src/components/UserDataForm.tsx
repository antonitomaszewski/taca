/**
 * Komponent formularza danych użytkownika - pierwszy etap rejestracji
 * Dla parafianina to jedyny etap, dla proboszcza to pierwszy z dwóch etapów
 */

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Checkbox, 
  FormControlLabel, 
  Typography,
  InputAdornment,
  IconButton 
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Phone, Person } from '@mui/icons-material';
import { AccountType, ACCOUNT_TYPES } from '@/constants/accountTypes';
import { TacaTextField, TacaCheckbox } from '@/components/ui';

interface UserDataFormProps {
  accountType: AccountType;
  formData: {
    imieNazwisko: string;
    email: string;
    telefon: string;
    haslo: string;
    powtorzHaslo: string;
    akceptacjaRegulaminu: boolean;
  };
  onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
}

export default function UserDataForm({ 
  accountType, 
  formData, 
  onChange, 
  errors 
}: UserDataFormProps) {
  
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [emailCheckTimeout, setEmailCheckTimeout] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timeout przy odmontowaniu komponentu
  useEffect(() => {
    return () => {
      if (emailCheckTimeout) {
        clearTimeout(emailCheckTimeout);
      }
    };
  }, [emailCheckTimeout]);

  // Funkcja sprawdzania dostępności emaila
  const checkEmailAvailability = async (email: string): Promise<string> => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return '';
    }

    try {
      const response = await fetch('/api/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          return 'Ten adres email jest już zajęty';
        }
      }
    } catch (error) {
      console.error('Error checking email availability:', error);
    }

    return '';
  };

  // Funkcje walidacji natychmiastowej
  const validateEmail = (email: string): string => {
    if (!email) return '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Niepoprawny format adresu email';
    }
    return '';
  };

  const validatePhone = (phone: string): string => {
    if (!phone) return '';
    if (!/^[+]?[0-9\s-()]{9,15}$/.test(phone.trim())) {
      return 'Niepoprawny format numeru telefonu (9-15 cyfr)';
    }
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return '';
    if (password.length < 8) return 'Hasło musi mieć co najmniej 8 znaków';
    if (!/(?=.*[a-z])/.test(password)) return 'Hasło musi zawierać małą literę';
    if (!/(?=.*[A-Z])/.test(password)) return 'Hasło musi zawierać wielką literę';
    if (!/(?=.*\d)/.test(password)) return 'Hasło musi zawierać cyfrę';
    return '';
  };

  const validatePasswordConfirm = (password: string, confirm: string): string => {
    if (!confirm) return '';
    if (password !== confirm) return 'Hasła nie są identyczne';
    return '';
  };

  // Funkcja sprawdzania siły hasła
  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[!@#$%^&*])/.test(password)) score++;

    const labels = ['', 'Bardzo słabe', 'Słabe', 'Średnie', 'Mocne', 'Bardzo mocne'];
    const colors = ['', '#f44336', '#ff9800', '#ffc107', '#4caf50', '#2e7d32'];
    
    return { score, label: labels[score], color: colors[score] };
  };

  // Obsługa blur z walidacją
  const handleBlur = async (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'email':
        error = validateEmail(value);
        // Jeśli format jest poprawny, sprawdź dostępność
        if (!error) {
          const availabilityError = await checkEmailAvailability(value);
          error = availabilityError;
        }
        break;
      case 'telefon':
        error = validatePhone(value);
        break;
      case 'haslo':
        error = validatePassword(value);
        break;
      case 'powtorzHaslo':
        error = validatePasswordConfirm(formData.haslo, value);
        break;
    }

    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };
  
  const getFormTitle = () => {
    return accountType === ACCOUNT_TYPES.PARISHIONER 
      ? 'Twoje dane osobowe'
      : 'Dane administratora parafii';
  };

  const getEmailHelper = () => {
    return accountType === ACCOUNT_TYPES.PARISH_ADMIN
      ? 'To będzie Twój email do logowania (może się różnić od emailu kontaktowego parafii)'
      : 'Adres email do komunikacji i logowania';
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        {getFormTitle()}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TacaTextField
          label="Imię i nazwisko"
          value={formData.imieNazwisko}
          onChange={onChange('imieNazwisko')}
          required
          fullWidth
          variant="outlined"
          error={!!errors.imieNazwisko}
          helperText={errors.imieNazwisko}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: '#4caf50' }} />
              </InputAdornment>
            ),
          }}
        />

        <TacaTextField
          label="Adres email"
          type="email"
          value={formData.email}
          onChange={(e) => {
            const event = e as React.ChangeEvent<HTMLInputElement>;
            onChange('email')(event);
            
            // Natychmiastowa walidacja formatu
            const formatError = validateEmail(e.target.value);
            setFieldErrors(prev => ({ ...prev, email: formatError }));
            
            // Debounced sprawdzanie dostępności
            if (emailCheckTimeout) {
              clearTimeout(emailCheckTimeout);
            }
            
            if (!formatError && e.target.value) {
              const timeout = setTimeout(async () => {
                const availabilityError = await checkEmailAvailability(e.target.value);
                setFieldErrors(prev => ({ ...prev, email: availabilityError }));
              }, 1000);
              setEmailCheckTimeout(timeout);
            }
          }}
          onBlur={(e) => handleBlur('email', e.target.value)}
          required
          fullWidth
          variant="outlined"
          error={!!(errors.email || fieldErrors.email)}
          helperText={errors.email || fieldErrors.email || getEmailHelper()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: '#4caf50' }} />
              </InputAdornment>
            ),
          }}
        />

        <TacaTextField
          label="Numer telefonu (opcjonalnie)"
          value={formData.telefon}
          onChange={(e) => {
            const event = e as React.ChangeEvent<HTMLInputElement>;
            onChange('telefon')(event);
            setFieldErrors(prev => ({ ...prev, telefon: validatePhone(e.target.value) }));
          }}
          onBlur={(e) => handleBlur('telefon', e.target.value)}
          fullWidth
          variant="outlined"
          error={!!(errors.telefon || fieldErrors.telefon)}
          helperText={errors.telefon || fieldErrors.telefon || 'Format: +48 123 456 789 lub 123456789'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone sx={{ color: '#4caf50' }} />
              </InputAdornment>
            ),
          }}
        />

        <Box>
          <TacaTextField
            label="Hasło"
            type={showPassword ? 'text' : 'password'}
            value={formData.haslo}
            onChange={(e) => {
              const event = e as React.ChangeEvent<HTMLInputElement>;
              onChange('haslo')(event);
              setFieldErrors(prev => ({ ...prev, haslo: validatePassword(e.target.value) }));
            }}
            onBlur={(e) => handleBlur('haslo', e.target.value)}
            required
            fullWidth
            variant="outlined"
            error={!!(errors.haslo || fieldErrors.haslo)}
            helperText={errors.haslo || fieldErrors.haslo || 'Minimum 8 znaków, zawierać musi małą literę, wielką literę i cyfrę eg. Aa123456'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {formData.haslo && (
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ minWidth: 'fit-content' }}>
                Siła hasła:
              </Typography>
              <Box sx={{ flex: 1, height: 4, bgcolor: '#e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
                <Box
                  sx={{
                    height: '100%',
                    width: `${(getPasswordStrength(formData.haslo).score / 5) * 100}%`,
                    bgcolor: getPasswordStrength(formData.haslo).color,
                    transition: 'width 0.3s ease, background-color 0.3s ease',
                  }}
                />
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: getPasswordStrength(formData.haslo).color,
                  fontWeight: 500,
                  minWidth: 'fit-content'
                }}
              >
                {getPasswordStrength(formData.haslo).label}
              </Typography>
            </Box>
          )}
        </Box>

        <TacaTextField
          label="Powtórz hasło"
          type={showPasswordConfirm ? 'text' : 'password'}
          value={formData.powtorzHaslo}
          onChange={(e) => {
            const event = e as React.ChangeEvent<HTMLInputElement>;
            onChange('powtorzHaslo')(event);
            setFieldErrors(prev => ({ ...prev, powtorzHaslo: validatePasswordConfirm(formData.haslo, e.target.value) }));
          }}
          onBlur={(e) => handleBlur('powtorzHaslo', e.target.value)}
          required
          fullWidth
          variant="outlined"
          error={!!(errors.powtorzHaslo || fieldErrors.powtorzHaslo)}
          helperText={errors.powtorzHaslo || fieldErrors.powtorzHaslo}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  edge="end"
                  size="small"
                >
                  {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <FormControlLabel
          control={
            <TacaCheckbox
              checked={formData.akceptacjaRegulaminu}
              onChange={onChange('akceptacjaRegulaminu')}
            />
          }
          label={
            <Typography variant="body2">
              Akceptuję{' '}
              <Typography 
                component="span" 
                sx={{ color: '#4caf50', textDecoration: 'underline', cursor: 'pointer' }}
              >
                regulamin
              </Typography>
              {' '}i{' '}
              <Typography 
                component="span" 
                sx={{ color: '#4caf50', textDecoration: 'underline', cursor: 'pointer' }}
              >
                politykę prywatności
              </Typography>
            </Typography>
          }
          sx={{ mt: 1 }}
        />
        {errors.akceptacjaRegulaminu && (
          <Typography variant="body2" color="error">
            {errors.akceptacjaRegulaminu}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
