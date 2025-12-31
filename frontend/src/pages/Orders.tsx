import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

interface Order {
  order_id: string
  status: string
  total_price: number
  created_at: string
  products?: Array<{
    productId: string
    quantity: number
    unitPrice: number
  }>
}

const Orders: React.FC = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/orders')
      
      if (response.data.Success) {
        setOrders(response.data.Object || [])
      }
    } catch (err: any) {
      setError('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please login to view your orders</h2>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-200 rounded-full h-24 w-24 mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-4xl">📦</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <a
              href="/products"
              className="inline-block px-6 py-3 border border-transparent rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.order_id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.order_id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        order.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        ${order.total_price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {order.products && (
                  <div className="px-6 py-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {order.products.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Product ID: {item.productId} x {item.quantity}
                          </span>
                          <span className="font-medium">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
