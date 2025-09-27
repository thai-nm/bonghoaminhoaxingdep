import { describe, it, expect } from 'vitest'
import { 
  registerSchema, 
  loginSchema, 
  refreshTokenSchema,
  createTodoSchema,
  updateTodoSchema
} from '../src/lib/validation'

describe('Validation Schemas', () => {
  describe('Register Schema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPassword123'
      }
      
      const result = registerSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should reject username that is too short', () => {
      const invalidData = {
        username: 'ab', // Too short
        email: 'test@example.com',
        password: 'TestPassword123'
      }
      
      const result = registerSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 3 characters')
      }
    })

    it('should reject username that is too long', () => {
      const invalidData = {
        username: 'a'.repeat(51), // Too long
        email: 'test@example.com',
        password: 'TestPassword123'
      }
      
      const result = registerSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('less than 50 characters')
      }
    })

    it('should reject username with invalid characters', () => {
      const invalidData = {
        username: 'test-user!', // Contains invalid characters
        email: 'test@example.com',
        password: 'TestPassword123'
      }
      
      const result = registerSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('letters, numbers, and underscores')
      }
    })

    it('should accept username with underscores', () => {
      const validData = {
        username: 'test_user_123',
        email: 'test@example.com',
        password: 'TestPassword123'
      }
      
      const result = registerSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
    })

    it('should reject invalid email format', () => {
      const invalidData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'TestPassword123'
      }
      
      const result = registerSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid email format')
      }
    })

    it('should reject email that is too long', () => {
      const invalidData = {
        username: 'testuser',
        email: 'a'.repeat(250) + '@example.com', // Too long
        password: 'TestPassword123'
      }
      
      const result = registerSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('less than 255 characters')
      }
    })

    it('should reject password that is too short', () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123' // Too short
      }
      
      const result = registerSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 8 characters')
      }
    })

    it('should reject password that is too long', () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'A'.repeat(101) // Too long
      }
      
      const result = registerSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('less than 100 characters')
      }
    })

    it('should reject password without lowercase letter', () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TESTPASSWORD123' // No lowercase
      }
      
      const result = registerSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('lowercase letter')
      }
    })

    it('should reject password without uppercase letter', () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword123' // No uppercase
      }
      
      const result = registerSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('uppercase letter')
      }
    })

    it('should reject password without number', () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPassword' // No number
      }
      
      const result = registerSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('one number')
      }
    })

    it('should reject missing fields', () => {
      const invalidData = {
        username: 'testuser'
        // Missing email and password
      }
      
      const result = registerSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    })
  })

  describe('Login Schema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'TestPassword123'
      }
      
      const result = loginSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'TestPassword123'
      }
      
      const result = loginSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid email format')
      }
    })

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: ''
      }
      
      const result = loginSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Password is required')
      }
    })

    it('should reject missing fields', () => {
      const invalidData = {}
      
      const result = loginSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBe(2) // email and password missing
      }
    })
  })

  describe('Refresh Token Schema', () => {
    it('should validate correct refresh token data', () => {
      const validData = {
        refreshToken: 'valid.jwt.token'
      }
      
      const result = refreshTokenSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should reject empty refresh token', () => {
      const invalidData = {
        refreshToken: ''
      }
      
      const result = refreshTokenSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Refresh token is required')
      }
    })

    it('should reject missing refresh token', () => {
      const invalidData = {}
      
      const result = refreshTokenSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Required')
      }
    })
  })

  describe('Create Todo Schema', () => {
    it('should validate correct todo data', () => {
      const validData = {
        text: 'Buy groceries'
      }
      
      const result = createTodoSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should trim whitespace from todo text', () => {
      const dataWithWhitespace = {
        text: '  Buy groceries  '
      }
      
      const result = createTodoSchema.safeParse(dataWithWhitespace)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.text).toBe('Buy groceries')
      }
    })

    it('should reject empty todo text', () => {
      const invalidData = {
        text: ''
      }
      
      const result = createTodoSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Todo text is required')
      }
    })

    it('should reject todo text that is too long', () => {
      const invalidData = {
        text: 'a'.repeat(501) // Too long
      }
      
      const result = createTodoSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('less than 500 characters')
      }
    })

    it('should reject missing text field', () => {
      const invalidData = {}
      
      const result = createTodoSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Required')
      }
    })
  })

  describe('Update Todo Schema', () => {
    it('should validate update with text only', () => {
      const validData = {
        text: 'Updated todo text'
      }
      
      const result = updateTodoSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should validate update with completed only', () => {
      const validData = {
        completed: true
      }
      
      const result = updateTodoSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should validate update with both text and completed', () => {
      const validData = {
        text: 'Updated todo text',
        completed: false
      }
      
      const result = updateTodoSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should trim whitespace from updated text', () => {
      const dataWithWhitespace = {
        text: '  Updated todo text  '
      }
      
      const result = updateTodoSchema.safeParse(dataWithWhitespace)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.text).toBe('Updated todo text')
      }
    })

    it('should reject empty text when provided', () => {
      const invalidData = {
        text: ''
      }
      
      const result = updateTodoSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Todo text is required')
      }
    })

    it('should reject text that is too long', () => {
      const invalidData = {
        text: 'a'.repeat(501) // Too long
      }
      
      const result = updateTodoSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('less than 500 characters')
      }
    })

    it('should reject update with no fields', () => {
      const invalidData = {}
      
      const result = updateTodoSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('At least one field')
      }
    })

    it('should reject invalid completed value', () => {
      const invalidData = {
        completed: 'not-a-boolean'
      }
      
      const result = updateTodoSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Expected boolean')
      }
    })
  })
})
