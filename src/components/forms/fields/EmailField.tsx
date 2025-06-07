import { TextField, InputAdornment } from '@mui/material';
import { Email } from '@mui/icons-material';
import { EmailFieldProps } from './types';

export function EmailField({ 
  value, 
  onChange, 
  error = '', 
  required = false,
  label = 'Adres email',
  fullWidth = true
}: EmailFieldProps) {
  return (
    <TextField
      type="email"
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error}
      required={required}
      fullWidth={fullWidth}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Email color={error ? 'error' : 'action'} />
            </InputAdornment>
          ),
        }
      }}
    />
  );
}