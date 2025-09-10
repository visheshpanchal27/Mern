import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaBox, FaTruck, FaCheckCircle, FaCreditCard, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa'

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mobileToken')}`,
          'x-client-type': 'mobile'
        }
      })
      
      if (response.ok) {
        const realOrder = await response.json()
        setOrder(realOrder)
        console.log('Order details loaded successfully')
      } else {
        throw new Error('Failed to fetch order')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  const handlePayNow = async () => {
    try {
      if (order.paymentMethod === 'PayPal') {
        // Create PayPal payment
        const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${order._id}/paypal/create`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('mobileToken')}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const { paymentId } = await response.json()
          // Redirect to PayPal for payment
          window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${paymentId}`
        }
      } else {
        // Handle other payment methods
        alert('Payment method not supported yet')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    }
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

  return (
    <div className="safe-area-top bg-dark min-h-screen">
      <div className="flex items-center p-4 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 mr-3">
          <FaArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-xl font-bold text-white">Order Details</h1>
      </div>
      
      <div className="p-4">
        {/* Order Header */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <h2 className="text-white font-bold text-lg mb-2">Order #{order._id}</h2>
          <p className="text-gray-400 text-sm">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Order Items */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <h3 className="text-white font-bold mb-3 flex items-center">
            <FaBox className="mr-2" />
            Items Ordered
          </h3>
          {order.orderItems.map(item => (
            <div key={item._id} className="flex items-center space-x-3 mb-3 last:mb-0">
              <img 
                src={item.image?.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL}${item.image}`}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/64?text=No+Image'
                }}
              />
              <div className="flex-1">
                <p className="text-white font-medium">{item.name}</p>
                <p className="text-sm text-gray-400">Quantity: {item.qty}</p>
                <p className="text-sm text-primary">${item.price} each</p>
              </div>
              <p className="text-white font-bold">${(item.price * item.qty).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Shipping Address */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <h3 className="text-white font-bold mb-3 flex items-center">
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
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <h3 className="text-white font-bold mb-3 flex items-center">
            <FaCreditCard className="mr-2" />
            Payment Information
          </h3>
          <div className="text-sm">
            <p className="text-gray-300 mb-2">Method: {order.paymentMethod}</p>
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
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <h3 className="text-white font-bold mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Items:</span>
              <span>${order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Shipping:</span>
              <span>${order.shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Tax:</span>
              <span>${order.taxPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-700 pt-2 text-white">
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
          
          {!order.isPaid && !order.paymentMethod?.toLowerCase().includes('cash') && !order.paymentMethod?.toLowerCase().includes('cod') && (
            <button className="w-full btn-primary">
              Pay Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Order