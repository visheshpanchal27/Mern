import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useGetCartQuery, useClearCartMutation, useCreateOrderMutation } from '../api/apiSlice'
import { FaBolt, FaCheck, FaCreditCard, FaShieldAlt, FaTruck, FaEdit, FaArrowLeft } from 'react-icons/fa'

const ExpressCheckout = () => {
  const navigate = useNavigate()
  const { userInfo } = useSelector(state => state.auth)
  
  const { data: cart, isLoading: cartLoading } = useGetCartQuery()
  const [createOrder, { isLoading: orderLoading }] = useCreateOrderMutation()
  const [clearCart] = useClearCartMutation()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderStep, setOrderStep] = useState('review')
  
  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/express-checkout')
    }
  }, [userInfo, navigate])
  
  const cartItems = cart?.items || []
  
  const savedAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}')
  const savedPaymentMethod = localStorage.getItem('paymentMethod') || 'PayPal'
  
  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((acc, item) => 
      acc + item.qty * (item.product?.price || 0), 0
    )
    const shipping = subtotal > 100 ? 0 : 10
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax
    
    return {
      subtotal: Number(subtotal.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2))
    }
  }, [cartItems])

  const handleExpressOrder = async () => {
    if (!savedAddress.address || !savedAddress.city) {
      toast.error('Please set up your shipping address first')
      navigate('/shipping')
      return
    }
    
    setIsProcessing(true)
    setOrderStep('processing')
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const orderData = {
        orderItems: cartItems.map(item => ({
          _id: item.product._id,
          qty: item.qty,
          price: item.product.price,
          name: item.product.name,
          image: item.product.image,
        })),
        shippingAddress: savedAddress,
        paymentMethod: savedPaymentMethod,
        itemsPrice: totals.subtotal,
        shippingPrice: totals.shipping,
        taxPrice: totals.tax,
        totalPrice: totals.total,
      }
      
      const result = await createOrder(orderData).unwrap()
      
      await clearCart().unwrap()
      
      setOrderStep('success')
      
      setTimeout(() => {
        navigate(`/order-summary/${result.trackingId}`)
      }, 3000)
      
    } catch (error) {
      toast.error(error?.data?.message || 'Order failed')
      setOrderStep('review')
    } finally {
      setIsProcessing(false)
    }
  }

  if (cartLoading) return <div className="p-4 text-center">Loading...</div>
  
  if (cartItems.length === 0) {
    return (
      <div className="safe-area-top p-4 text-center">
        <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/shop')} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="safe-area-top bg-dark min-h-screen">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 mr-3">
          <FaArrowLeft className="text-white" size={20} />
        </button>
        <div className="flex items-center">
          <FaBolt className="text-orange-500 mr-2" />
          <h1 className="text-xl font-bold text-white">Express Checkout</h1>
        </div>
      </div>

      {orderStep === 'review' && (
        <div className="p-4 space-y-4">
          {/* Order Items */}
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3">Order Summary</h3>
            {cartItems.map(item => (
              <div key={item.product._id} className="flex items-center gap-3 mb-3">
                <img
                  src={item.product.image?.startsWith('http') 
                    ? item.product.image 
                    : `${import.meta.env.VITE_API_URL}${item.product.image}`
                  }
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{item.product.name}</p>
                  <p className="text-gray-400 text-xs">Qty: {item.qty}</p>
                </div>
                <p className="text-white font-semibold">
                  ${(item.qty * item.product.price).toFixed(2)}
                </p>
              </div>
            ))}
            
            <div className="border-t border-gray-600 pt-3 mt-3 space-y-2">
              <div className="flex justify-between text-gray-300 text-sm">
                <span>Subtotal:</span>
                <span>${totals.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-300 text-sm">
                <span>Shipping:</span>
                <span>{totals.shipping === 0 ? 'FREE' : `$${totals.shipping}`}</span>
              </div>
              <div className="flex justify-between text-gray-300 text-sm">
                <span>Tax:</span>
                <span>${totals.tax}</span>
              </div>
              <div className="flex justify-between text-white font-bold">
                <span>Total:</span>
                <span>${totals.total}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <FaTruck className="text-blue-400" />
                Shipping
              </h3>
              <button
                onClick={() => navigate('/shipping')}
                className="text-primary text-sm flex items-center gap-1"
              >
                <FaEdit /> Edit
              </button>
            </div>
            
            {savedAddress.address ? (
              <div className="text-gray-300 text-sm">
                <p>{savedAddress.address}</p>
                <p>{savedAddress.city}, {savedAddress.postalCode}</p>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-gray-400 text-sm mb-2">No address set</p>
                <button
                  onClick={() => navigate('/shipping')}
                  className="btn-primary px-4 py-2 text-sm"
                >
                  Add Address
                </button>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
              <FaCreditCard className="text-green-400" />
              Payment: {savedPaymentMethod}
            </h3>
          </div>

          {/* Security */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaShieldAlt className="text-green-400" />
              <span className="text-white font-semibold text-sm">Secure Checkout</span>
            </div>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <FaCheck className="text-green-400" />
                <span>SSL encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-green-400" />
                <span>Secure payment</span>
              </div>
            </div>
          </div>

          {/* Express Order Button */}
          <button
            onClick={handleExpressOrder}
            disabled={!savedAddress.address || isProcessing}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FaBolt />
            Complete Order - ${totals.total}
          </button>
        </div>
      )}
      
      {orderStep === 'processing' && (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mb-4"></div>
          <h2 className="text-xl font-bold text-white mb-2">Processing Order</h2>
          <p className="text-gray-400 text-sm">Please wait...</p>
        </div>
      )}
      
      {orderStep === 'success' && (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <FaCheck className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Order Successful!</h2>
          <p className="text-gray-400 text-sm">Redirecting...</p>
        </div>
      )}
    </div>
  )
}

export default ExpressCheckout