import { prisma } from './prisma';

// Interface dla danych parafii (format frontend)
export interface ParafiaData {
  id: string;
  nazwa: string;
  miejscowosc: string;
  adres: string;
  telefon: string;
  email: string;
  strona: string;
  proboszcz: string;
  rozkladMszy: string;
  opis: string;
  photoUrl: string;
  kontoBank: string;
  uniqueSlug: string;
  latitude: number;
  longitude: number;
  zebrane: number;
  cel: number;
  wspierajacy: number;
  pozostalo: number | null;
  cele: Array<{
    id: string;
    tytul: string;
    opis: string;
    kwotaCel: number;
    kwotaZebrana: number;
    aktywny: boolean;
  }>;
  ostatnieWsparcia: Array<{
    nazwa: string;
    kwota: number;
    czas: string;
  }>;
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    return 'Przed chwilą';
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'godzinę' : diffHours < 5 ? 'godziny' : 'godzin'} temu`;
  } else if (diffDays === 1) {
    return '1 dzień temu';
  } else if (diffDays < 7) {
    return `${diffDays} dni temu`;
  } else {
    return date.toLocaleDateString('pl-PL');
  }
}

// Helper function to transform parish data from database to frontend format
function transformParishData(parish: any): ParafiaData {
  // Calculate total raised and supporters
  const totalRaised = parish.payments
    .filter((p: any) => p)
    .reduce((sum: number, payment: any) => sum + payment.amount, 0);

  // Calculate total target from active goals
  const totalTarget = parish.fundraisingGoals
    .filter((goal: any) => goal.isActive)
    .reduce((sum: number, goal: any) => sum + goal.targetAmount, 0);

  // Calculate days remaining (assuming earliest deadline)
  const activeGoals = parish.fundraisingGoals.filter((goal: any) => goal.isActive && goal.deadline);
  const earliestDeadline = activeGoals.length > 0 
    ? Math.min(...activeGoals.map((goal: any) => goal.deadline!.getTime()))
    : null;
  
  const daysRemaining = earliestDeadline 
    ? Math.ceil((earliestDeadline - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  // Format recent donations
  const ostatnieWsparcia = parish.payments.map((payment: any) => ({
    nazwa: payment.isAnonymous ? 'Anonimowy darczyńca' : payment.donorName || 'Anonimowy darczyńca',
    kwota: payment.amount,
    czas: formatTimeAgo(payment.createdAt)
  }));

  // Convert fundraising goals to expected format
  const cele = parish.fundraisingGoals.map((goal: any) => ({
    id: goal.id,
    tytul: goal.title,
    opis: goal.description || '',
    kwotaCel: goal.targetAmount,
    kwotaZebrana: goal.currentAmount,
    aktywny: goal.isActive
  }));

  return {
    id: parish.id,
    nazwa: parish.name,
    miejscowosc: parish.city,
    adres: parish.address,
    telefon: parish.phone || "",
    email: parish.email || "",
    strona: parish.website || "",
    proboszcz: parish.pastor || "",
    rozkladMszy: parish.massSchedule || "",
    opis: parish.description || 'Brak opisu parafii.',
    photoUrl: parish.photoUrl || '/katedra_wroclaw.jpg',
    kontoBank: parish.bankAccount || "",
    uniqueSlug: parish.uniqueSlug || "",
    latitude: parish.latitude,
    longitude: parish.longitude,
    zebrane: totalRaised,
    cel: totalTarget,
    wspierajacy: parish.paymentsCount || 0,
    pozostalo: daysRemaining,
    cele,
    ostatnieWsparcia
  };
}

/**
 * Pobiera dane parafii na podstawie ID
 */
export async function getParafiaDataById(id: string): Promise<ParafiaData> {
  const parish = await prisma.parish.findUnique({
    where: { id },
    include: {
      fundraisingGoals: {
        orderBy: { createdAt: 'desc' }
      },
      payments: {
        where: { 
          status: 'COMPLETED',
          donorName: { not: null }
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          donorName: true,
          amount: true,
          createdAt: true,
          isAnonymous: true
        }
      }
    }
  });

  if (!parish) {
    throw new Error(`Parish with ID ${id} not found`);
  }

  // Get supporters count separately
  const paymentsCount = await prisma.payment.count({
    where: {
      parishId: id,
      status: 'COMPLETED'
    }
  });

  return transformParishData({ ...parish, paymentsCount });
}

/**
 * Pobiera dane parafii na podstawie slug
 */
export async function getParafiaDataBySlug(slug: string): Promise<ParafiaData> {
  const parish = await prisma.parish.findFirst({
    where: { uniqueSlug: slug },
    include: {
      fundraisingGoals: {
        orderBy: { createdAt: 'desc' }
      },
      payments: {
        where: { 
          status: 'COMPLETED',
          donorName: { not: null }
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          donorName: true,
          amount: true,
          createdAt: true,
          isAnonymous: true
        }
      }
    }
  });

  if (!parish) {
    throw new Error(`Parish with slug ${slug} not found`);
  }

  // Get supporters count separately
  const paymentsCount = await prisma.payment.count({
    where: {
      parishId: parish.id,
      status: 'COMPLETED'
    }
  });

  return transformParishData({ ...parish, paymentsCount });
}