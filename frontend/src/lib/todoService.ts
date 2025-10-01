// Todo service layer for Todo Garden
// Handles data transformation, API calls, and business logic

import { apiClient } from './api'
import { 
  Todo, 
  BackendTodo, 
  DailyRecord, 
  TodoLoadingState, 
  TodoError,
  TodoOperation 
} from '@/types/todo'
import { ApiError } from '@/types/auth'

// Data transformation utilities
export const transformBackendTodoToFrontend = (backendTodo: BackendTodo): Todo => {
  return {
    id: backendTodo.id,
    text: backendTodo.text,
    completed: backendTodo.completed,
    createdAt: new Date(backendTodo.created_at),
    completedAt: backendTodo.completed_at ? new Date(backendTodo.completed_at) : undefined
  }
}

export const transformBackendTodosToFrontend = (backendTodos: BackendTodo[]): Todo[] => {
  return backendTodos.map(transformBackendTodoToFrontend)
}

// Error transformation utility
export const transformApiErrorToTodoError = (
  error: ApiError, 
  operation: TodoOperation, 
  todoId?: string
): TodoError => {
  return {
    message: error.message || 'An unexpected error occurred',
    operation,
    todoId
  }
}

// Todo service class
export class TodoService {
  // Fetch today's todos
  async fetchTodos(): Promise<{ todos: Todo[], dailyRecord: DailyRecord }> {
    try {
      const response = await apiClient.getTodos()
      const todos = transformBackendTodosToFrontend(response.data.todos)
      return {
        todos,
        dailyRecord: response.data.dailyRecord
      }
    } catch (error) {
      const apiError = error as ApiError
      throw transformApiErrorToTodoError(apiError, 'fetch')
    }
  }

  // Create a new todo
  async createTodo(text: string): Promise<Todo> {
    try {
      const response = await apiClient.createTodo(text)
      return transformBackendTodoToFrontend(response.data)
    } catch (error) {
      const apiError = error as ApiError
      throw transformApiErrorToTodoError(apiError, 'create')
    }
  }

  // Update todo text
  async updateTodoText(id: string, text: string): Promise<Todo> {
    try {
      const response = await apiClient.updateTodo(id, { text })
      return transformBackendTodoToFrontend(response.data)
    } catch (error) {
      const apiError = error as ApiError
      throw transformApiErrorToTodoError(apiError, 'update', id)
    }
  }

  // Toggle todo completion status
  async toggleTodoCompletion(id: string, completed: boolean): Promise<Todo> {
    try {
      const response = await apiClient.updateTodo(id, { completed })
      return transformBackendTodoToFrontend(response.data)
    } catch (error) {
      const apiError = error as ApiError
      throw transformApiErrorToTodoError(apiError, 'update', id)
    }
  }

  // Delete a todo
  async deleteTodo(id: string): Promise<void> {
    try {
      await apiClient.deleteTodo(id)
    } catch (error) {
      const apiError = error as ApiError
      throw transformApiErrorToTodoError(apiError, 'delete', id)
    }
  }

  // Reset all todos (mark as incomplete)
  async resetTodos(): Promise<void> {
    try {
      await apiClient.resetTodos()
    } catch (error) {
      const apiError = error as ApiError
      throw transformApiErrorToTodoError(apiError, 'reset')
    }
  }
}

// Create and export singleton instance
export const todoService = new TodoService()

// Loading state management utilities
export const createInitialLoadingState = (): TodoLoadingState => ({
  isLoading: false,
  isCreating: false,
  isUpdating: null,
  isDeleting: null,
  isResetting: false
})

export const setLoadingState = (
  currentState: TodoLoadingState,
  operation: TodoOperation,
  isLoading: boolean,
  todoId?: string
): TodoLoadingState => {
  switch (operation) {
    case 'fetch':
      return { ...currentState, isLoading }
    case 'create':
      return { ...currentState, isCreating: isLoading }
    case 'update':
      return { ...currentState, isUpdating: isLoading ? (todoId || null) : null }
    case 'delete':
      return { ...currentState, isDeleting: isLoading ? (todoId || null) : null }
    case 'reset':
      return { ...currentState, isResetting: isLoading }
    default:
      return currentState
  }
}

// Error message utilities
export const getErrorMessage = (error: TodoError): string => {
  switch (error.operation) {
    case 'fetch':
      return 'Failed to load todos. Please try refreshing the page.'
    case 'create':
      return 'Failed to create todo. Please try again.'
    case 'update':
      return 'Failed to update todo. Please try again.'
    case 'delete':
      return 'Failed to delete todo. Please try again.'
    case 'reset':
      return 'Failed to reset todos. Please try again.'
    default:
      return error.message || 'An unexpected error occurred.'
  }
}

// Retry utilities
export const shouldRetry = (error: TodoError): boolean => {
  // Retry on network errors or server errors, but not on client errors
  return error.message.includes('Network error') || 
         error.message.includes('Internal server error')
}

export const getRetryDelay = (attemptNumber: number): number => {
  // Exponential backoff: 1s, 2s, 4s, 8s, max 10s
  return Math.min(1000 * Math.pow(2, attemptNumber - 1), 10000)
}
