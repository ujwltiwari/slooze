import { useState, useEffect } from 'react'
import api from '@/lib/api'

export type User = {
  id: number
  name: string
  email: string
  role: 'ADMIN' | 'MANAGER' | 'MEMBER'
  country: 'INDIA' | 'AMERICA'
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  
  useEffect(() => {
    setLoading(true)
    api
      .get('/admin/users')
      .then((res) => {
        setUsers(res.data)
        setError(null)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load users')
      })
      .finally(() => setLoading(false))
  }, [])

  
  async function createUser(userData: {
    name: string
    email: string
    role: 'ADMIN' | 'MANAGER' | 'MEMBER'
    country: 'INDIA' | 'AMERICA'
  }) {
    try {
      const { data } = await api.post('/admin/users', userData)
      setUsers((prev) => [...prev, data])
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to create user')
      throw err
    }
  }

  return { users, loading, error, createUser }
}
