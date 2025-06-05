import { z } from 'zod';
import { 
  PHONE_REGEX, 
  BANK_ACCOUNT_REGEX, 
  ZIP_CODE_REGEX, 
  PASSWORD_REGEX,
  SLUG_REGEX,
  PARISH_NAME_REGEX,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MIN_SLUG_LENGTH,
  MAX_SLUG_LENGTH,
  MIN_PARISH_NAME_LENGTH,
  MAX_PARISH_NAME_LENGTH,
  ERROR_MESSAGES
} from './constants';

// Pojedyncze pola - podstawowe
export const emailSchema = z
  .string()
  .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
  .email(ERROR_MESSAGES.INVALID_EMAIL);

export const phoneSchema = z
  .string()
  .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
  .regex(PHONE_REGEX, ERROR_MESSAGES.INVALID_PHONE);

export const passwordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, ERROR_MESSAGES.PASSWORD_TOO_SHORT)
  .max(MAX_PASSWORD_LENGTH)
  .regex(PASSWORD_REGEX, ERROR_MESSAGES.PASSWORD_TOO_WEAK);

export const bankAccountSchema = z
  .string()
  .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
  .regex(BANK_ACCOUNT_REGEX, ERROR_MESSAGES.INVALID_BANK_ACCOUNT);

export const zipCodeSchema = z
  .string()
  .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
  .regex(ZIP_CODE_REGEX, ERROR_MESSAGES.INVALID_ZIP_CODE);

export const nameSchema = z
  .string()
  .min(MIN_NAME_LENGTH, ERROR_MESSAGES.NAME_TOO_SHORT)
  .max(MAX_NAME_LENGTH, ERROR_MESSAGES.NAME_TOO_LONG);

export const descriptionSchema = z
  .string()
  .max(MAX_DESCRIPTION_LENGTH, ERROR_MESSAGES.DESCRIPTION_TOO_LONG)
  .optional();

export const slugSchema = z
  .string()
  .min(MIN_SLUG_LENGTH, ERROR_MESSAGES.SLUG_TOO_SHORT)
  .max(MAX_SLUG_LENGTH, ERROR_MESSAGES.SLUG_TOO_LONG)
  .regex(SLUG_REGEX, ERROR_MESSAGES.INVALID_SLUG);

export const parishNameSchema = z
  .string()
  .min(MIN_PARISH_NAME_LENGTH, ERROR_MESSAGES.PARISH_NAME_TOO_SHORT)
  .max(MAX_PARISH_NAME_LENGTH, ERROR_MESSAGES.PARISH_NAME_TOO_LONG)
  .regex(PARISH_NAME_REGEX, ERROR_MESSAGES.INVALID_PARISH_NAME);

export const passwordLoginSchema = z
  .string()
  .min(1, ERROR_MESSAGES.PASSWORD_REQUIRED);

export const phoneSchemaOptional = phoneSchema.optional();
export const websiteSchemaOptional = z
  .string()
  .url(ERROR_MESSAGES.INVALID_URL).optional();