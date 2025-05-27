/**
 * BIBLIOTEKA PRZELEWY24 - obsługa płatności online
 * 
 * Ten plik zawiera wszystkie funkcje potrzebne do integracji z Przelewy24:
 * - Tworzenie transakcji płatniczych
 * - Weryfikacja podpisów CRC (bezpieczeństwo)
 * - Obsługa powiadomień o statusie płatności
 * - Konfiguracja środowiska testowego i produkcyjnego
 * 
 * RELACJE Z INNYMI PLIKAMI:
 * - Używany przez API endpoints w /api/payments/
 * - Konfiguracja z zmiennych środowiskowych (.env.local)
 * - Dane płatności zapisywane przez Prisma do bazy danych
 * - Frontend wysyła dane przez formularz płatności
 */

import crypto from 'crypto'; // Wbudowany moduł Node.js do kryptografii

// ========================================
// KONFIGURACJA PRZELEWY24
// ========================================

// Stałe konfiguracyjne dla Przelewy24
export const PRZELEWY24_CONFIG = {
  // URL-e dla środowiska testowego (sandbox)
  SANDBOX_URL: 'https://sandbox.przelewy24.pl',
  SANDBOX_API_URL: 'https://sandbox.przelewy24.pl/api/v1',
  
  // URL-e dla środowiska produkcyjnego
  PRODUCTION_URL: 'https://secure.przelewy24.pl',
  PRODUCTION_API_URL: 'https://secure.przelewy24.pl/api/v1',
  
  // Domyślne wartości
  DEFAULT_CURRENCY: 'PLN',
  DEFAULT_COUNTRY: 'PL',
  DEFAULT_LANGUAGE: 'pl',
} as const;

// Typy danych dla lepszej kontroli TypeScript
export interface Przelewy24TransactionData {
  sessionId: string;          // Unikalny ID sesji (generowany przez nas)
  amount: number;            // Kwota w groszach (np. 1000 = 10.00 PLN)
  currency: string;          // Waluta (PLN)
  description: string;       // Opis płatności
  email: string;            // Email płacącego
  country: string;          // Kod kraju (PL)
  language: string;         // Język interfejsu (pl)
  urlReturn: string;        // URL powrotu po płatności
  urlStatus: string;        // URL dla powiadomień o statusie
  
  // Opcjonalne pola
  client?: string;          // Nazwa płacącego
  phone?: string;           // Telefon płacącego
  address?: string;         // Adres płacącego
  zip?: string;            // Kod pocztowy
  city?: string;           // Miasto
}

export interface Przelewy24Config {
  merchantId: number;       // ID sprzedawcy
  posId: number;           // ID punktu sprzedaży
  apiKey: string;          // Klucz API
  crc: string;             // Klucz CRC do podpisów
  isSandbox: boolean;      // Czy używamy środowiska testowego
}

// ========================================
// FUNKCJE POMOCNICZE
// ========================================

/**
 * Pobiera konfigurację Przelewy24 ze zmiennych środowiskowych
 * Sprawdza czy wszystkie wymagane zmienne są ustawione
 */
export function getPrzelewy24Config(): Przelewy24Config {
  const config = {
    merchantId: parseInt(process.env.PRZELEWY24_MERCHANT_ID || '0'),
    posId: parseInt(process.env.PRZELEWY24_POS_ID || '0'),
    apiKey: process.env.PRZELEWY24_API_KEY || '',
    crc: process.env.PRZELEWY24_CRC || '',
    isSandbox: process.env.NODE_ENV !== 'production',
  };

  // Walidacja konfiguracji - rzuć błędem tylko jeśli wszystkie są puste/domyślne
  if (!config.merchantId && !config.posId && !config.apiKey && !config.crc) {
    throw new Error('Przelewy24: Brak konfiguracji - wszystkie zmienne środowiskowe są puste');
  }
  
  // Jeśli niektóre są puste, ale nie wszystkie, zaloguj ostrzeżenie
  if (!config.merchantId || !config.posId || !config.apiKey || !config.crc) {
    console.warn('Przelewy24: Niepełna konfiguracja - niektóre zmienne środowiskowe są puste');
  }

  return config;
}

/**
 * Generuje bezpieczny podpis CRC dla weryfikacji transakcji
 * Przelewy24 wymaga tego do weryfikacji autentyczności żądań
 */
export function generateCrcSignature(
  sessionId: string,
  merchantId: number,
  amount: number,
  currency: string,
  crcKey: string
): string {
  // Format wymagany przez Przelewy24: sessionId|merchantId|amount|currency|crc
  const dataToSign = `${sessionId}|${merchantId}|${amount}|${currency}|${crcKey}`;
  
  // Generowanie hash MD5 (wymagane przez Przelewy24)
  return crypto.createHash('md5').update(dataToSign).digest('hex');
}

/**
 * Generuje unikalny ID sesji dla transakcji
 * Format: timestamp + random string dla unikalności
 */
export function generateSessionId(): string {
  const timestamp = Date.now().toString();
  const randomPart = crypto.randomBytes(8).toString('hex');
  return `taca_${timestamp}_${randomPart}`;
}

// ========================================
// GŁÓWNE FUNKCJE PŁATNOŚCI
// ========================================

/**
 * Tworzy nową transakcję w systemie Przelewy24
 * Zwraca URL do przekierowania użytkownika na stronę płatności
 */
export async function createPrzelewy24Transaction(
  transactionData: Przelewy24TransactionData
): Promise<{ paymentUrl: string; token: string }> {
  
  // Spróbuj pobrać konfigurację - jeśli nie ma, użyj trybu demo
  let config: Przelewy24Config;
  
  try {
    config = getPrzelewy24Config();
  } catch (error) {
    console.log('TRYB DEMO: Brak konfiguracji Przelewy24, używam mocka');
    const mockToken = `demo_${Date.now()}`;
    return {
      paymentUrl: `http://localhost:3000/platnosc/sukces?demo=true&token=${mockToken}`,
      token: mockToken,
    };
  }
  
  // Sprawdź czy to są placeholder credentials
  if (config.merchantId === 123456 || 
      config.apiKey === 'twoj-api-key-tutaj' || 
      config.apiKey === 'your-api-key-here' ||
      config.merchantId === 0) {
    console.log('TRYB DEMO: Używam placeholder credentials, przełączam na mock');
    const mockToken = `demo_${Date.now()}`;
    return {
      paymentUrl: `http://localhost:3000/platnosc/sukces?demo=true&token=${mockToken}`,
      token: mockToken,
    };
  }
  
  // Generuj podpis CRC dla bezpieczeństwa
  const crcSignature = generateCrcSignature(
    transactionData.sessionId,
    config.merchantId,
    transactionData.amount,
    transactionData.currency,
    config.crc
  );

  // Przygotuj dane do wysłania do Przelewy24
  const requestData = {
    merchantId: config.merchantId,
    posId: config.posId,
    sessionId: transactionData.sessionId,
    amount: transactionData.amount,
    currency: transactionData.currency,
    description: transactionData.description,
    email: transactionData.email,
    country: transactionData.country,
    language: transactionData.language,
    urlReturn: transactionData.urlReturn,
    urlStatus: transactionData.urlStatus,
    sign: crcSignature,
    
    // Opcjonalne dane osobowe
    ...(transactionData.client && { client: transactionData.client }),
    ...(transactionData.phone && { phone: transactionData.phone }),
    ...(transactionData.address && { address: transactionData.address }),
    ...(transactionData.zip && { zip: transactionData.zip }),
    ...(transactionData.city && { city: transactionData.city }),
  };

  // Wybierz odpowiedni URL API (sandbox vs produkcja)
  const apiUrl = config.isSandbox 
    ? PRZELEWY24_CONFIG.SANDBOX_API_URL 
    : PRZELEWY24_CONFIG.PRODUCTION_API_URL;

  try {
    console.log('Wysyłanie żądania do Przelewy24:', {
      url: `${apiUrl}/transaction/register`,
      merchantId: config.merchantId,
      posId: config.posId,
      sessionId: transactionData.sessionId,
      amount: transactionData.amount,
      // Nie loguj wrażliwych danych jak API key
    });

    // Wyślij żądanie do Przelewy24 API
    const response = await fetch(`${apiUrl}/transaction/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${config.posId}:${config.apiKey}`).toString('base64')}`,
      },
      body: JSON.stringify(requestData),
    });

    console.log('Odpowiedź Przelewy24:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Błąd Przelewy24 API:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      throw new Error(`Przelewy24 API Error: ${response.status} - ${errorData}`);
    }

    const responseData = await response.json();
    
    console.log('Pełna odpowiedź Przelewy24:', JSON.stringify(responseData, null, 2));
    
    // Sprawdź różne możliwe struktury odpowiedzi
    let token = null;
    
    if (responseData.data && responseData.data.token) {
      token = responseData.data.token;
    } else if (responseData.token) {
      token = responseData.token;
    } else if (responseData.sessionId) {
      token = responseData.sessionId;
    } else {
      console.error('Nie znaleziono tokenu/sessionId w odpowiedzi:', responseData);
      throw new Error('Brak identyfikatora sesji płatności');
    }
    
    // Przelewy24 zwraca token, z którego budujemy URL płatności
    const baseUrl = config.isSandbox 
      ? PRZELEWY24_CONFIG.SANDBOX_URL 
      : PRZELEWY24_CONFIG.PRODUCTION_URL;
    
    const paymentUrl = `${baseUrl}/trnRequest/${token}`;

    return {
      paymentUrl,
      token,
    };

  } catch (error) {
    console.error('Błąd tworzenia transakcji Przelewy24:', error);
    throw new Error('Nie udało się utworzyć płatności. Spróbuj ponownie.');
  }
}

/**
 * Weryfikuje powiadomienie o statusie płatności od Przelewy24
 * Używane w webhook endpoint do potwierdzenia autentyczności
 */
export async function verifyPrzelewy24Payment(
  sessionId: string,
  amount: number,
  currency: string,
  orderId: number
): Promise<boolean> {
  const config = getPrzelewy24Config();

  // Generuj podpis dla weryfikacji
  const crcSignature = generateCrcSignature(
    sessionId,
    config.merchantId,
    amount,
    currency,
    config.crc
  );

  const verificationData = {
    merchantId: config.merchantId,
    posId: config.posId,
    sessionId,
    amount,
    currency,
    orderId,
    sign: crcSignature,
  };

  const apiUrl = config.isSandbox 
    ? PRZELEWY24_CONFIG.SANDBOX_API_URL 
    : PRZELEWY24_CONFIG.PRODUCTION_API_URL;

  try {
    const response = await fetch(`${apiUrl}/transaction/verify`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${config.posId}:${config.apiKey}`).toString('base64')}`,
      },
      body: JSON.stringify(verificationData),
    });

    // Przelewy24 zwraca status 200 dla poprawnej weryfikacji
    return response.ok;

  } catch (error) {
    console.error('Błąd weryfikacji płatności Przelewy24:', error);
    return false;
  }
}

/**
 * Konwertuje kwotę z PLN na grosze (wymagane przez Przelewy24)
 * Przykład: 10.50 PLN → 1050 groszy
 */
export function convertToGrosze(amountInPLN: number): number {
  return Math.round(amountInPLN * 100);
}

/**
 * Konwertuje kwotę z groszy na PLN (dla wyświetlania)
 * Przykład: 1050 groszy → 10.50 PLN
 */
export function convertFromGrosze(amountInGrosze: number): number {
  return amountInGrosze / 100;
}
