import { z } from 'zod';
import { emailSchema, nameSchema, phoneSchemaOptional, passwordSchema } from './fieldSchemas';


// Jedna uniwersalna funkcja
export const validateField = (schema: z.ZodSchema, value: string): string => {
  if (!value) return '';
  
  try {
    schema.parse(value);
    return '';
  } catch (error: any) {
    return error.errors?.[0]?.message || '';
  }
};


// Eksportuj gotowe walidatory
export const validateEmail = (value: string) => validateField(emailSchema, value);
export const validateName = (value: string) => validateField(nameSchema, value);
export const validatePhone = (value: string) => validateField(phoneSchemaOptional, value);
export const validatePassword = (value: string) => validateField(passwordSchema, value);