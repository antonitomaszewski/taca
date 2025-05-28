/**
 * Stałe definujące typy kont w systemie Taca.pl
 * - PARISHIONER: Konto parafianina/darczyńcy (jednoetapowa rejestracja)
 * - PARISH_ADMIN: Konto administratora parafii/proboszcza (dwuetapowa rejestracja)
 */

export const ACCOUNT_TYPES = {
  PARISHIONER: 'PARISHIONER',
  PARISH_ADMIN: 'PARISH_ADMIN'
} as const;

export type AccountType = typeof ACCOUNT_TYPES[keyof typeof ACCOUNT_TYPES];

// Etykiety w interfejsie użytkownika
export const ACCOUNT_TYPE_LABELS = {
  [ACCOUNT_TYPES.PARISHIONER]: 'Konto parafianina',
  [ACCOUNT_TYPES.PARISH_ADMIN]: 'Konto parafii'
} as const;

// Opisy typów kont
export const ACCOUNT_TYPE_DESCRIPTIONS = {
  [ACCOUNT_TYPES.PARISHIONER]: 'Dla osób prywatnych, które chcą wspierać parafie',
  [ACCOUNT_TYPES.PARISH_ADMIN]: 'Dla proboszczów i administratorów parafii'
} as const;

// Etapy rejestracji dla różnych typów kont
export const REGISTRATION_STEPS = {
  [ACCOUNT_TYPES.PARISHIONER]: ['user-data'], // Jeden etap
  [ACCOUNT_TYPES.PARISH_ADMIN]: ['user-data', 'parish-data'] // Dwa etapy
} as const;
