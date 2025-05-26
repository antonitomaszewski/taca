import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    // console.log('🔍 API DEBUG - Received parish ID:', id);

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

    // console.log('🔍 API DEBUG - Found parish:', parish ? 'YES' : 'NO');
    // console.log('🔍 API DEBUG - Parish data:', JSON.stringify(parish, null, 2));

    if (!parish) {
      return NextResponse.json({ error: 'Parish not found' }, { status: 404 });
    }

    // Calculate total raised and supporters
    const totalRaised = parish.payments
      .filter((p: any) => p)
      .reduce((sum: number, payment: any) => sum + payment.amount, 0);
    
    const totalSupporters = await prisma.payment.count({
      where: {
        parishId: id,
        status: 'COMPLETED'
      }
    });

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

    // Return data in format expected by frontend (Polish field names)
    const result = {
      id: parish.id,
      nazwa: parish.name,
      miejscowosc: parish.city,
      adres: parish.address,
      telefon: parish.phone,
      email: parish.email,
      strona: parish.website,
      proboszcz: parish.pastor,
      rozkladMszy: parish.massSchedule,
      opis: parish.description || 'Brak opisu parafii.',
      photoUrl: '/katedra_wroclaw.jpg', // Default image for now
      zebrane: totalRaised,
      cel: totalTarget,
      wspierajacy: totalSupporters,
      pozostalo: daysRemaining,
      cele,
      ostatnieWsparcia
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching parish details:', error);
    return NextResponse.json({ error: 'Failed to fetch parish details' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Sprawdź uwierzytelnienie
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Musisz być zalogowany' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    
    const {
      nazwa,
      miejscowosc,
      adres,
      telefon,
      email,
      strona,
      proboszcz,
      opis,
      photoUrl,
      celKwota,
      celOpis
    } = body;

    // Sprawdź czy użytkownik jest właścicielem tej parafii
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { parish: true }
    });

    if (!user || user.parishId !== id) {
      return NextResponse.json(
        { error: 'Nie masz uprawnień do edycji tej parafii' },
        { status: 403 }
      );
    }

    // Aktualizuj parafię
    const updatedParish = await prisma.parish.update({
      where: { id },
      data: {
        name: nazwa || undefined,
        city: miejscowosc || undefined,
        address: adres || undefined,
        phone: telefon || undefined,
        email: email || undefined,
        website: strona || undefined,
        pastor: proboszcz || undefined,
        description: opis || undefined,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Parafia została pomyślnie zaktualizowana',
      parish: updatedParish
    });

  } catch (error) {
    console.error('Błąd aktualizacji parafii:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas aktualizacji parafii' },
      { status: 500 }
    );
  }
}

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