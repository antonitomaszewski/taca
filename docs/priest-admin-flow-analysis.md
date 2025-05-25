# Analiza przepływu księży/administratorów parafii - Taca.pl

## 🔍 OBECNY STAN

### ✅ GOTOWE KOMPONENTY:
1. **Strona główna** (`/`) - z przyciskiem logowania i rejestracji
2. **Rejestracja parafii** (`/rejestracja-parafii`) - kompletny formularz
3. **Edycja profilu parafii** (`/edycja-parafii`) - 4-sekcyjny interface
4. **LoginButton** - modal w stylu Facebook z zielonym motywem
5. **API endpointy** - `/api/parishes` i `/api/parishes/[id]`
6. **Baza danych** - Prisma schema z modelami Parish, FundraisingGoal, Payment

### ❌ GŁÓWNE LUKI W PRZEPŁYWIE:

## 1. 🔐 SYSTEM AUTENTYKACJI
**Problem**: Brak prawdziwego systemu uwierzytelniania
- ❌ Brak NextAuth.js
- ❌ Brak hashowania haseł (bcrypt)
- ❌ Brak zarządzania sesjami
- ❌ Brak middleware ochrony tras
- ❌ LoginButton nie łączy się z bazą danych

**Konsekwencje**:
- Księża nie mogą się zalogować
- Brak ochrony danych parafii
- Niemożliwe zarządzanie kontem

## 2. 💾 INTEGRACJA Z BAZĄ DANYCH
**Problem**: Formularze nie zapisują danych
- ❌ Rejestracja nie tworzy konta w bazie
- ❌ Edycja parafii nie zapisuje zmian
- ❌ Brak API endpointów POST/PUT/DELETE
- ❌ Brak walidacji po stronie serwera

**Konsekwencje**:
- Dane parafii giną po odświeżeniu
- Niemożliwe zakładanie prawdziwych kont
- Formularz edycji jest tylko "demo"

## 3. 📊 PANEL ADMINISTRATORA PARAFII
**Problem**: Brak miejsca docelowego po zalogowaniu
- ❌ Brak dashboardu parafii
- ❌ Brak statystyk wpłat
- ❌ Brak zarządzania zbiórkami
- ❌ Brak ustawień konta

**Konsekwencje**:
- Księża nie wiedzą gdzie iść po zalogowaniu
- Brak narzędzi do zarządzania parafią
- Niemożliwe monitorowanie wpłat

## 4. ✅ WALIDACJA I BEZPIECZEŃSTWO
**Problem**: Podstawowa walidacja tylko frontend
- ❌ Brak walidacji email/telefon
- ❌ Brak sprawdzania siły hasła
- ❌ Brak zabezpieczeń CSRF
- ❌ Brak ograniczeń rate limiting

## 5. 🔄 NAWIGACJA I UX
**Problem**: Niespójny routing po akcjach
- ❌ Po rejestracji redirect do `/edycja-parafii` bez sprawdzenia logowania
- ❌ Brak breadcrumbs
- ❌ Brak "wróć" z formularzy
- ❌ Brak komunikatów o sukcesie/błędzie

---

## 🎯 PLAN NAPRAWY - ETAPY

### ETAP 1: PODSTAWOWA AUTENTYKACJA (PRIORITY 1)
1. **Dodaj NextAuth.js**
   - Konfiguracja providers (email/password)
   - Integracja z bazą Prisma
   - Sesje i JWT

2. **Rozszerz schema bazy**
   - Model User dla księży
   - Połączenie User -> Parish
   - Hashowanie haseł

3. **Połącz formularze z API**
   - POST `/api/auth/register`
   - API validation
   - Feedback użytkownika

### ETAP 2: PANEL ADMINISTRATORA (PRIORITY 2)
1. **Stwórz dashboard parafii**
   - `/dashboard` - chroniona trasa
   - Statystyki: wpłaty, cele, darczyńcy
   - Szybkie akcje

2. **Rozbuduj zarządzanie**
   - Edycja profilu parafii (połączona z DB)
   - Zarządzanie celami fundraisingowymi
   - Historia płatności

### ETAP 3: UX I BEZPIECZEŃSTWO (PRIORITY 3)
1. **Popraw przepływ**
   - Logiczne przekierowania
   - Loading states
   - Toast notifications

2. **Zabezpieczenia**
   - Rate limiting
   - Input sanitization
   - CSRF protection

---

## 📋 KONKRETNE ZADANIA DO WYKONANIA

### NAJBLIŻSZE KROKI:
1. [ ] Zainstaluj i skonfiguruj NextAuth.js
2. [ ] Dodaj model User do schema Prisma
3. [ ] Stwórz API `/api/auth/register`
4. [ ] Połącz LoginButton z autentykacją
5. [ ] Stwórz chronioną stronę `/dashboard`
6. [ ] Dodaj middleware sprawdzające sesje
7. [ ] Połącz formularz edycji z zapisem do DB

### MIERZALNE CELE:
- ✅ Księża mogą się zarejestrować i zalogować
- ✅ Dane parafii zapisują się w bazie
- ✅ Po zalogowaniu redirect do dashboardu
- ✅ Edycja profilu parafii działa
- ✅ Zabezpieczone trasy dla zalogowanych

---

## 🔧 TECHNICZNE ROZWIĄZANIA

### STACK AUTENTYKACJI:
- **NextAuth.js** - zarządzanie sesjami
- **bcrypt** - hashowanie haseł  
- **Prisma** - ORM z PostgreSQL
- **JWT** - tokeny sesji
- **Middleware** - ochrona tras

### ARCHITEKTURA API:
```
POST /api/auth/register     - rejestracja księdza
POST /api/auth/signin       - logowanie
GET  /api/auth/session      - sprawdzenie sesji
POST /api/parishes          - tworzenie parafii
PUT  /api/parishes/[id]     - edycja parafii
GET  /api/dashboard         - dane dashboardu
```

### STRUKTURA TRAS:
```
/ (homepage)
├── /rejestracja-parafii    - rejestracja
├── /dashboard              - [CHRONIONE] panel księdza
├── /edycja-parafii         - [CHRONIONE] edycja profilu
├── /cele-fundraisingowe    - [CHRONIONE] zarządzanie zbiórkami
└── /ustawienia             - [CHRONIONE] ustawienia konta
```
