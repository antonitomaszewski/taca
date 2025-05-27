# Analiza przepływu księży/administratorów parafii - Taca.pl

## 🔍 OBECNY STAN

### ❌ GŁÓWNE LUKI W PRZEPŁYWIE:

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
- ❌ Brak sprawdzania siły hasła
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



🔄 JAK TO WSZYSTKO WSPÓŁPRACUJE
Przepływ rejestracji księdza:
📝 Ksiądz wypełnia formularz /rejestracja-parafii
🔐 System tworzy rekord w tabeli User z hashowanym hasłem
🏛️ System tworzy/łączy parafię z księdzem
✅ Ksiądz może się logować przez LoginButton
Przepływ logowania:
🔑 Ksiądz podaje email/hasło w LoginButton
🔍 NextAuth sprawdza dane w tabeli User
🎫 Tworzy sesję w tabeli Session
🚪 Przekierowuje do dashboardu parafii
Bezpieczeństwo:
🛡️ Hasła hashowane bcrypt
🎫 Sesje zarządzane przez NextAuth
🚫 Chronione trasy przez middleware
🔒 CSRF protection wbudowana
🎯 NASTĘPNE KROKI
Teraz gdy baza jest gotowa, możemy:

✅ Połączyć formularz rejestracji z zapisem do tabeli User
✅ Połączyć LoginButton z prawdziwą autentykacją
✅ Stworzyć dashboard dla zalogowanych księży
✅ Dodać middleware chroniące trasy