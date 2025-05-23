import { NextResponse } from 'next/server';

// Docelowo tu będzie pobieranie z bazy danych
const koscioly = [
  {
    id: '1',
    nazwa: 'Parafia św. Anny',
    miejscowosc: 'Warszawa',
    lat: 52.2297,
    lng: 21.0122,
  },
  {
    id: '2',
    nazwa: 'Parafia św. Jana',
    miejscowosc: 'Kraków',
    lat: 50.0647,
    lng: 19.945,
  },
];

export async function GET() {
  return NextResponse.json(koscioly);
}
