import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaHeart, FaShoppingCart } from 'react-icons/fa'

const Favorites = () => {
  const { userInfo } = useSelector(state => state.auth)
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const loadFavorites = () => {
      try {
        // Use same key as PC version
        const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        setFavorites(savedFavorites)
        console.log('Favorites loaded:', savedFavorites.length)
      } catch (error) {
        console.error('Error loading favorites:', error)
        setFavorites([])
      }
    }

    loadFavorites()

    // Listen for storage changes from PC
    const handleStorageChange = (e) => {
      if (e.key === 'favorites') {
        console.log('Favorites changed from PC, reloading')
        loadFavorites()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const removeFavorite = (productId) => {
    try {
      const updated = favorites.filter(item => item._id !== productId)
      setFavorites(updated)
      // Use same key as PC version
      localStorage.setItem('favorites', JSON.stringify(updated))
      console.log('Favorite removed:', productId)
      
      // Trigger storage event for PC sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'favorites',
        oldValue: JSON.stringify(favorites),
        newValue: JSON.stringify(updated),
        storageArea: localStorage
      }))
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  if (!userInfo) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">Please login to view favorites</p>
        <Link to="/login" className="btn-primary">
          Login
        </Link>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <FaHeart className="text-primary mr-2" />
        My Favorites
      </h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">No favorites yet</p>
          <Link to="/shop" className="btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {favorites.map(product => (
            <div key={product._id} className="card">
              <Link to={`/product/${product._id}`}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                <p className="text-primary font-bold">${product.price}</p>
              </Link>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => removeFavorite(product._id)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
                <FaShoppingCart className="text-green-500" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites