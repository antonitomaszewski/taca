import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { UserRole } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nazwaParafii, imieNazwisko, email, telefon, haslo, powtorzHaslo } = body

    // Walidacja danych
    if (!nazwaParafii || !imieNazwisko || !email || !haslo || !powtorzHaslo) {
      return NextResponse.json(
        { error: 'Wszystkie pola są wymagane' },
        { status: 400 }
      )
    }

    // Sprawdź czy hasła są identyczne
    if (haslo !== powtorzHaslo) {
      return NextResponse.json(
        { error: 'Hasła nie są identyczne' },
        { status: 400 }
      )
    }

    // Sprawdź czy użytkownik już istnieje
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Użytkownik z tym adresem email już istnieje' },
        { status: 400 }
      )
    }

    // Sprawdź czy parafia o tej nazwie już istnieje
    const existingParish = await prisma.parish.findFirst({
      where: { name: nazwaParafii }
    })

    if (existingParish) {
      return NextResponse.json(
        { error: 'Parafia o tej nazwie już istnieje' },
        { status: 400 }
      )
    }

    // Hashuj hasło
    const hashedPassword = await bcrypt.hash(haslo, 12)

    // Stwórz parafię i użytkownika w transakcji
    const result = await prisma.$transaction(async (tx) => {
      // Najpierw stwórz parafię
      const parish = await tx.parish.create({
        data: {
          name: nazwaParafii,
          address: '', // Będzie uzupełnione później w edycji
          city: '', // Będzie uzupełnione później w edycji
          latitude: 0, // Tymczasowe wartości - będą uzupełnione
          longitude: 0, // Tymczasowe wartości - będą uzupełnione
          phone: telefon || '',
          email: email,
          // Inne pola opcjonalne - będą uzupełnione w edycji
        }
      })

      // Potem stwórz użytkownika i połącz z parafią
      const user = await tx.user.create({
        data: {
          email,
          name: imieNazwisko,
          password: hashedPassword,
          role: UserRole.PARISH_ADMIN,
          parishId: parish.id
        }
      })

      return { parish, user }
    })

    return NextResponse.json(
      { 
        message: 'Rejestracja przebiegła pomyślnie',
        parishId: result.parish.id,
        userId: result.user.id
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Błąd rejestracji:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: String(error)
    })
    
    // Sprawdź czy to błąd związany z polami wymaganymi
    if (error instanceof Error && error.message.includes('required')) {
      return NextResponse.json(
        { error: 'Brakuje wymaganych danych parafii' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas rejestracji' },
      { status: 500 }
    )
  }
}
