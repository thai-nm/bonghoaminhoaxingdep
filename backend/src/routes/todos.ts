import { Hono } from 'hono'
import { createSupabaseClient } from '../lib/supabase'
import { authMiddleware } from '../middleware/auth'
import { createTodoSchema, updateTodoSchema } from '../lib/validation'
import { z } from 'zod'

export const todoRoutes = new Hono()

// Apply auth middleware to all todo routes
todoRoutes.use('*', authMiddleware)

// Helper function to get or create today's daily record
async function getOrCreateDailyRecord(supabase: any, userId: string, date: string) {
  // First try to get existing daily record
  const { data: existingRecord, error: fetchError } = await supabase
    .from('daily_records')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single()

  if (existingRecord && !fetchError) {
    return { data: existingRecord, error: null }
  }

  // If no record exists, create one
  const { data: newRecord, error: createError } = await supabase
    .from('daily_records')
    .insert({
      user_id: userId,
      date: date,
      total_tasks: 0,
      completed_tasks: 0,
      completion_percentage: 0.00
    })
    .select()
    .single()

  return { data: newRecord, error: createError }
}

// Helper function to update daily record stats
async function updateDailyRecordStats(supabase: any, dailyRecordId: string) {
  // Get all todos for this daily record
  const { data: todos, error: todosError } = await supabase
    .from('todos')
    .select('completed')
    .eq('daily_record_id', dailyRecordId)

  if (todosError) {
    return { error: todosError }
  }

  const totalTasks = todos.length
  const completedTasks = todos.filter((todo: any) => todo.completed).length
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  // Update the daily record
  const { error: updateError } = await supabase
    .from('daily_records')
    .update({
      total_tasks: totalTasks,
      completed_tasks: completedTasks,
      completion_percentage: completionPercentage
    })
    .eq('id', dailyRecordId)

  return { error: updateError }
}

// GET /todos - Get today's todos for authenticated user
todoRoutes.get('/', async (c) => {
  try {
    const supabase = createSupabaseClient(c.env)
    const userId = c.get('userId') as string
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format

    // Get or create today's daily record
    const { data: dailyRecord, error: recordError } = await getOrCreateDailyRecord(supabase, userId, today)

    if (recordError) {
      return c.json({ error: 'Failed to get daily record', details: recordError.message }, 500)
    }

    // Get todos for today
    const { data: todos, error: todosError } = await supabase
      .from('todos')
      .select('*')
      .eq('daily_record_id', dailyRecord.id)
      .order('created_at', { ascending: true })

    if (todosError) {
      return c.json({ error: 'Failed to fetch todos', details: todosError.message }, 500)
    }

    return c.json({
      success: true,
      data: {
        dailyRecord,
        todos: todos || []
      }
    })
  } catch (error) {
    return c.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// POST /todos - Create a new todo
todoRoutes.post('/', async (c) => {
  try {
    const supabase = createSupabaseClient(c.env)
    const userId = c.get('userId') as string
    const body = await c.req.json()

    // Validate input
    const validation = createTodoSchema.safeParse(body)
    if (!validation.success) {
      return c.json({
        error: 'Validation failed',
        details: validation.error.issues
      }, 400)
    }

    const { text } = validation.data
    const today = new Date().toISOString().split('T')[0]

    // Get or create today's daily record
    const { data: dailyRecord, error: recordError } = await getOrCreateDailyRecord(supabase, userId, today)

    if (recordError) {
      return c.json({ error: 'Failed to get daily record', details: recordError.message }, 500)
    }

    // Create the todo
    const { data: todo, error: todoError } = await supabase
      .from('todos')
      .insert({
        user_id: userId,
        daily_record_id: dailyRecord.id,
        text: text,
        completed: false
      })
      .select()
      .single()

    if (todoError) {
      return c.json({ error: 'Failed to create todo', details: todoError.message }, 500)
    }

    // Update daily record stats
    await updateDailyRecordStats(supabase, dailyRecord.id)

    return c.json({
      success: true,
      data: todo
    }, 201)
  } catch (error) {
    return c.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// PUT /todos/:id - Update a todo (text or completion status)
todoRoutes.put('/:id', async (c) => {
  try {
    const supabase = createSupabaseClient(c.env)
    const userId = c.get('userId') as string
    const todoId = c.req.param('id')
    const body = await c.req.json()

    // Validate input
    const validation = updateTodoSchema.safeParse(body)
    if (!validation.success) {
      return c.json({
        error: 'Validation failed',
        details: validation.error.issues
      }, 400)
    }

    // Validate UUID format
    const uuidSchema = z.string().uuid()
    const uuidValidation = uuidSchema.safeParse(todoId)
    if (!uuidValidation.success) {
      return c.json({ error: 'Invalid todo ID format' }, 400)
    }

    // Check if todo exists and belongs to user
    const { data: existingTodo, error: fetchError } = await supabase
      .from('todos')
      .select('*')
      .eq('id', todoId)
      .eq('user_id', userId)
      .single()

    if (fetchError || !existingTodo) {
      return c.json({ error: 'Todo not found or access denied' }, 404)
    }

    const updateData: any = {}

    if (validation.data.text !== undefined) {
      updateData.text = validation.data.text
    }

    if (validation.data.completed !== undefined) {
      updateData.completed = validation.data.completed
      // Set completion timestamp if marking as completed
      if (validation.data.completed) {
        updateData.completed_at = new Date().toISOString()
      } else {
        updateData.completed_at = null
      }
    }

    // Update the todo
    const { data: updatedTodo, error: updateError } = await supabase
      .from('todos')
      .update(updateData)
      .eq('id', todoId)
      .eq('user_id', userId)
      .select()
      .single()

    if (updateError) {
      return c.json({ error: 'Failed to update todo', details: updateError.message }, 500)
    }

    // Update daily record stats if completion status changed
    if (validation.data.completed !== undefined) {
      await updateDailyRecordStats(supabase, existingTodo.daily_record_id)
    }

    return c.json({
      success: true,
      data: updatedTodo
    })
  } catch (error) {
    return c.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// DELETE /todos/reset - Reset all todos for today (mark all as incomplete)
todoRoutes.delete('/reset', async (c) => {
  try {
    const supabase = createSupabaseClient(c.env)
    const userId = c.get('userId') as string
    const today = new Date().toISOString().split('T')[0]

    // Get today's daily record
    const { data: dailyRecord, error: recordError } = await supabase
      .from('daily_records')
      .select('id')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    if (recordError || !dailyRecord) {
      return c.json({ error: 'No todos found for today' }, 404)
    }

    // Reset all todos for today (mark as incomplete)
    const { error: resetError } = await supabase
      .from('todos')
      .update({
        completed: false,
        completed_at: null
      })
      .eq('daily_record_id', dailyRecord.id)

    if (resetError) {
      return c.json({ error: 'Failed to reset todos', details: resetError.message }, 500)
    }

    // Update daily record stats
    await updateDailyRecordStats(supabase, dailyRecord.id)

    return c.json({
      success: true,
      message: 'All todos reset successfully'
    })
  } catch (error) {
    return c.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// DELETE /todos/:id - Delete a todo
todoRoutes.delete('/:id', async (c) => {
  try {
    const supabase = createSupabaseClient(c.env)
    const userId = c.get('userId') as string
    const todoId = c.req.param('id')

    // Validate UUID format
    const uuidSchema = z.string().uuid()
    const uuidValidation = uuidSchema.safeParse(todoId)
    if (!uuidValidation.success) {
      return c.json({ error: 'Invalid todo ID format' }, 400)
    }

    // Check if todo exists and belongs to user
    const { data: existingTodo, error: fetchError } = await supabase
      .from('todos')
      .select('daily_record_id')
      .eq('id', todoId)
      .eq('user_id', userId)
      .single()

    if (fetchError || !existingTodo) {
      return c.json({ error: 'Todo not found or access denied' }, 404)
    }

    // Delete the todo
    const { error: deleteError } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId)
      .eq('user_id', userId)

    if (deleteError) {
      return c.json({ error: 'Failed to delete todo', details: deleteError.message }, 500)
    }

    // Update daily record stats
    await updateDailyRecordStats(supabase, existingTodo.daily_record_id)

    return c.json({
      success: true,
      message: 'Todo deleted successfully'
    })
  } catch (error) {
    return c.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})
