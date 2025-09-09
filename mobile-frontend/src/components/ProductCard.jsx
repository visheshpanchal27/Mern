import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { useAddToCartMutation } from '../api/apiSlice'
import { FaShoppingCart, FaHeart, FaStar } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useHaptic } from '../hooks/useHaptic'
import ImageCarousel from './ImageCarousel'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const haptic = useHaptic()
  const [addToCart] = useAddToCartMutation()
  const [isFavorite, setIsFavorite] = useState(false)
  
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFavorite(favorites.some(item => item._id === product._id))
  }, [product._id])

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await addToCart({ productId: product._id, quantity: 1 }).unwrap()
      haptic.success()
      toast.success('Added to cart!')
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const handleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      const isAlreadyFavorite = favorites.some(item => item._id === product._id)
      
      if (isAlreadyFavorite) {
        const updated = favorites.filter(item => item._id !== product._id)
        localStorage.setItem('favorites', JSON.stringify(updated))
        setIsFavorite(false)
        toast.info('Removed from favorites!')
      } else {
        const updated = [...favorites, product]
        localStorage.setItem('favorites', JSON.stringify(updated))
        setIsFavorite(true)
        toast.success('Added to favorites!')
      }
      haptic.light()
    } catch (error) {
      toast.error('Failed to update favorites')
    }
  }

  const images = [
    product.image?.startsWith('http') ? product.image : `/api${product.image}`,
    ...(product.images || []).map(img => 
      img.startsWith('http') ? img : `/api${img}`
    )
  ].filter(Boolean)

  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className="card hover:shadow-xl transition-all haptic-feedback">
        <div className="relative">
          <ImageCarousel 
            images={images}
            className="h-40 mb-3"
          />
          <button 
            onClick={handleFavorite}
            className="absolute top-2 right-2 p-2 bg-black/50 rounded-full active:scale-95 transition-transform"
          >
            <FaHeart className={isFavorite ? "text-red-500" : "text-gray-300"} size={14} />
          </button>
          
          {product.countInStock < 5 && product.countInStock > 0 && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              Only {product.countInStock} left
            </div>
          )}
          
          {product.countInStock === 0 && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}
        </div>
        
        <h3 className="font-medium text-sm mb-1 line-clamp-2 leading-tight">{product.name}</h3>
        <div className="flex items-center justify-between mb-2">
          <p className="text-primary font-bold text-lg">${product.price}</p>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-gray-400 text-sm line-through">${product.originalPrice}</span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <FaStar className="text-yellow-400" size={12} />
              <span className="text-gray-400 text-xs ml-1">{product.rating?.toFixed(1) || '0.0'}</span>
            </div>
            <span className="text-gray-500 text-xs">({product.numReviews || 0})</span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className="bg-green-500 p-2 rounded-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed haptic-feedback"
          >
            <FaShoppingCart size={12} />
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard