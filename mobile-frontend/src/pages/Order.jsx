import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaBox, FaTruck, FaCheckCircle, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa'

const Order = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { userInfo } = useSelector(state => state.auth)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userInfo && id) {
      fetchOrder()
    }
  }, [id, userInfo])

  const fetchOrder = async () => {
    try {
      console.log('Fetching order details for ID:', id)
      // Mock order data - replace with actual API call
      const mockOrder = {
        _id: id,
        user: userInfo._id,
        orderItems: [
          {
            _id: '1',
            name: 'Sample Product',
            image: '/api/placeholder/100/100',
            price: 99.99,
            qty: 2
          }
        ],
        shippingAddress: {
          address: '123 Main St',
          city: 'New York',
          postalCode: '10001',
          country: 'USA'
        },
        paymentMethod: 'PayPal',
        paymentResult: {
          id: 'PAY123',
          status: 'COMPLETED'
        },
        itemsPrice: 199.98,
        taxPrice: 20.00,
        shippingPrice: 0,
        totalPrice: 219.98,
        isPaid: true,
        paidAt: '2024-01-15T10:30:00Z',
        isDelivered: false,
        deliveredAt: null,
        createdAt: '2024-01-15T09:00:00Z'
      }
      setOrder(mockOrder)
      console.log('Order details loaded successfully')
    } catch (error) {
      console.error('Error fetching order:', error)
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  const getOrderStatus = () => {
    if (order.isDelivered) return { icon: FaCheckCircle, text: 'Delivered', color: 'text-green-500' }
    if (order.isPaid) return { icon: FaTruck, text: 'Shipped', color: 'text-blue-500' }
    return { icon: FaBox, text: 'Processing', color: 'text-yellow-500' }
  }

  if (!userInfo) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">Please login to view order</p>
        <button
          onClick={() => navigate('/login')}
          className="btn-primary"
        >
          Login
        </button>
      </div>
    )
  }

  if (loading) {
    return <div className="p-4 text-center">Loading order...</div>
  }

  if (!order) {
    return <div className="p-4 text-center">Order not found</div>
  }

  const status = getOrderStatus()
  const StatusIcon = status.icon

  return (
    <div className="p-4">
      {/* Order Header */}
      <div className="card mb-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold">Order #{order._id}</h1>
          <div className={`flex items-center ${status.color}`}>
            <StatusIcon className="mr-2" />
            <span className="text-sm font-medium">{status.text}</span>
          </div>
        </div>
        <p className="text-sm text-gray-400">
          Placed on {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Order Items */}
      <div className="card mb-4">
        <h3 className="font-bold mb-3 flex items-center">
          <FaBox className="mr-2" />
          Items Ordered
        </h3>
        {order.orderItems.map(item => (
          <div key={item._id} className="flex items-center space-x-3 mb-3 last:mb-0">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-400">Quantity: {item.qty}</p>
              <p className="text-sm text-pink-500">${item.price} each</p>
            </div>
            <p className="font-bold">${(item.price * item.qty).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Shipping Address */}
      <div className="card mb-4">
        <h3 className="font-bold mb-3 flex items-center">
          <FaMapMarkerAlt className="mr-2" />
          Shipping Address
        </h3>
        <div className="text-sm text-gray-300">
          <p>{order.shippingAddress.address}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
          <p>{order.shippingAddress.country}</p>
        </div>
      </div>

      {/* Payment Info */}
      <div className="card mb-4">
        <h3 className="font-bold mb-3 flex items-center">
          <FaCreditCard className="mr-2" />
          Payment Information
        </h3>
        <div className="text-sm">
          <p className="mb-2">Method: {order.paymentMethod}</p>
          {order.isPaid ? (
            <p className="text-green-500">
              ✓ Paid on {new Date(order.paidAt).toLocaleDateString()}
            </p>
          ) : (
            <p className="text-red-500">✗ Not Paid</p>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="card mb-4">
        <h3 className="font-bold mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Items:</span>
            <span>${order.itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>${order.shippingPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${order.taxPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-gray-700 pt-2">
            <span>Total:</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => navigate('/user-orders')}
          className="w-full btn-secondary"
        >
          Back to Orders
        </button>
        
        {!order.isPaid && (
          <button className="w-full btn-primary">
            Pay Now
          </button>
        )}
      </div>
    </div>
  )
}

export default Order