import { useState, useRef, useEffect } from 'react'
import { useSwipe } from '../hooks/useSwipe'

const ImageCarousel = ({ images = [], className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef(null)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const swipeHandlers = useSwipe(nextImage, prevImage)

  useEffect(() => {
    const element = carouselRef.current
    if (!element) return

    // Add non-passive event listeners
    element.addEventListener('touchmove', swipeHandlers.onTouchMove, { passive: false })
    
    return () => {
      element.removeEventListener('touchmove', swipeHandlers.onTouchMove)
    }
  }, [swipeHandlers.onTouchMove])

  if (!images.length) return null

  return (
    <div className={`relative ${className}`}>
      <div
        ref={carouselRef}
        className="w-full h-full overflow-hidden rounded-lg"
        onTouchStart={swipeHandlers.onTouchStart}
        onTouchEnd={swipeHandlers.onTouchEnd}
      >
        <img
          src={images[currentIndex]}
          alt={`Product ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <>
          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Image Counter */}
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {currentIndex + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  )
}

export default ImageCarousel