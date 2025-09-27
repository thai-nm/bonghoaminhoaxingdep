import { z } from 'zod'

// User registration validation schema
export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
})

// User login validation schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

// Token refresh validation schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
})

// Todo validation schemas
export const createTodoSchema = z.object({
  text: z.string()
    .min(1, 'Todo text is required')
    .max(500, 'Todo text must be less than 500 characters')
    .trim()
})

export const updateTodoSchema = z.object({
  text: z.string()
    .min(1, 'Todo text is required')
    .max(500, 'Todo text must be less than 500 characters')
    .trim()
    .optional(),
  completed: z.boolean().optional()
}).refine(data => data.text !== undefined || data.completed !== undefined, {
  message: 'At least one field (text or completed) must be provided'
})

// Types derived from schemas
export type RegisterRequest = z.infer<typeof registerSchema>
export type LoginRequest = z.infer<typeof loginSchema>
export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>
export type CreateTodoRequest = z.infer<typeof createTodoSchema>
export type UpdateTodoRequest = z.infer<typeof updateTodoSchema>
