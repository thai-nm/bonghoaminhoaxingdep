// Todo types for Todo Garden - Frontend/Backend integration

// Backend todo structure (matches database schema)
export interface BackendTodo {
  id: string // UUID
  user_id: string
  daily_record_id: string
  text: string
  completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

// Frontend todo structure (simplified for UI components)
export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  completedAt?: Date
}

// Daily record structure from backend
export interface DailyRecord {
  id: string
  user_id: string
  date: string // YYYY-MM-DD format
  total_tasks: number
  completed_tasks: number
  completion_percentage: number
  created_at: string
  updated_at: string
}

// API request types
export interface CreateTodoRequest {
  text: string
}

export interface UpdateTodoRequest {
  text?: string
  completed?: boolean
}

// API response types
export interface TodosResponse {
  success: boolean
  data: {
    dailyRecord: DailyRecord
    todos: BackendTodo[]
  }
}

export interface TodoResponse {
  success: boolean
  data: BackendTodo
}

export interface DeleteTodoResponse {
  success: boolean
  message: string
}

export interface ResetTodosResponse {
  success: boolean
  message: string
}

// Loading and error state types
export interface TodoLoadingState {
  isLoading: boolean
  isCreating: boolean
  isUpdating: string | null // todo ID being updated
  isDeleting: string | null // todo ID being deleted
  isResetting: boolean
}

export interface TodoError {
  message: string
  operation: 'fetch' | 'create' | 'update' | 'delete' | 'reset'
  todoId?: string
}

// Utility type for todo operations
export type TodoOperation = 'create' | 'update' | 'delete' | 'reset' | 'fetch'
