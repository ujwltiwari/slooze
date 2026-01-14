
'use client'
import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import api from '@/lib/api'

type User = { id: number; email: string; role: string; country: string }
type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
export const useAuth = () => useContext(AuthContext)!

export const AuthProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.get('/auth/me', {
          withCredentials: true,
        })
        setUser(data)
      } catch {
        setUser(null)
      }
    })()
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await api.post(
      '/auth/login',
      { email, password },
      { withCredentials: true }
    )
    setUser(data.user)
  }

  const logout = async () => {
    await axios.post('/auth/logout', {}, { withCredentials: true })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
