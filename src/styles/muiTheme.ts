// src/styles/muiTheme.ts
import { createTheme } from '@mui/material/styles';
import { colors } from './colors';

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: colors.green.main,    // #4caf50
      dark: colors.green.dark,    // #2e7d32
    },
    success: {
      main: colors.green.main,    // Teraz success = twój zielony!
      dark: colors.green.hover,
    },
    background: {
      default: colors.background.main,
    },
    text: {
      primary: colors.grey.text,
    }
  },
});