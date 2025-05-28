import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

/**
 * API endpoint do aktualizacji danych użytkownika
 * Obsługuje zmianę imienia, nazwiska, emaila, telefonu i hasła
 */
export async function PUT(request: NextRequest) {
  try {
    // Sprawdź autoryzację
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Brak autoryzacji' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { imieNazwisko, email, telefon, noweHaslo } = body

    // Walidacja podstawowych danych
    if (!imieNazwisko?.trim()) {
      return NextResponse.json(
        { error: 'Imię i nazwisko są wymagane' },
        { status: 400 }
      )
    }

    if (!email?.trim()) {
      return NextResponse.json(
        { error: 'Adres email jest wymagany' },
        { status: 400 }
      )
    }

    // Walidacja formatu email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Niepoprawny format adresu email' },
        { status: 400 }
      )
    }

    // Sprawdź czy email nie jest już zajęty przez innego użytkownika
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { error: 'Użytkownik z tym adresem email już istnieje' },
          { status: 400 }
        )
      }
    }

    // Przygotuj dane do aktualizacji
    const updateData: any = {
      name: imieNazwisko.trim(),
      email: email.trim(),
      phone: telefon?.trim() || null, // Opcjonalny telefon
    }

    // Jeśli użytkownik chce zmienić hasło
    if (noweHaslo) {
      if (noweHaslo.length < 6) {
        return NextResponse.json(
          { error: 'Nowe hasło musi mieć co najmniej 6 znaków' },
          { status: 400 }
        )
      }

      const hashedPassword = await bcrypt.hash(noweHaslo, 12)
      updateData.password = hashedPassword
    }

    // Aktualizuj dane użytkownika
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        parishId: true
      }
    })

    return NextResponse.json(
      { 
        message: 'Dane zostały pomyślnie zaktualizowane',
        user: updatedUser
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Błąd aktualizacji użytkownika:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: String(error)
    })
    
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas aktualizacji danych' },
      { status: 500 }
    )
  }
}
