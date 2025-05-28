Moje doświadczenie zawodowe opiera się zarówno na pracy komercyjnej, jak i projektach akademickich oraz prywatnych.
Na studiach najbardziej interesowały mnie zagadnienia związane z programowaniem funkcyjnym – na przykład rozwiązywanie problemów algorytmicznych w Haskellu i OCaml-u. Zrealizowałem też kilka praktycznych projektów związanych ze sztuczną inteligencją:

przetwarzanie języka naturalnego (np. automatyczne rozwiązywanie krzyżówek szachowych w Pythonie),
rozpoznawanie obrazów przy użyciu CNN (np. system detekcji twarzy w TensorFlow),
oraz generowanie stylów artystycznych (Neural Style Transfer).
W pracy komercyjnej od kilku lat działam jako Python Developer w Polskim Banku Komórek Macierzystych, który jest częścią europejskiego konglomeratu Vita34. Tworzę systemy wykorzystywane przez wszystkie spółki z grupy – od systemów laboratoryjnych, przez moduły finansowe (integracja z Microsoft Dynamics NAV), aż po portale customer service oraz platformy e-commerce.
Do tego mam doświadczenie w rozwijaniu portalu dla zleceniobiorców (lekarzy i pielęgniarek), wykorzystującego Python, TypeScript, React i Oracle.
W e-commerce korzystamy z gotowego rozwiązania Vendure, które integruję z naszymi systemami.

Na co dzień współpracuję z osobami z różnych krajów (Polska, Włochy, Szwajcaria, Rumunia, Turcja), co wymaga dobrej komunikacji i elastyczności.

W projektach prywatnych, zrealizowałem m.in. aplikację alarmu kotwicznego dla zegarków Garmin (w języku MonkeyC), która powiadamia o zerwaniu kotwicy jachtu podczas postoju.

Lubię mieć odpowiedzialność – zarówno za własne zadania, jak i za współpracę w zespole. Satysfakcjonuje mnie, gdy wiem, kto odpowiada za dany produkt i mogę mieć realny wpływ na efekt końcowy.
Oferta Harvey Nash jest dla mnie ciekawa, bo chcę nie tylko rozwijać swoje umiejętności, ale też wnosić wartość dla firmy, w której pracuję.


celery - kolejkowanie
redis - tymczasowa db

API
do tworzenia używam spójnej nomenkalatury
rzeczowniki w liczbie mnogiej (/users)
dbam o poprawne kody odpowiedzi 201 - utworzenie zasobu
400 - błąd walidacji


paginacja - lazy ładowanie z bazy (np sklep internetowy) /products?page=2&limit=20


dokumentacja api : OpenAPI:
paths:
  /products:
    get:
      summary: Lista produktów
      parameters:
        - name: page
          in: query
          required: false
          schema:
            type: integer
      responses:
        '200':
          description: OK