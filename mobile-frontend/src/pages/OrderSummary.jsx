import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaCheckCircle, FaTruck, FaBox, FaReceipt, FaDownload } from 'react-icons/fa'

const OrderSummary = () => {
  const { trackingId } = useParams()
  const navigate = useNavigate()
  const [orderSummary, setOrderSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (trackingId) {
      fetchOrderSummary()
    }
  }, [trackingId])

  const fetchOrderSummary = async () => {
    try {
      console.log('Fetching order summary for tracking ID:', trackingId)
      // Mock order summary data - replace with actual API call
      const mockSummary = {
        trackingId,
        orderId: 'ORD-2024-001',
        status: 'delivered',
        estimatedDelivery: '2024-01-20',
        actualDelivery: '2024-01-19',
        items: [
          {
            _id: '1',
            name: 'Wireless Headphones',
            image: '/api/placeholder/100/100',
            price: 149.99,
            qty: 1
          },
          {
            _id: '2',
            name: 'Phone Case',
            image: '/api/placeholder/100/100',
            price: 29.99,
            qty: 2
          }
        ],
        totalAmount: 209.97,
        shippingAddress: {
          name: 'John Doe',
          address: '123 Main St',
          city: 'New York',
          postalCode: '10001'
        },
        timeline: [
          { status: 'ordered', date: '2024-01-15', completed: true },
          { status: 'confirmed', date: '2024-01-15', completed: true },
          { status: 'shipped', date: '2024-01-16', completed: true },
          { status: 'delivered', date: '2024-01-19', completed: true }
        ]
      }
      setOrderSummary(mockSummary)
      console.log('Order summary loaded successfully')
    } catch (error) {
      console.error('Error fetching order summary:', error)
      setOrderSummary(null)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <FaCheckCircle className="text-green-500" />
      case 'shipped': return <FaTruck className="text-blue-500" />
      default: return <FaBox className="text-yellow-500" />
    }
  }

  const getStatusColor = (completed) => {
    return completed ? 'text-green-500' : 'text-gray-400'
  }

  if (loading) {
    return <div className="p-4 text-center">Loading order summary...</div>
  }

  if (!orderSummary) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">Order summary not found</p>
        <button
          onClick={() => navigate('/user-orders')}
          className="btn-primary"
        >
          View All Orders
        </button>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Success Header */}
      <div className="text-center mb-6">
        <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-green-500 mb-2">Order Delivered!</h1>
        <p className="text-gray-400">Tracking ID: {trackingId}</p>
      </div>

      {/* Order Status */}
      <div className="card mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Order Status</h3>
          {getStatusIcon(orderSummary.status)}
        </div>
        
        {/* Timeline */}
        <div className="space-y-3">
          {orderSummary.timeline.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${step.completed ? 'bg-green-500' : 'bg-gray-500'}`} />
              <div className="flex-1">
                <p className={`capitalize font-medium ${getStatusColor(step.completed)}`}>
                  {step.status}
                </p>
                <p className="text-xs text-gray-400">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Info */}
      <div className="card mb-4">
        <h3 className="font-bold mb-3">Delivery Information</h3>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Delivered to:</span>
            <span>{orderSummary.shippingAddress.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Address:</span>
            <span className="text-right">
              {orderSummary.shippingAddress.address}<br />
              {orderSummary.shippingAddress.city} {orderSummary.shippingAddress.postalCode}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Delivered on:</span>
            <span className="text-green-500">{orderSummary.actualDelivery}</span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card mb-4">
        <h3 className="font-bold mb-3">Items Delivered</h3>
        {orderSummary.items.map(item => (
          <div key={item._id} className="flex items-center space-x-3 mb-3 last:mb-0">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-xs text-gray-400">Qty: {item.qty}</p>
            </div>
            <p className="font-bold text-sm">${(item.price * item.qty).toFixed(2)}</p>
          </div>
        ))}
        
        <div className="border-t border-gray-700 pt-3 mt-3">
          <div className="flex justify-between font-bold">
            <span>Total Paid:</span>
            <span>${orderSummary.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button className="w-full btn-primary flex items-center justify-center mb-3">
          <FaDownload className="mr-2" />
          Download Invoice
        </button>
        
        <button className="w-full btn-primary flex items-center justify-center mb-3">
          <FaReceipt className="mr-2" />
          Leave Review
        </button>
        
        <button
          onClick={() => navigate('/shop')}
          className="w-full btn-primary mb-3"
        >
          Continue Shopping
        </button>
        
        <button
          onClick={() => navigate('/user-orders')}
          className="w-full btn-secondary"
        >
          View All Orders
        </button>
      </div>
    </div>
  )
}

export default OrderSummary