import { notFound } from 'next/navigation';
import { getParafiaDataBySlug } from '../../../lib/parafiaData';
import { isForbiddenSlug } from '../../../lib/forbiddenSlugs';
import WsparcieForm from './WsparcieForm';

interface WsparciePageProps {
  params: Promise<{ slug: string }>;
}

export default async function WsparciePage({ params }: WsparciePageProps) {
  const { slug } = await params;

  // Sprawdź czy to nie jest zakazany slug lub plik
  if (isForbiddenSlug(slug) || /\.(jpg|jpeg|png|gif|svg|ico|css|js|html|pdf|doc|docx|txt)$/i.test(slug)) {
    notFound();
  }

  let parafiaData;
  try {
    parafiaData = await getParafiaDataBySlug(slug);
  } catch (error) {
    console.error('Error loading parish data:', error);
    notFound();
  }

  // Renderuj formularz wsparcia bezpośrednio na tym URL-u
  return <WsparcieForm parafiaData={parafiaData} />;
}