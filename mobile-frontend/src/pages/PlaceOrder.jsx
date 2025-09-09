import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaCreditCard, FaPaypal, FaMoneyBillWave } from 'react-icons/fa'

const PlaceOrder = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { cartItems } = useSelector(state => state.cart)
  const { userInfo } = useSelector(state => state.auth)
  const [paymentMethod, setPaymentMethod] = useState('paypal')
  const [loading, setLoading] = useState(false)

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  const shippingPrice = itemsPrice > 100 ? 0 : 10
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2))
  const totalPrice = itemsPrice + shippingPrice + taxPrice

  const placeOrderHandler = async () => {
    if (!userInfo) {
      console.log('User not authenticated, redirecting to login')
      navigate('/login')
      return
    }

    setLoading(true)
    try {
      console.log('Placing order with payment method:', paymentMethod)
      const orderData = {
        orderItems: cartItems,
        shippingAddress: {
          address: '123 Main St',
          city: 'City',
          postalCode: '12345',
          country: 'Country'
        },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
      }
      console.log('Order data:', orderData)

      // Replace with actual API call
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        const order = await response.json()
        console.log('Order placed successfully:', order._id)
        navigate(`/order/${order._id}`)
      } else {
        console.error('Order placement failed:', response.status)
      }
    } catch (error) {
      console.error('Error placing order:', error)
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
      <h1 className="text-2xl font-bold mb-4">Place Order</h1>
      
      {/* Order Items */}
      <div className="card mb-4">
        <h3 className="font-bold mb-3">Order Items</h3>
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

      {/* Payment Method */}
      <div className="card mb-4">
        <h3 className="font-bold mb-3">Payment Method</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <FaPaypal className="text-blue-500 mr-2" />
            PayPal
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <FaCreditCard className="text-green-500 mr-2" />
            Credit Card
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <FaMoneyBillWave className="text-yellow-500 mr-2" />
            Cash on Delivery
          </label>
        </div>
      </div>

      {/* Order Summary */}
      <div className="card mb-4">
        <h3 className="font-bold mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Items:</span>
            <span>${itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>${shippingPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${taxPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-gray-700 pt-2">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={placeOrderHandler}
        disabled={loading}
        className="w-full btn-primary disabled:opacity-50"
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  )
}

export default PlaceOrder