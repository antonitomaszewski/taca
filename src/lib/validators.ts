/**
 * Centralne funkcje walidacji używane w całej aplikacji
 */

// Wyrażenia regularne
export const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[0-9\s-()]{9,15}$/,
  phoneStandard: /^\+48\d{9,10}$/,
  phoneMobile: /^\d{9}$/,
  zipCode: /^\d{2}-\d{3}$/,
  bankAccount: /^\d{26}$/,
  slug: /^[a-z0-9-]+$/,
} as const;

// Limity długości
export const LENGTH_LIMITS = {
  password: { min: 8, max: 128 },
  name: { min: 2, max: 100 },
  parishName: { min: 5, max: 200 },
  slug: { min: 3, max: 50 },
  description: { max: 1000 },
  address: { max: 200 },
} as const;

/**
 * Walidacja adresu email
 */
export function validateEmail(email: string): string {
  if (!email) return '';
  if (!REGEX_PATTERNS.email.test(email)) {
    return 'Niepoprawny format adresu email';
  }
  return '';
}

/**
 * Walidacja numeru telefonu
 */
export function validatePhone(phone: string): string {
  if (!phone) return '';
  if (!REGEX_PATTERNS.phone.test(phone.trim())) {
    return 'Niepoprawny format numeru telefonu (9-15 cyfr)';
  }
  return '';
}

/**
 * Walidacja numeru telefonu parafii (bardziej restrykcyjna)
 */
export function validateParishPhone(phone: string): string {
  if (!phone) return '';
  
  const cleanValue = phone.replace(/\s/g, '');
  
  // Sprawdź stacjonarny z kierunkowym: +48 + 2-3 cyfry + 7 cyfr = 12-13 cyfr total
  const isLandline = REGEX_PATTERNS.phoneStandard.test(cleanValue);
  // Sprawdź komórkowy: 9 cyfr (666666666)
  const isMobile = REGEX_PATTERNS.phoneMobile.test(cleanValue);
  
  if (!isLandline && !isMobile) {
    return "Nieprawidłowy format telefonu (użyj: +48 71 344 23 75 lub 666 666 666)";
  }
  
  return '';
}

/**
 * Walidacja hasła
 */
export function validatePassword(password: string): string {
  if (!password) return '';
  
  if (password.length < LENGTH_LIMITS.password.min) {
    return `Hasło musi mieć co najmniej ${LENGTH_LIMITS.password.min} znaków`;
  }
  
  if (password.length > LENGTH_LIMITS.password.max) {
    return `Hasło może mieć maksymalnie ${LENGTH_LIMITS.password.max} znaków`;
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Hasło musi zawierać małą literę';
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Hasło musi zawierać wielką literę';
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return 'Hasło musi zawierać cyfrę';
  }
  
  return '';
}

/**
 * Walidacja potwierdzenia hasła
 */
export function validatePasswordConfirm(password: string, confirm: string): string {
  if (!confirm) return '';
  if (password !== confirm) return 'Hasła nie są identyczne';
  return '';
}

/**
 * Walidacja kodu pocztowego
 */
export function validateZipCode(zipCode: string): string {
  if (!zipCode) return '';
  if (!REGEX_PATTERNS.zipCode.test(zipCode)) {
    return 'Niepoprawny format kodu pocztowego (przykład: 50-123)';
  }
  return '';
}

/**
 * Walidacja numeru konta bankowego
 */
export function validateBankAccount(accountNumber: string): string {
  if (!accountNumber) return '';
  
  const cleanValue = accountNumber.replace(/\s/g, '');
  if (!REGEX_PATTERNS.bankAccount.test(cleanValue)) {
    return 'Numer konta musi zawierać dokładnie 26 cyfr';
  }
  
  return '';
}

/**
 * Walidacja nazwy (imię, nazwisko, nazwa parafii itp.)
 */
export function validateName(name: string, fieldName: string = 'To pole', minLength: number = LENGTH_LIMITS.name.min): string {
  if (!name?.trim()) return `${fieldName} jest wymagane`;
  
  if (name.trim().length < minLength) {
    return `${fieldName} musi mieć co najmniej ${minLength} znaków`;
  }
  
  if (name.length > LENGTH_LIMITS.name.max) {
    return `${fieldName} może mieć maksymalnie ${LENGTH_LIMITS.name.max} znaków`;
  }
  
  return '';
}

/**
 * Walidacja nazwy parafii
 */
export function validateParishName(name: string): string {
  return validateName(name, 'Nazwa parafii', LENGTH_LIMITS.parishName.min);
}

/**
 * Walidacja URL strony internetowej
 */
export function validateWebsite(url: string): string {
  if (!url) return '';
  
  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if (!urlPattern.test(url)) {
    return 'Nieprawidłowy format strony internetowej';
  }
  
  return '';
}

/**
 * Sprawdza siłę hasła (0-5)
 */
export function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: '' };
  
  let score = 0;
  if (password.length >= 8) score++;
  if (/(?=.*[a-z])/.test(password)) score++;
  if (/(?=.*[A-Z])/.test(password)) score++;
  if (/(?=.*\d)/.test(password)) score++;
  if (/(?=.*[!@#$%^&*])/.test(password)) score++;
  
  const labels = ['', 'Bardzo słabe', 'Słabe', 'Średnie', 'Mocne', 'Bardzo mocne'];
  const colors = ['', '#f44336', '#ff9800', '#ffc107', '#4caf50', '#2e7d32'];
  
  return { score, label: labels[score], color: colors[score] };
}

/**
 * Waliduje rozmiar pliku (w bajtach)
 */
export function validateFileSize(file: File, maxSizeMB: number = 5): string {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    return `Plik nie może być większy niż ${maxSizeMB}MB`;
  }
  
  return '';
}

/**
 * Waliduje typ pliku obrazu
 */
export function validateImageFile(file: File): string {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return 'Dozwolone formaty: JPG, PNG, WebP';
  }
  
  return '';
}

/**
 * Waliduje plik obrazu (rozmiar + typ)
 */
export function validateImage(file: File, maxSizeMB: number = 5): string {
  const sizeError = validateFileSize(file, maxSizeMB);
  if (sizeError) return sizeError;
  
  const typeError = validateImageFile(file);
  if (typeError) return typeError;
  
  return '';
}
