import { NextResponse } from 'next/server';

// Mockowe dane parafii - zastąp prawdziwą bazą danych
const parafie = [
  {
    id: '1',
    nazwa: 'PARAFIA KATEDRALNA',
    miejscowosc: 'Wrocław',
    lat: 51.1079,
    lng: 17.0385
  },
  {
    id: '2',
    nazwa: 'Parafia św. Anny',
    miejscowosc: 'Kraków',
    lat: 50.0647,
    lng: 19.9450
  },
  {
    id: '3',
    nazwa: 'Parafia św. Jana',
    miejscowosc: 'Warszawa',
    lat: 52.2297,
    lng: 21.0122
  },
  {
    id: '4',
    nazwa: 'Parafia Matki Boskiej',
    miejscowosc: 'Gdańsk',
    lat: 54.3520,
    lng: 18.6466
  },
  {
    id: '5',
    nazwa: 'Parafia św. Józefa',
    miejscowosc: 'Poznań',
    lat: 52.4064,
    lng: 16.9252
  }
];

export async function GET() {
  return NextResponse.json(parafie);
}
