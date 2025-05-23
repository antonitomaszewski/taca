import Link from 'next/link';

export default function PlatnoscPage() {
  return (
    <main>
      <h1>Płatność</h1>
      <nav>
        <Link href="/mapa">Mapa</Link> |{' '}
        <Link href="/kosciol/1">Przykładowy kościół</Link>
      </nav>
      <p>Tu pojawi się formularz płatności.</p>
    </main>
  );
}
