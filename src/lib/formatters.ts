/**
 * Funkcje formatujące różne typy danych
 */

/**
 * Formatuje numer konta bankowego w formacie IBAN polskim
 * Format: XX XXXX XXXX XXXX XXXX XXXX XXXX (26 cyfr)
 * @param value - numer konta (może zawierać spacje i inne znaki)
 * @returns sformatowany numer konta lub pusty string dla nieprawidłowych danych
 */
export function formatBankAccount(value: string): string {
  if (!value) return '';
  
  // Usuń wszystkie znaki niebędące cyframi
  const digitsOnly = value.replace(/[^\d]/g, '');
  
  // Ogranicz do 26 cyfr (polski IBAN)
  const limited = digitsOnly.slice(0, 26);
  
  // Formatuj w grupach: XX XXXX XXXX XXXX XXXX XXXX XXXX
  let formatted = '';
  for (let i = 0; i < limited.length; i++) {
    if (i === 2 || (i > 2 && (i - 2) % 4 === 0)) {
      formatted += ' ';
    }
    formatted += limited[i];
  }
  
  return formatted;
}

/**
 * Usuwa formatowanie z numeru konta bankowego (zostawia tylko cyfry)
 * @param value - sformatowany numer konta
 * @returns numer konta bez formatowania (tylko cyfry)
 */
export function unformatBankAccount(value: string): string {
  if (!value) return '';
  return value.replace(/[^\d]/g, '');
}

/**
 * Waliduje numer konta bankowego (polski IBAN)
 * @param value - numer konta do walidacji
 * @returns true jeśli numer jest prawidłowy
 */
export function validateBankAccount(value: string): boolean {
  if (!value) return false;
  const digitsOnly = unformatBankAccount(value);
  return digitsOnly.length === 26;
}

/**
 * Formatuje kwotę pieniężną
 * @param amount - kwota w PLN
 * @param showCurrency - czy pokazać symbol waluty
 * @returns sformatowana kwota
 */
export function formatCurrency(amount: number, showCurrency: boolean = true): string {
  const formatted = amount.toLocaleString('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return showCurrency ? `${formatted} zł` : formatted;
}

/**
 * Formatuje numer telefonu
 * @param phone - numer telefonu
 * @returns sformatowany numer telefonu
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  
  // Usuń wszystkie znaki niebędące cyframi i znakiem +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Jeśli zaczyna się od +48, formatuj jako polski numer
  if (cleaned.startsWith('+48')) {
    const digits = cleaned.slice(3);
    if (digits.length === 9) {
      return `+48 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
  }
  
  // W przeciwnym razie zwróć oczyszczony numer
  return cleaned;
}
