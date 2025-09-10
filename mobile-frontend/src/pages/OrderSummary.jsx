import { useParams, useNavigate } from 'react-router-dom'
import { useGetOrderByTrackingIdQuery } from '../api/orderApiSlice'
import { FaCheckCircle, FaTruck, FaBox, FaReceipt, FaDownload, FaArrowLeft } from 'react-icons/fa'

const OrderSummary = () => {
  const { trackingId } = useParams()
  const navigate = useNavigate()
  
  const { data: orderSummary, isLoading: loading, error } = useGetOrderByTrackingIdQuery(trackingId, {
    skip: !trackingId
  })

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
    return (
      <div className="safe-area-top p-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2">Loading order summary...</p>
      </div>
    )
  }

  if (error) {
    console.error('Order fetch error:', error)
    return (
      <div className="safe-area-top bg-dark min-h-screen">
        <div className="flex items-center p-4 border-b border-gray-800">
          <button onClick={() => navigate(-1)} className="p-2 mr-3">
            <FaArrowLeft className="text-white" size={20} />
          </button>
          <h1 className="text-xl font-bold text-white">Order Not Found</h1>
        </div>
        <div className="p-4 text-center py-20">
          <p className="text-gray-400 mb-4">Unable to load order details</p>
          <button onClick={() => navigate('/user-orders')} className="btn-primary">
            View All Orders
          </button>
        </div>
      </div>
    )
  }

  if (!orderSummary) {
    return (
      <div className="safe-area-top bg-dark min-h-screen">
        <div className="flex items-center p-4 border-b border-gray-800">
          <button onClick={() => navigate(-1)} className="p-2 mr-3">
            <FaArrowLeft className="text-white" size={20} />
          </button>
          <h1 className="text-xl font-bold text-white">Order Summary</h1>
        </div>
        <div className="p-4 text-center py-20">
          <p className="text-gray-400 mb-4">Order not found</p>
          <button onClick={() => navigate('/user-orders')} className="btn-primary">
            View All Orders
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="safe-area-top bg-dark min-h-screen">
      <div className="flex items-center p-4 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 mr-3">
          <FaArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-xl font-bold text-white">Order Summary</h1>
      </div>
      
      <div className="p-4">
        {/* Success Header */}
        <div className="text-center mb-6">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-500 mb-2">
            {orderSummary.isDelivered ? 'Order Delivered!' : 'Order Confirmed!'}
          </h1>
          <p className="text-gray-400">Tracking ID: {orderSummary.trackingId}</p>
        </div>

        {/* Order Status */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold">Order Status</h3>
            {orderSummary.isDelivered ? (
              <FaCheckCircle className="text-green-500" />
            ) : orderSummary.isPaid ? (
              <FaTruck className="text-blue-500" />
            ) : (
              <FaBox className="text-yellow-500" />
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-3 bg-green-500" />
              <div className="flex-1">
                <p className="text-green-500 font-medium">Order Placed</p>
                <p className="text-xs text-gray-400">{new Date(orderSummary.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            {orderSummary.isDelivered && (
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-3 bg-green-500" />
                <div className="flex-1">
                  <p className="text-green-500 font-medium">Delivered</p>
                  <p className="text-xs text-gray-400">{orderSummary.deliveredAt ? new Date(orderSummary.deliveredAt).toLocaleDateString() : 'Recently'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <h3 className="text-white font-bold mb-3">Delivery Information</h3>
          <div className="text-sm space-y-2">
            {orderSummary.shippingAddress && (
              <div className="flex justify-between">
                <span className="text-gray-400">Address:</span>
                <span className="text-white text-right">
                  {orderSummary.shippingAddress.address}<br />
                  {orderSummary.shippingAddress.city}, {orderSummary.shippingAddress.postalCode}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Payment Method:</span>
              <span className="text-white">{orderSummary.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <h3 className="text-white font-bold mb-3">Order Items</h3>
          {orderSummary.orderItems && orderSummary.orderItems.length > 0 ? (
            orderSummary.orderItems.map(item => (
              <div key={item._id} className="flex items-center space-x-3 mb-3 last:mb-0">
                <img 
                  src={item.image?.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL}${item.image}`}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/64?text=No+Image'
                  }}
                />
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                </div>
                <p className="text-white font-bold text-sm">${(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400">No items found</p>
            </div>
          )}
          
          <div className="border-t border-gray-700 pt-3 mt-3">
            <div className="flex justify-between font-bold text-white">
              <span>Total Paid:</span>
              <span>${orderSummary.totalPrice?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full btn-primary flex items-center justify-center">
            <FaDownload className="mr-2" />
            Download Invoice
          </button>
          
          <button className="w-full btn-primary flex items-center justify-center">
            <FaReceipt className="mr-2" />
            Leave Review
          </button>
          
          <button
            onClick={() => navigate('/shop')}
            className="w-full btn-primary"
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
    </div>
  )
}

export default OrderSummary