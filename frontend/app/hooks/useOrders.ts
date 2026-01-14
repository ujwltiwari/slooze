import { useState, useEffect } from 'react'
import api from '@/lib/api'

type OrderItem = { menuItemId: number; quantity: number }
type Order = {
  id: number
  restaurantId: number
  items: OrderItem[]
  status: string
  createdAt: string
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api
      .get('/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const placeOrder = async (restaurantId: number, items: OrderItem[]) => {
    const res = await api.post('/orders', { restaurantId, items })
    setOrders((prev) => [...prev, res.data])
  }

  const cancelOrder = async (orderId: number) => {
    await api.post(`/orders/${orderId}/cancel`)
    setOrders((prev) => prev.filter((order) => order.id !== orderId))
  }

  return { orders, loading, error, placeOrder, cancelOrder }
}
