// Lista zakazanych slug'ów, które nie mogą być używane jako unikalne adresy parafii
export const FORBIDDEN_SLUGS = [
  // API routes
  'api',
  
  // Admin/system routes
  'admin',
  'dashboard',
  'panel',
  'backend',
  'system',
  'config',
  'settings',
  
  // User routes
  'user',
  'users',
  'profile',
  'account',
  'login',
  'logout',
  'signin',
  'signout',
  'register',
  'auth',
  
  // App routes
  'parafia',
  'parafie',
  'parishes',
  'parish',
  'church',
  'churches',
  'kosciol',
  'koscioly',
  
  // Payment/donation routes
  'platnosc',
  'platnosci',
  'payment',
  'payments',
  'donate',
  'donation',
  'donations',
  'wsparcie',
  'darowizna',
  'darowizny',
  
  // Form routes
  'rejestracja-parafii',
  'edycja-parafii',
  'rejestracja',
  'edycja',
  'edit',
  'create',
  'new',
  'add',
  
  // Static routes
  'mapa',
  'map',
  'about',
  'contact',
  'help',
  'faq',
  'terms',
  'privacy',
  'regulamin',
  'polityka-prywatnosci',
  'pomoc',
  'kontakt',
  'o-nas',
  
  // Reset/recovery routes
  'reset-hasla',
  'reset',
  'reset-password',
  'recover',
  'recovery',
  
  // Common words that might conflict
  'www',
  'mail',
  'email',
  'ftp',
  'blog',
  'news',
  'search',
  'find',
  'szukaj',
  'news',
  'aktualnosci',
  'events',
  'wydarzenia',
  'calendar',
  'kalendarz',
  
  // Technical terms
  'cdn',
  'assets',
  'static',
  'public',
  'files',
  'uploads',
  'images',
  'img',
  'css',
  'js',
  'scripts',
  
  // Status pages
  '404',
  '403',
  '500',
  'error',
  'not-found',
  'forbidden',
  'unauthorized',
  
  // Short/reserved words
  'a', 'an', 'the', 'i', 'me', 'my', 'we', 'our', 'you', 'your',
  'it', 'its', 'he', 'she', 'his', 'her', 'they', 'them', 'their',
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
  'ja', 'ty', 'on', 'ona', 'ono', 'my', 'wy', 'oni', 'one',
  'jest', 'sa', 'byl', 'byla', 'bylo', 'byli', 'byly', 'bedzie',
  
  // Polish administrative divisions
  'wojewodztwo',
  'powiat',
  'gmina',
  'miasto',
  'wies',
  'dzielnica',
  
  // Polish church terms
  'archidiecezja',
  'diecezja',
  'archikatedra',
  'katedra',
  'bazylika',
  'sanktuarium',
  'kaplica',
  'klasztor',
  'zakon',
  'proboszcz',
  'ksiadz',
  'ksieza',
  'kapelani',
  'duszpasterz',
  'msza',
  'msze',
  'nabożenstwo',
  'liturgia',
  'adoracja',
  'spowiedz',
  'chrzest',
  'bierzmowanie',
  'komunia',
  'slub',
  'pogrzeb',
  
  // Generic religious terms
  'church',
  'cathedral',
  'chapel',
  'monastery',
  'priest',
  'pastor',
  'mass',
  'service',
  'liturgy',
  'worship',
  'prayer',
  'blessing',
  'communion',
  'baptism',
  'confirmation',
  'wedding',
  'funeral',
];

/**
 * Sprawdza czy podany slug jest zakazany
 */
export function isForbiddenSlug(slug: string): boolean {
  const normalizedSlug = slug.toLowerCase().trim();
  return FORBIDDEN_SLUGS.includes(normalizedSlug);
}

/**
 * Waliduje slug - sprawdza format i czy nie jest zakazany
 */
export function validateSlug(slug: string): string | null {
  if (!slug || !slug.trim()) {
    return null; // Pusty slug jest OK (opcjonalny)
  }
  
  const trimmedSlug = slug.trim();
  
  // Sprawdź format
  if (!/^[a-z0-9-]+$/.test(trimmedSlug)) {
    return "Adres może zawierać tylko małe litery, cyfry i myślniki";
  }
  
  // Sprawdź długość
  if (trimmedSlug.length < 3) {
    return "Adres musi mieć co najmniej 3 znaki";
  }
  
  if (trimmedSlug.length > 50) {
    return "Adres może mieć maksymalnie 50 znaków";
  }
  
  // Sprawdź czy nie zaczyna ani nie kończy się myślnikiem
  if (trimmedSlug.startsWith('-') || trimmedSlug.endsWith('-')) {
    return "Adres nie może zaczynać ani kończyć się myślnikiem";
  }
  
  // Sprawdź czy nie ma podwójnych myślników
  if (trimmedSlug.includes('--')) {
    return "Adres nie może zawierać podwójnych myślników";
  }
  
  // Sprawdź czy nie jest zakazany
  if (isForbiddenSlug(trimmedSlug)) {
    return "Ten adres jest zarezerwowany i nie może być używany";
  }
  
  return null; // Brak błędów
}

/**
 * Generuje sugerowany slug na podstawie nazwy parafii
 */
export function generateSlugSuggestion(parishName: string, city?: string): string {
  const cleanName = parishName
    .toLowerCase()
    .replace(/ś/g, 's')
    .replace(/ć/g, 'c')
    .replace(/ń/g, 'n')
    .replace(/ł/g, 'l')
    .replace(/ż/g, 'z')
    .replace(/ź/g, 'z')
    .replace(/ą/g, 'a')
    .replace(/ę/g, 'e')
    .replace(/ó/g, 'o')
    .replace(/[^a-z0-9\s-]/g, '') // Usuń znaki specjalne
    .replace(/\s+/g, '-') // Zamień spacje na myślniki
    .replace(/-+/g, '-') // Usuń podwójne myślniki
    .replace(/^-|-$/g, ''); // Usuń myślniki z początku i końca
  
  const cleanCity = city 
    ? city
        .toLowerCase()
        .replace(/ś/g, 's')
        .replace(/ć/g, 'c')
        .replace(/ń/g, 'n')
        .replace(/ł/g, 'l')
        .replace(/ż/g, 'z')
        .replace(/ź/g, 'z')
        .replace(/ą/g, 'a')
        .replace(/ę/g, 'e')
        .replace(/ó/g, 'o')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    : '';
  
  // Skombinuj nazwę z miastem
  let suggestion = cleanCity ? `${cleanName}-${cleanCity}` : cleanName;
  
  // Ogranicz długość
  if (suggestion.length > 50) {
    suggestion = suggestion.substring(0, 47) + '...';
    // Usuń myślnik na końcu jeśli powstał przez obcięcie
    suggestion = suggestion.replace(/-+$/, '');
  }
  
  // Sprawdź czy nie jest zakazany
  if (isForbiddenSlug(suggestion)) {
    suggestion = `${suggestion}-parafia`;
  }
  
  return suggestion;
}
