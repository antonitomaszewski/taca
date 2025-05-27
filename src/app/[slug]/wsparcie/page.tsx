import { notFound, redirect } from 'next/navigation';
import { getParafiaDataBySlug } from '../../../lib/parafiaData';
import { isForbiddenSlug } from '../../../lib/forbiddenSlugs';

interface WsparciePageProps {
  params: Promise<{ slug: string }>;
}

export default async function WsparciePage({ params }: WsparciePageProps) {
  const { slug } = await params;

  // Sprawdź czy to nie jest zakazany slug lub plik
  if (isForbiddenSlug(slug) || /\.(jpg|jpeg|png|gif|svg|ico|css|js|html|pdf|doc|docx|txt)$/i.test(slug)) {
    notFound();
  }

  const parafiaData = await getParafiaDataBySlug(slug).catch((error) => {
    console.error('Error loading parish data:', error);
    notFound();
  });

  // Przekieruj do formularza płatności z ID parafii
  redirect(`/platnosc?parishId=${parafiaData.id}`);
}