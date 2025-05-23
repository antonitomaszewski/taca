import Link from 'next/link';

interface KosciolPageProps {
  params: { id: string };
}

export default async function KosciolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main>
      <h1>Kościół #{id}</h1>
      <nav>
        <Link href="/mapa">Mapa</Link> |{' '}
        <Link href="/platnosc">Płatność</Link>
      </nav>
      <p>Tu pojawią się szczegóły kościoła.</p>
    </main>
  );
}
