import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useGetCartQuery, useUpdateCartMutation, useClearCartMutation } from '../api/apiSlice'
import { setCartItems, clearCart } from '../store/cartSlice'
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaCreditCard } from 'react-icons/fa'
import { toast } from 'react-toastify'
import SwipeableCard from '../components/SwipeableCard'
import { useHaptic } from '../hooks/useHaptic'
import { useEffect } from 'react'

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const haptic = useHaptic()
  const { userInfo } = useSelector(state => state.auth)
  const { items, total } = useSelector(state => state.cart)
  
  const { data: cartData, isLoading } = useGetCartQuery(undefined, { skip: !userInfo })
  const [updateCart] = useUpdateCartMutation()
  const [clearCartAPI] = useClearCartMutation()

  useEffect(() => {
    if (cartData?.items) {
      dispatch(setCartItems(cartData.items))
    }
  }, [cartData, dispatch])

  const handleRemove = async (id) => {
    try {
      const updatedItems = items
        .filter(item => (item.product?._id || item._id) !== id)
        .map(item => ({ product: item.product?._id || item._id, qty: item.qty }))
      await updateCart(updatedItems).unwrap()
      haptic.medium()
      toast.success('Removed from cart')
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const handleUpdateQty = async (id, qty) => {
    if (qty <= 0) {
      handleRemove(id)
      return
    }
    try {
      const updatedItems = items.map(item => ({
        product: item.product?._id || item._id,
        qty: (item.product?._id || item._id) === id ? qty : item.qty
      }))
      await updateCart(updatedItems).unwrap()
      haptic.light()
    } catch (error) {
      toast.error('Failed to update quantity')
    }
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Cart is empty')
      return
    }
    haptic.success()
    navigate('/shipping')
  }

  const handleClearCart = async () => {
    try {
      await clearCartAPI().unwrap()
      dispatch(clearCart())
      haptic.heavy()
      toast.success('Cart cleared')
    } catch (error) {
      toast.error('Failed to clear cart')
    }
  }

  if (!userInfo) {
    return (
      <div className="safe-area-top p-4 text-center py-20">
        <FaShoppingBag className="mx-auto text-gray-600 mb-4" size={64} />
        <p className="text-gray-400 mb-6">Please login to view your cart</p>
        <Link to="/login" className="btn-primary inline-block">
          Login
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="safe-area-top p-4 text-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-400">Loading cart...</p>
      </div>
    )
  }

  const subtotal = total
  const shipping = total > 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  const finalTotal = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="safe-area-top p-4">
        <h1 className="text-xl font-bold mb-8">Shopping Cart</h1>
        <div className="text-center py-20">
          <FaShoppingBag className="mx-auto text-gray-600 mb-4" size={64} />
          <p className="text-gray-400 mb-6">Your cart is empty</p>
          <Link to="/shop" className="btn-primary inline-block">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="safe-area-top">
      {/* Header */}
      <div className="p-4 bg-dark-light border-b border-gray-800">
        <h1 className="text-xl font-bold">Shopping Cart</h1>
        <p className="text-gray-400 text-sm">{items.length} items</p>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        {items.map(item => (
          <SwipeableCard
            key={item.product?._id || item._id}
            onDelete={() => handleRemove(item.product?._id || item._id)}
            className="border-b border-gray-800"
          >
            <div className="p-4">
              <div className="flex space-x-3">
                <img
                  src={(item.product?.image || item.image)?.startsWith('http') ? (item.product?.image || item.image) : `/api${item.product?.image || item.image}`}
                  alt={item.product?.name || item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.product?.name || item.name}</h3>
                  <p className="text-primary font-bold mb-1">${item.product?.price || item.price}</p>
                  <p className="text-gray-400 text-xs mb-3">Subtotal: ${(item.qty * (item.product?.price || item.price)).toFixed(2)}</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center bg-gray-800 rounded-lg w-fit">
                    <button
                      onClick={() => handleUpdateQty(item.product?._id || item._id, item.qty - 1)}
                      className="p-2 active:scale-95 transition-transform haptic-feedback"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="px-4 py-2 text-sm min-w-[3rem] text-center">{item.qty}</span>
                    <button
                      onClick={() => handleUpdateQty(item.product?._id || item._id, item.qty + 1)}
                      className="p-2 active:scale-95 transition-transform haptic-feedback"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwipeableCard>
        ))}
      </div>

      {/* Checkout Section */}
      <div className="p-4 bg-dark-light border-t border-gray-800 safe-area-bottom">
        {/* Order Summary */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping:</span>
            <span className={shipping === 0 ? 'text-green-400' : ''}>
              {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <hr className="border-gray-600" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-primary">${finalTotal.toFixed(2)}</span>
          </div>
          {shipping > 0 && (
            <p className="text-xs text-gray-400 text-center">
              Add ${(50 - subtotal).toFixed(2)} more for free shipping!
            </p>
          )}
        </div>
        
        <div className="space-y-3">
          <button onClick={handleCheckout} className="btn-primary w-full flex items-center justify-center space-x-2 haptic-feedback">
            <FaCreditCard size={16} />
            <span>Proceed to Checkout</span>
          </button>
          <button
            onClick={handleClearCart}
            className="btn-secondary w-full haptic-feedback"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart