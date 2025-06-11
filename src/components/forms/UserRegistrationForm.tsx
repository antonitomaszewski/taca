"use client";
import { Box, Button, Typography } from '@mui/material';
import { EmailField, NameField, PhoneField, PasswordField, PasswordConfirmField } from './fields';
import { useForm } from '@/hooks/useForm';
import { userRegistrationSchema } from '@/lib/validation/userSchemas';
import { UserRegistrationData } from './types';

interface UserRegistrationFormProps {
  onSubmit?: (data: UserRegistrationData) => void;
  isLoading?: boolean;
}

const initialFormData: UserRegistrationData = {
  email: '',
  name: '',
  phone: '',
  password: '',
  confirmPassword: ''
};

export function UserRegistrationForm({ onSubmit, isLoading = false }: UserRegistrationFormProps) {
  const { formData, errors, handleFieldChange, handleSubmit } = useForm(
    initialFormData,
    userRegistrationSchema,
    onSubmit
  );

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Rejestracja użytkownika
      </Typography>

      <NameField
        value={formData.name}
        onChange={handleFieldChange('name')}
        error={errors.name}
        required
      />

      <EmailField
        value={formData.email}
        onChange={handleFieldChange('email')}
        error={errors.email}
        required
      />

      <PhoneField
        value={formData.phone}
        onChange={handleFieldChange('phone')}
        error={errors.phone}
      />

      <PasswordField
        value={formData.password}
        onChange={handleFieldChange('password')}
        error={errors.password}
        required
      />

      <PasswordConfirmField
        value={formData.confirmPassword}
        onChange={handleFieldChange('confirmPassword')}
        error={errors.confirmPassword}
        required
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? 'Rejestrowanie...' : 'Zarejestruj się'}
      </Button>

        <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>Debug - Dane formularza:</Typography>
    <pre>{JSON.stringify(formData, null, 2)}</pre>
    
    {Object.keys(errors).length > 0 && (
    <>
        <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>Błędy:</Typography>
        <pre>{JSON.stringify(errors, null, 2)}</pre>
    </>
    )}
    </Box>
    </Box>
  );
}