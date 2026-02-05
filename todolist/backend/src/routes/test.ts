import { Hono } from 'hono'
import { createSupabaseClient } from '../lib/supabase'

const testRoutes = new Hono()

// Test database connection and schema
testRoutes.get('/db-test', async (c) => {
  try {
    const supabase = createSupabaseClient(c.env)
    
    // Test each table by trying a simple query (should return empty results but no errors)
    const tests = []
    
    // Test users table
    const { error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1)
    
    tests.push({
      table: 'users',
      accessible: !usersError,
      error: usersError?.message || null
    })
    
    // Test daily_records table
    const { error: dailyError } = await supabase
      .from('daily_records')
      .select('id')
      .limit(1)
    
    tests.push({
      table: 'daily_records',
      accessible: !dailyError,
      error: dailyError?.message || null
    })
    
    // Test todos table
    const { error: todosError } = await supabase
      .from('todos')
      .select('id')
      .limit(1)
    
    tests.push({
      table: 'todos',
      accessible: !todosError,
      error: todosError?.message || null
    })
    
    // Test achievement_stats table
    const { error: statsError } = await supabase
      .from('achievement_stats')
      .select('id')
      .limit(1)
    
    tests.push({
      table: 'achievement_stats',
      accessible: !statsError,
      error: statsError?.message || null
    })
    
    const allTablesAccessible = tests.every(test => test.accessible)
    
    return c.json({
      status: allTablesAccessible ? 'success' : 'partial',
      message: allTablesAccessible 
        ? 'All database tables are accessible' 
        : 'Some database tables have issues',
      timestamp: new Date().toISOString(),
      table_tests: tests,
      summary: {
        total_tables: tests.length,
        accessible_tables: tests.filter(t => t.accessible).length,
        failed_tables: tests.filter(t => !t.accessible).length
      }
    })
    
  } catch (err) {
    return c.json({
      status: 'error',
      message: 'Database test failed',
      error: err instanceof Error ? err.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, 500)
  }
})

export { testRoutes }
