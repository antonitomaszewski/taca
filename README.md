This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




# taca

Płatności pojedyncze i abonamentowe na naszą parafię.


Oto szczegółowy plan pracy nad stroną internetową do płatności na kościół, inspirowaną pomagam.pl, z uwzględnieniem Twoich wymagań i najlepszych praktyk:

1. Wybór technologii i architektury
- Płatności: Stripe (obsługuje jednorazowe i cykliczne płatności, łatwa integracja, darmowy plan startowy).
- Hosting: Vercel/Netlify (frontend), Railway/Render/Heroku (backend i baza danych) – darmowe plany na start.

1. Podział na etapy i widoki

Etap 1: Szkielet projektu i podstawowa nawigacja
- wdrożenie CI/CD.
- Routing: 3 główne widoki (mapa, kościół, płatność).

Etap 4: Widok płatności
- Integracja Stripe Checkout (przekierowanie do banku) i Stripe Elements (płatność kartą na stronie).
- Obsługa potwierdzenia płatności i powrotu na stronę.

Etap 5: Panel administracyjny (opcjonalnie)
- Dodawanie/edycja kościołów, przegląd płatności.

4. Bezpieczeństwo i RODO

- Bezpieczne przetwarzanie danych osobowych (SSL, polityka prywatności).
- Przechowywanie tylko niezbędnych danych, integracja z Stripe minimalizuje odpowiedzialność za dane kart.

5. Rozwój i testowanie

- Testy jednostkowe i integracyjne (Jest, React Testing Library).
- Automatyczne wdrożenia na środowisko testowe.

Podsumowanie

- Proponuję użyć nowoczesnych, darmowych frameworków (React, Next.js, Stripe, Leaflet).
- Możliwość rozwoju o kolejne funkcje (np. panel admina, statystyki, newsletter).

Jeśli chcesz, mogę przygotować szczegółowy podział zadań lub rozpocząć konfigurację projektu.


## Krok 1

Backend:
- Płatności: Stripe – obsługa płatności jednorazowych i cyklicznych, bardzo dobra dokumentacja, bezpieczeństwo.

Hosting:
- Vercel – darmowy hosting dla Next.js, automatyczne wdrożenia z GitHub.
- Railway/Render – darmowy hosting dla bazy danych PostgreSQL.

Testy i jakość:
- Jest + React Testing Library – testy jednostkowe i integracyjne.
- ESLint + Prettier – automatyczne formatowanie i lintowanie kodu.

Bezpieczeństwo:
- HTTPS (domyślnie na Vercel), ochrona danych osobowych, integracja Stripe minimalizuje odpowiedzialność za dane kart.

Podsumowanie:
- Możliwość rozwoju o panel admina, statystyki, newsletter.

ROZMOWY:



NASTĘPNE KROKI
Rekomendacje na następne kroki:
Ujednolicenie API - stwórz pełne CRUD endpointy
Integracja z prawdziwą bramką płatniczą (Stripe/PayU)
Autentykacja - login/register dla administratorów parafii
SEO optymalizacja - meta tagi, sitemap
Refaktor nawigacji - napraw niespójne linki

### **4. Dodać autentykację (commit: "feat: add NextAuth authentication for parish admins")**
- NextAuth.js dla administratorów parafii
- Panel administratora do zarządzania profilem parafii
15. 🔗 **Footer** - linki do regulaminu, polityki prywatności



Świetnie! Projekt wygląda już bardzo dobrze. Przeanalizowałem obecny stan i mam kilka propozycji dalszego rozwoju. Oto co możemy zrobić:

## 🎯 **Najpilniejsze usprawnienia**

### 1. **Funkcjonalność autentykacji**
- Połączenie formularza logowania z prawdziwą bazą danych
- Implementacja rejestracji użytkowników
- System sesji/tokenów JWT
- Hasła hashowane (bcrypt)

### 2. **System płatności**
- Integracja z prawdziwą bramką płatniczą (Stripe, PayU, Przelewy24)
- Obsługa płatności BLIK, kartą, Apple Pay, Google Pay
- System subskrypcji dla regularnych wpłat
- Generowanie faktur/potwierdzeń

### 3. **Panel administracyjny dla parafii**
- Dashboard z statystykami wpłat
- Zarządzanie profilami parafii
- System powiadomień o nowych wpłatach
- Eksport danych do księgowości

## 🚀 **Funkcje które dodadzą wartość**

### 4. **Mapa interaktywna**
- Prawdziwa integracja z Google Maps/OpenStreetMap
- Geolokalizacja użytkownika
- Wyświetlanie zdjęć parafii na mapie
- Filtry (odległość, typ mszy, itp.)

### 5. **System powiadomień**
- Email po wpłacie (dla darczyńcy i parafii)
- SMS powiadomienia
- Push notifications w przeglądarce
- Newsletter z aktualnościami parafii

### 6. **Rozbudowa profili parafii**
- Galeria zdjęć
- Kalendarz wydarzeń/mszy
- Aktualności parafii
- Historia i opis wspólnoty

## 💡 **Które z tych kierunków Cię interesują?**

**A) System płatności** - najważniejszy dla działania platformy
**B) Panel admin** - potrzebny do zarządzania przez parafie  
**C) Mapa interaktywna** - poprawi UX znajdowania parafii
**D) Autentykacja** - podstawa dla innych funkcji
**E) Coś innego?**

Co myślisz? Którym obszarem chciałbyś się zająć jako następnym? Mogę pomóc w implementacji każdego z tych elementów! 🛠️


Flow Ksiądz
❌ Brakuje autentykacji - brak NextAuth, sesji, hashowania haseł
❌ Brakuje połączenia z bazą danych - formularze nie zapisują danych
❌ Brakuje panelu administratora - po zalogowaniu brak dashboardu
❌ Brakuje walidacji - tylko podstawowa walidacja frontend

Flow Parafianin
Flow niezalogowany

npm run db:seed
npx prisma generate
npx tsc --noEmit
npm run lint
npm test
