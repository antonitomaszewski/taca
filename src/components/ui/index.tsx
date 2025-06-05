/**
 * Reusable UI Components for Taca.pl
 * 
 * Ten plik zawiera komponenty UI, które są używane w całej aplikacji
 * i pomagają w zachowaniu spójnego stylu zgodnego z motywem Taca.pl.
 * 
 * Komponenty bazują na Material-UI i wykorzystują centralne style z theme.ts
 */

import React from 'react';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  TextField,
  Checkbox,
  Box,
  CircularProgress,
  Alert,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  FormControlLabel,
  RadioGroup,
  Radio
} from '@mui/material';
import { muiStyles, theme } from '@/styles/theme';

// =======================
// NAVIGATION COMPONENTS
// =======================

interface TacaAppBarProps {
  title?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
  rightContent?: React.ReactNode;
}

/**
 * Standardowy AppBar dla Taca.pl z logiem i opcjonalnym przyciskiem powrotu
 */
export const TacaAppBar: React.FC<TacaAppBarProps> = ({
  title = "Taca.pl",
  showBackButton = false,
  backButtonText = "Powrót",
  backButtonHref = "/",
  rightContent
}) => (
  <AppBar position="static" sx={muiStyles.appBar}>
    <Container maxWidth="lg">
      <Toolbar sx={{ px: 0 }}>
        <Typography
          variant="h6"
          component={Link}
          href="/"
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

// =======================
// FORM COMPONENTS
// =======================

interface TacaTextFieldProps extends React.ComponentProps<typeof TextField> {
  // Rozszerzamy standardowe props TextField
}

/**
 * TextField z motywem Taca.pl - zielony focus i spójny styl
 */
export const TacaTextField: React.FC<TacaTextFieldProps> = (props) => (
  <TextField
    variant="outlined"
    {...props}
    sx={{
      ...muiStyles.textField,
      ...props.sx
    }}
  />
);

interface TacaCheckboxProps extends React.ComponentProps<typeof Checkbox> {
  // Rozszerzamy standardowe props Checkbox
}

/**
 * Checkbox z zielonym motywem Taca.pl
 */
export const TacaCheckbox: React.FC<TacaCheckboxProps> = (props) => (
  <Checkbox
    {...props}
    sx={{
      ...muiStyles.checkbox,
      ...props.sx
    }}
  />
);

interface TacaButtonProps extends Omit<React.ComponentProps<typeof Button>, 'variant'> {
  variant?: 'primary' | 'outline';
  href?: string;
}

/**
 * Button z predefiniowanymi stylami Taca.pl
 */
export const TacaButton: React.FC<TacaButtonProps> = ({ variant = 'primary', href, ...props }) => {
  const tacaStyles = variant === 'primary' ? muiStyles.button.primary : muiStyles.button.outline;
  
  const buttonProps = {
    ...props,
    sx: {
      ...tacaStyles,
      ...props.sx
    }
  };

  if (href) {
    return (
      <Button
        component={Link}
        href={href}
        {...buttonProps}
      />
    );
  }
  
  return <Button {...buttonProps} />;
};

interface TacaToggleButtonGroupProps extends React.ComponentProps<typeof ToggleButtonGroup> {
  // Rozszerzamy standardowe props ToggleButtonGroup
}

/**
 * ToggleButtonGroup z motywem Taca.pl
 */
export const TacaToggleButtonGroup: React.FC<TacaToggleButtonGroupProps> = (props) => (
  <ToggleButtonGroup
    {...props}
    sx={{
      ...muiStyles.toggleButton,
      ...props.sx
    }}
  />
);

interface TacaSliderProps extends React.ComponentProps<typeof Slider> {
  // Rozszerzamy standardowe props Slider
}

/**
 * Slider z motywem Taca.pl
 */
export const TacaSlider: React.FC<TacaSliderProps> = (props) => (
  <Slider
    {...props}
    sx={{
      ...muiStyles.slider,
      ...props.sx
    }}
  />
);

// =======================
// SPECIALIZED COMPONENTS
// =======================

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  methods: Array<{
    value: string;
    label: string;
    icon: string;
  }>;
}

/**
 * Standardowy selektor metod płatności używany w aplikacji
 */
export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  methods
}) => (
  <RadioGroup value={selectedMethod} onChange={(e) => onMethodChange(e.target.value)}>
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
      {methods.map(method => (
        <Box key={method.value}>
          <FormControlLabel
            value={method.value}
            control={<Radio sx={{ display: 'none' }} />}
            label={
              <Box
                sx={{
                  border: selectedMethod === method.value ? '2px solid #4caf50' : '2px solid #e0e0e0',
                  borderRadius: 2,
                  p: 2,
                  cursor: 'pointer',
                  background: selectedMethod === method.value ? '#e8f5e8' : '#fff',
                  transition: 'border 0.2s, background 0.2s',
                  boxShadow: selectedMethod === method.value ? 2 : 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 80,
                  width: 110,
                  overflow: 'hidden',
                }}
                onClick={() => onMethodChange(method.value)}
              >
                <img
                  src={method.icon}
                  alt={method.label}
                  style={{
                    maxHeight: 48,
                    maxWidth: 80,
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto',
                  }}
                />
              </Box>
            }
            labelPlacement="top"
            sx={{ m: 0, width: '100%' }}
            checked={selectedMethod === method.value}
          />
        </Box>
      ))}
    </Box>
  </RadioGroup>
);

interface FormFieldWithLabelProps {
  label: string;
  required?: boolean;
  tooltip?: string;
  error?: string;
  children: React.ReactNode;
}

/**
 * Standardowe pole formularza z etykietą, wskaźnikiem wymaganego pola i tooltipem
 */
export const FormFieldWithLabel: React.FC<FormFieldWithLabelProps> = ({
  label,
  required = false,
  tooltip,
  error,
  children
}) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </Typography>
      {tooltip && (
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
          ({tooltip})
        </Typography>
      )}
    </Box>
    {children}
    {error && (
      <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
        {error}
      </Typography>
    )}
  </Box>
);

// =======================
// UTILITY COMPONENTS
// =======================

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
}

/**
 * Standardowy spinner ładowania z opcjonalną wiadomością
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 40, 
  message 
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
    <CircularProgress size={size} sx={{ color: theme.colors.primary, mb: 2 }} />
    {message && (
      <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
        {message}
      </Typography>
    )}
  </Box>
);

interface ErrorAlertProps extends React.ComponentProps<typeof Alert> {
  error: string | string[];
}

/**
 * Alert do wyświetlania błędów z obsługą pojedynczych i wielu błędów
 */
export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, ...props }) => {
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
};

interface SuccessAlertProps extends React.ComponentProps<typeof Alert> {
  message: string;
}

/**
 * Alert do wyświetlania komunikatów sukcesu
 */
export const SuccessAlert: React.FC<SuccessAlertProps> = ({ message, ...props }) => (
  <Alert severity="success" {...props}>
    {message}
  </Alert>
);

// =======================
// LAYOUT COMPONENTS
// =======================

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  sx?: object;
}

/**
 * Kontener strony z pełną wysokością i tłem
 */
export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  maxWidth = 'lg',
  sx = {}
}) => (
  <Box sx={{ minHeight: '100vh', bgcolor: theme.colors.background, ...sx }}>
    <Container maxWidth={maxWidth}>
      {children}
    </Container>
  </Box>
);

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  isPrimary?: boolean;
}

/**
 * Karta sekcji z tytułem i opcjonalną ikoną
 */
export const SectionCard: React.FC<SectionCardProps> = ({ 
  title, 
  children, 
  icon, 
  isPrimary = false 
}) => (
  <Box
    component={Paper}
    elevation={2}
    sx={{
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
