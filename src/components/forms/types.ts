export interface UserRegistrationData {
  email: string;
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
  [key: string]: string;
}

export interface FormValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnSubmit?: boolean;
}

export interface UseFormReturn<T> {
  formData: T;
  errors: Record<string, string>;
  isValid: boolean;
  handleFieldChange: (fieldName: string) => (value: string, error?: string) => void; // ✅ Dodano error
  handleSubmit: (e: React.FormEvent) => void;
  setFormData: (data: T) => void;
  clearErrors: () => void;
}