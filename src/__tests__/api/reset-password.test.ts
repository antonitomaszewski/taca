import { NextRequest } from 'next/server'
import { POST } from '@/app/api/reset-password/route'
import { prisma } from '@/lib/prisma'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

// Mock crypto
jest.mock('crypto', () => ({
  randomBytes: jest.fn(() => ({
    toString: jest.fn(() => 'mock-token-123'),
  })),
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('/api/reset-password', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return success message for existing user', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
    }

    mockPrisma.user.findUnique.mockResolvedValue(mockUser as any)

    const requestBody = {
      email: 'test@example.com',
    }

    const request = new NextRequest('http://localhost:3000/api/reset-password', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBe('Instrukcje zostały wysłane na podany adres email')
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' }
    })
  })

  it('should return success message for non-existing user (security)', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null)

    const requestBody = {
      email: 'nonexistent@example.com',
    }

    const request = new NextRequest('http://localhost:3000/api/reset-password', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBe('Instrukcje zostały wysłane na podany adres email')
  })

  it('should return error when email is missing', async () => {
    const requestBody = {}

    const request = new NextRequest('http://localhost:3000/api/reset-password', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Email jest wymagany')
  })

  it('should return error when email is empty string', async () => {
    const requestBody = {
      email: '',
    }

    const request = new NextRequest('http://localhost:3000/api/reset-password', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Email jest wymagany')
  })

  it('should handle database errors', async () => {
    mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'))

    const requestBody = {
      email: 'test@example.com',
    }

    const request = new NextRequest('http://localhost:3000/api/reset-password', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Wystąpił błąd serwera')
  })

  it('should handle invalid JSON', async () => {
    const request = new NextRequest('http://localhost:3000/api/reset-password', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Wystąpił błąd serwera')
  })
})
