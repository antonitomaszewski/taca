hej, chciałbym, żebyś był zwięzły, analityczny, nie popełniał błędów
zanim zaczniesz pisać kod chce żebyś ze mną dobrze omówił problem. musimy dokładnie rozumieć zagadnienia a następnie możemy się zabrać do pracy
pisz prosto, konkretnie, nie dużo
System ma być bezpieczny.
Walidujemy dane na froncie i przed zapisem do bazy
Używamy orm.
Stosujemy oauth2, jwt, csrf, tokenizację
kod zgodny z OpenAPI
nie powtarzamy kodu - jak jakaś funkcjonalnośc, zmienna występuje w paru miejscach to masz ją wyciągnąć do zmiennej
każdą zmienną i funkcję nazywamy - nie chcę żeby mi się walały losowe liczy po kodzie
Zastanów się nad tym co robić z błędami, przypadkami brzegowymi, optymalnością.
Wygląd ma być prosty i elegancki
kod ma być wyjątkowo prosty, nie może być powtarzania, nie może być nic co nie jest niezbędne


## do zrobienia

gdy nasz ksiądz jest zalogowany to klik dowylogowywania powinien być przez ały czas dostępny

tworzenie, edycja zbiórki powinny być osobnym widokiem

Powinno dać się edytować profil użytkownika 
(imie, nazwisko, etc)

jak już profil jest zalogowany i ma zarejestrowaną parafię - to nie powinno być przycisku zarejestruj

wygląd parafii:
na samej górze (?) przycisk wesprzyj parafię
zdjęcie z lewej (nie takie duże, pewnie kwadratowe) , z prawej dane kontaktowe
poniżej opis parafii
i ewentualne zbiórki

/slug/edycja (tu możesz nie mieć dostępu)
/user/
trzeba uważać, żeby nikt sobie nie ustawił slug = parafia (trzeba wprowadzić zabronione opcje)

potrzeba dodać forbidden: tak samo jak not found
(gdy wejdziemy w link edycji parafii, mimo ze nie możemy)




## uwagi

1. po zarejestrowaniu na konto użytkownika przekierowuje do takiego widoku
http://localhost:3000/login

a powinno nas automatycznie pozostawić zalogowanym, i przekierować do strony, z której kliknęliśmy w przycisk zarejestruj

2. gdy jesteśmy zalogowani to w żadnym widoku nie powinien się pojawiaj przycik `zarejestruj`

3. zalogowany parishioner powinien w przycisku pod swoim imieniem mieć :
'ustawienia'
'wyloguj się

ten przycisk w navbar powinien być wtedy widoczny na każdym z widoków

4. jeśli użytkownik jest zalogowany to pole email powinno się samo automatycznie wypełniać w widoku http://localhost:3000/[slug]/wsparcie

5. rejestracja administratora i parafii

Unikalny identyfikator URL np. "katedra-wroclaw". Tylko małe litery, cyfry i myślniki.
tu powinno być wytłumaczone że link to będzie taca.pl/katedra-wrocław
oraz że nie można używać lokalnych znaków (bez alt)

nr konta bankowego - powinny być spacje XX XXXX XXXX ....

w polu zdjęcie parafii powinna się wyświetlać mini thumbnail pokazujący jakie zdjęcie wybraliśmy
(obecnie tylko nazwa pliku)


do każdego z pól powinna być zrobiona walidacja na frontendzie
gdy coś jest nie tak, to powinien się pokazywać komunikat
gdy klikniemy zarejestruj i coś będzie nie tak, to powinno nas przejechać na górę strony - tam powinien być komunikat na czerwono wylistowujący wszystkie pola, które źle wypeł/niliśmy

obecnie po udanej rejestracji przekierowuje nas do takiego adresu:
http://localhost:3000/?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fedycja-parafii
- chyba coś tu jest nie tak.
Powinno albo do strony głównej
albo do /[slug] - widoku naszej właśnie stworzonej parafii

TU znów uwaga, po udanej rejestracjii parafii powinniśmy pozostawać zalogowani.

wcześniej jak dodawaliśmy zdjęcie to zapisywane było ono w bazie jako data:image/jpeg base 64
przy rejestracji, utworzony w bazie jest poprostu link parish-katedra-wroclaw.jpg
tak nie powinno być. zrób tak by mieć także i w tym przypadku base 64

numer konta bankowego powinien być zapisywany jako ciąg 26 cyfr (bez spacji)) 