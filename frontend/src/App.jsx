import React, { Suspense, lazy, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/ErrorBoundary';
import Loader from './components/Loader';
import AuthCheck from './components/AuthCheck';

// Lazy load components
const Navigation = lazy(() => import('./pages/Auth/Navigation'));
const RealTimeUpdates = lazy(() => import('./components/RealTimeUpdates'));

function App() {
  useEffect(() => {
    // Simple mobile detection and redirect
    const isMobile = () => {
      return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    const redirectToMobile = () => {
      if (isMobile()) {
        const mobileUrl = import.meta.env.VITE_MOBILE_URL || 'https://infinity-plaza.netlify.app';
        const currentPath = window.location.pathname + window.location.search;
        window.location.replace(`${mobileUrl}${currentPath}`);
      }
    };

    // Check on load
    redirectToMobile();

    // Check on resize
    const handleResize = () => {
      setTimeout(redirectToMobile, 500);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (process.env.NODE_ENV === 'development') {
    console.log("API_URL from Vite =>", import.meta.env.VITE_API_URL);
  }

  return (
    <AuthCheck>
      <ErrorBoundary>
        <Suspense fallback={<div />}>
          <RealTimeUpdates />
        </Suspense>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          limit={3}
        />
        <Suspense fallback={<Loader />}>
          <Navigation />
        </Suspense>
        <main className="py-3">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </main>
      </ErrorBoundary>
    </AuthCheck>
  )
}

export default React.memo(App);