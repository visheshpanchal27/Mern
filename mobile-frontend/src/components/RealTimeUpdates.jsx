import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { apiSlice } from '../api/apiSlice'

const RealTimeUpdates = () => {
  const dispatch = useDispatch()
  const lastRefreshRef = useRef(0)
  const REFRESH_COOLDOWN = 10000 // 10 seconds cooldown

  useEffect(() => {
    const handleRefresh = () => {
      const now = Date.now()
      if (now - lastRefreshRef.current > REFRESH_COOLDOWN) {
        dispatch(apiSlice.util.invalidateTags(['Product', 'Order', 'User', 'Category']))
        lastRefreshRef.current = now
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleRefresh()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [dispatch])

  return null
}

export default RealTimeUpdates