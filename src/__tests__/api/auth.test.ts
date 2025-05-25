import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

describe('NextAuth Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Credentials Provider', () => {
    const credentialsProvider = authOptions.providers[0] as any
    const authorize = credentialsProvider.authorize

    it('should authenticate user with valid credentials', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashedpassword123',
        name: 'Test User',
        role: 'PARISH_ADMIN',
        parishId: 'parish-1',
        parish: {
          id: 'parish-1',
          name: 'Test Parish',
        },
      }

      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any)
      mockBcrypt.compare.mockResolvedValue(true)

      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = await authorize(credentials, {} as any)

      expect(result).toEqual({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'PARISH_ADMIN',
        parishId: 'parish-1',
      })

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        include: { parish: true },
      })
      expect(mockBcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword123')
    })

    it('should return null when credentials are missing', async () => {
      const result1 = await authorize(null, {} as any)
      const result2 = await authorize({}, {} as any)
      const result3 = await authorize({ email: 'test@example.com' }, {} as any)
      const result4 = await authorize({ password: 'password123' }, {} as any)

      expect(result1).toBeNull()
      expect(result2).toBeNull()
      expect(result3).toBeNull()
      expect(result4).toBeNull()
    })

    it('should return null when user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      const credentials = {
        email: 'nonexistent@example.com',
        password: 'password123',
      }

      const result = await authorize(credentials, {} as any)

      expect(result).toBeNull()
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
        include: { parish: true },
      })
    })

    it('should return null when password is invalid', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashedpassword123',
        name: 'Test User',
        role: 'PARISH_ADMIN',
        parishId: 'parish-1',
      }

      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any)
      mockBcrypt.compare.mockResolvedValue(false)

      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      }

      const result = await authorize(credentials, {} as any)

      expect(result).toBeNull()
      expect(mockBcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword123')
    })
  })

  describe('Callbacks', () => {
    it('should add user data to JWT token', async () => {
      const jwtCallback = authOptions.callbacks?.jwt as any
      
      const token = {}
      const user = {
        id: 'user-1',
        role: 'PARISH_ADMIN',
        parishId: 'parish-1',
      }

      const result = await jwtCallback({ token, user })

      expect(result).toEqual({
        role: 'PARISH_ADMIN',
        parishId: 'parish-1',
      })
    })

    it('should add user data to session', async () => {
      const sessionCallback = authOptions.callbacks?.session as any
      
      const session = {
        user: {},
      }
      const token = {
        sub: 'user-1',
        role: 'PARISH_ADMIN',
        parishId: 'parish-1',
      }

      const result = await sessionCallback({ session, token })

      expect(result.user).toEqual({
        id: 'user-1',
        role: 'PARISH_ADMIN',
        parishId: 'parish-1',
      })
    })
  })

  describe('Configuration', () => {
    it('should have correct session strategy', () => {
      expect(authOptions.session?.strategy).toBe('jwt')
    })

    it('should have correct sign-in page', () => {
      expect(authOptions.pages?.signIn).toBe('/')
    })

    it('should have Prisma adapter', () => {
      expect(authOptions.adapter).toBeDefined()
    })
  })
})
