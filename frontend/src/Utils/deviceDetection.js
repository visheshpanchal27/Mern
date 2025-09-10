export const isMobileDevice = () => {
  const width = window.innerWidth
  const userAgent = navigator.userAgent
  return width <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}

export const redirectToMobile = () => {
  // Prevent redirect loops
  const hasRedirected = sessionStorage.getItem('hasRedirected')
  if (hasRedirected) return
  
  // Don't redirect on login/register pages ONLY if user is actually logging in
  const currentPath = window.location.pathname
  const userInfo = localStorage.getItem('userInfo')
  
  // If on login/register page but user is logged out, allow redirect
  if ((currentPath === '/login' || currentPath === '/register') && userInfo) {
    return
  }
  
  if (isMobileDevice()) {
    sessionStorage.setItem('hasRedirected', 'true')
    console.log('PC: Redirecting to mobile')
    
    // Show smooth loader
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
          margin: 0;
          opacity: 0.9;
        ">Switching to mobile view...</p>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `
    
    document.body.appendChild(loader)
    
    // Fade in loader
    setTimeout(() => {
      loader.firstElementChild.style.opacity = '1'
    }, 10)
    
    // Redirect after animation
    setTimeout(() => {
      const fullPath = window.location.pathname + window.location.search
      const mobileUrl = import.meta.env.VITE_MOBILE_URL || 'https://infinity-plaza.netlify.app'
      window.location.replace(`${mobileUrl}${fullPath}`)
    }, 800)
  }
}

// Check on resize
let resizeTimeout
export const setupMobileRedirect = () => {
  const handleResize = () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      console.log('Checking mobile redirect, width:', window.innerWidth)
      // Don't redirect on login/register pages ONLY if user is actually logging in
      const currentPath = window.location.pathname
      const userInfo = localStorage.getItem('userInfo')
      
      // If on login/register page but user is logged out, allow redirect
      if ((currentPath === '/login' || currentPath === '/register') && userInfo) {
        return
      }
      
      if (isMobileDevice()) {
        console.log('Redirecting to mobile')
        const fullPath = window.location.pathname + window.location.search
        const mobileUrl = import.meta.env.VITE_MOBILE_URL || 'https://infinity-plaza.netlify.app'
        window.location.replace(`${mobileUrl}${fullPath}`)
      }
    }, 200)
  }
  
  window.addEventListener('resize', handleResize)
  
  // Also check on orientation change for mobile devices
  window.addEventListener('orientationchange', handleResize)
}