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

export const isMobileDevice = () => {
  const device = getDeviceInfo()
  
  // Multiple criteria for mobile detection
  const hasSmallScreen = device.width <= 768 || device.height <= 600
  const hasMobileUA = device.isMobileUA || device.isTabletUA
  const hasTouch = device.touchSupport
  const highPixelRatio = device.pixelRatio > 2
  
  // Mobile if: small screen OR mobile UA OR (touch + high pixel ratio)
  return hasSmallScreen || hasMobileUA || (hasTouch && highPixelRatio)
}

// User preference management
export const getUserPreference = () => localStorage.getItem('devicePreference')
export const setUserPreference = (preference) => localStorage.setItem('devicePreference', preference)
export const clearUserPreference = () => localStorage.removeItem('devicePreference')

// Advanced redirect logic
export const redirectToMobile = () => {
  // Check user preference first
  const userPref = getUserPreference()
  if (userPref === 'desktop') {
    console.log('PC: User prefers desktop, staying')
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
    console.log('PC: Redirect limit reached, staying on desktop')
    return
  }
  
  // Don't redirect on auth pages if user is logged in
  const currentPath = window.location.pathname
  const userInfo = localStorage.getItem('userInfo')
  
  if ((currentPath === '/login' || currentPath === '/register') && userInfo) {
    return
  }
  
  if (isMobileDevice()) {
    // Update redirect tracking
    sessionStorage.setItem('redirectCount', (redirectCount + 1).toString())
    sessionStorage.setItem('lastRedirectTime', now.toString())
    
    console.log('PC: Redirecting to mobile')
    
    // Show advanced loader with preference option
    const loader = document.createElement('div')
    loader.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
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
        ">Switching to mobile view...</p>
        <button id="stayDesktop" style="
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        ">Stay on Desktop</button>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        #stayDesktop:hover {
          background: rgba(255,255,255,0.3);
        }
      </style>
    `
    
    document.body.appendChild(loader)
    
    // Fade in loader
    setTimeout(() => {
      loader.firstElementChild.style.opacity = '1'
    }, 10)
    
    // Auto redirect after delay
    const redirectTimer = setTimeout(() => {
      const fullPath = window.location.pathname + window.location.search
      const mobileUrl = import.meta.env.VITE_MOBILE_URL || 'https://infinity-plaza.netlify.app'
      window.location.replace(`${mobileUrl}${fullPath}`)
    }, 3000) // Increased to 3 seconds for user choice
    
    // Handle stay desktop button
    const stayBtn = loader.querySelector('#stayDesktop')
    stayBtn.onclick = () => {
      clearTimeout(redirectTimer)
      setUserPreference('desktop')
      document.body.removeChild(loader)
      console.log('PC: User chose to stay on desktop')
    }
  }
}

// Advanced resize and orientation handling
let resizeTimeout
let orientationTimeout

export const setupMobileRedirect = () => {
  const handleResize = () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      console.log('PC: Checking mobile redirect, width:', window.innerWidth)
      
      // Skip if user has preference set
      if (getUserPreference() === 'desktop') return
      
      // Don't redirect on auth pages if logged in
      const currentPath = window.location.pathname
      const userInfo = localStorage.getItem('userInfo')
      
      if ((currentPath === '/login' || currentPath === '/register') && userInfo) {
        return
      }
      
      redirectToMobile()
    }, 500) // Longer delay to avoid rapid triggers
  }
  
  const handleOrientationChange = () => {
    clearTimeout(orientationTimeout)
    orientationTimeout = setTimeout(() => {
      console.log('PC: Orientation changed, rechecking device type')
      handleResize()
    }, 1000) // Wait for orientation change to complete
  }
  
  // Listen to multiple events
  window.addEventListener('resize', handleResize)
  window.addEventListener('orientationchange', handleOrientationChange)
  
  // Also check on page visibility change (tab switch)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && getUserPreference() !== 'desktop') {
      setTimeout(handleResize, 100)
    }
  })
}

// Utility to reset preferences (for testing)
export const resetDevicePreferences = () => {
  clearUserPreference()
  sessionStorage.removeItem('redirectCount')
  sessionStorage.removeItem('lastRedirectTime')
  console.log('PC: Device preferences reset')
}