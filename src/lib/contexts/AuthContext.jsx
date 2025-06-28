import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, setAuthToken, getAuthToken, clearAuthToken } from '@/lib/api'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      // In a real app, you might want to validate the token with the backend
      // For now, we'll assume the token is valid if it exists
      const userData = localStorage.getItem('userData')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (credentials) => {
    try {
      const response = await authAPI.signIn(credentials)
      setAuthToken(response.token)
      setUser({
        id: response.id,
        name: response.name,
        email: response.email,
        avatarUrl: response.avatarUrl,
        stylePreferences: response.stylePreferences,
      })
      localStorage.setItem('userData', JSON.stringify({
        id: response.id,
        name: response.name,
        email: response.email,
        avatarUrl: response.avatarUrl,
        stylePreferences: response.stylePreferences,
      }))
      return response
    } catch (error) {
      throw new Error('Invalid credentials')
    }
  }

  const signUp = async (userData) => {
    try {
      const response = await authAPI.signUp(userData)
      setAuthToken(response.token)
      setUser({
        id: response.id,
        name: response.name,
        email: response.email,
        avatarUrl: response.avatarUrl,
        stylePreferences: response.stylePreferences,
      })
      localStorage.setItem('userData', JSON.stringify({
        id: response.id,
        name: response.name,
        email: response.email,
        avatarUrl: response.avatarUrl,
        stylePreferences: response.stylePreferences,
      }))
      return response
    } catch (error) {
      throw new Error('Registration failed')
    }
  }

  const signOut = () => {
    clearAuthToken()
    localStorage.removeItem('userData')
    setUser(null)
  }

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
    localStorage.setItem('userData', JSON.stringify({ ...user, ...userData }))
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUser,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}