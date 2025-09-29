'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, AuthContextType, LoginCredentials, RegisterCredentials, ApiError } from '@/types/auth'
import { apiClient } from '@/lib/api'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user && !!token

  // Initialize authentication state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a stored token
        const storedToken = localStorage.getItem('auth_token')
        if (storedToken) {
          setToken(storedToken)
          apiClient.setToken(storedToken)
          
          // Try to get current user with the stored token
          const currentUser = await apiClient.getCurrentUser()
          setUser(currentUser)
        }
      } catch (error) {
        // Token might be expired, try to refresh
        try {
          await refreshToken()
        } catch (refreshError) {
          // Refresh failed, clear auth state
          logout()
        }
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await apiClient.login(credentials)
      
      console.log('Login response:', response) // Debug log
      
      // Update state with response data
      setUser(response.user)
      setToken(response.token)
      
      // Store refresh token
      if (typeof window !== 'undefined') {
        localStorage.setItem('refresh_token', response.refresh_token)
      }
      
      console.log('Auth state updated:', { user: response.user, token: response.token }) // Debug log
    } catch (error) {
      console.error('Login error:', error) // Debug log
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await apiClient.register(credentials)
      
      setUser(response.user)
      setToken(response.token)
      
      // Store refresh token
      localStorage.setItem('refresh_token', response.refresh_token)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const refreshToken = async (): Promise<void> => {
    try {
      const response = await apiClient.refreshToken()
      
      setUser(response.user)
      setToken(response.token)
      
      // Update refresh token
      localStorage.setItem('refresh_token', response.refresh_token)
    } catch (error) {
      // If refresh fails, logout user
      logout()
      throw error
    }
  }

  const logout = (): void => {
    setUser(null)
    setToken(null)
    apiClient.logout()
    
    // Clear all auth-related data from localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshToken,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
