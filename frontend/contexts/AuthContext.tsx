"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi, type User } from '@/lib/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  updateUser: (userData: Partial<User>) => Promise<{ success: boolean; message: string }>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth data on mount
    const initAuth = async () => {
      try {
        const storedUser = authApi.getStoredUser()
        const token = authApi.getToken()

        if (storedUser && token) {
          // Verify token is still valid by fetching current user profile
          try {
            const response = await authApi.getProfile()
            setUser(response.user)
          } catch (error) {
            // Token is invalid, clear stored data
            authApi.logout()
            setUser(null)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password })
      
      if (response.success) {
        setUser(response.user)
        authApi.storeAuthData(response.user, response.token)
        return { success: true, message: response.message }
      }
      
      return { success: false, message: response.message }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Login failed. Please try again.' 
      }
    }
  }

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const response = await authApi.register({ name, email, password, phone })
      
      if (response.success) {
        setUser(response.user)
        authApi.storeAuthData(response.user, response.token)
        return { success: true, message: response.message }
      }
      
      return { success: false, message: response.message }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.' 
      }
    }
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await authApi.updateProfile(userData)
      
      if (response.success) {
        setUser(response.user)
        // Update stored user data
        authApi.storeAuthData(response.user, authApi.getToken() || '')
        return { success: true, message: 'Profile updated successfully' }
      }
      
      return { success: false, message: 'Failed to update profile' }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Failed to update profile. Please try again.' 
      }
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
