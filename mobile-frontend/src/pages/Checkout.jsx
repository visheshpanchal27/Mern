import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useGetCartQuery, useCreateOrderMutation } from '../api/apiSlice'
import { clearCart } from '../store/cartSlice'
import { FaArrowLeft, FaCreditCard, FaMapMarkerAlt, FaLock, FaCheck, FaTruck } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useHaptic } from '../hooks/useHaptic'

const Checkout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const haptic = useHaptic()
  const { userInfo } = useSelector(state => state.auth)
  const { data: cartData } = useGetCartQuery(undefined, { skip: !userInfo })
  const [createOrder, { isLoading }] = useCreateOrderMutation()

  const [step, setStep] = useState(1)
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'US'
  })
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery')

  const cartItems = cartData?.items || []
  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * (item.product?.price || 0), 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const nextStep = () => {
    if (step === 1) {
      if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
        toast.error('Please fill in all shipping details')
        return
      }
    }
    haptic.light()
    setStep(step + 1)
  }

  const prevStep = () => {
    haptic.light()
    setStep(step - 1)
  }

  const handlePlaceOrder = async () => {
    haptic.success()
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          qty: item.qty
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total
      }

      const order = await createOrder(orderData).unwrap()
      dispatch(clearCart())
      toast.success('🎉 Order placed successfully!')
      navigate(`/order/${order._id}`)
    } catch (error) {
      toast.error('Failed to place order')
    }
  }

  if (!userInfo) {
    navigate('/login')
    return null
  }

  if (cartItems.length === 0) {
    return (
      <div className="safe-area-top p-4 text-center py-20">
        <p className="text-gray-400 mb-6">Your cart is empty</p>
        <button onClick={() => navigate('/shop')} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm border-b border-gray-700">
        <button onClick={step > 1 ? prevStep : () => navigate(-1)} className="p-3 rounded-full bg-gray-800 active:scale-95 transition-transform">
          <FaArrowLeft size={18} />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold">Checkout</h1>
          <p className="text-xs text-gray-400">Step {step} of 3</p>
        </div>
        <div className="w-12"></div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              s <= step ? 'bg-primary text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              {s < step ? <FaCheck size={12} /> : s}
            </div>
          ))}
        </div>
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-pink-500 transition-all duration-500" style={{width: `${(step/3)*100}%`}}></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 p-4">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <FaMapMarkerAlt className="text-primary text-3xl mx-auto mb-2" />
              <h2 className="text-2xl font-bold mb-1">Shipping Address</h2>
              <p className="text-gray-400">Where should we deliver your order?</p>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                  className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                  className="p-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                  className="p-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              
              <select
                value={shippingAddress.country}
                onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="US">🇺🇸 United States</option>
                <option value="CA">🇨🇦 Canada</option>
                <option value="UK">🇬🇧 United Kingdom</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <FaCreditCard className="text-primary text-3xl mx-auto mb-2" />
              <h2 className="text-2xl font-bold mb-1">Payment Method</h2>
              <p className="text-gray-400">Choose your preferred payment option</p>
            </div>
            
            <div className="space-y-3">
              {[
                { value: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
                { value: 'PayPal', icon: '💳', desc: 'Secure online payment' }
              ].map((method) => (
                <label key={method.value} className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === method.value 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                }`}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-2xl mr-3">{method.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{method.value}</div>
                      <div className="text-sm text-gray-400">{method.desc}</div>
                    </div>
                    {paymentMethod === method.value && <FaCheck className="text-primary" />}
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <FaLock className="text-primary text-3xl mx-auto mb-2" />
              <h2 className="text-2xl font-bold mb-1">Review Order</h2>
              <p className="text-gray-400">Confirm your purchase details</p>
            </div>
            
            {/* Order Items */}
            <div className="bg-gray-800/30 rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <FaTruck className="mr-2 text-primary" />
                Items ({cartItems.length})
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {cartItems.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-center text-sm">
                    <img src={(item.product?.image || item.image)?.startsWith('http') ? (item.product?.image || item.image) : `/api${item.product?.image || item.image}`} className="w-8 h-8 rounded object-cover mr-2" />
                    <span className="flex-1 truncate">{item.product?.name}</span>
                    <span className="text-gray-400">×{item.qty}</span>
                  </div>
                ))}
                {cartItems.length > 3 && <p className="text-xs text-gray-400">+{cartItems.length - 3} more items</p>}
              </div>
            </div>
            
            {/* Price Breakdown */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span className={shipping === 0 ? 'text-green-400' : ''}>
                    {shipping === 0 ? 'FREE ✨' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr className="border-gray-600" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div className="p-4 bg-black/50 backdrop-blur-sm border-t border-gray-700">
        {step < 3 ? (
          <button
            onClick={nextStep}
            className="w-full py-4 bg-gradient-to-r from-primary to-pink-500 rounded-xl font-bold text-lg active:scale-95 transition-transform shadow-lg"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handlePlaceOrder}
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-lg disabled:opacity-50 active:scale-95 transition-transform shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `🚀 Place Order - $${total.toFixed(2)}`
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default Checkout