// src/styles/colors.ts
export const colors = {
  // Główny zielony motyw
  green: {
    main: '#4caf50',      // Główny zielony
    dark: '#2e7d32',      // Ciemny zielony  
    hover: '#45a049',     // Hover
    light: '#e8f5e8',     // Jasne tło
    lighter: 'rgba(76, 175, 80, 0.04)', // Bardzo jasne
    contrastText: '#ffffff', // ✅ Biały tekst na zielonym tle
  },
  
  // Neutralne
  grey: {
    text: '#333333',
    textSecondary: '#666666', 
    textLight: '#999999',
    border: '#e0e0e0',
    disabled: '#cccccc',
  },
  
  // Tła
  background: {
    main: '#f8f9fa',
    light: '#f5f5f5', 
    white: '#ffffff',
  },

  text: {
    primary: '#333333',
    secondary: '#666666',
    white: '#ffffff',      // ✅ Biały tekst
    onGreen: '#ffffff',    // ✅ Tekst na zielonym tle
  },
  
  // Status
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
} as const;