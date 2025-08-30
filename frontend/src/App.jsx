import {Outlet} from 'react-router-dom'
import Navigation from "./pages/Auth/Navigation";
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ErrorBoundary from './components/ErrorBoundary';
import RealTimeUpdates from './components/RealTimeUpdates';



function App() {
  console.log("API_URL from Vite =>", import.meta.env.VITE_API_URL);

  return (
    <ErrorBoundary>
      <RealTimeUpdates />
      <ToastContainer/>
      <Navigation/>
      <main className="py-3">
        <Outlet/>
      </main>
    </ErrorBoundary>
  )
}

export default App
