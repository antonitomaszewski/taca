import { TextField, InputAdornment } from '@mui/material';
import { Phone } from '@mui/icons-material';
import { PhoneFieldProps } from './types';

export function PhoneField({ 
  value, 
  onChange, 
  error = '', 
  required = false,
  label = 'Numer Telefonu',
  fullWidth = true,
  placeholder = '+48 123 456 789'
}: PhoneFieldProps) {
  return (
    <TextField
      type="tel"
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error || ''}
      required={required}
      fullWidth={fullWidth}
      placeholder={placeholder}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Phone sx={{ color: error ? 'error.main' : 'success.main' }} />
            </InputAdornment>
          ),
        }
      }}
    />
  );
}