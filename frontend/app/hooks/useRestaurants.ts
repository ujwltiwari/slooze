import { useState, useEffect } from 'react'
import api from '@/lib/api'

type Restaurant = {
  id: number
  name: string
  address: string
  country: string
}

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api
      .get('/restaurants')
      .then((res) => setRestaurants(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { restaurants, loading, error }
}
