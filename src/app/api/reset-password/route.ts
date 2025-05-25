import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email jest wymagany' },
        { status: 400 }
      );
    }

    // Sprawdź czy użytkownik istnieje
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Zawsze zwracaj sukces ze względów bezpieczeństwa
    // (nie ujawniaj czy email istnieje w bazie)
    if (!user) {
      return NextResponse.json({
        message: 'Instrukcje zostały wysłane na podany adres email'
      });
    }

    // Wygeneruj token resetowania hasła
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 godzina

    // TODO: Dodaj pola resetToken i resetTokenExpiry do modelu User w schema.prisma
    // Na razie tylko logujemy token (w produkcji wysłalibyśmy email)
    
    console.log(`Reset token for ${email}: ${resetToken}`);
    console.log(`Token expires at: ${resetTokenExpiry}`);
    
    // TODO: Wyślij email z linkiem resetowania
    // await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json({
      message: 'Instrukcje zostały wysłane na podany adres email'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    );
  }
}
