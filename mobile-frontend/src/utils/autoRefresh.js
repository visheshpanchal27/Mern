let refreshInterval = null

export const startAutoRefresh = (intervalMs = 30000) => {
  if (refreshInterval) return
  
  refreshInterval = setInterval(() => {
    if (document.visibilityState === 'visible') {
      window.location.reload()
    }
  }, intervalMs)
}

export const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
}

export const setupAutoRefresh = () => {
  startAutoRefresh()
  
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      startAutoRefresh()
    } else {
      stopAutoRefresh()
    }
  })
}