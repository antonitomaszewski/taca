export const theme = {
  colors: {
    primary: '#4caf50',
    primaryDark: '#2e7d32',
    primaryHover: '#45a049',
    primaryLight: '#e8f5e8',
    primaryLighter: 'rgba(76, 175, 80, 0.04)',
    
    secondary: '#666666',
    text: '#333333',
    textSecondary: '#666666',
    textLight: '#999999',
    
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    
    background: '#f8f9fa',
    backgroundLight: '#f5f5f5',
    white: '#ffffff',
    
    border: '#e0e0e0',
    borderFocus: '#4caf50',
    
    // Status colors
    disabled: '#cccccc',
    placeholder: '#999999'
  },
  
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem'
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    }
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px'
  },
  
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)'
  }
} as const;

/**
 * Wspólne style dla komponentów Material-UI
 */
export const muiStyles = {
  // Style dla TextField z motywem Taca.pl
  textField: {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: theme.colors.primary,
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: theme.colors.primary,
    },
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px white inset !important',
      WebkitTextFillColor: '#000 !important',
    }
  },
  
  // Style dla Button z motywem Taca.pl
  button: {
    primary: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      '&:hover': {
        backgroundColor: theme.colors.primaryHover,
      },
      '&:disabled': {
        backgroundColor: theme.colors.disabled,
      }
    },
    outline: {
      color: theme.colors.primary,
      borderColor: theme.colors.primary,
      '&:hover': {
        backgroundColor: theme.colors.primary,
        color: theme.colors.white,
      },
    }
  },
  
  // Style dla Checkbox z motywem Taca.pl
  checkbox: {
    color: theme.colors.primary,
    '&.Mui-checked': {
      color: theme.colors.primary,
    },
  },
  
  // Style dla AppBar
  appBar: {
    backgroundColor: theme.colors.white,
    color: theme.colors.text,
    boxShadow: theme.shadows.sm
  },
  
  // Style dla kart z zielonym motywem
  cardPrimary: {
    backgroundColor: theme.colors.primaryLight,
    border: `2px solid ${theme.colors.primary}`
  },
  
  // Style dla ToggleButton z motywem Taca.pl
  toggleButton: {
    '& .MuiToggleButton-root': {
      color: theme.colors.primary,
      borderColor: theme.colors.primary,
      '&.Mui-selected': {
        backgroundColor: theme.colors.primary,
        color: theme.colors.white,
        '&:hover': {
          backgroundColor: theme.colors.primaryHover,
        },
      },
      '&:hover': {
        backgroundColor: theme.colors.primaryLighter,
      },
    },
  },
  
  // Style dla Slider z motywem Taca.pl
  slider: {
    color: theme.colors.primary,
    '& .MuiSlider-thumb': {
      backgroundColor: theme.colors.primary,
    },
    '& .MuiSlider-track': {
      backgroundColor: theme.colors.primary,
    },
    '& .MuiSlider-rail': {
      backgroundColor: theme.colors.border,
    },
    '& .MuiSlider-mark': {
      backgroundColor: '#bfbfbf',
    },
    '& .MuiSlider-markLabel': {
      fontSize: theme.typography.fontSize.xs,
    },
  }
} as const;
