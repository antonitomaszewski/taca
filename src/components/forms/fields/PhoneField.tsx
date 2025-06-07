import { TextField, InputAdornment } from '@mui/material';
import { Phone } from '@mui/icons-material';
import { PhoneFieldProps } from './types';

export function PhoneField({ 
  value, 
  onChange, 
  error = '', 
  required = false,
  label = 'Telefon',
  fullWidth = true,
  placeholder = ''
}: PhoneFieldProps) {
  return (
    <TextField
      type="tel"
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error || (!required ? 'Opcjonalne' : '')}
      required={required}
      fullWidth={fullWidth}
      placeholder={placeholder}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Phone color={error ? 'error' : 'action'} />
            </InputAdornment>
          ),
        }
      }}
    />
  );
}