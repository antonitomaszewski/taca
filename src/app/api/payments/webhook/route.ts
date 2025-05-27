/**
 * API ENDPOINT - WEBHOOK PRZELEWY24
 * 
 * Ten endpoint obsługuje automatyczne powiadomienia od Przelewy24:
 * 1. Przelewy24 wysyła POST z informacją o zmianie statusu płatności
 * 2. Weryfikujemy autentyczność powiadomienia
 * 3. Aktualizujemy status płatności w naszej bazie danych
 * 4. Zwracamy potwierdzenie do Przelewy24
 * 
 * RÓŻNICA OD CALLBACK:
 * - Callback = użytkownik wraca na naszą stronę
 * - Webhook = automatyczne powiadomienie serwer-do-serwer
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPrzelewy24Payment, convertToGrosze } from '@/lib/przelewy24';

export async function POST(request: NextRequest) {
  try {
    // Przelewy24 wysyła dane jako application/x-www-form-urlencoded
    const formData = await request.formData();
    
    // Wyciągnij dane z formularza
    const merchantId = formData.get('p24_merchant_id') as string;
    const posId = formData.get('p24_pos_id') as string;
    const sessionId = formData.get('p24_session_id') as string;
    const amount = formData.get('p24_amount') as string;
    const currency = formData.get('p24_currency') as string;
    const orderId = formData.get('p24_order_id') as string;
    const sign = formData.get('p24_sign') as string;

    console.log(`📬 Webhook z Przelewy24:`, {
      merchantId,
      posId,
      sessionId,
      amount,
      currency,
      orderId,
      sign: sign?.substring(0, 8) + '...' // Nie loguj pełnego podpisu
    });

    // Walidacja wymaganych pól
    if (!sessionId || !amount || !orderId) {
      console.error('❌ Brak wymaganych parametrów w webhook');
      return NextResponse.json(
        { error: 'Brak wymaganych parametrów' },
        { status: 400 }
      );
    }

    // Znajdź płatność w naszej bazie danych
    const payment = await prisma.payment.findFirst({
      where: { transactionId: sessionId },
      include: {
        parish: {
          select: { id: true, name: true, city: true }
        }
      }
    });

    if (!payment) {
      console.error('❌ Nie znaleziono płatności dla sessionId:', sessionId);
      return NextResponse.json(
        { error: 'Nie znaleziono płatności' },
        { status: 404 }
      );
    }

    // Weryfikuj płatność w Przelewy24
    let isPaymentVerified = false;
    try {
      isPaymentVerified = await verifyPrzelewy24Payment(
        sessionId,
        parseInt(amount),
        currency,
        parseInt(orderId)
      );
      
      console.log(`🔍 Weryfikacja webhook dla ${sessionId}:`, isPaymentVerified);
    } catch (error) {
      console.error('❌ Błąd weryfikacji webhook:', error);
      return NextResponse.json(
        { error: 'Błąd weryfikacji płatności' },
        { status: 500 }
      );
    }

    // Aktualizuj status płatności tylko jeśli weryfikacja przeszła
    if (isPaymentVerified) {
      // Połącz istniejące metadata z nowymi danymi
      const existingMetadata = payment.metadata as Record<string, any> || {};
      const updatedMetadata = {
        ...existingMetadata,
        przelewy24OrderId: orderId,
        przelewy24WebhookReceived: new Date().toISOString(),
        isVerifiedByWebhook: true,
      };

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          updatedAt: new Date(),
          metadata: updatedMetadata
        }
      });

      console.log(`✅ Webhook: Zaktualizowano status płatności ${payment.id} na COMPLETED`);

      // Aktualizuj statystyki parafii
      try {
        await prisma.parish.update({
          where: { id: payment.parishId },
          data: {
            updatedAt: new Date(),
          }
        });
      } catch (error) {
        console.error('❌ Błąd aktualizacji statystyk parafii:', error);
      }

      // Zwróć OK do Przelewy24 (to zatwierdza odbiór powiadomienia)
      return NextResponse.json({ status: 'OK' });
    } else {
      console.error('❌ Weryfikacja webhook nie powiodła się dla sessionId:', sessionId);
      return NextResponse.json(
        { error: 'Weryfikacja płatności nie powiodła się' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('❌ Błąd przetwarzania webhook:', error);
    
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas przetwarzania powiadomienia' },
      { status: 500 }
    );
  }
}
