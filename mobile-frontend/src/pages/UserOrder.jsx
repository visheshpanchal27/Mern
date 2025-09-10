import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaBox, FaTruck, FaCheckCircle, FaArrowLeft, FaSearch, FaFilter, FaEye } from 'react-icons/fa'

const UserOrder = () => {
  const navigate = useNavigate()
  const { userInfo } = useSelector(state => state.auth)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedOrders, setExpandedOrders] = useState({})

  useEffect(() => {
    if (userInfo) {
      fetchOrders()
    }
  }, [userInfo])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/mine`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mobileToken')}`,
          'x-client-type': 'mobile'
        }
      })
      
      if (response.ok) {
        const realOrders = await response.json()
        // Sort orders by creation date, latest first
        const sortedOrders = realOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setOrders(sortedOrders)
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderItems.some(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || order._id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'delivered' && order.isDelivered) ||
      (statusFilter === 'processing' && !order.isDelivered)
    
    return matchesSearch && matchesStatus
  })

  const toggleExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }))
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
      <div className="safe-area-top p-4 text-center">
        <p className="mb-4">Please login to view orders</p>
        <button onClick={() => navigate('/login')} className="btn-primary">
          Login
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="safe-area-top p-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2">Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="safe-area-top bg-dark min-h-screen">
      <div className="flex items-center p-4 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 mr-3">
          <FaArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-xl font-bold text-white">My Orders</h1>
      </div>

      {/* Search and Filter */}
      <div className="p-4 space-y-3">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm ${
              statusFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('processing')}
            className={`px-4 py-2 rounded-lg text-sm ${
              statusFilter === 'processing' ? 'bg-yellow-500 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            Processing
          </button>
          <button
            onClick={() => setStatusFilter('delivered')}
            className={`px-4 py-2 rounded-lg text-sm ${
              statusFilter === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            Delivered
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="p-4 text-center py-20">
          <FaBox className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">
            {searchTerm ? 'No orders match your search' : 'No orders yet'}
          </p>
          <button onClick={() => navigate('/shop')} className="btn-primary">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {filteredOrders.map(order => (
            <div key={order._id} className="bg-gray-800 rounded-xl overflow-hidden">
              {/* Order Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-white font-semibold">Order #{order._id}</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order)}
                    <span className="text-sm">{getStatusText(order)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-white font-bold">${order.totalPrice.toFixed(2)}</p>
                  <button
                    onClick={() => toggleExpand(order._id)}
                    className="text-primary text-sm flex items-center gap-1"
                  >
                    <FaEye />
                    {expandedOrders[order._id] ? 'Hide' : 'View'} Items
                  </button>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex -space-x-2">
                    {order.orderItems.slice(0, 3).map((item, index) => (
                      <img
                        key={index}
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-full border-2 border-gray-700"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/48?text=No+Image'
                        }}
                      />
                    ))}
                    {order.orderItems.length > 3 && (
                      <div className="w-12 h-12 bg-gray-700 rounded-full border-2 border-gray-700 flex items-center justify-center text-xs text-white">
                        +{order.orderItems.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-gray-400 text-sm">
                    {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Expanded Items */}
                {expandedOrders[order._id] && (
                  <div className="space-y-3 mt-4 pt-4 border-t border-gray-700">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/64?text=No+Image'
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{item.name}</p>
                          <p className="text-gray-400 text-xs">Qty: {item.qty}</p>
                          <p className="text-gray-400 text-xs">${item.price.toFixed(2)} each</p>
                        </div>
                        <p className="text-white font-semibold">
                          ${(item.qty * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Order Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/order/${order._id}`)}
                    className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-medium"
                  >
                    View Details
                  </button>
                  {!order.isDelivered && (
                    <button className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm">
                      Track Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserOrder