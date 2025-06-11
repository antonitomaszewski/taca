import { TextField, InputAdornment } from '@mui/material';
import { Email } from '@mui/icons-material';
import { EmailFieldProps } from './types';
import { validateEmail } from '@/lib/validation/fieldValidation';
import { createFieldChangeHandler } from '@/lib/utils/fieldHelpers';

export function EmailField({ 
  value, 
  onChange, 
  error = '', 
  required = false,
  label = 'Adres email',
  fullWidth = true
}: EmailFieldProps) {
  
  const handleChange = createFieldChangeHandler(validateEmail, onChange);

  return (
    <TextField
      type="email"
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error || 'Adres email do komunikacji i logowania'}
      required={required}
      fullWidth={fullWidth}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Email sx={{ color: error ? 'error.main' : 'success.main' }} />
            </InputAdornment>
          ),
        }
      }}
    />
  );
}