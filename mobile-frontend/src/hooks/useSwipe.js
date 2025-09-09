import { useState, useRef } from 'react'

export const useSwipe = (onSwipeLeft, onSwipeRight, threshold = 50) => {
  const [isSwiping, setIsSwiping] = useState(false)
  const touchStart = useRef(null)
  const touchEnd = useRef(null)

  const onTouchStart = (e) => {
    touchEnd.current = null
    touchStart.current = e.targetTouches[0].clientX
    setIsSwiping(true)
  }

  const onTouchMove = (e) => {
    if (!touchStart.current) return
    touchEnd.current = e.targetTouches[0].clientX
    
    // Only prevent default if we're actually swiping horizontally
    const distance = Math.abs(touchStart.current - touchEnd.current)
    if (distance > 10) {
      e.preventDefault()
    }
  }

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return
    
    const distance = touchStart.current - touchEnd.current
    const isLeftSwipe = distance > threshold
    const isRightSwipe = distance < -threshold

    if (isLeftSwipe && onSwipeLeft) onSwipeLeft()
    if (isRightSwipe && onSwipeRight) onSwipeRight()
    
    setIsSwiping(false)
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isSwiping
  }
}