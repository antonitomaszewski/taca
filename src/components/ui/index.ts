/**
 * Wspólne komponenty UI dla aplikacji Taca.pl
 */

import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  Box,
  TextField,
  Checkbox,
  Alert,
  CircularProgress,
  TextFieldProps,
  CheckboxProps,
  AlertProps,
  ButtonProps,
  ToggleButtonGroup,
  ToggleButton,
  ToggleButtonGroupProps,
  Slider,
  SliderProps,
  FormControlLabel,
  FormControlLabelProps,
  InputAdornment,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Paper,
  PaperProps,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Info as InfoIcon,
  Check as CheckIcon 
} from '@mui/icons-material';
import Link from 'next/link';
import { muiStyles, theme } from '../styles/theme';

// Navigation Bar
interface TacaAppBarProps {
  title?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
  rightContent?: React.ReactNode;
}

export function TacaAppBar({ 
  title = "Taca.pl", 
  showBackButton = false,
  backButtonText = "Znajdź parafię",
  backButtonHref = "/mapa",
  rightContent 
}: TacaAppBarProps) {
  return (
    <AppBar position="static" sx={muiStyles.appBar}>
      <Container maxWidth="lg">
        <Toolbar sx={{ px: 0 }}>
          <Typography 
            component={Link}
            href="/"
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: theme.typography.fontWeight.semibold, 
              color: theme.colors.primary,
              textDecoration: 'none'
            }}
          >
            {title}
          </Typography>
          
          {showBackButton && (
            <Button
              component={Link}
              href={backButtonHref}
              variant="outlined"
              sx={muiStyles.button.outline}
            >
              {backButtonText}
            </Button>
          )}
          
          {rightContent}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

// TextField z motywem Taca.pl
interface TacaTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined';
}

export function TacaTextField(props: TacaTextFieldProps) {
  return (
    <TextField
      variant="outlined"
      {...props}
      sx={{
        ...muiStyles.textField,
        ...props.sx
      }}
    />
  );
}

// Checkbox z motywem Taca.pl
interface TacaCheckboxProps extends CheckboxProps {}

export function TacaCheckbox(props: TacaCheckboxProps) {
  return (
    <Checkbox
      {...props}
      sx={{
        ...muiStyles.checkbox,
        ...props.sx
      }}
    />
  );
}

// Button z motywem Taca.pl
interface TacaButtonProps extends ButtonProps {
  tacaVariant?: 'primary' | 'outline';
}

export function TacaButton({ tacaVariant = 'primary', ...props }: TacaButtonProps) {
  const tacaStyles = tacaVariant === 'primary' ? muiStyles.button.primary : muiStyles.button.outline;
  
  return (
    <Button
      {...props}
      sx={{
        ...tacaStyles,
        ...props.sx
      }}
    />
  );
}

// Loading Spinner
interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

export function LoadingSpinner({ message = "Ładowanie...", size = 40 }: LoadingSpinnerProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
      <CircularProgress size={size} sx={{ color: theme.colors.primary, mb: 2 }} />
      {message && (
        <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}

// Error Alert
interface ErrorAlertProps extends Omit<AlertProps, 'severity'> {
  error: string | string[];
}

export function ErrorAlert({ error, ...props }: ErrorAlertProps) {
  const errorArray = Array.isArray(error) ? error : [error];
  
  return (
    <Alert severity="error" {...props}>
      <Box>
        {errorArray.map((line, index) => (
          <Typography key={index} variant="body2" sx={{ mb: index === errorArray.length - 1 ? 0 : 1 }}>
            {line}
          </Typography>
        ))}
      </Box>
    </Alert>
  );
}

// Success Alert
interface SuccessAlertProps extends Omit<AlertProps, 'severity'> {
  message: string;
}

export function SuccessAlert({ message, ...props }: SuccessAlertProps) {
  return (
    <Alert severity="success" {...props}>
      {message}
    </Alert>
  );
}

// Page Container
interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  sx?: any;
}

export function PageContainer({ children, maxWidth = "lg", sx = {} }: PageContainerProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.colors.background, ...sx }}>
      <Container maxWidth={maxWidth}>
        {children}
      </Container>
    </Box>
  );
}

// Form Section Card
interface FormSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isPrimary?: boolean;
}

export function FormSection({ title, icon, children, isPrimary = false }: FormSectionProps) {
  return (
    <Box
      sx={{
        bgcolor: isPrimary ? theme.colors.primaryLight : theme.colors.white,
        border: isPrimary ? `2px solid ${theme.colors.primary}` : `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.lg,
        p: 3,
        mb: 3
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        {icon}
        <Typography 
          variant="h5" 
          sx={{ 
            color: isPrimary ? theme.colors.primaryDark : theme.colors.text, 
            fontWeight: theme.typography.fontWeight.bold,
            ml: icon ? 2 : 0
          }}
        >
          {title}
        </Typography>
      </Box>
      {children}
    </Box>
  );
}
