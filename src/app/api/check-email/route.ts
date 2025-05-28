import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Sprawdź czy email już istnieje w bazie danych
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true } // Tylko sprawdzamy czy istnieje
    });

    return NextResponse.json({
      exists: !!existingUser,
      available: !existingUser
    });

  } catch (error) {
    console.error('Error checking email availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
