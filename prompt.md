I need to implement [specific functionality] in [programming language].
Key requirements:
1. nie powtarzamy kodu - jak jakaś funkcjonalnośc, zmienna występuje w paru miejscach to masz ją wyciągnąć do zmiennej
2. każdą zmienną i funkcję nazywamy - nie chcę żeby mi się walały losowe liczy po kodzie
3. dodawaj opisy, żebym wszystko rozumiał, chcę żeby w każdym pliku był opis od czego to
4. najpierw robimy front, potem backend, chcę żebyś mi dopisywał testy żeby maksymalnie automatycznie wszystko na bierząco testować
5. masz mówić prostym językiem, konkretnym
Please consider:
- Error handling
- Edge cases
- Performance optimization
- Best practices for [language/framework]
Please do not unnecessarily remove any comments or code.
Generate the code with clear comments explaining the logic.



## do zrobienia

### edycja-parafii

chciałbym, żeby Not Found wyświetlało się dla każdego niepoprawnego adresu (np a/b/c/d)

dobra, teraz jeszcze ważny element:
chcę żeby w edycji parafii można było ustawić pozycję naszej parafii na mapie (bo przecież ma się ją dać wyszukać na mapie)
ten punkt jest obowiązkowy
wg mnie ksiądz może albo w interaktywnej mapie znaleźć swoją parafię i kliknąć coś w stylu zatwierdź i wtedy automatycznie uzupełni się adres,
albo też jeśli ksiądz będzie wpisywał adres własnoręcznie to na mapce powinno być widać co on wpisuje i także się to będzie dało znaleźć w ten sposób
( w skrócie: potrzebujemy lokalizacji - albo z mapy, albo z adresu)

czemu w src/interfaces/types.ts nie mamy photoUrl?
czym się różni interfejs os schemy w bazie