import { z } from 'zod';

export const createFieldChangeHandler = (
  validateFn: (value: string) => string,
  onChange: (value: string, error: string) => void
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const validationError = validateFn(newValue);
    onChange(newValue, validationError);
  };
};