// src/app/api/koscioly/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mockowe dane - zastąp prawdziwą bazą danych
const koscioly = {
  '1': {
    id: '1',
    nazwa: 'PARAFIA KATEDRALNA',
    miejscowosc: 'Wrocław',
    opis: 'Parafia św. Jana Chrzciciela to wspólnota wiernych działająca od 1923 roku. Nasz kościół służy lokalnej społeczności, organizując msze święte, katechezę dla dzieci i młodzieży oraz działalność charytatywną. Jesteśmy miejscem spotkań, modlitwy i wzajemnej pomocy.',
    photoUrl: '/katedra_wroclaw.jpg',
    zebrane: 18500,
    cel: 50000,
    wspierajacy: 127,
    pozostalo: 21,
    cele: [
      {
        id: 1,
        tytul: 'Remont dachu kościoła',
        opis: 'Pilnie potrzebujemy remontu dachu, który przecieka podczas deszczu. Koszty obejmują wymianę pokrycia dachowego i renowację więźby.',
        kwotaCel: 35000,
        kwotaZebrana: 12300,
        aktywny: true
      },
      {
        id: 2,
        tytul: 'Nowe organy dla parafii',
        opis: 'Chcemy zakupić nowe organy, które wzbogacą liturgię i pozwolą na organizację koncertów muzyki sakralnej.',
        kwotaCel: 25000,
        kwotaZebrana: 6200,
        aktywny: true
      },
      {
        id: 3,
        tytul: 'Remont sali parafialnej',
        opis: 'Modernizacja sali używanej do spotkań parafialnych, katechez i wydarzeń społecznych.',
        kwotaCel: 15000,
        kwotaZebrana: 0,
        aktywny: false
      }
    ],
    ostatnieWsparcia: [
      { nazwa: 'Anna K.', kwota: 200, czas: '2 godziny temu' },
      { nazwa: 'Marek W.', kwota: 150, czas: '4 godziny temu' },
      { nazwa: 'Jadwiga S.', kwota: 100, czas: '6 godzin temu' },
      { nazwa: 'Piotr M.', kwota: 300, czas: '1 dzień temu' },
      { nazwa: 'Katarzyna L.', kwota: 75, czas: '2 dni temu' }
    ]
  },
  '2': {
    id: '2',
    nazwa: 'Parafia Matki Bożej Częstochowskiej',
    miejscowosc: 'Kraków, Nowa Huta',
    opis: 'Nasza parafia została założona w 1977 roku i od ponad 40 lat służy mieszkańcom Nowej Huty. Organizujemy regularne msze święte, spotkania młodzieżowe oraz działalność charytatywną.',
    photoUrl: '/kosciol-2.jpg',
    zebrane: 8200,
    cel: 30000,
    wspierajacy: 89,
    pozostalo: 45,
    cele: [
      {
        id: 1,
        tytul: 'Wymiana okien w kościele',
        opis: 'Stare okna wymagają pilnej wymiany. Nowe okna poprawią izolację termiczną i akustyczną.',
        kwotaCel: 20000,
        kwotaZebrana: 5500,
        aktywny: true
      },
      {
        id: 2,
        tytul: 'Modernizacja nagłośnienia',
        opis: 'Chcemy zakupić nowoczesny system nagłośnienia dla lepszej jakości dźwięku podczas liturgii.',
        kwotaCel: 10000,
        kwotaZebrana: 2700,
        aktywny: true
      }
    ],
    ostatnieWsparcia: [
      { nazwa: 'Tomasz B.', kwota: 500, czas: '1 godzina temu' },
      { nazwa: 'Maria S.', kwota: 250, czas: '3 godziny temu' },
      { nazwa: 'Paweł K.', kwota: 100, czas: '5 godzin temu' }
    ]
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Symulacja opóźnienia API (usuń w produkcji)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const kosciol = koscioly[id as keyof typeof koscioly];
    
    if (!kosciol) {
      return NextResponse.json(
        { error: 'Kościół nie został znaleziony' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(kosciol);
    
  } catch (error) {
    console.error('Błąd API:', error);
    return NextResponse.json(
      { error: 'Wewnętrzny błąd serwera' },
      { status: 500 }
    );
  }
}

// Opcjonalnie: endpoint do aktualizacji danych
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const kosciol = koscioly[id as keyof typeof koscioly];
    if (!kosciol) {
      return NextResponse.json(
        { error: 'Kościół nie został znaleziony' },
        { status: 404 }
      );
    }
    
    // Przykład aktualizacji zebranej kwoty
    if (body.noweWsparcie) {
      kosciol.zebrane += body.noweWsparcie.kwota;
      kosciol.wspierajacy += 1;
      kosciol.ostatnieWsparcia.unshift({
        nazwa: body.noweWsparcie.nazwa,
        kwota: body.noweWsparcie.kwota,
        czas: 'przed chwilą'
      });
      
      // Zachowaj tylko 10 ostatnich wsparć
      kosciol.ostatnieWsparcia = kosciol.ostatnieWsparcia.slice(0, 10);
    }
    
    return NextResponse.json(kosciol);
    
  } catch (error) {
    console.error('Błąd podczas aktualizacji:', error);
    return NextResponse.json(
      { error: 'Błąd podczas aktualizacji danych' },
      { status: 500 }
    );
  }
}