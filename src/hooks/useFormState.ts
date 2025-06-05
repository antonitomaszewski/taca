/**
 * Custom hook do zarządzania stanem formularzy z walidacją
 */

import { useState, useCallback } from 'react';

export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  loading: boolean;
}

export interface UseFormStateOptions<T> {
  initialData: T;
  validators?: Record<keyof T, (value: any) => string>;
}

export function useFormState<T extends Record<string, any>>({
  initialData,
  validators = {}
}: UseFormStateOptions<T>) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const updateField = useCallback((field: keyof T) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    
    setData(prev => ({ ...prev, [field]: value }));
    
    // Walidacja w czasie rzeczywistym
    if (validators[field]) {
      const error = validators[field](value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  }, [validators]);

  const markTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const validateField = useCallback((field: keyof T, value: any): string => {
    if (validators[field]) {
      return validators[field](value);
    }
    return '';
  }, [validators]);

  const validateAll = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(validators).forEach(field => {
      const error = validators[field](data[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    
    // Oznacz wszystkie pola jako dotknięte
    const allTouched: Record<string, boolean> = {};
    Object.keys(data).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    return isValid;
  }, [data, validators]);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setTouched({});
    setLoading(false);
  }, [initialData]);

  const hasError = useCallback((field: keyof T): boolean => {
    return touched[field] && !!errors[field];
  }, [touched, errors]);

  const getErrorMessage = useCallback((field: keyof T): string => {
    return touched[field] ? errors[field] || '' : '';
  }, [touched, errors]);

  return {
    data,
    errors,
    touched,
    loading,
    setLoading,
    updateField,
    markTouched,
    validateField,
    validateAll,
    reset,
    hasError,
    getErrorMessage,
    setData,
    setErrors
  };
}
