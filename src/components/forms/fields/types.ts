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