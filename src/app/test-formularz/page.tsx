"use client";
import { useState } from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { EmailField, NameField, PhoneField, PasswordField, PasswordConfirmField } from '@/components/forms/fields/index';
import { UserRegistrationForm } from '@/components/forms';
import { UserRegistrationData } from '@/components/forms/types';

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

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log('Dane formularza:', formData);
  //   console.log('Błędy:', errors);
  // };
  const handleSubmit = (data: UserRegistrationData) => {
    console.log('✅ Zarejestrowano:', data);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          Test Formularza - Pojedyncze Komponenty
        </Typography>

        <UserRegistrationForm onSubmit={handleSubmit} />
      </Paper>
    </Container>
  );
}