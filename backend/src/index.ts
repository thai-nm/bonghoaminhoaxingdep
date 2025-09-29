import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createSupabaseClient } from './lib/supabase'
import { testRoutes } from './routes/test'
import { authRoutes } from './routes/auth'
import { userRoutes } from './routes/user'

const app = new Hono()

// Enable CORS for all origins
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// Health check endpoint with database test
app.get('/health', async (c) => {
  try {
    // Test database connection by creating client
    const supabase = createSupabaseClient(c.env)
    
    // Simple test - just check if we can create the client
    const isConnected = !!supabase
    
    return c.json({
      status: 'ok',
      message: 'Todo Garden API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: {
        connected: isConnected,
        client_created: true
      }
    })
  } catch (err) {
    return c.json({
      status: 'error',
      message: 'Todo Garden API is running but database connection failed',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: {
        connected: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }, 500)
  }
})

// Mount routes
app.route('/test', testRoutes)
app.route('/auth', authRoutes)
app.route('/user', userRoutes)

export default app
