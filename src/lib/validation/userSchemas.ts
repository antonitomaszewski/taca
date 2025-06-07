import { z } from 'zod';
import { 
  emailSchema, 
  passwordSchema, 
  nameSchema, 
  phoneSchemaOptional,
  passwordLoginSchema
} from './fieldSchemas';

import { ERROR_MESSAGES } from './constants';

// Rejestracja użytkownika
export const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema,
  name: nameSchema,
  phone: phoneSchemaOptional
}).refine(data => data.password === data.confirmPassword, {
  message: ERROR_MESSAGES.PASSWORDS_NOT_MATCHING,
  path: ["confirmPassword"]
});

// Logowanie użytkownika
export const userLoginSchema = z.object({
  email: emailSchema,
  password: passwordLoginSchema
});

// Edycja profilu użytkownika
export const userProfileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchemaOptional
});