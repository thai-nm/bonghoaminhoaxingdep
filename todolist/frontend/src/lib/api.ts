// API client for Todo Garden backend communication

import { LoginCredentials, RegisterCredentials, AuthResponse, User, ApiError } from '@/types/auth'
import { 
  TodosResponse, 
  TodoResponse, 
  DeleteTodoResponse, 
  ResetTodosResponse,
  CreateTodoRequest,
  UpdateTodoRequest,
  BackendTodo
} from '@/types/todo'

// Backend API base URL - update this to match your backend deployment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:49465'

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    // Add authorization header if token exists
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      // Handle non-JSON responses (like health check)
      const contentType = response.headers.get('content-type')
      let data: any

      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        const error: ApiError = {
          message: data.error || data.message || 'An error occurred',
          status: response.status,
          details: data
        }
        throw error
      }

      return data
    } catch (error) {
      if (error instanceof Error && error.name === 'TypeError') {
        // Network error
        throw {
          message: 'Network error. Please check your connection.',
          status: 0,
          details: error.message
        } as ApiError
      }
      throw error
    }
  }

  // Health check
  async healthCheck(): Promise<string> {
    return this.request<string>('/health')
  }

  // Authentication endpoints
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    // Transform backend response to frontend format
    const authResponse: AuthResponse = {
      user: response.data.user,
      token: response.data.tokens.access_token,
      refresh_token: response.data.tokens.refresh_token
    }
    
    // Set token after successful registration
    this.setToken(authResponse.token)
    return authResponse
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    // Transform backend response to frontend format
    const authResponse: AuthResponse = {
      user: response.data.user,
      token: response.data.tokens.access_token,
      refresh_token: response.data.tokens.refresh_token
    }
    
    // Set token after successful login
    this.setToken(authResponse.token)
    return authResponse
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem('refresh_token') 
      : null

    if (!refreshToken) {
      throw {
        message: 'No refresh token available',
        status: 401
      } as ApiError
    }

    const response = await this.request<any>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: refreshToken }),
    })
    
    // Transform backend response to frontend format
    const authResponse: AuthResponse = {
      user: response.data.user,
      token: response.data.tokens.access_token,
      refresh_token: response.data.tokens.refresh_token
    }
    
    // Update tokens
    this.setToken(authResponse.token)
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', authResponse.refresh_token)
    }
    
    return authResponse
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/user/profile')
  }

  // Logout (clear tokens)
  logout() {
    this.setToken(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('refresh_token')
    }
  }

  // Todo endpoints
  async getTodos(): Promise<TodosResponse> {
    return this.request<TodosResponse>('/todos')
  }

  async createTodo(text: string): Promise<TodoResponse> {
    const request: CreateTodoRequest = { text }
    return this.request<TodoResponse>('/todos', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async updateTodo(id: string, updates: UpdateTodoRequest): Promise<TodoResponse> {
    return this.request<TodoResponse>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteTodo(id: string): Promise<DeleteTodoResponse> {
    return this.request<DeleteTodoResponse>(`/todos/${id}`, {
      method: 'DELETE',
    })
  }

  async resetTodos(): Promise<ResetTodosResponse> {
    return this.request<ResetTodosResponse>('/todos/reset', {
      method: 'DELETE',
    })
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient(API_BASE_URL)

// Export the class for testing purposes
export { ApiClient }
