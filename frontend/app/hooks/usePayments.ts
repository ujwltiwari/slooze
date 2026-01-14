import { useState, useEffect } from 'react'
import api from '@/lib/api'

type PaymentMethod = {
  id: number
  name: string
  details: string
}

export function usePaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api
      .get('/payment-methods')
      .then((res) => setMethods(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const addMethod = async (data: Partial<PaymentMethod>) => {
    const res = await api.post('/payment-methods', data)
    setMethods((prev) => [...prev, res.data])
  }

  const updateMethod = async (id: number, data: Partial<PaymentMethod>) => {
    const res = await api.patch(`/payment-methods/${id}`, data)
    setMethods((prev) => prev.map((m) => (m.id === id ? res.data : m)))
  }

  return { methods, loading, error, addMethod, updateMethod }
}
