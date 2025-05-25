import { NextRequest } from 'next/server'
import { GET, PUT } from '@/app/api/parishes/[id]/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    parish: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}))

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

describe('/api/parishes/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return parish by id successfully', async () => {
      const mockParish = {
        id: 'parish-1',
        name: 'Parafia św. Jana',
        city: 'Wrocław',
        address: 'ul. Testowa 1',
        email: 'test@example.com',
        phone: '123456789',
        website: 'https://test.pl',
        description: 'Test description',
        pastor: 'ks. Jan Kowalski',
        latitude: 51.1095,
        longitude: 17.0347,
        zipCode: '50-001',
        massSchedule: 'Niedziela: 8:00, 10:00',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrisma.parish.findUnique.mockResolvedValue(mockParish)

      const request = new NextRequest('http://localhost:3000/api/parishes/parish-1')
      const response = await GET(request, { params: { id: 'parish-1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.parish.id).toBe('parish-1')
      expect(data.parish.name).toBe('Parafia św. Jana')
      expect(mockPrisma.parish.findUnique).toHaveBeenCalledWith({
        where: { id: 'parish-1' }
      })
    })

    it('should return 404 when parish not found', async () => {
      mockPrisma.parish.findUnique.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/parishes/nonexistent')
      const response = await GET(request, { params: { id: 'nonexistent' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Parafia nie została znaleziona')
    })
  })

  describe('PUT', () => {
    it('should update parish successfully when authenticated', async () => {
      const mockSession = {
        user: {
          id: 'user-1',
          parishId: 'parish-1',
          role: 'PARISH_ADMIN',
        },
      }

      const mockUpdatedParish = {
        id: 'parish-1',
        name: 'Updated Parish Name',
        city: 'Wrocław',
        address: 'ul. Nowa 1',
        email: 'updated@example.com',
        phone: '987654321',
        website: 'https://updated.pl',
        description: 'Updated description',
        pastor: 'ks. Jan Nowak',
      }

      mockGetServerSession.mockResolvedValue(mockSession as any)
      mockPrisma.parish.findUnique.mockResolvedValue({ id: 'parish-1' } as any)
      mockPrisma.parish.update.mockResolvedValue(mockUpdatedParish as any)

      const updateData = {
        nazwa: 'Updated Parish Name',
        miejscowosc: 'Wrocław',
        adres: 'ul. Nowa 1',
        email: 'updated@example.com',
        telefon: '987654321',
        strona: 'https://updated.pl',
        opis: 'Updated description',
        proboszcz: 'ks. Jan Nowak',
      }

      const request = new NextRequest('http://localhost:3000/api/parishes/parish-1', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await PUT(request, { params: { id: 'parish-1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.parish.name).toBe('Updated Parish Name')
      expect(mockPrisma.parish.update).toHaveBeenCalledWith({
        where: { id: 'parish-1' },
        data: {
          name: 'Updated Parish Name',
          city: 'Wrocław',
          address: 'ul. Nowa 1',
          email: 'updated@example.com',
          phone: '987654321',
          website: 'https://updated.pl',
          description: 'Updated description',
          pastor: 'ks. Jan Nowak',
        },
      })
    })

    it('should return 401 when not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/parishes/parish-1', {
        method: 'PUT',
        body: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await PUT(request, { params: { id: 'parish-1' } })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Musisz być zalogowany')
    })

    it('should return 403 when user tries to update different parish', async () => {
      const mockSession = {
        user: {
          id: 'user-1',
          parishId: 'parish-2', // Different parish
          role: 'PARISH_ADMIN',
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession as any)

      const request = new NextRequest('http://localhost:3000/api/parishes/parish-1', {
        method: 'PUT',
        body: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await PUT(request, { params: { id: 'parish-1' } })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Nie masz uprawnień do edycji tej parafii')
    })

    it('should return 404 when parish not found', async () => {
      const mockSession = {
        user: {
          id: 'user-1',
          parishId: 'parish-1',
          role: 'PARISH_ADMIN',
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession as any)
      mockPrisma.parish.findUnique.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/parishes/parish-1', {
        method: 'PUT',
        body: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await PUT(request, { params: { id: 'parish-1' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Parafia nie została znaleziona')
    })
  })
})
