// Regex patterns
export const PHONE_REGEX = /^\+48\d{9}$/;
export const BANK_ACCOUNT_REGEX = /^\d{26}$/;
export const ZIP_CODE_REGEX = /^\d{2}-\d{3}$/;
export const PASSWORD_REGEX = /^(?=.*[\p{Ll}])(?=.*[\p{Lu}])(?=.*\d).+$/u;
export const SLUG_REGEX = /^[a-z0-9-]+$/;
export const PARISH_NAME_REGEX = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-\.]+$/;

// Długości pól
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 50;
export const BANK_ACCOUNT_LENGTH = 26;
export const MIN_NAME_LENGTH = 2;
export const MAX_NAME_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 1000;
export const MIN_SLUG_LENGTH = 3;
export const MAX_SLUG_LENGTH = 50;
export const MIN_PARISH_NAME_LENGTH = 5;
export const MAX_PARISH_NAME_LENGTH = 150;

// Komunikaty błędów
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'To pole jest wymagane',
  INVALID_EMAIL: 'Nieprawidłowy adres email',
  INVALID_PHONE: 'Telefon musi mieć format +48XXXXXXXXX',
  INVALID_BANK_ACCOUNT: 'Numer konta musi mieć dokładnie 26 cyfr',
  INVALID_ZIP_CODE: 'Kod pocztowy musi mieć format XX-XXX',
  PASSWORD_TOO_SHORT: `Hasło musi mieć minimum ${MIN_PASSWORD_LENGTH} znaków`,
  PASSWORD_TOO_WEAK: 'Hasło musi zawierać małą literę, wielką literę i cyfrę',
  PASSWORDS_NOT_MATCHING: 'Hasła nie są identyczne',
  PASSWORD_REQUIRED: 'Hasło jest wymagane',
  NAME_TOO_SHORT: `Nazwa musi mieć minimum ${MIN_NAME_LENGTH} znaki`,
  NAME_TOO_LONG: `Nazwa może mieć maksymalnie ${MAX_NAME_LENGTH} znaków`,
  DESCRIPTION_TOO_LONG: `Opis może mieć maksymalnie ${MAX_DESCRIPTION_LENGTH} znaków`,
  INVALID_SLUG: 'URL może zawierać tylko małe litery, cyfry i myślniki',
  SLUG_TOO_SHORT: `URL musi mieć minimum ${MIN_SLUG_LENGTH} znaki`,
  SLUG_TOO_LONG: `URL może mieć maksymalnie ${MAX_SLUG_LENGTH} znaków`,
  INVALID_PARISH_NAME: 'Nazwa parafii może zawierać tylko litery, spacje, myślniki i kropki',
  PARISH_NAME_TOO_SHORT: `Nazwa parafii musi mieć minimum ${MIN_PARISH_NAME_LENGTH} znaków`,
  PARISH_NAME_TOO_LONG: `Nazwa parafii może mieć maksymalnie ${MAX_PARISH_NAME_LENGTH} znaków`,
  INVALID_URL: 'Nieprawidłowy URL'
} as const;