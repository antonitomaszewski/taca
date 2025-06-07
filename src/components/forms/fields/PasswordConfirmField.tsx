import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { PasswordConfirmFieldProps } from './types';
import { useState } from 'react';

export function PasswordConfirmField({ 
  value, 
  onChange, 
  error = '', 
  required = false,
  label = 'Powtórz hasło',
  fullWidth = true
}: PasswordConfirmFieldProps) {
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
      helperText={error}
      required={required}
      fullWidth={fullWidth}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Lock color={error ? 'error' : 'action'} />
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