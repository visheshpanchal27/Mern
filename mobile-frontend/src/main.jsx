import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import App from './App.jsx'
import { store } from './store/store.js'
import { redirectToDesktop, setupDesktopRedirect } from './utils/deviceDetection.js'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'

// Redirect desktop users to main frontend
redirectToDesktop()
setupDesktopRedirect()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer 
          position="top-center"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="dark"
          style={{ fontSize: '14px', width: '280px' }}
          toastStyle={{ padding: '8px 12px', minHeight: '40px' }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)