import { Hono } from 'hono'
import { createSupabaseClient } from '../lib/supabase'
import { hashPassword, verifyPassword, generateJWT, generateRefreshToken, verifyJWT } from '../lib/auth'
import { registerSchema, loginSchema, refreshTokenSchema } from '../lib/validation'
import type { RegisterRequest, LoginRequest, RefreshTokenRequest } from '../lib/validation'

const authRoutes = new Hono()

// User registration endpoint
authRoutes.post('/register', async (c) => {
  try {
    const body = await c.req.json()
    
    // Validate input
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return c.json({
        status: 'error',
        message: 'Validation failed',
        errors: validationResult.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, 400)
    }
    
    const { username, email, password }: RegisterRequest = validationResult.data
    const supabase = createSupabaseClient(c.env)
    
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`)
      .single()
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      return c.json({
        status: 'error',
        message: 'Database error while checking existing user',
        error: checkError.message
      }, 500)
    }
    
    if (existingUser) {
      return c.json({
        status: 'error',
        message: 'User already exists with this email or username'
      }, 409)
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password)
    
    // Create user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        username,
        email,
        password_hash: hashedPassword
      })
      .select('id, username, email, created_at')
      .single()
    
    if (createError) {
      return c.json({
        status: 'error',
        message: 'Failed to create user',
        error: createError.message
      }, 500)
    }
    
    // Create initial achievement stats
    const { error: statsError } = await supabase
      .from('achievement_stats')
      .insert({
        user_id: newUser.id,
        current_streak: 0,
        longest_streak: 0,
        total_tasks_completed: 0,
        total_tasks_created: 0,
        days_active: 0,
        average_completion_rate: 0.00
      })
    
    if (statsError) {
      // Log error but don't fail registration
      console.error('Failed to create achievement stats:', statsError)
    }
    
    // Generate tokens
    const jwtSecret = (c.env as any).JWT_SECRET
    const accessToken = await generateJWT(newUser.id, jwtSecret)
    const refreshToken = await generateRefreshToken(newUser.id, jwtSecret)
    
    return c.json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          created_at: newUser.created_at
        },
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: 86400 // 24 hours in seconds
        }
      }
    }, 201)
    
  } catch (error) {
    return c.json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// User login endpoint
authRoutes.post('/login', async (c) => {
  try {
    const body = await c.req.json()
    
    // Validate input
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return c.json({
        status: 'error',
        message: 'Validation failed',
        errors: validationResult.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, 400)
    }
    
    const { email, password }: LoginRequest = validationResult.data
    const supabase = createSupabaseClient(c.env)
    
    // Find user by email
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id, username, email, password_hash, created_at')
      .eq('email', email)
      .single()
    
    if (findError || !user) {
      return c.json({
        status: 'error',
        message: 'Invalid email or password'
      }, 401)
    }
    
    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash)
    if (!isPasswordValid) {
      return c.json({
        status: 'error',
        message: 'Invalid email or password'
      }, 401)
    }
    
    // Generate tokens
    const jwtSecret = (c.env as any).JWT_SECRET
    const accessToken = await generateJWT(user.id, jwtSecret)
    const refreshToken = await generateRefreshToken(user.id, jwtSecret)
    
    return c.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at
        },
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: 86400 // 24 hours in seconds
        }
      }
    })
    
  } catch (error) {
    return c.json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Token refresh endpoint
authRoutes.post('/refresh', async (c) => {
  try {
    const body = await c.req.json()
    
    // Validate input
    const validationResult = refreshTokenSchema.safeParse(body)
    if (!validationResult.success) {
      return c.json({
        status: 'error',
        message: 'Validation failed',
        errors: validationResult.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, 400)
    }
    
    const { refreshToken }: RefreshTokenRequest = validationResult.data
    const jwtSecret = (c.env as any).JWT_SECRET
    
    // Verify refresh token
    let decoded
    try {
      decoded = await verifyJWT(refreshToken, jwtSecret)
    } catch (error) {
      return c.json({
        status: 'error',
        message: 'Invalid or expired refresh token'
      }, 401)
    }
    
    if (decoded.type !== 'refresh') {
      return c.json({
        status: 'error',
        message: 'Invalid token type'
      }, 401)
    }
    
    // Verify user still exists
    const supabase = createSupabaseClient(c.env)
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id, username, email, created_at')
      .eq('id', decoded.userId)
      .single()
    
    if (findError || !user) {
      return c.json({
        status: 'error',
        message: 'User not found'
      }, 401)
    }
    
    // Generate new tokens
    const newAccessToken = await generateJWT(user.id, jwtSecret)
    const newRefreshToken = await generateRefreshToken(user.id, jwtSecret)
    
    return c.json({
      status: 'success',
      message: 'Tokens refreshed successfully',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at
        },
        tokens: {
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
          expires_in: 86400 // 24 hours in seconds
        }
      }
    })
    
  } catch (error) {
    return c.json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

export { authRoutes }
