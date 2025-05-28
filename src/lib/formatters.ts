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
  // Formatuj do 2 miejsc po przecinku
  const fixed = amount.toFixed(2);
  
  // Rozdziel część całkowitą i dziesiętną
  const [integerPart, decimalPart] = fixed.split('.');
  
  // Formatuj część całkowitą z separatorami tysięcy (spacja co 3 cyfry od prawej)
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  
  // Połącz z polskim separatorem dziesiętnym (przecinek)
  const formatted = `${formattedInteger},${decimalPart}`;
  
  return showCurrency ? `${formatted} zł` : formatted;
}

/**
 * Formatuje numer telefonu polski
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
      // Sprawdź czy to numer komórkowy czy stacjonarny
      const firstDigit = digits[0];
      
      if (isPolishMobileNumber(digits)) {
        // Numer komórkowy: format XXX XXX XXX
        return `+48 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
      } else {
        // Numer stacjonarny: format XX XXX XX XX
        return `+48 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
      }
    }
  }
  
  // Jeśli numer zaczyna się od 0, usuń zero i dodaj +48
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    const digitsWithoutZero = cleaned.slice(1);
    return formatPhoneNumber(`+48${digitsWithoutZero}`);
  }
  
  // Jeśli to 9 cyfr bez prefiksu, dodaj +48
  if (/^\d{9}$/.test(cleaned)) {
    return formatPhoneNumber(`+48${cleaned}`);
  }
  
  // W przeciwnym razie zwróć oczyszczony numer
  return cleaned;
}

/**
 * Waliduje numer telefonu polski
 * @param phone - numer telefonu do walidacji
 * @returns true jeśli numer jest prawidłowy
 */
export function validatePhoneNumber(phone: string): boolean {
  if (!phone) return false;
  
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Sprawdź format +48XXXXXXXXX (12 znaków)
  if (cleaned.startsWith('+48') && cleaned.length === 12) {
    const digits = cleaned.slice(3);
    return digits.length === 9 && /^\d{9}$/.test(digits);
  }
  
  // Sprawdź format 0XXXXXXXXX (10 cyfr)
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return /^\d{10}$/.test(cleaned);
  }
  
  // Sprawdź format XXXXXXXXX (9 cyfr)
  if (cleaned.length === 9) {
    return /^\d{9}$/.test(cleaned);
  }
  
  return false;
}

/**
 * Usuwa formatowanie z numeru telefonu (zostawia tylko cyfry i +)
 * @param phone - sformatowany numer telefonu
 * @returns numer telefonu bez formatowania
 */
export function unformatPhoneNumber(phone: string): string {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Normalizuje numer telefonu do formatu +48XXXXXXXXX
 * @param phone - numer telefonu w dowolnym formacie
 * @returns znormalizowany numer telefonu
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  
  const cleaned = unformatPhoneNumber(phone);
  
  // Jeśli już ma +48
  if (cleaned.startsWith('+48')) {
    return cleaned;
  }
  
  // Jeśli zaczyna się od 0, usuń zero i dodaj +48
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `+48${cleaned.slice(1)}`;
  }
  
  // Jeśli to 9 cyfr, dodaj +48
  if (/^\d{9}$/.test(cleaned)) {
    return `+48${cleaned}`;
  }
  
  return cleaned;
}

/**
 * Sprawdza czy numer telefonu to polski numer komórkowy
 * @param digits - 9 cyfr numeru (bez +48)
 * @returns true jeśli to numer komórkowy
 */
function isPolishMobileNumber(digits: string): boolean {
  if (digits.length !== 9) return false;
  
  // Prefiksy numerów komórkowych w Polsce
  const mobilePrefix = digits.slice(0, 3);
  const mobilePrefixes = [
    '451', '452', '453', '454', '455', '456', '457', '458', '459',
    '460', '461', '462', '463', '464', '465', '466', '467', '468', '469',
    '500', '501', '502', '503', '504', '505', '506', '507', '508', '509',
    '510', '511', '512', '513', '514', '515', '516', '517', '518', '519',
    '520', '521', '522', '523', '524', '525', '526', '527', '528', '529',
    '530', '531', '532', '533', '534', '535', '536', '537', '538', '539',
    '570', '571', '572', '573', '574', '575', '576', '577', '578', '579',
    '600', '601', '602', '603', '604', '605', '606', '607', '608', '609',
    '660', '661', '662', '663', '664', '665', '666', '667', '668', '669',
    '690', '691', '692', '693', '694', '695', '696', '697', '698', '699',
    '720', '721', '722', '723', '724', '725', '726', '727', '728', '729',
    '730', '731', '732', '733', '734', '735', '736', '737', '738', '739',
    '780', '781', '782', '783', '784', '785', '786', '787', '788', '789',
    '880', '881', '882', '883', '884', '885', '886', '887', '888', '889'
  ];
  
  return mobilePrefixes.includes(mobilePrefix);
}
