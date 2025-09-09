import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaBox, FaTruck, FaCheckCircle } from 'react-icons/fa'

const UserOrder = () => {
  const { userInfo } = useSelector(state => state.auth)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userInfo) {
      fetchOrders()
    }
  }, [userInfo])

  const fetchOrders = async () => {
    try {
      console.log('Fetching user orders...')
      // Mock orders data - replace with actual API call
      const mockOrders = [
        {
          _id: '1',
          createdAt: '2024-01-15',
          totalPrice: 299.99,
          isPaid: true,
          isDelivered: false,
          orderItems: [
            { name: 'Product 1', image: '/api/placeholder/100/100', price: 149.99, qty: 1 },
            { name: 'Product 2', image: '/api/placeholder/100/100', price: 150.00, qty: 1 }
          ]
        }
      ]
      setOrders(mockOrders)
      console.log('Orders loaded successfully:', mockOrders.length)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (order) => {
    if (order.isDelivered) return <FaCheckCircle className="text-green-500" />
    if (order.isPaid) return <FaTruck className="text-blue-500" />
    return <FaBox className="text-yellow-500" />
  }

  const getStatusText = (order) => {
    if (order.isDelivered) return 'Delivered'
    if (order.isPaid) return 'Shipped'
    return 'Processing'
  }

  if (!userInfo) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">Please login to view orders</p>
        <Link to="/login" className="btn-primary">
          Login
        </Link>
      </div>
    )
  }

  if (loading) {
    return <div className="p-4 text-center">Loading orders...</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">No orders yet</p>
          <Link to="/shop" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="card">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-sm text-gray-400">Order #{order._id}</p>
                  <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(order)}
                  <span className="ml-2 text-sm">{getStatusText(order)}</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                    </div>
                    <p className="text-sm font-bold">${item.price}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                <p className="font-bold">Total: ${order.totalPrice}</p>
                <Link 
                  to={`/order/${order._id}`}
                  className="bg-primary text-white px-3 py-1 rounded text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserOrder