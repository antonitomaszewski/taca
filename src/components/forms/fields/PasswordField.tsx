import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { PasswordFieldProps } from './types';
import { useState } from 'react';

export function PasswordField({ 
  value, 
  onChange, 
  error = '', 
  required = false,
  label = 'Hasło',
  fullWidth = true
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TextField
      type={showPassword ? 'text' : 'password'}
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error || 'Minimum 8 znaków, zawierać musi małą literę, wielką literę i cyfrę'}
      required={required}
      fullWidth={fullWidth}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Lock sx={{ color: error ? 'error.main' : 'success.main' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleTogglePassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }
      }}
    />
  );
}