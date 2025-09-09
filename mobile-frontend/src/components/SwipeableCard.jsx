import { useState } from 'react'
import { useSwipe } from '../hooks/useSwipe'
import { useHaptic } from '../hooks/useHaptic'
import { FaTrash, FaHeart } from 'react-icons/fa'

const SwipeableCard = ({ children, onDelete, onFavorite, className = '' }) => {
  const [swiped, setSwiped] = useState(false)
  const haptic = useHaptic()

  const handleSwipeLeft = () => {
    setSwiped(true)
    haptic.light()
  }

  const handleSwipeRight = () => {
    setSwiped(false)
  }

  const swipeHandlers = useSwipe(handleSwipeLeft, handleSwipeRight)

  const handleDelete = () => {
    haptic.heavy()
    onDelete?.()
  }

  const handleFavorite = () => {
    haptic.medium()
    onFavorite?.()
  }

  return (
    <div className="relative overflow-hidden">
      {/* Action Buttons */}
      <div className="absolute right-0 top-0 h-full flex items-center space-x-2 pr-4 z-10">
        {onFavorite && (
          <button
            onClick={handleFavorite}
            className="bg-yellow-500 p-3 rounded-full active:scale-95 transition-transform"
          >
            <FaHeart className="text-white" size={16} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={handleDelete}
            className="bg-red-500 p-3 rounded-full active:scale-95 transition-transform"
          >
            <FaTrash className="text-white" size={16} />
          </button>
        )}
      </div>

      {/* Swipeable Content */}
      <div
        className={`swipe-action ${swiped ? 'swiped' : ''} ${className}`}
        onTouchStart={swipeHandlers.onTouchStart}
        onTouchMove={swipeHandlers.onTouchMove}
        onTouchEnd={swipeHandlers.onTouchEnd}
      >
        {children}
      </div>
    </div>
  )
}

export default SwipeableCard