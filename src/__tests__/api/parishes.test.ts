import { NextRequest } from 'next/server'
import { GET } from '@/app/api/parishes/route'
import { prisma } from '@/lib/prisma'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    parish: {
      findMany: jest.fn(),
    },
  },
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('/api/parishes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return all parishes successfully', async () => {
    const mockParishes = [
      {
        id: 'parish-1',
        name: 'Parafia św. Jana',
        city: 'Wrocław',
        address: 'ul. Testowa 1',
        email: 'test1@example.com',
        phone: '123456789',
        website: 'https://test1.pl',
        description: 'Test description 1',
        pastor: 'ks. Jan Kowalski',
        latitude: 51.1095,
        longitude: 17.0347,
        zipCode: '50-001',
        massSchedule: 'Niedziela: 8:00, 10:00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'parish-2',
        name: 'Parafia św. Marii',
        city: 'Kraków',
        address: 'ul. Testowa 2',
        email: 'test2@example.com',
        phone: '987654321',
        website: 'https://test2.pl',
        description: 'Test description 2',
        pastor: 'ks. Piotr Nowak',
        latitude: 50.0647,
        longitude: 19.9450,
        zipCode: '30-001',
        massSchedule: 'Niedziela: 9:00, 11:00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    mockPrisma.parish.findMany.mockResolvedValue(mockParishes)

    const request = new NextRequest('http://localhost:3000/api/parishes')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.parishes).toHaveLength(2)
    expect(data.parishes[0].name).toBe('Parafia św. Jana')
    expect(data.parishes[1].name).toBe('Parafia św. Marii')
  })

  it('should return empty array when no parishes exist', async () => {
    mockPrisma.parish.findMany.mockResolvedValue([])

    const request = new NextRequest('http://localhost:3000/api/parishes')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.parishes).toHaveLength(0)
  })

  it('should handle database errors', async () => {
    mockPrisma.parish.findMany.mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/parishes')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Wystąpił błąd serwera')
  })

  it('should filter parishes by city when query parameter provided', async () => {
    const mockParishes = [
      {
        id: 'parish-1',
        name: 'Parafia św. Jana',
        city: 'Wrocław',
        address: 'ul. Testowa 1',
        email: 'test1@example.com',
        phone: '123456789',
        website: 'https://test1.pl',
        description: 'Test description 1',
        pastor: 'ks. Jan Kowalski',
        latitude: 51.1095,
        longitude: 17.0347,
        zipCode: '50-001',
        massSchedule: 'Niedziela: 8:00, 10:00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    mockPrisma.parish.findMany.mockResolvedValue(mockParishes)

    const request = new NextRequest('http://localhost:3000/api/parishes?city=Wrocław')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.parishes).toHaveLength(1)
    expect(data.parishes[0].city).toBe('Wrocław')
    expect(mockPrisma.parish.findMany).toHaveBeenCalledWith({
      where: {
        city: {
          contains: 'Wrocław',
          mode: 'insensitive',
        },
      },
    })
  })
})
