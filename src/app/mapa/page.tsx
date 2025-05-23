import Link from 'next/link';

export default function MapaPage() {
  return (
    <main>
      <h1>Mapa kościołów</h1>
      <nav>
        <Link href="/platnosc">Płatność</Link> |{' '}
        <Link href="/kosciol/1">Przykładowy kościół</Link>
      </nav>
      <p>Tu pojawi się mapa z kościołami.</p>
    </main>
  );
}
