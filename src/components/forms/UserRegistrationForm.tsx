"use client";
import { Box, Button, Typography, Container, Paper } from '@mui/material';
import { EmailField, NameField, PhoneField, PasswordField, PasswordConfirmField } from './fields';
import { useForm } from '@/hooks/useForm';
import { userRegistrationSchema } from '@/lib/validation/userSchemas';
import { UserRegistrationData } from './types';
import { formStyles } from '@/styles/componentStyles';

interface UserRegistrationFormProps {
  onSubmit?: (data: UserRegistrationData) => void;
  onBack?: () => void;
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
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
        }}
      >
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            color: 'success.main'
          }}
        >
          Rejestracja
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          Stwórz konto parafianina, aby wspierać parafie
        </Typography>
      </Box>
        <Typography 
          variant="h6" 
          component="h2"
          sx={{ mb: 3, fontWeight: 600 }}
        >
          Twoje dane osobowe
        </Typography>

        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ 
            color: 'success.main',
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3,
          }}
        >
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
            required
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

        <Box sx={formStyles.buttonContainer.sx}>
          <Button
            {...formStyles.outlinedButton}
            onClick={() => {
              console.log('Zmień typ konta');
            }}
          >
            Zmień typ konta
          </Button>

          <Button
            {...formStyles.containedButton}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Rejestruję...' : 'Zarejestruj się'}
          </Button>
        </Box>
        </Box>
      </Paper>
    </Container>
  );
}