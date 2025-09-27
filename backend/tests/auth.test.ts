import { describe, it, expect, beforeEach } from 'vitest'
import { 
  hashPassword, 
  verifyPassword, 
  generateJWT, 
  generateRefreshToken, 
  verifyJWT,
  extractTokenFromHeader 
} from '../src/lib/auth'

describe('Authentication Functions', () => {
  const testPassword = 'TestPassword123'
  const testUserId = 'test-user-id-123'
  const testJwtSecret = 'test-jwt-secret-key'

  describe('Password Hashing', () => {
    it('should hash a password successfully', async () => {
      const hashedPassword = await hashPassword(testPassword)
      
      expect(hashedPassword).toBeDefined()
      expect(typeof hashedPassword).toBe('string')
      expect(hashedPassword.length).toBeGreaterThan(0)
      expect(hashedPassword).not.toBe(testPassword)
    })

    it('should generate different hashes for the same password', async () => {
      const hash1 = await hashPassword(testPassword)
      const hash2 = await hashPassword(testPassword)
      
      // Due to random salt, hashes should be different
      expect(hash1).not.toBe(hash2)
    })

    it('should handle empty password', async () => {
      const hashedPassword = await hashPassword('')
      
      expect(hashedPassword).toBeDefined()
      expect(typeof hashedPassword).toBe('string')
    })
  })

  describe('Password Verification', () => {
    it('should verify correct password', async () => {
      const hashedPassword = await hashPassword(testPassword)
      const isValid = await verifyPassword(testPassword, hashedPassword)
      
      expect(isValid).toBe(true)
    })

    it('should reject incorrect password', async () => {
      const hashedPassword = await hashPassword(testPassword)
      const isValid = await verifyPassword('WrongPassword123', hashedPassword)
      
      expect(isValid).toBe(false)
    })

    it('should handle empty password verification', async () => {
      const hashedPassword = await hashPassword('')
      const isValid = await verifyPassword('', hashedPassword)
      
      expect(isValid).toBe(true)
    })

    it('should handle invalid hash format', async () => {
      const isValid = await verifyPassword(testPassword, 'invalid-hash')
      
      expect(isValid).toBe(false)
    })

    it('should handle malformed base64 hash', async () => {
      const isValid = await verifyPassword(testPassword, 'not-base64!')
      
      expect(isValid).toBe(false)
    })
  })

  describe('JWT Generation', () => {
    it('should generate access token successfully', async () => {
      const token = await generateJWT(testUserId, testJwtSecret, 'access')
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
    })

    it('should generate refresh token successfully', async () => {
      const token = await generateJWT(testUserId, testJwtSecret, 'refresh')
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3)
    })

    it('should generate refresh token using helper function', async () => {
      const token = await generateRefreshToken(testUserId, testJwtSecret)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3)
    })

    it('should generate different tokens for different users', async () => {
      const token1 = await generateJWT('user1', testJwtSecret, 'access')
      const token2 = await generateJWT('user2', testJwtSecret, 'access')
      
      expect(token1).not.toBe(token2)
    })

    it('should generate different tokens for different types', async () => {
      const accessToken = await generateJWT(testUserId, testJwtSecret, 'access')
      const refreshToken = await generateJWT(testUserId, testJwtSecret, 'refresh')
      
      expect(accessToken).not.toBe(refreshToken)
    })
  })

  describe('JWT Verification', () => {
    it('should verify valid access token', async () => {
      const token = await generateJWT(testUserId, testJwtSecret, 'access')
      const decoded = await verifyJWT(token, testJwtSecret)
      
      expect(decoded).toBeDefined()
      expect(decoded.userId).toBe(testUserId)
      expect(decoded.type).toBe('access')
    })

    it('should verify valid refresh token', async () => {
      const token = await generateJWT(testUserId, testJwtSecret, 'refresh')
      const decoded = await verifyJWT(token, testJwtSecret)
      
      expect(decoded).toBeDefined()
      expect(decoded.userId).toBe(testUserId)
      expect(decoded.type).toBe('refresh')
    })

    it('should reject token with wrong secret', async () => {
      const token = await generateJWT(testUserId, testJwtSecret, 'access')
      
      await expect(verifyJWT(token, 'wrong-secret')).rejects.toThrow('Invalid or expired token')
    })

    it('should reject malformed token', async () => {
      await expect(verifyJWT('invalid.token', testJwtSecret)).rejects.toThrow('Invalid or expired token')
    })

    it('should reject token with invalid format', async () => {
      await expect(verifyJWT('not-a-jwt-token', testJwtSecret)).rejects.toThrow('Invalid or expired token')
    })

    it('should reject token with only two parts', async () => {
      await expect(verifyJWT('header.payload', testJwtSecret)).rejects.toThrow('Invalid or expired token')
    })

    it('should reject empty token', async () => {
      await expect(verifyJWT('', testJwtSecret)).rejects.toThrow('Invalid or expired token')
    })
  })

  describe('Token Header Extraction', () => {
    it('should extract token from valid Bearer header', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature'
      const authHeader = `Bearer ${token}`
      
      const extractedToken = extractTokenFromHeader(authHeader)
      
      expect(extractedToken).toBe(token)
    })

    it('should reject header without Bearer prefix', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature'
      
      expect(() => extractTokenFromHeader(token)).toThrow('Missing or invalid Authorization header')
    })

    it('should reject undefined header', () => {
      expect(() => extractTokenFromHeader(undefined)).toThrow('Missing or invalid Authorization header')
    })

    it('should reject empty header', () => {
      expect(() => extractTokenFromHeader('')).toThrow('Missing or invalid Authorization header')
    })

    it('should reject header with wrong case', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature'
      const authHeader = `bearer ${token}` // lowercase
      
      expect(() => extractTokenFromHeader(authHeader)).toThrow('Missing or invalid Authorization header')
    })

    it('should handle Bearer with extra spaces', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature'
      const authHeader = `Bearer  ${token}` // extra space
      
      const extractedToken = extractTokenFromHeader(authHeader)
      
      expect(extractedToken).toBe(` ${token}`) // Should include the extra space
    })
  })

  describe('Integration Tests', () => {
    it('should complete full password hash and verify cycle', async () => {
      const password = 'MySecurePassword123!'
      
      // Hash the password
      const hashedPassword = await hashPassword(password)
      
      // Verify correct password
      const isValidCorrect = await verifyPassword(password, hashedPassword)
      expect(isValidCorrect).toBe(true)
      
      // Verify incorrect password
      const isValidIncorrect = await verifyPassword('WrongPassword', hashedPassword)
      expect(isValidIncorrect).toBe(false)
    })

    it('should complete full JWT generation and verification cycle', async () => {
      const userId = 'user-123'
      const secret = 'my-jwt-secret'
      
      // Generate access token
      const accessToken = await generateJWT(userId, secret, 'access')
      
      // Generate refresh token
      const refreshToken = await generateRefreshToken(userId, secret)
      
      // Verify access token
      const decodedAccess = await verifyJWT(accessToken, secret)
      expect(decodedAccess.userId).toBe(userId)
      expect(decodedAccess.type).toBe('access')
      
      // Verify refresh token
      const decodedRefresh = await verifyJWT(refreshToken, secret)
      expect(decodedRefresh.userId).toBe(userId)
      expect(decodedRefresh.type).toBe('refresh')
    })

    it('should handle complete auth header extraction and JWT verification', async () => {
      const userId = 'user-456'
      const secret = 'another-secret'
      
      // Generate token
      const token = await generateJWT(userId, secret, 'access')
      
      // Create auth header
      const authHeader = `Bearer ${token}`
      
      // Extract token
      const extractedToken = extractTokenFromHeader(authHeader)
      
      // Verify extracted token
      const decoded = await verifyJWT(extractedToken, secret)
      expect(decoded.userId).toBe(userId)
      expect(decoded.type).toBe('access')
    })
  })
})
