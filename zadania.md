- [ ] Telefon formularz rozbić na : nr kierunkowy i numer telefonu komórkowego
- [ ] cloudflare - weryfikacja tożsamości
- [ ] resend weryfikacja maila: pojedyncza dla parafianina, podwójna dla parafii
- [ ] w przyszłości maile z ogłoszeniami parafialnymi
- [ ] Refaktor
src/
├── components/
│   ├── forms/              # Komponenty formularzy
│   ├── ui/                 # Podstawowe UI (Button, Input)
│   └── sections/           # Sekcje stron (ParishInfo, PaymentForm)

src/
├── components/
│   ├── forms/                    # Logika formularzy
│   │   ├── ParishRegistrationForm.tsx
│   │   ├── ParishEditForm.tsx
│   │   ├── PaymentForm.tsx
│   │   └── LoginForm.tsx
│   │
│   ├── sections/                 # Większe sekcje UI
│   │   ├── ParishInfoSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── BankingSection.tsx
│   │   └── PaymentSection.tsx
│   │
│   ├── ui/                      # Bazowe komponenty (shadcn)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   │
│   └── layout/                  # Layout komponenty
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Navigation.tsx