/**
 * Komponent formularza danych użytkownika - pierwszy etap rejestracji
 * Dla parafianina to jedyny etap, dla proboszcza to pierwszy z dwóch etapów
 */

import React from 'react';
import { 
  Box, 
  TextField, 
  Checkbox, 
  FormControlLabel, 
  Typography 
} from '@mui/material';
import { AccountType, ACCOUNT_TYPES } from '@/constants/accountTypes';

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
        <TextField
          label="Imię i nazwisko"
          value={formData.imieNazwisko}
          onChange={onChange('imieNazwisko')}
          required
          fullWidth
          variant="outlined"
          error={!!errors.imieNazwisko}
          helperText={errors.imieNazwisko}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: '#4caf50' },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
          }}
        />

        <TextField
          label="Adres email"
          type="email"
          value={formData.email}
          onChange={onChange('email')}
          required
          fullWidth
          variant="outlined"
          error={!!errors.email}
          helperText={errors.email || getEmailHelper()}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: '#4caf50' },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
          }}
        />

        <TextField
          label="Numer telefonu (opcjonalnie)"
          value={formData.telefon}
          onChange={onChange('telefon')}
          fullWidth
          variant="outlined"
          error={!!errors.telefon}
          helperText={errors.telefon}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: '#4caf50' },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
          }}
        />

        <TextField
          label="Hasło"
          type="password"
          value={formData.haslo}
          onChange={onChange('haslo')}
          required
          fullWidth
          variant="outlined"
          error={!!errors.haslo}
          helperText={errors.haslo || 'Minimum 8 znaków, zawierać musi małą literę, wielką literę i cyfrę'}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: '#4caf50' },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
          }}
        />

        <TextField
          label="Powtórz hasło"
          type="password"
          value={formData.powtorzHaslo}
          onChange={onChange('powtorzHaslo')}
          required
          fullWidth
          variant="outlined"
          error={!!errors.powtorzHaslo}
          helperText={errors.powtorzHaslo}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: '#4caf50' },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.akceptacjaRegulaminu}
              onChange={onChange('akceptacjaRegulaminu')}
              sx={{ 
                color: '#4caf50',
                '&.Mui-checked': { color: '#4caf50' }
              }}
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
