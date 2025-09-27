import { Context, Next } from 'hono'
import { verifyJWT, extractTokenFromHeader } from '../lib/auth'

// JWT authentication middleware
export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization')
    const token = extractTokenFromHeader(authHeader)
    const jwtSecret = (c.env as any).JWT_SECRET
    
    if (!jwtSecret) {
      return c.json({
        status: 'error',
        message: 'JWT secret not configured'
      }, 500)
    }
    
    const decoded = await verifyJWT(token, jwtSecret)
    
    if (decoded.type !== 'access') {
      return c.json({
        status: 'error',
        message: 'Invalid token type'
      }, 401)
    }
    
    // Add user ID to context for use in route handlers
    c.set('userId', decoded.userId)
    
    await next()
  } catch (error) {
    return c.json({
      status: 'error',
      message: 'Authentication failed',
      error: error instanceof Error ? error.message : 'Invalid token'
    }, 401)
  }
}

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuthMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization')
    
    if (authHeader) {
      const token = extractTokenFromHeader(authHeader)
      const jwtSecret = (c.env as any).JWT_SECRET
      
      if (jwtSecret) {
        const decoded = await verifyJWT(token, jwtSecret)
        
        if (decoded.type === 'access') {
          c.set('userId', decoded.userId)
        }
      }
    }
    
    await next()
  } catch (error) {
    // Continue without authentication if token is invalid
    await next()
  }
}
