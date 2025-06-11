import { z } from 'zod';


export function validateForm<T>(schema: z.ZodSchema, data: T): { isValid: boolean; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const fieldErrors: Record<string, string> = {};
  result.error.errors.forEach(error => {
    const fieldName = error.path[0] as string;
    fieldErrors[fieldName] = error.message;
  });

  return { isValid: false, errors: fieldErrors };
}