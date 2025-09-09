import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaBolt, FaShippingFast } from 'react-icons/fa'

const ExpressCheckout = () => {
  const navigate = useNavigate()
  const { cartItems } = useSelector(state => state.cart)
  const { userInfo } = useSelector(state => state.auth)
  const [loading, setLoading] = useState(false)

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)

  const handleExpressCheckout = async () => {
    if (!userInfo) {
      console.log('User not authenticated for express checkout')
      navigate('/login')
      return
    }

    setLoading(true)
    try {
      console.log('Starting express checkout...')
      // Express checkout with default settings
      const orderData = {
        orderItems: cartItems,
        paymentMethod: 'paypal',
        expressCheckout: true,
        totalPrice: totalPrice + 15 // Express shipping fee
      }
      console.log('Express checkout data:', orderData)

      // Replace with actual API call
      const response = await fetch('/api/orders/express', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        const order = await response.json()
        console.log('Express checkout successful:', order._id)
        navigate(`/order/${order._id}`)
      } else {
        console.error('Express checkout failed:', response.status)
      }
    } catch (error) {
      console.error('Express checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">Your cart is empty</p>
        <button
          onClick={() => navigate('/shop')}
          className="btn-primary"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <FaBolt className="text-4xl text-yellow-500 mx-auto mb-2" />
        <h1 className="text-2xl font-bold">Express Checkout</h1>
        <p className="text-gray-400">Fast & secure one-click ordering</p>
      </div>

      {/* Express Benefits */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-4 mb-4">
        <div className="flex items-center mb-2">
          <FaShippingFast className="text-white mr-2" />
          <span className="text-white font-bold">Express Benefits</span>
        </div>
        <ul className="text-white text-sm space-y-1">
          <li>• Free express shipping (1-2 days)</li>
          <li>• Priority processing</li>
          <li>• Real-time tracking</li>
          <li>• 24/7 support</li>
        </ul>
      </div>

      {/* Order Items */}
      <div className="card mb-4">
        <h3 className="font-bold mb-3">Your Items</h3>
        {cartItems.map(item => (
          <div key={item._id} className="flex items-center space-x-3 mb-3">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-xs text-gray-400">Qty: {item.qty}</p>
            </div>
            <p className="font-bold">${(item.price * item.qty).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Express Summary */}
      <div className="card mb-4">
        <h3 className="font-bold mb-3">Express Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-primary">
            <span>Express Shipping:</span>
            <span>FREE (Value: $15)</span>
          </div>
          <div className="flex justify-between">
            <span>Processing Fee:</span>
            <span>$0</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-gray-700 pt-2">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Express Actions */}
      <div className="space-y-3">
        <button
          onClick={handleExpressCheckout}
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 flex items-center justify-center"
        >
          <FaBolt className="mr-2" />
          {loading ? 'Processing...' : 'Express Checkout'}
        </button>
        
        <button
          onClick={() => navigate('/placeorder')}
          className="w-full btn-secondary"
        >
          Regular Checkout
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        By using Express Checkout, you agree to our terms and use your default payment method.
      </p>
    </div>
  )
}

export default ExpressCheckout