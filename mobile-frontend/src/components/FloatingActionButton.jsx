import { useState } from 'react'
import { FaPlus, FaSearch, FaHeart, FaShoppingCart } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useHaptic } from '../hooks/useHaptic'

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const haptic = useHaptic()
  const cartItems = useSelector(state => state.cart.items)
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    haptic.light()
  }

  const actions = [
    { icon: FaSearch, label: 'Search', to: '/search', color: 'bg-blue-500' },
    { icon: FaHeart, label: 'Favorites', to: '/favorites', color: 'bg-red-500' },
    { icon: FaShoppingCart, label: 'Cart', to: '/cart', color: 'bg-green-500', badge: cartCount },
  ]

  return (
    <div className="fixed bottom-24 right-4 z-40">
      {/* Action Buttons */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3">
          {actions.map((action, index) => (
            <Link
              key={action.label}
              to={action.to}
              onClick={() => {
                setIsOpen(false)
                haptic.medium()
              }}
              className={`flex items-center justify-center w-12 h-12 ${action.color} rounded-full shadow-lg active:scale-95 transition-all relative`}
              style={{
                animation: `fadeInUp 0.3s ease ${index * 0.1}s both`
              }}
            >
              <action.icon className="text-white" size={20} />
              {action.badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {action.badge > 9 ? '9+' : action.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={toggleMenu}
        className={`w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-all ${
          isOpen ? 'rotate-45' : ''
        }`}
      >
        <FaPlus className="text-white" size={24} />
      </button>
    </div>
  )
}

export default FloatingActionButton