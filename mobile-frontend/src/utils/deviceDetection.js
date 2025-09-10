// Advanced device detection with multiple factors
export const getDeviceInfo = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  const userAgent = navigator.userAgent.toLowerCase()
  const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const pixelRatio = window.devicePixelRatio || 1
  
  return {
    width,
    height,
    userAgent,
    touchSupport,
    pixelRatio,
    isMobileUA: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent),
    isTabletUA: /ipad|tablet|kindle|silk|playbook/i.test(userAgent),
    isDesktopUA: /windows|macintosh|linux/i.test(userAgent) && !/mobile|tablet/i.test(userAgent)
  }
}

export const isDesktopDevice = () => {
  const device = getDeviceInfo()
  
  // Multiple criteria for desktop detection
  const hasLargeScreen = device.width >= 1024 && device.height >= 600
  const hasDesktopUA = device.isDesktopUA
  const noTouchOrLargeTouch = !device.touchSupport || (device.touchSupport && device.width >= 1200)
  const lowPixelRatio = device.pixelRatio <= 2
  
  // Desktop if: large screen + (desktop UA OR (no touch OR large touch screen)) + reasonable pixel ratio
  return hasLargeScreen && (hasDesktopUA || noTouchOrLargeTouch) && lowPixelRatio
}

// User preference management
export const getUserPreference = () => localStorage.getItem('devicePreference')
export const setUserPreference = (preference) => localStorage.setItem('devicePreference', preference)
export const clearUserPreference = () => localStorage.removeItem('devicePreference')

// Advanced redirect logic
export const redirectToDesktop = () => {
  // Check user preference first
  const userPref = getUserPreference()
  if (userPref === 'mobile') {
    console.log('Mobile: User prefers mobile, staying')
    return
  }
  
  // Prevent redirect loops with time-based cooldown
  const lastRedirect = parseInt(sessionStorage.getItem('lastRedirectTime') || '0')
  const redirectCount = parseInt(sessionStorage.getItem('redirectCount') || '0')
  const now = Date.now()
  const cooldownPeriod = 30000 // 30 seconds
  
  // Reset count if cooldown period passed
  if (now - lastRedirect > cooldownPeriod) {
    sessionStorage.setItem('redirectCount', '0')
  }
  
  // Max 3 redirects within cooldown period
  if (redirectCount >= 3 && now - lastRedirect < cooldownPeriod) {
    console.log('Mobile: Redirect limit reached, staying on mobile')
    return
  }
  
  // Don't redirect on auth pages if user is logged in
  const currentPath = window.location.pathname
  const userInfo = localStorage.getItem('userInfo')
  
  if ((currentPath === '/login' || currentPath === '/register') && userInfo) {
    console.log('Mobile: Skipping redirect on auth page (user logged in)')
    return
  }
  
  if (isDesktopDevice()) {
    // Update redirect tracking
    sessionStorage.setItem('redirectCount', (redirectCount + 1).toString())
    sessionStorage.setItem('lastRedirectTime', now.toString())
    
    console.log('Mobile: Redirecting to desktop')
    
    // Show advanced loader with preference option
    const loader = document.createElement('div')
    loader.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
      ">
        <div style="
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255,255,255,0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        "></div>
        <p style="
          color: white;
          font-size: 18px;
          font-weight: 500;
          margin: 0 0 15px 0;
          opacity: 0.9;
        ">Switching to desktop view...</p>
        <button id="stayMobile" style="
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        ">Stay on Mobile</button>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        #stayMobile:hover {
          background: rgba(255,255,255,0.3);
        }
      </style>
    `
    
    document.body.appendChild(loader)
    
    // Handle stay mobile button
    const stayBtn = loader.querySelector('#stayMobile')
    stayBtn.onclick = () => {
      setUserPreference('mobile')
      document.body.removeChild(loader)
      console.log('Mobile: User chose to stay on mobile')
    }
    
    // Fade in loader
    setTimeout(() => {
      loader.firstElementChild.style.opacity = '1'
    }, 10)
    
    // Auto redirect after delay
    const redirectTimer = setTimeout(() => {
      const fullPath = window.location.pathname + window.location.search
      const desktopUrl = import.meta.env.VITE_DESKTOP_URL || 'https://shopping-canter.netlify.app'
      window.location.replace(`${desktopUrl}${fullPath}`)
    }, 3000) // Increased to 3 seconds for user choice
    
    // Clear timer if user chooses to stay
    stayBtn.onclick = () => {
      clearTimeout(redirectTimer)
      setUserPreference('mobile')
      document.body.removeChild(loader)
      console.log('Mobile: User chose to stay on mobile')
    }
  } else {
    console.log('Mobile: Not redirecting, staying on mobile')
  }
}

// Advanced resize and orientation handling
let resizeTimeout
let orientationTimeout

export const setupDesktopRedirect = () => {
  const handleResize = () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      // Skip if user has preference set
      if (getUserPreference() === 'mobile') return
      
      // Don't redirect on auth pages if logged in
      const currentPath = window.location.pathname
      const userInfo = localStorage.getItem('userInfo')
      
      if ((currentPath === '/login' || currentPath === '/register') && userInfo) {
        return
      }
      
      redirectToDesktop()
    }, 500) // Longer delay to avoid rapid triggers
  }
  
  const handleOrientationChange = () => {
    clearTimeout(orientationTimeout)
    orientationTimeout = setTimeout(() => {
      console.log('Mobile: Orientation changed, rechecking device type')
      handleResize()
    }, 1000) // Wait for orientation change to complete
  }
  
  // Listen to multiple events
  window.addEventListener('resize', handleResize)
  window.addEventListener('orientationchange', handleOrientationChange)
  
  // Also check on page visibility change (tab switch)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && getUserPreference() !== 'mobile') {
      setTimeout(handleResize, 100)
    }
  })
}

// Utility to reset preferences (for testing)
export const resetDevicePreferences = () => {
  clearUserPreference()
  sessionStorage.removeItem('redirectCount')
  sessionStorage.removeItem('lastRedirectTime')
  console.log('Mobile: Device preferences reset')
}