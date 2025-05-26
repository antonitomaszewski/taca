/**
 * API ENDPOINT - CALLBACK PO PŁATNOŚCI
 * 
 * Ten endpoint obsługuje powrót użytkownika ze strony Przelewy24:
 * 1. Użytkownik zostaje przekierowany tutaj po zakończeniu płatności
 * 2. Sprawdzamy status płatności w Przelewy24
 * 3. Aktualizujemy status w naszej bazie danych
 * 4. Przekierowujemy użytkownika na stronę potwierdzenia
 * 
 * RELACJE Z INNYMI PLIKAMI:
 * - Wywoływany przez Przelewy24 po zakończeniu płatności
 * - Używa /lib/przelewy24.ts do weryfikacji statusu
 * - Aktualizuje dane w bazie przez Prisma (model Payment)
 * - Przekierowuje na stronę potwierdzenia lub błędu
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPrzelewy24Payment, convertToGrosze } from '@/lib/przelewy24';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Przelewy24 wysyła te parametry w URL callback
    const sessionId = searchParams.get('sessionId');
    const orderId = searchParams.get('orderId');
    const status = searchParams.get('status');

    console.log(`📥 Callback z Przelewy24:`, { sessionId, orderId, status });

    if (!sessionId) {
      console.error('❌ Brak sessionId w callback');
      return NextResponse.redirect(
        new URL('/platnosc/blad?error=missing_session', request.url)
      );
    }

    // Znajdź płatność w naszej bazie danych
    const payment = await prisma.payment.findFirst({
      where: { transactionId: sessionId },
      include: {
        parish: {
          select: { id: true, name: true, city: true, uniqueSlug: true }
        }
      }
    });

    if (!payment) {
      console.error('❌ Nie znaleziono płatności dla sessionId:', sessionId);
      return NextResponse.redirect(
        new URL('/platnosc/blad?error=payment_not_found', request.url)
      );
    }

    // Jeśli mamy orderId, spróbuj zweryfikować płatność w Przelewy24
    let isPaymentVerified = false;
    if (orderId) {
      try {
        const amountInGrosze = convertToGrosze(payment.amount);
        isPaymentVerified = await verifyPrzelewy24Payment(
          sessionId,
          amountInGrosze,
          'PLN',
          parseInt(orderId)
        );
        
        console.log(`🔍 Weryfikacja płatności ${sessionId}:`, isPaymentVerified);
      } catch (error) {
        console.error('❌ Błąd weryfikacji płatności:', error);
        isPaymentVerified = false;
      }
    }

    // Ustal nowy status płatności na podstawie parametrów callback
    let newStatus: 'COMPLETED' | 'FAILED' | 'CANCELLED' = 'FAILED';
    
    if (status === 'success' && isPaymentVerified) {
      newStatus = 'COMPLETED';
    } else if (status === 'cancel') {
      newStatus = 'CANCELLED';
    } else {
      newStatus = 'FAILED';
    }

    // Aktualizuj status płatności w bazie danych
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: newStatus,
        updatedAt: new Date(),
        // Zapisz dodatkowe informacje z Przelewy24
        metadata: {
          ...payment.metadata,
          przelewy24OrderId: orderId,
          przelewy24Status: status,
          verifiedAt: new Date().toISOString(),
          isVerified: isPaymentVerified,
        }
      }
    });

    console.log(`✅ Zaktualizowano status płatności ${payment.id}: ${newStatus}`);

    // Jeśli płatność zakończona sukcesem, aktualizuj statystyki parafii
    if (newStatus === 'COMPLETED') {
      try {
        // Dodaj kwotę do aktualnie zebranych środków parafii
        await prisma.parish.update({
          where: { id: payment.parishId },
          data: {
            // Tutaj możemy dodać pole dla zebranych środków w przyszłości
            updatedAt: new Date(),
          }
        });

        console.log(`💰 Płatność ${payment.amount} PLN dla parafii ${payment.parish.name} zakończona sukcesem`);
      } catch (error) {
        console.error('❌ Błąd aktualizacji statystyk parafii:', error);
        // Nie przerywamy procesu - płatność i tak jest zaliczona
      }
    }

    // Przekieruj użytkownika na odpowiednią stronę
    const baseUrl = new URL(request.url).origin;
    const parishSlug = payment.parish.uniqueSlug || payment.parish.id;
    
    if (newStatus === 'COMPLETED') {
      // Sukces - przekieruj na stronę potwierdzenia
      const successUrl = new URL(`/${parishSlug}/wsparcie/sukces`, baseUrl);
      successUrl.searchParams.set('paymentId', payment.id);
      successUrl.searchParams.set('amount', payment.amount.toString());
      
      return NextResponse.redirect(successUrl);
    } else if (newStatus === 'CANCELLED') {
      // Anulowanie - przekieruj z powrotem na stronę płatności
      const cancelUrl = new URL(`/${parishSlug}/wsparcie`, baseUrl);
      cancelUrl.searchParams.set('message', 'Płatność została anulowana');
      
      return NextResponse.redirect(cancelUrl);
    } else {
      // Błąd - przekieruj na stronę błędu
      const errorUrl = new URL(`/${parishSlug}/wsparcie/blad`, baseUrl);
      errorUrl.searchParams.set('paymentId', payment.id);
      errorUrl.searchParams.set('error', 'payment_failed');
      
      return NextResponse.redirect(errorUrl);
    }

  } catch (error) {
    console.error('❌ Błąd w callback płatności:', error);

    // W przypadku błędu przekieruj na ogólną stronę błędu
    const baseUrl = new URL(request.url).origin;
    const errorUrl = new URL('/platnosc/blad', baseUrl);
    errorUrl.searchParams.set('error', 'callback_error');
    
    return NextResponse.redirect(errorUrl);
  }
}
