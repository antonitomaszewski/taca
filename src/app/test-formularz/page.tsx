"use client";
import { useState } from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { EmailField } from '@/components/forms/fields/EmailField';
import { NameField } from '@/components/forms/fields/NameField';
import { PhoneField } from '@/components/forms/fields/PhoneField';
import { PasswordField } from '@/components/forms/fields/PasswordField';

// W formularzu:

export default function TestFormularzPage() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (fieldName: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    // Wyczyść błąd dla tego pola
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dane formularza:', formData);
    console.log('Błędy:', errors);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          Test Formularza - Pojedyncze Komponenty
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Tu będziemy dodawać nasze komponenty pól */}
            <Typography variant="h6">Testowanie pól formularza:</Typography>
            
            <EmailField
            value={formData.email}
            onChange={handleFieldChange('email')}
            error={errors.email}
            required
            />
            <NameField
            value={formData.name}
            onChange={handleFieldChange('name')}
            error={errors.name}
            required
            />

            <PhoneField
            value={formData.phone}
            onChange={handleFieldChange('phone')}
            error={errors.phone}
            // required={false} - opcjonalne
            />

            <PasswordField
            value={formData.password}
            onChange={handleFieldChange('password')}
            error={errors.password}
            // required={false} - opcjonalne
            />

            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              sx={{ mt: 3 }}
            >
              Testuj Formularz
            </Button>

            {/* Debug info */}
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
        </form>
      </Paper>
    </Container>
  );
}