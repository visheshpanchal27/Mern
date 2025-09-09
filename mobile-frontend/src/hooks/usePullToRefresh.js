import { useState, useRef, useCallback } from 'react'

export const usePullToRefresh = (onRefresh, threshold = 60) => {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const currentY = useRef(0)

  const handleTouchStart = useCallback((e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
    }
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (window.scrollY === 0 && startY.current) {
      currentY.current = e.touches[0].clientY
      const distance = Math.max(0, currentY.current - startY.current)
      
      if (distance > 10) {
        e.preventDefault()
        setPullDistance(distance)
        setIsPulling(distance > threshold)
      }
    }
  }, [threshold])

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance > threshold) {
      await onRefresh()
    }
    setPullDistance(0)
    setIsPulling(false)
    startY.current = 0
  }, [pullDistance, threshold, onRefresh])

  return {
    isPulling,
    pullDistance,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  }
}