useState, useEffect - te mają use client
te które stronie serwera, nie mają tego, mogą być async

zarówno ofiara.com, ofiara.pl, taca.pl są nieużywane
zarejestrujemy się jako fundacja

inspiracje:
https://www.siepomaga.pl/
https://pomagam.pl/

info każdej parafii: http://www.psiepole.archidiecezja.wroc.pl/kontakt.html

svg repo https://www.svgrepo.com/vectors/map-marker/multicolor/

npx prisma migrate dev --name add_bank_account_and_unique_slug
npx prisma db seed
npx prisma db push
<!-- npx prisma generate -->
sudo systemctl start postgresql
npx prisma studio


ważne:
DZIAŁAJĄCE PŁATNOŚCI Stripe/PayU payments
POWIADOMIENIA MAILOWE Email notifications
Admin panel

.env.local ma pioriory
npm run dev

- Environments: .env.local, .env
jedną z ważniejszych stron jest not found - ją należy zaimplementować na samym początku. Wyświetla się zawsze, gdy nie mamy dostępu do danego widoku


Gotowe sklepy:
2click.pl (Trol)
Aptusshop
Comarch
inna
KQS.store
Magento 1
Magento 2
OpenCart
PrestaShop
Sote
Sellsmart
Woocommerce




czekaj, czyli jaki jest plan:
robimy
0 stałe validation/constants
1 walidację schema pól
2 walidacja schema cały form
3 tworzymy pojedyncze komponenty (jeszcze bez walidacji?)
4 tworzymy komponenty form (z użyciem schema-form ?)
5 używamy pełne komponenty form, które mają już walidację na naszej stronie

Rejestracja użytkownika - email, hasło, imię
Logowanie - email, hasło
Rejestracja parafii - nazwa, adres, slug, konto bankowe, etc.
Edycja profilu użytkownika - imię, email, telefon (opcjonalny)
Edycja parafii - wszystkie dane parafii
Płatność - kwota, metoda, email, podpis


zxczxczxcćA1 - walidacja haseł nie pozwala na coś takiego, aberracja
PASSWORD_REGEX jest zły (powinny być dowolne znaki)

nie rozumiem tego fragmentu:
czy validateEmail nie powinniśmy użyć w src/components/forms/fields/EmailField.tsx
itd?
gdzie powinien znaleźć się fieldValidators, bo chyba nie w komponentach

import { validateEmail, validateName, validatePhone, validatePassword } from '@/lib/validation/fieldValidators';

const fieldValidators = {
email: validateEmail,
name: validateName,
phone: validatePhone,
password: validatePassword,
confirmPassword: validatePassword,
};

const handleFieldChange = (fieldName: string) => (value: string) => {
setFormData(prev => ({ ...prev, [fieldName]: value }));

// Walidacja onChange dla każdego pola osobno
if (options.validateOnChange && value.length > 0) {
const validator = fieldValidators[fieldName as keyof typeof fieldValidators];
const error = validator ? validator(value) : '';
setErrors(prev => ({ ...prev, [fieldName]: error }));
} else {
setErrors(prev => ({ ...prev, [fieldName]: '' }));
}
};