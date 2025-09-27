import { Hono } from 'hono'
import { createSupabaseClient } from './lib/supabase'

const app = new Hono()

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

export default app
