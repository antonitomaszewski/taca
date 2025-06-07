export interface BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
}

export interface EmailFieldProps extends BaseFieldProps {
  label?: string;
}

export interface NameFieldProps extends BaseFieldProps {
  label?: string;
}

export interface PhoneFieldProps extends BaseFieldProps {
  label?: string;
  placeholder?: string;
}