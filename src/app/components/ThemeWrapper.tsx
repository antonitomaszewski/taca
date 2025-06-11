"use client";
import { ThemeProvider } from '@mui/material/styles';
import { muiTheme } from '@/styles/muiTheme';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
  return (
    <ThemeProvider theme={muiTheme}>
      {children}
    </ThemeProvider>
  );
}