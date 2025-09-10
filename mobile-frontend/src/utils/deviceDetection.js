export const isDesktopDevice = () => {
  const width = window.innerWidth
  const userAgent = navigator.userAgent
  console.log('Mobile app checking desktop:', { width, isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) })
  // If screen is large AND not a mobile device, it's desktop
  return width > 768 && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}

export const redirectToDesktop = () => {
  // Prevent redirect loops
  const hasRedirected = sessionStorage.getItem('hasRedirected')
  if (hasRedirected) return
  
  // Don't redirect on login/register pages ONLY if user is actually logging in
  const currentPath = window.location.pathname
  const userInfo = localStorage.getItem('userInfo')
  
  // If on login/register page but user is logged out, allow redirect
  if ((currentPath === '/login' || currentPath === '/register') && userInfo) {
    console.log('Mobile: Skipping redirect on login/register page (user logged in)')
    return
  }
  
  if (isDesktopDevice()) {
    sessionStorage.setItem('hasRedirected', 'true')
    console.log('Mobile: Redirecting to desktop')
    
    // Show smooth loader
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
          margin: 0;
          opacity: 0.9;
        ">Switching to desktop view...</p>
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
      const desktopUrl = import.meta.env.VITE_DESKTOP_URL || 'https://shopping-canter.netlify.app'
      window.location.replace(`${desktopUrl}${fullPath}`)
    }, 800)
  } else {
    console.log('Mobile: Not redirecting, staying on mobile')
  }
}

// Check on resize
let resizeTimeout
export const setupDesktopRedirect = () => {
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      // Don't redirect on login/register pages ONLY if user is actually logging in
      const currentPath = window.location.pathname
      const userInfo = localStorage.getItem('userInfo')
      
      // If on login/register page but user is logged out, allow redirect
      if ((currentPath === '/login' || currentPath === '/register') && userInfo) {
        return
      }
      
      redirectToDesktop()
    }, 100)
  })
}