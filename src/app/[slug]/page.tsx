import { notFound, redirect } from 'next/navigation';
import { prisma } from '../../lib/prisma';

interface SlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;
  
  try {
    // Znajdź parafię po uniqueSlug
    const parish = await prisma.parish.findUnique({
      where: { uniqueSlug: slug }
    });

    if (!parish) {
      // Jeśli nie znaleziono parafii z tym slugiem, pokaż 404
      notFound();
    }

    // Przekieruj do standardowej strony parafii
    redirect(`/parafia/${parish.id}`);
  } catch (error) {
    // Sprawdź czy to błąd przekierowania (normalny przypadek)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      // To nie jest prawdziwy błąd - Next.js używa tego do przekierowań
      throw error;
    }
    
    console.error('Error finding parish by slug:', error);
    notFound();
  }
}

// Opcjonalnie: generowanie metadanych dla SEO
export async function generateMetadata({ params }: SlugPageProps) {
  const { slug } = await params;
  
  try {
    const parish = await prisma.parish.findUnique({
      where: { uniqueSlug: slug }
    });

    if (!parish) {
      return {
        title: 'Parafia nie znaleziona - Taca.pl'
      };
    }

    return {
      title: `${parish.name} - Taca.pl`,
      description: parish.description || `Wspieraj parafię ${parish.name} w ${parish.city}`,
    };
  } catch {
    return {
      title: 'Parafia - Taca.pl'
    };
  }
}
