import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetProductQuery, useAddToCartMutation, useCreateBuyNowOrderMutation } from '../api/apiSlice'
import { FaArrowLeft, FaHeart, FaShare, FaStar, FaPlus, FaMinus } from 'react-icons/fa'
import { toast } from 'react-toastify'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const { userInfo } = useSelector(state => state.auth)
  
  const { data: product, isLoading, error } = useGetProductQuery(id)
  const [addToCart] = useAddToCartMutation()
  const [createBuyNowOrder] = useCreateBuyNowOrderMutation()

  const handleAddToCart = async () => {
    if (!userInfo) {
      toast.error('Please login to add items to cart')
      navigate('/login')
      return
    }
    try {
      await addToCart({ productId: product._id, quantity: qty }).unwrap()
      toast.success(`Added ${qty} item(s) to cart!`)
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const handleBuyNow = async () => {
    if (!userInfo) {
      toast.error('Please login to place order')
      navigate('/login')
      return
    }
    try {
      const orderData = {
        orderItems: [{
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          qty: qty
        }],
        shippingAddress: {
          address: 'Quick Order',
          city: 'Quick Order',
          postalCode: '00000',
          country: 'US'
        },
        paymentMethod: 'Cash on Delivery',
        itemsPrice: product.price * qty,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: product.price * qty
      }
      const order = await createBuyNowOrder(orderData).unwrap()
      toast.success('Order placed successfully!')
      navigate(`/order/${order._id}`)
    } catch (error) {
      toast.error('Failed to place order')
    }
  }

  if (isLoading) {
    return (
      <div className="safe-area-top p-4">
        <div className="animate-pulse">
          <div className="bg-gray-800 h-80 rounded-xl mb-4"></div>
          <div className="bg-gray-800 h-6 rounded mb-2"></div>
          <div className="bg-gray-800 h-4 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="safe-area-top p-4 text-center">
        <p className="text-red-500">Product not found</p>
        <button onClick={() => navigate(-1)} className="btn-primary mt-4">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="safe-area-top">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button onClick={() => navigate(-1)} className="p-2">
          <FaArrowLeft size={20} />
        </button>
        <div className="flex space-x-3">
          <button className="p-2">
            <FaHeart size={20} />
          </button>
          <button className="p-2">
            <FaShare size={20} />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <div className="px-4">
        <img
          src={product.image?.startsWith('http') ? product.image : `/api${product.image}`}
          alt={product.name}
          className="w-full h-80 object-cover rounded-xl"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-1" size={16} />
              <span className="text-sm">{product.rating || 0}</span>
            </div>
            <span className="text-gray-400 text-sm">({product.numReviews || 0} reviews)</span>
          </div>
          <p className="text-3xl font-bold text-primary">${product.price}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{product.description}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Details</h3>
          <div className="space-y-1 text-sm">
            <p><span className="text-gray-400">Brand:</span> {product.brand}</p>
            <p><span className="text-gray-400">In Stock:</span> {product.countInStock}</p>
          </div>
        </div>
      </div>

      {/* Add to Cart Section */}
      <div className="p-4 bg-dark-light border-t border-gray-800 safe-area-bottom">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold">Quantity:</span>
          <div className="flex items-center bg-gray-800 rounded-lg">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="p-3 active:scale-95 transition-transform"
            >
              <FaMinus size={12} />
            </button>
            <span className="px-6 py-3">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="p-3 active:scale-95 transition-transform"
            >
              <FaPlus size={12} />
            </button>
          </div>
        </div>

        <div className="flex space-x-3">
          <button onClick={handleAddToCart} className="btn-secondary flex-1">
            Add to Cart
          </button>
          <button onClick={handleBuyNow} className="btn-primary flex-1">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail