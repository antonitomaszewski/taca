import { notFound } from 'next/navigation';
import { getParafiaDataBySlug } from '../../lib/parafiaData';
import ParafiaView from '../../components/ParafiaView';
import { isForbiddenSlug } from '../../lib/forbiddenSlugs';

interface SlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;
  
  // Sprawdź czy to nie jest plik (z rozszerzeniem)
  if (/\.(jpg|jpeg|png|gif|webp|svg|pdf|txt|css|js|ico|xml|json)$/i.test(slug)) {
    notFound();
  }
  
  // Sprawdź czy slug nie jest zakazany (np. "parafia", "admin", itp.)
  if (isForbiddenSlug(slug)) {
    notFound();
  }
  
  try {
    // Pobierz dane parafii po uniqueSlug
    const parafia = await getParafiaDataBySlug(slug);
    
    // Wyświetl parafię bezpośrednio używając komponentu ParafiaView
    return <ParafiaView parafia={parafia} showEditButton={false} />;
  } catch (error) {
    console.error('Error finding parish by slug:', error);
    notFound();
  }
}

// Opcjonalnie: generowanie metadanych dla SEO
export async function generateMetadata({ params }: SlugPageProps) {
  const { slug } = await params;
  
  // Sprawdź czy slug nie jest zakazany
  if (isForbiddenSlug(slug)) {
    return {
      title: 'Nie znaleziono - Taca.pl',
      description: 'Strona nie została znaleziona.'
    };
  }
  
  try {
    const parafia = await getParafiaDataBySlug(slug);

    return {
      title: `${parafia.nazwa} - ${parafia.miejscowosc} | Taca.pl`,
      description: `Wesprzyj parafię ${parafia.nazwa} w ${parafia.miejscowosc}. ${parafia.opis.substring(0, 150)}...`,
      openGraph: {
        title: `${parafia.nazwa} - ${parafia.miejscowosc}`,
        description: parafia.opis.substring(0, 200),
        images: [parafia.photoUrl],
      },
    };
  } catch (error) {
    return {
      title: 'Parafia nie znaleziona - Taca.pl'
    };
  }
}
