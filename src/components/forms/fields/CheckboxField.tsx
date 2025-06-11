import { FormControlLabel, Checkbox, FormHelperText, Box } from '@mui/material';

interface CheckboxFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string | React.ReactNode;
  error?: string;
  required?: boolean;
}

export function CheckboxField({ 
  checked, 
  onChange, 
  label, 
  error = '', 
  required = false 
}: CheckboxFieldProps) {
  return (
    <Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            sx={{ 
              color: error ? 'error.main' : 'success.main',
              '&.Mui-checked': { color: 'success.main' }
            }}
          />
        }
        label={label}
        required={required}
        sx={{ 
          color: error ? 'error.main' : 'text.primary',
          alignItems: 'flex-start',
          '& .MuiFormControlLabel-label': { mt: 0.5 }
        }}
      />
      {error && (
        <FormHelperText error sx={{ ml: 0 }}>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
}