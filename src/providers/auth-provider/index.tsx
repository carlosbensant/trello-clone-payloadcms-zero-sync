'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/payload-types'

interface AuthContextType {
  token: string | null
  user: User | null
  login: ({ email, password }: { email: string; password: string }) => Promise<boolean>
  logout: () => Promise<void>
  register: ({ email, password }: { email: string; password: string }) => Promise<boolean>
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_BASE = '/api'

  // Check if user is already authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE}/users/me`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const userData = await response.json()
        console.log('userData', userData)

        // The me endpoint might not return token, so check if it exists
        if (userData.token) {
          setToken(userData.token)
        }
        setUser(userData.user)
      } else {
        setUser(null)
        setToken(null)
      }
    } catch (err) {
      console.error('Auth check failed:', err)
      setUser(null)
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }): Promise<boolean> => {
    try {
      setError(null)
      setLoading(true)

      const response = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()

        // PayloadCMS returns the token in the response
        if (data.token) {
          setToken(data.token)
        }
        setUser(data.user)
        return true
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Login failed')
        return false
      }
    } catch (err) {
      setError('Network error occurred')
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null)
      setLoading(true)

      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.doc)
        return true
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Registration failed')
        return false
      }
    } catch (err) {
      setError('Network error occurred')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await fetch(`${API_BASE}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
    }
  }

  const value: AuthContextType = {
    token,
    user,
    login,
    logout,
    register,
    loading,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
