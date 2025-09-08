import React, { Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/ErrorBoundary';
import Loader from './components/Loader';

// Lazy load components
const Navigation = lazy(() => import('./pages/Auth/Navigation'));
const RealTimeUpdates = lazy(() => import('./components/RealTimeUpdates'));

function App() {
  if (process.env.NODE_ENV === 'development') {
    console.log("API_URL from Vite =>", import.meta.env.VITE_API_URL);
  }

  return (
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
  )
}

export default React.memo(App);
