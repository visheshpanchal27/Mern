import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useGetCartQuery, useClearCartMutation, useCreateOrderMutation } from '../api/apiSlice'
import { FaArrowLeft, FaCheck, FaCreditCard, FaMoneyBillWave, FaShieldAlt, FaTruck } from 'react-icons/fa'

const PlaceOrder = () => {
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoApplied, setPromoApplied] = useState(false)

  const { data: cart, isLoading: cartLoading } = useGetCartQuery()
  const [createOrder, { isLoading }] = useCreateOrderMutation()
  const [clearCart] = useClearCartMutation()

  const cartItems = cart?.items || []
  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}')
  const paymentMethod = localStorage.getItem('paymentMethod') || 'PayPal'

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return
    
    const validCodes = { 'VISHESH': 10, 'INFINITY': 15 }
    const discount = validCodes[promoCode.toUpperCase()]
    
    if (discount) {
      setPromoDiscount(discount)
      setPromoApplied(true)
      toast.success(`Promo code applied! ${discount}% discount`)
    } else {
      toast.error('Invalid promo code')
    }
  }

  const removePromoCode = () => {
    setPromoCode('')
    setPromoDiscount(0)
    setPromoApplied(false)
    toast.info('Promo code removed')
  }

  const priceCalculations = useMemo(() => {
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.product.price, 0)
    const shippingPrice = itemsPrice > 100 ? 0 : 10
    const taxPrice = Number((0.08 * itemsPrice).toFixed(2))
    const discountAmount = promoApplied ? (itemsPrice * promoDiscount / 100) : 0
    const totalPrice = (itemsPrice + shippingPrice + taxPrice - discountAmount).toFixed(2)
    
    return { itemsPrice, shippingPrice, taxPrice, discountAmount, totalPrice }
  }, [cartItems, promoApplied, promoDiscount])
  
  const { itemsPrice, shippingPrice, taxPrice, discountAmount, totalPrice } = priceCalculations

  const placeOrderHandler = useCallback(async () => {
    const { address, city, postalCode, country } = shippingAddress || {}
    if (!address || !city || !postalCode || !country) {
      toast.error('Please complete your shipping address')
      navigate('/shipping')
      return
    }
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    
    setIsProcessing(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const res = await createOrder({
        orderItems: cartItems.map((item) => ({
          _id: item.product._id,
          qty: item.qty,
          price: item.product.price,
          name: item.product.name,
          image: item.product.image,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap()

      setOrderConfirmed(true)
      
      if (paymentMethod === 'PayPal') {
        toast.success('Order created! Redirecting to PayPal...')
        navigate(`/order/${res._id}`)
      } else {
        toast.success('Order placed successfully!')
        navigate(`/order-summary/${res.trackingId}`)
      }
      
      await clearCart().unwrap()
      
    } catch (err) {
      toast.error(err?.data?.error || 'Something went wrong')
      setIsProcessing(false)
    }
  }, [cartItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, createOrder, clearCart, navigate])

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
      <div className="flex items-center p-4 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 mr-3">
          <FaArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-xl font-bold text-white">Place Order</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Order Items */}
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Order Items</h3>
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
                <p className="text-gray-400 text-xs">Qty: {item.qty} × ${item.product.price}</p>
              </div>
              <p className="text-white font-semibold">
                ${(item.qty * item.product.price).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Price Details */}
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Price Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Items ({cartItems.length}):</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Shipping:</span>
              <span className={shippingPrice === 0 ? 'text-green-400' : ''}>
                {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Tax (8%):</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>
            {promoApplied && (
              <div className="flex justify-between text-green-400">
                <span>Discount ({promoDiscount}%):</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-600 pt-2 flex justify-between text-white font-bold">
              <span>Total:</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
            <FaTruck className="text-blue-400" />
            Shipping Address
          </h3>
          {shippingAddress.address ? (
            <div className="text-gray-300 text-sm">
              <p>{shippingAddress.address}</p>
              <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
              <p>{shippingAddress.country}</p>
            </div>
          ) : (
            <button
              onClick={() => navigate('/shipping')}
              className="text-primary text-sm"
            >
              Add shipping address
            </button>
          )}
        </div>

        {/* Payment Method */}
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
            {paymentMethod === 'PayPal' ? 
              <FaCreditCard className="text-blue-400" /> : 
              <FaMoneyBillWave className="text-green-400" />
            }
            Payment Method
          </h3>
          <p className="text-gray-300 text-sm">{paymentMethod}</p>
        </div>

        {/* Promo Code */}
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Promo Code</h3>
          {promoApplied ? (
            <div className="flex items-center justify-between bg-green-500/20 border border-green-500 rounded-lg p-3">
              <span className="text-green-400 font-medium text-sm">
                Code Applied: {promoCode.toUpperCase()}
              </span>
              <button
                onClick={removePromoCode}
                className="text-red-400 text-sm"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="VISHESH, INFINITY"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 input text-sm"
              />
              <button
                onClick={applyPromoCode}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
              >
                Apply
              </button>
            </div>
          )}
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
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheck className="text-green-400" />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        {orderConfirmed ? (
          <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-xl text-center">
            <FaCheck className="mx-auto mb-2 text-xl" />
            <p className="font-semibold">Order Confirmed!</p>
            <p className="text-sm">Redirecting...</p>
          </div>
        ) : (
          <button
            onClick={placeOrderHandler}
            disabled={!shippingAddress.address || isLoading || isProcessing}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                Processing...
              </>
            ) : (
              <>
                <FaCheck />
                Place Order - ${totalPrice}
              </>
            )}
          </button>
        )}

        <p className="text-xs text-gray-500 text-center">
          By placing this order, you agree to our Terms of Service
        </p>
      </div>
    </div>
  )
}

export default PlaceOrder