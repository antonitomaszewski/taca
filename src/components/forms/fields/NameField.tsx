import { TextField, InputAdornment } from '@mui/material';
import { Person } from '@mui/icons-material';
import { NameFieldProps } from './types';

export function NameField({ 
  value, 
  onChange, 
  error = '', 
  required = false,
  label = 'Imię i nazwisko',
  fullWidth = true
}: NameFieldProps) {
  return (
    <TextField
      type="text"
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
              <Person color={error ? 'error' : 'action'} />
            </InputAdornment>
          ),
        }
      }}
    />
  );
}