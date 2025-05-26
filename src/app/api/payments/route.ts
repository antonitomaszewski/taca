/**
 * API ENDPOINT - INICJOWANIE PŁATNOŚCI
 * 
 * Ten endpoint obsługuje tworzenie nowych płatności przez Przelewy24:
 * 1. Przyjmuje dane płatności z formularza frontend
 * 2. Waliduje dane i tworzy transakcję w Przelewy24
 * 3. Zapisuje informacje o płatności w naszej bazie danych
 * 4. Zwraca URL do przekierowania na stronę płatności
 * 
 * RELACJE Z INNYMI PLIKAMI:
 * - Używa biblioteki /lib/przelewy24.ts do komunikacji z Przelewy24
 * - Zapisuje dane przez Prisma do modelu Payment w bazie
 * - Odpowiada na żądania z formularza płatności (/platnosc/page.tsx)
 * - Przekierowuje użytkownika na Przelewy24, skąd wróci przez /api/payments/callback
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  createPrzelewy24Transaction, 
  generateSessionId, 
  convertToGrosze,
  type Przelewy24TransactionData 
} from '@/lib/przelewy24';

// Definicja danych wejściowych z formularza płatności
interface PaymentRequestData {
  parishId: string;           // ID parafii (z URL lub formularza)
  amount: number;             // Kwota w PLN (np. 10.50)
  donorName?: string;         // Nazwa darczyńcy (opcjonalne)
  donorEmail: string;         // Email darczyńcy (wymagane)
  donorPhone?: string;        // Telefon darczyńcy (opcjonalne)
  message?: string;           // Wiadomość dla parafii (opcjonalne)
  isAnonymous: boolean;       // Czy datek ma być anonimowy
  paymentMethod: string;      // Metoda płatności (blik, karta, itp.)
  isRecurring?: boolean;      // Czy to płatność cykliczna
  recurringFrequency?: 'weekly' | 'monthly'; // Częstotliwość (jeśli cykliczna)
}

export async function POST(request: NextRequest) {
  try {
    // Parsowanie danych z żądania
    const requestData: PaymentRequestData = await request.json();
    
    // Walidacja wymaganych pól
    if (!requestData.parishId || !requestData.amount || !requestData.donorEmail) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych płatności' },
        { status: 400 }
      );
    }

    // Walidacja kwoty (minimum 1 PLN, maksimum 50000 PLN)
    if (requestData.amount < 1 || requestData.amount > 50000) {
      return NextResponse.json(
        { error: 'Kwota musi być między 1 a 50000 PLN' },
        { status: 400 }
      );
    }

    // Sprawdź czy parafia istnieje
    const parish = await prisma.parish.findUnique({
      where: { id: requestData.parishId },
      select: { id: true, name: true, city: true }
    });

    if (!parish) {
      return NextResponse.json(
        { error: 'Nie znaleziono parafii' },
        { status: 404 }
      );
    }

    // Generuj unikalny ID sesji dla tej płatności
    const sessionId = generateSessionId();
    
    // Konwertuj kwotę na grosze (wymagane przez Przelewy24)
    const amountInGrosze = convertToGrosze(requestData.amount);

    // Przygotuj URL-e powrotu i powiadomień
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const returnUrl = `${baseUrl}/api/payments/callback?sessionId=${sessionId}`;
    const statusUrl = `${baseUrl}/api/payments/webhook`;

    // Przygotuj dane dla Przelewy24
    const transactionData: Przelewy24TransactionData = {
      sessionId,
      amount: amountInGrosze,
      currency: 'PLN',
      description: `Datek dla ${parish.name} (${parish.city})`,
      email: requestData.donorEmail,
      country: 'PL',
      language: 'pl',
      urlReturn: returnUrl,
      urlStatus: statusUrl,
      
      // Opcjonalne dane osobowe (jeśli nie anonimowe)
      ...(requestData.donorName && !requestData.isAnonymous && {
        client: requestData.donorName,
      }),
      ...(requestData.donorPhone && {
        phone: requestData.donorPhone,
      }),
    };

    // Utwórz transakcję w Przelewy24
    const przelewy24Response = await createPrzelewy24Transaction(transactionData);

    // Zapisz informacje o płatności w naszej bazie danych
    const payment = await prisma.payment.create({
      data: {
        amount: requestData.amount,
        donorName: requestData.isAnonymous ? null : requestData.donorName,
        donorEmail: requestData.donorEmail,
        message: requestData.message,
        isAnonymous: requestData.isAnonymous,
        status: 'PENDING', // Status początkowy
        paymentMethod: requestData.paymentMethod,
        transactionId: sessionId, // ID sesji Przelewy24
        parishId: requestData.parishId,
        
        // Dodatkowe metadane dla Przelewy24
        metadata: {
          przelewy24Token: przelewy24Response.token,
          paymentUrl: przelewy24Response.paymentUrl,
          isRecurring: requestData.isRecurring || false,
          recurringFrequency: requestData.recurringFrequency,
        }
      }
    });

    console.log(`✅ Utworzono płatność: ${payment.id} dla parafii ${parish.name}`);

    // Zwróć URL do przekierowania na stronę płatności
    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      paymentUrl: przelewy24Response.paymentUrl,
      sessionId: sessionId,
      message: 'Płatność została utworzona pomyślnie'
    });

  } catch (error) {
    console.error('Błąd tworzenia płatności:', error);

    // Szczegółowe logowanie błędów dla debugowania
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }

    return NextResponse.json(
      { 
        error: 'Wystąpił błąd podczas przetwarzania płatności',
        details: error instanceof Error ? error.message : 'Nieznany błąd'
      },
      { status: 500 }
    );
  }
}

// Endpoint GET do sprawdzania statusu płatności
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');
    const sessionId = searchParams.get('sessionId');

    if (!paymentId && !sessionId) {
      return NextResponse.json(
        { error: 'Brak identyfikatora płatności' },
        { status: 400 }
      );
    }

    // Znajdź płatność po ID lub sessionId
    const payment = await prisma.payment.findFirst({
      where: paymentId 
        ? { id: paymentId }
        : { transactionId: sessionId },
      include: {
        parish: {
          select: { name: true, city: true }
        }
      }
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Nie znaleziono płatności' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: payment.id,
      amount: payment.amount,
      status: payment.status,
      createdAt: payment.createdAt,
      parish: payment.parish,
      isAnonymous: payment.isAnonymous,
      message: payment.message,
    });

  } catch (error) {
    console.error('Błąd sprawdzania statusu płatności:', error);
    
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas sprawdzania statusu płatności' },
      { status: 500 }
    );
  }
}
