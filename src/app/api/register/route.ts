import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { UserRole } from '@prisma/client'
import { ACCOUNT_TYPES } from '@/constants/accountTypes'
import { sendTestEmail } from '@/lib/email/resend'

/**
 * API endpoint do rejestracji użytkowników
 * Obsługuje dwa typy kont:
 * - PARISHIONER: Jednoetapowa rejestracja parafianina
 * - PARISH_ADMIN: Dwuetapowa rejestracja proboszcza z parafią
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accountType, userData, parishData } = body

    // Walidacja typu konta
    if (!accountType || !Object.values(ACCOUNT_TYPES).includes(accountType)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy typ konta' },
        { status: 400 }
      )
    }

    // Walidacja danych użytkownika
    if (!userData || !userData.imieNazwisko || !userData.email || !userData.haslo) {
      return NextResponse.json(
        { error: 'Brakuje wymaganych danych użytkownika' },
        { status: 400 }
      )
    }

    // Sprawdź czy hasła są identyczne
    if (userData.haslo !== userData.powtorzHaslo) {
      return NextResponse.json(
        { error: 'Hasła nie są identyczne' },
        { status: 400 }
      )
    }

    // Sprawdź długość hasła
    if (userData.haslo.length < 6) {
      return NextResponse.json(
        { error: 'Hasło musi mieć co najmniej 6 znaków' },
        { status: 400 }
      )
    }

    // Sprawdź akceptację regulaminu
    if (!userData.akceptacjaRegulaminu) {
      return NextResponse.json(
        { error: 'Musisz zaakceptować regulamin' },
        { status: 400 }
      )
    }

    // Sprawdź czy użytkownik już istnieje
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Użytkownik z tym adresem email już istnieje' },
        { status: 400 }
      )
    }

    // Hashuj hasło
    const hashedPassword = await bcrypt.hash(userData.haslo, 12)

    // Rejestracja parafianina (jednoetapowa)
    if (accountType === ACCOUNT_TYPES.PARISHIONER) {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.imieNazwisko,
          password: hashedPassword,
          role: UserRole.PARISHIONER,
          // Parafianin nie jest przypisany do żadnej parafii
        }
      })

      return NextResponse.json(
        { 
          message: 'Rejestracja parafianina przebiegła pomyślnie',
          userId: user.id,
          accountType: ACCOUNT_TYPES.PARISHIONER,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          },
          autoLogin: {
            email: userData.email,
            password: userData.haslo
          }
        },
        { status: 201 }
      )
    }

    // Rejestracja proboszcza z parafią (dwuetapowa)
    if (accountType === ACCOUNT_TYPES.PARISH_ADMIN) {
      // Walidacja danych parafii
      if (!parishData || !parishData.nazwaParafii || !parishData.adresParafii || !parishData.miastoParafii || !parishData.identyfikatorParafii || !parishData.numerKonta) {
        return NextResponse.json(
          { error: 'Brakuje wymaganych danych parafii' },
          { status: 400 }
        )
      }

      // Walidacja identyfikatora parafii (uniqueSlug)
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(parishData.identyfikatorParafii)) {
        return NextResponse.json(
          { error: 'Identyfikator parafii może zawierać tylko małe litery, cyfry i myślniki' },
          { status: 400 }
        )
      }

      // Walidacja numeru konta (26 cyfr)
      const accountRegex = /^\d{26}$/;
      if (!accountRegex.test(parishData.numerKonta.replace(/\s/g, ''))) {
        return NextResponse.json(
          { error: 'Numer konta musi zawierać dokładnie 26 cyfr' },
          { status: 400 }
        )
      }

      // Walidacja zdjęcia parafii
      if (!parishData.zdjecieParafii) {
        return NextResponse.json(
          { error: 'Zdjęcie parafii jest wymagane' },
          { status: 400 }
        )
      }

      // Sprawdź czy parafia o tej nazwie już istnieje
      const existingParish = await prisma.parish.findFirst({
        where: { 
          OR: [
            { name: parishData.nazwaParafii },
            { uniqueSlug: parishData.identyfikatorParafii }
          ]
        }
      })

      if (existingParish) {
        if (existingParish.name === parishData.nazwaParafii) {
          return NextResponse.json(
            { error: 'Parafia o tej nazwie już istnieje' },
            { status: 400 }
          )
        }
        if (existingParish.uniqueSlug === parishData.identyfikatorParafii) {
          return NextResponse.json(
            { error: 'Identyfikator parafii jest już zajęty' },
            { status: 400 }
          )
        }
      }

      // Stwórz parafię i użytkownika w transakcji
      const result = await prisma.$transaction(async (tx) => {
        // Najpierw stwórz parafię z podstawowymi danymi
        const parish = await tx.parish.create({
          data: {
            name: parishData.nazwaParafii,
            uniqueSlug: parishData.identyfikatorParafii,
            address: parishData.adresParafii,
            city: parishData.miastoParafii,
            zipCode: parishData.kodPocztowyParafii || null,
            latitude: parishData.latitude || 0, // Użyj przekazanych współrzędnych lub domyślnych
            longitude: parishData.longitude || 0, // Użyj przekazanych współrzędnych lub domyślnych
            phone: parishData.telefonParafii || null,
            email: parishData.emailParafii || userData.email,
            website: parishData.stronkaParafii || null,
            description: parishData.opisParafii || null,
            pastor: parishData.proboszczParafii || userData.imieNazwisko,
            massSchedule: parishData.godzinyMsz || null,
            bankAccount: parishData.numerKonta,
            photoUrl: parishData.zdjecieParafii || null, // Tymczasowo - będzie implementowany upload
          }
        })

        // Potem stwórz użytkownika i połącz z parafią
        const user = await tx.user.create({
          data: {
            email: userData.email,
            name: userData.imieNazwisko,
            password: hashedPassword,
            role: UserRole.PARISH_ADMIN,
            parishId: parish.id
          }
        });

        // TUTAJ DODAJ WYSYŁANIE MAILA:
        try {
          await sendTestEmail();
          console.log('Email potwierdzenia wysłany do:', userData.email);
        } catch (emailError) {
          console.error('Nie udało się wysłać email:', emailError);
          // Nie przerywamy rejestracji jeśli email się nie wyśle
        }
        

        return { parish, user }
      })

      return NextResponse.json(
        { 
          message: 'Rejestracja parafii przebiegła pomyślnie',
          parishId: result.parish.id,
          parishSlug: result.parish.uniqueSlug,
          userId: result.user.id,
          accountType: ACCOUNT_TYPES.PARISH_ADMIN,
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
            parishId: result.user.parishId
          },
          parish: {
            id: result.parish.id,
            name: result.parish.name,
            uniqueSlug: result.parish.uniqueSlug
          },
          autoLogin: {
            email: userData.email,
            password: userData.haslo
          }
        },
        { status: 201 }
      )
    }

    return NextResponse.json(
      { error: 'Nieobsługiwany typ konta' },
      { status: 400 }
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
        { error: 'Brakuje wymaganych danych' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas rejestracji' },
      { status: 500 }
    )
  }
}
