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
Ja wykonuje komendy w terminalu, ty mi je podawaj, ale sam będę je puszczał i podawał Ci ich wynik


## do zrobienia

gdy nasz ksiądz jest zalogowany to klik dowylogowywania powinien być przez ały czas dostępny

tworzenie, edycja zbiórki powinny być osobnym widokiem

Powinno dać się edytować profil użytkownika 
(imie, nazwisko, etc)

jak już profil jest zalogowany i ma zarejestrowaną parafię - to nie powinno być przycisku zarejestruj

Podczas tworzenia konta powinny być dwie opcje (tak jak przy płatności : abonamentowa i jednorazowa) - parafianin - proboszcz
parafianin nie ma możliwości rejestrowania parafii
proboszcz ma

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



## 🎯 PLAN PRACY - FINALIZACJA PROJEKTU

### **ETAP 1: Podstawowa infrastruktura** ⚡
1. **System ról użytkowników** (parafianin/proboszcz)

### **ETAP 2: Autentykacja i profile** 👥

#### **Księża/Proboszczowie:**
- Rejestracja z wyborem roli (parafianin/proboszcz)
- Logowanie/wylogowanie (przycisk zawsze widoczny)
- Dashboard z statystykami
- Edycja profilu osobistego
- Zarządzanie parafią (tylko proboszcz)

#### **Darczyńcy/Parafianie:**
- **Rejestracja konta darczyńcy**
- **Logowanie/wylogowanie**
- **Profil darczyńcy** (dane osobowe, historia wpłat)
- **Lista zapisanych parafii** (obserwowane)

### **ETAP 3: System wpłat dla darczyńców** 💰
1. **Wpłaty jednorazowe** (jak mamy teraz)
2. **Wpłaty cykliczne** (miesięczne/tygodniowe)
3. **Panel darczyńcy** - historia wpłat
4. **Anulowanie subskrypcji** cyklicznych
5. **Zarządzanie metodami płatności**

### **ETAP 4: System powiadomień email** 📧
1. **Potwierdzenia wpłat** (dla darczyńców)
2. **Powiadomienia o nowych zbiórkach** (dla obserwujących)
3. **Przypomnienia o wpłatach cyklicznych**
4. **Podziękowania od parafii**
5. **Newsletter z aktualnościami**

### **ETAP 5: Zbiórki i fundraising** 🎯
1. **Tworzenie zbiórek** (osobny widok)
2. **Edycja zbiórek** (osobny widok)
3. **Postęp zbiórek** (pasek progress)
4. **Powiadomienia o nowych zbiórkach**

### **ETAP 6: Wygląd parafii** 🏛️
1. **Przycisk "Wesprzyj parafię" na górze**
2. **Layout: zdjęcie kwadratowe (lewo) + kontakt (prawo)**
3. **Opis parafii poniżej**
4. **Lista aktywnych zbiórek**

### **ETAP 7: UX/UI finisz** 🎨
1. **Loading states wszędzie**
2. **Error handling + komunikaty**
3. **Success messages**
4. **Responsywność mobile**
5. **Animacje transitions**

### **ETAP 8: SEO i deployment** 🚀
1. **Meta tags**
2. **Sitemap.xml**
3. **Hosting setup**
4. **Domena taca.pl**

### **ETAP 9: Płatności live** 💳
1. **Wybór dostawcy płatności**
2. **Integracja API**
3. **Testy end-to-end**
