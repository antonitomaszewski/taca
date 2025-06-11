import { colors } from './colors';

export const formStyles = {
  container: {
    py: 6,
  },
  
  paper: {
    elevation: 3,
    sx: {
      p: 4,
      borderRadius: 3,
      background: colors.background.gradient,
    },
  },
  
  // Typography
  title: {
    variant: "h3" as const,
    component: "h1" as const,
    sx: {
      fontWeight: 'bold',
      mb: 2,
      color: 'success.main',
      textAlign: 'center',
    },
  },
  
  subtitle: {
    variant: "h6" as const,
    sx: {
      color: 'text.secondary',
    //   maxWidth: 600,
      mx: 'auto',
      textAlign: 'center',
      mb: 6,
    },
  },
  
  sectionTitle: {
    variant: "h6" as const,
    component: "h2" as const,
    sx: {
      mb: 3,
      fontWeight: 600,
    },
  },
  
  // Form
  form: {
    component: "form" as const,
    sx: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
    },
  },
  
  buttonContainer: {
    sx: {
      display: 'flex',
      gap: 2,
      justifyContent: 'space-between',
      mt: 4,
    },
  },
  
  outlinedButton: {
    variant: "outlined" as const,
    sx: {
      borderColor: 'success.main',
      color: 'success.main',
      bgcolor: 'transparent',
      borderRadius: 2,
      '&:hover': {
        borderColor: 'success.dark',
        bgcolor: 'action.hover',
      },
      transition: 'all 0.2s ease',
    },
  },
  
  containedButton: {
    variant: "contained" as const,
    sx: {
      bgcolor: 'success.main',
      color: 'white',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'success.main',
      '&:hover': {
        bgcolor: 'success.dark',
        borderColor: 'success.dark',
      },
      '&:disabled': { 
        bgcolor: 'grey.400',
        borderColor: 'grey.400',
      },
      transition: 'all 0.2s ease',
    },
  },
} as const;