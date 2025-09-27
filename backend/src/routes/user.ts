import { Hono } from 'hono'
import { createSupabaseClient } from '../lib/supabase'
import { authMiddleware } from '../middleware/auth'

const userRoutes = new Hono()

// Get current user profile (protected route)
userRoutes.get('/me', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId') as string
    const supabase = createSupabaseClient(c.env)
    
    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, email, created_at')
      .eq('id', userId)
      .single()
    
    if (userError || !user) {
      return c.json({
        status: 'error',
        message: 'User not found'
      }, 404)
    }
    
    // Get achievement stats
    const { data: stats, error: statsError } = await supabase
      .from('achievement_stats')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    return c.json({
      status: 'success',
      data: {
        user,
        achievement_stats: stats || null,
        stats_error: statsError ? statsError.message : null
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

export { userRoutes }
