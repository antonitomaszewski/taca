import { useState } from 'react';
import { z } from 'zod';
import { validateForm } from '@/lib/validation/formValidation';
import { UseFormReturn, FormValidationOptions } from '@/components/forms/types';

export function useForm<T extends Record<string, string>>(
  initialData: T,
  schema: z.ZodSchema,
  onSubmit?: (data: T) => void,
  options: FormValidationOptions = { validateOnChange: true, validateOnSubmit: true }
): UseFormReturn<T> {
  
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (fieldName: string) => (value: string, error?: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));

    if (error !== undefined) {
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }

  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (options.validateOnSubmit) {
      const { isValid, errors: validationErrors } = validateForm(schema, formData);
      setErrors(validationErrors);
      
      if (isValid) {
        onSubmit?.(formData);
      }
    } else {
      onSubmit?.(formData);
    }
  };

  const clearErrors = () => setErrors({});

  const isValid = Object.values(errors).every(error => !error);

  return {
    formData,
    errors,
    isValid,
    handleFieldChange,
    handleSubmit,
    setFormData,
    clearErrors
  };
}