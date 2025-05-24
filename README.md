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

- Frontend: React (z Next.js lub Vite) – szybki rozwój, łatwe zarządzanie stanem, duża społeczność, wiele gotowych komponentów UI (np. Material UI, Chakra UI, Ant Design).
- Backend: Node.js (Express lub Next.js API routes) – prosty backend do obsługi płatności, autoryzacji, zarządzania danymi.
- Baza danych: PostgreSQL lub MongoDB – do przechowywania danych o kościołach, użytkownikach, płatnościach.
- Płatności: Stripe (obsługuje jednorazowe i cykliczne płatności, łatwa integracja, darmowy plan startowy).
- Mapa: Leaflet.js (open source) + OpenStreetMap (darmowe mapy).
- Hosting: Vercel/Netlify (frontend), Railway/Render/Heroku (backend i baza danych) – darmowe plany na start.

2. Podział na etapy i widoki

Etap 1: Szkielet projektu i podstawowa nawigacja
- Utworzenie repozytorium, konfiguracja frameworków, wdrożenie CI/CD.
- Routing: 3 główne widoki (mapa, kościół, płatność).

Etap 2: Widok mapy kościołów
- Komponent mapy z markerami (Leaflet + OpenStreetMap).
- Wyszukiwarka kościołów (po nazwie, miejscowości).
- Pobieranie danych o kościołach z backendu.

Etap 3: Widok pojedynczego kościoła
- Szczegóły kościoła: nazwa, adres, opis, zdjęcia, cele zbiórek.
- Przycisk „Wesprzyj” prowadzący do widoku płatności.

Etap 4: Widok płatności
- Wybór kwoty, jednorazowa/abonamentowa, dane kontaktowe.
- Integracja Stripe Checkout (przekierowanie do banku) i Stripe Elements (płatność kartą na stronie).
- Obsługa potwierdzenia płatności i powrotu na stronę.

Etap 5: Panel administracyjny (opcjonalnie)
- Dodawanie/edycja kościołów, przegląd płatności.

3. Inspiracje z pomagam.pl

- Użycie gotowych komponentów UI (np. Material UI) pozwoli szybko uzyskać nowoczesny, responsywny wygląd zbliżony do pomagam.pl.
- Kolorystyka, układ sekcji, duże przyciski, czytelne formularze.
- Możliwość łatwego dostosowania stylów do własnych potrzeb.

4. Bezpieczeństwo i RODO

- Bezpieczne przetwarzanie danych osobowych (SSL, polityka prywatności).
- Przechowywanie tylko niezbędnych danych, integracja z Stripe minimalizuje odpowiedzialność za dane kart.

5. Rozwój i testowanie

- Testy jednostkowe i integracyjne (Jest, React Testing Library).
- Automatyczne wdrożenia na środowisko testowe.

Podsumowanie

- Proponuję użyć nowoczesnych, darmowych frameworków (React, Next.js, Stripe, Leaflet).
- Szybki start, łatwe skalowanie, nowoczesny wygląd.
- Możliwość rozwoju o kolejne funkcje (np. panel admina, statystyki, newsletter).

Jeśli chcesz, mogę przygotować szczegółowy podział zadań lub rozpocząć konfigurację projektu.








## Krok 1

Frontend:
- Next.js (React) – framework do budowy nowoczesnych aplikacji webowych, wspiera SSR (Server Side Rendering), łatwy routing, świetna integracja z Vercel, bardzo duża społeczność.
- UI: Material UI (MUI) – gotowe, nowoczesne komponenty, łatwe stylowanie, responsywność.
- Mapa: React-Leaflet + OpenStreetMap – darmowa, elastyczna mapa z markerami.

Backend:
- Next.js API Routes – backend w tym samym repozytorium, prostota wdrożenia, łatwa integracja z frontendem.
- Baza danych: PostgreSQL (przez Prisma ORM) – relacyjna, bezpieczna, popularna, łatwa do hostowania.
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
- Całość w jednym repozytorium (monorepo Next.js).
- Szybki start, łatwe skalowanie, nowoczesny wygląd, minimum konfiguracji.
- Możliwość rozwoju o panel admina, statystyki, newsletter.

## Krok 2
Utworzenie szkieletu trzech głównych widoków: mapa, kościół, płatność.




ROZMOWY:



NASTĘPNE KROKI
Rekomendacje na następne kroki:
Ujednolicenie API - stwórz pełne CRUD endpointy
Integracja z prawdziwą bramką płatniczą (Stripe/PayU)
Baza danych - zastąp mockowe dane prawdziwą bazą (Prisma + PostgreSQL?)
Autentykacja - login/register dla administratorów parafii
SEO optymalizacja - meta tagi, sitemap
Refaktor nawigacji - napraw niespójne linki

Świetnie! Masz rację - z Gitem nie potrzebujemy backup'ów. 

## 🎯 **Co powinniśmy teraz zrobić - moja rekomendacja:**

### **1. Uporządkować obecny kod (commit: "refactor: clean up project structure and fix SSR/CSR architecture")**
- ✅ Mamy już dobrą strukturę SSR vs CSR
- ✅ Strona główna i mapa działają
- ⚠️ Ale jeszcze nie sprawdziliśmy wszystkich błędów kompilacji

### **2. Dodać prawdziwą bazę danych (commit: "feat: add Prisma with PostgreSQL and seed data")**
```bash
npm install prisma @prisma/client
npm install -D prisma
```
- Schema dla parafii, celów zbiórek, płatności
- Seed z prawdziwymi danymi parafii z Wrocławia
- Zastąpienie mockowych API prawdziwymi

### **3. Poprawić UX mapy (commit: "feat: improve map UX with better markers and responsive design")**
- Dodać ładne ikony markerów (masz SVG w notatkach: `map-marker.svg`)
- Poprawić responsywność na mobile
- Dodać loading states

### **4. Dodać autentykację (commit: "feat: add NextAuth authentication for parish admins")**
- NextAuth.js dla administratorów parafii
- Panel administratora do zarządzania profilem parafii

---

## 🚀 **Moja sugestia - zacznijmy od punktu 2:**

**Dlaczego baza danych jako pierwsza?**
- Mamy już UI, ale dane są mockami
- Baza da nam prawdziwe fundamenty
- Będziemy mogli przetestować całą aplikację z prawdziwymi danymi

**Chcesz, żebym przygotował Prisma schema i konfigurację?** 

Mogę zacząć od:
1. Schema dla `Parafia`, `CelZbiorki`, `Platnosc`
2. Seed z prawdziwymi parafiami z Wrocławia
3. Zastąpienie `/api/koscioly` prawdziwym endpoint'em
