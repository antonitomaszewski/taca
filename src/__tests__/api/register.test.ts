import { NextRequest } from 'next/server'
import { POST } from '@/app/api/register/route'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    $transaction: jest.fn(),
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    parish: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}))

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

describe('/api/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should register a new parish successfully', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'PARISH_ADMIN',
      parishId: 'parish-1',
    }

    const mockParish = {
      id: 'parish-1',
      name: 'Test Parish',
    }

    // Mock'uj wszystkie wywołania Prisma
    mockPrisma.user.findUnique.mockResolvedValue(null) // Użytkownik nie istnieje
    mockPrisma.parish.findFirst.mockResolvedValue(null) // Parafia nie istnieje
    mockBcrypt.hash.mockResolvedValue('hashedpassword123')
    mockPrisma.$transaction.mockResolvedValue([mockUser, mockParish])

    const requestBody = {
      nazwaParafii: 'Test Parish',
      imieNazwisko: 'Test User',
      email: 'test@example.com',
      telefon: '123456789',
      haslo: 'password123',
      powtorzHaslo: 'password123',
      akceptacjaRegulaminu: true,
    }

    const request = new NextRequest('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.message).toBe('Rejestracja przebiegła pomyślnie')
    expect(data.user.email).toBe('test@example.com')
    expect(data.parish.name).toBe('Test Parish')
  })

  it('should return error when passwords do not match', async () => {
    const requestBody = {
      nazwaParafii: 'Test Parish',
      imieNazwisko: 'Test User',
      email: 'test@example.com',
      telefon: '123456789',
      haslo: 'password123',
      powtorzHaslo: 'differentpassword',
      akceptacjaRegulaminu: true,
    }

    const request = new NextRequest('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Hasła nie są identyczne')
  })

  it('should return error when user already exists', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'existing-user',
      email: 'test@example.com',
    } as any)

    const requestBody = {
      nazwaParafii: 'Test Parish',
      imieNazwisko: 'Test User',
      email: 'test@example.com',
      telefon: '123456789',
      haslo: 'password123',
      powtorzHaslo: 'password123',
      akceptacjaRegulaminu: true,
    }

    const request = new NextRequest('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Użytkownik z tym adresem email już istnieje')
  })

  it('should return error when required fields are missing', async () => {
    const requestBody = {
      nazwaParafii: '',
      imieNazwisko: 'Test User',
      email: 'test@example.com',
    }

    const request = new NextRequest('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Wszystkie pola są wymagane')
  })

  it('should return error when terms are not accepted', async () => {
    const requestBody = {
      nazwaParafii: 'Test Parish',
      imieNazwisko: 'Test User',
      email: 'test@example.com',
      telefon: '123456789',
      haslo: 'password123',
      powtorzHaslo: 'password123',
      akceptacjaRegulaminu: false,
    }

    const request = new NextRequest('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Musisz zaakceptować regulamin')
  })
})
